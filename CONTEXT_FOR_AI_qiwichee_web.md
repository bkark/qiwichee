# Résonance — AI Context File
> Paste/upload this at the start of any new conversation to resume instantly.

**Last updated:** 2026-08-22 — **CANAL DE CONTACT PRO LIVRÉ. PREMIÈRE PORTE NON-FAN DU SITE.**
Le site avait une porte fan (l’Atelier) et AUCUNE porte pro : un programmateur n’avait aucun
moyen d’écrire depuis qiwichee.com. Livré de bout en bout, vérifié en production. Ce qui change
structurellement :
(1) **STORE-AND-FORWARD** — la ligne en base est la vérité, le mail n’est qu’une notification ;
(2) **`contact_messages` = première table du PROJECT JOURNAL**, pas un formulaire jetable ;
(3) **décision bilingue tranchée** : contenu sortant → table de traductions, saisie entrante → colonne `locale` ;
(4) **URLs par langue** (FR racine, EN sous `/en`) — un cookie seul ne donne qu’une URL, donc pas d’indexation EN ;
(5) nouvelle leçon dure : **`tsc` valide un fichier VALIDE, pas le BON fichier**.
**Status:** qiwichee.com LIVE ✅ · Atelier gate ✅ · Magic links ✅ · Keepalive CRON ✅ ·
Release-switcher ✅ · Section BIO ✅ · **CONTACT PRO LIVE ✅** · SPF+DKIM+DMARC ✅ ·
Event-engine SQL ⛔ TOUJOURS UNRUN (et doit pointer vers `artists`)
**Commit du jour :** `56cab9e` (contact store-and-forward, 11 fichiers, déployé Ready 23 s)
**Next session goal (in order):** (1) **CHAMP TÉLÉPHONE** — décidé, non fait ; table encore
quasi vide donc gratuit MAINTENANT. (2) **MENTIONS LÉGALES + CONFIDENTIALITÉ** — bloquant légal.
(3) **BILINGUE next-intl** (décisions déjà prises, voir plus bas). (4) NAV DANS LE LAYOUT.
(5) LADDER & SEASONS. (6) `fans` MULTI-TENANT.

---

## 📮 CANAL DE CONTACT PRO — LIVRÉ 2026-08-22

