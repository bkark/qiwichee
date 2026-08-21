# Résonance — AI Context File
> Paste/upload this at the start of any new conversation to resume instantly.

**Last updated:** 2026-08-21 — **SESSION DE BUILD. MODULE BIO LIVRÉ. PREMIÈRE TABLE MULTI-TENANT RÉELLE.**
Session mixte : tri d’un document importé (Kimi), passe LADDER partielle, puis construction complète
du module BIO — de la table au composant déployé. Ce qui change structurellement :
(1) **`artists` existe** — la décision « un seul projet Supabase » a enfin une ancre ;
(2) **les droits sont un état PAR USAGE**, pas par photo — deux booléens, pas un ;
(3) la règle épicène devient une **méthode de réécriture** au lieu d’une chasse au bon mot ;
(4) **`tier` va sur `atelier_members`**, pas sur `fans` (correction d’une note antérieure) ;
(5) nouvelle leçon dure : **code écrit ≠ code servi**.
**Status:** qiwichee.com LIVE ✅ · Atelier gate ✅ · Magic links ✅ · Keepalive CRON ✅ ·
Release-switcher ✅ · **Section BIO LIVE ✅** · SPF+DKIM+DMARC ✅ · Site en français, `lang="fr"` ✅ ·
Event-engine SQL ⛔ TOUJOURS UNRUN (et doit maintenant pointer vers `artists`)
**Commits du jour :** `8d0eb1b` (schéma bio + photos) · `12834d1` (composant + copie FR)
**Next session goal (in order):** (1) **BILINGUE next-intl** — demandé pour la bêta, et il touche
`bio_blocks` (colonnes de traduction : décision de schéma). (2) LADDER & SEASONS — finir la passe.
(3) `fans` MULTI-TENANT MIGRATION. (4) EVENT ENGINE révisé. (5) CAROUSEL V2.

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
*Updated 2026-08-21 · Une session de build, et la première où une table est née pour porter
plusieurs artistes. Le module bio est en ligne, les droits sont gardés par la base plutôt que
par la bonne volonté, et trois heures ont été perdues sur un bug qui n’existait pas — la
meilleure leçon de la journée.*
