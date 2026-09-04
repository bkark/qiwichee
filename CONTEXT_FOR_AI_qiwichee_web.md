# Résonance — AI Context File
> Paste/upload this at the start of any new conversation to resume instantly.

**Last updated:** 2026-09-04 — **LE MOTEUR DE COPIE EXISTE. LA NAV EST DANS LE LAYOUT.**
Deux sessions : (1) l'inventaire des 159 chaînes du site + le schéma bilingue en base,
(2) la nav sortie de `page.tsx` vers un route group `(public)`.
Ce qui compte : LE LIEN COMPTE↔ARTISTE EXISTE ENFIN (`artist_accounts`), ce qui débloque
event_engine, la RLS de `contact_messages` et le futur éditeur de l'artiste.
**Status:** qiwichee.com LIVE ✅ · Atelier ✅ · Magic links ✅ · Keepalive CRON ✅ ·
Release-switcher ✅ · BIO ✅ · CONTACT PRO ✅ · Champ tél. ✅ · SPF+DKIM+DMARC ✅ ·
Motif dessiné ✅ (Android OK) · **NAV DANS LE LAYOUT ✅ (afd538d, preview TESTÉE)** ·
**MOTEUR DE COPIE : schéma + RPC ✅ EN BASE — PAS ENCORE LU PAR LES PAGES** ·
Event-engine SQL ⛔ TOUJOURS UNRUN (mais le conflit owners/artists est TRANCHÉ) ·
**iOS/WebKit ⛔ TOUJOURS PAS TESTÉ — 9 jours en production**
**Commits :** `afd538d` (nav) · SQL lancé au dashboard le 2026-09-03.
✅ CETTE FOIS LA PREVIEW A ÉTÉ TESTÉE — et elle a trouvé un trou de configuration
   vieux de trois mois (voir la section VERCEL). L'étape a payé son coût au premier usage.
**Next session goal (in order):** (1) **3b — EXTRAIRE LES 117 CHAÎNES DE CHROME**
(worklist : `docs/audits/copy_inventory.md`). (2) **MENTIONS LÉGALES + CONFIDENTIALITÉ**.
(3) **TEST iOS**. (4) étape 4 : les pages lisent le RPC + `releases.ts` → table.
(5) next-intl / segment `[locale]`. (6) LADDER & SEASONS. (7) `fans` MULTI-TENANT.

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
## 🖍️ MOTIF DESSINÉ — LIVRÉ 2026-08-26