```
POURQUOI : deux publics, deux besoins. Le fan veut appartenir (Atelier, déjà fait).
  Le PRO (programmateur, presse, collab) veut joindre l’artiste SANS COMPTE.
  ⛔ PAS de canal fan→artiste ouvert : charge de modération quotidienne, et ça double
     l’Atelier. Le canal pro était le seul manquant. UNE seule adresse, pas trois.
  `hello@qiwichee.com` existait déjà (OVH Email Pro) — c’était de la CONFIG manquante,
  pas de l’infra manquante.

★ ARCHITECTURE : STORE-AND-FORWARD, PAS CUT-THROUGH.
  1. Valider (Zod + honeypot)  2. PERSISTER (RPC)  3. Répondre  4. Notifier via after()
  Un formulaire qui appelle SMTP directement est du cut-through : le lien tombe, la trame
  est perdue, PERSONNE ne le sait. L’expéditeur voit « merci », l’artiste ne reçoit rien.
  C’est le pire mode de panne : il ne plante pas, il PERD EN SILENCE.
  Ici l’échec d’envoi devient un log rejouable, jamais une disparition.
  (Corollaire maison : les données d’abord dans Supabase, les fournisseurs ensuite.)

SCHÉMA (docs/briefs/contact_messages.sql — ✅ LANCÉ ET VÉRIFIÉ) :
  contact_messages  artist_id (NOT NULL, FK → artists) · sender_name · sender_email ·
                    subject ('concert'|'presse'|'collaboration'|'autre') · message ·
                    locale · status ('new'|'read'|'replied'|'archived') · handled_at ·
                    ip_hash · created_at
  submit_contact_message(slug, name, email, subject, message, locale, ip_hash)
    security definer · returns jsonb · execute → anon + authenticated

★ IL NE LÈVE PAS D’EXCEPTION, IL RETOURNE UN VERDICT {ok, reason}.
  Une exception dans un security definer ressort par PostgREST en erreur Postgres brute :
  illisible côté route, et ça fuite l’implémentation. Un jsonb se mappe sur un code HTTP.

★ RATE-LIMIT DANS LE RPC : 3/h par ip_hash, 30/h par artiste.
  VÉRIFIÉ PAR UN REFUS (3 succès puis {"ok":false,"reason":"rate_limited"}).
  Le chemin heureux seul ne prouve PAS que la barrière existe.
  ⚠️ ip_hash est un PARAMÈTRE de l’appelant : un attaquant qui appelle le RPC directement
     peut le varier et contourner le plafond IP. Le plafond PAR ARTISTE est le vrai filet.
     Acceptable ici, insuffisant à fort trafic. Ne pas prétendre que c’est étanche.
  ⚠️ 3/h est probablement TROP STRICT pour du booking (un festival = plusieurs personnes
     derrière une même IP). À rediscuter.

★ RLS ACTIVE, AUCUNE POLICY = DENY-ALL, ET C’EST DÉLIBÉRÉ.
  Une policy de lecture dirait « cet utilisateur peut lire les messages de SON artiste ».
  Or LE LIEN COMPTE↔ARTISTE N’EXISTE PAS : `artists` porte id/slug/name, rien qui rattache
  un compte auth. L’écrire aujourd’hui = inventer ce lien dans une clause WHERE, le pire
  endroit pour le définir. Lecture via dashboard (service role) en attendant.
  → MÊME FAMILLE QUE `owners` vs `artists`. À trancher ensemble.

★ ip_hash : SHA-256 AVEC SEL (IP_HASH_SALT), jamais l’IP en clair.
  Sans sel, un hash d’IPv4 se casse en secondes (4 milliards de possibilités) — ce serait
  un déguisement, pas une protection. Le sel ne se fait PAS tourner : le changer rend les
  anciens hashs INCOMPARABLES (pas invalides). Il se documente, il ne se gère pas.

FICHIERS :
  src/lib/mailService.ts              abstraction fournisseur (OVH aujourd’hui, Brevo demain)
  src/app/api/contact/route.ts        runtime='nodejs' + dynamic='force-dynamic'
  src/app/contact/page.tsx            mailto visible + JSON-LD ContactPoint
  src/app/components/ContactForm.tsx  validation par champ, copie en objet plat
  src/app/components/SiteFooter.tsx   dans le LAYOUT → présent partout

★ FROM = LA BOÎTE AUTHENTIFIÉE, TOUJOURS. REPLY-TO = L’EXPÉDITEUR RÉEL.
  Mettre l’adresse du visiteur en From casse SPF/DKIM (qiwichee.com n’autorise pas
  gmail.com à envoyer en son nom) → spam ou rejet. Même raisonnement que les templates
  Supabase sur le domaine de l’artiste.

★ 587 = STARTTLS ⇒ secure:false + requireTLS:true. secure:true est pour le 465 (TLS
  implicite) et fait échouer la poignée de main avec une erreur illisible. Piège classique.
  VÉRIFIÉ dans la trace : OVH n’annonce AUTH LOGIN qu’APRÈS le chiffrement.

★ TIMEOUTS 10 s MALGRÉ UN PLAFOND VERCEL À 300 s.
  Le plafond généreux ne supprime pas le besoin de timeout, il en CHANGE LA RAISON :
  ce n’est plus « ne pas se faire couper », c’est « NE PAS PENDRE » (une fonction
  facturée 5 min pour un mail déjà mort).

★ after() DÉPLACE LA LATENCE, IL NE GARANTIT PAS LA LIVRAISON.
  Natif dans Next 15.1+ (`import { after } from 'next/server'`), pas de @vercel/functions.
  Les promesses héritent du timeout de la fonction. Si l’envoi échoue, le visiteur a déjà
  lu « envoyé » → d’où le log avec l’id. Ces deux propriétés sont souvent confondues.

★ LE HONEYPOT EST VÉRIFIÉ CÔTÉ SERVEUR (celui d’AtelierGate est CLIENT-ONLY).
  `if (honeypot) return` dans React ne voit jamais un bot qui poste sur /api/contact.
  Si le seul champ en faute est `website` → on répond 200 « envoyé » SANS RIEN ÉCRIRE :
  lui dire qu’il a échoué l’aiderait à s’adapter.
  Convention partagée avec AtelierGate : name="website", tabIndex={-1}, autoComplete="off".
  ⚠️ AtelierGate combine sr-only ET aria-hidden — CONTRADICTOIRE (« visible pour les
     lecteurs d’écran » + « invisible pour eux »). Ça marche par accident. Le nouveau
     formulaire masque par CSS explicite. À corriger dans AtelierGate.

★ UN CRAWLER NE REMPLIT PAS DE FORMULAIRE.
  En choisissant le formulaire on gagne l’intake structuré et on PERD la découvrabilité.
  D’où mailto visible + ContactPoint JSON-LD server-rendered. Coût assumé : l’adresse est
  moissonnable. Mais une adresse de booking cachée est une adresse inutile.
  ⚠️ page.tsx SURCHARGE alternates.canonical : le layout en déclare un EN DUR vers la
     racine, donc sans surcharge /contact se déclarerait canonique vers l’accueil et ne
     serait jamais indexée. VÉRIFIER CE PIÈGE SUR CHAQUE NOUVELLE PAGE.

VÉRIFIÉ EN PRODUCTION (le 2026-08-22) : ligne en base + mail reçu sur hello@,
  rate-limit déclenché au 4e envoi. OVH accepte les connexions SMTP depuis Vercel —
  cette inconnue est levée (une box qui marche ne prouve pas qu’un datacenter marche).
  created_at en UTC (`+00`) : normal et voulu. Conversion à l’AFFICHAGE, pas au stockage —
  seul choix qui tienne avec des fans aux USA.

⛔ BLOQUANT AVANT TOUTE MISE EN AVANT (pas avant le code) :
  MENTIONS LÉGALES (LCEN — obligatoires sur tout site public, et SUBSTANTIELLES dès la
  SASU : dénomination, SIREN, capital, siège, directeur de publication, hébergeur) ·
  POLITIQUE DE CONFIDENTIALITÉ liée sous le bouton d’envoi, portant la RÉTENTION 24 MOIS.
  Pas de cron de purge : on n’automatise pas la suppression de lignes qui n’existent pas.
  Le footer ne porte AUCUN lien légal aujourd’hui — un lien mort est pire que pas de lien.

⛔ ET : `hello@` DOIT ÊTRE RELEVÉ SUR LE TÉLÉPHONE DE QIWI CHEE (IMAP pro2.mail.ovh.net,
  993 SSL, notifications actives). Un formulaire qui classe dans une boîte que personne
  n’ouvre RECONSTRUIT LE SILENCE, en plus cher. Bassim relève aussi.

À FAIRE (décidé, non fait) :
  · CHAMP TÉLÉPHONE optionnel. Touche 4 endroits (ALTER TABLE, RPC, route, form).
    ⚠️ `create or replace function` ne remplace QUE si la signature est identique :
       ajouter un paramètre crée une SURCHARGE et PostgREST ne sait plus laquelle appeler.
       → `drop function` explicite AVANT de recréer.
    ⚠️ Un numéro est une donnée personnelle : même rétention, même politique.
    ★ Table quasi vide aujourd’hui = migration GRATUITE. Dans deux mois, non.
  · NAV ABSENTE SUR /contact → cul-de-sac. Palliatif posé : lien « ← Qiwi Chee » en haut
    et dans l’écran de succès. LA VRAIE CORRECTION est de remonter la nav dans le LAYOUT
    (comme le footer), en transformant #music/#about en /#music//#about.
    ⚠️ À faire AVEC le bilingue : le sélecteur de langue vit dans la nav.
  · AUTOFILL : Chrome remplit le nom, pas l’email. TESTÉ : même comportement sur d’autres
    sites → profil Chrome, PAS notre code. Le déplacement du honeypot en fin de formulaire
    n’a rien changé (gardé quand même, sans effet négatif). NE PAS Y REPASSER DE TEMPS.
```

