# BRIEF — SHARE CARD DU CARROUSEL MUSICAL

Statut : implémenté — commit dc955b6
Branche attendue : `feat/share-card`
Auteur du brief : session Claude (Projet Qiwichee)

---

## 0. RÈGLES DE SESSION — À LIRE AVANT D'ÉCRIRE UNE LIGNE

- ⛔ **NE JAMAIS commiter ni pusher.** À la fin, afficher `git --no-pager diff HEAD`
  et attendre la revue humaine.
- ⛔ **NE RIEN INVENTER** comme structure ou champ. Si un nom de champ du catalogue
  est incertain, **lire `src/lib/modules/catalogue/types.ts`** et aligner. Ne pas deviner.
- ⛔ **AUCUN hexa** dans le code (`#rrggbb`). Toutes les couleurs viennent des tokens
  CSS de `:root` dans `globals.css`. Vérification finale :
  `grep -rn "#[0-9a-fA-F]\{3,6\}" src/lib/modules/share/` doit ne rien renvoyer.
  (La géométrie `d=` des SVG est autorisée ; un `fill=` ou `stroke=` avec un hexa ne l'est pas.)
- ⛔ **AUCUN texte visible en dur** dans un composant. Toutes les chaînes descendent
  en props via l'interface `ShareLabels`.
- ⛔ **AUCUN appel Supabase depuis un composant.** Cette fonction n'en fait aucun.
- ⛔ **AUCUNE nouvelle dépendance npm.** Pas de `html2canvas`. Canvas 2D natif.
- ★ « artiste » se traite comme une **entité générique** (`ShareIdentity`), pour qu'un
  humoriste ou un conteur passe sans réécriture.

**Si un point de ce brief contredit le code réel du dépôt : ARRÊTER et le signaler.
Ne pas « corriger » silencieusement.** Le brief peut se tromper ; le dépôt fait foi.

---

## 1. OBJECTIF

Ajouter un bouton « Partager » sur chaque diapo du carrousel musical. Au clic,
génération côté client d'une image de partage (Share Card) et partage via Web Share
API, avec repli sur copie de lien + téléchargement de l'image.

Aucun backend. Aucune table. Aucune migration SQL.

---

## 2. LES TROIS DÉCISIONS DÉJÀ TRANCHÉES

### D1 — Le deep link ne passe pas par `/music`

La route `/music` **n'existe pas**. Le carrousel vit dans la section `#music` de
`src/app/(public)/page.tsx`. Forme du lien :

```
https://qiwichee.com/?release=<slug-release>&song=<slug-chanson>#music
```

L'origine et le chemin **ne sont jamais codés en dur** : ils descendent en props
depuis `MusicSection` via `ShareDeepLinkConfig`. L'origine vient de
`process.env.NEXT_PUBLIC_SITE_ORIGIN`.

### D2 — Le paramètre `song` porte le SLUG, pas l'UUID

Le slug est l'identifiant unique du catalogue. `Song` n'a pas de champ `id` —
il n'y a aucun UUID à émettre ni à recevoir. `ShareableSong` n'a donc pas de champ `id`.

- **En émission** : toujours le slug.
- **En réception** : slug uniquement (`resolveSongIndex` — pas de fallback UUID).

### D3 — Le motif « waveform » est DÉCORATIF

Les lecteurs sont des iframes cross-origin (Bandcamp, YouTube) : **aucun échantillon
PCM n'est accessible** depuis notre page. Le motif est un hachage déterministe du
slug — même chanson, même dessin, sur tous les appareils, dans le temps.

⚠️ Le commentaire de décision dans `ShareCard.tsx` **doit être conservé mot pour mot**.
Sans lui, une session future prendra ce motif pour de la donnée audio et bâtira dessus.

---

## 3. FICHIERS À CRÉER

Tous sous `src/lib/modules/share/` :

| Fichier | Rôle |
|---|---|
| `types.ts` | Vue-modèle, découplé du catalogue |
| `deepLink.ts` | Construction et lecture du lien |
| `tokens.ts` | Résolution des tokens CSS pour canvas |
| `ShareCard.tsx` | Peinture de l'image (canvas 2D) |
| `useShareSong.ts` | Hook : cache, partage, replis |
| `ShareButton.tsx` | Bouton, variante icône et variante libellée |

Fichiers à **modifier** : `SongSwitcher.tsx`, `MusicSection.tsx`, et éventuellement
`src/app/(public)/page.tsx` (frontière Suspense, voir §7).

---

## 4. CODE

### 4.1 `src/lib/modules/share/types.ts`

Divergences par rapport au brief original, tranchées par relecture du dépôt :

- **Pas de champ `id`** : `Song` n'a pas d'UUID — le slug est l'identifiant unique.
- **`releaseTitle: string | null`** : chanson orpheline (sans release) → ligne de
  contexte de la carte affiche `identity.name` seul.
- **`releaseSlug: string | null`** : idem → `buildSongDeepLink` omet le paramètre `release`.
- **`artworkUrl: string`** garanti non-null : ce type n'est créé que quand `song.artwork`
  existe (RÈGLE POCHETTE — voir §5.1).
- **`artworkAlt: string | null`** : suit la nullabilité du champ source.

```ts
export interface ShareableSong {
  /** Slug de la chanson — ancre, deep link, graine du motif décoratif.
   *  Le slug est l'identifiant unique du catalogue ; aucun UUID n'est émis. */
  slug: string
  title: string
  /** Null si la chanson est orpheline — la ligne de contexte affiche identity.name seul. */
  releaseTitle: string | null
  /** Null si orpheline — buildSongDeepLink omet le paramètre release. */
  releaseSlug: string | null
  /** URL de la pochette. Présence garantie : ce type n'est créé que quand artwork != null. */
  artworkUrl: string
  artworkAlt: string | null
}

export interface ShareIdentity {
  name: string
  domain: string
  platformWordmark: string
}

export interface ShareDeepLinkConfig {
  origin: string
  path: string
  hash?: string
}

export interface ShareLabels {
  action: string
  actionAriaTemplate: string
  pending: string
  copied: string
  failed: string
  shareTitleTemplate: string
  shareTextTemplate: string
  cardReleaseKicker: string
}

export type ShareStatus = 'idle' | 'pending' | 'shared' | 'copied' | 'failed'
export type ShareButtonVariant = 'icon' | 'labelled'
```

### 4.2 `src/modules/share/deepLink.ts`

```ts
import type { ShareDeepLinkConfig, ShareableSong } from './types';

export const SHARE_PARAM_RELEASE = 'release';
export const SHARE_PARAM_SONG = 'song';

/**
 * DÉCISION 2 : le lien émis porte TOUJOURS le slug.
 * Un UUID dans une URL partagée n'est lisible ni par un humain ni par un
 * crawler, et le slug sert déjà d'ancre. L'entrée, elle, accepte les deux
 * (voir resolveSongIndex) pour ne pas casser un lien déjà diffusé.
 */
export function buildSongDeepLink(
  song: ShareableSong,
  config: ShareDeepLinkConfig,
): string {
  const url = new URL(config.path, config.origin);
  url.searchParams.set(SHARE_PARAM_RELEASE, song.releaseSlug);
  url.searchParams.set(SHARE_PARAM_SONG, song.slug);
  if (config.hash) url.hash = config.hash.replace(/^#/, '');
  return url.toString();
}

export interface IncomingSongLink {
  release: string | null;
  /** Peut être un slug ou un id : on ne présume pas de la source du lien. */
  song: string;
}

export function readSongDeepLink(
  search: URLSearchParams,
): IncomingSongLink | null {
  const song = search.get(SHARE_PARAM_SONG);
  if (!song) return null;
  return { release: search.get(SHARE_PARAM_RELEASE), song };
}

/** Résout un lien entrant. Slug d'abord, id en repli. -1 si introuvable. */
export function resolveSongIndex(
  songs: readonly ShareableSong[],
  target: IncomingSongLink,
): number {
  const bySlug = songs.findIndex((s) => s.slug === target.song);
  if (bySlug >= 0) return bySlug;
  return songs.findIndex((s) => s.id === target.song);
}

/** Substitution de gabarit — les libellés viennent des messages, pas du code. */
export function fillTemplate(
  template: string,
  values: Record<string, string>,
): string {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in values ? values[key] : whole,
  );
}
```

### 4.3 `src/modules/share/tokens.ts`

⚠️ **`canvas` ne comprend pas `var(--accent)`.** Il faut résoudre les tokens en
valeurs calculées au moment du dessin. C'est ce qui permet de peindre une image sans
écrire un seul hexa.

⚠️ **Vérifier les noms de tokens contre `globals.css` avant de finaliser.** Si un nom
diffère, corriger ici et le signaler dans le rapport de fin.

```ts
/**
 * Résout les tokens CSS de :root en valeurs concrètes, pour canvas.
 * ⚠️ NE JAMAIS remplacer par des littéraux : la palette par release
 *    (surcharges sur [data-release]) doit pouvoir déteindre sur la carte.
 */
const TOKEN_NAMES = {
  bg: '--bg',
  text: '--text',
  textMuted: '--text-muted',
  accent: '--accent',
} as const;

const FONT_TOKEN_NAMES = {
  display: '--font-bricolage',
  body: '--font-inter',
} as const;

export interface ShareCardTheme {
  bg: string;
  text: string;
  textMuted: string;
  accent: string;
  displayFamily: string;
  bodyFamily: string;
}

/**
 * @param scope élément dont on lit les variables. Passer la diapo pour
 *              hériter d'une éventuelle palette [data-release].
 */
export function readShareCardTheme(scope?: Element | null): ShareCardTheme {
  const el = scope ?? document.documentElement;
  const cs = getComputedStyle(el);
  const read = (name: string): string => cs.getPropertyValue(name).trim();

  const missing = Object.values(TOKEN_NAMES).filter((n) => !read(n));
  if (missing.length > 0) {
    throw new Error(`share: tokens absents de :root — ${missing.join(', ')}`);
  }

  return {
    bg: read(TOKEN_NAMES.bg),
    text: read(TOKEN_NAMES.text),
    textMuted: read(TOKEN_NAMES.textMuted),
    accent: read(TOKEN_NAMES.accent),
    // Repli sur les génériques CSS, jamais sur un nom de fonte en dur.
    displayFamily: read(FONT_TOKEN_NAMES.display) || 'sans-serif',
    bodyFamily: read(FONT_TOKEN_NAMES.body) || 'sans-serif',
  };
}
```

### 4.4 `src/modules/share/ShareCard.tsx`

```tsx
'use client';

import type { ShareIdentity, ShareLabels, ShareableSong } from './types';
import { readShareCardTheme, type ShareCardTheme } from './tokens';

/** 4:5 — le format qui survit au recadrage Instagram feed et Stories. */
export const CARD_WIDTH = 1080;
export const CARD_HEIGHT = 1350;

const PAD = 84;
const ART_SIZE = CARD_WIDTH - PAD * 2;
const ART_RADIUS = 28;
const WAVE_BARS = 56;
const WAVE_HEIGHT = 92;
const WAVE_GAP = 6;

/* ══════════════════════════════════════════════════════════════════════
   DÉCISION 3 — LE MOTIF EST DÉCORATIF, PAS UNE ANALYSE AUDIO.

   Les lecteurs sont des iframes cross-origin (Bandcamp, YouTube) : aucun
   échantillon PCM n'est lisible depuis notre page. Ce motif est dérivé du
   SLUG par hachage — même chanson, même dessin, sur tous les appareils et
   dans le temps. C'est une signature visuelle stable, pas une mesure.

   ⛔ Ne pas le renommer "waveform" sans ce commentaire : une session future
      croirait à de la donnée et bâtirait dessus.
   ⇒ Le jour où audio_path sert nos propres MP3 (rights_stream_confirmed),
      une vraie analyse devient possible. Ce sera une AUTRE fonction, pas
      une correction de celle-ci.
   ══════════════════════════════════════════════════════════════════════ */

function hash32(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function decorativePattern(seed: string, count: number): number[] {
  let h = hash32(seed);
  const out: number[] = [];
  for (let i = 0; i < count; i += 1) {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h >>>= 0;
    const raw = 0.2 + (h / 0xffffffff) * 0.8;
    // Enveloppe : atténue les extrémités, ça se lit comme un extrait.
    const t = count === 1 ? 0.5 : i / (count - 1);
    out.push(raw * Math.sin(Math.PI * t) ** 0.45);
  }
  return out;
}

/* ─────────────── primitives ─────────────── */

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // Indispensable dès que la pochette part sur Supabase Storage : sans
    // en-tête CORS côté bucket, le canvas est « tainted » et toBlob() lève
    // une SecurityError. Sans effet tant que les fichiers sont dans public/.
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`share: pochette illisible (${src})`));
    img.src = src;
  });
}

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
    return;
  }
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
      if (lines.length === maxLines) break;
    }
  }
  if (lines.length < maxLines && current) lines.push(current);

  const last = lines[lines.length - 1];
  if (lines.length === maxLines && last && ctx.measureText(last).width > maxWidth) {
    let cut = last;
    while (cut.length > 1 && ctx.measureText(`${cut}…`).width > maxWidth) {
      cut = cut.slice(0, -1);
    }
    lines[lines.length - 1] = `${cut}…`;
  }
  return lines;
}

/* ─────────────── rendu ─────────────── */

export interface RenderShareCardInput {
  song: ShareableSong;
  identity: ShareIdentity;
  labels: Pick<ShareLabels, 'cardReleaseKicker'>;
  /** Diapo d'origine → hérite d'une palette [data-release] le jour venu. */
  themeScope?: Element | null;
}

export async function renderShareCard(
  input: RenderShareCardInput,
): Promise<Blob> {
  const { song, identity, labels, themeScope } = input;

  // Les fontes next/font se chargent en async : sans cette attente, la carte
  // se dessine dans la fonte de repli. Bug silencieux, image déjà partagée.
  if (document.fonts?.ready) await document.fonts.ready;

  const theme: ShareCardTheme = readShareCardTheme(themeScope);
  const artwork = await loadImage(song.artworkUrl);

  const canvas = document.createElement('canvas');
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('share: contexte 2d indisponible');

  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  // Pochette, recadrée en carré depuis le centre.
  const side = Math.min(artwork.naturalWidth, artwork.naturalHeight);
  ctx.save();
  roundedRectPath(ctx, PAD, PAD, ART_SIZE, ART_SIZE, ART_RADIUS);
  ctx.clip();
  ctx.drawImage(
    artwork,
    (artwork.naturalWidth - side) / 2,
    (artwork.naturalHeight - side) / 2,
    side,
    side,
    PAD,
    PAD,
    ART_SIZE,
    ART_SIZE,
  );
  ctx.restore();

  let cursorY = PAD + ART_SIZE + 76;

  ctx.fillStyle = theme.text;
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  ctx.font = `700 62px ${theme.displayFamily}`;
  for (const line of wrapText(ctx, song.title, ART_SIZE, 2)) {
    ctx.fillText(line, PAD, cursorY);
    cursorY += 74;
  }

  cursorY += 6;
  ctx.fillStyle = theme.textMuted;
  ctx.font = `400 30px ${theme.bodyFamily}`;
  const context = `${labels.cardReleaseKicker} ${song.releaseTitle} · ${identity.name}`;
  ctx.fillText(wrapText(ctx, context, ART_SIZE, 1)[0] ?? '', PAD, cursorY);

  // Motif décoratif — graine = slug (voir bloc de décision ci-dessus).
  const waveTop = CARD_HEIGHT - PAD - 96 - WAVE_HEIGHT;
  const barWidth = (ART_SIZE - WAVE_GAP * (WAVE_BARS - 1)) / WAVE_BARS;
  ctx.fillStyle = theme.accent;
  decorativePattern(song.slug, WAVE_BARS).forEach((value, i) => {
    const h = Math.max(4, value * WAVE_HEIGHT);
    roundedRectPath(
      ctx,
      PAD + i * (barWidth + WAVE_GAP),
      waveTop + (WAVE_HEIGHT - h) / 2,
      barWidth,
      h,
      barWidth / 2,
    );
    ctx.fill();
  });

  // Pied : domaine à gauche, signature plateforme à droite.
  const footerY = CARD_HEIGHT - PAD;
  ctx.font = `500 28px ${theme.bodyFamily}`;
  ctx.fillStyle = theme.text;
  ctx.fillText(identity.domain, PAD, footerY);
  ctx.fillStyle = theme.textMuted;
  ctx.textAlign = 'right';
  ctx.fillText(identity.platformWordmark, CARD_WIDTH - PAD, footerY);
  ctx.textAlign = 'left';

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('share: toBlob a échoué'))),
      'image/png',
    );
  });
}
```

### 4.5 `src/modules/share/useShareSong.ts`

```ts
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { renderShareCard } from './ShareCard';
import { buildSongDeepLink, fillTemplate } from './deepLink';
import type {
  ShareDeepLinkConfig,
  ShareIdentity,
  ShareLabels,
  ShareStatus,
  ShareableSong,
} from './types';

export interface UseShareSongOptions {
  identity: ShareIdentity;
  labels: ShareLabels;
  deepLink: ShareDeepLinkConfig;
}

export interface UseShareSongResult {
  /** Slug de la chanson en cours de partage, ou null. */
  activeSlug: string | null;
  status: ShareStatus;
  /** Pré-génère hors du chemin critique du clic. Idempotent. */
  prepare: (song: ShareableSong, scope?: Element | null) => void;
  share: (song: ShareableSong, scope?: Element | null) => Promise<void>;
}

const STATUS_RESET_MS = 2400;

/**
 * ⚠️ CACHE BORNÉ. Un bouton par diapo × 200 chansons, sans plafond, ce sont
 * 200 PNG de 1080×1350 en mémoire. Quatre suffisent : la diapo centrée et
 * ses voisines immédiates.
 */
const CACHE_LIMIT = 4;

function canShareFiles(files: File[]): boolean {
  if (typeof navigator === 'undefined' || !navigator.canShare) return false;
  try {
    return navigator.canShare({ files });
  } catch {
    return false;
  }
}

export function useShareSong(options: UseShareSongOptions): UseShareSongResult {
  const { identity, labels, deepLink } = options;

  const [status, setStatus] = useState<ShareStatus>('idle');
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const cache = useRef(new Map<string, Promise<Blob>>());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const flash = useCallback((next: ShareStatus) => {
    if (!alive.current) return;
    setStatus(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (!alive.current) return;
      setStatus('idle');
      setActiveSlug(null);
    }, STATUS_RESET_MS);
  }, []);

  const blobFor = useCallback(
    (song: ShareableSong, scope?: Element | null): Promise<Blob> => {
      const hit = cache.current.get(song.slug);
      if (hit) {
        // Remise en tête : Map conserve l'ordre d'insertion.
        cache.current.delete(song.slug);
        cache.current.set(song.slug, hit);
        return hit;
      }

      const pending = renderShareCard({
        song,
        identity,
        labels,
        themeScope: scope,
      }).catch((error: unknown) => {
        // Un échec ne reste pas en cache : le prochain clic réessaie.
        cache.current.delete(song.slug);
        throw error;
      });

      cache.current.set(song.slug, pending);
      while (cache.current.size > CACHE_LIMIT) {
        const oldest = cache.current.keys().next().value;
        if (oldest === undefined) break;
        cache.current.delete(oldest);
      }
      return pending;
    },
    [identity, labels],
  );

  const prepare = useCallback<UseShareSongResult['prepare']>(
    (song, scope) => {
      if (typeof window === 'undefined') return;
      if (cache.current.has(song.slug)) return;
      const run = () => {
        void blobFor(song, scope).catch(() => {
          /* silencieux : la pré-génération n'a pas le droit d'alerter */
        });
      };
      const idle = (window as Window & {
        requestIdleCallback?: (cb: () => void) => number;
      }).requestIdleCallback;
      if (idle) idle(run);
      else setTimeout(run, 200);
    },
    [blobFor],
  );

  const share = useCallback<UseShareSongResult['share']>(
    async (song, scope) => {
      const url = buildSongDeepLink(song, deepLink);
      const values = { title: song.title, name: identity.name };
      const title = fillTemplate(labels.shareTitleTemplate, values);
      const text = fillTemplate(labels.shareTextTemplate, values);

      setActiveSlug(song.slug);
      setStatus('pending');

      let file: File | null = null;
      try {
        const blob = await blobFor(song, scope);
        file = new File([blob], `${song.slug}.png`, { type: 'image/png' });
      } catch {
        file = null; // On partagera le lien seul plutôt que rien.
      }

      // 1. Partage natif AVEC image.
      if (file && canShareFiles([file])) {
        try {
          await navigator.share({ files: [file], title, text, url });
          flash('shared');
          return;
        } catch (error) {
          if ((error as Error)?.name === 'AbortError') {
            setStatus('idle');
            setActiveSlug(null);
            return;
          }
          // NotAllowedError = geste expiré pendant la génération. On descend.
        }
      }

      // 2. Partage natif SANS image (desktop Chrome, Android partiel).
      if (typeof navigator !== 'undefined' && navigator.share) {
        try {
          await navigator.share({ title, text, url });
          flash('shared');
          return;
        } catch (error) {
          if ((error as Error)?.name === 'AbortError') {
            setStatus('idle');
            setActiveSlug(null);
            return;
          }
        }
      }

      // 3. Repli : lien au presse-papier, image téléchargée si elle existe.
      try {
        await navigator.clipboard.writeText(url);
        if (file) {
          const href = URL.createObjectURL(file);
          const a = document.createElement('a');
          a.href = href;
          a.download = file.name;
          a.click();
          URL.revokeObjectURL(href);
        }
        flash('copied');
      } catch {
        flash('failed');
      }
    },
    [blobFor, deepLink, flash, identity.name, labels],
  );

  return { activeSlug, status, prepare, share };
}
```

### 4.6 `src/modules/share/ShareButton.tsx`

⚠️ Si les utilitaires Tailwind `text-text-muted` / `text-accent` existent déjà dans
le projet, les préférer à la syntaxe `text-[color:var(--…)]`. Vérifier avant.

```tsx
'use client';

import { useRef } from 'react';
import { fillTemplate } from './deepLink';
import type {
  ShareButtonVariant,
  ShareLabels,
  ShareStatus,
  ShareableSong,
} from './types';

export interface ShareButtonProps {
  song: ShareableSong;
  labels: ShareLabels;
  /** Statut du hook, transmis uniquement si CETTE chanson est concernée. */
  status: ShareStatus;
  /**
   * 'icon' dans les diapos : AUCUN texte visible, le carrousel reste visuel.
   * Le mot « Partager » vit dans l'aria-label, lu par les lecteurs d'écran.
   */
  variant?: ShareButtonVariant;
  onShare: (song: ShareableSong, scope: Element | null) => void;
  onPrepare: (song: ShareableSong, scope: Element | null) => void;
}

function visibleLabel(status: ShareStatus, labels: ShareLabels): string {
  switch (status) {
    case 'pending':
      return labels.pending;
    case 'copied':
      return labels.copied;
    case 'failed':
      return labels.failed;
    default:
      return labels.action;
  }
}

export default function ShareButton(props: ShareButtonProps) {
  const { song, labels, status, variant = 'icon', onShare, onPrepare } = props;
  const ref = useRef<HTMLButtonElement>(null);

  const busy = status === 'pending';
  const label = fillTemplate(labels.actionAriaTemplate, { title: song.title });

  // La diapo porte data-release le jour de la palette par release ;
  // en attendant, closest() renvoie null et le thème tombe sur :root.
  const scope = () => ref.current?.closest('[data-release]') ?? ref.current;

  // Le pointerdown précède le click : la génération démarre avant même que
  // le doigt se lève. C'est ce qui sauve le geste sur Safari iOS.
  const warm = () => onPrepare(song, scope());

  return (
    <button
      ref={ref}
      type="button"
      disabled={busy}
      title={label}
      aria-label={label}
      onFocus={warm}
      onPointerEnter={warm}
      onPointerDown={warm}
      onClick={() => onShare(song, scope())}
      className={[
        'inline-flex min-h-11 min-w-11 items-center justify-center gap-2',
        'rounded-full text-[color:var(--text-muted)] transition-colors',
        'hover:text-[color:var(--accent)] focus-visible:outline',
        'focus-visible:outline-2 focus-visible:outline-offset-2',
        'focus-visible:outline-[color:var(--accent)] disabled:opacity-60',
        variant === 'labelled' ? 'px-4 py-2 text-sm font-medium' : 'p-2',
      ].join(' ')}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
        <path d="M16 6l-4-4-4 4" />
        <path d="M12 2v14" />
      </svg>
      {variant === 'labelled' ? <span>{visibleLabel(status, labels)}</span> : null}
      <span className="sr-only" role="status" aria-live="polite">
        {status === 'idle' ? '' : visibleLabel(status, labels)}
      </span>
    </button>
  );
}
```

---

## 5. INTÉGRATION DANS `SongSwitcher.tsx`

### 5.1 Le mapping — SEUL POINT DE COUPLAGE

**RÈGLE POCHETTE** : si `song.artwork` est null, `toShareableSong` retourne null
et aucun `ShareButton` n'est rendu sur cette diapo. Une carte sans visuel ne
doit pas circuler.

**RÈGLE RELEASE** : si `song.release` est null, `releaseTitle` et `releaseSlug`
sont null. La carte et le lien s'adaptent (voir §4.4 et §4.2).

Champs réels (lus dans `src/lib/modules/catalogue/types.ts`) :

| Champ `ShareableSong` | Source dans `Song` |
|---|---|
| `slug` | `song.slug` |
| `title` | `song.title` |
| `releaseTitle` | `song.release?.title ?? null` |
| `releaseSlug` | `song.release?.slug ?? null` |
| `artworkUrl` | `song.artwork` (garanti non-null par le guard) |
| `artworkAlt` | `song.artworkAlt` |

```tsx
import type { Song } from '@/lib/modules/catalogue/types'
import type { ShareableSong } from '@/lib/modules/share/types'

// ⚠️ SEUL POINT DE COUPLAGE. Retourne null si artwork est absent (RÈGLE POCHETTE).
function toShareableSong(song: Song): ShareableSong | null {
  if (!song.artwork) return null
  return {
    slug: song.slug,
    title: song.title,
    releaseTitle: song.release?.title ?? null,
    releaseSlug: song.release?.slug ?? null,
    artworkUrl: song.artwork,
    artworkAlt: song.artworkAlt,
  }
}
```

### 5.2 Props à ajouter

```tsx
interface SongSwitcherProps {
  // … props existantes, ne rien retirer
  shareIdentity: ShareIdentity;
  shareLabels: ShareLabels;
  shareDeepLink: ShareDeepLinkConfig;
}
```

### 5.3 Dans le corps du composant

`shareableMap` est une `Map<string, ShareableSong>` (slug → song) plutôt qu'un
tableau parallèle, pour ne contenir que les chansons avec pochette sans créer de
trous dans les indices.

```tsx
const shareableMap = useMemo<Map<string, ShareableSong>>(() => {
  const map = new Map<string, ShareableSong>()
  for (const song of songs) {
    const s = toShareableSong(song)
    if (s) map.set(song.slug, s)
  }
  return map
}, [songs])

const { activeSlug, status, prepare, share } = useShareSong({
  identity: shareIdentity,
  labels: shareLabels,
  deepLink: shareDeepLink,
})

// Pré-chauffage de la SEULE diapo centrée. Le cache borné fait le reste.
useEffect(() => {
  const song = songs[activeIndex]
  if (!song) return
  const s = shareableMap.get(song.slug)
  if (s) prepare(s)
}, [activeIndex, prepare, shareableMap, songs])
```

`activeIndex` est la variable d'index déjà présente dans le composant — ne pas renommer.

### 5.4 Le bouton dans chaque diapo

Le `ShareButton` est rendu dans un `<div className="relative">` qui enveloppe
`EmbedPlayer`. Si la chanson n'a pas de média, `content` reste `null`.

```tsx
const items: CarouselItem[] = songs.map((song, idx) => {
  const shareableSong = song.media ? shareableMap.get(song.slug) : undefined
  return {
    key: song.slug,   // ← key = slug (pas d'id dans Song)
    // …
    content: song.media ? (
      <div className="relative">
        <EmbedPlayer … />
        {shareableSong && (
          <div className="absolute right-3 top-3 z-10">
            <ShareButton
              song={shareableSong}
              labels={shareLabels}
              status={activeSlug === song.slug ? status : 'idle'}
              variant="icon"
              onShare={share}
              onPrepare={prepare}
            />
          </div>
        )}
      </div>
    ) : null,
  }
})
```

⚠️ Deux conditions à vérifier :
- La diapo doit porter `relative`, sinon `absolute` s'accroche à un ancêtre lointain.
- Le bouton doit passer **au-dessus** de l'iframe du lecteur. Les iframes tiers créent
  leur propre contexte d'empilement : si `z-10` ne suffit pas, le signaler plutôt que
  d'empiler les `z-50`.

### 5.5 Lecture du deep link entrant

Sans ça, le lien partagé ouvre la page et ne fait rien.

L'index se résout dans `songs` (l'ensemble complet), pas dans `shareableMap`
(sous-ensemble avec pochette), pour que la navigation fonctionne même si la
pochette est absente. Il n'existe pas de fonction `scrollToSlide` dans
`SongSwitcher` — utiliser directement `carouselRef.current?.scrollToIndex`.

