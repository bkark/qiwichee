// Vue-modèle du partage. Volontairement DÉCOUPLÉ de catalogue/types.ts :
// le partage ne doit pas casser quand le catalogue gagne un champ.
// Le mapping se fait à UN seul endroit (SongSwitcher), pas ici.

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

/** Identité affichée. Générique : artiste, humoriste, conteur, cirque. */
export interface ShareIdentity {
  name: string
  /** Domaine affiché en pied de carte, sans schéma. Ex. "qiwichee.com". */
  domain: string
  /** Signature plateforme. Donnée, jamais écrite dans le composant. */
  platformWordmark: string
}

/**
 * Où pointe le lien partagé. AUCUNE valeur par défaut : rien en dur.
 * Cible actuelle : origin="https://qiwichee.com", path="/", hash="music"
 *   ⇒ https://qiwichee.com/?release=<slug>&song=<slug>#music
 */
export interface ShareDeepLinkConfig {
  origin: string
  /** Chemin de la page qui porte le carrousel. "/" aujourd'hui. */
  path: string
  /** Fragment, avec ou sans dièse. "music" aujourd'hui. */
  hash?: string
}

/** Toutes les chaînes visibles. Aucune n'est écrite dans les composants. */
export interface ShareLabels {
  /** Libellé visible — variante 'labelled' uniquement. */
  action: string
  /** aria-label, gabarit {title}. Seul texte lu en variante 'icon'. */
  actionAriaTemplate: string
  pending: string
  copied: string
  failed: string
  /** Titre passé à l'OS. Gabarit {title} / {name}. */
  shareTitleTemplate: string
  shareTextTemplate: string
  /** Mot imprimé sur la carte, au-dessus du titre de release. */
  cardReleaseKicker: string
}

export type ShareStatus = 'idle' | 'pending' | 'shared' | 'copied' | 'failed'

/** 'icon' dans les diapos (aucun texte visible) · 'labelled' ailleurs. */
export type ShareButtonVariant = 'icon' | 'labelled'
