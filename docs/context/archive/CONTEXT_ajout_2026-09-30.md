## 🌐 DOMAINE CANONIQUE — LIVRÉ ET VÉRIFIÉ 2026-09-30

```
CIBLE ATTEINTE : https://qiwichee.com (HTTPS, sans www) est l'UNIQUE hôte public.
★★ ZÉRO LIGNE DE CODE. Tout s'est fait dans le dashboard Vercel.

ÉTAT AVANT (découvert à la lecture, pas supposé) — L'INVERSE DE LA CIBLE :
  qiwichee.com      → 308 vers www.qiwichee.com
  www.qiwichee.com  → Production (le vrai site)
  qiwichee.fr       → 308 vers www.qiwichee.fr
  www.qiwichee.fr   → Production (UNE COPIE COMPLÈTE du site)

ÉTAT APRÈS (Vercel → Settings → Domains) :
  qiwichee.com        → Production
  www.qiwichee.com    → 301 → qiwichee.com
  qiwichee.fr         → 301 → qiwichee.com  (DIRECT, pas via www.qiwichee.fr : pas de chaîne)
  www.qiwichee.fr     → 301 → qiwichee.com
  qiwichee.vercel.app → Production (laissé tel quel)

★ ORDRE DE BASCULE : l'apex en Production AVANT de rediriger quoi que ce soit vers lui.
  L'inverse crée une boucle côté serveur.

★★ RISQUE DE BOUCLE CÔTÉ NAVIGATEUR — MESURÉ AVANT DE BASCULER :
  Un 308 est permanent ⇒ un navigateur PEUT le garder en cache. Ancien cache
  « .com → www » + nouveau « www → .com » = ERR_TOO_MANY_REDIRECTS, chez les gens qui
  connaissent le mieux le site.
  ⇒ `curl -sI https://qiwichee.com | grep -i cache-control` a rendu
    `public, max-age=0, must-revalidate` : redirection revalidée à chaque visite,
    PAS de cache durable ⇒ bascule sûre.
  ★ Si ça avait été un max-age long : garder www comme canonique était l'option honnête.

CODES OBSERVÉS (curl, production) :
  https://… (www, .fr, www.fr)   301 · 1 saut
  http://qiwichee.com            308 · 1 saut (montée HTTPS de Vercel, NON réglable)
  http://www.* / http://*.fr     308 puis 301 · 2 sauts — ACCEPTÉ, ne pas « corriger » en code
  chemin + query CONSERVÉS : /contact?test=1 arrive intact.