```
CE QUE C'EST : le gribouillage de Qiwi Chee (cœurs, étoiles, éclairs, « QC ») en fond de
  tout le site. Elle l'a dessiné en bleu sur blanc, déjà en tuile sans couture — VÉRIFIÉ :
  continuité des bords 0,90 / 0,92, composite 2×2 propre.

★★ L'ASSET PORTE LA FORME, LES TOKENS PORTENT LA COULEUR.
  Livré comme MASQUE : le canal alpha seul, zéro couleur dans le fichier. CSS peint un
  dégradé de tokens À TRAVERS le masque (`mask-image`).
  ⇒ 29,7 Ko au lieu de 168 Ko · hex-clean respecté · palette libre.
  ⇒ Le passage de prune à SON bleu a coûté deux tokens et une ligne.
  ⛔ NE JAMAIS livrer un raster coloré : ça gèle la palette du jour dans un binaire, et ça
     se découvre au premier changement de thème.

★ « PILOTÉ PAR LES TOKENS » ≠ « DOIT RÉUTILISER LES TOKENS D'ACCENT ».
  Première version branchée sur --accent/--accent-bright : le dessin est ressorti en prune.
  La règle hex-clean dit que la couleur vit dans `:root`, elle ne dit RIEN sur QUEL token.
  D'où `--pattern-ink-a/-b` : SON encre, dans `:root`, indépendante de la palette.
  ★ `pattern_follows_release` = FALSE par défaut. Le motif est l'écriture de l'artiste,
    pas un élément de thème. Le recolorer écrase un choix qu'elle a déjà fait.

★★ LE PLAFOND D'OPACITÉ EST FIXÉ PAR `--text-muted`, PAS PAR `--text`.
  Mesuré sur la palette Lullabies : plafond 0,25.
    texte principal sur motif : 10,0:1 à o=0,25 — très large marge
    texte muted               :  5,2:1 à o=0,25 ·  4,2:1 à o=0,35 ⇒ ÉCHEC AA
  ★ Vérifier le mauvais token fait croire à trois fois plus de marge.
  ⚠️ 0,25 N'EST PAS UNE CONSTANTE DU PRODUIT. Il se RECALCULE pour chaque palette.

★ DEUX SITUATIONS, DEUX OPACITÉS — et c'est la LARGEUR qui décide.
  Desktop : `<main>` porte `md:bg-bg`, le texte est sur un panneau opaque, il reste des
    marges vides ⇒ encre franche (tuile 600px, opacité 0,45).
  Mobile  : plus de marges (max-w-3xl ne contraint plus), panneau retiré, texte
    DIRECTEMENT sur le motif ⇒ plafond AA (tuile 400px, opacité 0,22).
  ★ Un fond fort exige de l'espace vide. Un téléphone n'en a pas. Aucun réglage ne donne
    les deux à la même largeur — d'où la bascule au breakpoint.

★ LE MASQUE DOIT PORTER SON ALPHA. `-webkit-mask-image` est alpha-only : une image en
  niveaux de gris exigerait `mask-mode: luminance` et rendrait un RECTANGLE PLEIN sous
  WebKit. Le bug ne plante pas — IL PEINT. ⇒ c'est ce que le test iOS doit valider.

FICHIERS :
  public/patterns/qiwichee-doodles-mask.webp  29 704 octets, alpha-porteur
  src/app/globals.css                         --pattern-ink-a/-b dans :root ;
                                              body::before + media query 640px
  src/app/page.tsx                            `bg-bg` RETIRÉ du wrapper pleine largeur ;
                                              `md:bg-bg` AJOUTÉ sur <main>

PROCESSUS ARTISTE : docs/briefs/BRIEF_motif_dessine.md
  ★ NE PAS demander une tuile répétable. Qiwi Chee est l'EXCEPTION (elle a composé la
    sienne). On demande 8–15 gribouillis SÉPARÉS, noir sur blanc, photo à plat sans ombre,
    envoi PAR LIEN. La composition de la tuile est NOTRE travail.
  ★ Noir franc obligatoire : le masque se dérive du CONTRASTE. Un crayon pâle donne un
    alpha faible qu'aucune opacité ne rattrape. La qualité se décide À LA PHOTO, pas au code.
  ★ Barrière de droits DANS LE RPC (famille `rights_web_confirmed`) : un fond s'affiche sur
    chaque page — ce bug-là ne planterait pas, IL PUBLIERAIT.
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

## 🌐 MOTEUR DE COPIE — LIVRÉ EN BASE 2026-09-03

```
★★ LE LIEN COMPTE↔ARTISTE EXISTE ENFIN : `artist_accounts`.
  TABLE DE JOINTURE, PAS UNE COLONNE. La demande était « l'artiste OU SON AIDE » :
  une colonne owner_user_id marchait aujourd'hui et imposait de réécrire toutes les
  clauses RLS le jour où l'aide arrive. Le cas était DÉJÀ posé, pas hypothétique.
  ⇒ CECI FERME `owners` vs `artists`. event_engine.sql crée encore sa propre table
    `owners` : le CORRIGER pour pointer vers `artists` + `is_artist_member()` AVANT
    de le lancer.
  ⇒ ET : `auth.users` MÉLANGE FANS ET ARTISTES (4 comptes, dont 3 fans arrivés par
    magic link, aucune colonne ne les distingue). Toute policy demande « existe-t-il
    une ligne dans artist_accounts ? », JAMAIS « l'utilisateur est-il authentifié ? ».

TROIS COUCHES DE TEXTE, TROIS PROPRIÉTAIRES — inventaire complet : 159 chaînes.
  A · CHROME PLATEFORME   117 → fr.json/en.json, versionné git, JAMAIS éditable
  B · COPIE D'ARTISTE       7 → table site_copy, éditable par l'artiste
  C · CONTENU STRUCTURÉ    29 → bio_blocks, releases (tables + traductions)
  PARQUÉ : les 4 libellés de palier (règle épicène non résolue — ne pas expédier une
    violation dans une table éditable). À traiter avec le chantier LADDER.
  ★★ C'EST LE MODÈLE DE COÛT QUI REND L'OPTION INTERNATIONALE VENDABLE :
    A = 117 chaînes UNE FOIS par langue, pour toute la plateforme.
    B = 7 lignes par artiste et par langue.
    Si B avait fait 40, l'éditeur devenait un projet. À 7, c'est un formulaire.

