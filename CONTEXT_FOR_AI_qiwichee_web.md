# Résonance — AI Context File
> Paste/upload this at the start of any new conversation to resume instantly.

**Last updated:** 2026-08-23 — **CHAMP TÉLÉPHONE LIVRÉ. MIGRATION FAITE PENDANT QU'ELLE ÉTAIT ENCORE GRATUITE.**
Rien de spectaculaire côté fonctionnalité — un champ facultatif de plus. Ce qui compte est
la MÉTHODE, et elle est réutilisable telle quelle pour toute évolution de RPC :
(1) **lire la running-config AVANT d'éditer** (`pg_proc`, pas le fichier `.sql` du repo) ;
(2) **`drop function` EMPORTE LES GRANTS** — le vrai risque d'un changement de signature ;
(3) **paramètre optionnel en dernier ⇒ RÉTRO-COMPATIBLE**, donc la base a migré 2 h avant
la route, sans fenêtre cassée ; (4) **une barrière ne se prouve que par un REFUS** ;
(5) le formulaire a été fait par Claude Code sur brief scopé, la route à la main —
et c'était le bon partage.
**Status:** qiwichee.com LIVE ✅ · Atelier gate ✅ · Magic links ✅ · Keepalive CRON ✅ ·
Release-switcher ✅ · Section BIO ✅ · CONTACT PRO LIVE ✅ · **CHAMP TÉL. ✅** ·
SPF+DKIM+DMARC ✅ · Event-engine SQL ⛔ TOUJOURS UNRUN (et doit pointer vers `artists`)
**Commits du jour :** `4361c08` (route) + formulaire (ContactForm), poussés et vérifiés en prod
**Next session goal (in order):** (1) **MENTIONS LÉGALES + CONFIDENTIALITÉ** — désormais LE
bloquant, et la rétention porte maintenant aussi un NUMÉRO DE TÉLÉPHONE. (2) **BILINGUE
next-intl** (décisions prises) **AVEC la nav dans le layout**. (3) LADDER & SEASONS.
(4) `fans` MULTI-TENANT. (5) SEND EMAIL HOOK.

---

## ☎️ CHAMP TÉLÉPHONE — LIVRÉ 2026-08-23

```
POURQUOI MAINTENANT ET PAS PLUS TARD : la table était quasi vide (1 ligne réelle).
  Un ALTER TABLE + un changement de signature de RPC sur une table vide coûtent zéro.
  Sur 500 lignes et un formulaire en production mis en avant, c'est une migration.
  ★ LA FENÊTRE DE GRATUITÉ EST UNE RESSOURCE QUI SE PÉRIME. C'est le seul item de la
    liste dont le coût AUGMENTAIT en attendant — d'où sa priorité sur des sujets
    objectivement plus importants (les mentions légales).

CHAÎNE COMPLÈTE, QUATRE COUCHES, MÊMES BORNES PARTOUT :
  colonne `phone text NULL` → RPC 8 params → route (Zod) → formulaire
  Forme validée : 6–32 caractères, ^[+0-9][0-9 ().-]*$ · vide → NULL
  ★ ON VALIDE LA FORME, PAS LE PLAN DE NUMÉROTATION. +213, +1, 06 12 34 56 78 sont
    tous légitimes (parcours franco-algérien-américain, fans aux USA). Un regex strict
    rejetterait de vrais programmateurs — et UN PROGRAMMATEUR REJETÉ NE RÉESSAIE PAS,
    IL RENONCE. Même logique que le BCP-47 de `locale` : la forme, jamais la liste.
  ★ SI LES BORNES DIVERGENT ENTRE LES COUCHES, le visiteur voit « tout est bon » et le
    serveur refuse quand même. Elles sont identiques caractère pour caractère, à vérifier
    à chaque modification de l'une des trois.

★★ `drop function` EMPORTE LES GRANTS. C'EST LE VRAI RISQUE.
  Changer la signature d'un RPC impose un `drop` + `create` (voir ci-dessous). Le drop
  supprime l'ACL avec la fonction. Sans `revoke`/`grant execute to anon, authenticated`
  DANS LA MÊME TRANSACTION, le formulaire renvoie 403 au premier envoi suivant — et
  seulement à ce moment-là, donc potentiellement des heures après la migration.
  (Télécom : on ne remplace pas une interface sans remettre ses ACL dans le même commit.)

★★ PARAMÈTRE OPTIONNEL EN DERNIER ⇒ RÉTRO-COMPATIBILITÉ ⇒ PAS DE FENÊTRE CASSÉE.
  Postgres interdit un paramètre sans défaut après des paramètres avec défaut, donc
  `p_phone text default null` DEVAIT aller en dernier. Cette contrainte est un cadeau :
  PostgREST appelle par ARGUMENTS NOMMÉS, donc l'ancienne route (6 arguments, aucun
  `p_phone`) reste parfaitement valide contre la nouvelle fonction.
  ⇒ La base a migré à 23 h, la route à 1 h, le formulaire à 2 h. À AUCUN MOMENT la
    production n'a été cassée. VÉRIFIÉ par un appel à 6 arguments nommés, pas supposé.
  ★ GÉNÉRALISABLE : toute évolution de RPC doit viser cette propriété. Ajouter en fin
    de signature avec un défaut = déploiement en deux temps possible. Insérer au milieu
    ou changer un type = big-bang obligatoire.

★ `create or replace` NE REMPLACE QUE SI LA SIGNATURE EST IDENTIQUE.
  Ajouter un paramètre crée une SURCHARGE, et PostgREST ne sait plus laquelle appeler.
  → `drop function public.submit_contact_message(text,text,text,text,text,text,text);`
    avec les types EXACTS relevés dans pg_proc, jamais devinés.

★ LIRE LA RUNNING-CONFIG, PAS LE FICHIER DU REPO.
  La signature et le corps ont été relevés dans pg_proc AVANT d'éditer :
    select p.oid::regprocedure, pg_get_function_identity_arguments(p.oid),
           pg_get_functiondef(p.oid)
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname='public' and p.proname='submit_contact_message';
  `pg_get_functiondef` rend le corps RÉEL. docs/briefs/*.sql est l'INTENTION.
  (Corollaire de « committé ≠ appliqué ».) Vérification qui compte : UNE SEULE LIGNE.
  Deux lignes = surcharge déjà présente, tout le plan change.

★ UNE BARRIÈRE NE SE PROUVE QUE PAR UN REFUS.
  Trois tests, dont DEUX devaient échouer : rétro-compat (ok), numéro valide (ok),
  `appelle-moi` → {"ok":false,"reason":"invalid_phone"}. Puis LECTURE DE LA TABLE :
  la ligne refusée est ABSENTE. Une validation qui retourne false mais écrit quand même
  est pire que pas de validation — elle a l'air de marcher.
  ★ Le retour du RPC dit ce qu'il PRÉTEND avoir fait ; la table dit ce qui s'est passé.

★ NULLIF EST INDISPENSABLE DES DEUX CÔTÉS.
  Un champ HTML non rempli poste `''`, pas `undefined`/null. Sans conversion on stocke
  des chaînes vides : ni absentes ni présentes, et chaque requête future doit tester les
  deux cas. Route : `p_phone: phone || null`. RPC : `nullif(btrim(...), '')`.
  On ne s'appuie pas sur le filet de l'autre couche. VÉRIFIÉ : envoi sans téléphone → null.

★ CÔTÉ FORMULAIRE, TROIS DÉCISIONS ET UN PIÈGE :
  1. « (facultatif) » est DANS LE LIBELLÉ, pas dans le style. Un astérisque ou un gris
     plus clair n'est PAS lu par un lecteur d'écran : l'information disparaîtrait pour
     ceux qui en ont le plus besoin.
  2. L'indication suit le motif du champ MESSAGE (toujours visible, devient rouge et
     affiche l'erreur), pas celui du champ EMAIL (<p> rendu seulement en cas de faute).
     Ce qu'un visiteur doit savoir EN PREMIER, c'est qu'il peut laisser vide.
     ⇒ `aria-describedby` INCONDITIONNEL, jamais un ternaire.
  3. `type="tel"` + `inputMode="tel"` : pavé numérique sur mobile. `type="tel"` ne valide
     RIEN côté navigateur (contrairement à `type="email"`) — voulu, la forme est à nous.
  ⚠️ PIÈGE : les quatre champs existants sont obligatoires, donc TOUTES les vérifications
     de validate() sont inconditionnelles. Copier ce motif rend le téléphone OBLIGATOIRE
     — l'inverse exact de la demande — ET `tsc` PASSE AU VERT. La vérification doit être
     conditionnelle : `if (p.length > 0 && (...))`.

VÉRIFIÉ EN PRODUCTION (2026-08-23) depuis DEUX RÉSEAUX (laptop + téléphone) :
  vide → null en base · numéro → stocké · invalide → erreur sous le champ + focus ·
  mail reçu sur hello@ avec la ligne `Tél.` (— si absent : jamais de ligne muette).
  ★ Un tiret cadratin explicite vaut mieux qu'une ligne absente : « demandé, non fourni »
    au lieu de « est-ce que le champ est cassé ? ».

⚠️ CONSÉQUENCE RGPD IMMÉDIATE : un numéro de téléphone est une donnée personnelle.
  La politique de confidentialité (déjà bloquante) doit maintenant couvrir AUSSI ce champ,
  même rétention 24 mois. Commentaire posé sur la colonne en base — le drapeau vit à côté
  de la donnée, pas seulement dans un document qui n'existe pas encore.
```

