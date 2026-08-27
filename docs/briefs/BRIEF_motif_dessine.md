# MOTIF DESSINÉ — FOND PERSONNEL PAR ARTISTE

> `docs/briefs/BRIEF_motif_dessine.md`
> Établi 2026-08-26, après la livraison du motif de Qiwi Chee (commit `b3069a2`).
> Deux parties : ce qu'on demande à l'ARTISTE, et ce que fait l'OPÉRATEUR.

---

## 0. LE PRINCIPE

★ **L'ASSET PORTE LA FORME, LES TOKENS PORTENT LA COULEUR.**
Le fichier livré est un MASQUE : uniquement le canal alpha, aucune couleur.
La couleur vient de `--pattern-ink-a` / `--pattern-ink-b` dans `:root`.

Conséquences, toutes vérifiées le 2026-08-26 :
- Changer l'encre = éditer deux tokens. Aucun ré-export.
- Le motif ne peut pas figer une palette ni casser le release-switcher.
- Règle hex-clean respectée : aucun hex hors `:root`.
- 29 704 octets pour tout le site (contre 168 Ko en PNG couleur).

⛔ NE JAMAIS livrer un raster coloré. Ça gèle la palette du jour dans un fichier
   binaire, et ça se découvre au premier changement de thème.

★ **LE MOTIF EST FACULTATIF.** Colonnes nullables, aucun rendu si `pattern_path`
  est null. Un artiste qui ne dessine pas n'a rien à fournir et rien ne casse.

---

## 1. CE QU'ON DEMANDE À L'ARTISTE

### ⚠️ NE PAS DEMANDER UN MOTIF RÉPÉTABLE

Qiwi Chee a livré une tuile déjà sans couture (vérifiée : continuité des bords
0,90 / 0,92, composite 2×2 sans raccord visible). **C'est l'exception, pas la
règle.** Dessiner une tuile qui se raccorde suppose de savoir que les traits
coupés à droite doivent reprendre à gauche à la même hauteur. C'est une
compétence de graphiste, pas de dessinateur.

⇒ On demande des **motifs SÉPARÉS**. L'assemblage est notre travail.

### Message à envoyer à l'artiste (à copier tel quel)

```
Si tu veux que ton site porte tes propres dessins en fond, voilà ce dont
j'ai besoin. C'est facultatif — le site marche très bien sans.

QUOI DESSINER
  8 à 15 petits dessins SÉPARÉS, sans lien entre eux : ce que tu griffonnes
  en marge d'un cahier. Étoile, cœur, éclair, une initiale, une vague, un
  petit visage, un soleil. Ce sont TES gribouillis — c'est tout l'intérêt.

COMMENT
  · Feuille BLANCHE, sans lignes ni carreaux
  · Feutre ou stylo NOIR, trait franc (pas de crayon à papier : trop pâle)
  · Chaque dessin bien SÉPARÉ des autres, ils ne doivent pas se toucher
  · Taille : entre une pièce de monnaie et le creux de la main
  · Ne remplis pas la page — laisse de l'air autour de chaque dessin

COMMENT ME L'ENVOYER
  · Photo à plat, en pleine lumière du jour, SANS OMBRE de ta main ou du
    téléphone sur la feuille
  · Cadrage bien au-dessus, pas en biais
  · Ou un scan si tu en as un — encore mieux
  · Par lien (WeTransfer, SwissTransfer, Drive), JAMAIS par WhatsApp,
    Instagram ou iMessage : ils compressent et abîment le trait

LA COULEUR
  Dessine en noir. La couleur est ajoutée après, et on peut la changer à
  tout moment sans que tu redessines. Dis-moi juste quelle(s) couleur(s)
  tu veux — une seule, ou deux si tu veux un dégradé.

CE QUE JE DOIS TE DEMANDER
  Confirme-moi que ces dessins sont bien de toi et qu'ils ne reprennent
  aucun logo, personnage ou marque existante. Une fois en fond de site,
  ils sont publics sur chaque page.
```

### ⚠️ POURQUOI LE NOIR SUR BLANC

Le masque se dérive du CONTRASTE. Un trait pâle, un crayon gris ou une photo
sous-exposée donnent un alpha faible : le motif ressort fantomatique et
AUCUN réglage d'opacité ne le rattrape. La qualité du fond est décidée au
moment de la photo, pas au moment du code.

---

## 2. CE QUE FAIT L'OPÉRATEUR

### 2.1 — Détourage → masque alpha

Depuis la photo/scan : seuil sur la luminance, l'encre devient l'alpha, le
papier devient transparent. Le grain et l'ombre du papier disparaissent avec.

