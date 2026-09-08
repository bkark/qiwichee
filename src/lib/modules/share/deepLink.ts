import type { ShareDeepLinkConfig, ShareableSong } from './types'

export const SHARE_PARAM_RELEASE = 'release'
export const SHARE_PARAM_SONG = 'song'

/**
 * DÉCISION 2 : le lien émis porte TOUJOURS le slug.
 * Un UUID dans une URL partagée n'est lisible ni par un humain ni par un
 * crawler, et le slug sert déjà d'ancre. Le slug est l'identifiant unique
 * du catalogue — aucun UUID n'est ni stocké ni émis dans ShareableSong.
 * Si releaseSlug est null (chanson orpheline), le paramètre release est omis.
 */
export function buildSongDeepLink(
  song: ShareableSong,
  config: ShareDeepLinkConfig,
): string {
  const url = new URL(config.path, config.origin)
  if (song.releaseSlug) url.searchParams.set(SHARE_PARAM_RELEASE, song.releaseSlug)
  url.searchParams.set(SHARE_PARAM_SONG, song.slug)
  if (config.hash) url.hash = config.hash.replace(/^#/, '')
  return url.toString()
}

export interface IncomingSongLink {
  release: string | null
  /** Le slug est l'identifiant unique du catalogue. */
  song: string
}

export function readSongDeepLink(
  search: URLSearchParams,
): IncomingSongLink | null {
  const song = search.get(SHARE_PARAM_SONG)
  if (!song) return null
  return { release: search.get(SHARE_PARAM_RELEASE), song }
}

/** Substitution de gabarit — les libellés viennent des messages, pas du code. */
export function fillTemplate(
  template: string,
  values: Record<string, string>,
): string {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in values ? values[key] : whole,
  )
}