---

## 📮 CANAL DE CONTACT PRO — LIVRÉ 2026-08-22

```
POURQUOI : deux publics, deux besoins. Le fan veut appartenir (Atelier, déjà fait).
  Le PRO (programmateur, presse, collab) veut joindre l'artiste SANS COMPTE.
  ⛔ PAS de canal fan→artiste ouvert : charge de modération quotidienne, et ça double
     l'Atelier. Le canal pro était le seul manquant. UNE seule adresse, pas trois.

★ ARCHITECTURE : STORE-AND-FORWARD, PAS CUT-THROUGH.
  1. Valider (Zod + honeypot)  2. PERSISTER (RPC)  3. Répondre  4. Notifier via after()
  Un formulaire qui appelle SMTP directement est du cut-through : le lien tombe, la trame
  est perdue, PERSONNE ne le sait. L'expéditeur voit « merci », l'artiste ne reçoit rien.
  C'est le pire mode de panne : il ne plante pas, il PERD EN SILENCE.
  (Corollaire maison : les données d'abord dans Supabase, les fournisseurs ensuite.)

SCHÉMA (docs/briefs/contact_messages.sql — ✅ LANCÉ ET VÉRIFIÉ) :
  contact_messages  artist_id (NOT NULL, FK → artists) · sender_name · sender_email ·
                    phone (2026-08-23, nullable) ·
                    subject ('concert'|'presse'|'collaboration'|'autre') · message ·
                    locale · status ('new'|'read'|'replied'|'archived') · handled_at ·
                    ip_hash · created_at
  submit_contact_message(slug, name, email, subject, message, locale, ip_hash, phone)
    security definer · returns jsonb · execute → anon + authenticated
  ⚠️ 8 PARAMÈTRES depuis le 2026-08-23. `p_phone` en DERNIER, default null.

★ IL NE LÈVE PAS D'EXCEPTION, IL RETOURNE UN VERDICT {ok, reason}.
  Une exception dans un security definer ressort par PostgREST en erreur Postgres brute :
  illisible côté route, et ça fuite l'implémentation. Un jsonb se mappe sur un code HTTP.

★ RATE-LIMIT DANS LE RPC : 3/h par ip_hash, 30/h par artiste.
  VÉRIFIÉ PAR UN REFUS. Le chemin heureux seul ne prouve PAS que la barrière existe.
  ⚠️ ip_hash est un PARAMÈTRE de l'appelant : un attaquant qui appelle le RPC directement
     peut le varier et contourner le plafond IP. Le plafond PAR ARTISTE est le vrai filet.
  ⚠️ 3/h est probablement TROP STRICT pour du booking (un festival = plusieurs personnes
     derrière une même IP). À rediscuter.
  ★ Le plafond se DÉRIVE de la table (count sur la dernière heure) : supprimer des lignes
    de test libère le quota immédiatement. Même principe que les badges dérivés.

★ RLS ACTIVE, AUCUNE POLICY = DENY-ALL, ET C'EST DÉLIBÉRÉ.
  LE LIEN COMPTE↔ARTISTE N'EXISTE PAS : `artists` porte id/slug/name, rien qui rattache
  un compte auth. L'écrire aujourd'hui = inventer ce lien dans une clause WHERE, le pire
  endroit pour le définir. Lecture via dashboard (service role) en attendant.
  → MÊME FAMILLE QUE `owners` vs `artists`. À trancher ensemble.

★ ip_hash : SHA-256 AVEC SEL (IP_HASH_SALT), jamais l'IP en clair.
  Le sel ne se fait PAS tourner : le changer rend les anciens hashs INCOMPARABLES.
  Il se documente, il ne se gère pas.

FICHIERS :
  src/lib/mailService.ts              abstraction fournisseur (OVH aujourd'hui, Brevo demain)
  src/app/api/contact/route.ts        runtime='nodejs' + dynamic='force-dynamic'
  src/app/contact/page.tsx            mailto visible + JSON-LD ContactPoint
  src/app/components/ContactForm.tsx  validation par champ, copie en objet plat
  src/app/components/SiteFooter.tsx   dans le LAYOUT → présent partout

★ FROM = LA BOÎTE AUTHENTIFIÉE, TOUJOURS. REPLY-TO = L'EXPÉDITEUR RÉEL.
★ 587 = STARTTLS ⇒ secure:false + requireTLS:true. secure:true est pour le 465.
★ TIMEOUTS 10 s MALGRÉ UN PLAFOND VERCEL À 300 s : « NE PAS PENDRE », pas « ne pas être coupé ».
★ after() DÉPLACE LA LATENCE, IL NE GARANTIT PAS LA LIVRAISON. D'où le log avec l'id.
★ LE HONEYPOT EST VÉRIFIÉ CÔTÉ SERVEUR (celui d'AtelierGate est CLIENT-ONLY).
  Si le seul champ en faute est `website` → 200 « envoyé » SANS RIEN ÉCRIRE.
  ⚠️ AtelierGate combine sr-only ET aria-hidden — CONTRADICTOIRE. À corriger.
★ UN CRAWLER NE REMPLIT PAS DE FORMULAIRE → mailto visible + ContactPoint JSON-LD.
  ⚠️ page.tsx SURCHARGE alternates.canonical. VÉRIFIER CE PIÈGE SUR CHAQUE NOUVELLE PAGE.

⛔ BLOQUANT AVANT TOUTE MISE EN AVANT (pas avant le code) :
  MENTIONS LÉGALES (LCEN — obligatoires sur tout site public, et SUBSTANTIELLES dès la
  SASU) · POLITIQUE DE CONFIDENTIALITÉ liée sous le bouton d'envoi, RÉTENTION 24 MOIS,
  COUVRANT LE TÉLÉPHONE. Pas de cron de purge : on n'automatise pas la suppression de
  lignes qui n'existent pas. Le footer ne porte AUCUN lien légal aujourd'hui.

⛔ ET : `hello@` DOIT ÊTRE RELEVÉ SUR LE TÉLÉPHONE DE QIWI CHEE (IMAP pro2.mail.ovh.net,
  993 SSL, notifications actives). Un formulaire qui classe dans une boîte que personne
  n'ouvre RECONSTRUIT LE SILENCE, en plus cher. Bassim relève aussi.

À FAIRE (décidé, non fait) :
  · NAV ABSENTE SUR /contact → cul-de-sac. Palliatif : lien « ← Qiwi Chee ».
    LA VRAIE CORRECTION est de remonter la nav dans le LAYOUT, #music → /#music.
    ⚠️ À faire AVEC le bilingue : le sélecteur de langue vit dans la nav.
  · ORDRE DES CHAMPS : le téléphone est entre Email et Objet, ce qui repousse le message.
    Cohérent (coordonnées ensemble, même ordre que le mail) mais si le formulaire paraît
    long sur mobile, c'est CE champ qu'on descend sous Objet. Noté, pas urgent.
  · AUTOFILL : Chrome remplit le nom, pas l'email. TESTÉ : profil Chrome, PAS notre code.
    NE PAS Y REPASSER DE TEMPS.
```