---

## 🌍 BILINGUE — DÉCISIONS PRISES 2026-08-22 (implémentation à venir)

```
CONTEXTE : Qiwi Chee a demandé une version anglaise — elle a des fans aux USA.
Trilingue possible (arabe) vu le parcours franco-algérien-américain.

★ RÈGLE QUI DÉCIDE TOUT : AJOUTER UNE LANGUE DOIT ÊTRE DES LIGNES, PAS UNE MIGRATION.
  C’est « ajouter une plateforme = une ligne » appliqué aux langues. Ça DISQUALIFIE le
  pattern colonnes (title_fr, title_en) : il marche à deux langues, coûte un ALTER TABLE
  + un déploiement à la troisième, et oblige chaque requête à connaître la liste.

1. CONTENU SORTANT (bio_blocks) → TABLE DE TRADUCTIONS, une ligne par (bloc, langue).
   ⇒ LA DÉCISION DE SCHÉMA PARKÉE SUR bio_blocks EST TRANCHÉE.
2. SAISIE ENTRANTE (contact_messages) → COLONNE `locale`. Un message a UNE langue et le
   traduire n’a aucun sens ; ce qu’on veut savoir c’est DANS QUELLE LANGUE RÉPONDRE.
   ★ Les deux se ressemblent et sont OPPOSÉS. Les confondre = une table de traductions
     vide sur 100 % des messages.
3. PAS de check (locale in ('fr','en')) : on valide la FORME (regex BCP-47 `^[a-z]{2}
   (-[A-Z]{2})?$`), pas la liste. L’arabe = zéro ALTER TABLE. Déjà appliqué.
4. URLS PAR LANGUE : FR à la racine (URLs actuelles INCHANGÉES, rien à ré-indexer),
   EN sous /en, plus les balises hreflang.
   ★ UNE BASCULE PAR COOKIE / Accept-Language SEULE NE DONNE QU’UNE URL : Google et les
     agents n’indexent qu’une version, et l’anglaise N’EXISTE PAS dans les résultats.
     Traduire sans URL distincte ne rend PAS l’artiste trouvable aux USA — c’était tout
     l’objet de la demande. La détection navigateur devient une redirection à la PREMIÈRE
     visite, pas le mécanisme de fond.
5. FORME DE LA COPIE, DÉJÀ APPLIQUÉE dans ContactForm/SiteFooter : un seul objet plat en
   haut du composant, clés anglaises, valeurs françaises. Ce n’est pas next-intl, c’est la
   FORME qu’il attend → se déplace dans fr.json par copier-coller, zéro chaîne à extraire.

⚠️ NON VÉRIFIÉ : next-intl passe par le middleware, et Next 16 affiche déjà l’avertissement
   middleware→proxy. À vérifier AU MOMENT de l’installer, pas à supposer.
⚠️ SI ARABE UN JOUR : ce n’est pas un problème de traduction mais de LAYOUT RTL (dir="rtl",
   miroir des flèches de carrousel). Ne se prépare pas aujourd’hui, mais SE SAIT aujourd’hui :
   ne jamais coder « flèche suivante = à droite » en dur.
```

---
## 🖼️ MODULE BIO — LIVRÉ 2026-08-21

