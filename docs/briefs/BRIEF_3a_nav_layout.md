# BRIEF — 3a · LA NAV DANS LE LAYOUT

> Destination repo : `docs/briefs/BRIEF_3a_nav_layout.md`
> Préalable au bilingue (le sélecteur de langue vivra dans cette nav).
> **Aucune extraction de chaînes dans ce brief.** C'est l'étape 3b.

---

## 0. RÈGLES ABSOLUES

```
⛔ NE JAMAIS COMMIT NI PUSH. Terminer par `git --no-pager diff HEAD` et s'arrêter.
⛔ NE PAS extraire les chaînes vers un objet plat — c'est 3b, et le faire ici
   ferait bouger deux fois les mêmes lignes.
⛔ NE PAS toucher à la dette a11y connue (`aria-label="Primary"`, honeypot
   `<label>Website</label>`). Recensée, traitée en 3b avec le reste.
⛔ NE PAS corriger l'indentation de `<main>` dans page.tsx (18 espaces).
   Cosmétique, suivi séparément, et ça polluerait ce diff.
✅ Un seul objectif : la nav quitte page.tsx et vit dans le layout.
```

---

## 1. LIRE AVANT D'ÉCRIRE

★ La nav est **EN DUR dans `page.tsx`**, pas dans un composant. Précédent maison :
le footer était au même endroit et `ls src/components/` ne le montrait pas.

```bash
grep -rn "Musique" src/
grep -rn "aria-label=\"Primary\"" src/
grep -rn "#music\|#about\|#bio" src/
cat src/app/layout.tsx
cat src/app/components/SiteFooter.tsx
```

`SiteFooter` est **DÉJÀ monté dans le layout** : c'est le motif à suivre —
même dossier (`src/app/components/`), même façon d'être appelé.

⚠️ **DEUX DOSSIERS DE COMPOSANTS COEXISTENT** (`src/components/` et
`src/app/components/`). Suivre la MAJORITÉ et le voisin direct : `SiteNav.tsx`
va dans `src/app/components/`, à côté de `SiteFooter.tsx`.

---

## 2. CE QU'IL FAUT FAIRE

### 2.1 Créer `src/app/components/SiteNav.tsx`

Reprendre le balisage **exact** de la nav actuelle de `page.tsx` — mêmes classes
Tailwind, même structure, mêmes libellés français. C'est un DÉPLACEMENT, pas une
réécriture. Le rendu visuel doit être identique à l'octet près sur la page
d'accueil.

Composant serveur si possible (pas de `'use client'`) — il n'a pas d'état.
S'il en faut un pour un comportement existant, le signaler dans le rapport.

### 2.2 Les liens deviennent absolus

```
#music     →  /#music
#about     →  /#about        (vérifier le vrai nom de l'ancre avec le grep)
Qiwi Chee  →  /              (la marque renvoie à l'accueil)
```

★ **POURQUOI** : `#music` depuis `/contact` cherche une ancre DANS `/contact`,
qui n'existe pas. Le lien ne plante pas — IL NE FAIT RIEN. Mode de panne
silencieux, exactement la famille du conteneur opaque qui enterrait le motif.

### 2.3 Ajouter un lien « Contact » vers `/contact`

La page existe et n'est atteignable depuis nulle part aujourd'hui.

### 2.4 Monter dans `src/app/layout.tsx`

Au-dessus de `{children}`, sur le modèle de `SiteFooter`.

### 2.5 Retirer la nav de `page.tsx`

Sinon elle s'affiche deux fois. Retirer UNIQUEMENT le bloc `<nav>` déplacé.

### 2.6 Retirer le palliatif de `/contact`

Le lien « ← Qiwi Chee » n'existait que parce qu'il n'y avait pas de nav.
Le retirer **seulement après** avoir vérifié que la nav s'affiche bien sur
`/contact`.

---

## 3. ★★ LE PIÈGE PRINCIPAL — L'ATELIER

**Le layout racine s'applique à TOUTES les routes**, y compris :

```
/atelier            zone connectée
/atelier/welcome    onboarding première connexion
```