```python
from PIL import Image
import numpy as np

im = Image.open('scan.jpg').convert('L')
a = np.array(im).astype(float)
# papier ≈ 235, encre ≈ 30 — à ajuster en regardant l'histogramme
alpha = np.clip((235 - a) / (235 - 60) * 255, 0, 255).astype('uint8')
out = Image.new('RGBA', im.size, (0, 0, 0, 0))
out.putalpha(Image.fromarray(alpha))
out.save('motifs.png')
```

★ AJUSTER LES DEUX SEUILS EN REGARDANT LE RÉSULTAT, jamais en les devinant.
  Trop haut → le grain du papier passe en fond gris. Trop bas → les traits
  fins disparaissent.

### 2.2 — Découpe et composition de la tuile

Découper chaque motif, puis les répartir sur une toile carrée (1080 px
convient) en **variant tailles, rotations et espacements**. Une grille
régulière se voit immédiatement et tue l'effet « dessiné à la main ».

Pour que la tuile soit sans couture : tout motif qui dépasse d'un bord doit
être **recollé à l'identique sur le bord opposé**, même décalage. C'est
exactement ce que Qiwi Chee a fait à la main.

### 2.3 — Vérification de la couture — OBLIGATOIRE

★ **UNE TUILE NE SE CROIT PAS SANS COUTURE, ELLE SE PROUVE.**
Un raccord visible se découvre autrement sur une capture d'écran trois
semaines plus tard, et il faut alors tout recomposer.

```python
from PIL import Image
import numpy as np

im = Image.open('tuile.png'); w, h = im.size
A = np.array(im.split()[-1])
l, r = A[:, 0] > 10, A[:, -1] > 10
t, b = A[0, :] > 10, A[-1, :] > 10
iou = lambda x, y: float((x & y).sum()) / max(1, float((x | y).sum()))
print('bords G/D : %.3f' % iou(l, r), ' H/B : %.3f' % iou(t, b))

# preuve visuelle — un composite 2×2 à REGARDER
out = Image.new('RGBA', (w*2, h*2), (255, 255, 255, 255))
for x in (0, w):
    for y in (0, h):
        out.alpha_composite(im, (x, y))
out.convert('RGB').resize((720, 720)).save('preuve_2x2.png')
```

Repère : Qiwi Chee est à 0,90 / 0,92. **En dessous de ~0,80, recomposer.**
Et le chiffre ne remplace pas le composite 2×2 — on le REGARDE.

### 2.4 — Export

```python
flat = Image.new('RGBA', (1080, 1080), (0, 0, 0, 0))
flat.putalpha(alpha_1080)          # RGB à plat, l'encre vit dans l'alpha
flat.save('<slug>-doodles-mask.webp', lossless=True)
```

★ **LE MASQUE DOIT PORTER SON ALPHA.** `-webkit-mask-image` est alpha-only.
  Une image en niveaux de gris exigerait `mask-mode: luminance` et rendrait
  un RECTANGLE PLEIN sous WebKit. Le bug ne plante pas — il peint.