```
CE QUE C’EST : des couples texte/photo, ordonnés à la main, en carrousel horizontal.
DEUX RENDUS SUR LA MÊME SOURCE : le carrousel web (fait) et le PRESS KIT PDF (à venir).
Un press kit n’est pas un second module — c’est une seconde vue des mêmes lignes.

SCHÉMA (docs/briefs/bio_blocks.sql — ✅ LANCÉ ET VÉRIFIÉ, pas seulement committé) :
  artists      id · slug · name · created_at          ← ANCRE MULTI-TENANT
  bio_blocks   artist_id (NOT NULL, FK) · slug · sort_order · title · body ·
               image_path · image_hd_path · image_alt (NOT NULL) ·
               credits jsonb [{role,name}] ·
               rights_web_confirmed · rights_press_confirmed · rights_note ·
               usage_scope ('web'|'presskit'|'both') · is_published
  get_bio_blocks(p_artist_slug, p_usage)  security definer, execute → anon + authenticated

★ LA BARRIÈRE DE DROITS EST DANS LE RPC, PAS DANS LE CLIENT.
  Un bloc n’est renvoyé que si le droit correspondant à l’usage DEMANDÉ est vrai.
  Le futur rendu press kit ne PEUT PAS publier une photo non autorisée — ce n’est pas
  une consigne qu’un dev pourrait oublier, c’est une impossibilité côté base.
  (Télécom : on filtre sur le routeur, pas sur le poste client.)
  VÉRIFIÉ : web → 7 · presskit → 0 · artiste inconnu → 0.

CONTENU : 7 blocs, photos de MAËLYS JIBIDAR (série « Une dernière chose »).
  1 qui-je-suis · 2 entre-quatre-villes (Honolulu, San Diego, Alger, Paris) ·
  3 britney-et-elliott · 4 ce-que-je-n-aime-pas · 5 ce-que-j-aime ·
  6 avant-il-y-a-eu-boston (zoo de Boston) · 7 une-derniere-chose (guitare, saxo, cerf-volant)
  usage_scope : 1,2,3,6 = both · 4,5,7 = web (trop intimes pour un dossier professionnel)
  ★ C’EST LE CONTENU RÉEL QUI A TRANCHÉ `usage_scope`, pas la théorie. Toujours dans ce sens.

COMPOSANTS : src/app/components/BioSection.tsx (serveur : RPC + Zod + console.error)
             src/app/components/BioSwitcher.tsx (client : carrousel)
             src/lib/constants.ts (ARTIST_SLUG)
  Départ TOUJOURS sur le premier bloc (une bio a un début — contrairement au carrousel
  musique qui démarre au hasard). PAS de recoloration par slide (signature de la musique).

⚠️ DROITS PHOTO — ÉTAT RÉEL :
  Usage WEB : accordé oralement par Maëlys Jibidar (août 2026). Consigné dans rights_note.
  Usage PRESSE : NON DEMANDÉ. Mail rédigé, à envoyer — de préférence SIGNÉ PAR QIWI CHEE
    (une photographe répond à l’artiste ; un tiers déclenche une grille tarifaire).
  FICHIERS HD : N’EXISTENT NULLE PART. Les 7 fichiers plafonnent à 1600 px (compression
    WhatsApp), y compris la copie « archive » du Drive. Si le disque de Maëlys tombe,
    la séance est perdue. image_hd_path reste null. → DEMANDE URGENTE.
  Transfert à demander par LIEN (WeTransfer/SwissTransfer/Drive), JAMAIS par WhatsApp,
    Instagram ou iMessage « format réduit » : les trois recompressent en silence.
```

---

## 🎚️ ENGAGEMENT LADDER — PASSE PARTIELLE 2026-08-21

```
★ RÈGLE ÉPICÈNE — REFORMULÉE EN MÉTHODE (remplace « trouve un mot épicène », qui échoue
  par construction puisqu’il demande de deviner) :

  1. Le libellé désigne-t-il une PERSONNE ? → il a un féminin → RÉÉCRIS.
  2. Réécris en : NOM ABSTRAIT · GROUPE NOMINAL · ADJECTIF INVARIABLE · VERBE.

  Un abstrait n’a pas de genre social. C’est épicène PAR CONSTRUCTION, pas par chance.
  (« Archiviste » était correct par accident — rien dans l’ancienne méthode ne le garantissait.)

  ⛔ PASSEUR → ✅ BOUCHE-À-OREILLE   (passeur/passeuse ; le badge dit « amène d’autres fans »)
  ✅ Fidèle à l’écoute · Présence constante · Mémoire de l’Atelier · De la première heure
  ❌ Créateur · Ambassadeur · Habitué · Passeur

  NOTE : une artiste qui se décrit à la 1ʳᵉ personne (« passeuse entre les cultures »)
  n’est PAS concernée. La règle vise les libellés que LA PLATEFORME applique à des fans.

TROIS PALIERS — et un seul mot restait à trouver :
  visiteur  → jamais affiché (état « pas de gate »). Rien à corriger.
  membre    → déjà épicène. Rien à corriger.
  abonne    → SEUL vrai sujet, et c’est le seul palier qui n’existe pas encore.
  ★ VALEURS DB : 'visiteur' | 'membre' | 'abonne' — texte machine, règle épicène NON applicable.
  ★ LIBELLÉ AFFICHÉ : une seule constante de copy. Ne bloque AUCUN développement.
    Candidat : « Complice ». Alternative : ne pas nommer du tout — l’abonnement reste un
    ÉTAT du membre, pas une identité. Décision de Qiwi Chee.

BADGES : DÉRIVÉS de visit_count et joined_at à la lecture, JAMAIS STOCKÉS.
  Une table de badges attribués est un état dupliqué qui diverge de son propre compteur,
  et changer un seuil obligerait à rejouer l’historique. (On ne stocke pas la table de
  routage, on la calcule depuis les états d’adjacence.)
  Seuils validés : 5 · 15 · 30 visites.

SAISONS — objet minimal :
  seasons  id · artist_id · slug · title · subtitle · starts_at · ends_at · status ·
           finale_event_id · created_at
  ⛔ PAS de currentPhase/phases Json : la progressive revelation se DÉRIVE de l’état réel.
  ⛔ PAS de table `rituals` : un rituel qui se répète est une RÈGLE, pas une ligne.

RYTHME RITUEL — corrigé à la baisse par rapport au document importé :
  1×/semaine  un signe de vie (texte court, photo d’atelier)     ~10 min
  1×/mois     un rendez-vous vivant (live ou vote)               ~1 h
  1×/saison   la finale (le concert)
  ★ Kimi proposait 3 rendez-vous/semaine — rythme d’équipe éditoriale, pas d’artiste seule.
    Un battement hebdomadaire TENU vaut mieux que trois annoncés et deux honorés. On peut
    densifier plus tard ; on ne peut pas raréfier sans que ça se lise comme un abandon.

★ MODE DÉGRADÉ (retenu du document Kimi) : si l’artiste ne confirme pas sa présence 2 h
  avant un rituel, le système envoie une annulation stylisée. Dead-man’s switch appliqué
  à l’engagement : la promesse au fan ne meurt jamais en silence.
```

---

## 📥 DOCUMENT KIMI — TRIAGE 2026-08-21