Monter la nav publique dans le layout racine la fait apparaître **sur l'Atelier**.
Ce n'est pas un bug de rendu, c'est une **décision produit** : l'Atelier est un
espace connecté avec sa propre logique, et la nav marketing y est probablement
indésirable — surtout `/atelier/welcome`, dont tout l'objet est de garder la
personne dans un parcours.

**NE PAS TRANCHER SEUL.** Faire les deux choses suivantes :

1. Vérifier ce que ces pages affichent AUJOURD'HUI (ont-elles déjà une nav ?
   un en-tête ? rien ?) et le RAPPORTER.
2. Implémenter la version qui **ne change rien pour l'Atelier** : si ces pages
   n'ont pas de nav aujourd'hui, elles ne doivent pas en avoir après.

Deux façons d'y arriver — choisir la plus simple compte tenu du code réel, et
**expliquer le choix** :
- un `layout.tsx` propre au segment `/atelier` qui n'inclut pas `SiteNav` ;
- ou un rendu conditionnel dans `SiteNav` (`usePathname()`), ce qui impose
  `'use client'` — **moins bon**, à n'utiliser que si le layout de segment est
  impossible.

★ Un layout de segment est structurel ; un test de chemin est une règle qu'on
oublie. Préférer la structure.

---

## 4. VÉRIFICATIONS À FAIRE À L'ŒIL (que `tsc` ne peut pas voir)

```
1. La nav apparaît UNE seule fois sur `/` (pas deux).
2. La nav apparaît sur `/contact`.
3. La nav N'APPARAÎT PAS sur `/atelier` ni `/atelier/welcome` — ou exactement
   comme avant si elle y était déjà.
4. Depuis `/contact`, cliquer « Musique » arrive sur l'accueil ET DESCEND à la
   section. Une navigation de route + ancre peut arriver en haut de page :
   ⚠️ CE POINT SE TESTE, IL NE SE SUPPOSE PAS.
5. Sur `/`, « Musique » défile toujours sans recharger la page.
6. Le MOTIF DESSINÉ est toujours visible derrière la nav.
   ⚠️ Un conteneur pleine largeur à fond opaque autour de la nav ENTERRERAIT
      `body::before`. Le motif ne s'afficherait pas mal — il disparaîtrait.
7. Aucune régression visuelle sur l'accueil (mêmes classes = même rendu).
```

---

## 5. RAPPORT ATTENDU

```
1. Les fichiers touchés, un par un.
2. Ce que /atelier et /atelier/welcome affichaient AVANT, et la solution retenue
   pour qu'ils n'héritent pas de la nav (+ pourquoi cette solution).
3. Le nom réel des ancres trouvées par grep (#about ? #bio ? autre ?).
4. Si `'use client'` a été nécessaire quelque part : où et pourquoi.
5. `git --no-pager diff HEAD` en entier.
6. `git status --short`.
```

⛔ Puis **S'ARRÊTER**. Pas de commit, pas de push, pas de « pendant que j'y suis ».

---

## 6. APRÈS LE RAPPORT — PROCÉDURE DE BASSIM

★★ **LA PREVIEW N'EXISTE QU'ENTRE LES DEUX MOITIÉS.** Enchaîner création de
branche et merge saute l'étape, et RIEN ne le signale. C'est arrivé le 2026-08-26 :
`b3069a2` est parti direct en production.

```bash
# 1. lire le diff soi-même (le rapport est une AFFIRMATION, pas une preuve)
git --no-pager diff HEAD

# 2. tester en local — localhost, PAS l'IP réseau (le hot-reload est bloqué en
#    cross-origin, voir learning 10)
npm run dev        # → http://localhost:3000
#    parcourir les 7 points de la section 4

# 3. brancher et POUSSER — puis S'ARRÊTER ICI
git checkout -b nav-in-layout
git add -A && git commit -m "3a: nav dans le layout, ancres absolues"
git push -u origin nav-in-layout

# 4. ★ TESTER LA PREVIEW VERCEL. Sur téléphone aussi.
#    C'est un MOMENT, pas une commande.

# 5. seulement ensuite
git checkout main && git merge nav-in-layout && git push
```
