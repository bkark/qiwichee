# BRIEF — Section BIO (BioSwitcher)

> Repo path: `docs/briefs/bio_switcher.md`
> Écrit 2026-08-21. Prérequis DÉJÀ FAITS : `bio_blocks.sql` **lancé et vérifié** (7/0/0),
> 7 images dans `public/bio/`, commit `8d0eb1b`.

---

## OBJECTIF

Une section BIO sur la page d'accueil : un carrousel horizontal de 7 blocs
texte + photo, ordonnés par `sort_order`.

C'est le **deuxième** carrousel du site. Le premier (musique) est en production.

---

## ⛔ RÈGLE N°1 — NE PAS MODIFIER `ReleaseSwitcher.tsx`

`src/app/components/ReleaseSwitcher.tsx` est un composant **partagé et en production**.
La bio a besoin d'un comportement différent :

| | Musique (existant) | Bio (à construire) |
|---|---|---|
| Position au chargement | aléatoire (client-side) | **toujours le premier bloc** |
| Recoloration de la page | oui, signature du produit | **non** |
| Source des données | `src/data/releases.ts` | **RPC Supabase** |
| Lecteur audio | oui | non |

Créer un composant **distinct**. Réutiliser le *mécanisme* de défilement
(scroll-snap CSS, largeur de slide ~88 %, flèches desktop, points) en s'en inspirant,
PAS en généralisant `ReleaseSwitcher` pour qu'il serve les deux.

Un composant qui porte deux récits différents finit par mal servir les deux.

**Si tu penses malgré tout qu'une extraction commune est la bonne réponse : ARRÊTE-TOI
et propose-la. Ne la fais pas de ta propre initiative.**

---

## ÉTAPE 0 — RECONNAISSANCE AVANT D'ÉCRIRE

Ne pars pas de ce brief pour connaître l'état du code. Vérifie :

```bash
ls src/app/components/
grep -rn "ReleaseSwitcher" src/
grep -rn "createClient" src/ --include=*.ts --include=*.tsx
ls src/app/page.tsx && grep -n "section" src/app/page.tsx
```

Objectifs de la reconnaissance :
1. Comment le client Supabase **serveur** est instancié dans ce projet (`@supabase/ssr`).
2. Où s'insère une nouvelle section dans `page.tsx`, et dans quel ordre.
3. Le patron exact du scroll-snap dans `globals.css` (blocs carrousel existants).

⚠️ Grep depuis `src/`, PAS depuis `src/app/` — des composants vivent dans
`src/components/`. Une erreur de portée a déjà été commise sur ce dépôt.

---

## DONNÉES — LECTURE PAR RPC UNIQUEMENT

```ts
supabase.rpc('get_bio_blocks', {
  p_artist_slug: 'qiwichee',
  p_usage: 'web',
})
```

⛔ **Jamais** `.from('bio_blocks')`. Les tables n'ont aucun grant client — une lecture
directe renvoie `42501`. Le RPC est `security definer` et porte la **barrière de droits** :
il ne retourne que les blocs dont `rights_web_confirmed` est vrai.

Colonnes retournées :
`slug`, `sort_order`, `title`, `body`, `image_path`, `image_hd_path`, `image_alt`, `credits`

- Fetch **côté serveur** (composant serveur), passage des données en props au composant
  client interactif. Pas de fetch dans un `useEffect`.
- Le slug artiste va dans une **constante** (ex. `src/lib/constants.ts`), pas en dur dans
  le JSX. Il deviendra dynamique au multi-tenant.
- **Zod sur la sortie du RPC** (règle permanente du projet). `credits` est un `jsonb` :
  le typer `z.array(z.object({ role: z.string(), name: z.string() }))`.
- Si le RPC échoue ou renvoie 0 ligne : **ne pas rendre la section du tout**. Pas de
  message d'erreur destiné au visiteur, pas de squelette vide.

---

## RENDU D'UN BLOC

- **Image** : `next/image`, `alt={block.image_alt}` — la colonne est `NOT NULL` en base,
  l'affichage doit l'honorer. Jamais `alt=""`, jamais l'omettre.
  Renseigner `sizes` correctement (les slides font ~88 % de la largeur du conteneur).