```
GARDÉ : la bibliothèque d’activités + le rythme rituel (matière de la passe ladder) ·
        le mode dégradé · privacyLevel sur le fan (RGPD dès le modèle) ·
        la confirmation indépendante du split fan/membership.

JETÉ : Prisma (perte de la RLS — un `where artistId` oublié = fuite cross-artiste ;
       la RLS Postgres ne s’oublie pas) · NextAuth · Next 14 · Cloudflare R2 · OpenAI ·
       les 6 paliers anglais non épicènes · l’habillage Tolkien (Fellowship/Red Book/runes :
       choix créatif appartenant à l’artiste, et vocabulaire adjacent à une IP défendue).

⛔ DEUX DRAPEAUX ROUGES :
  1. `Treasury` avec status='distributed' + vote des fans sur les allocations = Résonance
     DÉTIENT ET REDISTRIBUE l’argent des fans. C’est la définition de l’intermédiation
     (DSP2/ACPR). Version acceptable : Treasury en LECTURE SEULE, miroir descriptif du
     compte Stripe DE L’ARTISTE. Aucun solde chez nous.
  2. La billetterie du « Mois 3 » fait tomber l’exemption microentreprise de l’EAA
     (WCAG AA devient une obligation légale) ET rouvre la licence d’entrepreneur de
     spectacles. Plus chargebacks et responsabilité de remboursement.

★ Et le tier 3 est placé au « Mois 1 » alors qu’il est bloqué non par Stripe mais par
  le STATUT LÉGAL de Qiwi Chee pour encaisser ce revenu. Toujours sans réponse.
```

---

## 🔑 HARD-WON LEARNINGS (standing)