---

## 🌍 BILINGUE — DÉCISIONS PRISES 2026-08-22 (implémentation à venir)

```
CONTEXTE : Qiwi Chee a demandé une version anglaise — elle a des fans aux USA.
Trilingue possible (arabe) vu le parcours franco-algérien-américain.

★ RÈGLE QUI DÉCIDE TOUT : AJOUTER UNE LANGUE DOIT ÊTRE DES LIGNES, PAS UNE MIGRATION.
  Ça DISQUALIFIE le pattern colonnes (title_fr, title_en) : il marche à deux langues,
  coûte un ALTER TABLE + un déploiement à la troisième.

1. CONTENU SORTANT (bio_blocks) → TABLE DE TRADUCTIONS, une ligne par (bloc, langue).
2. SAISIE ENTRANTE (contact_messages) → COLONNE `locale`. Un message a UNE langue.
   ★ Les deux se ressemblent et sont OPPOSÉS.
3. PAS de check (locale in ('fr','en')) : on valide la FORME (regex BCP-47), pas la liste.
   ★ MÊME RÈGLE APPLIQUÉE AU TÉLÉPHONE le 2026-08-23. C'est devenu un motif maison :
     valider la forme, jamais l'énumération, dès qu'un domaine peut s'élargir.
4. URLS PAR LANGUE : FR à la racine (URLs actuelles INCHANGÉES), EN sous /en, + hreflang.
   ★ UNE BASCULE PAR COOKIE SEULE NE DONNE QU'UNE URL : l'anglaise N'EXISTE PAS dans les
     résultats de recherche. Traduire sans URL distincte ne rend PAS l'artiste trouvable
     aux USA — c'était tout l'objet de la demande.
5. FORME DE LA COPIE, DÉJÀ APPLIQUÉE dans ContactForm/SiteFooter : un seul objet plat en
   haut du composant, clés anglaises, valeurs françaises → se déplace dans fr.json par
   copier-coller. ★ Les 3 clés du téléphone respectent déjà cette forme.

⚠️ NON VÉRIFIÉ : next-intl passe par le middleware, et Next 16 affiche déjà l'avertissement
   middleware→proxy. À vérifier AU MOMENT de l'installer, pas à supposer.
⚠️ SI ARABE UN JOUR : problème de LAYOUT RTL, pas de traduction. Ne jamais coder
   « flèche suivante = à droite » en dur.
```

