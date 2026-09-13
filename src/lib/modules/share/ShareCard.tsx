'use client'

import type { ShareIdentity, ShareLabels, ShareableSong } from './types'
import { readShareCardTheme, type ShareCardTheme } from './tokens'

/** 4:5 — le format qui survit au recadrage Instagram feed et Stories. */
export const CARD_WIDTH = 1080
export const CARD_HEIGHT = 1350

const PAD = 84
const ART_SIZE = 840
const ART_RADIUS = 28
const WAVE_BARS = 56
// 60 px = hauteur garantie dans les deux cas (1 ou 2 lignes de titre).
// Le min() dans renderShareCard garde ce rôle de garde-fou.
const WAVE_HEIGHT = 60
const WAVE_GAP = 6
// Pochette centrée : elle n'occupe plus toute la largeur utile.
const artX = (CARD_WIDTH - ART_SIZE) / 2

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
  let h = 2166136261
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function decorativePattern(seed: string, count: number): number[] {
  let h = hash32(seed)
  const out: number[] = []
  for (let i = 0; i < count; i += 1) {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    h >>>= 0
    const raw = 0.2 + (h / 0xffffffff) * 0.8
    // Enveloppe : atténue les extrémités, ça se lit comme un extrait.
    const t = count === 1 ? 0.5 : i / (count - 1)
    out.push(raw * Math.sin(Math.PI * t) ** 0.45)
  }
  return out
}

/* ─────────────── primitives ─────────────── */

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    // Indispensable dès que la pochette part sur Supabase Storage : sans
    // en-tête CORS côté bucket, le canvas est « tainted » et toBlob() lève
    // une SecurityError. Sans effet tant que les fichiers sont dans public/.
    img.crossOrigin = 'anonymous'
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`share: pochette illisible (${src})`))
    img.src = src
  })
}

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath()
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r)
    return
  }
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let current = ''

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (ctx.measureText(candidate).width <= maxWidth || !current) {
      current = candidate
    } else {
      lines.push(current)
      current = word
      if (lines.length === maxLines) break
    }
  }
  if (lines.length < maxLines && current) lines.push(current)

  const last = lines[lines.length - 1]
  if (lines.length === maxLines && last && ctx.measureText(last).width > maxWidth) {
    let cut = last
    while (cut.length > 1 && ctx.measureText(`${cut}…`).width > maxWidth) {
      cut = cut.slice(0, -1)
    }
    lines[lines.length - 1] = `${cut}…`
  }
  return lines
}

/* ─────────────── rendu ─────────────── */

export interface RenderShareCardInput {
  song: ShareableSong
  identity: ShareIdentity
  labels: Pick<ShareLabels, 'cardReleaseKicker'>
  /** Diapo d'origine → hérite d'une palette [data-release] le jour venu. */
  themeScope?: Element | null
}

export async function renderShareCard(
  input: RenderShareCardInput,
): Promise<Blob> {
  const { song, identity, labels, themeScope } = input

  // Les fontes next/font se chargent en async : sans cette attente, la carte
  // se dessine dans la fonte de repli. Bug silencieux, image déjà partagée.
  if (document.fonts?.ready) await document.fonts.ready

  const theme: ShareCardTheme = readShareCardTheme(themeScope)
  const artwork = await loadImage(song.artworkUrl)

  const canvas = document.createElement('canvas')
  canvas.width = CARD_WIDTH
  canvas.height = CARD_HEIGHT
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('share: contexte 2d indisponible')

  ctx.fillStyle = theme.bg
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

  // Pochette, recadrée en carré depuis le centre.
  const side = Math.min(artwork.naturalWidth, artwork.naturalHeight)
  ctx.save()
  roundedRectPath(ctx, artX, PAD, ART_SIZE, ART_SIZE, ART_RADIUS)
  ctx.clip()
  ctx.drawImage(
    artwork,
    (artwork.naturalWidth - side) / 2,
    (artwork.naturalHeight - side) / 2,
    side,
    side,
    artX,
    PAD,
    ART_SIZE,
    ART_SIZE,
  )
  ctx.restore()

  let cursorY = PAD + ART_SIZE + 76

  ctx.fillStyle = theme.text
  ctx.textBaseline = 'alphabetic'
  ctx.textAlign = 'left'
  ctx.font = `700 62px ${theme.displayFamily}`
  for (const line of wrapText(ctx, song.title, ART_SIZE, 2)) {
    ctx.fillText(line, artX, cursorY)
    cursorY += 74
  }

  cursorY += 6
  ctx.fillStyle = theme.textMuted
  ctx.font = `400 30px ${theme.bodyFamily}`
  // RÈGLE RELEASE : si releaseTitle est null, la ligne de contexte affiche
  // uniquement identity.name.
  const context = song.releaseTitle
    ? `${labels.cardReleaseKicker} ${song.releaseTitle} · ${identity.name}`
    : identity.name
  ctx.fillText(wrapText(ctx, context, ART_SIZE, 1)[0] ?? '', artX, cursorY)

  // Motif décoratif — ancré sous cursorY, pas sous CARD_HEIGHT.
  // Texte et motif partagent le même système de coordonnées ; le
  // chevauchement est structurellement impossible quelle que soit la
  // longueur du titre.
  const footerY = CARD_HEIGHT - PAD
  // 24 = descente typique du corps 30 px (~8 px) + marge visuelle (16 px).
  // 28 = espace minimum entre le bas du motif et le baseline du pied.
  const waveTop = cursorY + 24
  const actualWaveHeight = Math.max(0, Math.min(WAVE_HEIGHT, footerY - 28 - waveTop))

  if (actualWaveHeight >= 16) {
    const barWidth = (ART_SIZE - WAVE_GAP * (WAVE_BARS - 1)) / WAVE_BARS
    ctx.fillStyle = theme.accent
    decorativePattern(song.slug, WAVE_BARS).forEach((value, i) => {
      const h = Math.max(actualWaveHeight * 0.05, value * actualWaveHeight)
      roundedRectPath(
        ctx,
        artX + i * (barWidth + WAVE_GAP),
        waveTop + (actualWaveHeight - h) / 2,
        barWidth,
        h,
        barWidth / 2,
      )
      ctx.fill()
    })
  }

  // Pied : domaine à gauche, signature plateforme à droite.
  ctx.font = `500 28px ${theme.bodyFamily}`
  ctx.fillStyle = theme.text
  ctx.fillText(identity.domain, artX, footerY)
  ctx.fillStyle = theme.textMuted
  ctx.textAlign = 'right'
  ctx.fillText(identity.platformWordmark, CARD_WIDTH - artX, footerY)
  ctx.textAlign = 'left'

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('share: toBlob a échoué'))),
      'image/png',
    )
  })
}