```
1. LE CHEMIN SOURCE DU SCRIPT DE BACKUP est la seule vérité sur ce qui est sauvegardé.
2. QUAND DEUX CALCULS DU MÊME NOMBRE DIVERGENT, re-dériver depuis la formule.
3. FLEXBOX MIN-WIDTH TRAP : wrapper entre contrainte de largeur et scroller flex →
   min-w-0 / max-w-full. overscroll-behavior ne contraint pas une largeur.
4. Un fichier coupé à une taille exactement en puissance de deux = copie interrompue.
5. Quarantaine-puis-suppression bat rm direct.
6. Les invocations de cron Vercel SONT loguées sous Observability → Cron Jobs.
7. LES DOCUMENTS DE STRATÉGIE IMPORTÉS PORTENT UN VOCABULAIRE ÉTRANGER. Input, pas spec.
8. UNE RÈGLE ÉNONCÉE COMME UN TIMING EST SOUVENT UN PROXY POUR UNE RÈGLE DE STRUCTURE.
9. LA CONFIG PLATEFORME EST PAR PROJET, PAS PAR TENANT (Site URL, templates, SMTP).

★ 10. (2026-08-21) **CODE ÉCRIT ≠ CODE SERVI.** Trois heures perdues sur un carrousel qui
   ne défilait pas. Cause réelle : Next.js bloque le hot-reload en cross-origin. Le site
   était testé depuis 192.168.1.5:3000 au lieu de localhost:3000, donc le navigateur
   servait le CSS compilé AVANT les modifications. Trois corrections successives ont été
   appliquées à un code qui n’avait aucun problème.
   ⚠️ L’AVERTISSEMENT ÉTAIT DANS LES LOGS DU SERVEUR DÈS LE PREMIER DÉMARRAGE
   (« Blocked cross-origin request to /_next/webpack-hmr »). On a lu le CSS, le DOM et le JS —
   jamais la sortie du serveur.
   MÊME FAMILLE QUE : « committé ≠ appliqué » (SQL) et « env var enregistrée ≠ déployée » (Vercel).
   L’ARTEFACT ET SA LIVRAISON SONT DEUX CHOSES DISTINCTES.
   RÈGLE : quand le comportement observé contredit le code lu, vérifier que le code lu est
   bien celui qui est servi — AVANT de corriger quoi que ce soit.
   Corollaire : dev = localhost. Test mobile depuis l’IP = redémarrer le serveur à chaque
   modification, ou ajouter allowedDevOrigins dans next.config.js (⚠️ IP en DHCP, elle change).

★ 11. (2026-08-21) QUAND DEUX CHOSES IDENTIQUES SE COMPORTENT DIFFÉREMMENT, ce n’est pas le
   code qui diffère — c’est ce qui est réellement servi. BioSwitcher et ReleaseSwitcher
   étaient structurellement identiques ; l’un défilait, l’autre non. La comparaison
   structurelle a été le moment où le diagnostic a basculé.
   ★ ET : ON AVAIT UN CARROUSEL QUI MARCHE À TROIS FICHIERS DE DISTANCE, ON NE L’A PAS LU.
     Lire le code qui fonctionne AVANT de déboguer celui qui ne fonctionne pas.

★ 12. (2026-08-21) `position` EST UN MOT-CLÉ POSTGRES à géométrie variable : accepté comme
   NOM DE COLONNE, refusé comme PARAMÈTRE DE SORTIE d’une fonction (`returns table`).
   Erreur 42601. Renommé en `sort_order`. Le sed a utilisé \b pour protéger l’index dont
   le nom contenait `position` entre underscores.
   ★ La leçon générale : ne pas spéculer sur un mot-clé — LANCER et lire l’erreur.

★ 13. (2026-08-21) LES DROITS NE SONT PAS UN ÉTAT DE L’ŒUVRE, MAIS UN ÉTAT PAR USAGE.
   Un booléen `rights_confirmed` unique force à choisir entre bloquer un usage accordé et
   autoriser un usage qui ne l’est pas. CE BUG NE PLANTE PAS — IL PUBLIE. C’est le pire type.
   → Un booléen par usage, et la vérification dans le RPC, pas dans le client.

★ 14. (2026-08-21) LE RÉSUMÉ DE CLAUDE CODE N’EST PAS LE DIFF — confirmé deux fois dans la
   même session : sur demande explicite des fichiers complets, il a répondu par une
   description de trois lignes en concluant « tout est conforme ». Et il a proposé de
   committer alors que la consigne « ne commite pas » était dans le brief.
   → `cat` et `git --no-pager diff` soi-même. C’est plus rapide que d’insister.

★ 15. (2026-08-22) **`tsc --noEmit` VALIDE UN FICHIER *VALIDE*, PAS LE *BON* FICHIER.**
   Un vieux page.tsx (2 mois, une ancienne version de l’accueil) traînait dans ~/Downloads.
   Le `cp` l’a installé dans src/app/contact/. `npx tsc --noEmit` est passé AU VERT :
   le fichier compilait parfaitement — ce n’était simplement pas le bon. Découvert seulement
   parce qu’un grep sur du TEXTE a remonté deux résultats au lieu d’un.
   MÊME FAMILLE QUE : « committé ≠ appliqué », « env var enregistrée ≠ déployée »,
   « code écrit ≠ code servi ». L’ARTEFACT ET SA LIVRAISON SONT DEUX CHOSES DISTINCTES.
   ⚠️ AGGRAVANT : `page.tsx` et `route.ts` sont des noms GÉNÉRIQUES. Un dossier Downloads
      en contient vite plusieurs versions, et Chrome écrase parfois au lieu de renommer.
   RÈGLE : après tout `cp` depuis Downloads, VÉRIFIER LE FICHIER REÇU — `head -3` (le
   chemin est en commentaire d’en-tête) ou `wc -l` contre la taille attendue. Un contrôle
   de types n’est PAS un contrôle d’identité.

★ 16. (2026-08-22) **CHERCHER LE TEXTE, PAS LE NOM DE FICHIER.**
   `ls src/components/` n’a montré aucun footer, j’ai donc conclu qu’il n’y en avait pas
   et j’en ai créé un. Il y en avait un, écrit EN DUR dans src/app/page.tsx — deux footers
   empilés à l’écran. Un `grep -rn "rights reserved" src/` l’aurait trouvé en une seconde.
   COROLLAIRE DE « lire le code qui marche » : encore faut-il le CHERCHER correctement.
   Un composant global écrit dans une page ne porte pas le nom qu’on cherche.
   ★ ET ÇA A RÉVÉLÉ UNE ASYMÉTRIE PLUS LARGE : le footer était dans une page, la nav L’EST
     ENCORE. Tant qu’il n’y a qu’une page, ça ne se voit pas. À la deuxième page, /contact
     s’est retrouvée SANS NAVIGATION — un cul-de-sac.

★ 17. (2026-08-22) **UN MESSAGE D’ERREUR EXACT PEUT ÊTRE INUTILISABLE.**
   « Certains champs sont incomplets » était rigoureusement vrai et sans valeur : le
   visiteur ne savait ni QUEL champ ni POURQUOI. La route renvoyait pourtant déjà la liste
   des champs fautifs — le formulaire la JETAIT.
   DEUX NIVEAUX, DANS CET ORDRE : (1) PRÉVENIR — afficher la contrainte AVANT l’erreur
   (« au moins 10 caractères » + compteur) ; (2) SIGNALER — sous le champ concerné, avec
   aria-invalid + aria-describedby + focus sur le premier fautif.
   La meilleure erreur est celle qui n’arrive jamais. Signaler sans prévenir est un pansement.

★ 18. (2026-08-22) **DEUX DOSSIERS DE COMPOSANTS COEXISTENT** — `src/components/`
   (AtelierGate, CitiesPicker) et `src/app/components/` (Bio*, Brand*, Embed*, External*,
   Release*, + Contact*/SiteFooter). Non dramatique, mais ça coûtera un grep raté.
   Choix du jour : suivre la MAJORITÉ existante (src/app/components/) plutôt que la
   convention idéale. Unifier est un chantier PROPRE, à faire d’un coup — pas en douce
   au milieu d’une feature.
```

---

## 🗄️ SUPABASE ARCHITECTURE — UN SEUL PROJET PARTAGÉ

```
DÉCIDÉ 2026-08-04, ANCRÉ 2026-08-21 : `artists` existe enfin (id, slug, name).
Toutes les tables créées à partir de maintenant portent artist_id NOT NULL → artists(id).

⚠️ CONFLIT À RÉSOUDRE AVANT DE LANCER LE MOTEUR D’ÉVÉNEMENTS :
  event_engine.sql (committé, non lancé) crée une table `owners`. `artists` existe
  désormais. DEUX TABLES D’ANCRAGE = deux VLAN portant le même segment sur un trunk.
  → DÉCIDER : soit event_engine pointe vers `artists`, soit on renomme. Ne pas lancer avant.
  (Nommage retenu : « owner » décrit un RÔLE d’autorisation ; « artist » décrit l’ENTITÉ.
   La règle « titres communautaires ≠ rôles d’autorisation » plaide pour les séparer.)

⚠️ `fans` N’A TOUJOURS PAS DE artist_id. L’écart se creuse : les nouvelles tables sont
  propres, `fans` ne l’est pas. Migration : add nullable → backfill Qiwi Chee → NOT NULL → RLS.

★ CORRECTION D’UNE NOTE ANTÉRIEURE : `tier` va sur **atelier_members**, PAS sur `fans`.
  `fans` = une personne. `atelier_members` = une relation fan↔artiste. Un abonnement est
  une propriété de LA RELATION — sinon un abonné chez Qiwi Chee serait abonné partout.

SEND EMAIL HOOK : toujours sur le chemin critique, toujours ce qui débloque l’artiste #2.
```