```tsx
const searchParams = useSearchParams()

useEffect(() => {
  const target = readSongDeepLink(new URLSearchParams(searchParams.toString()))
  if (!target) return
  const index = songs.findIndex((s) => s.slug === target.song)
  if (index < 0) return
  // Même remède que pour les ancres #slug : le navigateur ne peut pas
  // atteindre une diapo que React n'a pas encore montée.
  requestAnimationFrame(() => carouselRef.current?.scrollToIndex(index))
}, [searchParams, songs])
```

Le `#music` amène le navigateur sur la section ; ce `useEffect` centre la diapo à
l'intérieur. Deux mécanismes distincts, et c'est voulu.

---

## 6. CÂBLAGE DANS `MusicSection.tsx` (composant serveur)

```tsx
const shareDeepLink: ShareDeepLinkConfig = {
  origin: process.env.NEXT_PUBLIC_SITE_ORIGIN!,
  path: '/',
  hash: 'music',
};
```

`shareIdentity` et `shareLabels` se câblent au même endroit, depuis les sources déjà
utilisées par la section pour le nom de l'artiste et les chaînes de chrome.

⚠️ Si `NEXT_PUBLIC_SITE_ORIGIN` n'existe pas dans `.env.local`, **le signaler** —
c'est une variable à créer côté Vercel (type **Config**, portée **toutes branches**),
pas à inventer avec une valeur par défaut.

