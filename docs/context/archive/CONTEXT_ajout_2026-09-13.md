# AJOUT AU CONTEXTE — SESSION DU 13 SEPTEMBRE 2026

*Quatre blocs à insérer dans `CONTEXT_FOR_AI_qiwichee_web.md`.*
*Chaque bloc indique OÙ il va. Coller dans VS Code, jamais au terminal.*

---
---

# BLOC 1 — NOUVELLE SECTION

**OÙ :** juste après `## 🎠 CARROUSEL V2 — LIVRÉ EN PRODUCTION 2026-09-06 (71545d1)`
et sa clôture, avant `## 🔑 HARD-WON LEARNINGS (standing)`.

---

## 🔗 SHARE CARD — LIVRÉ EN PRODUCTION 2026-09-13 (`1ede4b6`)

```
Bouton de partage sur chaque diapo du carrousel. Génère une image côté client
(canvas 2D), la partage via Web Share API, avec repli sur copie de lien.
Testé de bout en bout sur Android : la carte part avec l'image, le lien ramène
sur la bonne chanson.
Brief complet et divergences résolues : docs/briefs/BRIEF_share_card.md

MODULE : src/lib/modules/share/
  types.ts · deepLink.ts · tokens.ts · ShareCard.tsx · useShareSong.ts ·
  ShareButton.tsx
TOUCHÉ : SongSwitcher.tsx · MusicSection.tsx · (public)/page.tsx (Suspense)

─── FORME DU LIEN ───────────────────────────────────────────────────────────

  https://qiwichee.com/?release=<slug>&song=<slug>#music

★★ PAS DE ROUTE /music. Elle n'existe pas — le carrousel vit dans la section
   #music de (public)/page.tsx. Un lien vers /music renverrait un 404.
★★ LE PARAMÈTRE `song` PORTE LE SLUG, JAMAIS UN UUID. Un UUID dans une URL
   partagée n'est lisible ni par un humain ni par un crawler, et le slug sert
   déjà d'ancre. ★ LE SLUG EST L'IDENTIFIANT DU CATALOGUE — `Song` n'a même
   pas de champ `id` (le RPC n'en retourne pas).
⛔ NE PAS « rétablir » un champ id dans ShareableSong pour y recopier le slug :
   deux noms pour un fait, une session future croirait tenir un identifiant
   technique distinct. Refusé le 2026-09-08, même motif que owners/artists.
⚠️ origin et path NE SONT PAS EN DUR : ils descendent en props depuis
   MusicSection (ShareDeepLinkConfig). origin vient de NEXT_PUBLIC_SITE_ORIGIN.

─── TROIS VALEURS QUI SE RESSEMBLENT ET NE SONT PAS DE MÊME NATURE ──────────

  NEXT_PUBLIC_SITE_ORIGIN  varie selon le DÉPLOIEMENT   → env. Vercel
  identity.domain          varie selon l'ARTISTE        → artists.domain (TODO)
  PLATFORM_WORDMARK        ne varie JAMAIS ('Résonance')→ constante de code

★ Elles se confondent AUJOURD'HUI parce qu'un seul artiste est en ligne. C'est
  exactement le genre de coïncidence qui fige une mauvaise structure.
⚠️ `identity.domain` n'est PAS un TODO 3b — un nom de domaine NE SE TRADUIT PAS.
   Sa destination est artists.domain, fenêtre de migration des colonnes
   d'artiste (avec pattern_path / palette).

─── LE MOTIF N'EST PAS UNE WAVEFORM ─────────────────────────────────────────

⛔⛔ AUCUNE ANALYSE AUDIO N'EST POSSIBLE. Les lecteurs sont des iframes
   cross-origin (Bandcamp, YouTube) : aucun échantillon PCM n'est lisible
   depuis notre page. Le motif est un HACHAGE DÉTERMINISTE DU SLUG — même
   chanson, même dessin, sur tous les appareils, dans le temps.
★ LE COMMENTAIRE DE DÉCISION DANS ShareCard.tsx DOIT ÊTRE PRÉSERVÉ MOT POUR
  MOT. Sans lui, une session future prend ce motif pour de la donnée et bâtit
  dessus.
⇒ Le jour où audio_path sert nos propres MP3 (rights_stream_confirmed), une
  vraie analyse devient possible. Ce sera une AUTRE fonction, pas une
  correction de celle-ci.

─── CANVAS ET TOKENS CSS ────────────────────────────────────────────────────

★★★ `canvas` NE COMPREND PAS `var(--accent)`. ctx.fillStyle veut une valeur
   concrète. La règle hex-clean tient quand même : on résout les tokens via
   getComputedStyle au moment du dessin (src/lib/modules/share/tokens.ts).
⚠️ LIRE --font-bricolage ET --font-inter DIRECTEMENT, pas --font-display /
   --font-body : ces derniers sont des ALIAS, getPropertyValue renverrait la
   chaîne brute `var(--font-bricolage)`, inutilisable dans ctx.font.
⚠️ `await document.fonts.ready` AVANT DE DESSINER. Sans ça la carte sort en
   fonte de repli — bug silencieux, image déjà partagée.
⚠️ img.crossOrigin = 'anonymous' : sans effet tant que les pochettes sont dans
   public/, INDISPENSABLE le jour où elles partent sur Supabase Storage. Sans
   en-tête CORS côté bucket, le canvas est « tainted » et toBlob() lève.
★ tokens.ts JETTE si un token manque. Voulu : un échec bruyant vaut mieux
  qu'une carte aux couleurs vides qui circule sur Instagram.

─── GÉOMÉTRIE DE LA CARTE ───────────────────────────────────────────────────

1080 × 1350 (4:5, survit au recadrage Instagram feed et Stories).
ART_SIZE 840, pochette CENTRÉE via artX = (CARD_WIDTH - ART_SIZE) / 2 = 120.
⚠️ artX gouverne TOUTE l'horizontale : pochette, titre, contexte, motif, pied
   (y compris CARD_WIDTH - artX pour l'alignement à droite). PAD ne sert plus
   QUE pour la verticale. Mélanger les deux produit deux marges gauches.

★★ LE MOTIF EST ANCRÉ SOUS cursorY, PAS SOUS CARD_HEIGHT.
   Avant : deux systèmes de coordonnées indépendants — texte descendant depuis
   la pochette, motif calculé depuis le bas du canvas. Un titre sur 1 ligne
   les faisait se croiser. CONSTATÉ SUR UNE CARTE RÉELLE PARTAGÉE.
⛔ DESSINER LE TEXTE PAR-DESSUS LES BARRES N'EST PAS UNE SOLUTION — ça déplace
   le problème du code vers l'œil du lecteur. Proposition refusée le 13/09.
⇒ WAVE_HEIGHT = 60 : hauteur GARANTIE dans les deux cas (1 ou 2 lignes de
  titre), donc le motif est CONSTANT d'une carte à l'autre. C'est la signature
  visuelle de la plateforme — elle ne peut pas dépendre du nombre de
  caractères du titre.
⚠️ Le plancher des barres est PROPORTIONNEL (actualWaveHeight * 0.05), pas
   fixe : un plancher fixe tasse le motif en ligne plate quand la hauteur baisse.

─── PARTAGE : TROIS ÉTAGES DE REPLI ─────────────────────────────────────────

  1. navigator.share AVEC fichier   (Android, iOS)
  2. navigator.share SANS fichier   (Chrome desktop, Android partiel)
  3. presse-papier + téléchargement (Firefox desktop, tout le reste)

★ AbortError EST TRAITÉ À PART : si la personne ferme elle-même la feuille de
  partage, ce n'est pas une panne, c'est une décision. Ne pas lui télécharger
  un PNG en réponse.
⚠️ navigator.share EXISTE SUR CHROME DESKTOP mais canShare({files}) est faux :
   Linux n'a pas de feuille de partage système. Que WhatsApp ou Gmail soient
   INSTALLÉS ne change rien — rien ne les relie au navigateur.
   ⇒ LE PARTAGE AVEC IMAGE NE SE TESTE QUE SUR TÉLÉPHONE.
⚠️ SAFARI iOS INVALIDE LE GESTE UTILISATEUR pendant un await long. Parade :
   pré-génération sur pointerdown/pointerenter/focus, pour que le clic n'ait
   plus qu'à partager.
★ CACHE BORNÉ À 4 CARTES (LRU via l'ordre d'insertion de Map). Sans plafond,
  un bouton par diapo × 200 chansons = 200 PNG de 1080×1350 en mémoire.

─── PLACEMENT DU BOUTON ─────────────────────────────────────────────────────

bottom-3 left-3, pastille rounded-full bg-bg/80 shadow-sm, variante ICÔNE SEULE.
⛔ NE JAMAIS LE REMETTRE EN HAUT À DROITE : YouTube y place ses réglages,
   Bandcamp son icône de partage. Constaté en preview, bouton recouvert.
   Le bas droit reçoit la barre de progression YouTube dès la lecture.
   Le BAS GAUCHE est le seul coin qu'aucun des deux ne revendique.
★ ICÔNE SEULE, aucun texte visible : le carrousel reste purement visuel. Le mot
  « Partager » vit dans l'aria-label, lu par les technologies d'assistance.
  La variante `labelled` existe dans ShareButton mais n'est PAS câblée.

─── HIÉRARCHIE DE DÉMARRAGE — ÉTENDUE ───────────────────────────────────────

  #hash  >  ?song=  >  featured  >  aléatoire

★★ BUG VÉCU (2026-09-13) : resolveInitialIndex lisait window.location.hash
   mais IGNORAIT ?song=. Elle tombait sur Math.random(), et le useEffect du
   deep link programmait un scroll concurrent. Deux mécanismes, aucun ordre
   garanti. Symptôme : ?song=seek-the-light ouvrait « idwry », puis
   « Lullabies » au rechargement — un résultat QUI VARIE, signature du random.
⛔ NE PAS RÉSOUDRE EN ORDONNANT LES EFFETS ni par un setTimeout : convention
   qu'une session future casserait sans la voir.
⇒ RÉSOLU EN RENDANT LE CONFLIT IMPOSSIBLE : ?song= est traité COMME UNE ANCRE
  dans resolveInitialIndex. Un seul mécanisme décide du point de départ. Le
  useEffect reste pour la navigation post-montage et devient idempotent.

─── ASYMÉTRIE ÉMISSION / RÉCEPTION ──────────────────────────────────────────

★★ RECEVOIR UN LIEN ET POUVOIR EN ÉMETTRE UN NE SONT PAS LE MÊME DROIT.
   Une chanson SANS POCHETTE n'est pas partageable (une carte sans visuel ne
   doit pas circuler) mais reste ATTEIGNABLE par lien.
⇒ Le mapping toShareableSong retourne null si artwork est absent → pas de
  bouton sur cette diapo. MAIS la résolution du deep link entrant cherche dans
  `songs` COMPLET, pas dans les seules chansons partageables.
★ Même forme que la règle des droits : un booléen PAR USAGE, pas un état global.

─── PIÈGE DE TEST ───────────────────────────────────────────────────────────

⚠️⚠️ UN LIEN PARTAGÉ DEPUIS UNE PREVIEW POINTE VERS LA PRODUCTION.
   C'est VOULU (un lien doit survivre à la mort de la preview), mais ça rend
   le partage INTESTABLE de bout en bout tant que la branche n'est pas mergée.
   ★ A COÛTÉ UN FAUX DIAGNOSTIC le 13/09 : « le deep link ne marche pas »
     alors qu'il atterrissait sur l'ancien code de main.
⇒ Tester le deep link en ouvrant l'URL de preview À LA MAIN avec les
  paramètres. Tester le partage complet APRÈS le merge.

─── RESTE À FAIRE (éditorial, avec Qiwi Chee) ───────────────────────────────

[ ] ÉLISION : « Extrait de Une dernière chose » se lit mal. Une règle
    d'élision serait disproportionnée ⇒ changer le kicker pour une forme qui
    ne s'élide pas (« Extrait · », « Sur »).
[ ] REDONDANCE : quand le titre de la release est identique à celui de la
    chanson (singles), la ligne de contexte se répète.
    ⇒ Règle possible : masquer kicker + titre de release si égalité.
[ ] Le brief docs/briefs/BRIEF_share_card.md contient encore des blocs de code
    d'une version dépassée de ShareButton (classes Tailwind arbitraires
    text-[color:var(--…)] au lieu de text-muted). Le linter les signale.
```

