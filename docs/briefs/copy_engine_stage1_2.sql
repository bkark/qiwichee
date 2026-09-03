-- ============================================================================
-- MOTEUR DE COPIE — ÉTAPES 1 & 2
-- Destination repo : docs/briefs/copy_engine_stage1_2.sql
--
-- ✅ LANCÉ ET VÉRIFIÉ EN PRODUCTION LE 2026-09-03.
--    Ce fichier est l'ÉTAT APPLIQUÉ, pas une intention. Il ne se relance pas :
--    la section 1 échouerait sur « table already exists ».
--    Il sert de référence et de point de départ pour l'étape 6a (éditeur).
--
-- Étape 1 : artist_accounts        → le lien compte↔artiste qui manquait
-- Étape 2 : artist_locales, site_copy, copy_revisions + RPC de lecture
--
-- ⚠️ LA VERSION À DEUX NIVEAUX DU RPC A ÉCHOUÉ EN TEST (voir §2). La version
--    ci-dessous est celle qui tourne réellement. Corrigée, relancée, vérifiée.
-- ============================================================================


-- ============================================================================
-- SECTION 0 — LIRE LA RUNNING-CONFIG AVANT D'ÉCRIRE
-- ✅ FAIT. Résultats du 2026-09-03 :
--    artists.id = uuid ✓ · les 4 tables n'existaient pas ✓
--    artist_id  = 990b0d38-ffb8-4023-80ef-09c71ff5319a  (slug qiwichee)
--    user_id    = b0841c34-988c-4855-9e31-37c62d6ef3f1  (bassim.karkachi@gmail.com)
--
-- ★ CONSTAT : auth.users MÉLANGE FANS ET ARTISTES. 4 comptes, dont 3 fans
--   arrivés par magic link. AUCUNE COLONNE ne les distingue — c'est
--   précisément le trou que artist_accounts comble. Toute policy RLS demande
--   « existe-t-il une ligne dans artist_accounts ? », JAMAIS « l'utilisateur
--   est-il authentifié ? ».
--
-- ⚠️ LE SQL EDITOR N'AFFICHE QUE LE RÉSULTAT DE LA DERNIÈRE REQUÊTE.
--   Deux `select` collés dans le même onglet ⇒ le premier est perdu sans
--   aucun avertissement. Une requête de vérification = un onglet.
-- ============================================================================

-- Pour re-vérifier plus tard (une par une) :
-- select column_name, data_type from information_schema.columns
--   where table_schema='public' and table_name='artists' order by ordinal_position;
-- select id, slug, name from public.artists;
-- select id, email from auth.users order by created_at;


-- ============================================================================
-- SECTION 1 — DDL  ✅ APPLIQUÉE
-- ============================================================================

begin;

-- ---------------------------------------------------------------------------
-- 1.1 artist_accounts — LE LIEN QUI MANQUAIT
--
-- ★ TABLE DE JOINTURE, PAS UNE COLONNE SUR `artists`.
--   Un artiste peut avoir plusieurs comptes (elle + son aide). Une colonne
--   `owner_user_id` aurait marché aujourd'hui et imposé une migration de toutes
--   les clauses RLS le jour où l'aide arrive. Le cas est DÉJÀ demandé.
--
-- ★★ NOMMÉE artist_accounts, PAS `owners`. `artists` reste l'ancre unique.
--   ⇒ CECI FERME LE CONFLIT owners/artists QUI BLOQUAIT event_engine.sql.
--     Ce fichier crée encore sa propre table `owners` : le corriger pour
--     pointer vers `artists` + is_artist_member() AVANT de le lancer.
-- ---------------------------------------------------------------------------
create table public.artist_accounts (
  artist_id  uuid not null references public.artists(id) on delete cascade,
  user_id    uuid not null references auth.users(id)     on delete cascade,
  role       text not null default 'owner',
  created_at timestamptz not null default now(),
  primary key (artist_id, user_id),
  constraint artist_accounts_role_check check (role in ('owner','editor'))
);

comment on table public.artist_accounts is
  'Lien compte auth ↔ artiste. Plusieurs comptes par artiste (artiste + aide). '
  'auth.users mélange fans et artistes : c''est CETTE table qui distingue.';