---
## 🖼️ MODULE BIO — LIVRÉ 2026-08-21

```
CE QUE C'EST : des couples texte/photo, ordonnés à la main, en carrousel horizontal.
DEUX RENDUS SUR LA MÊME SOURCE : le carrousel web (fait) et le PRESS KIT PDF (à venir).
Un press kit n'est pas un second module — c'est une seconde vue des mêmes lignes.

SCHÉMA (docs/briefs/bio_blocks.sql — ✅ LANCÉ ET VÉRIFIÉ) :
  artists      id · slug · name · created_at          ← ANCRE MULTI-TENANT
  bio_blocks   artist_id (NOT NULL, FK) · slug · sort_order · title · body ·
               image_path · image_hd_path · image_alt (NOT NULL) ·
               credits jsonb [{role,name}] ·
               rights_web_confirmed · rights_press_confirmed · rights_note ·
               usage_scope ('web'|'presskit'|'both') · is_published
  get_bio_blocks(p_artist_slug, p_usage)  security definer, execute → anon + authenticated

★ LA BARRIÈRE DE DROITS EST DANS LE RPC, PAS DANS LE CLIENT.
  Le futur rendu press kit ne PEUT PAS publier une photo non autorisée — ce n'est pas
  une consigne qu'un dev pourrait oublier, c'est une impossibilité côté base.
  (Télécom : on filtre sur le routeur, pas sur le poste client.)
  VÉRIFIÉ : web → 7 · presskit → 0 · artiste inconnu → 0.

CONTENU : 7 blocs, photos de MAËLYS JIBIDAR (série « Une dernière chose »).
  1 qui-je-suis · 2 entre-quatre-villes · 3 britney-et-elliott · 4 ce-que-je-n-aime-pas ·
  5 ce-que-j-aime · 6 avant-il-y-a-eu-boston · 7 une-derniere-chose
  usage_scope : 1,2,3,6 = both · 4,5,7 = web (trop intimes pour un dossier professionnel)
  ★ C'EST LE CONTENU RÉEL QUI A TRANCHÉ `usage_scope`, pas la théorie.

COMPOSANTS : src/app/components/BioSection.tsx · BioSwitcher.tsx · src/lib/constants.ts
  Départ TOUJOURS sur le premier bloc. PAS de recoloration par slide.

⚠️ DROITS PHOTO — ÉTAT RÉEL :
  Usage WEB : accordé oralement par Maëlys Jibidar (août 2026). Consigné dans rights_note.
  Usage PRESSE : NON DEMANDÉ. Mail rédigé, à envoyer — de préférence SIGNÉ PAR QIWI CHEE.
  FICHIERS HD : N'EXISTENT NULLE PART. Les 7 fichiers plafonnent à 1600 px. Si le disque
    de Maëlys tombe, la séance est perdue. image_hd_path reste null. → DEMANDE URGENTE.
  Transfert par LIEN (WeTransfer/SwissTransfer/Drive), JAMAIS WhatsApp/Instagram/iMessage.
```

---

## 🎚️ ENGAGEMENT LADDER — PASSE PARTIELLE 2026-08-21

```
★ RÈGLE ÉPICÈNE — MÉTHODE :
  1. Le libellé désigne-t-il une PERSONNE ? → il a un féminin → RÉÉCRIS.
  2. Réécris en : NOM ABSTRAIT · GROUPE NOMINAL · ADJECTIF INVARIABLE · VERBE.
  ⛔ PASSEUR → ✅ BOUCHE-À-OREILLE
  ✅ Fidèle à l'écoute · Présence constante · Mémoire de l'Atelier · De la première heure
  NOTE : une artiste qui se décrit à la 1ʳᵉ personne n'est PAS concernée.

TROIS PALIERS : visiteur (jamais affiché) · membre (déjà épicène) · abonne (seul sujet).
  ★ VALEURS DB : 'visiteur' | 'membre' | 'abonne' — texte machine, règle NON applicable.
  ★ LIBELLÉ AFFICHÉ : une seule constante de copy. Candidat « Complice ». Alternative :
    ne pas nommer du tout. Décision de Qiwi Chee.

BADGES : DÉRIVÉS de visit_count et joined_at à la lecture, JAMAIS STOCKÉS.
  Seuils validés : 5 · 15 · 30 visites.

SAISONS : seasons id · artist_id · slug · title · subtitle · starts_at · ends_at ·
  status · finale_event_id · created_at
  ⛔ PAS de currentPhase/phases Json. ⛔ PAS de table `rituals` (une règle, pas une ligne).

RYTHME RITUEL : 1×/semaine un signe de vie · 1×/mois un rendez-vous vivant · 1×/saison la finale.
  ★ Un battement hebdomadaire TENU vaut mieux que trois annoncés et deux honorés.

★ MODE DÉGRADÉ : si l'artiste ne confirme pas 2 h avant un rituel, annulation stylisée
  automatique. Dead-man's switch appliqué à l'engagement.
```

