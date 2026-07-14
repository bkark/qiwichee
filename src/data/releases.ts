import type { MediaAsset } from '@/lib/media/types'

export interface Release {
  slug: string
  title: string
  descriptor: string
  date?: string
  embed: MediaAsset
  artworkSrc: string
  artworkAlt: string
}

// Canonical DOM order: newest first, FIXED — never randomise here (see HYDRATION TRAP in brief).
// Randomisation is a client-side scroll position applied in ReleaseSwitcher after mount.
export const releases: Release[] = [
  // 1 — Lullabies: site default palette, no [data-release] accent override (brief §4).
  {
    slug: 'lullabies',
    title: 'Lullabies',
    descriptor: 'Single — clip officiel',
    embed: {
      provider: 'youtube',
      assetId: 'L0mHWXa2UyQ',
      type: 'video',
      title: 'Qiwi Chee — Lullabies (clip officiel)',
    },
    artworkSrc: '/lullabies-cover.jpg',
    // ⚠️ PLACEHOLDER — 16:9 YouTube screenshot. Square cover art pending WhatsApp ask.
    artworkAlt: 'Qiwi Chee — Lullabies, visuel provisoire',
  },

  // 2 — Hybrid Fruit
  {
    slug: 'hybrid-fruit',
    title: 'Hybrid Fruit',
    descriptor: 'Album · 6 titres',
    date: '27 oct 2024',
    embed: {
      provider: 'bandcamp',
      assetId: 'album=2331494883',
      type: 'audio',
      title: 'Hybrid Fruit — Qiwi Chee (album complet)',
      // bgcol/linkcol: Bandcamp iframe URL params — third-party player colours, NOT component
      // styles. The one hex exception outside globals.css (brief §1).
      // bgcol = --bg token value (#E8EBF5); linkcol = --accent PLACEHOLDER (pending approval).
      embedOptions: { bgcol: 'E8EBF5', linkcol: 'C2185B' },
    },
    artworkSrc: '/hybrid-fruit-cover.jpg',
    // ⚠️ PLACEHOLDER — Bandcamp 350 px thumbnail. High-res source file pending WhatsApp ask.
    artworkAlt: 'Hybrid Fruit — pochette de l\'album (visuel provisoire)',
  },

  // 3 — Une dernière chose
  {
    slug: 'une-derniere-chose',
    title: 'Une dernière chose',
    descriptor: 'Single',
    date: '31 mars 2023',
    embed: {
      provider: 'bandcamp',
      assetId: 'track=2132072682',
      type: 'audio',
      title: 'Une dernière chose — Qiwi Chee',
      embedOptions: { bgcol: 'E8EBF5', linkcol: '1C6E8C' },
    },
    artworkSrc: '/une-derniere-chose-cover.jpg',
    artworkAlt: 'Une dernière chose — photo artistique de Qiwi Chee',
  },

  // 4 — Dilemma (LEILANI era — same MusicGroup, former name; brief §2)
  {
    slug: 'dilemma',
    title: 'Dilemma',
    // ⚠️ Wording pending Qiwi Chee confirmation (brief §2).
    descriptor: 'Album — sorti sous le nom LEILANI',
    embed: {
      provider: 'bandcamp',
      // Bandcamp IDs are globally unique; leilanigroove.bandcamp.com album embeds
      // via the same bandcamp.com/EmbeddedPlayer/ endpoint.
      assetId: 'album=2503435136',
      type: 'audio',
      title: 'Dilemma — LEILANI',
      embedOptions: { bgcol: 'E8EBF5', linkcol: '9E1B32' },
    },
    artworkSrc: '/dilemma-cover.jpg',
    artworkAlt: 'Dilemma — pochette de l\'album, sorti sous le nom LEILANI',
  },
]