comment on column public.artist_accounts.role is
  'owner = tout ; editor = copie et traductions seulement. Ensemble FERMÉ, '
  'contrôlé par la plateforme : ici un check vaut mieux qu''une regex de forme.';

create index artist_accounts_user_idx on public.artist_accounts (user_id);

-- ★ HELPER : la question « ce compte a-t-il ce droit sur cet artiste ? » sera
--   posée par CHAQUE policy RLS future. Elle s'écrit UNE fois.
create or replace function public.is_artist_member(
  p_artist_id uuid,
  p_min_role  text default 'editor'
) returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.artist_accounts aa
    where aa.artist_id = p_artist_id
      and aa.user_id   = auth.uid()
      and (p_min_role = 'editor' or aa.role = 'owner')
  );
$$;


-- ---------------------------------------------------------------------------
-- 1.2 artist_locales — LANGUES ACTIVES PAR ARTISTE
--
-- ★★ DEUX DÉFAUTS DIFFÉRENTS, DEUX COLONNES.
--   is_source   = langue D'ÉCRITURE de l'artiste  → Qiwi Chee : 'en'
--   is_url_root = langue servie à la racine `/`   → Qiwi Chee : 'fr'
--   Elles pointent en sens opposés pour LA PREMIÈRE ARTISTE. Ce n'est pas une
--   généralisation spéculative : c'est le cas réel.
--
-- ★ PAS de check (locale in ('fr','en')) : on valide la FORME (BCP-47), jamais
--   la liste. Même règle que `locale` sur contact_messages et que le téléphone.
-- ---------------------------------------------------------------------------
create table public.artist_locales (
  artist_id    uuid not null references public.artists(id) on delete cascade,
  locale       text not null,
  is_source    boolean not null default false,
  is_url_root  boolean not null default false,
  is_published boolean not null default false,
  created_at   timestamptz not null default now(),
  primary key (artist_id, locale),
  constraint artist_locales_form_check
    check (locale ~ '^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$')
);

-- ★ UNE SEULE source et UNE SEULE racine par artiste — garanti par la base,
--   pas par la discipline applicative.
create unique index artist_locales_one_source_idx
  on public.artist_locales (artist_id) where is_source;
create unique index artist_locales_one_root_idx
  on public.artist_locales (artist_id) where is_url_root;

comment on column public.artist_locales.is_source is
  'Langue dans laquelle l''artiste ÉCRIT. Source de traduction. Qiwi Chee : en.';
comment on column public.artist_locales.is_url_root is
  'Langue servie sur `/`, et PLANCHER DE REPLI (c''est la seule complète). '
  'Indépendante de is_source : Qiwi Chee écrit en EN, le site est FR à la racine.';


-- ---------------------------------------------------------------------------
-- 1.3 site_copy — CE QUI EST EN LIGNE, ET RIEN D'AUTRE
--
-- ★ COUCHE B UNIQUEMENT (7 lignes). Le chrome (117 chaînes) vit dans
--   fr.json/en.json, versionné par git. Aucune lecture DB pour l'afficher.
--   ⇒ COÛT D'UNE LANGUE : A = 117 chaînes, UNE fois pour toute la plateforme.
--     B = 7 lignes, par artiste. C'est ce rapport qui rend l'option
--     internationale vendable plutôt qu'artisanale.
--
-- ★ CETTE TABLE NE CONTIENT QUE DU PUBLIÉ. Brouillons et historique vivent
--   dans copy_revisions. La publication COPIE une révision ici.
--   ⇒ une traduction IA non validée ne PEUT PAS fuiter : le RPC public ne
--     connaît que cette table. Impossibilité structurelle, pas consigne.
-- ---------------------------------------------------------------------------
create table public.site_copy (
  artist_id   uuid not null references public.artists(id) on delete cascade,
  copy_key    text not null,
  locale      text not null,
  value       text not null,
  source_hash text,
  updated_at  timestamptz not null default now(),
  updated_by  uuid references auth.users(id),
  primary key (artist_id, copy_key, locale),
  constraint site_copy_locale_form_check
    check (locale ~ '^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$'),
  constraint site_copy_key_form_check
    check (copy_key ~ '^[a-z][a-z0-9_]*(\.[a-z0-9_]+)*$')
);

