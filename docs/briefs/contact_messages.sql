-- =============================================================================
-- contact_messages.sql — canal de contact PRO (booking / presse / collaboration)
-- Repo path: docs/briefs/contact_messages.sql
-- Écrit 2026-08-21. ⛔ NON LANCÉ à l'écriture — committé ≠ appliqué.
-- =============================================================================
--
-- POURQUOI CETTE TABLE
--   Le site a une porte fan (l'Atelier) et AUCUNE porte pro. Un programmateur
--   n'a aujourd'hui aucun moyen d'écrire à l'artiste depuis qiwichee.com.
--
-- POURQUOI UNE TABLE ET PAS UN SIMPLE ENVOI SMTP
--   Un formulaire qui appelle SMTP directement est du CUT-THROUGH : si le lien
--   tombe, la trame est perdue et PERSONNE ne le sait. L'expéditeur voit
--   « merci », l'artiste ne reçoit rien. C'est le pire mode de panne : il ne
--   plante pas, il perd en silence.
--
--   Ici c'est du STORE-AND-FORWARD : on écrit la ligne D'ABORD, on notifie
--   ENSUITE. Si OVH refuse la connexion, la ligne existe déjà — l'échec devient
--   un log rejouable, pas une disparition.
--
--   Corollaire d'architecture maison : les données d'abord dans Supabase,
--   les fournisseurs externes ensuite.
--
-- CE QUE CETTE TABLE DEVIENDRA
--   La première table du PROJECT JOURNAL. Elle n'est pas jetable.
-- =============================================================================


-- =============================================================================
-- ÉTAPE 0 — VÉRIFIER LE TYPE DE artists.id AVANT DE LANCER LE RESTE
--
-- Le FK ci-dessous suppose uuid. Ne pas supposer : LANCER ceci d'abord et lire.
-- Si le type retourné n'est pas 'uuid', corriger artist_id dans le CREATE TABLE
-- (et le declare v_artist_id du RPC) AVANT de continuer.
-- =============================================================================

select column_name, data_type
from information_schema.columns
where table_schema = 'public' and table_name = 'artists'
order by ordinal_position;


-- =============================================================================
-- ÉTAPE 1 — LA TABLE
-- =============================================================================

create table if not exists public.contact_messages (
  id            uuid primary key default gen_random_uuid(),

  -- ANCRE MULTI-TENANT. NOT NULL dès la création, comme toute table depuis
  -- l'existence de `artists`. Jamais de artist_id nullable « à backfiller
  -- plus tard » — c'est exactement la dette que porte `fans`.
  artist_id     uuid not null references public.artists(id) on delete cascade,

  -- --- CONTENU DU MESSAGE (les 4 champs du formulaire) --------------------
  sender_name   text not null,
  sender_email  text not null,

  -- 'concert' | 'presse' | 'collaboration' | 'autre'
  -- TEXT + CHECK, pas un type enum : un enum Postgres se modifie mal
  -- (ALTER TYPE, verrous, migration). Ce jeu de valeurs nous appartient et
  -- restera petit, mais autant garder la porte ouverte à coût nul.
  -- ★ Valeurs MACHINE : la règle épicène ne s'y applique pas. Le libellé
  --   affiché vit dans la copie, pas ici.
  subject       text not null
                check (subject in ('concert','presse','collaboration','autre')),

  message       text not null,

  -- --- LANGUE ---------------------------------------------------------------
  -- ★ POURQUOI UNE COLONNE ET PAS UNE TABLE DE TRADUCTIONS.
  --   Un message ENTRANT n'est pas du contenu traduisible : il est écrit dans
  --   UNE langue, et le traduire n'a aucun sens. Ce qu'on veut savoir, c'est
  --   DANS QUELLE LANGUE RÉPONDRE.
  --   À l'inverse, bio_blocks est du contenu SORTANT → une version par langue
  --   → table de traductions. Les deux se ressemblent et sont opposés.
  --
  -- ★ POURQUOI PAS check (locale in ('fr','en')).
  --   Ce serait re-signer une migration à chaque langue ajoutée — exactement
  --   ce qu'on vient de refuser. On valide la FORME (BCP-47 court), pas la
  --   liste. Ajouter l'arabe = zéro ALTER TABLE.
  locale        text not null default 'fr'
                check (locale ~ '^[a-z]{2}(-[A-Z]{2})?$'),

  -- --- TRAITEMENT -----------------------------------------------------------
  -- ★ POURQUOI CETTE COLONNE NE VIOLE PAS LA RÈGLE « DÉRIVER, PAS STOCKER ».
  --   Un badge se DÉRIVE d'un compteur qui existe déjà. Un statut de traitement
  --   ne se dérive de rien : il n'existe que si un humain l'écrit. Rien à
  --   recalculer, donc rien qui puisse diverger.
  status        text not null default 'new'
                check (status in ('new','read','replied','archived')),
  handled_at    timestamptz,   -- posé par la future inbox. Pas de trigger :
                               -- pas de machinerie tant qu'il n'y a pas d'UI.

  -- --- ANTI-ABUS ------------------------------------------------------------
  -- ★ HASH, JAMAIS L'IP EN CLAIR. Une IP est une donnée personnelle (RGPD).
  --   Le hash suffit pour compter, et ne permet pas de remonter à la personne.
  --   Le hachage se fait CÔTÉ ROUTE (avec un sel en env var), pas ici.
  ip_hash       text,

  created_at    timestamptz not null default now()
);

comment on table public.contact_messages is
  'Canal de contact pro entrant. Store-and-forward : la ligne est la vérité, '
  'le mail vers hello@ n''est qu''une notification. Rétention 24 mois.';


-- =============================================================================
-- ÉTAPE 2 — INDEX
-- =============================================================================

-- Listing de la future inbox : les messages d'un artiste, du plus récent au
-- plus ancien. C'est la seule requête de lecture qui existera.
create index if not exists contact_messages_artist_created_idx
  on public.contact_messages (artist_id, created_at desc);

-- Le rate-limit lit (ip_hash, fenêtre de temps) à CHAQUE soumission. Sans cet
-- index il fait un seq scan sur toute la table à chaque POST : le garde-fou
-- deviendrait lui-même le goulot d'étranglement.
create index if not exists contact_messages_ip_created_idx
  on public.contact_messages (ip_hash, created_at);


-- =============================================================================
-- ÉTAPE 3 — RLS
--
-- ★ ÉTAT HONNÊTE : RLS activée, AUCUNE policy. Donc DENY-ALL via l'API.
--   Ce n'est pas un oubli.
--
--   Une policy de lecture dirait « cet utilisateur peut lire les messages de
--   SON artiste ». Or le lien utilisateur↔artiste N'EXISTE PAS ENCORE :
--   la table `artists` porte id/slug/name, rien qui rattache un compte auth.
--   Écrire une policy aujourd'hui reviendrait à inventer ce lien à la va-vite
--   dans une clause WHERE — le pire endroit pour le définir.
--
--   D'ici là, la lecture se fait dans le dashboard Supabase (service role,
--   qui contourne la RLS). Suffisant pour 1 artiste, pas pour 2.
--
--   → OUVERT : table de rattachement compte↔artiste, à écrire AVANT toute
--     inbox in-app. Même famille que `owners` vs `artists`.
-- =============================================================================