---

## 📥 DOCUMENT KIMI — TRIAGE 2026-08-21

```
GARDÉ : bibliothèque d'activités · rythme rituel · mode dégradé · privacyLevel sur le fan.
JETÉ : Prisma (perte de la RLS) · NextAuth · Next 14 · Cloudflare R2 · OpenAI ·
       les 6 paliers anglais non épicènes · l'habillage Tolkien.

⛔ DEUX DRAPEAUX ROUGES :
  1. `Treasury` avec vote des fans = intermédiation (DSP2/ACPR). Version acceptable :
     Treasury en LECTURE SEULE, miroir du compte Stripe DE L'ARTISTE. Aucun solde chez nous.
  2. La billetterie fait tomber l'exemption microentreprise de l'EAA ET rouvre la licence
     d'entrepreneur de spectacles. Plus chargebacks et responsabilité de remboursement.

★ Le tier 3 est bloqué non par Stripe mais par le STATUT LÉGAL de Qiwi Chee. Sans réponse.
```

---

## 🔑 HARD-WON LEARNINGS (standing)

```
1. LE CHEMIN SOURCE DU SCRIPT DE BACKUP est la seule vérité sur ce qui est sauvegardé.
2. QUAND DEUX CALCULS DU MÊME NOMBRE DIVERGENT, re-dériver depuis la formule.
3. FLEXBOX MIN-WIDTH TRAP : min-w-0 / max-w-full sur le wrapper.
4. Un fichier coupé à une taille exactement en puissance de deux = copie interrompue.
5. Quarantaine-puis-suppression bat rm direct.
6. Les invocations de cron Vercel SONT loguées sous Observability → Cron Jobs.
7. LES DOCUMENTS DE STRATÉGIE IMPORTÉS PORTENT UN VOCABULAIRE ÉTRANGER. Input, pas spec.
8. UNE RÈGLE ÉNONCÉE COMME UN TIMING EST SOUVENT UN PROXY POUR UNE RÈGLE DE STRUCTURE.
9. LA CONFIG PLATEFORME EST PAR PROJET, PAS PAR TENANT (Site URL, templates, SMTP).

★ 10. (2026-08-21) **CODE ÉCRIT ≠ CODE SERVI.** Trois heures perdues sur un carrousel.
   Cause : Next.js bloque le hot-reload en cross-origin (test depuis 192.168.1.5:3000).
   L'AVERTISSEMENT ÉTAIT DANS LES LOGS DU SERVEUR DÈS LE PREMIER DÉMARRAGE.
   RÈGLE : quand le comportement contredit le code lu, vérifier que le code lu est celui
   qui est servi — AVANT de corriger. Corollaire : dev = localhost.

★ 11. (2026-08-21) QUAND DEUX CHOSES IDENTIQUES SE COMPORTENT DIFFÉREMMENT, c'est ce qui
   est réellement servi qui diffère. ON AVAIT UN CARROUSEL QUI MARCHE À TROIS FICHIERS DE
   DISTANCE, ON NE L'A PAS LU. Lire le code qui fonctionne AVANT de déboguer l'autre.

★ 12. (2026-08-21) `position` EST UN MOT-CLÉ POSTGRES à géométrie variable : accepté comme
   nom de colonne, refusé comme paramètre de sortie (`returns table`). Erreur 42601.
   ★ Ne pas spéculer sur un mot-clé — LANCER et lire l'erreur.

★ 13. (2026-08-21) LES DROITS NE SONT PAS UN ÉTAT DE L'ŒUVRE, MAIS UN ÉTAT PAR USAGE.
   CE BUG NE PLANTE PAS — IL PUBLIE. Un booléen par usage, vérification dans le RPC.

★ 14. (2026-08-21) LE RÉSUMÉ DE CLAUDE CODE N'EST PAS LE DIFF.
   → `cat` et `git --no-pager diff` soi-même. C'est plus rapide que d'insister.
   ★ MISE À JOUR 2026-08-23 : sur brief scopé et explicite, le rapport s'est révélé EXACT
     (5 vérifications, toutes confirmées au diff) et il n'a PAS committé. La règle ne
     change pas — on vérifie quand même — mais la QUALITÉ DU BRIEF déplace le résultat.
     Un brief qui NOMME LE PIÈGE obtient un travail qui l'évite.

★ 15. (2026-08-22) **`tsc --noEmit` VALIDE UN FICHIER *VALIDE*, PAS LE *BON* FICHIER.**
   Un vieux page.tsx traînait dans ~/Downloads ; le `cp` l'a installé ; tsc est passé au vert.
   RÈGLE : après tout `cp` depuis Downloads, VÉRIFIER LE FICHIER REÇU — `head -3` (le
   chemin est en commentaire d'en-tête) ou `wc -l`. Un contrôle de types n'est PAS un
   contrôle d'identité.
   ★ ÉLARGI 2026-08-23 : tsc ne prouve rien non plus sur la SÉMANTIQUE. Un champ optionnel
     rendu obligatoire par une vérification non conditionnelle compile parfaitement.
     Les points qui comptent se relisent À L'ŒIL, sur le diff. Liste explicite dans le brief.

★ 16. (2026-08-22) **CHERCHER LE TEXTE, PAS LE NOM DE FICHIER.**
   `ls src/components/` n'a montré aucun footer ; il y en avait un, EN DUR dans page.tsx.
   `grep -rn "rights reserved" src/` l'aurait trouvé en une seconde.
   ⚠️ Et le grep est CASE-SENSITIVE : chercher `phone` ne trouve pas `errPhone`.
     Un compte de résultats n'est pas un compte de zones touchées.

★ 17. (2026-08-22) **UN MESSAGE D'ERREUR EXACT PEUT ÊTRE INUTILISABLE.**
   DEUX NIVEAUX, DANS CET ORDRE : (1) PRÉVENIR — afficher la contrainte AVANT l'erreur ;
   (2) SIGNALER — sous le champ, avec aria-invalid + aria-describedby + focus.
   ★ APPLIQUÉ AU TÉLÉPHONE 2026-08-23 : l'indication « tu peux laisser vide » est
     TOUJOURS visible. Pour un champ facultatif, la prévention est le message principal.

★ 18. (2026-08-22) **DEUX DOSSIERS DE COMPOSANTS COEXISTENT** — `src/components/`
   (AtelierGate, CitiesPicker) et `src/app/components/` (le reste). Suivre la MAJORITÉ
   existante. Unifier est un chantier PROPRE, à faire d'un coup.

★ 19. (2026-08-23) **`drop function` EMPORTE LES GRANTS.**
   Changer la signature d'un RPC impose drop + create ; le drop supprime l'ACL. Sans
   `grant execute` dans LA MÊME TRANSACTION, le premier appel suivant renvoie 403 —
   potentiellement des heures plus tard. On ne remplace pas une interface sans remettre
   ses ACL dans le même commit.

★ 20. (2026-08-23) **UN PARAMÈTRE OPTIONNEL EN FIN DE SIGNATURE = DÉPLOIEMENT EN DEUX TEMPS.**
   PostgREST appelle par arguments NOMMÉS : l'ancienne route reste valide contre la nouvelle
   fonction. La base a migré 2 h avant la route, sans fenêtre cassée. VÉRIFIÉ par un appel
   à l'ancienne signature, pas supposé.
   ⇒ Toute évolution de RPC doit VISER cette propriété : ajouter en fin avec un défaut.
     Insérer au milieu ou changer un type = big-bang obligatoire.

★ 21. (2026-08-23) **LIRE LA RUNNING-CONFIG DE LA BASE, PAS LE FICHIER DU REPO.**
   `pg_get_functiondef(p.oid)` rend le corps RÉEL ; `docs/briefs/*.sql` est l'INTENTION.
   Et `pg_get_function_identity_arguments` donne les types EXACTS que `drop function`
   exige — devinés, ils créent la surcharge qu'on cherchait à éviter.
   Vérification qui compte : UNE SEULE LIGNE dans pg_proc, avant ET après.

★ 22. (2026-08-23) **LE RETOUR DU RPC DIT CE QU'IL PRÉTEND AVOIR FAIT ; LA TABLE DIT CE
   QUI S'EST PASSÉ.** Une validation qui retourne `{ok:false}` mais écrit quand même est
   pire que pas de validation : elle a l'air de marcher. Chaque test de refus se conclut
   par un `select` qui prouve l'ABSENCE de la ligne.

★ 23. (2026-08-23) **LA FENÊTRE DE GRATUITÉ D'UNE MIGRATION EST UNE RESSOURCE PÉRISSABLE.**
   Le champ téléphone est passé devant les mentions légales — objectivement plus
   importantes — parce que c'était le seul item dont le COÛT AUGMENTAIT en attendant.
   Critère de priorisation à réutiliser : qu'est-ce qui coûte plus cher dans un mois ?
```

---

## 🗄️ SUPABASE ARCHITECTURE — UN SEUL PROJET PARTAGÉ

```
DÉCIDÉ 2026-08-04, ANCRÉ 2026-08-21 : `artists` existe (id, slug, name).
Toutes les tables créées à partir de maintenant portent artist_id NOT NULL → artists(id).

⚠️ CONFLIT À RÉSOUDRE AVANT DE LANCER LE MOTEUR D'ÉVÉNEMENTS :
  event_engine.sql (committé, non lancé) crée une table `owners`. `artists` existe
  désormais. DEUX TABLES D'ANCRAGE = deux VLAN portant le même segment sur un trunk.
  → DÉCIDER : soit event_engine pointe vers `artists`, soit on renomme. Ne pas lancer avant.

⚠️ `fans` N'A TOUJOURS PAS DE artist_id. Migration : add nullable → backfill → NOT NULL → RLS.

★ `tier` va sur **atelier_members**, PAS sur `fans`. Un abonnement est une propriété de
  LA RELATION — sinon un abonné chez Qiwi Chee serait abonné partout.

SEND EMAIL HOOK : toujours sur le chemin critique, toujours ce qui débloque l'artiste #2.
```

---

## 🎠 CAROUSELS — DEUX, ET ILS DOIVENT RESTER JUMEAUX

```
ReleaseSwitcher (musique)  : départ ALÉATOIRE (client-side), recoloration par slide,
                             source = src/data/releases.ts, lecteur audio.
BioSwitcher (bio)          : départ TOUJOURS au premier, PAS de recoloration,
                             source = RPC Supabase, pas de lecteur.

MÉCANISME COMMUN : scroll-snap CSS, slides 88 % + snap center, scrollToSlide via
  target.offsetLeft, flèches .carousel-arrow partagées, wrapper
  "relative w-full max-w-full min-w-0 overflow-hidden", pas de boucle, pas d'auto-scroll.

★ RÈGLE : la CLASSE CSS de flèche se partage (apparence) ; le COMPOSANT ne se partage pas
  (comportement). Un composant qui porte deux récits finit par mal servir les deux.
```

---

## 🇫🇷 COPIE — PASSE FRANÇAISE 2026-08-21

```
Site entièrement en français. `lang="fr"` corrigé.
  nav : Musique · À propos        h2 : À propos · Musique
  hero : « Autrice-compositrice-interprète indépendante. Pop alternative, en français
         et en anglais. »
  genre : « Pop alternative ». titres : « Qiwi Chee — Pop alternative »
ORDRE DES SECTIONS : hero → AtelierGate → À propos (bio) → Musique.
  ★ La porte de l'Atelier reste AU-DESSUS de la bio : capter la relation avant de raconter.

⚠️ DETTE A11Y — CHAÎNES ANGLAISES LUES PAR LES LECTEURS D'ÉCRAN :
  aria-label="Primary" (nav) · <label>Website</label> (honeypot). → passe accessibilité.
```

---

## OPEN DECISIONS / NEXT ACTIONS

```
[x] ★★ MODULE BIO · TABLE `artists` · RÈGLE ÉPICÈNE · `tier` sur atelier_members. CLOSED.
[x] ★★ CANAL DE CONTACT PRO — vérifié en prod (56cab9e). CLOSED.
[x] ★★ BILINGUE : décisions de schéma + d'URL prises. CLOSED.
[x] ★★ CHAMP TÉLÉPHONE — 4 couches, vérifié en prod depuis 2 réseaux (4361c08 + form). CLOSED.

[ ] ★★ MENTIONS LÉGALES + POLITIQUE DE CONFIDENTIALITÉ (LCEN + RGPD, rétention 24 mois,
    COUVRANT LE TÉLÉPHONE). BLOQUANT avant toute mise en avant du formulaire.
[ ] ★★ QIWI CHEE : hello@ sur son téléphone, notifications actives. Sinon le canal est mort.
[ ] ★★ ENVOYER LE MAIL À MAËLYS JIBIDAR : fichiers HD + autorisation presse.
    Signé par Qiwi Chee de préférence. AUCUNE COPIE HD N'EXISTE — priorité.
[ ] ★★ BILINGUE FR/EN next-intl — inclut la table de traductions bio_blocks, les URLs par
    langue, et middleware→proxy. À FAIRE AVEC la nav dans le layout.
[ ] ★★ RÉSOUDRE `owners` vs `artists` avant de lancer event_engine.sql.
[ ] ★★ `fans` MULTI-TENANT MIGRATION.
[ ] ★★ LADDER — finir : libellé du tier 3 (Qiwi Chee), jeu de badges complet.
[ ] ★★ SEND EMAIL HOOK — débloque l'artiste #2.
[ ] ★ PRESS KIT PDF — second rendu de bio_blocks. Bloqué sur les fichiers HD, pas sur le code.
[ ] ★ CAROUSEL V2 (song-per-slide + credits structurés + Bandcamp two-click).
[ ] ★ ASK QIWI CHEE : statut légal pour encaisser un revenu d'abonnement · libellé tier 3 ·
    covers Lullabies/Hybrid Fruit · 3 accents · descripteur Dilemma.
[ ] ★ NAV DANS LE LAYOUT + #music → /#music. À faire AVEC le bilingue.
[ ] ★ RATE-LIMIT contact 3/h par IP — probablement trop strict pour du booking. Rediscuter.
[ ] ★ ORDRE DES CHAMPS du formulaire : téléphone entre Email et Objet. À revoir si le
    formulaire paraît long sur mobile.
[ ] ★ AtelierGate : sr-only + aria-hidden contradictoires ; honeypot client-only.
[ ] ★ UNIFIER src/components/ et src/app/components/ — chantier propre, d'un coup.
[ ] ★ npm audit : 7 vulns dont 4 = un seul correctif (next@16.3.2, on est en 16.2.4).
    ⛔ JAMAIS `npm audit fix --force`. `npm install next@16.3.2` puis `npm run build`.
[ ] ★ 2FA sur Vercel ET GitHub — Vercel contrôle le DÉPLOIEMENT.
[ ] ★ A11Y : aria-label="Primary" · <label>Website</label> · tab-order des slides hors écran.
[ ] ★ LAWYER + CRESS IDF / Les Scop IDF : REFER vs OPERATE · licence d'entrepreneur.
[ ] ★ Templates Supabase restants (Invite/Change email/Reset password) — fuient supabase.co.
[ ] ★ Dead-man's-switch sur le keepalive. Parké.
[ ] ★ Analytics layer 1 (log_event RPC). Clarity DEFERRED (consentement).
[ ] Lyrics / partitions — PARKÉ (droits). Tour Builder — roadmap.
```

---

## INSTRUCTIONS FOR THIS AI

```
- Expliquer chaque commande + POURQUOI (analogies télécom). Une étape, attendre confirmation.
- ★ VÉRIFIER LA LIVRAISON AVANT DE CORRIGER LE CODE. Si le comportement contredit le code lu :
  le code servi est-il bien le code écrit ? (hot-reload, cache, déploiement, SQL appliqué).
  Et LIRE LES LOGS DU SERVEUR — les avertissements ne sont pas du bruit.
- ★ LIRE LA RUNNING-CONFIG AVANT D'ÉDITER : pg_proc pour un RPC, information_schema pour une
  table, le dashboard pour une config. Le fichier du repo est l'intention, pas l'état.
- ★ LIRE LE CODE QUI MARCHE avant de déboguer celui qui ne marche pas.
- ★ MESURER AVANT DE PROPOSER. Une hypothèse non vérifiée coûte un aller-retour.
- ★ UNE BARRIÈRE NE SE PROUVE QUE PAR UN REFUS, et le refus se confirme dans la TABLE
  (absence de la ligne), pas dans le retour de la fonction.
- ★ CHANGER LA SIGNATURE D'UN RPC : drop + create + RE-GRANT dans la même transaction.
  Nouveau paramètre EN DERNIER avec un défaut → rétro-compatible → déploiement en deux temps.
- ★ LA RÈGLE ÉPICÈNE EST UNE MÉTHODE : nom abstrait, groupe nominal, adjectif invariable
  ou verbe. Ne pas chercher « le bon mot ».
- ★ VALIDER LA FORME, JAMAIS L'ÉNUMÉRATION, dès qu'un domaine peut s'élargir (locale, téléphone).
- ★ LES DROITS SONT UN ÉTAT PAR USAGE. La barrière va dans le RPC, jamais dans le client.
- ★ NAMING : « Atelier » (standalone) / « l'Atelier » (en phrase). CTA « Accéder à l'Atelier ».
  « Atelier » = le produit fan-area. « Résonance » = la plateforme. Jamais l'un pour l'autre.
- ★ TYPOGRAPHIE : apostrophe courbe ’ dans tout texte affiché ; droite ou rien dans slugs,
  fichiers, URLs, valeurs DB, identifiants.
- ★ RÉSONANCE NE DÉTIENT NI NE REDISTRIBUE L'ARGENT DES FANS. Stripe Connect direct charges.
- ★ TITRES COMMUNAUTAIRES ≠ RÔLES D'AUTORISATION. Un badge n'accorde jamais une permission.
- ★ UN SEUL PROJET SUPABASE, ARTISTES = LIGNES. Toute table porte artist_id dès la création.
- ★ APRÈS TOUT `cp` DEPUIS ~/Downloads : vérifier le fichier REÇU (`head -3` / `wc -l`).
- ★ CHERCHER LE TEXTE, PAS LE NOM DE FICHIER : `grep -rn "chaîne" src/`. Et le grep est
  CASE-SENSITIVE : compter les zones, pas les résultats.
- ★ PRÉVENIR AVANT DE SIGNALER : contrainte visible AVANT l'erreur, puis erreur SOUS le
  champ (aria-invalid + aria-describedby + focus). Pour un champ FACULTATIF, la prévention
  (« tu peux laisser vide ») est le message principal, donc toujours visible.
- ★ UN LIBELLÉ « (facultatif) » VA DANS LE TEXTE, pas dans le style : un astérisque ou une
  nuance de gris n'est pas lu par un lecteur d'écran.
- ★ NOUVELLE PAGE = surcharger `alternates.canonical` (le layout en déclare un en dur).
- Verify-don't-assume : filesystem/git/DB/logs avant les notes. Un résumé de Claude Code est
  une AFFIRMATION, pas une preuve — `cat` et `git --no-pager diff` soi-même.
- ★ CLAUDE CODE vs MAIN : un brief scopé pour les changements COORDONNÉS sur un fichier
  (6+ points liés) ; édition à la main pour 3-4 lignes isolées (Ctrl+F comme ancre).
  Le SQL au dashboard n'est PAS du ressort de Claude Code — il ne voit que le filesystem.
  Un brief qui NOMME LE PIÈGE obtient un travail qui l'évite : lister explicitement les
  points à revérifier À L'ŒIL, ceux que `tsc` ne peut pas voir.
- Toute table raw-SQL → grant à authenticated ; anon uniquement via RPC security definer.
- Thème par tokens ; params d'URL Bandcamp = seule exception hex.
- Chaque page : SEO + WCAG AA + JSON-LD. PAS d'autoplay/auto-advance/boucle/popups.
- user_id/owner depuis la session auth, jamais le body. Zod partout. Pas de param `next`.
- Jamais Telegram (liens WhatsApp). Signaler les risques géographiques/institutionnels.
- Rappeler : avocat avant /legal (et REFER vs OPERATE) ; CRESS IDF + Les Scop IDF.
- Fin de session : demander si les instructions doivent évoluer ; proposer le CONTEXT_FOR_AI
  à jour ; rappeler la sync (cp vers Main_HDD Specs D'ABORD, puis ~/sync_resonance.sh).
```

---

## DEVELOPER ENVIRONMENT

```
Linux Mint · user simba · host ssd · Apple keyboard. Repo /home/simba/Projects/qiwichee.
★ TÉLÉCHARGEMENTS : /home/simba/Downloads (nom ANGLAIS, pas ~/Téléchargements).
★ ASSETS/SPECS : /media/Main_HDD/GDrive/Resonance/ (~/GDrive est MORT).
Sync : cp vers .../02_Produit_Tech/Specs/ PUIS ~/sync_resonance.sh, puis re-upload manuel
  du CONTEXT_FOR_AI dans les 4 Claude Projects (Dev / Strategy / Research / Qiwichee).
Node v22 · Next.js 16.2.4 (⚠️ middleware→proxy) · TS · Tailwind 4 @theme · @supabase/ssr.
★ DEV = http://localhost:3000. L'IP réseau bloque le hot-reload (voir learning 10).
★ VS CODE : l'extension Vim était ACTIVE (statut « -- NORMAL -- » en bas) et rendait toute
  frappe imprévisible. DÉSACTIVÉE le 2026-08-23. Si « -- NORMAL -- » réapparaît en bas à
  gauche, c'est ça. Le compteur d'erreurs est en bas à gauche : ⊗ erreurs · ⚠ warnings.
  Coller du code : Ctrl+Shift+V (sans reformatage) si l'indentation part en escalier.
  Prettier est installé mais format-on-save n'est PAS activé.
★ ÉDITION À LA MAIN : Ctrl+F sur une chaîne UNIQUE comme ancre, Échap, puis Fin/Entrée.
  ⚠️ Une ancre trop courante amène au mauvais endroit : `Email : ${email}` existe dans le
    corps du mail ET ressemble aux clés `p_email:` du RPC. Prendre une ancre DISTINCTIVE.
Presse-papier : xclip -selection clipboard < fichier   (le flag est obligatoire).
Fichiers longs : télécharger puis cp, JAMAIS de heredoc collé.
`git diff` ne montre PAS les fichiers non suivis — utiliser `git status`.
Grep depuis src/, pas src/app/. POSIX [[:alpha:]] au lieu de [A-Za-zÀ-ÿ].
```

---
*Updated 2026-08-23 · Une fonctionnalité modeste, une méthode qui ne l'est pas : lire la
running-config avant d'éditer, remettre les grants que le drop emporte, placer le paramètre
optionnel là où il rend la migration réversible, et ne croire une barrière que le jour où
elle refuse quelque chose. La fenêtre où cette migration était gratuite s'est refermée
derrière nous — c'est exactement pour ça qu'elle est passée devant des sujets plus urgents.*