comment on column public.site_copy.source_hash is
  'Hash de la valeur SOURCE contre laquelle cette valeur a été relue. '
  'NULL = écrite directement, pas traduite (cas Belgique : deux langues '
  'd''auteur ⇒ aucune obsolescence à calculer). '
  'La péremption est DÉRIVÉE à la lecture, jamais stockée.';


-- ---------------------------------------------------------------------------
-- 1.4 copy_revisions — HISTORIQUE, BROUILLONS ET RETOUR ARRIÈRE
--
-- ★ TABLE EN INSERTION SEULE. Un retour arrière est une ÉCRITURE EN AVANT :
--   republier une ancienne valeur insère une nouvelle révision. On ne supprime
--   jamais, donc l'historique ne peut pas être corrompu par un rollback.
-- ---------------------------------------------------------------------------
create table public.copy_revisions (
  id          bigint generated always as identity primary key,
  artist_id   uuid not null references public.artists(id) on delete cascade,
  copy_key    text not null,
  locale      text not null,
  value       text not null,
  origin      text not null default 'human',
  status      text not null default 'draft',
  source_hash text,
  created_at  timestamptz not null default now(),
  created_by  uuid references auth.users(id),
  constraint copy_revisions_origin_check check (origin in ('human','ai')),
  constraint copy_revisions_status_check check (status in ('draft','published'))
);

create index copy_revisions_lookup_idx
  on public.copy_revisions (artist_id, copy_key, locale, created_at desc);

comment on table public.copy_revisions is
  'Toute proposition atterrit ici AVANT site_copy : brouillon humain, '
  'traduction IA, ou valeur republiée. Insertion seule.';


-- ---------------------------------------------------------------------------
-- 1.5 RLS — ACTIVE, AUCUNE POLICY, AUCUN GRANT. DÉLIBÉRÉ.
--
-- ★ Le chemin de lecture public passe par un RPC security definer (section 2),
--   qui contourne RLS par construction. Aucun grant table n'est donc requis
--   AUJOURD'HUI, et un grant sans policy ne servirait à rien.
-- ★ Les policies + les grants à `authenticated` arriveront AVEC l'éditeur
--   (étape 6a), DANS LA MÊME TRANSACTION. Un grant sans policy ne donne rien ;
--   une policy sans grant renvoie 42501 — et ce 42501 ressemble à une panne
--   d'auth (déjà perdu une soirée dessus sur `fans`).
-- ---------------------------------------------------------------------------
alter table public.artist_accounts enable row level security;
alter table public.artist_locales  enable row level security;
alter table public.site_copy       enable row level security;
alter table public.copy_revisions  enable row level security;

commit;


-- ============================================================================
-- SECTION 2 — RPC DE LECTURE PUBLIQUE  ✅ APPLIQUÉE (VERSION CORRIGÉE)
--
-- ★★★ LA PREMIÈRE VERSION A ÉCHOUÉ, ET LE TEST L'A ATTRAPÉE.
--   Repli à DEUX niveaux : demandé → source. Or source = 'en' et la demande
--   était 'en' ⇒ la chaîne se réduisait à en→en, et AUCUNE ligne EN n'existe.
--   Résultat : ZÉRO ligne. En production, un <h1> vide — indiscernable d'un
--   déploiement cassé.
--
--   ⇒ LE PLANCHER DE REPLI EST LA LANGUE PUBLIÉE, PAS LA LANGUE D'ÉCRITURE.
--     is_source dit d'où VIENT le contenu ; is_url_root est la seule dont on
--     garantit qu'elle EXISTE. Une chaîne de repli qui s'arrête à la source
--     rend zéro pendant toute la fenêtre entre « l'artiste a déclaré sa langue
--     d'écriture » et « l'artiste l'a écrite » — c'est-à-dire à CHAQUE
--     onboarding.
--
--   TROIS NIVEAUX : demandé → source → url_root.
-- ============================================================================

begin;