---

## 🎠 CAROUSELS — DEUX, ET ILS DOIVENT RESTER JUMEAUX

```
ReleaseSwitcher (musique)  : départ ALÉATOIRE (client-side), recoloration par slide,
                             source = src/data/releases.ts, lecteur audio.
BioSwitcher (bio)          : départ TOUJOURS au premier, PAS de recoloration,
                             source = RPC Supabase, pas de lecteur.

MÉCANISME COMMUN (identique, volontairement) : scroll-snap CSS, slides 88 % + snap center,
  scrollToSlide via target.offsetLeft, flèches .carousel-arrow partagées, wrapper
  "relative w-full max-w-full min-w-0 overflow-hidden", pas de boucle, pas d’auto-scroll.

★ RÈGLE : la CLASSE CSS de flèche se partage (apparence) ; le COMPOSANT ne se partage pas
  (comportement). Deux carrousels doivent avoir des flèches identiques ; ils ne doivent pas
  avoir la même logique. Un composant qui porte deux récits finit par mal servir les deux.
```

---

## 🇫🇷 COPIE — PASSE FRANÇAISE 2026-08-21

```
Site entièrement en français. `lang="fr"` corrigé (il valait "en" alors que og:locale
disait déjà fr_FR — contradiction silencieuse, lecteur d’écran en voix anglaise).
  nav : Musique · À propos        h2 : À propos · Musique
  hero : « Autrice-compositrice-interprète indépendante. Pop alternative, en français
         et en anglais. »
  meta/JSON-LD (description longue, garde le référencement local) :
    « Autrice-compositrice-interprète indépendante, basée à Paris. Pop alternative
      franco-algérienne-américaine, en français et en anglais. »
  genre : « Hybrid Pop » → « Pop alternative » (le point PARKÉ est débloqué, 3 endroits).
  titres : « Qiwi Chee — Pop alternative »
ORDRE DES SECTIONS : hero → AtelierGate → À propos (bio) → Musique.
  ★ La porte de l’Atelier reste AU-DESSUS de la bio : capter la relation avant de raconter.

⚠️ DETTE A11Y — CHAÎNES ANGLAISES INVISIBLES À L’ŒIL MAIS LUES PAR LES LECTEURS D’ÉCRAN :
  aria-label="Primary" (nav) · <label>Website</label> (honeypot, sr-only).
  Jamais repérées en relecture visuelle. → passe accessibilité.

⚠️ BILINGUE : demandé pour la bêta. Touche bio_blocks (colonnes de traduction OU table
  de traductions — décision de schéma à prendre DANS cette session). La version française
  actuelle deviendra fr.json. Plus la dépréciation middleware→proxy qui s’affiche à
  chaque démarrage du serveur.
```

---

## OPEN DECISIONS / NEXT ACTIONS