DNS OVH (lu par dig, non modifié) : un seul A 216.198.79.1 sur chaque apex · www en CNAME
  vers 42d7eef65754d8a8.vercel-dns-017.com · aucun AAAA · aucun CAA · MX OVH inchangés
  (.com mx0-mx4, .fr mx1/2/3 — ordre d'affichage variable, même ensemble).
SUPABASE : Site URL DÉJÀ https://qiwichee.com. Callbacks www et .fr LAISSÉS dans la liste
  (liens déjà dans des boîtes mail). À retirer plus tard, sans urgence.

TESTS FONCTIONNELS (tous OK) : formulaire contact (ligne en base 7ee8e8a0… + mail reçu) ·
  magic link Atelier sur qiwichee.com · Share Card depuis Android · qiwichee.fr tapé sur
  téléphone.
  ⚠️ Les fans connectés sur www devront se reconnecter UNE fois (cookie lié à l'hôte).

★★ CANONIQUES : DÉJÀ CORRECTES AVANT LA SESSION. Toutes disaient qiwichee.com sans www,
  même quand le site était servi sur www. Rien de cassé côté SEO.
⚠️ CORRECTION DE CE FICHIER : `(public)/page.tsx` NE SURCHARGE PAS le canonique (aucun
  `export const metadata`). Seul `/contact` le fait. Le piège noté ailleurs était faux
  pour la page d'accueil.

⛔ PHASE 2 (canonicalUrl() lisant NEXT_PUBLIC_SITE_ORIGIN) — REPORTÉE, VOLONTAIREMENT.
  NEXT_PUBLIC_SITE_ORIGIN varie par DÉPLOIEMENT ; le domaine canonique varie par ARTISTE.
  Avec deux artistes sur un déploiement, une variable ne peut pas donner deux canoniques.
  ⇒ Source réelle = `artists.domain`. Le faire maintenant = le faire deux fois.
  ⛔ Claude Code proposait aussi de dériver `shareDomain` de NEXT_PUBLIC_SITE_ORIGIN :
     REFUSÉ, même motif que la décision du 13/09 (trois valeurs qui se ressemblent).

CHAÎNES EN DUR À REMÉDIER — fenêtre `artists.domain` (avec pattern_path, palette,
  distributeur). 12 occurrences exécutées :
  URLs (8) : layout.tsx 19/27/36 · contact/page.tsx 26/30/40 · (public)/page.tsx 13 ·
             MusicSection.tsx 45 (shareDomain)
  IDENTITÉ D'ARTISTE DANS LES MAILS (4) — MANQUÉES par le rapport de Claude Code :
             constants.ts 2 (CONTACT_EMAIL) · mailService.ts 155 (nom d'expéditeur
             « Contact qiwichee.com ») · api/contact/route.ts 184 (préfixe d'objet) et 199
             (pied de mail)
  ⇒ l'artiste #2 recevrait des mails de booking signés « qiwichee.com ».
  Brief : docs/briefs/BRIEF_canonical_domain.md (bloc STATUS en tête).
```

### Learnings (à ajouter à HARD-WON LEARNINGS)

```
★ 47. (2026-09-30) **LIRE L'ÉTAT DU DASHBOARD AVANT D'ÉCRIRE LE BRIEF.** Le brief supposait
   une config à compléter ; la réalité était l'INVERSE de la cible, et tout se réglait
   sans code. Une capture de Settings → Domains a remplacé une phase de développement.
   (Famille du learning 21 : la running-config, pas l'intention.)

★ 48. (2026-09-30) **AVANT D'INVERSER UNE REDIRECTION PERMANENTE, LIRE SON Cache-Control.**
   Un 301/308 mis en cache sans limite + la redirection inverse = boucle chez les
   visiteurs existants, impossible à purger à distance. `max-age=0, must-revalidate`
   ⇒ sûr. Une ligne de curl décide si la bascule est possible.

★ 49. (2026-09-30) **UN RAPPORT QUI CHERCHE DES URLs NE TROUVE PAS LES IDENTITÉS.**
   Claude Code a compté 8 occurrences ; `grep` en a donné 17. Écart : 5 commentaires
   (inoffensifs) et 4 chaînes d'identité d'artiste dans les mails, hors du motif
   « https:// ». ⇒ Recompter soi-même, puis TRIER : commentaire / URL / identité.
   ★ Et un fichier NON SUIVI (`??`) est invisible à `git diff` : snapshot dans /tmp
     AVANT de laisser un agent l'éditer, puis `diff -u` (learning 33 appliqué).
```

---

## 🔐 ROTATION DES SECRETS — SMTP LIVRÉE 2026-09-30, DEUX RESTANTS

```
DÉCLENCHEUR : capture d'écran de `.env.local` du 13/09 exposant SMTP_PASSWORD +
  IP_HASH_SALT + CRON_SECRET. 17 jours d'exposition.

★★ LE MOT DE PASSE SMTP N'EST PAS UN SECRET APPLICATIF, C'EST LE MOT DE PASSE DE LA
  BOÎTE OVH. Même identifiant pour l'envoi (SMTP 587) et la relève (IMAP 993).
  ⇒ QUATRE consommateurs, pas un :
     1. Vercel (SMTP_PASSWORD, Production + Preview)
     2. .env.local
     3. SUPABASE — custom SMTP ACTIVÉ (host pro2.mail.ovh.net, port 587,
        sender hello@qiwichee.com, Sender name « Qiwi Chee »). DÉCOUVERT EN SESSION,
        n'était noté NULLE PART. Sans lui, la rotation cassait les magic links.
     4. Clients de messagerie (téléphone de Qiwi Chee, poste de Bassim)

★ ORDRE DE BASCULE (fenêtre de panne ≈ 15 min, mesurée) :
  OVH → Vercel → SUPABASE → redéploiement → .env.local → clients → tests
  ★ SUPABASE AVANT LE REDÉPLOIEMENT : il applique le changement à l'ENREGISTREMENT
    (pas de build), Vercel demande un déploiement. Faire Supabase d'abord rétablit
    les magic links tout de suite ; seule la notification de contact reste muette
    pendant le build — et le store-and-forward garantit qu'aucun message n'est perdu.
  ⛔ NE PAS cliquer le « Redeploy » du bandeau Vercel : il saute la case du cache.
    Passer par Deployments → la ligne Production → Redeploy → DÉCOCHER le build cache.

★ GÉNÉRATION SANS AFFICHAGE :
  LC_ALL=C tr -dc 'A-Za-z0-9' < /dev/urandom | head -c 24 | xclip -selection clipboard
  ⛔ CARACTÈRES INTERDITS DANS UN .env : $ " ' ` \ # et l'espace.
    Next interprète `$` comme une référence de variable ⇒ mot de passe TRONQUÉ EN
    SILENCE, fichier d'apparence correcte, authentification qui échoue sans indice.
  ★ Type SECRET dans Vercel = valeur JAMAIS relisible. Le diagnostic d'un échec est
    « re-saisir », jamais « comparer ». Coller depuis le gestionnaire, pas retaper.

VÉRIFIÉ EN PRODUCTION : formulaire de contact (chemin Vercel) ET magic link
  (chemin Supabase). DEUX chemins indépendants, DEUX tests.

RESTE À FAIRE :
  [ ] ★★ ÉTAPE ⑩ — TÉLÉPHONE DE QIWI CHEE encore sur l'ancien mot de passe.
      IMAP pro2.mail.ovh.net, 993, SSL. Tant que ce n'est pas fait, sa relève de
      hello@ est en erreur d'authentification : le canal pro est muet DE SON CÔTÉ
      alors que tout fonctionne du nôtre.
      ⛔ Ne pas transmettre le mot de passe par un canal qui en garde trace.
  [ ] ★ IP_HASH_SALT + CRON_SECRET — les deux ENSEMBLE, un seul redéploiement.
      CRON_SECRET : Vercel l'injecte automatiquement en `Authorization: Bearer` sur
        l'appel du cron déclaré dans vercel.json. AUCUN appelant externe à prévenir.
        Test manuel via Vercel → Cron Jobs, ne pas attendre 4 h du matin.
  [ ] ★ MAILCHIMP_API_KEY porte un badge « Needs Attention » dans Vercel (ajoutée le
      28/04, Production + Preview). NON LUE.
```

### ⚠️ DÉCOUVERTE CONNEXE — `emailService.ts` PEUT PERDRE DES FANS EN SILENCE

```
`subscribeFan` est appelé depuis auth/confirm/route.ts ET auth/callback/route.ts,
  donc APRÈS CHAQUE confirmation de magic link. Les deux appels sont enveloppés dans
  un catch → console.error, puis la connexion aboutit normalement.
⇒ Si la clé Mailchimp est invalide (cf. « Needs Attention »), le fan est connecté,
  content, et N'ARRIVE JAMAIS dans Mailchimp. Personne ne le voit.
★ C'est EXACTEMENT le mode de panne refusé pour le formulaire de contact (cut-through
  contre store-and-forward). Le canal fan a le défaut que le canal pro n'a pas.
⇒ À trancher : persister l'inscription en base AVANT Mailchimp, comme contact_messages.
  MAILCHIMP_API_KEY est absente de .env.local ⇒ en local, l'inscription échoue toujours.
```

### ✏️ AMENDEMENT DE RÈGLE — IP_HASH_SALT

```
ANCIENNE RÈGLE : « Le sel ne se fait PAS tourner : le changer rend les anciens hashs
  INCOMPARABLES. Il se documente, il ne se gère pas. »
NOUVELLE RÈGLE : « Le sel ne tourne pas SANS RAISON. Une fuite en est une. »
POURQUOI : le plafond se DÉRIVE d'un comptage sur la DERNIÈRE HEURE ⇒ rotation = au
  pire une heure de quotas remis à zéro. En face, un sel connu sur un espace de 2^32
  adresses se force en quelques secondes : un sel exposé ne protège plus rien.
⚠️ Les lignes existantes de contact_messages gardent leurs anciens hashs. Perte de
  CORRÉLATION avant/après, pas de sécurité.
```

---

## 📸 CAPTURES D'ÉCRAN — RÈGLE DE MÉTHODE (2026-09-30)

```
★★ AVANT DE DEMANDER UNE CAPTURE D'ÉCRAN : NOMMER CE QU'IL NE FAUT PAS CADRER.
  La charge repose sur l'IA qui DEMANDE, jamais sur Bassim qui capture — il est
  concentré sur le champ à montrer, pas sur ce qui traîne derrière.
  ⇒ Toute demande de capture porte SOIT une zone précise (« cadre uniquement
    l'en-tête »), SOIT un avertissement explicite (« ferme le terminal d'abord »).
  Zones à risque par défaut : terminal · .env.local ouvert dans l'éditeur · onglet de
    dashboard affichant des clés · gestionnaire de mots de passe.
  ⚠️ Enfreinte le 2026-09-13 : trois secrets exposés, une session entière de rotation.

★ NE PAS OUVRIR .env.local DANS L'ÉDITEUR PENDANT UNE SESSION AVEC CAPTURES.
  Un onglet survit longtemps à l'usage qui l'a justifié.
```

---

## 🎧 DISTRIBUTEUR = DISTROKID · OAC CONFIRMÉ (2026-09-30)

```
★★ LE DISTRIBUTEUR EST DISTROKID. Prérequis de 11 tâches sur 18 du plan de présence
  du 7 septembre — la question est CLOSE, la donnée doit descendre en base.

★★ OFFICIAL ARTIST CHANNEL (OAC) — DÉJÀ EN PLACE, VÉRIFIÉ VISUELLEMENT.
  Témoins sur youtube.com/@qiwichee : NOTE DE MUSIQUE à droite du nom (pastille
  propre à l'OAC, distincte de la vérification classique) + onglet « RELEASES »
  (n'existe QUE sur un OAC). 633 abonnés · 10 vidéos.
  ⇒ LA CHAÎNE « - Topic » A FUSIONNÉ. Le learning 37 (erreur 153, vidéos d'une
    chaîne Topic non intégrables) NE S'APPLIQUE PLUS à cette chaîne.

★★ CONSÉQUENCE : LA BASCULE BANDCAMP → YOUTUBE DEVIENT TESTABLE.
  Les trois conditions, inchangées :
   1. UNE VIDÉO PAR CHANSON → l'onglet « Releases » répond directement : titres
      séparés = OK, objet album unique = NON.
   2. INTÉGRATION AUTORISÉE, PISTE PAR PISTE → ⛔ OUVRIR LA VIDÉO NE SUFFIT PAS.
      Tester en `<iframe src="https://www.youtube.com/embed/ID">`. Une vidéo visible
      sur la chaîne peut refuser de s'afficher sur un site tiers.
   3. BARRIÈRE DE DROITS → question à poser, pas à tester.
  ⚠️ BANDCAMP VEND, YOUTUBE NON. S'il sort du carrousel, il RESTE dans « Aussi sur → ».
  ★ ARGUMENT NOUVEAU : 633 abonnés YouTube contre 31 auditeurs mensuels Spotify.
    Rapport ≈ 20:1. Le lecteur YouTube n'est pas un substitut esthétique, c'est le
    format où son audience est DÉJÀ. La bascule est de la DONNÉE (`songs`), pas du code.

★ OAC CHEZ DISTROKID = LIBRE-SERVICE, PAS UN TICKET.
  Features → Special Access → YouTube Official Artist Channel, ou
  distrokid.com/YouTubeOfficialArtistChannels.
  ⚠️ IRRÉVERSIBLE : DistroKid ne peut ni annuler une revendication, ni déconnecter
    une chaîne, ni transférer le statut. Supprimer la chaîne ne le révoque pas.
    Le nom de chaîne doit correspondre EXACTEMENT aux métadonnées d'artiste.
    ⇒ Pour un futur artiste : VÉRIFIER LE NOM AVANT DE SOUMETTRE. Un coup, pas de reprise.
  Prérequis : ≥ 1 vidéo publique téléversée à la main (les Shorts ne comptent pas).

ÉTAT DE LA PHASE 1 DU PLAN DE PRÉSENCE :
  1.1 Spotify for Artists   PROBABLE (liens du site présents sur les profils) — à confirmer
  1.2 Apple Music for Artists PROBABLE — à confirmer
  1.3 Deezer for Creators    PROBABLE — à confirmer
  1.4 YouTube OAC            ✅ CONFIRMÉ
  ⚠️ « Probable » vient d'une INFÉRENCE (le lien du site se renseigne depuis l'outil
    d'artiste), pas d'une lecture. Les comptes sont peut-être sous l'identifiant de
    Qiwi Chee ⇒ vérification impossible sans elle.
```

---

## 🗺️ PLAN DE PRÉSENCE — CE QU'IL APPORTE À RÉSONANCE

```
★★ LE GÉNÉRIQUE N'EST PAS LA LISTE DE PLATEFORMES (elle se périme et elle est
  musicale). C'EST LA COLONNE « Depends on » DE LA MASTER CHECKLIST.
  Lue comme un graphe : distributeur → OAC + audit des stores · catalogue live sur
  Amazon → revendication Amazon · Spotify for Artists → pitch éditorial · admin
  Facebook → Bandsintown. C'est une MACHINE À ÉTATS PAR ARTISTE, pas une todo.
  ⇒ Ce que le module doit porter :
     1. un ÉTAT par (artiste, plateforme) : absente | livrée | revendiquée, + id
        externe + date + source de vérification
     2. les ARÊTES DE DÉPENDANCE entre tâches → ce qui est actionnable MAINTENANT
     3. le DISTRIBUTEUR comme QUESTION D'ONBOARDING, pas comme champ de profil
  ★ Un humoriste n'a ni Spotify ni SACEM, mais il a un diffuseur, des plateformes et
    des dépendances. La structure tient, le vocabulaire change.

★ DONNÉE À DESCENDRE EN BASE (elle vit aujourd'hui dans un Markdown) :
  Spotify 4Bu89sfVzy14qW0dK8Ugbs · Deezer 204585817 · Apple 1676154343 · DistroKid.
  ⇒ MÊME FENÊTRE DE MIGRATION que artists.domain / pattern_path / palette.
  ⇒ Table `artist_platforms` plutôt que des colonnes : elle porte l'ÉTAT, pas juste
    l'identifiant. artist_id dès la création (règle générale).

⚠️ NE PAS CONFONDRE : Chartmetric / Soundcharts (phase 5.3 du plan) sont des outils
  de suivi EXTERNES. Rien à voir avec la couche d'analytique interne ni avec la
  décision `events` générique, toujours à trancher.

★★ FRICTION DE BÊTA-TEST N°1 — ET ELLE N'EST PAS SUR LE SITE :
  Deux personnes travaillent sur une liste de 18 tâches SANS ÉTAT PARTAGÉ. Bassim ne
  sait pas où elle en est, elle ne sait pas ce qui est livré, et un Markdown
  ré-uploadé n'a pas de mémoire. La tâche 6.3 (capture d'e-mails) est faite depuis
  longtemps et figure toujours comme à faire.
  ⇒ C'EST LE PRODUIT. La plateforme doit répondre à « où en est-on ? ».
  ⇒ Rustine d'ici là : colonnes STATUT et QUI dans la master checklist, et en faire
    le document qu'on MET À JOUR, pas celui qu'on relit.
```

---

## 📝 DEUX PROMPTS REÇUS — TRAITEMENT DÉCIDÉ (2026-09-30)

```
★★ LES DEUX SONT EN AVAL DU PLAN DE PRÉSENCE, PAS À CÔTÉ. Le prompt UX implémente
  ses phases 4 et 6.3 ; le prompt consultant propose de le réordonner.

PROMPT 1 — « senior UX designer / artist-website strategist »
  ✅ À GARDER : c'est le PREMIER document du projet qui énonce un OBJECTIF DE
     CONVERSION (découvrir → écouter → rejoindre l'Atelier → revenir) plutôt qu'une
     liste de fonctionnalités. Sa discipline « inspecter avant de modifier » et
     « ne rien prétendre sans vérification » sont déjà les règles maison.
  ⛔ NE PAS LE LANCER SUR LE DÉPÔT EN L'ÉTAT :
     1. Il VIOLE LE CONTRAT D'ARCHITECTURE : il prescrit des chaînes en dur
        (« Entre dans L'Atelier », texte du héros, message de section Live) au moment
        où la tâche 3b en EXTRAIT 117. Il défait le moteur de copie en le construisant.
     2. Il FORCE TROIS DÉCISIONS OUVERTES : section Live ⇒ tranche `events` par
        accident · section Vidéos ⇒ suppose l'intégration autorisée · « un seul lien
        Écouter partout » ⇒ menace Bandcamp, seul chemin d'achat.
     3. Il est ENTIÈREMENT de la mise en avant ⇒ derrière MENTIONS LÉGALES et
        POLITIQUE DE CONFIDENTIALITÉ, toujours ⛔ bloquantes.
  ⇒ SEULE PARTIE EXÉCUTABLE AUJOURD'HUI : l'audit, points 1 à 9 de « First task ».
    Lecture seule, aucun diff. Couper tout ce qui suit.
  ⇒ Puis scinder : (a) docs/briefs/architecture_information.md — parcours, ordre des
    sections, taxonomie des CTA, accessibilité, performance. AUCUNE chaîne française,
    AUCUN nom propre. (b) une liste mappée : déjà fait / bloqué par X / faisable.

PROMPT 2 — « consultant Music Business / Fan Growth »
  ★ C'est en réalité LA SPÉCIFICATION D'UN MODULE (« Présence »), pas un rapport.
  ⛔ INEXÉCUTABLE TEL QUEL : il demande d'analyser « la roadmap actuelle » SANS LA
     FOURNIR. Un modèle en inventera une plausible ⇒ optimisations portant sur un
     document fictif, indiscernables d'un vrai travail.
     ⇒ JOINDRE LE PLAN DE PRÉSENCE DU 7 SEPTEMBRE. Sinon : 3e source de vérité.
  ⛔ Ses KPI mensuels supposent une couche d'analytique ⇒ MÊME BLOCAGE `events` que
     le prompt 1, atteint par un chemin indépendant. Signal fort : trancher.
  ⇒ AJOUTS OBLIGATOIRES :
     · cadrage d'incertitude en tête : « si une information manque, demande-la ;
       n'invente ni chiffre, ni état de compte, ni statut de plateforme »
       (sa priorité 3 demande de vérifier les lyrics sur 5 services)
     · LIVRABLE 7 : « pour chaque action, indiquer si elle est GÉNÉRIQUE (tout artiste
       la suivra) ou SPÉCIFIQUE à Qiwi Chee. Pour les génériques : quelle donnée la
       plateforme doit stocker, et à quel moment de l'onboarding elle se demande. »
       ★ C'est CE point qui transforme un rapport en spécification produit.
  ⇒ OÙ : projet STRATÉGIE, pas ici. Sortie rapatriée en deux endroits —
     docs/briefs/module_presence.md (générique, sans nom propre) et le reste FUSIONNÉ
     dans le plan de présence existant, qui n'est pas dupliqué.
  ★ EPK (sa priorité 6) = meilleur candidat immédiat : bios courte/longue FR+EN, donnée
    presque pure, blocs de bio déjà en base, atterrit sur le chantier bilingue. Les DEUX
    prompts le réclament indépendamment.
```

### Learnings (à ajouter à HARD-WON LEARNINGS)

```
★ 50. (2026-09-30) **UN SECRET PARTAGÉ SE COMPTE EN CONSOMMATEURS, PAS EN FICHIERS.**
   SMTP_PASSWORD était documenté comme une variable d'environnement ; c'était le mot
   de passe d'une BOÎTE, donc aussi celui de Supabase et de deux téléphones. Le
   consommateur Supabase n'était noté nulle part et n'apparaissait dans AUCUN grep du
   dépôt — il vivait dans un dashboard.
   ⇒ Avant toute rotation : INVENTORIER LES CONSOMMATEURS, pas les occurrences.

★ 51. (2026-09-30) **UNE RÈGLE QUI REPOSE SUR LA VIGILANCE DE L'HUMAIN ÉCHOUERA.**
   Elle doit reposer sur celui qui détient l'information AU MOMENT DE LA DÉCISION.
   Ici : l'IA sait qu'elle demande une capture, Bassim ne sait pas ce qui est à
   l'écran. Même famille que « la barrière va dans le RPC, jamais dans le client ».

★ 52. (2026-09-30) **UN NOM DE FICHIER N'EST PAS UNE PREUVE DE PROVENANCE.**
   `Screenshot_..._com.whatsapp.jpg` désigne l'application CAPTURÉE, pas le canal de
   transmission. Diagnostic d'exfiltration posé sur cette seule base, et FAUX.
   ⇒ Ouvrir le fichier avant de conclure. (Famille du learning 21.)

★ 53. (2026-09-30) **UN `catch` QUI LAISSE PASSER EST UN CUT-THROUGH DÉGUISÉ.**
   subscribeFan échoue → console.error → la connexion aboutit. Le fan est content,
   l'inscription est perdue, personne ne le voit. Le canal fan porte le défaut que le
   canal pro n'a pas. ⇒ Persister AVANT de notifier, partout, sans exception.

★ 54. (2026-09-30) **UN PROMPT N'EST PAS UNE INSTRUCTION, C'EST UNE MATIÈRE PREMIÈRE.**
   Deux prompts externes, tous deux justes sur le fond, tous deux destructeurs
   exécutés littéralement (chaînes en dur, décisions tranchées par accident, roadmap
   inventée faute de pièce jointe). ⇒ Tout prompt reçu passe par un BRIEF : ce qui est
   générique va en docs/briefs/, ce qui est spécifique fusionne dans un document
   EXISTANT, et ce qui est bloqué est nommé AVANT d'être lancé.
   ★ Le contrat d'architecture s'applique AUX DOCUMENTS autant qu'au code : un playbook
     écrit autour d'une personne se réécrit entièrement au deuxième artiste.
```

---

*Session du 2026-09-30 (après-midi) · Rotation du mot de passe SMTP menée de bout en
bout, avec une découverte qui n'était dans aucun fichier : Supabase partageait le
credential. Le reste de la session n'a produit aucun code — elle a produit une carte.
Trois documents décrivaient le même territoire sans le savoir (plan de présence, prompt
UX, prompt consultant) ; deux d'entre eux butaient, par des chemins indépendants, sur
la même décision non tranchée : `events`. Et la vraie friction de bêta-test n'est pas
sur le site — c'est que personne ne peut répondre à « où en est-on ? ».*
