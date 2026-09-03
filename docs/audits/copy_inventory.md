# Inventaire de la copie — Qiwichee (audit lecture seule)

> Généré le 2026-09-03 · Préalable au chantier bilingue.
> **Aucun fichier existant modifié.** Ce fichier est le seul artefact produit.

---

## Convention des clés

Format `scope.element` ou `scope.sub.element` en minuscules, points comme séparateurs.
Scopes principaux dérivés de la structure réelle du produit :

| Scope | Zone |
|---|---|
| `meta` | Metadata Next.js / OpenGraph / JSON-LD (SEO) |
| `nav` | Navigation principale |
| `hero` | Section d'accroche page d'accueil |
| `section` | Titres de sections de page |
| `contact` | Page /contact et formulaire |
| `atelier.gate` | Porte d'entrée Atelier (form magic-link) |
| `atelier.welcome` | Onboarding première connexion |
| `atelier.profile` | Écran de profil (pseudo + villes + sauvegarde) |
| `atelier.insider` | Section contenu exclusif |
| `atelier` | Éléments généraux Atelier |
| `footer` | Pied de page |
| `bio` | Carrousel biographie |
| `releases` | Carrousel sorties musicales |
| `player` | Lecteur embed (EmbedPlayer) |
| `external_link` | Composant ExternalLink |
| `cities` | Sélecteur de villes |
| `fan` | Statuts de fan (tiers) |
| `mail` | Corps des mails sortants |
| `release.{slug}` | Données par sortie (couche C) |

---

## Tableau principal

> **Lecture** : `déjà extrait: oui` = le composant suit déjà le motif cible (objet `copy` plat
> en haut du fichier, clés anglaises, valeurs françaises). Ces chaînes se déplacent par
> copier-coller le jour du bilingue.
>
> Doublons inter-fichiers : si la même clé apparaît dans plusieurs fichiers, la première
> occurrence porte la définition complète ; les suivantes portent la mention `→ même clé`.