★★ AVANT DE CLASSER UNE CHAÎNE EN B, VÉRIFIER SI C'EST UNE A AVEC UN PARAMÈTRE.
  QUATRE cas trouvés le même jour. Un pronom genré ou un nom d'artiste EN DUR ne fait
  PAS d'une chaîne de la copie d'artiste — il signale UN TROU À PARAMÉTRER.
    « Où viendrais-tu LA voir en concert ? » → `voir {artist}`      ⇒ reste A
    « © {year} Qiwi Chee. Tous droits… »     → `© {year} {artist}`  ⇒ reste A
  Sinon l'artiste #2 hérite du prénom de Qiwi Chee dans son propre pied de page.
  ★ Même famille que la règle épicène : on RESTRUCTURE pour que le problème ne puisse
    pas se poser, on ne cherche pas « le bon mot ».
  ⇒ 9 chaînes sont passées de B à A par ce test. B est tombé de 22 à 7.

★★ CLÉ PARTAGÉE = SENS PARTAGÉ, PAS ORTHOGRAPHE PARTAGÉE.
  `Ton adresse email` existe dans ContactForm ET dans AtelierGate. MÊMES MOTS
  aujourd'hui, DEUX CHAÎNES pour toujours (une demande de booking / la porte du fan).
  Fusionner sur la valeur du jour = devoir SCINDER une clé déjà en production, avec
  des lignes en base. Deux lignes au texte identique ne coûtent rien.
  ⚠️ 8 SITES DE DUPLICATION trouvés par l'audit — dont les 4 libellés d'objet, écrits
    DEUX FOIS (ContactForm et le corps du mail de notification). Modifier l'un laisse
    l'autre en silence. L'extraction corrige ça gratuitement.

★★ LANGUE D'ÉCRITURE ≠ LANGUE DE LA RACINE. DEUX COLONNES, PAS UNE.
  is_source   = la langue dans laquelle l'artiste ÉCRIT → Qiwi Chee : 'en'
  is_url_root = la langue servie sur `/`                → Qiwi Chee : 'fr'
  Elles pointent EN SENS OPPOSÉS pour la PREMIÈRE artiste (anglophone native, site
  français). Ce n'est pas de la généralisation spéculative — c'est le cas réel.

★★★ LE PLANCHER DE REPLI EST LA LANGUE PUBLIÉE, PAS LA LANGUE D'ÉCRITURE.
  PREMIÈRE VERSION DU RPC : demandé → source. Source = 'en', demande = 'en'
  ⇒ la chaîne se réduit à en→en, aucune ligne EN n'existe ⇒ ZÉRO LIGNE.
  En production : un `<h1>` VIDE, indiscernable d'un déploiement cassé.
  ⇒ TROIS NIVEAUX : demandé → source → url_root.
  ★ Le trou n'est PAS un cas limite : il existe pour CHAQUE artiste entre « j'ai
    déclaré ma langue d'écriture » et « je l'ai écrite ». Donc à chaque onboarding.
  ★ ATTRAPÉ PAR LE TEST, pas par la relecture. Test 4.8 (UNE seule clé traduite sur
    sept) a prouvé le rang 0 : six 'en' + une 'fr'. Le repli marche CLÉ PAR CLÉ,
    pas en tout-ou-rien.

★ LA PÉREMPTION SE DÉRIVE, ELLE NE SE STOCKE PAS.
  `source_hash` = hash de la valeur SOURCE contre laquelle la traduction a été relue.
  Comparaison À LA LECTURE. ⛔ PAS de booléen `needs_translation` maintenu par trigger :
  un drapeau de péremption qui périme lui-même est un bug particulièrement pénible.
  (Même principe que les badges dérivés de visit_count.)
  ★ source_hash NULLABLE = cas Belgique (deux langues d'auteur, aucune obsolescence à
    calculer). L'accommodation coûte une colonne nullable aujourd'hui, une refonte plus tard.

★ site_copy NE CONTIENT QUE DU PUBLIÉ. Brouillons et historique → copy_revisions,
  table EN INSERTION SEULE. Un retour arrière est une ÉCRITURE EN AVANT : republier une
  ancienne valeur insère une nouvelle révision, donc l'historique ne peut pas être
  corrompu par un rollback.
  ⇒ une traduction IA non validée NE PEUT PAS fuiter : le RPC public ne connaît que
    site_copy. Impossibilité STRUCTURELLE, pas consigne. (Famille de la barrière de
    droits dans get_bio_blocks.)