Cible : < 40 Ko. Qiwi Chee = 29,7 Ko. Au-delà de 60 Ko, le trait est
probablement trop bruité (grain de papier resté dans l'alpha).

Destination : `public/patterns/<slug>-doodles-mask.webp`

### 2.5 — Vérification d'identité après transfert

```bash
stat -c %s public/patterns/<slug>-doodles-mask.webp
```

Comparer à la taille produite. `file` ne suffit pas : sur Linux Mint il
renvoie « RIFF (little-endian) data, Web/P image » et rien de plus — ni
dimensions, ni alpha. Constaté le 2026-08-26.

---

## 3. RÉGLAGES — À DÉRIVER PAR ARTISTE, JAMAIS À COPIER

### ⚠️⚠️ LE PLAFOND D'OPACITÉ SE RECALCULE POUR CHAQUE PALETTE

Le 0,25 de Qiwi Chee n'est PAS une constante du produit. C'est le point où
`--text-muted` (#5C3944) sur `--bg` (#E8EBF5) teinté d'encre passe sous 4,5:1.
Une autre palette donne un autre plafond.

★ **C'EST `--text-muted` QUI CONTRAINT, PAS `--text`.** Le texte principal
  reste au-dessus de 5:1 jusqu'à 0,5. Vérifier le mauvais token laisse croire
  qu'on a trois fois plus de marge qu'en réalité.

Méthode : mélanger l'encre sur `--bg` à opacité *o*, calculer le contraste
avec `--text-muted`, prendre le *o* le plus grand qui tient ≥ 4,5:1, puis
**redescendre d'un cran** pour la marge.

| Réglage | Qiwi Chee | Comment le choisir |
|---|---|---|
| `--pattern-tile` desktop | 600 px | Le même motif ne doit pas apparaître deux fois à l'écran |
| `--pattern-tile` mobile | 400 px | Les motifs doivent rester lisibles à 400 px de large |
| `--pattern-opacity` desktop | 0,45 | Fort : le texte est sur un panneau opaque |
| `--pattern-opacity` mobile | 0,22 | Sous le plafond AA : le texte est SUR le motif |

★ **LES DEUX OPACITÉS SONT DIFFÉRENTES PARCE QUE LES DEUX SITUATIONS LE SONT.**
  Desktop : `<main>` porte `md:bg-bg`, il reste des marges, l'encre peut être
  franche. Mobile : plus de marges, le panneau est retiré, le texte est
  directement sur le motif — le plafond AA s'applique.

---

## 4. SCHÉMA — COLONNES SUR `artists`

Toutes nullables. Aucune ne bloque la création d'un artiste.

```sql
alter table public.artists
  add column pattern_path             text,
  add column pattern_ink_a            text,
  add column pattern_ink_b            text,
  add column pattern_tile_px          int,
  add column pattern_tile_px_mobile   int,
  add column pattern_opacity          numeric(3,2),
  add column pattern_opacity_mobile   numeric(3,2),
  add column pattern_follows_release  boolean not null default false,
  add column pattern_rights_confirmed boolean not null default false;

comment on column public.artists.pattern_opacity_mobile is
  'Plafond AA dérivé de --text-muted sur --bg pour CETTE palette. Ne pas copier
   la valeur d''un autre artiste.';
comment on column public.artists.pattern_rights_confirmed is
  'Confirmation écrite de l''artiste : dessins originaux, aucune marque ni
   personnage tiers. Faux ⇒ pas de rendu.';
```

★ **LA BARRIÈRE DE DROITS VA DANS LE RPC, PAS DANS LE CLIENT.** Même famille
  que `rights_web_confirmed` sur `bio_blocks` : la fonction qui sert la config
  d'un artiste renvoie `pattern_path` **null** tant que
  `pattern_rights_confirmed` est faux. Un fond ne peut pas être publié par
  oubli — c'est impossible côté base, pas déconseillé côté code.

★ `pattern_follows_release` **défaut false**. Le motif est l'écriture de
  l'artiste, pas un élément de thème. Recolorer son dessin au fil des sorties
  écrase un choix qu'elle a déjà fait. Qiwi Chee : false.

⚠️ Ces colonnes ne sont PAS encore créées. Aujourd'hui tout est en dur dans
   `globals.css` pour Qiwi Chee. La migration se fait avec la sortie de
   `releases.ts` du code (§2.2 du PIVOT) — même chantier, même fenêtre.

---

## 5. PIÈGE DE RENDU — CONSTATÉ LE 2026-08-26

★ **UN CONTENEUR PLEINE LARGEUR AVEC UN FOND OPAQUE MASQUE UNE COUCHE `fixed`.**

`<div className="min-h-screen bg-bg">` recouvrait `body::before` sur toute la
page. Le motif ne s'est jamais mal affiché : il était ENTERRÉ.

★ SYMPTÔME QUI DÉSIGNE LA CAUSE : visible uniquement en BAS de page et sur
  `/contact` — exactement là où le conteneur s'arrête et là où il n'existe pas.
  Une couche `fixed` partiellement visible ⇒ chercher le couvercle AVANT de
  déboguer la couche.

⚠️ Le panneau et la page portent la MÊME couleur (`--bg`), donc le panneau est
   invisible : aucun bord ne le signale. Il ne se voit que par l'ABSENCE de
   motif dessous.

---

## 6. CHECKLIST PAR ARTISTE

```
[ ] Confirmation écrite : dessins originaux, aucune marque tierce
[ ] Photo/scan reçue PAR LIEN (jamais WhatsApp/Instagram/iMessage)
[ ] Détourage → alpha, seuils ajustés en regardant le résultat
[ ] Motifs découpés, composés avec variation, bords recollés
[ ] Couture vérifiée : IoU ≥ 0,80 ET composite 2×2 regardé
[ ] Export WebP alpha-porteur < 40 Ko
[ ] Taille en octets vérifiée après transfert
[ ] Encres nommées par l'artiste → tokens dans :root
[ ] Plafond AA recalculé sur SA palette (--text-muted, pas --text)
[ ] Testé aux deux largeurs + sur un vrai téléphone (iOS ET Android)
[ ] grep hex : aucun hex hors :root
```

★ **NE PAS OUTILLER CE PROCESSUS MAINTENANT.** Règle G du PIVOT : on
  n'automatise pas une procédure qu'on n'a pas exécutée à la main. Elle l'a
  été UNE fois (Qiwi Chee, et à moitié — elle avait déjà composé sa tuile).
  Artiste #2 à la main en chronométrant, artiste #3 avec cette checklist,
  outillage seulement si le temps cesse de baisser.

---
*2026-08-26 · Le motif de Qiwi Chee tient en 29,7 Ko parce qu'il ne porte
aucune couleur. Tout le reste de ce document découle de là.*
