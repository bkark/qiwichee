-- ============================================================================
-- CATALOGUE — RELEASES & SONGS (schéma chanson-d'abord)
-- Destination repo : docs/briefs/catalogue_songs.sql
-- À LANCER DANS LE DASHBOARD SUPABASE. PAS via Claude Code.
--
-- POURQUOI MAINTENANT : `releases.ts` est un const en dur. Ajouter la nouvelle
-- chanson = une édition + un déploiement. Et on veut UNE DIAPO PAR CHANSON —
-- ce n'est pas un changement d'affichage, c'est un autre modèle de données.
-- Extraire la forme actuelle puis la remodeler coûterait deux migrations.
--
-- ⚠️ NE RIEN LANCER AVANT LA SECTION 0.
-- ============================================================================


-- ============================================================================
-- SECTION 0 — RUNNING-CONFIG (une requête par onglet — le SQL Editor n'affiche
-- que la dernière)
-- ============================================================================

-- 0.1 — aucune des tables n'existe déjà ?
select table_name from information_schema.tables
where table_schema='public'
  and table_name in ('releases','songs','release_translations','song_translations');
-- ATTENDU : ZÉRO LIGNE.

-- 0.2 — l'ancre artiste (rappel : artist_id = 990b0d38-ffb8-4023-80ef-09c71ff5319a)
select id, slug, name from public.artists;

-- 0.3 — le bucket de stockage existe-t-il ?
select id, name, public from storage.buckets;
-- Si aucun bucket 'audio' : le créer AU DASHBOARD (Storage → New bucket),
-- nom `audio`, PUBLIC. Un bucket privé imposerait des URLs signées côté serveur
-- pour chaque lecture — inutile pour un flux qu'on veut justement libre d'accès.


-- ============================================================================
-- SECTION 1 — DDL
-- ============================================================================

begin;

-- ---------------------------------------------------------------------------
-- 1.1 releases — L'ALBUM / LE SINGLE, comme CONTEXTE
--
-- ★ `type` EST UN ÉNUMÉRÉ DE PLATEFORME, PAS DE LA COPIE.
--   « Single » / « Album » / « EP » se traduisent UNE FOIS dans fr.json pour tous
--   les artistes. Les mettre en texte libre obligerait chaque artiste à
--   re-traduire un mot que la plateforme connaît déjà.
--   (C'est la moitié A de « Single — clip officiel ». L'autre moitié est le
--    descriptor, qui lui est de la couche C.)
-- ---------------------------------------------------------------------------
create table public.releases (
  id           uuid primary key default gen_random_uuid(),
  artist_id    uuid not null references public.artists(id) on delete cascade,
  slug         text not null,
  title        text not null,
  type         text not null,
  released_on  date,
  artwork_path text,
  artwork_alt  text,
  buy_url      text,
  sort_order   integer not null default 0,
  is_published boolean not null default false,
  created_at   timestamptz not null default now(),
  unique (artist_id, slug),
  constraint releases_type_check check (type in ('album','ep','single')),
  constraint releases_slug_form_check check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

comment on column public.releases.artwork_path is
  'Chemin dans le bucket Storage. Sert de REPLI pour toute chanson sans visuel '
  'propre — c''est ce qui permet d''ajouter une vidéo chanson par chanson plus tard.';
comment on column public.releases.buy_url is
  'Bandcamp. Le flux est chez nous, l''ACHAT reste chez elle : on remplace le '
  'lecteur, pas le canal de vente.';


-- ---------------------------------------------------------------------------
-- 1.2 songs — L'UNITÉ RÉELLE DU SITE
--
-- ★★ UNE DIAPO PAR CHANSON. Aujourd'hui Hybrid Fruit est UNE diapo et les gens
--   écoutent la piste 1. Six diapos = six occasions d'être découverte.
--   ⇒ La table est chanson-d'abord ; `releases` n'est plus que le contexte.
--
-- ★ TROIS CHEMINS MÉDIA, DANS CET ORDRE DE PRÉFÉRENCE À LA LECTURE :
--   1. audio_path      → NOTRE lecteur, nos contrôles, notre pause visible
--   2. media_provider  → iframe tiers (YouTube pour les clips, Bandcamp en repli)
--   3. rien            → pochette seule, pas de lecture
--   ★ C'EST LE POINT DE TOUTE L'OPÉRATION : dans l'iframe Bandcamp, la pause
--     n'est pas lisible et on ne peut RIEN y faire — le contenu est cross-origin,
--     son état nous est invisible. La seule issue est de ne plus dépendre de leur
--     lecteur pour l'écoute. On peut donc migrer CHANSON PAR CHANSON, sans
--     big-bang : tant qu'audio_path est null, le comportement actuel demeure.
-- ---------------------------------------------------------------------------
create table public.songs (
  id             uuid primary key default gen_random_uuid(),
  artist_id      uuid not null references public.artists(id) on delete cascade,
  release_id     uuid references public.releases(id) on delete set null,
  slug           text not null,
  title          text not null,
  track_no       integer,
  sort_order     integer not null default 0,

  -- média tiers (forme identique à MediaAsset côté app)
  media_provider text,
  media_asset_id text,
  media_type     text,

  -- audio auto-hébergé (Supabase Storage)
  audio_path     text,
  duration_s     integer,

  -- visuel propre, sinon repli sur releases.artwork_path
  artwork_path   text,
  artwork_alt    text,

  -- barrière de droits, PAR USAGE
  rights_stream_confirmed boolean not null default false,
  rights_note             text,

  is_published   boolean not null default false,
  created_at     timestamptz not null default now(),
  unique (artist_id, slug),
  constraint songs_slug_form_check check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  constraint songs_provider_check
    check (media_provider is null or media_provider in ('youtube','bandcamp')),
  -- ★ un provider sans identifiant est une ligne à moitié écrite : elle passe
  --   les types et casse à l'affichage. La base refuse la moitié.
  constraint songs_media_pair_check
    check ((media_provider is null) = (media_asset_id is null))
);

comment on column public.songs.audio_path is
  'MP3 128–160 kbps dans le bucket `audio`. PAS le master : le flux gratuit doit '
  'donner envie d''acheter, pas remplacer l''achat.';
comment on column public.songs.rights_stream_confirmed is
  'DIFFUSER UN FICHIER DEPUIS NOTRE DOMAINE N''EST PAS INTÉGRER LE LECTEUR D''UN '
  'TIERS. Confirmation explicite requise par chanson — Dilemma vient du catalogue '
  'LEILANI et peut relever d''un autre accord. Barrière DANS LE RPC : ce bug-là ne '
  'planterait pas, IL DIFFUSERAIT. (Même famille que rights_web_confirmed.)';
comment on column public.songs.slug is
  'Sert d''ancre : /#lullabies ouvre le carrousel SUR cette chanson. C''est le lien '
  'qu''on met dans le mail d''annonce et que les gens partagent.';

create index songs_release_idx on public.songs (release_id, track_no);


-- ---------------------------------------------------------------------------
-- 1.3 TRADUCTIONS — UNE LIGNE PAR (objet, langue)
--
-- ★ LE TITRE NE SE TRADUIT PAS. « Lullabies » reste « Lullabies ».
--   Le DESCRIPTOR, si : « clip officiel » / « official video ».
--   ⇒ deux tables minces, pas de colonnes _fr/_en (elles marchent à deux langues
--     et coûtent un ALTER + un déploiement à la troisième).
-- ---------------------------------------------------------------------------
create table public.release_translations (
  release_id  uuid not null references public.releases(id) on delete cascade,
  locale      text not null,
  descriptor  text,
  source_hash text,
  updated_at  timestamptz not null default now(),
  primary key (release_id, locale),
  constraint release_tr_locale_form check (locale ~ '^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$')
);

create table public.song_translations (
  song_id     uuid not null references public.songs(id) on delete cascade,
  locale      text not null,
  descriptor  text,
  source_hash text,
  updated_at  timestamptz not null default now(),
  primary key (song_id, locale),
  constraint song_tr_locale_form check (locale ~ '^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$')
);

alter table public.releases             enable row level security;
alter table public.songs                enable row level security;
alter table public.release_translations enable row level security;
alter table public.song_translations    enable row level security;
-- RLS active, aucune policy : la lecture publique passe par le RPC ci-dessous.
-- Policies + grants arriveront AVEC l'écriture, dans la même transaction.

commit;


-- ============================================================================
-- SECTION 2 — RPC DE LECTURE
-- ============================================================================

begin;

-- ★ MÊME REPLI DE LANGUE QUE get_site_copy : demandé → source → url_root.
--   Le plancher est la langue PUBLIÉE, jamais la langue d'écriture (elle peut
--   être vide pendant tout un onboarding).
-- ★ LA BARRIÈRE DE DROITS EST ICI, PAS DANS LE CLIENT : audio_path n'est rendu
--   que si rights_stream_confirmed. Un composant ne peut pas l'oublier.
create or replace function public.get_songs(
  p_artist_slug text,
  p_locale      text
) returns table (
  song_slug        text,
  song_title       text,
  song_descriptor  text,
  release_slug     text,
  release_title    text,
  release_type     text,
  buy_url          text,
  track_no         integer,
  audio_url        text,
  media_provider   text,
  media_asset_id   text,
  artwork          text,
  artwork_alt      text,
  resolved_locale  text
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
                else 3 end as rank
    from public.artist_locales al join a on a.id = al.artist_id
  ),
  tr as (
    select distinct on (st.song_id)
           st.song_id, st.descriptor, st.locale
    from public.song_translations st
    join pref p on p.locale = st.locale
    order by st.song_id, p.rank
  )
  select s.slug,
         s.title,
         tr.descriptor,
         r.slug,
         r.title,
         r.type,
         r.buy_url,
         s.track_no,
         -- ★ la barrière : pas de confirmation ⇒ pas de flux, quoi qu'il arrive
         case when s.rights_stream_confirmed then s.audio_path else null end,
         s.media_provider,
         s.media_asset_id,
         coalesce(s.artwork_path, r.artwork_path),   -- repli sur la pochette d'album
         coalesce(s.artwork_alt,  r.artwork_alt),
         tr.locale
  from public.songs s
  join a on a.id = s.artist_id
  left join public.releases r on r.id = s.release_id
  left join tr on tr.song_id = s.id
  where s.is_published
  order by s.sort_order, r.sort_order, s.track_no;
$$;

revoke all on function public.get_songs(text, text) from public;
grant execute on function public.get_songs(text, text) to anon, authenticated;

commit;


-- ============================================================================
-- SECTION 3 — VÉRIFICATION (une par onglet)
-- ============================================================================

-- 3.1 rien encore : ZÉRO ligne, pas une erreur
select * from public.get_songs('qiwichee', 'fr');

-- 3.2 ★ REFUS : provider sans identifiant
-- insert into public.songs (artist_id, slug, title, media_provider)
-- values ('990b0d38-ffb8-4023-80ef-09c71ff5319a','test','Test','youtube');
--   ATTENDU : erreur songs_media_pair_check. Puis PROUVER L'ABSENCE :
-- select slug from public.songs where slug = 'test';   → zéro ligne

-- 3.3 ★ REFUS : slug malformé
-- insert into public.songs (artist_id, slug, title)
-- values ('990b0d38-ffb8-4023-80ef-09c71ff5319a','Une Dernière Chose','x');
--   ATTENDU : erreur songs_slug_form_check.

-- 3.4 ★ LA BARRIÈRE DE DROITS SE PROUVE PAR UN REFUS.
--   Insérer une chanson AVEC audio_path et rights_stream_confirmed = false,
--   puis lire : audio_url doit être NULL. Passer le booléen à true, relire :
--   l'URL apparaît. Tant que ce test n'est pas fait, la barrière est une
--   intention, pas un mécanisme.


-- ============================================================================
-- SECTION 4 — ANNULATION
-- ============================================================================
-- begin;
-- drop function if exists public.get_songs(text, text);
-- drop table if exists public.song_translations;
-- drop table if exists public.release_translations;
-- drop table if exists public.songs;
-- drop table if exists public.releases;
-- commit;


-- ============================================================================
-- CE QUI N'EST PAS ICI, ET POURQUOI
--
-- · L'AMORÇAGE DES 9 CHANSONS — les données réelles vivent dans src/data/
--   releases.ts. Les recopier de mémoire, c'est inventer des identifiants
--   YouTube et des paramètres Bandcamp. Script d'insertion à écrire EN LISANT
--   le fichier.
-- · POLICIES RLS + GRANTS — avec l'écriture (éditeur artiste), même transaction.
-- · LE LECTEUR AUDIO — composant React. Un chemin en base ne joue rien.
-- · LES FICHIERS MP3 — à demander à Qiwi Chee, et à confirmer côté droits AVANT
--   d'être diffusés (Dilemma = catalogue LEILANI).
-- · LA PAUSE LISIBLE — impossible dans une iframe Bandcamp, son état nous est
--   invisible. C'est précisément ce que audio_path résout : on ne corrige pas
--   leur lecteur, on cesse d'en dépendre.
-- ============================================================================