```
[x] ★★ MODULE BIO — schéma lancé + composant déployé (8d0eb1b, 12834d1). CLOSED.
[x] ★★ TABLE `artists` — ancre multi-tenant créée. CLOSED.
[x] ★ RÈGLE ÉPICÈNE reformulée en méthode · Passeur → Bouche-à-oreille. CLOSED.
[x] ★ `tier` sur atelier_members, pas sur fans. CLOSED.
[x] ★ Genre « Hybrid Pop » → « Pop alternative ». CLOSED (était parké).

[x] ★★ CANAL DE CONTACT PRO — table + RPC + route + formulaire, vérifié en prod (56cab9e). CLOSED.
[x] ★★ BILINGUE : décisions de schéma + d’URL prises (traductions / locale / URLs par langue). CLOSED.

[ ] ★★ MENTIONS LÉGALES + POLITIQUE DE CONFIDENTIALITÉ (LCEN + RGPD, rétention 24 mois).
    BLOQUANT avant toute mise en avant du formulaire. Substantielles dès la SASU.
[ ] ★★ CHAMP TÉLÉPHONE optionnel — décidé. Table quasi vide = GRATUIT maintenant.
    ⚠️ drop function avant recreate (surcharge PostgREST).
[ ] ★★ QIWI CHEE : hello@ sur son téléphone, notifications actives. Sinon le canal est mort.
[ ] ★★ ENVOYER LE MAIL À MAËLYS JIBIDAR : fichiers HD + autorisation presse.
    Signé par Qiwi Chee de préférence. AUCUNE COPIE HD N’EXISTE — priorité.
[ ] ★★ BILINGUE FR/EN next-intl — demandé pour la bêta. Inclut la décision de schéma
    sur la traduction de bio_blocks, et middleware→proxy.
[ ] ★★ RÉSOUDRE `owners` vs `artists` avant de lancer event_engine.sql.
[ ] ★★ `fans` MULTI-TENANT MIGRATION.
[ ] ★★ LADDER — finir : libellé du tier 3 (Qiwi Chee), jeu de badges complet.
[ ] ★★ SEND EMAIL HOOK — débloque l’artiste #2.
[ ] ★ PRESS KIT PDF — second rendu de bio_blocks. Bloqué sur les fichiers HD, pas sur le code.
[ ] ★ CAROUSEL V2 (song-per-slide + credits structurés + Bandcamp two-click).
[ ] ★ ASK QIWI CHEE : statut légal pour encaisser un revenu d’abonnement (gate tier 3) ·
    libellé du tier 3 · covers Lullabies/Hybrid Fruit · 3 accents · descripteur Dilemma.
[ ] ★ NAV DANS LE LAYOUT (comme le footer) + #music → /#music. À faire AVEC le bilingue.
[ ] ★ RATE-LIMIT contact 3/h par IP — probablement trop strict pour du booking. Rediscuter.
[ ] ★ AtelierGate : sr-only + aria-hidden contradictoires sur le honeypot ; honeypot client-only.
[ ] ★ UNIFIER src/components/ et src/app/components/ — chantier propre, d’un coup.
[ ] ★ npm audit : 7 vulns dont 4 = un seul correctif (next@16.3.2, on est en 16.2.4).
    ⛔ JAMAIS `npm audit fix --force`. `npm install next@16.3.2` puis `npm run build`.
    Concerne directement : bypass middleware/proxy (le bilingue en écrira), cache poisoning RSC.
[ ] ★ 2FA sur Vercel ET GitHub — Vercel contrôle le DÉPLOIEMENT : y entrer, c’est REMPLACER
    le site de l’artiste. On protège le routeur de bordure avant le serveur.
[ ] ★ A11Y : aria-label="Primary" · <label>Website</label> · tab-order des slides hors écran.
[ ] ★ LAWYER + CRESS IDF / Les Scop IDF : REFER vs OPERATE · licence d’entrepreneur.
[ ] ★ Templates Supabase restants (Invite/Change email/Reset password) — fuient supabase.co.
[ ] ★ Dead-man’s-switch sur le keepalive. Parké.
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
- ★ LIRE LE CODE QUI MARCHE avant de déboguer celui qui ne marche pas.
- ★ MESURER AVANT DE PROPOSER. Une hypothèse non vérifiée coûte un aller-retour ; trois
  hypothèses coûtent une session.
- ★ LA RÈGLE ÉPICÈNE EST UNE MÉTHODE : si le libellé désigne une personne, réécrire en nom
  abstrait, groupe nominal, adjectif invariable ou verbe. Ne pas chercher « le bon mot ».
- ★ LES DROITS SONT UN ÉTAT PAR USAGE. La barrière va dans le RPC, jamais dans le client.
- ★ NAMING : « Atelier » (standalone) / « l’Atelier » (en phrase). CTA « Accéder à l’Atelier ».
  « Atelier » = le produit fan-area. « Résonance » = la plateforme. Jamais l’un pour l’autre.
- ★ TYPOGRAPHIE : apostrophe courbe ’ dans tout texte affiché ; droite ou rien dans slugs,
  fichiers, URLs, valeurs DB, identifiants.
- ★ RÉSONANCE NE DÉTIENT NI NE REDISTRIBUE L’ARGENT DES FANS. Stripe Connect direct charges.
- ★ TITRES COMMUNAUTAIRES ≠ RÔLES D’AUTORISATION. Un badge n’accorde jamais une permission.
- ★ UN SEUL PROJET SUPABASE, ARTISTES = LIGNES. Toute table porte artist_id dès la création.
- ★ APRÈS TOUT `cp` DEPUIS ~/Downloads : vérifier le fichier REÇU (`head -3` / `wc -l`).
  Un nom générique (page.tsx, route.ts) masque un fichier périmé, et `tsc` valide sans broncher.
- ★ CHERCHER LE TEXTE, PAS LE NOM DE FICHIER : `grep -rn "chaîne" src/` avant de conclure
  qu’un composant n’existe pas. Un élément global peut être écrit en dur dans une page.
- ★ PRÉVENIR AVANT DE SIGNALER : afficher la contrainte avant l’erreur, puis l’erreur SOUS
  le champ concerné (aria-invalid + aria-describedby + focus).
- ★ NOUVELLE PAGE = surcharger `alternates.canonical` (le layout en déclare un en dur).
- Verify-don’t-assume : filesystem/git/DB/logs avant les notes. Un résumé de Claude Code est
  une AFFIRMATION, pas une preuve — `cat` et `git --no-pager diff` soi-même.
- Toute table raw-SQL → grant à authenticated ; anon uniquement via RPC security definer.
- Thème par tokens ; params d’URL Bandcamp = seule exception hex.
- Chaque page : SEO + WCAG AA + JSON-LD. PAS d’autoplay/auto-advance/boucle/popups.
- user_id/owner depuis la session auth, jamais le body. Zod partout. Pas de param `next`.
- Claude Code : briefs scopés, PAS de commit, revue du diff complet, composants partagés signalés.
- Jamais Telegram (liens WhatsApp). Signaler les risques géographiques/institutionnels.
- Rappeler : avocat avant /legal (et REFER vs OPERATE) ; CRESS IDF + Les Scop IDF.
- Fin de session : demander si les instructions doivent évoluer ; proposer le CONTEXT_FOR_AI
  à jour ; rappeler la sync (cp vers Main_HDD Specs D’ABORD, puis ~/sync_resonance.sh).
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
★ DEV = http://localhost:3000. L’IP réseau bloque le hot-reload (voir learning 10).
Presse-papier : xclip -selection clipboard < fichier   (le flag est obligatoire).
Vignettes nommées : montage -label '%f' *.jpg -tile 4x2 -geometry 320x320+10+10 ...
Fichiers longs : télécharger puis cp, JAMAIS de heredoc collé.
`git diff` ne montre PAS les fichiers non suivis — utiliser `git status`.
Grep depuis src/, pas src/app/. POSIX [[:alpha:]] au lieu de [A-Za-zÀ-ÿ].
```

---
*Updated 2026-08-22 · Le site a enfin une porte pour les professionnels, et elle est conçue
pour ne jamais perdre un message en silence. Trois pièges se sont refermés dans la même
session — un vieux fichier que le compilateur a validé, un footer qu’on n’a pas cherché au
bon endroit, un message d’erreur exact et inutilisable. Tous les trois portent la même
morale : ce qui est vrai n’est pas forcément ce qui est utile, ni ce qui est servi.*