★ LES TRADUCTIONS IA SONT UN ÉCHAFAUDAGE, PAS UNE SOURCE.
  7 clés anglaises insérées en `origin='ai'`, `source_hash` NULL, et `artist_locales`
  garde `is_published=false` pour 'en' : AUCUN visiteur ne reçoit cet anglais.
  Qiwi Chee est ANGLOPHONE NATIVE — c'est ELLE qui écrira la vraie version, et le
  français sera estampillé contre SON anglais.
  ★ « Atelier » NE SE TRADUIT PAS : nom de produit, comme Résonance.
  ⚠️ Les blocs bio 4/5/7 sont trop intimes pour un dossier presse — leur anglais sera
    une RÉÉCRITURE, pas une traduction. Ne pas attendre du relire-et-valider.

FICHIER : docs/briefs/copy_engine_stage1_2.sql — ✅ LANCÉ ET VÉRIFIÉ 2026-09-03
  artist_accounts · artist_locales · site_copy · copy_revisions ·
  get_site_copy(slug, locale) · is_artist_member(artist_id, min_role)
  artist_id = 990b0d38-ffb8-4023-80ef-09c71ff5319a
  RLS ACTIVE, AUCUNE POLICY, AUCUN GRANT — délibéré : la lecture publique passe par un
  RPC security definer. Policies + grants arriveront AVEC l'éditeur, DANS LA MÊME
  TRANSACTION (grant sans policy = rien ; policy sans grant = 42501 qui ressemble à une
  panne d'auth — déjà perdu une soirée dessus sur `fans`).

⚠️ RIEN N'EST DÉPLOYÉ CÔTÉ PAGES. Elles lisent toujours leurs constantes en dur.
  ⚠️ ET : l'ancien page.tsx porte un const `artist` + 4 JSON-LD avec le nom, le genre et
    la description EN DUR. Ces faits existent MAINTENANT EN DEUX EXEMPLAIRES (code et
    site_copy), libres de diverger. À réconcilier dans la fenêtre `releases.ts` → table.

★ UN GABARIT A PEUT INTERPOLER UNE VALEUR B : `{artist} — {genre}` lit `artists.name`
  ET `site_copy`. La fonction de lecture côté app doit résoudre cette imbrication.
  À prévoir DÈS l'étape 4, pas à rattraper après.

ÉTAPES RESTANTES : 3b (extraire les 117) · 4 (les pages lisent le RPC) ·
  5 (next-intl : `[locale]`, /en, hreflang) · 6a éditeur · 6b traduction IA ·
  6c file d'attente + digest QUOTIDIEN (OVH SMTP, jamais Mailchimp : transactionnel).
```

---

## 🧭 NAV DANS LE LAYOUT — LIVRÉ 2026-09-04 (`afd538d`)

```
★★ UN ROUTE GROUP `(public)` EST LA BONNE FRONTIÈRE. PAS UN LAYOUT DE SEGMENT.
  Les layouts Next.js S'IMBRIQUENT, ils ne se REMPLACENT pas : un
  `src/app/atelier/layout.tsx` NE PEUT PAS annuler ce que le layout RACINE rend
  au-dessus de lui. (Erreur commise dans le brief, corrigée par Claude Code.)
  ⇒ `src/app/(public)/` porte SiteNav ; `/atelier/*` reste DEHORS et n'hérite que du
    layout racine. Les parenthèses n'apparaissent PAS dans l'URL.
  ★ LE PIÈGE : le layout RACINE s'applique à TOUTES les routes. Y monter la nav
    publique la ferait apparaître sur /atelier et /atelier/welcome — dont tout l'objet
    est de garder la personne DANS un parcours. C'est une décision PRODUIT, pas un
    détail de rendu.
  ★ STRUCTURE > CONDITION : `usePathname()` aurait imposé `'use client'` ET serait une
    règle qu'on oublie. Un route group est une impossibilité.
  ✅ VÉRIFIÉ EN PRODUCTION : /atelier n'a aucun en-tête.

★ ANCRE DEPUIS UNE AUTRE PAGE : `#music` depuis /contact cherche une ancre DANS
  /contact. Le lien NE PLANTE PAS — IL NE FAIT RIEN. ⇒ `/#music`, absolu.
  ★ `<a>` DÉLIBÉRÉ (pas `<Link>`) sur les ancres : `<Link>` ne garantit pas le
    défilement lors d'un changement de route. VÉRIFIÉ EN PREVIEW : /contact →
    « Musique » arrive bien SUR la section. Le lint `no-html-link-for-pages` est
    supprimé sur ces deux lignes AVEC LE MOTIF ÉCRIT À CÔTÉ — sinon une session future
    le « corrigera ».

★ HEADER STICKY ⇒ `bg-bg` OBLIGATOIRE. Sans fond opaque, le contenu défile DESSOUS.
  ★ `scroll-mt-*` s'est révélé INUTILE ici : les sections ont déjà assez de padding.
    MESURÉ, pas supposé — on n'ajoute pas du CSS pour un problème qu'on n'a pas.

★ CONTACT : le mailto est SORTI de la phrase d'intro (deux canaux dans une phrase = le
  visiteur hésite) et redescendu SOUS le formulaire, en repli : « Si le formulaire ne
  fonctionne pas : … ». L'adresse RESTE dans le HTML — un crawler ne remplit pas de
  formulaire. Le cadrage supprime le CHOIX sans supprimer la DÉCOUVRABILITÉ.

