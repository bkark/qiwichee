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
} as const

const FONT_TOKEN_NAMES = {
  display: '--font-bricolage',
  body: '--font-inter',
} as const

export interface ShareCardTheme {
  bg: string
  text: string
  textMuted: string
  accent: string
  displayFamily: string
  bodyFamily: string
}

/**
 * @param scope élément dont on lit les variables. Passer la diapo pour
 *              hériter d'une éventuelle palette [data-release].
 */
export function readShareCardTheme(scope?: Element | null): ShareCardTheme {
  const el = scope ?? document.documentElement
  const cs = getComputedStyle(el)
  const read = (name: string): string => cs.getPropertyValue(name).trim()

  const missing = Object.values(TOKEN_NAMES).filter((n) => !read(n))
  if (missing.length > 0) {
    throw new Error(`share: tokens absents de :root — ${missing.join(', ')}`)
  }

  return {
    bg: read(TOKEN_NAMES.bg),
    text: read(TOKEN_NAMES.text),
    textMuted: read(TOKEN_NAMES.textMuted),
    accent: read(TOKEN_NAMES.accent),
    // Repli sur les génériques CSS, jamais sur un nom de fonte en dur.
    displayFamily: read(FONT_TOKEN_NAMES.display) || 'sans-serif',
    bodyFamily: read(FONT_TOKEN_NAMES.body) || 'sans-serif',
  }
}