-- ★ `create or replace` suffit ici : LA SIGNATURE NE CHANGE PAS, donc pas de
--   `drop`, donc l'ACL survit. (À comparer au champ téléphone : là, la
--   signature changeait, le drop emportait les grants, et il fallait
--   re-granter dans la même transaction.)
create or replace function public.get_site_copy(
  p_artist_slug text,
  p_locale      text
) returns table (
  copy_key        text,
  copy_value      text,
  resolved_locale text
)
language sql
stable
security definer
set search_path = public
as $$
  with a as (
    select id from public.artists where slug = p_artist_slug
  ),
  pref as (
    select al.locale,
           case when al.locale = p_locale then 0
                when al.is_source            then 1
                when al.is_url_root          then 2
                else 3
           end as rank
    from public.artist_locales al
    join a on a.id = al.artist_id
  )
  select distinct on (sc.copy_key)
         sc.copy_key,
         sc.value,
         sc.locale
  from public.site_copy sc
  join a    on a.id = sc.artist_id
  join pref p on p.locale = sc.locale
  order by sc.copy_key, p.rank;
$$;

-- ★ Colonnes de sortie PRÉFIXÉES (copy_key, copy_value) : un `returns table`
--   dont un nom entre en collision avec une colonne de la requête donne une
--   erreur illisible. (Cf. `position`, learning 12.)

revoke all on function public.get_site_copy(text, text) from public;
grant execute on function public.get_site_copy(text, text) to anon, authenticated;

commit;


-- ============================================================================
-- SECTION 3 — AMORÇAGE  ✅ APPLIQUÉE
-- ★ Apostrophes COURBES ’ dans les valeurs : aucun échappement SQL nécessaire,
--   et c'est ce que le site affiche. (Les doubler en droites '' aurait stocké
--   la mauvaise typographie — piège évité, pas corrigé après coup.)
-- ============================================================================

begin;

insert into public.artist_accounts (artist_id, user_id, role)
values ('990b0d38-ffb8-4023-80ef-09c71ff5319a',
        'b0841c34-988c-4855-9e31-37c62d6ef3f1', 'owner');

-- ⚠️ EN est is_source (elle écrit mieux en anglais), FR est is_url_root
--    (le site reste français à la racine). NE PAS INTERVERTIR.
--    is_published : EN reste false tant que les 7 clés ne sont pas traduites.
insert into public.artist_locales (artist_id, locale, is_source, is_url_root, is_published)
values
  ('990b0d38-ffb8-4023-80ef-09c71ff5319a', 'fr', false, true,  true),
  ('990b0d38-ffb8-4023-80ef-09c71ff5319a', 'en', true,  false, false);

-- ★ source_hash reste NULL : ces phrases ont été ÉCRITES en français, elles ne
--   traduisent rien. Elles seront ré-estampillées quand la version anglaise
--   d'auteur existera. Un hash inventé ici mentirait sur ce qui a été relu.
insert into public.site_copy (artist_id, copy_key, locale, value) values
  ('990b0d38-ffb8-4023-80ef-09c71ff5319a', 'meta.description', 'fr',
   'Autrice-compositrice-interprète indépendante, basée à Paris. Pop alternative franco-algérienne-américaine, en français et en anglais.'),
  ('990b0d38-ffb8-4023-80ef-09c71ff5319a', 'hero.tagline', 'fr',
   'Autrice-compositrice-interprète indépendante. Pop alternative, en français et en anglais.'),
  ('990b0d38-ffb8-4023-80ef-09c71ff5319a', 'hero.genre', 'fr',
   'Pop alternative'),
  ('990b0d38-ffb8-4023-80ef-09c71ff5319a', 'contact.meta.description', 'fr',
   'Contacter Qiwi Chee — booking, presse, collaborations. Autrice-compositrice-interprète indépendante basée à Paris.'),
  ('990b0d38-ffb8-4023-80ef-09c71ff5319a', 'atelier.gate.invitation', 'fr',
   'Entre dans l’Atelier — les versions inédites, l’accès en avant-première aux mini-concerts, et ton mot à dire sur la suite. C’est ici, pas sur Spotify.'),
  ('990b0d38-ffb8-4023-80ef-09c71ff5319a', 'atelier.insider.clip.title', 'fr',
   'Concert privé — clip Atelier'),
  ('990b0d38-ffb8-4023-80ef-09c71ff5319a', 'atelier.insider.caption', 'fr',
   'Un extrait qui n’existe nulle part ailleurs.');

commit;


-- ============================================================================
-- SECTION 4 — VÉRIFICATION
-- ============================================================================