FICHIERS : src/app/components/SiteNav.tsx (serveur, pas de 'use client') ·
  src/app/(public)/layout.tsx (fragment nu — AUCUN wrapper, donc rien n'enterre le motif) ·
  src/app/(public)/page.tsx et (public)/contact/page.tsx (DÉPLACÉS : git confirme
  « rename … 88% / 80% »).
```

---

## ☁️ VERCEL — VARIABLES D'ENVIRONNEMENT (appris à la dure 2026-09-04)

```
★★★ VÉRIFIER LA PORTÉE **PREVIEW**, PAS SEULEMENT PRODUCTION.
  `NEXT_PUBLIC_SUPABASE_URL` et `_ANON_KEY` étaient en **Production SEULE** depuis
  juin. Toute preview crashait en `MIDDLEWARE_INVOCATION_FAILED` :
  « Your project's URL and Key are required to create a Supabase client ».
  ⇒ TOUTE branche aurait échoué de la même façon. Ce n'était PAS un bug de 3a.
  ★★ ET ÇA N'AURAIT JAMAIS ÉTÉ TROUVÉ EN MERGEANT DIRECTEMENT : la production avait
    ses variables. C'est L'ÉTAPE PREVIEW ELLE-MÊME — sautée en août — qui a révélé le
    trou, à son premier usage réel.

★ VERCEL REFUSE D'AJOUTER UN ENVIRONNEMENT À UNE VARIABLE EXISTANTE.
  La case « Preview » reste grisée : conflit de nom avec l'entrée Production.
  ⇒ SUPPRIMER puis RECRÉER avec les deux cases cochées. Il n'y a pas d'autre chemin, et
    l'échec est SILENCIEUX (la ligne reste « Production », sans message d'erreur).

★ TYPE **CONFIG**, PAS **SECRET**, POUR TOUT `NEXT_PUBLIC_`.
  Secret = illisible après enregistrement ⇒ impossible de vérifier ce qui est stocké,
  ce qui a transformé un diagnostic de deux minutes en une heure.
  ★ La clé anon EST publique par conception (elle part dans chaque page). C'est la RLS
    qui protège, pas le secret de la clé.
  ⛔ Ne JAMAIS retirer le préfixe `NEXT_PUBLIC_` malgré l'avertissement Vercel : Next
    n'inline QUE ce préfixe côté navigateur.
  ⛔ `SUPABASE_SERVICE_ROLE_KEY` reste serveur-only et SANS préfixe : elle contourne la RLS.

★ REDÉPLOYER EN DÉCOCHANT « Use existing Build Cache » : les `NEXT_PUBLIC_` sont
  INLINÉES À LA COMPILATION. Un build en cache reporte l'ancienne configuration.

★ OBSERVABILITY (offre gratuite) NE MONTRE PAS LES TRACES, seulement des compteurs.
  Le message d'erreur réel est dans **Deployments → le déploiement → onglet Logs**,
  scopé à ce déploiement, sans filtre à combattre.

⚠️ LES PREVIEWS NE PEUVENT PAS TESTER L'AUTH : origine différente ⇒ pas de session, et
  le Site URL Supabase pointe vers la production (config PAR PROJET, learning 9). Une
  route protégée se vérifie APRÈS merge, en production, avec `git revert -m 1 HEAD` prêt.
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

★ 24. (2026-08-26) **UN CONTENEUR PLEINE LARGEUR À FOND OPAQUE MASQUE UNE COUCHE `fixed`.**
   `<div className="min-h-screen bg-bg">` recouvrait `body::before` partout. Le motif ne
   s'affichait pas mal — IL ÉTAIT ENTERRÉ.
   ★ LE SYMPTÔME DÉSIGNAIT LA CAUSE : visible seulement en BAS de page et sur `/contact`
     — exactement là où le conteneur s'arrête et là où il n'existe pas.
   ⇒ Couche `fixed` partiellement visible ⇒ CHERCHER LE COUVERCLE avant de déboguer la couche.
   ⚠️ Le panneau et la page portent la MÊME couleur : aucun bord ne le signale. Il ne se
     voit QUE par l'absence de motif dessous. (Famille du learning 10 : le code était bon,
     le rendu était intercepté.)