---
---

# BLOC 2 — LEARNINGS

**OÙ :** à la fin du bloc ``` de `## 🔑 HARD-WON LEARNINGS (standing)`,
après le learning 41.

---

```
★ 42. (2026-09-13) **UNE API PEUT RÉUSSIR SANS DIRE CE QU'ELLE A FAIT.**
   navigator.share() résout sa promesse SANS JAMAIS nommer l'application
   choisie — la feuille de partage appartient à l'OS, pas au site.
   ⇒ AVANT DE SPÉCIFIER UN CHAMP DE TÉLÉMÉTRIE, VÉRIFIER QU'IL EST OBSERVABLE.
     Sinon on écrit une valeur plausible et on croit mesurer.
   ★ FAMILLE DES ÉCHECS QUI N'EN ONT PAS L'AIR (avec 13) : ça ne plante pas,
     ça publie / ça compte faux. Le symptôme n'arrive jamais.
   ⇒ TEST : « si cette valeur était inventée, est-ce que je le verrais ? »
     Non ⇒ ne pas la collecter.

★ 43. (2026-09-13) **DEUX ÉLÉMENTS DANS LA MÊME COLONNE, DEUX SYSTÈMES DE
   COORDONNÉES = COLLISION GARANTIE.** Sur la Share Card, le texte descendait
   depuis la pochette et le motif était calculé depuis le bas du canvas.
   AUCUNE marge ne les sépare dans tous les cas.
   ⇒ Le second élément se positionne À PARTIR de là où le premier s'est
     arrêté (cursorY), pas depuis un bord opposé.
   ⛔ Et redessiner l'un PAR-DESSUS l'autre ne résout rien : ça déplace le
     problème du code vers l'œil du lecteur.

★ 44. (2026-09-13) **« EST-CE FAIT ? » N'EST PAS TOUJOURS OBSERVABLE.**
   Avant de concevoir un tableau de bord de suivi, classer chaque ligne :
   vérifiable de l'extérieur, déclarée par l'utilisateur, ou non vérifiable.
   Les trois NE S'AFFICHENT PAS PAREIL.
   ★ Une case cochée par inférence est un mensonge silencieux — l'utilisateur
     agit dessus sans jamais voir le symptôme.
   ⇒ TEST : « si cette case était fausse, l'utilisateur le verrait-il ? »
     Non ⇒ elle doit indiquer sa provenance.

★ 45. (2026-09-13) **UN RÉSULTAT QUI VARIE À CHAQUE ESSAI EST LA SIGNATURE
   D'UN ALÉATOIRE, PAS D'UNE COURSE.** Deux ouvertures du même lien donnaient
   deux chansons différentes. Ce n'était pas une race condition entre deux
   effets — c'était Math.random() qui s'exécutait parce que le paramètre
   n'était jamais lu.
   ⇒ Un bug intermittent QUI CHANGE DE VALEUR pointe vers une source d'entropie.
     Un bug intermittent qui alterne entre DEUX valeurs pointe vers une course.
```