-- 4.1 ✅ VÉRIFIÉ 2026-09-03 : 7 lignes, resolved_locale = 'fr'
select * from public.get_site_copy('qiwichee', 'fr');

-- 4.2 ✅ VÉRIFIÉ 2026-09-03 (APRÈS CORRECTION) : 7 lignes, resolved_locale = 'fr'
--     ⛔ La version à deux niveaux rendait ZÉRO ici. C'est CE test qui l'a vue,
--        avant qu'une seule page ne lise la base.
select * from public.get_site_copy('qiwichee', 'en');

-- 4.3 artiste inconnu → ZÉRO ligne (une absence, pas une erreur)
select * from public.get_site_copy('nexiste-pas', 'fr');

-- 4.4 ★ REFUS : deux sources pour un même artiste
--     ATTENDU : erreur unique constraint artist_locales_one_source_idx
-- insert into public.artist_locales (artist_id, locale, is_source)
-- values ('990b0d38-ffb8-4023-80ef-09c71ff5319a', 'es', true);
--     Puis PROUVER L'ABSENCE — le retour dit ce qu'il prétend, la table dit ce qui est :
-- select locale, is_source from public.artist_locales
--   where artist_id = '990b0d38-ffb8-4023-80ef-09c71ff5319a';
--     ATTENDU : 2 lignes (fr, en). Pas de 'es'.

-- 4.5 ★ REFUS : locale malformée → artist_locales_form_check
-- insert into public.artist_locales (artist_id, locale)
-- values ('990b0d38-ffb8-4023-80ef-09c71ff5319a', 'Français');

-- 4.6 ★ REFUS : clé malformée → site_copy_key_form_check
-- insert into public.site_copy (artist_id, copy_key, locale, value)
-- values ('990b0d38-ffb8-4023-80ef-09c71ff5319a', 'Hero Tagline', 'fr', 'x');

-- 4.7 le helper répond correctement (connecté comme owner)
-- select public.is_artist_member('990b0d38-ffb8-4023-80ef-09c71ff5319a', 'owner');

-- ⚠️ 4.8 — TEST NON ENCORE POSSIBLE, À FAIRE À LA PREMIÈRE LIGNE ANGLAISE :
--   le niveau 0 du repli (« la locale demandée gagne ») est garanti par le
--   `rank`, mais N'A PAS ÉTÉ PROUVÉ PAR UN CAS RÉEL — aucune ligne EN n'existe.
--   DÈS QU'UNE SEULE CLÉ EST TRADUITE : relancer get_site_copy('qiwichee','en')
--   et vérifier que CETTE clé passe à resolved_locale='en' pendant que les six
--   autres restent 'fr'. Tant que ce test n'est pas passé, le classement est
--   une affirmation, pas une preuve.


-- ============================================================================
-- SECTION 5 — ANNULATION COMPLÈTE (aucune table existante n'a été touchée)
-- ============================================================================
-- begin;
-- drop function if exists public.get_site_copy(text, text);
-- drop function if exists public.is_artist_member(uuid, text);
-- drop table if exists public.copy_revisions;
-- drop table if exists public.site_copy;
-- drop table if exists public.artist_locales;
-- drop table if exists public.artist_accounts;
-- commit;


-- ============================================================================
-- CE QUI N'EST PAS DANS CE SCRIPT, ET POURQUOI
--
-- · TRADUCTIONS DE bio_blocks — la forme réelle de bio_blocks (clé primaire,
--   colonnes exactes) n'a pas été relue dans information_schema. On ne devine
--   pas une FK. Script séparé, après lecture.
-- · POLICIES RLS + GRANTS — arrivent AVEC l'éditeur, dans la même transaction.
-- · RPC D'ÉCRITURE (publish_copy, propose_revision) — étape 6a.
-- · LES 4 LIBELLÉS DE PALIER — parqués avec le chantier LADDER (règle épicène
--   non résolue ; ne pas expédier une violation dans une table éditable).
-- · LES 9 CHAÎNES « A AVEC UN PARAMÈTRE » ({artist}, {genre}) — elles vont
--   dans fr.json/en.json, pas ici. Un gabarit A peut interpoler une valeur B :
--   `{artist} — {genre}` lit artists.name ET site_copy. La fonction de lecture
--   côté app doit résoudre cette imbrication (à prévoir à l'étape 4).
-- ============================================================================