- **Titre** : niveau de titre cohérent avec la hiérarchie de la page (vérifier
  `page.tsx` — probablement `h3` sous un `h2` de section).
- **Corps** : `body` tel quel. Il contient déjà des apostrophes courbes — ne rien
  transformer.
- **Crédit photo** : rendre `credits` sous l'image, discrètement.
  Format : `Photo : Maëlys Jibidar`. Construire depuis le tableau, ne pas coder en dur.
  Ce crédit est une **obligation vis-à-vis de la photographe**, pas une décoration.

---

## COMPORTEMENT

✅ À faire :
- Défilement horizontal scroll-snap, un bloc par slide, aperçu partiel du suivant.
- Départ **toujours sur le premier bloc**.
- Flèches desktop : vrais `<button>`, `aria-label`, cible ≥ 44 px, **désactivées aux
  extrémités** (pas de bouclage), visibilité CSS via `@media (pointer: fine)`.
- Points de navigation : `<button>`, `aria-current`, 44 px.
- Transitions derrière `prefers-reduced-motion: no-preference`.

⛔ Interdits (règles permanentes du projet) :
- Défilement automatique, avance automatique, mode diaporama.
- Boucle infinie / slides clonées (DOM dupliqué = poison SEO + piège d'hydratation).
- Recoloration de la page par slide — c'est la signature de la section musique.
- Position initiale aléatoire — une bio a un début.
- `localStorage` / `sessionStorage`.

---

## ACCESSIBILITÉ

WCAG 2.1 AA, exigence permanente.

- Le conteneur défilant doit être **atteignable au clavier** (`tabIndex={0}` +
  `aria-label`), pour que les flèches directionnelles fonctionnent.
- Une dette connue existe sur le carrousel musique : la tabulation traverse les liens
  de toutes les slides hors écran. Les blocs bio ne contiennent **aucun lien** —
  ne pas en introduire. Si un lien devient nécessaire plus tard, il faudra `inert`
  sur les slides non actives.
- Contrastes : uniquement des tokens de `globals.css`. **Aucun hex brut** dans les
  composants (seule exception documentée du projet : les paramètres d'URL Bandcamp).

---

## SEO / JSON-LD

Ne **pas** inventer de schéma. Le `MusicGroup` existe déjà sur la page.
Si le texte du bloc 1 alimente naturellement `description` du `MusicGroup`, le signaler
en fin de tâche **comme proposition** — ne pas le faire spontanément.

---

## LIVRAISON

- ⛔ **Aucun commit.** Bassim relit le diff intégral et commite lui-même.
- Terminer par `git status` et le **contenu complet** de chaque fichier créé ou modifié.
- Signaler explicitement tout fichier partagé touché (`globals.css` en est un).
- Lancer et rapporter :
  ```bash
  grep -rn "[[:alpha:]]'[[:alpha:]]" src/ --include=*.tsx --include=*.ts
  ```
  (apostrophes droites dans du texte français — doivent être courbes)
  ```bash
  grep -rn "#[0-9a-fA-F]\{3,6\}" src/ --include=*.tsx
  ```
  (hex brut hors `globals.css`)
- Ton résumé est une **affirmation**, pas une preuve. Chaque affirmation doit être
  vérifiable dans les fichiers fournis.

---

## VÉRIFICATION PAR BASSIM APRÈS COUP

1. La section affiche 7 blocs, dans l'ordre, en démarrant sur « Qiwi Chee ».
2. Le crédit « Maëlys Jibidar » apparaît sur chaque bloc.
3. DevTools → Elements : chaque `<img>` porte un `alt` non vide et descriptif.
4. Pas de débordement horizontal de la page :
   ```js
   document.body.scrollWidth + ' vs ' + window.innerWidth
   ```
   (le piège `min-width:auto` du flexbox a déjà frappé sur le carrousel musique —
   le wrapper a besoin de `min-w-0 max-w-full overflow-hidden`)
5. Test clavier : tabulation jusqu'aux flèches, puis flèches directionnelles.
6. Test sur téléphone réel : balayage, aperçu du bloc suivant, lisibilité du texte.