alter table public.contact_messages enable row level security;

-- anon : AUCUN grant. L'insertion passe uniquement par le RPC ci-dessous.
-- (Rappel du keepalive : Postgres vérifie les GRANTS AVANT la RLS. Un anon
--  sans grant se fait refuser en 42501 avant même que la RLS s'exprime.)
revoke all on table public.contact_messages from anon;

-- authenticated : grants posés maintenant pour que la future inbox n'ait qu'à
-- ajouter la policy. Sans policy, ces grants ne rendent AUCUNE ligne.
grant select, update (status, handled_at) on public.contact_messages to authenticated;


-- =============================================================================
-- ÉTAPE 4 — LE RPC D'INSERTION
--
-- security definer : c'est lui qui franchit la barrière, pas le client.
-- Même principe que get_bio_blocks — on filtre sur le routeur, pas sur le poste.
--
-- ★ IL NE LÈVE PAS D'EXCEPTION. Il RETOURNE un verdict.
--   Une exception dans un security definer ressort par PostgREST en erreur
--   Postgres brute (code + message SQL) : illisible côté route, et ça fuite
--   des détails d'implémentation. Un jsonb {ok, reason} se mappe proprement
--   sur un code HTTP.
-- =============================================================================

create or replace function public.submit_contact_message(
  p_artist_slug text,
  p_name        text,
  p_email       text,
  p_subject     text,
  p_message     text,
  p_locale      text default 'fr',
  p_ip_hash     text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_artist_id   uuid;
  v_name        text;
  v_email       text;
  v_message     text;
  v_recent_ip   int;
  v_recent_art  int;
  v_id          uuid;
begin
  ---------------------------------------------------------------------------
  -- 1. Résoudre l'artiste depuis le SLUG.
  --    ★ artist_id n'arrive JAMAIS du body. Ici l'expéditeur est anonyme
  --      (un programmateur, pas une session), donc la source n'est pas
  --      auth.uid() mais le slug résolu côté serveur. La règle tient,
  --      seule la source change.
  ---------------------------------------------------------------------------
  select id into v_artist_id from artists where slug = p_artist_slug;
  if v_artist_id is null then
    return jsonb_build_object('ok', false, 'reason', 'unknown_artist');
  end if;

  ---------------------------------------------------------------------------
  -- 2. Normaliser.
  --    ★ regexp_replace sur les caractères de contrôle : une adresse ou un nom
  --      contenant \r\n injecté dans un en-tête SMTP = INJECTION D'EN-TÊTE
  --      (l'attaquant ajoute un Bcc:). On stocke propre pour que la route ne
  --      PUISSE pas construire un en-tête sale.
  ---------------------------------------------------------------------------
  v_name    := regexp_replace(btrim(coalesce(p_name, '')),    '[[:cntrl:]]', '', 'g');
  v_email   := regexp_replace(lower(btrim(coalesce(p_email, ''))), '[[:cntrl:][:space:]]', '', 'g');
  v_message := btrim(coalesce(p_message, ''));   -- les retours ligne y sont légitimes

  ---------------------------------------------------------------------------
  -- 3. Valider. Zod valide déjà côté route ; on revalide ici parce que le RPC
  --    est exposé à anon et doit tenir SEUL. Ceinture et bretelles.
  ---------------------------------------------------------------------------
  if length(v_name) < 2 or length(v_name) > 120 then
    return jsonb_build_object('ok', false, 'reason', 'invalid_name');
  end if;

  if length(v_email) > 254 or v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    return jsonb_build_object('ok', false, 'reason', 'invalid_email');
  end if;

  if p_subject is null or p_subject not in ('concert','presse','collaboration','autre') then
    return jsonb_build_object('ok', false, 'reason', 'invalid_subject');
  end if;

  if length(v_message) < 10 or length(v_message) > 5000 then
    return jsonb_build_object('ok', false, 'reason', 'invalid_message');
  end if;

  ---------------------------------------------------------------------------
  -- 4. Rate-limit — DANS le RPC, pas dans un service externe.
  --    Un aller-retour au lieu de deux, et le garde-fou ne peut pas être
  --    contourné en appelant le RPC directement.
  --
  --    ★ SI p_ip_hash EST NULL, ON N'APPLIQUE PAS LE PLAFOND IP.
  --      Sinon tous les appels sans hash tomberaient dans le MÊME seau et
  --      se bloqueraient mutuellement : un déni de service qu'on se serait
  --      infligé soi-même. Le plafond par artiste (ci-dessous) couvre ce cas.
  ---------------------------------------------------------------------------
  if p_ip_hash is not null then
    select count(*) into v_recent_ip
    from contact_messages
    where ip_hash = p_ip_hash
      and created_at > now() - interval '1 hour';

    if v_recent_ip >= 3 then
      return jsonb_build_object('ok', false, 'reason', 'rate_limited');
    end if;
  end if;

  -- Plafond global par artiste : filet contre un spam distribué (beaucoup
  -- d'IP différentes) qui remplirait la table et la boîte mail.
  select count(*) into v_recent_art
  from contact_messages
  where artist_id = v_artist_id
    and created_at > now() - interval '1 hour';

  if v_recent_art >= 30 then
    return jsonb_build_object('ok', false, 'reason', 'rate_limited');
  end if;

  ---------------------------------------------------------------------------
  -- 5. Écrire. C'est ICI que le message devient sûr. Tout ce qui suit
  --    (le mail vers hello@) est une notification, pas la vérité.
  ---------------------------------------------------------------------------
  insert into contact_messages
    (artist_id, sender_name, sender_email, subject, message, locale, ip_hash)
  values
    (v_artist_id, v_name, v_email, p_subject, v_message,
     coalesce(nullif(btrim(p_locale), ''), 'fr'), p_ip_hash)
  returning id into v_id;

  -- On retourne l'id pour que la route puisse le mettre dans ses logs :
  -- si l'envoi du mail échoue, on sait EXACTEMENT quelle ligne rejouer.
  return jsonb_build_object('ok', true, 'id', v_id);
end;
$$;

-- Grants explicites : rien par accident (même discipline que keepalive()).
revoke all on function public.submit_contact_message(text,text,text,text,text,text,text) from public;
grant execute on function public.submit_contact_message(text,text,text,text,text,text,text) to anon;
grant execute on function public.submit_contact_message(text,text,text,text,text,text,text) to authenticated;


-- =============================================================================
-- ÉTAPE 5 — VÉRIFICATION (à lancer APRÈS. Le brief ne prouve rien.)
-- =============================================================================

-- 5a. La table existe-t-elle vraiment ?
select table_name
from information_schema.tables
where table_schema = 'public' and table_name = 'contact_messages';

-- 5b. Les colonnes et leurs types.
select column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public' and table_name = 'contact_messages'
order by ordinal_position;

-- 5c. La RLS est-elle bien ACTIVE ? (doit retourner true)
select relrowsecurity
from pg_class
where oid = 'public.contact_messages'::regclass;

-- 5d. Le chemin heureux : doit retourner {"ok": true, "id": "..."}
--     ⚠️ Remplacer le slug par la valeur réelle de ARTIST_SLUG.
select public.submit_contact_message(
  'qiwi-chee',
  'Test Programmateur',
  'test@example.com',
  'concert',
  'Message de test pour verifier le RPC de contact.',
  'fr',
  'hash_de_test'
);

-- 5e. Le chemin de REFUS — celui qui prouve réellement quelque chose.
--     Rejouer 5d trois fois de plus : le 4e appel dans l'heure doit
--     retourner {"ok": false, "reason": "rate_limited"}.
--     ★ Le chemin heureux seul ne prouve pas que le garde-fou existe.

-- 5f. Artiste inconnu : doit retourner {"ok": false, "reason": "unknown_artist"}
select public.submit_contact_message(
  'artiste-qui-nexiste-pas',
  'Test', 'test@example.com', 'autre',
  'Message de test artiste inconnu.', 'fr', null
);

-- 5g. NETTOYAGE des lignes de test (sinon elles polluent la première inbox).
--     À lancer une fois les vérifications faites.
-- delete from public.contact_messages where ip_hash = 'hash_de_test'
--    or sender_email = 'test@example.com';


-- =============================================================================
-- RÉTENTION — 24 MOIS (décidé 2026-08-21)
--
-- Le RGPD demande une DURÉE, pas « pour toujours ». 24 mois : assez long pour
-- retrouver l'historique d'un programmateur recontacté l'an suivant, assez
-- court pour être défendable.
--
-- ⛔ PAS DE CRON DE PURGE MAINTENANT. On n'automatise pas la suppression de
--    lignes qui n'existent pas encore. La durée est écrite ici et devra
--    figurer dans la POLITIQUE DE CONFIDENTIALITÉ — c'est ça, l'obligation.
--    Le job viendra quand il y aura de la matière à purger.
--
-- Forme prévue, pour mémoire (NE PAS LANCER) :
--   delete from public.contact_messages
--   where created_at < now() - interval '24 months';
-- =============================================================================


-- =============================================================================
-- CE QUE CE FICHIER NE FAIT PAS (volontairement)
--
--   · Pas de table de traductions ici : un message entrant a UNE langue.
--   · Pas de pièces jointes : un programmateur envoie un lien. L'upload
--     ouvrirait stockage + antivirus + limites de taille.
--   · Pas d'accusé de réception à l'expéditeur : ça doublerait la surface
--     d'échec et offrirait un relais de spam (adresse + texte au choix de
--     l'appelant). L'écran de confirmation joue ce rôle.
--   · Pas de policy RLS : le lien compte↔artiste n'existe pas encore.
--
-- ⚠️ BLOQUANT POUR LA MISE EN LIGNE, PAS POUR LE CODE :
--   · MENTIONS LÉGALES (LCEN) — obligatoires sur tout site public.
--   · POLITIQUE DE CONFIDENTIALITÉ — liée sous le bouton d'envoi, et portant
--     la durée de 24 mois ci-dessus.
--   · hello@qiwichee.com relevé SUR TÉLÉPHONE avec notifications actives
--     (IMAP pro2.mail.ovh.net, 993 SSL). Un formulaire qui classe dans une
--     boîte que personne n'ouvre reconstruit le silence, en plus cher.
-- =============================================================================