| # | fichier:ligne | chaîne (fr) | contexte | couche | clé proposée | drapeaux | déjà extrait |
|---|---|---|---|---|---|---|---|
| 1 | `src/app/layout.tsx:21` | `%s \| Qiwi Chee` | Modèle de titre d'onglet (Next.js `title.template`) | B | `meta.title.template` | [seo] [interp] | non |
| 2 | `src/app/layout.tsx:22` | `Qiwi Chee — Pop alternative` | Titre par défaut (page d'accueil, onglet + Google) | B | `meta.title.default` | [seo] [interp] | non |
| 3 | `src/app/layout.tsx:24-25` | `Autrice-compositrice-interprète indépendante, basée à Paris. Pop alternative franco-algérienne-américaine, en français et en anglais.` | Meta description (Google snippet, OG) — identique dans layout et contact/page.tsx | B | `meta.description` | [seo] [épicène] | non |
| 4 | `src/app/layout.tsx:33` | `Qiwi Chee — Pop alternative` | OpenGraph title (partage social) | B | `meta.og.title` | [seo] [interp] | non |
| 5 | `src/app/page.tsx:120` | `Primary` | `aria-label` de la `<nav>` principale | A | `nav.primary.aria_label` | [a11y] ⚠️ DETTE A11Y — chaîne en anglais sur site français | non |
| 6 | `src/app/page.tsx:123` | `Qiwi Chee` | Nom de l'artiste en marque dans la nav (logo textuel) | B | `artist.name` | — | non |
| 7 | `src/app/page.tsx:127` | `Musique` | Lien nav vers la section #music | A | `nav.music` | — | non |
| 8 | `src/app/page.tsx:131` | `À propos` | Lien nav vers la section #about | A | `nav.about` | — | non |
| 9 | `src/app/page.tsx:148` | `Autrice-compositrice-interprète indépendante. Pop alternative, en français et en anglais.` | Accroche sous le h1 de la page d'accueil | B | `hero.tagline` | [épicène] | non |
| 10 | `src/app/page.tsx:159` | `À propos` | Titre h2 de la section biographie | A | `section.about.heading` | — | non |
| 11 | `src/app/page.tsx:170` | `Musique` | Titre h2 de la section sorties | A | `section.music.heading` | — | non |
| 12 | `src/app/page.tsx:52` | `Le clip officiel de Lullabies par Qiwi Chee.` | `description` du JSON-LD VideoObject (lu par crawlers/IA) | C | `release.lullabies.jsonld.description` | [seo] [interp] | non |
| 13 | `src/app/contact/page.tsx:20` | `Contact` | Titre de la page /contact (devient « Contact \| Qiwi Chee » via template) | A | `contact.meta.title` | [seo] | non |
| 14 | `src/app/contact/page.tsx:22-23` | `Contacter Qiwi Chee — booking, presse, collaborations. Autrice-compositrice-interprète indépendante basée à Paris.` | Meta description de /contact | B | `contact.meta.description` | [seo] [interp] [épicène] | non |
| 15 | `src/app/contact/page.tsx:28` | `Contact — Qiwi Chee` | OpenGraph title de /contact | B | `contact.meta.og_title` | [seo] [interp] | non |
| 16 | `src/app/contact/page.tsx:29` | `Booking, presse, collaborations.` | OpenGraph description de /contact | A | `contact.meta.og_description` | [seo] | non |
| 17 | `src/app/contact/page.tsx:57` | `← Qiwi Chee` | Lien retour vers la page d'accueil depuis /contact | B | `contact.back` | [interp] | non |
| 18 | `src/app/contact/page.tsx:59` | `Contact` | Titre h1 de la page de contact | A | `contact.heading` | — | non |
| 19 | `src/app/contact/page.tsx:61-63` | `Pour un concert, une demande presse ou une collaboration — écris ici, ou directement à` | Introduction de la page contact avant le formulaire | A | `contact.intro` | — | non |
| 20 | `src/app/atelier/page.tsx:20` | `Ami·e` | Pseudo de secours affiché dans le h1 Atelier si pas de surnom ni d'email | A | `atelier.greeting.fallback` | [épicène] | non |
| 21 | `src/app/atelier/page.tsx:37-40` | `Contenu` | Titre h2 de la section coming-soon de l'Atelier | A | `section.content.heading` | — | non |
| 22 | `src/app/atelier/page.tsx:41-43` | `L'Atelier arrive — contenu en route ✦` | Texte placeholder du coming-soon Atelier | B | `atelier.content.placeholder` | — | non |
| 23 | `src/app/atelier/welcome/page.tsx:17-19` | `Bienvenue dans l'Atelier ✦` | Titre h1 de la page d'onboarding première connexion | B | `atelier.welcome.heading` | — | non |
| 24 | `src/app/atelier/welcome/page.tsx:19-21` | `Dis-nous comment t'appeler. Tu pourras tout changer plus tard.` | Sous-titre d'onboarding | A | `atelier.welcome.intro` | — | non |
| 25 | `src/app/atelier/AtelierContent.tsx:69-71` | `Bienvenue, {nickname}` | Titre h1 personnalisé dans l'Atelier | A | `atelier.greeting` | [interp] | non |
| 26 | `src/app/atelier/AtelierContent.tsx:15` | `Concert privé — clip Atelier` | Titre du clip exclusif Atelier (insiderClip.title, utilisé aussi dans aria-label du lecteur) | B | `atelier.insider.clip.title` | [a11y] | non |
| 27 | `src/app/atelier/AtelierContent.tsx:82-85` | `Exclusivité Atelier` | Titre h2 de la section contenu exclusif | B | `atelier.insider.heading` | — | non |
| 28 | `src/app/atelier/AtelierContent.tsx:90` | `Qiwi Chee en concert, bannière peinte « Release + Decay »` | `alt` du poster du clip exclusif | C | `atelier.insider.clip.poster_alt` | [a11y] | non |
| 29 | `src/app/atelier/AtelierContent.tsx:91` | `Bientôt — réservé à l'Atelier` | Label affiché sur le lecteur verrouillé (lockedLabel) | B | `atelier.insider.locked_label` | — | non |
| 30 | `src/app/atelier/AtelierContent.tsx:92-93` | `Un extrait qui n'existe nulle part ailleurs.` | Légende (figcaption) du lecteur exclusif | B | `atelier.insider.caption` | — | non |
| 31 | `src/app/atelier/AtelierContent.tsx:99-101` | `Ton profil` | Titre h2 de la section profil dans l'Atelier | A | `atelier.profile.heading` | — | non |
| 32 | `src/app/atelier/AtelierContent.tsx:108-110` | `Ton pseudo` | Label du champ pseudo | A | `atelier.profile.nickname.label` | — | non |
| 33 | `src/app/atelier/AtelierContent.tsx:117` | `Le nom que voient les autres dans l'Atelier.` | Placeholder du champ pseudo (profil) | A | `atelier.profile.nickname.placeholder` | — | non |
| 34 | `src/app/atelier/AtelierContent.tsx:124` | `Où viendrais-tu la voir en concert ?` | Question pour le sélecteur de villes (profil) | A | `atelier.profile.cities.question` | [épicène] | non |
| 35 | `src/app/atelier/AtelierContent.tsx:125` | `Choisis une ou plusieurs villes — ça aide Qiwi Chee à savoir où organiser le prochain concert.` | Indice sous le sélecteur de villes (profil) | B | `atelier.profile.cities.hint` | [interp] | non |
| 36 | `src/app/atelier/AtelierContent.tsx:137` | `Sauvegarder` | Bouton de sauvegarde du profil (état idle) | A | `atelier.profile.save.idle` | — | non |
| 37 | `src/app/atelier/AtelierContent.tsx:137` | `Sauvegarde…` | Bouton de sauvegarde du profil (état saving) | A | `atelier.profile.save.saving` | — | non |
| 38 | `src/app/atelier/AtelierContent.tsx:141` | `Sauvegardé ✓` | Confirmation après sauvegarde réussie | A | `atelier.profile.save.success` | — | non |
| 39 | `src/app/atelier/AtelierContent.tsx:143-144` | `Choisis un pseudo.` | Erreur de validation : pseudo vide | A | `atelier.profile.save.error_required` | — | non |
| 40 | `src/app/atelier/AtelierContent.tsx:146-147` | `Erreur — réessaie.` | Erreur générique après sauvegarde échouée | A | `atelier.profile.save.error_generic` | — | non |
| 41 | `src/app/atelier/AtelierContent.tsx:159-162` | `Se déconnecter` | Bouton de déconnexion | A | `atelier.signout` | — | non |
| 42 | `src/app/atelier/welcome/WelcomeForm.tsx:54-56` | `Ton surnom` | Label du champ surnom (onboarding) | A | `atelier.welcome.nickname.label` | — | non |
| 43 | `src/app/atelier/welcome/WelcomeForm.tsx:55-56` | `(obligatoire)` | Texte sr-only indiquant le caractère obligatoire du champ surnom | A | `atelier.welcome.nickname.required` | [a11y] | non |
| 44 | `src/app/atelier/welcome/WelcomeForm.tsx:64-65` | `Comment te faire appeler ?` | Placeholder du champ surnom (onboarding) | A | `atelier.welcome.nickname.placeholder` | — | non |
| 45 | `src/app/atelier/welcome/WelcomeForm.tsx:72` | `Où viendrais-tu la voir en concert ?` | Question villes (onboarding) — même clé que profil | A | → `atelier.profile.cities.question` | [épicène] | non |
| 46 | `src/app/atelier/welcome/WelcomeForm.tsx:73` | `Choisis une ou plusieurs villes — ça aide Qiwi Chee à savoir où organiser le prochain concert.` | Indice villes (onboarding) — même clé que profil | B | → `atelier.profile.cities.hint` | [interp] | non |
| 47 | `src/app/atelier/welcome/WelcomeForm.tsx:18` | `Un surnom est requis.` | Erreur de validation : surnom vide (onboarding) | A | `atelier.welcome.error.nickname_required` | — | non |
| 48 | `src/app/atelier/welcome/WelcomeForm.tsx:43` | `Une erreur est survenue. Réessaie.` | Erreur générique onboarding (Supabase update échoué) | A | `atelier.welcome.error.generic` | — | non |
| 49 | `src/app/atelier/welcome/WelcomeForm.tsx:89` | `Accéder à l'Atelier` | Bouton de soumission onboarding (idle) | A | `atelier.welcome.submit.idle` | — | non |
| 50 | `src/app/atelier/welcome/WelcomeForm.tsx:89` | `Sauvegarde…` | Bouton de soumission onboarding (saving) — même clé que profil | A | → `atelier.profile.save.saving` | — | non |
| 51 | `src/app/atelier/welcome/WelcomeForm.tsx:96-98` | `Passer` | Bouton skip pour accéder à l'Atelier sans remplir le profil | A | `atelier.welcome.skip` | — | non |
| 52 | `src/app/components/ContactForm.tsx:33` | `Ton nom` | Label du champ nom — objet `copy` | A | `contact.form.name.label` | — | oui |
| 53 | `src/app/components/ContactForm.tsx:34` | `Ton adresse email` | Label du champ email — objet `copy` | A | `contact.form.email.label` | — | oui |
| 54 | `src/app/components/ContactForm.tsx:35` | `Ton téléphone (facultatif)` | Label du champ téléphone — objet `copy` | A | `contact.form.phone.label` | — | oui |
| 55 | `src/app/components/ContactForm.tsx:36` | `Utile pour un rappel rapide — tu peux laisser vide.` | Indice persistant sous le champ téléphone — objet `copy` | A | `contact.form.phone.hint` | — | oui |
| 56 | `src/app/components/ContactForm.tsx:37` | `Objet` | Label du sélecteur d'objet — objet `copy` | A | `contact.form.subject.label` | — | oui |
| 57 | `src/app/components/ContactForm.tsx:38` | `Concert / booking` | Libellé de l'option concert — objet `copy` | A | `contact.form.subject.concert` | — | oui |
| 58 | `src/app/components/ContactForm.tsx:39` | `Presse` | Libellé de l'option presse — objet `copy` | A | `contact.form.subject.presse` | — | oui |
| 59 | `src/app/components/ContactForm.tsx:40` | `Collaboration` | Libellé de l'option collaboration — objet `copy` | A | `contact.form.subject.collaboration` | — | oui |
| 60 | `src/app/components/ContactForm.tsx:41` | `Autre` | Libellé de l'option autre — objet `copy` | A | `contact.form.subject.autre` | — | oui |
| 61 | `src/app/components/ContactForm.tsx:42` | `Ton message` | Label du textarea message — objet `copy` | A | `contact.form.message.label` | — | oui |
| 62 | `src/app/components/ContactForm.tsx:43` | `Dis-nous en quelques lignes ce qui t'amène.` | Placeholder du textarea — objet `copy` | A | `contact.form.message.placeholder` | — | oui |
| 63 | `src/app/components/ContactForm.tsx:44` | `Au moins {MIN_MESSAGE} caractères.` | Indice de contrainte de longueur (toujours visible) — objet `copy` | A | `contact.form.message.hint` | [interp] | oui |
| 64 | `src/app/components/ContactForm.tsx:45` | `Envoyer` | Bouton de soumission (idle) — objet `copy` | A | `contact.form.submit.idle` | — | oui |
| 65 | `src/app/components/ContactForm.tsx:46` | `Envoi en cours…` | Bouton de soumission (sending) — objet `copy` | A | `contact.form.submit.sending` | — | oui |
| 66 | `src/app/components/ContactForm.tsx:47` | `Message envoyé` | Titre de la confirmation post-envoi — objet `copy` | A | `contact.form.success.title` | — | oui |
| 67 | `src/app/components/ContactForm.tsx:48` | `Merci — une réponse arrivera par email.` | Corps de la confirmation post-envoi — objet `copy` | A | `contact.form.success.body` | — | oui |
| 68 | `src/app/components/ContactForm.tsx:49` | `← Retour à l'accueil` | Lien retour dans l'écran de confirmation — objet `copy` | A | `contact.form.success.back` | — | oui |
| 69 | `src/app/components/ContactForm.tsx:52` | `Indique ton nom (2 caractères minimum).` | Erreur champ nom — objet `copy` | A | `contact.form.error.name` | [interp] | oui |
| 70 | `src/app/components/ContactForm.tsx:53` | `Cette adresse email ne semble pas valide.` | Erreur champ email — objet `copy` | A | `contact.form.error.email` | — | oui |
| 71 | `src/app/components/ContactForm.tsx:54` | `Ce numéro ne semble pas valide (chiffres, espaces, + et - seulement).` | Erreur champ téléphone — objet `copy` | A | `contact.form.error.phone` | — | oui |
| 72 | `src/app/components/ContactForm.tsx:55` | `Choisis un objet.` | Erreur champ objet — objet `copy` | A | `contact.form.error.subject` | — | oui |
| 73 | `src/app/components/ContactForm.tsx:56` | `Ton message est trop court — {MIN_MESSAGE} caractères minimum.` | Erreur message trop court — objet `copy` | A | `contact.form.error.message_short` | [interp] | oui |
| 74 | `src/app/components/ContactForm.tsx:57` | `Ton message dépasse {MAX_MESSAGE} caractères.` | Erreur message trop long — objet `copy` | A | `contact.form.error.message_long` | [interp] | oui |
| 75 | `src/app/components/ContactForm.tsx:59` | `L'envoi a échoué. Réessaie dans un instant.` | Erreur réseau générique — objet `copy` | A | `contact.form.error.generic` | — | oui |
| 76 | `src/app/components/ContactForm.tsx:60-61` | `Trop de messages envoyés depuis cette connexion. Réessaie dans une heure.` | Erreur rate-limit — objet `copy` | A | `contact.form.error.rate_limited` | — | oui |
| 77 | `src/app/components/ContactForm.tsx:62` | `Vérifie les champs signalés ci-dessus.` | Erreur invalide (retour serveur) — objet `copy` | A | `contact.form.error.invalid` | — | oui |
| 78 | `src/app/components/ContactForm.tsx:319` | `Website` | Label honeypot (masqué, `aria-hidden="true"`) | A | `contact.form.honeypot.label` | [a11y] ⚠️ DETTE A11Y — English sur site français | oui |
| 79 | `src/app/components/ContactForm.tsx:310-311` | `({messageLength}/{MIN_MESSAGE})` | Compteur de caractères affiché sous le textarea | A | `contact.form.message.counter` | [interp] [format] | oui |
| 80 | `src/app/components/SiteFooter.tsx:21` | `Contact` | Texte du lien Contact dans le footer — objet `copy` | A | `footer.contact` | — | oui |
| 81 | `src/app/components/SiteFooter.tsx:22` | `Tous droits réservés.` | Mention de droits dans le footer — objet `copy` | A | `footer.rights` | — | oui |
| 82 | `src/app/components/SiteFooter.tsx:30` | `© {year} Qiwi Chee. Tous droits réservés.` | Ligne de copyright complète (interpolée avec l'année) | A | `footer.copyright` | [interp] [format] | oui |
| 83 | `src/app/components/SiteFooter.tsx:32` | `Pied de page` | `aria-label` du `<nav>` du footer | A | `footer.nav.aria_label` | [a11y] | oui |
| 84 | `src/app/components/BioSwitcher.tsx:56` | `Bio — parcourir les blocs` | `aria-label` de la `<section>` carrousel bio | A | `bio.carousel.section_label` | [a11y] | non |
| 85 | `src/app/components/BioSwitcher.tsx:61-62` | `carrousel` | `aria-roledescription` du groupe scrollable bio | A | `carousel.role` | [a11y] | non |
| 86 | `src/app/components/BioSwitcher.tsx:63` | `Biographie` | `aria-label` du div scrollable bio | A | `bio.carousel.label` | [a11y] | non |
| 87 | `src/app/components/BioSwitcher.tsx:71` | `{block.title}, {idx+1} sur {blocks.length}` | `aria-label` de chaque slide de bio | A | `bio.carousel.slide.label` | [a11y] [interp] | non |
| 88 | `src/app/components/BioSwitcher.tsx:103-107` | `Bloc précédent` | `aria-label` du bouton flèche gauche bio | A | `bio.carousel.prev` | [a11y] | non |
| 89 | `src/app/components/BioSwitcher.tsx:113-117` | `Bloc suivant` | `aria-label` du bouton flèche droite bio | A | `bio.carousel.next` | [a11y] | non |
| 90 | `src/app/components/BioSwitcher.tsx:128-130` | `Navigation par bloc` | `aria-label` du groupe de points de navigation bio | A | `bio.carousel.nav.label` | [a11y] | non |
| 91 | `src/app/components/BioSwitcher.tsx:137` | `Aller à {block.title}` | `aria-label` de chaque point de navigation bio | A | `bio.carousel.nav.goto` | [a11y] [interp] | non |
| 92 | `src/app/components/BioSwitcher.tsx:74` | `{block.title}` | Titre h3 du bloc bio (valeur DB) | C | `bio.block.title` | — | non |
| 93 | `src/app/components/BioSwitcher.tsx:82` | `{block.image_alt}` | Attribut `alt` de l'image bio (valeur DB) | C | `bio.block.image_alt` | [a11y] | non |
| 94 | `src/app/components/BioSwitcher.tsx:97` | `{block.body}` | Corps du bloc bio (valeur DB) | C | `bio.block.body` | — | non |
| 95 | `src/app/components/BioSwitcher.tsx:91-95` | `{role} : {name} · …` | Ligne de crédits construite par concaténation (valeurs DB) | C | `bio.block.credits` | [interp] | non |
| 96 | `src/app/components/ReleaseSwitcher.tsx:82` | `Musique — parcourir les sorties` | `aria-label` de la section carrousel releases | A | `releases.carousel.section_label` | [a11y] | non |
| 97 | `src/app/components/ReleaseSwitcher.tsx:89-90` | `carrousel` | `aria-roledescription` du groupe scrollable releases | A | → `carousel.role` | [a11y] | non |
| 98 | `src/app/components/ReleaseSwitcher.tsx:91` | `Sorties` | `aria-label` du div scrollable releases | A | `releases.carousel.label` | [a11y] | non |
| 99 | `src/app/components/ReleaseSwitcher.tsx:99` | `{release.title}, {idx+1} sur {releases.length}` | `aria-label` de chaque slide release | A | `releases.carousel.slide.label` | [a11y] [interp] | non |
| 100 | `src/app/components/ReleaseSwitcher.tsx:127` | `Aussi sur →` | Libellé avant les icônes de streaming | A | `releases.streaming.heading` | — | non |
| 101 | `src/app/components/ReleaseSwitcher.tsx:133-134` | `{release.title} sur {platform}, nouvel onglet` | `aria-label` des liens icônes streaming | A | `releases.streaming.link.label` | [a11y] [interp] | non |
| 102 | `src/app/components/ReleaseSwitcher.tsx:152-155` | `Sortie précédente` | `aria-label` du bouton flèche gauche releases | A | `releases.carousel.prev` | [a11y] | non |
| 103 | `src/app/components/ReleaseSwitcher.tsx:160-163` | `Sortie suivante` | `aria-label` du bouton flèche droite releases | A | `releases.carousel.next` | [a11y] | non |
| 104 | `src/app/components/ReleaseSwitcher.tsx:176-178` | `Navigation par sortie` | `aria-label` du groupe de points de navigation releases | A | `releases.carousel.nav.label` | [a11y] | non |
| 105 | `src/app/components/ReleaseSwitcher.tsx:185` | `Aller à {release.title}` | `aria-label` de chaque point de navigation releases | A | `releases.carousel.nav.goto` | [a11y] [interp] | non |
| 106 | `src/app/components/EmbedPlayer.tsx:116` | `Lire : {asset.title}` | `aria-label` du bouton play du lecteur | A | `player.play.label` | [a11y] [interp] | non |
| 107 | `src/app/components/EmbedPlayer.tsx:94` | `{asset.title}` | Attribut `title` de l'iframe (lecture d'écran) | C | `release.{slug}.embed.title` | [a11y] | non |
| 108 | `src/app/components/ExternalLink.tsx:28` | `(opens in a new tab)` | Texte sr-only signalant l'ouverture dans un nouvel onglet | A | `external_link.new_tab` | [a11y] ⚠️ DETTE A11Y — English sur site français | non |
| 109 | `src/components/AtelierGate.tsx:11` | `Ton lien a expiré — redemande-en un ci-dessous.` | Message d'erreur lien expiré (paramètre URL `expired_link`) | A | `atelier.gate.error.expired_link` | — | non |
| 110 | `src/components/AtelierGate.tsx:12` | `Lien invalide — redemande-en un ci-dessous.` | Message d'erreur code manquant (paramètre URL `missing_code`) | A | `atelier.gate.error.missing_code` | — | non |
| 111 | `src/components/AtelierGate.tsx:51-54` | `Atelier` | Titre h2 de la section porte de l'Atelier | A | `atelier.gate.heading` | — | non |
| 112 | `src/components/AtelierGate.tsx:55-59` | `Entre dans l'Atelier — les versions inédites, l'accès en avant-première aux mini-concerts, et ton mot à dire sur la suite. C'est ici, pas sur Spotify.` | Paragraphe d'invitation à rejoindre l'Atelier | B | `atelier.gate.invitation` | — | non |
| 113 | `src/components/AtelierGate.tsx:77-80` | `Ton adresse email` | Label du champ email (gate) | A | → `contact.form.email.label` | — | non |
| 114 | `src/components/AtelierGate.tsx:85-90` | `toi@example.com` | Placeholder du champ email (gate) | A | `atelier.gate.email.placeholder` | — | non |
| 115 | `src/components/AtelierGate.tsx:100` | `Accéder à l'Atelier` | Bouton de soumission gate (idle) — même valeur que welcome submit | A | → `atelier.welcome.submit.idle` | — | non |
| 116 | `src/components/AtelierGate.tsx:100` | `Envoi…` | Bouton de soumission gate (submitting) | A | `atelier.gate.submit.sending` | — | non |
| 117 | `src/components/AtelierGate.tsx:104-107` | `Vérifie ta boîte mail — ton lien vers l'Atelier arrive ✦` | Confirmation après envoi du magic link | A | `atelier.gate.sent.primary` | — | non |
| 118 | `src/components/AtelierGate.tsx:110-113` | `Pas d'e-mail dans ta boîte de réception ? Regarde dans tes spams / indésirables — et marque-le comme « non spam » pour recevoir les prochains directement.` | Indice anti-spam après envoi | A | `atelier.gate.sent.spam_hint` | — | non |
| 119 | `src/components/AtelierGate.tsx:20` | `Une erreur est survenue.` | Erreur par défaut (initialError inconnu) | A | `atelier.gate.error.generic` | — | non |
| 120 | `src/components/AtelierGate.tsx:41` | `Une erreur est survenue. Réessaie dans un instant.` | Erreur catch (appel Supabase OTP échoué) | A | `atelier.gate.error.otp_failed` | — | non |
| 121 | `src/components/AtelierGate.tsx:64` | `Website` | Label honeypot (dans `div.sr-only`) | A | `atelier.gate.honeypot.label` | [a11y] ⚠️ DETTE A11Y — English dans sr-only | non |
| 122 | `src/components/CitiesPicker.tsx:38-40` | `Villes` | Label de la section CitiesPicker | A | `cities.heading` | — | non |
| 123 | `src/components/CitiesPicker.tsx:43` | `Villes sélectionnées` | `aria-label` de la liste des villes sélectionnées | A | `cities.selected.label` | [a11y] | non |
| 124 | `src/components/CitiesPicker.tsx:51` | `Retirer {city}` | `aria-label` du bouton de suppression d'une ville | A | `cities.remove.label` | [a11y] [interp] | non |
| 125 | `src/components/CitiesPicker.tsx:61-63` | `Chercher une ville` | Label sr-only du champ de recherche | A | `cities.search.label` | [a11y] | non |
| 126 | `src/components/CitiesPicker.tsx:75` | `Chercher une ville…` | Placeholder du champ de recherche | A | `cities.search.placeholder` | — | non |
| 127 | `src/components/CitiesPicker.tsx:87-88` | `Suggestions de villes` | `aria-label` du listbox de suggestions | A | `cities.suggestions.label` | [a11y] | non |
| 128 | `src/lib/fanStatus.ts:7` | `Nouveau` | Libellé du palier 1 (≤1 visite) | B | `fan.tier.1` | — | non |
| 129 | `src/lib/fanStatus.ts:6` | `Habitué` | Libellé du palier 2 (≥2 visites) | B | `fan.tier.2` | — | non |
| 130 | `src/lib/fanStatus.ts:5` | `Fidèle` | Libellé du palier 3 (≥5 visites) | B | `fan.tier.3` | — | non |
| 131 | `src/lib/fanStatus.ts:4` | `Pilier` | Libellé du palier 4 (≥10 visites) | B | `fan.tier.4` | — | non |
| 132 | `src/data/releases.ts:19` | `Lullabies` | Titre de la release Single | C | `release.lullabies.title` | — | non |
| 133 | `src/data/releases.ts:20` | `Single — clip officiel` | Descripteur de la release Lullabies (type + libre) | C | `release.lullabies.descriptor` | [interp] | non |
| 134 | `src/data/releases.ts:24` | `Qiwi Chee — Lullabies (clip officiel)` | Titre de l'embed YouTube (iframe title + aria-label du lecteur) | C | `release.lullabies.embed.title` | [a11y] [interp] | non |
| 135 | `src/data/releases.ts:29` | `Qiwi Chee — Lullabies, visuel provisoire` | Attribut `alt` de la pochette Lullabies | C | `release.lullabies.artwork_alt` | [a11y] | non |
| 136 | `src/data/releases.ts:35` | `Hybrid Fruit` | Titre de la release EP/Album | C | `release.hybrid-fruit.title` | — | non |
| 137 | `src/data/releases.ts:36` | `Album · 6 titres` | Descripteur Hybrid Fruit (type + nombre de titres) | C | `release.hybrid-fruit.descriptor` | [interp] [plural] | non |
| 138 | `src/data/releases.ts:41` | `Hybrid Fruit — Qiwi Chee (album complet)` | Titre de l'embed Bandcamp | C | `release.hybrid-fruit.embed.title` | [a11y] [interp] | non |
| 139 | `src/data/releases.ts:48` | `Hybrid Fruit — pochette de l'album (visuel provisoire)` | Alt de la pochette Hybrid Fruit | C | `release.hybrid-fruit.artwork_alt` | [a11y] | non |
| 140 | `src/data/releases.ts:37` | `27 oct 2024` | Date de sortie Hybrid Fruit affichée telle quelle | C | `release.hybrid-fruit.date` | [format] | non |
| 141 | `src/data/releases.ts:53` | `Une dernière chose` | Titre de la release Single | C | `release.une-derniere-chose.title` | — | non |
| 142 | `src/data/releases.ts:54` | `Single` | Descripteur Une dernière chose (type pur, candidate A) | C | `release.une-derniere-chose.descriptor` | — | non |
| 143 | `src/data/releases.ts:58` | `Une dernière chose — Qiwi Chee` | Titre de l'embed Bandcamp | C | `release.une-derniere-chose.embed.title` | [a11y] [interp] | non |
| 144 | `src/data/releases.ts:63` | `Une dernière chose — photo artistique de Qiwi Chee` | Alt de la pochette | C | `release.une-derniere-chose.artwork_alt` | [a11y] | non |
| 145 | `src/data/releases.ts:55` | `31 mars 2023` | Date de sortie affichée telle quelle | C | `release.une-derniere-chose.date` | [format] | non |
| 146 | `src/data/releases.ts:67` | `Dilemma` | Titre de la release Album (ère LEILANI) | C | `release.dilemma.title` | — | non |
| 147 | `src/data/releases.ts:75` | `Album — sorti sous le nom LEILANI` | Descripteur Dilemma — ⚠️ libellé en attente de confirmation artiste | C | `release.dilemma.descriptor` | [interp] | non |
| 148 | `src/data/releases.ts:78` | `Dilemma — LEILANI` | Titre de l'embed Bandcamp | C | `release.dilemma.embed.title` | [a11y] [interp] | non |
| 149 | `src/data/releases.ts:85` | `Dilemma — pochette de l'album, sorti sous le nom LEILANI` | Alt de la pochette Dilemma | C | `release.dilemma.artwork_alt` | [a11y] | non |
| 150 | `src/app/api/contact/route.ts:175-179` | `Concert / booking`, `Presse`, `Collaboration`, `Autre` | Labels des sujets dans le corps du mail de notification — mêmes valeurs que ContactForm | A | → `contact.form.subject.*` | [mail] | non |
| 151 | `src/app/api/contact/route.ts:189` | `Objet   : {subject}` | Ligne objet dans le corps du mail de notification | A | `mail.contact.line.subject` | [interp] [mail] | non |
| 152 | `src/app/api/contact/route.ts:190` | `Nom     : {name}` | Ligne nom dans le corps du mail | A | `mail.contact.line.name` | [interp] [mail] | non |
| 153 | `src/app/api/contact/route.ts:191` | `Email   : {email}` | Ligne email dans le corps du mail | A | `mail.contact.line.email` | [interp] [mail] | non |
| 154 | `src/app/api/contact/route.ts:192` | `Tél.    : {phone\|—}` | Ligne téléphone dans le corps du mail | A | `mail.contact.line.phone` | [interp] [mail] | non |
| 155 | `src/app/api/contact/route.ts:193` | `Langue  : {locale}` | Ligne langue dans le corps du mail | A | `mail.contact.line.locale` | [interp] [mail] | non |
| 156 | `src/app/api/contact/route.ts:184` | `[qiwichee.com] {subject} — {name}` | Objet du mail de notification | A | `mail.contact.subject` | [interp] [mail] | non |
| 157 | `src/app/api/contact/route.ts:199` | `Envoyé depuis le formulaire de qiwichee.com` | Pied de mail de notification | A | `mail.contact.footer` | [mail] | non |
| 158 | `src/app/api/contact/route.ts:198` | `Référence : {id}` | Ligne de référence en bas du mail | A | `mail.contact.ref` | [interp] [mail] | non |
| 159 | `src/lib/mailService.ts:155` | `Contact qiwichee.com` | Nom d'affichage dans le champ From du mail de notification | A | `mail.from.display_name` | [mail] | non |

---

## 1. Comptes

| Couche | Nb de chaînes uniques | Décision produit |
|---|---|---|
| **A** | 108 | Ira dans `fr.json` / `en.json` — non éditable par l'artiste |
| **B** | 22 | Ira dans `site_copy` — **éditable par l'artiste**. C'est la taille de l'éditeur. |
| **C** | 29 | Tables dédiées + traductions — éditable via écran artiste |
| **Total** | **159** | |

**Fichiers touchés** (contenant au moins une chaîne affichée) : **16**

```
src/app/layout.tsx
src/app/page.tsx
src/app/contact/page.tsx
src/app/atelier/page.tsx
src/app/atelier/welcome/page.tsx
src/app/atelier/AtelierContent.tsx
src/app/atelier/welcome/WelcomeForm.tsx
src/app/components/ContactForm.tsx      ← déjà extrait
src/app/components/SiteFooter.tsx       ← déjà extrait
src/app/components/BioSwitcher.tsx
src/app/components/ReleaseSwitcher.tsx
src/app/components/EmbedPlayer.tsx
src/app/components/ExternalLink.tsx
src/components/AtelierGate.tsx
src/components/CitiesPicker.tsx
src/lib/fanStatus.ts
src/data/releases.ts
src/app/api/contact/route.ts
src/lib/mailService.ts
```

(19 fichiers au total, dont 3 sans chaînes affichées : `src/lib/cities.ts`, `src/lib/media/types.ts`, `src/lib/media/mediaService.ts`, routes d'auth, middleware.)

**Chaînes de couche B (liste pour calibrer l'éditeur) :**

```
meta.title.template          → "%s | Qiwi Chee"
meta.title.default           → "Qiwi Chee — Pop alternative"
meta.description             → longue bio (partagée layout + contact)
contact.meta.description     → bio courte pour /contact
contact.meta.og_title        → "Contact — Qiwi Chee"
contact.back                 → "← Qiwi Chee"
hero.tagline                 → accroche principale
atelier.gate.invitation      → paragraphe d'invitation Atelier
atelier.welcome.heading      → "Bienvenue dans l'Atelier ✦"
atelier.content.placeholder  → "L'Atelier arrive — contenu en route ✦"
atelier.insider.clip.title   → "Concert privé — clip Atelier"
atelier.insider.heading      → "Exclusivité Atelier"
atelier.insider.locked_label → "Bientôt — réservé à l'Atelier"
atelier.insider.caption      → "Un extrait qui n'existe nulle part ailleurs."
atelier.profile.cities.hint  → texte avec nom d'artiste (x2 emplacements)
fan.tier.1                   → "Nouveau"
fan.tier.2                   → "Habitué"
fan.tier.3                   → "Fidèle"
fan.tier.4                   → "Pilier"
artist.name                  → "Qiwi Chee"
```

(20 clés B distinctes — certaines partagées entre plusieurs composants.)

---

## 2. Vues et écartées

Chaînes examinées et **non classées** car ce ne sont pas de la copie humaine.

| Chaîne / Pattern | Raison d'exclusion |
|---|---|
| `'concert'`, `'presse'`, `'collaboration'`, `'autre'` (valeurs `<option>`) | Énumérations DB — traducire casserait la comparaison en base |
| `'idle'`, `'sending'`, `'sent'`, `'error'`, `'saved'`, `'required'`, `'submitting'` | États machine internes, jamais rendus |
| `'visiteur'`, `'membre'`, `'abonne'` | Valeurs RLS (enum DB) |
| `'new'`, `'read'`, `'replied'`, `'archived'` | Statuts de message (enum DB) |
| `'web'`, `'presskit'`, `'both'` | Enum DB (usage image) |
| Slugs : `'lullabies'`, `'hybrid-fruit'`, `'une-derniere-chose'`, `'dilemma'` | Slugs URL — traduits = 404 |
| Slugs bio : `'qui-je-suis'`, etc. (valeurs DB) | Slugs URL |
| `ARTIST_SLUG = 'qiwichee'` | Identifiant DB, pas du texte |
| `CONTACT_EMAIL = 'hello@qiwichee.com'` | Adresse email — identifiant, pas copie |
| `AUDIENCE_ID = 'c5532d5f66'` | ID Mailchimp, technique |
| Noms de classes CSS : `'carousel-arrow'`, `'bio-slide'`, `'btn-primary'`, etc. | Classes CSS/tokens |
| `autoComplete` values : `'email'`, `'name'`, `'tel'`, `'nickname'` | Attributs HTML standards |
| `aria-roledescription="carrousel"` (valeur) | Valeur d'attribut ARIA technique (pas une chaîne visible) — **EXCEPTION** : si inclus dans l'audit car lu par les lecteurs d'écran, classé A (#85, #97) |
| Noms de providers : `'youtube'`, `'bandcamp'`, `'spotify'`, `'applemusic'`, etc. | Identifiants de fournisseurs, pas du texte |
| Hex Bandcamp : `'E8EBF5'`, `'C2185B'`, etc. | Paramètres d'URL d'iframe tiers, exception documentée |
| URLs et `href` : toutes les URLs (Spotify, Bandcamp, YouTube…) | URLs — traducire = liens cassés |
| Paramètres RPC : `'p_email'`, `'p_artist_slug'`, `'p_usage'`, etc. | Noms de colonnes/paramètres DB |
| Codes d'erreur API : `'invalid_json'`, `'server_error'`, `'rate_limited'`, etc. | Codes machine retournés en JSON, jamais rendus tels quels dans l'UI (l'UI affiche une traduction) |
| Codes d'erreur URL : `'missing_code'`, `'expired_link'`, `'missing_token'` | Paramètres URL — les messages d'erreur correspondants sont en #109/#110 |
| `'Unauthorized'` (keepalive route) | Texte de réponse HTTP, pas une page utilisateur |
| `'fr'`, `'fr_FR'`, `'en'` | Codes de locale, techniques |
| `'application/ld+json'` | Type MIME |
| City names (`FR_CITIES`) | Noms propres géographiques — ne se traduisent pas |
| `'email'`, `'magiclink'` (OTP types) | Valeurs enum Supabase |
| Noms de colonnes Supabase : `'fans'`, `'nickname'`, `'cities'`, `'visit_count'` | Identifiants schema DB |
| `from: "Contact qiwichee.com" <...>` (mailService.ts) | Affiché dans la boîte mail de l'artiste, pas des visiteurs — **classé A #159 par précaution** |

---

## 3. Frontière incertaine (A/B)

Ces chaînes méritent une **décision produit** avant extraction. Ne pas trancher seul.

### 3.1 — `contact.intro` (ligne #19)
**Chaîne :** `Pour un concert, une demande presse ou une collaboration — écris ici, ou directement à`

- **Argument A :** C'est une instruction générique de formulaire de contact, identique pour n'importe quel artiste de la plateforme. Le contenu ne varie pas.
- **Argument B :** Le type de contacts listés (concert, presse, collaboration) reflète l'activité spécifique de l'artiste. Un artiste plasticien écrirait différemment. La voix informelle (« écris ici ») est choisie par l'artiste.
- **Recommandation :** Commencer en A pour simplifier. Si une artiste veut reformuler, libérer en B à ce moment-là.

### 3.2 — `atelier.welcome.intro` (ligne #24)
**Chaîne :** `Dis-nous comment t'appeler. Tu pourras tout changer plus tard.`

- **Argument A :** Instruction d'onboarding plateforme pure. Même phrasé pour tout artiste.
- **Argument B :** Le « nous » implique l'artiste. Elle pourrait vouloir une formule plus personnelle.
- **Recommandation :** A — c'est de la mécanique d'onboarding, pas une invitation éditoriale.

### 3.3 — `atelier.profile.cities.question` / `atelier.welcome.cities.question` (lignes #34, #45)
**Chaîne :** `Où viendrais-tu la voir en concert ?`

- **Argument A :** Question générique du sélecteur de villes, même structure pour tout artiste.
- **Argument B :** « la voir » cible l'artiste en 3e personne féminine. La grammaire française impose le genre. Une artiste masculin écrirait « le voir ». C'est donc potentiellement B (ou A avec variable de genre).
- **Recommandation :** B (ou A avec token `{pronoun.accusative}` = « la » / « le »). **Point d'attention pour la règle épicène.**

### 3.4 — `atelier.welcome.heading` (ligne #23)
**Chaîne :** `Bienvenue dans l'Atelier ✦`

- **Argument A :** Titre d'onboarding fixe, identique pour tout artiste.
- **Argument B :** L'emoji ✦ et le ton relèvent de l'identité visuelle de l'artiste. Une autre artiste pourrait préférer une formule différente.
- **Recommandation :** B — le ton d'accueil est éditorial.

### 3.5 — `contact.back` (ligne #17)
**Chaîne :** `← Qiwi Chee`

- **Argument A :** C'est un lien de navigation (retour accueil). La flèche est chrome plateforme ; le nom d'artiste est une variable.
- **Argument B :** La forme complète « ← {artist.name} » est éditoriale.
- **Recommandation :** Traiter comme A avec interpolation : `← {artist.name}`. La clé serait `contact.back` avec la valeur `← {artist.name}` — `artist.name` étant déjà une clé B.

---

## 4. Composées / Interpolées

Chaînes construites par concaténation ou template literal. **Ne se traduisent pas telles quelles** — l'ordre des mots change selon la langue.

| # | fichier:ligne | forme actuelle | problème de traduction |
|---|---|---|---|
| i1 | `src/app/layout.tsx:21` | `"%s \| Qiwi Chee"` | Next.js template — « %s » sera remplacé par le titre de la page. En anglais l'ordre est identique, mais d'autres langues peuvent inverser. |
| i2 | `src/app/components/BioSwitcher.tsx:71` | `` `${block.title}, ${idx + 1} sur ${blocks.length}` `` | « 1 sur 3 » → EN « 1 of 3 ». Structure différente. |
| i3 | `src/app/components/BioSwitcher.tsx:137` | `` `Aller à ${block.title}` `` | EN « Go to {title} » — ordre identique mais verbe change. |
| i4 | `src/app/components/ReleaseSwitcher.tsx:99` | `` `${release.title}, ${idx + 1} sur ${releases.length}` `` | Même structure que i2. |
| i5 | `src/app/components/ReleaseSwitcher.tsx:133-134` | `` `${release.title} sur ${name}, nouvel onglet` `` | EN « {title} on {platform}, new tab » — « sur » ≠ « on », ordre peut changer. |
| i6 | `src/app/components/ReleaseSwitcher.tsx:185` | `` `Aller à ${release.title}` `` | Même structure que i3. |
| i7 | `src/app/components/EmbedPlayer.tsx:116` | `` `Lire : ${asset.title}` `` | EN « Play: {title} » — ponctuation et ordre identiques en l'espèce, mais à vérifier. |
| i8 | `src/components/CitiesPicker.tsx:51` | `` `Retirer ${city}` `` | EN « Remove {city} » — ordre identique. |
| i9 | `src/app/atelier/AtelierContent.tsx:69-71` | `Bienvenue, {nickname}` | EN « Welcome, {nickname} » — virgule + ordre identiques. |
| i10 | `src/app/components/ContactForm.tsx:44` | `` `Au moins ${MIN_MESSAGE} caractères.` `` | EN « At least {n} characters. » — structure différente. |
| i11 | `src/app/components/ContactForm.tsx:56` | `` `Ton message est trop court — ${MIN_MESSAGE} caractères minimum.` `` | EN structure très différente. |
| i12 | `src/app/components/ContactForm.tsx:57` | `` `Ton message dépasse ${MAX_MESSAGE} caractères.` `` | EN « Your message exceeds {n} characters. » |
| i13 | `src/app/components/SiteFooter.tsx:30` | `© {year} Qiwi Chee. Tous droits réservés.` | `year` est une valeur numérique → locale à passer, pas une chaîne. |
| i14 | `src/app/components/BioSwitcher.tsx:91-95` | `` `${role.charAt(0).toUpperCase() + role.slice(1)} : ${name}` `` | Capitalisation automatique du rôle — en FR convention « Photo : Nom », en EN « Photo: Name ». Le séparateur ` : ` (espace + deux-points + espace) est une convention typographique française à adapter. |
| i15 | `src/app/api/contact/route.ts:184` | `` `[qiwichee.com] ${labels[subject] ?? subject} — ${name}` `` | Objet de mail — l'artiste peut vouloir le localiser. |
| i16 | `src/data/releases.ts:24` | `Qiwi Chee — Lullabies (clip officiel)` | Assemblé manuellement (pas un template) — à éclater en `{artist} — {title} ({descriptor})` pour la traduction. |
| i17 | `src/data/releases.ts:20` | `Single — clip officiel` | Type énuméré + descripteur libre concaténés par ` — `. Voir §5 releases. |
| i18 | `src/data/releases.ts:36` | `Album · 6 titres` | Type + compte : `· 6 titres` est [plural]. |
| i19 | `src/data/releases.ts:75` | `Album — sorti sous le nom LEILANI` | Type + explication libre. |
| i20 | `src/app/page.tsx:52` | `Le clip officiel de Lullabies par Qiwi Chee.` | Assemblé manuellement — EN « The official video for Lullabies by Qiwi Chee. » Structure différente. |

**Analyse des descripteurs releases (§5 brief) :**

| Release | Partie type (candidate A) | Partie libre (C, par release et par langue) |
|---|---|---|
| Lullabies | `Single` | `clip officiel` |
| Hybrid Fruit | `Album` | `6 titres` [plural] |
| Une dernière chose | `Single` | *(aucune)* |
| Dilemma | `Album` | `sorti sous le nom LEILANI` ⚠️ confirmation artiste attendue |

Assemblage actuel : `{type} — {libre}` ou `{type} · {libre}` — le séparateur et l'ordre ne survivent pas au changement de langue.

**Dates releases :**
- `'27 oct 2024'` et `'31 mars 2023'` sont des chaînes de date littérales (pas `Date` objects, pas `toLocaleDateString`). À remplacer par un timestamp et `Intl.DateTimeFormat` avec la locale cible — ce sont des **locales à passer**, pas des chaînes à traduire.

---

## 5. Hors périmètre rencontré

Ces éléments sont du texte affiché mais **ne vivent pas dans le filesystem** du repo.
Nommés sans tentative de lecture (Claude Code ne voit que le filesystem).

| Élément | Emplacement | Nature |
|---|---|---|
| Email de magic link (sujet + corps) | Dashboard Supabase → Auth → Email Templates | Texte envoyé par Supabase à chaque demande de lien magique. Contient probablement « Confirm your email » en anglais — DETTE A11Y potentielle. |
| Email de confirmation OTP | Dashboard Supabase → Auth → Email Templates | Idem. |
| Copie du dashboard artiste / admin | Supabase Studio ou future interface admin | Si une interface d'admin est construite, sa copie n'est pas encore dans le repo. |
| Contenu bio actuel en base | Table `bio_blocks` Supabase | Les `title`, `body`, `image_alt` et `credits` sont en couche C — leur contenu actuel n'est pas lisible depuis le filesystem. |

---

## Points à vérifier manuellement (§8 du brief)

```
1. Vérifier que les chaînes B classées comme "voix de l'artiste" (fan.tier.*, atelier.gate.invitation,
   hero.tagline…) n'ont pas glissé en A. Erreur coûteuse : elles deviendraient non éditables
   et demanderaient une migration pour être libérées.

2. Vérifier que les valeurs DB (slugs, enums) dans la section "Vues et écartées" n'ont pas
   été classées par erreur en A ou B — notamment 'concert'/'presse' qui ressemblent aux
   labels des options du formulaire.

3. Vérifier les chaînes aria-label interpolées (#87, #91, #99, #101, #105) — invisibles
   à l'écran, donc jamais repérées en relecture visuelle. La structure "X sur Y" devra
   être adaptée ("X of Y" en anglais).

4. Vérifier la chaîne i14 (crédits bio) : le séparateur " : " est une convention typo
   française (espace insécable + deux-points + espace). En anglais, c'est ": " sans espace
   avant. Ce n'est pas une chaîne à traduire, c'est un token de formatage à externaliser.
```