---
---

# BLOC 3 — OPEN DECISIONS / NEXT ACTIONS

**OÙ :** dans `## OPEN DECISIONS / NEXT ACTIONS`, à la suite des entrées
existantes.

---

```
[ ] ★★ COLLECTE D'ÉVÉNEMENTS DE PARTAGE — branche `feat/share-events`.
    ⛔⛔ `channel` (whatsapp / instagram / …) N'EST PAS OBSERVABLE — voir
      learning 42. REMPLACÉ PAR CE QUI EST MESURABLE :
        method  : 'native_files' | 'native_link' | 'copy'
        outcome : 'shared' | 'copied' | 'dismissed' | 'failed'
      Répond à la vraie question V1 : le bouton marche-t-il chez les gens ?
      Si 70 % tombent en 'copy', la carte ne circule pas comme image.
    ⇒ SI LE CANAL EST VRAIMENT VOULU : c'est une décision d'INTERFACE, pas de
      tracking — rangée de boutons explicites, chacun son URL d'intention.
      ⚠️ Contredit « carrousel purement visuel » ⇒ irait dans le BLOC ÉPINGLÉ.
    ⛔ TIMESTAMP CÔTÉ SERVEUR (horloge navigateur non fiable, POST public).
    ⛔ artist_id OBLIGATOIRE DÈS LA PREMIÈRE LIGNE — ne pas recréer le trou
      de `fans` dans une table neuve.
    ⚠️ Dire « aucune donnée personnelle STOCKÉE » : IP et UA transitent de
      toute façon (Vercel les logue), la route n'en écrit aucun. Rate-limit
      éventuel : hash avec IP_HASH_SALT, déjà en place pour le contact.
      ★ Sans cookie, sans identifiant, sans recoupement inter-sites, avec
        conservation bornée ⇒ exemption de consentement CNIL. Cohérent avec
        le report de Clarity — Clarity posait problème, ceci non, TANT QUE
        ça reste dans ces clous.
    ⚠️⚠️ FAIRE APRÈS avoir vu Qiwi Chee utiliser le bouton. Instrumenter une
      fonction qu'on n'a jamais vue tourner, c'est poser le compteur avant l'eau.

[ ] ★★★ DÉCISION D'ARCHITECTURE — À TRANCHER AVANT D'ÉCRIRE LE PREMIER ÉVÉNEMENT.
    `/api/share-event` + table `share_events`   CONTRE
    `/api/events` générique + table `events` (artist · type · payload).
    ★ Une ligne « Analytics layer 1 (log_event RPC) » existe DÉJÀ dans la
      roadmap. Un chemin dédié au partage = DEUX chemins d'analytique.
    ★ MÊME MOTIF REFUSÉ TROIS FOIS : owners/artists · songs.credits vs
      song_credits · `id` en doublon du slug.
    ★ LE PREMIER ÉCRIT FAIT RÉFÉRENCE — comme catalogueClient pour les clients
      de module. Viendront : visites d'Atelier, RSVP, écoutes, et les
      événements du moteur de diagnostic (bloc 4).
    ⇒ RECOMMANDATION : générique. Coût aujourd'hui NUL (même travail), coût
      d'y revenir plus tard : une migration.
    → EN ATTENTE DE LA DÉCISION DE BASSIM.

[ ] ★★ BASCULE BANDCAMP → YOUTUBE SUR LE CARROUSEL — EN ATTENTE, NE PAS FAIRE.
    Qiwi Chee a demandé (via son distributeur) le whitelisting de ses chansons
    sur sa chaîne YouTube, avec les mêmes visuels. Motivation : lecteur
    Bandcamp lourd.
    ⛔ TROIS CONDITIONS AVANT DE TOUCHER À song.media :
      1. UNE VIDÉO PAR CHANSON, pas l'album d'un bloc. Le carrousel a besoin
         de N song.media distincts ; un album en une vidéo demanderait des
         horodatages, que le lecteur intégré gère mal.
      2. INTÉGRATION AUTORISÉE, vérifiée PISTE PAR PISTE. YouTube permet de la
         désactiver par vidéo. ★ UNE VIDÉO VISIBLE SUR LA CHAÎNE PEUT REFUSER
         DE S'AFFICHER SUR UN SITE TIERS — tester en iframe, pas juste ouvrir.
         ⚠️ Voir aussi l'erreur 153 des chaînes « Topic », déjà documentée.
      3. BARRIÈRE DE DROITS. « L'artiste a mis ses chansons sur sa chaîne »
         ≠ « l'intégration sur site tiers est autorisée ».
    ⚠️ BANDCAMP VEND, YOUTUBE NON. Si Bandcamp sort du carrousel, il RESTE
      dans les liens « Aussi sur → ». Sinon on ferme le seul chemin d'achat.
    ⇒ La bascule est de la DONNÉE (`songs`), pas du code.

[ ] ★★ CHAMP DISTRIBUTEUR MANQUANT DANS `artists` — BLOQUANT EN AMONT.
    Le plan de présence (7 sept. 2026) l'établit : le distributeur est le
    prérequis de 11 tâches sur 18 (revendications DSP, audit des stores,
    demande de chaîne officielle YouTube, re-livraison).
    ⚠️ Ce n'est PAS un champ optionnel de profil — c'est une question
      d'ONBOARDING. Un artiste qui ignore son distributeur est bloqué sur la
      majorité du parcours.
    ⇒ À ajouter dans la fenêtre de migration des colonnes d'artiste, avec
      artists.domain / pattern_path / palette.

[ ] ★ CRÉDITS DES CHANSONS + DOCUMENTS SACEM — À TRAITER ENSEMBLE.
    Bassim détient les documents SACEM de Qiwi Chee et les fournira au moment
    où on abordera les crédits.
    ⚠️ DÉCISION DÉJÀ PRISE, NE PAS ROUVRIR : pas de songs.credits en jsonb ET
      de table song_credits — UNE SEULE SOURCE.
    ⇒ La vérification SACEM est aussi la tâche 3.4 du plan de présence : les
      deux chantiers se rejoignent, ne pas les traiter séparément.
```