---

## 7. FRONTIÈRE SUSPENSE

`useSearchParams` force la page dans une frontière `<Suspense>` au build. Si
`npm run build` sort *"useSearchParams should be wrapped in a suspense boundary"*,
envelopper `<MusicSection />` dans `<Suspense fallback={null}>` côté
`src/app/(public)/page.tsx`.

---

## 8. CHAÎNES — COUCHE A

Si `messages/fr.json` existe, ajouter :

```json
{
  "share": {
    "action": "Partager",
    "actionAriaTemplate": "Partager « {title} »",
    "pending": "Préparation…",
    "copied": "Lien copié",
    "failed": "Partage impossible",
    "shareTitleTemplate": "{title} — {name}",
    "shareTextTemplate": "J'écoute « {title} » de {name}.",
    "cardReleaseKicker": "Extrait de"
  }
}
```

Si le fichier n'existe pas encore (étape 3b non faite), les passer depuis
`MusicSection` avec un commentaire `// TODO 3b — worklist docs/audits/copy_inventory.md`.
**Jamais en dur dans un composant.**

---

## 9. CE QUE LA SESSION DOIT PRODUIRE EN SORTIE

1. `npm run build` passe.
2. `grep -rn "#[0-9a-fA-F]\{3,6\}" src/lib/modules/share/` ne renvoie rien.
3. `git --no-pager diff HEAD` affiché en entier.
4. Un rapport court listant :
   - les noms de champs du catalogue effectivement utilisés (§5.1) ;
   - les noms de tokens CSS effectivement trouvés dans `globals.css` (§4.3) ;
   - toute divergence entre ce brief et le dépôt réel ;
   - toute variable d'environnement manquante.