★ 25. (2026-08-26) **UN ORNEMENT D'ARTISTE SE LIVRE EN MASQUE ALPHA, JAMAIS EN RASTER
   COLORÉ.** La forme dans le fichier, la couleur dans `:root`. Mesuré : 168 Ko → 29,7 Ko,
   hex-clean respecté, et un changement d'encre coûte deux tokens au lieu d'un ré-export.

★ 26. (2026-08-26) **UN PLAFOND DE CONTRASTE EST FIXÉ PAR LE TOKEN LE PLUS FAIBLE, PAS PAR
   LE TEXTE PRINCIPAL.** `--text` tenait jusqu'à o=0,5 ; `--text-muted` lâchait à 0,35.
   ⇒ Toute vérif AA se fait sur le token le PLUS FAIBLE présent sur la surface, et le
     chiffre obtenu ne vaut QUE pour cette palette — il se recalcule quand elle change.

★ 27. (2026-08-26) **`file` NE SUFFIT PAS À IDENTIFIER UNE IMAGE SUR CE POSTE.** Il renvoie
   « RIFF (little-endian) data, Web/P image » : ni dimensions, ni alpha, ni encodage.
   L'identité d'un binaire, c'est `stat -c %s` comparé à la taille attendue.
   (Extension du learning 15 : `head -3` marche pour du texte, pas pour du binaire.)

★ 28. (2026-08-26) **`git checkout -b` PUIS `checkout main && merge && push` LANCÉS
   D'AFFILÉE = PUSH DIRECT EN PRODUCTION.** La preview Vercel n'existe qu'ENTRE les deux,
   au moment du `git push -u origin <branche>`. Enchaîner les deux moitiés saute l'étape
   entièrement — et RIEN ne le signale.
   ⇒ Ce sont deux MOMENTS séparés par un test, pas une séquence de commandes.
   ★ APPLIQUÉ LE 2026-09-04, et l'étape a IMMÉDIATEMENT payé : voir learning 35.

★ 29. (2026-09-03) **UN COMPTE DE RÉSULTATS N'EST PAS UN COMPTE D'OCCURRENCES.**
   `grep -n CONTACT_EMAIL` a rendu 3 lignes pour 4 usages : deux tenaient sur la même
   ligne. (Extension du learning 16, qui portait sur la casse.)

★ 30. (2026-09-03) **LE SQL EDITOR SUPABASE N'AFFICHE QUE LA DERNIÈRE REQUÊTE.**
   Deux `select` collés dans le même onglet ⇒ le résultat du premier est perdu SANS
   AUCUN AVERTISSEMENT. Une requête de vérification = un onglet.

★ 31. (2026-09-04) **`grep` LIT LE DISQUE, L'ÉDITEUR GARDE UN TAMPON.**
   Un grep a montré l'ANCIEN état d'un fichier non enregistré et on a cru à une
   incohérence entre l'éditeur et la base. `Ctrl+S` AVANT tout `grep` ou `git diff`.

★ 32. (2026-09-04) **PAS DE HEREDOC COLLÉ POUR DU CONTENU LONG — LA RÈGLE EXISTAIT
   DÉJÀ ET A ÉTÉ ENFREINTE.** Un `cat >> fichier << 'EOF'` de 40 lignes a été entrelacé
   par le terminal : lignes dans le désordre, `EOF` jamais reçu, fichier corrompu.
   `git checkout <fichier>` a tout restauré (il était committé).
   ⇒ Télécharger puis `cp`, ou coller dans VS Code et enregistrer. JAMAIS le terminal.
   ⇒ Et si un collage a l'air bizarre : `Ctrl+C` AVANT Entrée. Après Entrée, bash est
     déjà en train de parser et le mal est fait.

★ 33. (2026-09-04) **`git diff HEAD` NE MONTRE PAS LES FICHIERS NON SUIVIS.**
   Après un déplacement de fichiers, le diff n'affichait QUE des suppressions — les
   nouveaux étaient en `??`. Pour comparer un fichier déplacé à sa version committée :
   `git show HEAD:ancien/chemin | diff -u - nouveau/chemin`.
   ★ Et c'est le `git commit` qui a CONFIRMÉ le déplacement : « rename … (88%) ».