---
---

# BLOC 4 — NOUVELLE SECTION

**OÙ :** juste avant `## OPEN DECISIONS / NEXT ACTIONS`.

---

## 🔭 MOTEUR DE DIAGNOSTIC DE PRÉSENCE — IDÉE PRODUIT VALIDÉE 2026-09-13

```
Évaluer la présence numérique de l'artiste, suggérer des actions
PERSONNALISÉES, et faire un SUIVI PÉRIODIQUE indiquant ce qui est actif et ce
qui ne l'est pas encore. « L'IA en backstage » (formulation de Bassim).

★ ORIGINE : le plan d'action produit à la main pour Qiwi Chee le 7 sept. 2026
  — 6 phases, 18 tâches, ~12-15 h, coût quasi nul hors campagne Groover.
  LE TRAVAIL MANUEL EST LA SPÉCIFICATION DU PRODUIT.

★★ POURQUOI ÇA A DE LA VALEUR : ce plan révèle que la moitié du travail d'un
   artiste indépendant n'est PAS administrative — c'est de l'infrastructure
   numérique que PERSONNE ne lui explique. Un artiste qui reçoit ce diagnostic
   à l'inscription comprend ce que la plateforme lui apporte AVANT d'avoir
   rien publié.

─── LA CONTRAINTE CARDINALE ─────────────────────────────────────────────────

⛔⛔ « CE QUI EST ACTIF » SE VÉRIFIE, NE SE DÉDUIT PAS.
   TROIS CLASSES, QUI NE DOIVENT JAMAIS ÊTRE MÉLANGÉES À L'AFFICHAGE :

   [A] VÉRIFIABLE DE L'EXTÉRIEUR — une requête suffit, rien à demander.
       Page Genius existe · handle X libre ou pris · album présent sur Deezer /
       Amazon / TIDAL · page Bandsintown ou Songkick en ligne · profil
       Chartmetric créé · entrée MusicBrainz / Discogs.

   [B] DÉCLARÉ PAR L'ARTISTE — invisible de l'extérieur, ne peut venir que de
       lui (ou d'un OAuth sur son compte).
       Spotify for Artists REVENDIQUÉ · Apple Music for Artists · Deezer for
       Creators · inscription SACEM active · identité du distributeur ·
       campagne Groover lancée.
       ★ QU'UN PROFIL SOIT REVENDIQUÉ NE SE VOIT PAS SUR LA PAGE PUBLIQUE.

   [C] NON VÉRIFIABLE — jugement, pas fait. JAMAIS en case à cocher.
       « la bio est cohérente entre les plateformes » · « le visuel est de
       qualité suffisante ».

⛔ SI UNE IA REMPLIT LES CASES [B] PAR INFÉRENCE, elle produit un tableau de
   bord d'apparence fiable et FAUX PAR ENDROITS. L'artiste croira sa SACEM à
   jour parce qu'un écran le dit. ★ Voir learning 44.
⇒ RÈGLE : chaque tâche porte SA MÉTHODE DE VÉRIFICATION en donnée, et
  l'interface distingue visuellement « vérifié » de « déclaré ».

─── CE QUE L'IA FAIT RÉELLEMENT ─────────────────────────────────────────────

⚠️ ELLE NE VÉRIFIE PAS. Les contrôles [A] sont des requêtes HTTP
   DÉTERMINISTES, pas du LLM.
⇒ L'IA sert à : HIÉRARCHISER selon le profil de l'artiste, RÉDIGER la
  recommandation dans sa langue et son contexte, EXPLIQUER pourquoi une tâche
  compte POUR LUI.
★ DIAGNOSTIC = données + requêtes. CONSEIL = IA. Ne pas confondre.

─── AUTRES CONTRAINTES ──────────────────────────────────────────────────────

⛔ JAMAIS DE MOTS DE PASSE DE PLATEFORME STOCKÉS. Pour les tâches [B] : soit
   déclaration de l'artiste, soit OAuth officiel. Aucune troisième voie.
⚠️ LE SUIVI PÉRIODIQUE EST DE L'INFRASTRUCTURE, pas une fonction d'écran :
   cron + table d'état + historique par tâche. Même famille que le keepalive.
⇒ Ce moteur produit des ÉVÉNEMENTS (« tâche X passée à active le JJ/MM ») →
  MÊME DÉCISION D'ARCHITECTURE que la collecte de partages. Trancher une fois
  pour les deux.

─── SÉPARER DEUX CHOSES QUI SONT MÉLANGÉES DANS LE PLAN INITIAL ─────────────

★ CE QUE RÉSONANCE DEMANDE À L'ARTISTE — les données dont la plateforme a
  besoin : distributeur, identifiants DSP, statut SACEM, droits d'intégration
  par plateforme. C'est un FORMULAIRE, il alimente des colonnes.
★ CE QUE RÉSONANCE CONSEILLE À L'ARTISTE — le plan en phases, générique.
  C'est un LIVRABLE, pas un formulaire. Il se génère à partir de ce qu'on sait.

─── ÉTAT FACTUEL (Qiwi Chee, au 7 sept. 2026) ───────────────────────────────

· Demande de chaîne officielle YouTube (OAC) soumise via le distributeur.
  ⚠️ NE PEUT PAS être demandée directement à YouTube.
· ★★ ÉCART MAJEUR : vidéos YouTube héritées à 16K-47K vues quand les écoutes
  mensuelles Spotify sont à 31. L'AUDIENCE EST VIDÉO, PAS STREAMING.
  ⇒ Conséquence pour Résonance : la vidéo n'est pas un canal secondaire pour
    cet artiste. À garder en tête pour les priorités de la plateforme.
· Catalogue absent d'Amazon Music et TIDAL à l'audit ; YouTube Music et Qobuz
  à confirmer via le distributeur.
· Héritage « LEÏ LANI » : catalogue antérieur sous un autre nom, scindé de
  l'identité actuelle. La chaîne officielle pourrait le réunifier.
· Identifiants : Spotify 4Bu89sfVzy14qW0dK8Ugbs · Apple 1676154343 ·
  Deezer 204585817.
```