⛔ **Aucun commit. Aucun push.**

---

## 10. VÉRIFICATION MANUELLE APRÈS DÉPLOIEMENT EN PREVIEW

Dans cet ordre :

1. **Le lien émis.** Partager une chanson, coller l'URL : elle doit être exactement
   `https://qiwichee.com/?release=<slug>&song=<slug>#music`. Aucun UUID.
2. **Le lien retour.** Ouvrir cette URL dans un onglet neuf : la page arrive sur la
   section, la bonne diapo est centrée, rien ne saute.
3. **Stabilité du motif.** Partager deux fois la même chanson : les deux PNG doivent
   être identiques au pixel.
4. **Les fontes.** Si la carte sort en Arial, le nom de variable next/font ne
   correspond pas à `--font-bricolage`.
5. **iOS Safari, tap direct** sans survol préalable — le seul environnement où le
   geste utilisateur peut expirer.
6. **Desktop Firefox** n'a pas `navigator.share` : doit tomber sur « Lien copié »
   plus téléchargement du PNG.
7. **Le bouton ne recouvre pas une commande du lecteur** sur une diapo Bandcamp et
   sur une diapo YouTube.

---

## 11. HORS PÉRIMÈTRE

- Toute migration SQL.
- Toute analyse audio réelle (voir D3).
- Le bouton dans le bloc épinglé (la variante `labelled` existe, elle n'est pas câblée).
- La palette par release (`[data-release]`) — le code y est préparé, elle n'existe pas encore.

---

## 12. DIVERGENCES RÉSOLUES LORS DE L'IMPLÉMENTATION

Ce tableau documente les écarts entre le brief original et le dépôt réel,
tranchés à l'implémentation. Il répond aux questions « pourquoi pas d'id ? »,
« pourquoi `resolveSongIndex` n'existe pas ? », etc.

| # | Ce que le brief prévoyait | Ce que le dépôt impose | Résolution |
|---|---|---|---|
| A | `ShareableSong.id: string` (UUID) | `Song` n'a pas de champ `id` | Supprimé. Le slug est l'identifiant unique du catalogue. |
| B | Champs plats `releaseTitle`, `releaseSlug`, `artworkUrl` | Imbriqués : `song.release?.title`, `song.release?.slug`, `song.artwork` | Mapping corrigé dans `toShareableSong`. |
| C | `releaseTitle: string`, `releaseSlug: string` (non-null) | Une chanson peut être orpheline | `string | null`. RÈGLE RELEASE : carte et lien s'adaptent. |
| D | Pas de RÈGLE POCHETTE | `song.artwork` est `string | null` | `toShareableSong` retourne null si artwork absent. Pas de ShareButton sans visuel. |
| E | `resolveSongIndex` exportée (slug + id en repli) | Aucun appelant : deep link résout dans `songs` complet | Fonction supprimée de `deepLink.ts`. `findIndex` inline dans SongSwitcher. |
| F | `scrollToSlide(index)` | Fonction inexistante dans SongSwitcher | Remplacé par `carouselRef.current?.scrollToIndex(index)`. |
| G | Module sous `src/modules/share/` | Projet utilise `src/lib/modules/` | Créé sous `src/lib/modules/share/`. |
| H | Classes Tailwind arbitraires `text-[color:var(--…)]` | Projet utilise `text-muted`, `text-accent`, `ring-accent` | Remplacées par les utilitaires natifs. |