★ 34. (2026-09-04) **LES LAYOUTS NEXT S'IMBRIQUENT, ILS NE SE REMPLACENT PAS.**
   Un layout de segment ne peut PAS annuler ce que le layout racine rend au-dessus de
   lui. Pour qu'une branche de routes N'HÉRITE PAS d'un habillage : ROUTE GROUP.

★ 35. (2026-09-04) **UN TROU DE CONFIGURATION NE SE VOIT QU'EN PREVIEW.**
   Les variables Supabase manquaient en Preview DEPUIS JUIN. La production marchait,
   donc rien ne le signalait, et aucune relecture de code ne pouvait le trouver.
   ⇒ Un environnement qui n'est jamais exercé n'est pas « qui marche », il est INCONNU.
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
[x] ★★ MOTIF DESSINÉ — masque alpha + tokens d'encre, deux largeurs (b3069a2). CLOSED.
[x] ★★ INVENTAIRE DES 159 CHAÎNES (A=117 · B=7 · C=29 · 4 parquées). CLOSED.
[x] ★★ MOTEUR DE COPIE EN BASE — artist_accounts · artist_locales · site_copy ·
    copy_revisions · get_site_copy. Repli à 3 niveaux PROUVÉ par un cas réel. CLOSED.
[x] ★★ `owners` vs `artists` — TRANCHÉ : `artist_accounts`, `artists` reste l'ancre.
    ⚠️ event_engine.sql doit encore être CORRIGÉ avant d'être lancé. CLOSED (décision).
[x] ★★ NAV DANS LE LAYOUT + `/#music` + Contact atteignable + sticky (afd538d). CLOSED.

[ ] ★★ 3b — EXTRAIRE LES 117 CHAÎNES DE CHROME vers fr.json/en.json.
    Worklist : `docs/audits/copy_inventory.md`. Inclut la DETTE A11Y
    (`aria-label="Primary"`, `<label>Website</label>`) et les 8 duplications.
[ ] ★★ ÉTAPE 4 — les pages lisent site_copy via le RPC (+ résoudre `{artist}`/`{genre}`
    dans les gabarits A). MÊME FENÊTRE que `releases.ts` → table et les colonnes
    `artists` du motif : les mêmes faits sont AUJOURD'HUI en double dans page.tsx.
[ ] ★★ ÉTAPE 5 — next-intl. ⚠️ Next 16 : `middleware.ts` → `proxy.ts`, fonction exportée
    nommée `proxy`, runtime Node (option `runtime` indisponible). next-intl NÉGOCIE
    DÉJÀ (préfixe → cookie → accept-language) : ne PAS écrire de 307/Vary à la main.
    ⚠️ EXIGE UN SEGMENT `[locale]` ⇒ toutes les pages descendent d'un niveau. Large.
[ ] ★★ ÉTAPE 6a — éditeur `/atelier/artiste` : 7 clés, FR/EN CÔTE À CÔTE (pas un
    sélecteur : la dérive se voit dans la comparaison), révisions, retour arrière,
    indicateur de péremption. + policies RLS et grants DANS LA MÊME TRANSACTION.
    ⚠️ La sauvegarde DOIT invalider le cache (`revalidatePath`) dans le MÊME commit,
    sinon l'artiste voit l'ancien texte et conclut que l'éditeur est cassé.
