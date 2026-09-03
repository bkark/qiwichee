# BRIEF — INVENTAIRE DE LA COPIE (AUDIT EN LECTURE SEULE)

> Destination repo : `docs/briefs/BRIEF_copy_inventory.md`
> Préalable au chantier bilingue. **Aucune modification de code.**

---

## 0. RÈGLES ABSOLUES

```
⛔ NE MODIFIER AUCUN FICHIER EXISTANT. Zéro edit, zéro refactor, zéro « pendant que j'y suis ».
⛔ NE JAMAIS COMMIT NI PUSH.
✅ CRÉER EXACTEMENT UN FICHIER NOUVEAU : docs/audits/copy_inventory.md
   (créer le dossier docs/audits/ s'il n'existe pas)
✅ À la fin : afficher `git status --short` pour prouver qu'un seul fichier est apparu
   et qu'aucun fichier suivi n'est modifié.
```

Cet audit décide les clés de traduction. Les clés décident l'éditeur.
Une chaîne oubliée ici devient une chaîne française codée en dur dans la version anglaise.

---

## 1. OBJECTIF

Recenser **toute chaîne affichée à un être humain** dans `src/`, et classer chacune en
trois couches :

| Couche | Quoi | Où elle vivra | Éditable par l'artiste |
|---|---|---|---|
| **A** | Chrome plateforme — identique pour tout artiste | `fr.json` / `en.json` (repo) | ❌ jamais |
| **B** | Copie d'artiste — sa voix, son image | table `site_copy` | ✅ oui |
| **C** | Contenu structuré — déjà (ou bientôt) des lignes | tables dédiées + traductions | ✅ via son écran |

Exemples pour caler le jugement :

- « Envoyer », « Champ obligatoire », « Accéder à l'Atelier » → **A**
- « Autrice-compositrice-interprète indépendante. » → **B**
- Le libellé du palier 3, le texte d'invitation de la porte de l'Atelier → **B**
- Un titre de release, « clip officiel », un bloc de bio → **C**

⚠️ **La frontière n'est PAS par page.** L'Atelier contient de l'A (erreurs d'auth,
« (facultatif) », validation de formulaire) ET du B (invitation, libellé de palier)
sur le même écran. Classer **chaîne par chaîne**, jamais par fichier.

---

## 2. CE QUI N'EST PAS DE LA COPIE — NE PAS CLASSER

★ **PIÈGE PRINCIPAL DE CET AUDIT.** Ces chaînes ressemblent à du texte et n'en sont pas.
Les traduire casse la base ou les URLs.

```
⛔ VALEURS DB / ENUMS         'visiteur' | 'membre' | 'abonne'
                              'concert' | 'presse' | 'collaboration' | 'autre'
                              'new' | 'read' | 'replied' | 'archived'
                              'web' | 'presskit' | 'both'
⛔ SLUGS                       'qui-je-suis', 'une-derniere-chose', slugs de release
⛔ NOMS DE COLONNES / CLÉS RPC 'p_email', 'artist_id', 'sort_order'
⛔ CLASSES CSS / TOKENS        'bg-bg', 'accent-bright', 'carousel-arrow'
⛔ NOMS DE PROVIDER / ASSET    'youtube', chemins de fichiers, IDs
⛔ URLS ET PARAMÈTRES          y compris les params Bandcamp (seule exception hex)
```

Les recenser dans une section séparée **« vues et écartées »** avec la raison, pour
prouver qu'elles ont été regardées et non manquées.

---

## 3. OÙ CHERCHER — CHERCHER LE TEXTE, PAS LE NOM DE FICHIER

★ Précédent maison : `ls src/components/` ne montrait aucun footer ; il y en avait un,
**en dur dans `page.tsx`**. Ne jamais déduire d'un nom de fichier qu'une chaîne n'y est pas.

**Deux dossiers de composants coexistent** — parcourir les DEUX :
- `src/components/` (AtelierGate, CitiesPicker)
- `src/app/components/` (le reste)

Parcourir `src/` **en entier**, y compris :

```
src/app/**/page.tsx · layout.tsx · les routes /api/**
src/lib/**            (mailService : le CORPS DES MAILS est de la copie)
src/data/releases.ts  (→ couche C, voir §5)
```

**Endroits où les chaînes se cachent** — ne pas se limiter au JSX visible :

```
· aria-label, aria-describedby (texte), alt=, title=, placeholder=
· les objets `metadata` (title, description, openGraph) → SEO, donc traduisible
· JSON-LD (ContactPoint, etc.)
· messages d'erreur dans les routes API et dans validate()
· corps et objet des mails sortants (mailService.ts)
· libellés de honeypot (<label>Website</label>) et aria-label="Primary"
  ⇒ ces deux-là sont de la DETTE A11Y CONNUE : chaînes anglaises lues par les
    lecteurs d'écran sur un site fr. Les recenser et les MARQUER, pas les corriger.
```

⚠️ `grep` est **case-sensitive** : chercher `phone` ne trouve pas `errPhone`.
Compter les **zones touchées**, pas les résultats.

---

## 4. CHAÎNES DÉJÀ EXTRAITES — À MARQUER, PAS À RE-CLASSER

