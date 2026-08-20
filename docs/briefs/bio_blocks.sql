-- =============================================================================
-- bio_blocks.sql — module BIO (carrousel web + source du press kit)
-- Repo path: docs/briefs/bio_blocks.sql
-- Écrit 2026-08-20. ⛔ NON LANCÉ tant que Bassim n'a pas relu.
-- =============================================================================
--
-- CE QUE FAIT CE FICHIER
--   1. Crée `artists` — la table d'ancrage multi-tenant. Première application réelle
--      de la décision « UN SEUL PROJET SUPABASE, LES ARTISTES SONT DES LIGNES ».
--   2. Crée `bio_blocks` — des couples texte/photo, ordonnés à la main.
--   3. Crée `get_bio_blocks()` — la SEULE porte de lecture. Aucun accès direct.
--
-- POURQUOI UNE TABLE ET PAS UN FICHIER .ts COMME releases.ts
--   Parce que l'artiste doit pouvoir en ajouter un après chaque concert, sans
--   déploiement. Un fichier .ts exige un développeur ; une table exige un formulaire.
--
-- POURQUOI UN RPC ET PAS UNE LECTURE DE TABLE
--   Règle permanente : anon n'a de grant sur AUCUNE table applicative.
--   Mais il y a une raison plus forte ici : LE RPC PORTE LA BARRIÈRE DE DROITS.
--   Un bloc dont le droit correspondant à l'usage demandé est faux n'est jamais
--   renvoyé. Le rendu press kit ne PEUT PAS publier une photo non autorisée —
--   ce n'est pas une consigne, c'est une impossibilité.
--   (Télécom : on filtre sur le routeur, pas sur le poste client.)
-- =============================================================================


-- =============================================================================
-- 1. TABLE D'ANCRAGE MULTI-TENANT
-- =============================================================================
-- Toutes les tables créées à partir d'aujourd'hui pointent ici.
-- `fans` devra être migrée pour la rejoindre (chantier séparé, déjà listé).

create table if not exists public.artists (
  id          uuid        primary key default gen_random_uuid(),
  slug        text        not null unique,   -- machine : minuscules, tirets, PAS d'apostrophe
  name        text        not null,          -- affichage : apostrophe courbe autorisée
  created_at  timestamptz not null default now()
);

alter table public.artists enable row level security;

-- Aucun grant client. La lecture publique passe par le RPC, comme tout le reste.
revoke all on table public.artists from anon, authenticated;


-- =============================================================================
-- 2. BLOCS DE BIO
-- =============================================================================

