// =============================================================================
// src/lib/modules/catalogue/types.ts
//
// ★ TYPES MÉTIER, PAS LA FORME DU RPC.
//   get_songs rend 21 colonnes plates. Ces types-là sont ce que les composants
//   consomment. Le mapping dans client.ts absorbe la différence — c'est ce qui
//   permet d'ajouter ou renommer une colonne SANS toucher un seul composant.
//
// ★ « artiste » = ENTITÉ GÉNÉRIQUE (contrat d'architecture). Rien ici ne suppose
//   un musicien : un humoriste a des « sorties » et des « pièces » de la même façon.
// =============================================================================

import type { MediaAsset } from '@/lib/media/types'

export interface Credit {
  role: string
  name: string
}

/** La sortie (album / EP / single) à laquelle une chanson appartient. */
export interface SongRelease {
  slug: string
  title: string
  /** Énuméré de PLATEFORME — se traduit une fois pour tous les artistes. */
  type: 'album' | 'ep' | 'single'
  /** Copie d'ARTISTE, par langue. Ex. « clip officiel ». Peut être absent. */
  descriptor: string | null
  releasedOn: string | null
  buyUrl: string | null
}

export interface Song {
  slug: string
  title: string
  /** Copie d'artiste par chanson. Rarement rempli — le chrome prend le relais. */
  descriptor: string | null
  credits: Credit[]
  /** Point d'entrée éditorial du carrousel. Une seule chanson par artiste. */
  isFeatured: boolean
  trackNo: number | null

  /** La sortie de rattachement. Null si la chanson est orpheline. */
  release: SongRelease | null

  /**
   * ★ data-release PORTE LE SLUG DE LA SORTIE, PAS DE LA CHANSON.
   *   Les règles de recoloration dans globals.css sont écrites au niveau
   *   release ([data-release="hybrid-fruit"]). Six diapos de Hybrid Fruit
   *   partagent donc une palette — voulu. Mettre le slug de chanson ici
   *   ferait échouer la recoloration EN SILENCE.
   */
  paletteKey: string | null

  /** Prêt à passer à EmbedPlayer. Null = pochette seule, aucune lecture. */
  media: MediaAsset | null

  /**
   * Fichier auto-hébergé. N'est rendu par le RPC QUE si rights_stream_confirmed.
   * ⚠️ Aucun lecteur ne le consomme aujourd'hui — prévu, pas branché.
   */
  audioUrl: string | null

  artwork: string | null
  artworkAlt: string | null
}

export interface Catalogue {
  artistName: string
  songs: Song[]
  /** Langue réellement servie après repli. Utile au débogage et à hreflang. */
  resolvedLocale: string | null
}