[ ] ★ 6b traduction IA (drafts `origin='ai'`, jamais publiés d'office) · 6c file
    d'attente dérivée + digest QUOTIDIEN (jamais par édition) via OVH SMTP.
[ ] ★ TEST 4.8 BIS : à la première ligne anglaise ÉCRITE PAR ELLE, re-vérifier que le
    rang 0 gagne clé par clé.
[ ] ★ QIWI CHEE : écrire l'anglais des 7 clés (elle est anglophone native — c'est de
    l'ÉCRITURE, pas de la relecture). Puis estampiller le français contre son anglais.

[ ] ★★ TESTER LE MASQUE SUR iOS/WebKit. Android validé par Qiwi Chee. Si échec :
    rectangle plein (règle alpha-only). EN PRODUCTION depuis le 2026-08-26 sans ce test.

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
[ ] ★ COLONNES `artists` DU MOTIF (pattern_path, ink_a/b, tile, opacity, follows_release,
    rights_confirmed) — nullables, barrière de droits DANS LE RPC. À faire AVEC la sortie
    de `releases.ts` du code : même chantier, même fenêtre.
[ ] ★ INDENTATION de `<main>` dans page.tsx (18 espaces au lieu de 6). Cosmétique.
[ ] ★ DEMANDER À QIWI CHEE si le motif est assez marqué sur téléphone (0,22 vs 0,45).
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
- ★ ORNEMENT D'ARTISTE = MASQUE ALPHA + tokens dans `:root`. Jamais un raster coloré : il
  gèle la palette et casse le release-switcher.
- ★ COUCHE `fixed` PARTIELLEMENT VISIBLE ⇒ chercher un conteneur pleine largeur à fond
  opaque AVANT de déboguer la couche.
- ★ VÉRIF AA SUR LE TOKEN LE PLUS FAIBLE de la surface (`--text-muted`, pas `--text`), et
  le plafond obtenu ne vaut QUE pour cette palette.
- ★ IDENTITÉ D'UN BINAIRE = `stat -c %s`, pas `file` ni `head`.
- ★ PREVIEW VERCEL = `git push -u origin <branche>` PUIS test PUIS merge. Enchaîner
  création de branche et merge saute la preview sans avertissement.
- ★ AVANT DE CLASSER UNE CHAÎNE EN COPIE D'ARTISTE : est-ce une chaîne de CHROME AVEC
  UN PARAMÈTRE ? Un pronom genré ou un nom en dur signale un TROU, pas une voix.
- ★ CLÉ PARTAGÉE = SENS PARTAGÉ, PAS ORTHOGRAPHE PARTAGÉE. Deux chaînes identiques
  aujourd'hui restent DEUX chaînes : scinder une clé en production coûte une migration.
- ★ REPLI DE LANGUE : demandé → source → url_root. Le PLANCHER est la langue PUBLIÉE,
  jamais la langue d'écriture (elle peut être vide pendant tout un onboarding).
- ★ POUR QU'UNE BRANCHE DE ROUTES N'HÉRITE PAS D'UN HABILLAGE : route group `(nom)`,
  jamais un test de chemin. Structure > condition.
- ★ VERCEL : vérifier la portée PREVIEW des variables, pas seulement Production.
  Impossible d'ajouter un environnement à une variable existante → SUPPRIMER/RECRÉER.
  Type CONFIG pour tout `NEXT_PUBLIC_` (Secret = invérifiable après coup).
  Redéploiement en DÉCOCHANT le build cache. Erreurs réelles : onglet Logs DU déploiement.
- ★ JAMAIS DE HEREDOC COLLÉ dans le terminal. Télécharger puis `cp`, ou VS Code.
  (Règle déjà écrite, enfreinte le 2026-09-04 : fichier corrompu, restauré par git.)
- ★ `Ctrl+S` AVANT tout `grep` ou `git diff` : ils lisent le DISQUE, pas le tampon.
- ★ UNE REQUÊTE DE VÉRIFICATION = UN ONGLET dans le SQL Editor (il n'affiche que la
  dernière).
- ★ VS CODE — DIRECTIONS DÉTAILLÉES DEMANDÉES (Bassim débute sur l'éditeur) :
  `Ctrl+P` ouvrir un fichier · `Ctrl+G` aller à une ligne · clic sur le NUMÉRO de ligne
  puis `Shift`+clic pour sélectionner un bloc · `Home` + `Shift+End` pour remplacer une
  ligne · `Ctrl+Shift+V` coller sans reformatage · `Ctrl+End` fin de fichier.
  ⚠️ CLIQUER D'ABORD DANS LE CODE : si le terminal a le focus, `Ctrl+G` part ailleurs et
    rien ne bouge (arrivé deux fois). Le témoin est `Ln x, Col y` en bas à droite.
  ⚠️ NE PAS double-cliquer un token contenant un tiret (`accent-bright`, `bg-bg`) :
    `-` est un séparateur de mot, la sélection est partielle.
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
*Updated 2026-09-04 · Deux sessions, deux découvertes qui ne venaient pas du code. La
première : un repli de langue qui s'arrêtait à la langue d'écriture rendait ZÉRO ligne —
attrapé par un test qui demandait une langue encore vide, c'est-à-dire l'état normal de
tout artiste au premier jour. La seconde : les variables Supabase manquaient en Preview
depuis juin, invisibles parce que la production, elle, marchait. L'étape preview — sautée
en août — a payé son coût dès son premier usage réel. Et le vrai gain de ces deux jours
n'est ni la nav ni le schéma : c'est `artist_accounts`, le lien compte↔artiste qui
manquait, et qui débloque d'un coup event_engine, la RLS de contact_messages et
l'éditeur que Qiwi Chee a demandé.*