`ContactForm.tsx` et `SiteFooter.tsx` suivent déjà le motif cible : **un seul objet plat
en haut du composant, clés anglaises, valeurs françaises**. Les recenser normalement, mais
ajouter `déjà extrait: oui` — ce sont les seules qui se déplacent par copier-coller.

Signaler tout autre fichier qui suit déjà ce motif.

---

## 5. `releases.ts` — TRAITEMENT PARTICULIER

Les chaînes de `src/data/releases.ts` sont de la **couche C**, pas B.

Pour CHAQUE release, décomposer les descripteurs affichés (ex. « Single — clip officiel »)
en deux colonnes distinctes du rapport :

- la partie qui est un **type énuméré** (Single / EP / Album) → candidate **A** (traduite
  une fois pour toute la plateforme)
- la partie qui est un **descripteur libre** (« clip officiel ») → **C**, par release et
  par langue, éditable

★ Si la chaîne est composée par concaténation ou template literal, le signaler
explicitement : l'ordre des mots ne survit pas au changement de langue.

---

## 6. DRAPEAUX À POSER PAR CHAÎNE

En plus de la couche, marquer (colonne `drapeaux`) :

```
[interp]    chaîne construite par concaténation / template literal / interpolation
            ⇒ ne se traduit pas telle quelle, l'ordre des mots change
[plural]    dépend d'un nombre (1 visite / 3 visites)
[épicène]   désigne une PERSONNE ⇒ soumise à la règle épicène côté traduction
[a11y]      lue uniquement par un lecteur d'écran (aria-label, alt) — invisible à l'œil,
            donc invisible en relecture visuelle de la traduction
[seo]       metadata / JSON-LD ⇒ impacte le référencement, doit exister par langue
[mail]      part dans un mail sortant, pas dans une page
[format]    date/nombre formaté (toLocaleDateString, Intl.*) — PAS une chaîne à traduire,
            mais une locale à passer. Recenser à part.
```

---

## 7. FORMAT DE SORTIE — `docs/audits/copy_inventory.md`

### 7.1 Tableau principal, une ligne par chaîne

| # | fichier:ligne | chaîne (fr) | contexte | couche | clé proposée | drapeaux | déjà extrait |
|---|---|---|---|---|---|---|---|

- `contexte` : où le visiteur la voit (« bouton d'envoi du formulaire de contact »).
- `clé proposée` : convention `section.element` en minuscules, points comme séparateurs.
  Exemples : `hero.tagline` · `atelier.gate.invitation` · `contact.form.submit` · `tier.3.label`
  **Dériver la convention des chaînes réelles.** Si un motif meilleur émerge, l'adopter et
  le justifier en tête de fichier.

### 7.2 Sections obligatoires en fin de rapport

```
1. COMPTES : nombre de chaînes par couche (A / B / C), et nombre de fichiers touchés.
   ⇒ Le compte de la couche B décide de la taille de l'éditeur. C'est le chiffre attendu.
2. VUES ET ÉCARTÉES : les chaînes du §2, avec la raison.
3. FRONTIÈRE INCERTAINE : chaînes où le choix A/B est discutable, avec l'argument des
   deux côtés. NE PAS TRANCHER SEUL — les remonter. La frontière A/B est une décision
   produit, pas technique.
4. COMPOSÉES / INTERPOLÉES : liste séparée, avec la forme actuelle du template.
5. HORS PÉRIMÈTRE RENCONTRÉ : tout ce qui est du texte affiché mais ne vit pas dans
   le filesystem (templates d'e-mail Supabase, copie du dashboard). Les NOMMER sans
   chercher à les lire — Claude Code ne voit que le filesystem.
```

---

## 8. CE QUE `tsc` NE PEUT PAS VOIR — À RELIRE À L'ŒIL

Aucune vérification automatique ne prouve ce rapport. Points à confirmer manuellement :

```
1. Une chaîne classée A qui est en réalité la VOIX de l'artiste (erreur coûteuse :
   elle devient non éditable et il faut une migration pour la libérer).
2. Une valeur DB classée par erreur en A ou B (erreur coûteuse : la traduction casse
   une comparaison en base).
3. Une chaîne manquée dans un aria-label ou un objet metadata — invisible à l'écran,
   donc jamais repérée en relecture visuelle.
4. Une chaîne composée non signalée : elle se traduit « proprement » et rend une
   phrase fausse dans l'autre langue.
```

---

## 9. VÉRIFICATION PAR BASSIM APRÈS EXÉCUTION

Le rapport de Claude Code est une **affirmation**, pas une preuve.

```bash
git status --short          # doit montrer UN seul fichier nouveau, aucun modifié
wc -l docs/audits/copy_inventory.md

# contre-grep indépendant : le rapport doit contenir au moins autant de zones
grep -rn "aria-label" src/ | wc -l
grep -rn "placeholder=" src/ | wc -l
grep -rn "alt=" src/ | wc -l
```

Puis **relire 5 lignes au hasard** en ouvrant le fichier cité à la ligne citée.
Si les 5 sont exactes, le reste l'est probablement. Si une seule est fausse, tout le
tableau est suspect.