create table if not exists public.bio_blocks (
  id          uuid        primary key default gen_random_uuid(),

  -- TENANT — non nullable dès la première ligne. C'est la leçon de `fans`.
  artist_id   uuid        not null references public.artists(id) on delete cascade,

  slug        text        not null,   -- machine
  sort_order    int         not null,   -- ordre choisi par l'artiste, PAS une date

  title       text        not null,   -- affichage
  body        text        not null,   -- affichage

  -- IMAGES ------------------------------------------------------------------
  image_path      text    not null,   -- version web optimisée
  image_hd_path   text,               -- original imprimable, null tant qu'il manque
  image_alt       text    not null,   -- ⚠️ NOT NULL VOLONTAIRE.
                                      -- Le seul moment où l'alt est gratuit, c'est
                                      -- maintenant. Rétrofiter 40 alt ne se fait jamais.

  -- DROITS ------------------------------------------------------------------
  -- ⚠️ DEUX booléens, pas un. Les droits ne sont pas un état de la photo, ils sont
  -- un état PAR USAGE. Un booléen unique force à choisir entre bloquer le web
  -- (alors qu'il est accordé) et autoriser la presse (alors qu'elle ne l'est pas).
  -- Ce bug ne plante pas — il publie. C'est le pire type.
  credits                 jsonb   not null default '[]'::jsonb,  -- [{role, name}]
  rights_web_confirmed    boolean not null default false,
  rights_press_confirmed  boolean not null default false,
  rights_note             text,   -- qui, quand, comment. Même pour un accord oral.

  -- DIFFUSION ---------------------------------------------------------------
  -- `usage_scope` et non `usage` : `usage` est un mot-clé Postgres (grant usage).
  -- Ça passerait, mais l'ambiguïté de lecture ne rapporte rien.
  usage_scope text    not null default 'both'
              check (usage_scope in ('web', 'presskit', 'both')),

  is_published boolean not null default false,

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  unique (artist_id, slug),
  unique (artist_id, sort_order) deferrable initially deferred
  -- deferrable : sans ça, réordonner deux blocs échoue au milieu de la transaction.
);

create index if not exists bio_blocks_artist_sort_order_idx
  on public.bio_blocks (artist_id, sort_order);

alter table public.bio_blocks enable row level security;

revoke all on table public.bio_blocks from anon, authenticated;


-- =============================================================================
-- 3. LA PORTE DE LECTURE
-- =============================================================================
-- p_usage vaut 'web' ou 'presskit'. Le droit vérifié dépend de l'usage demandé.

create or replace function public.get_bio_blocks(
  p_artist_slug text,
  p_usage       text default 'web'
)
returns table (
  slug          text,
  sort_order      int,
  title         text,
  body          text,
  image_path    text,
  image_hd_path text,
  image_alt     text,
  credits       jsonb
)
language sql
stable
security definer
set search_path = public
as $$
  select b.slug, b.sort_order, b.title, b.body,
         b.image_path, b.image_hd_path, b.image_alt, b.credits
  from public.bio_blocks b
  join public.artists a on a.id = b.artist_id
  where a.slug = p_artist_slug
    and b.is_published
    and (b.usage_scope = 'both' or b.usage_scope = p_usage)
    and case p_usage
          when 'web'      then b.rights_web_confirmed
          when 'presskit' then b.rights_press_confirmed
          else false                       -- usage inconnu => rien. Échec fermé.
        end
  order by b.sort_order;
$$;

revoke all on function public.get_bio_blocks(text, text) from public;
grant execute on function public.get_bio_blocks(text, text) to anon, authenticated;


-- =============================================================================
-- 4. SEED
-- =============================================================================

insert into public.artists (slug, name)
values ('qiwichee', 'Qiwi Chee')
on conflict (slug) do nothing;

-- Photos : Maëlys Jibidar.
-- Usage WEB confirmé oralement (2026-08). Usage PRESSE non encore demandé.
-- Les fichiers actuels plafonnent à 1600 px (compression WhatsApp) : suffisant
-- pour l'écran, insuffisant pour l'impression. image_hd_path reste null.

insert into public.bio_blocks
  (artist_id, slug, sort_order, title, body,
   image_path, image_alt, credits,
   rights_web_confirmed, rights_press_confirmed, rights_note,
   usage_scope, is_published)
select a.id, v.slug, v.sort_order, v.title, v.body,
       v.image_path, v.image_alt,
       '[{"role":"photo","name":"Maëlys Jibidar"}]'::jsonb,
       true, false,
       'Usage web confirmé oralement par Maëlys Jibidar, août 2026. Usage presse et fichiers haute définition demandés par mail, en attente.',
       v.usage_scope, true
from public.artists a
cross join (values

  ('qui-je-suis', 1,
   'Qiwi Chee',
   'J’écris, je compose, je chante. Pop alternative, artiste indépendante. Tout ce que vous entendez a été décidé ici, pas ailleurs.',
   '/bio/bio-01-portrait-eau.jpg',
   'Qiwi Chee allongée dans une eau claire, les cheveux déployés autour du visage, fard à paupières bleu vif, des fleurs jaunes et roses flottant à la surface.',
   'both'),

  ('entre-quatre-villes', 2,
   'Entre quatre villes',
   'Honolulu, San Diego, Alger, Paris. Quatre endroits qui n’ont rien à voir et qui tiennent ensemble quelque part dans ma musique. Je fais passer des choses d’une rive à l’autre.',
   '/bio/bio-02-portrait-mousse.jpg',
   'Le visage de Qiwi Chee émergeant d’une eau bleue couverte de mousse, le regard tourné vers l’objectif, deux fleurs jaunes flottant de part et d’autre.',
   'both'),

  ('britney-et-elliott', 3,
   'Britney et Elliott',
   'Britney Spears d’un côté, Elliott Smith de l’autre. On me dit que ça ne va pas ensemble. C’est exactement là que j’écris.',
   '/bio/bio-03-baignoire.jpg',
   'Qiwi Chee assise sur le rebord d’une baignoire dans une salle de bain carrelée de blanc et de bleu, pull rayé orange et turquoise, la joue posée dans la main.',
   'both'),

  ('ce-que-je-n-aime-pas', 4,
   'Ce que je n’aime pas',
   'L’hiver. Le chocolat. La vaisselle. Le jardinage. Les lâches. Et l’injustice — celle-là, sans rire.',
   '/bio/bio-04-grimace.jpg',
   'Qiwi Chee penchée en avant, lunettes bleues sur le nez et lunettes orange relevées sur la tête, tirant la langue à l’objectif.',
   'web'),

  ('ce-que-j-aime', 5,
   'Ce que j’aime',
   'L’été, le patin à glace, la cuisine algérienne, les sodas, Hello Kitty, les jeux vidéo, les dessins animés. Mes amis. Les animaux.',
   '/bio/bio-05-sourire.jpg',
   'Qiwi Chee riant largement, une rosette bleue épinglée sur son pull rayé, appuyée sur le rebord d’un lavabo.',
   'web'),

  ('avant-il-y-a-eu-boston', 6,
   'Avant, il y a eu Boston',
   'J’ai travaillé au zoo de Boston, à m’occuper des animaux. Je ne sais pas encore ce que ça a laissé dans ma façon de chanter. Mais il y a quelque chose.',
   '/bio/bio-06-miroir.jpg',
   'Qiwi Chee de dos face à un miroir encadré de bleu, son reflet la montrant en train de rire et de se pincer la joue.',
   'both'),

  ('une-derniere-chose', 7,
   'Une dernière chose',
   'Une guitare, un saxo, et un cerf-volant quand il y a du vent. Le reste s’invente en route.',
   '/bio/bio-07-post-it.jpg',
   'Qiwi Chee de dos devant un miroir, son reflet le menton posé dans les mains ; sur la glace, deux post-it portent les mots « une dernière chose » et « Qiwi Chee », et les lettres autocollantes QIWI CHEE sont collées sur le lavabo.',
   'web')

) as v(slug, sort_order, title, body, image_path, image_alt, usage_scope)
where a.slug = 'qiwichee'
on conflict (artist_id, slug) do nothing;


-- =============================================================================
-- VÉRIFICATION APRÈS EXÉCUTION (le chemin heureux seul ne prouve rien)
--
--   select count(*) from public.get_bio_blocks('qiwichee', 'web');
--     -> 7
--
--   select count(*) from public.get_bio_blocks('qiwichee', 'presskit');
--     -> 0    ✅ la barrière de droits fonctionne : la presse n'est pas accordée.
--             Quand Maëlys répond, passer rights_press_confirmed à true sur les
--             blocs en usage_scope 'both' → ce compteur passera à 4.
--
--   select count(*) from public.get_bio_blocks('inconnu', 'web');
--     -> 0    ✅ pas de fuite inter-artistes.
--
--   select * from public.bio_blocks;
--     -> doit ÉCHOUER en 42501 depuis le client (anon comme authenticated).
--        Si ça renvoie des lignes, un grant a fui : corriger avant de continuer.
-- =============================================================================
