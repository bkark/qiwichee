export type MediaProvider = 'youtube' | 'bandcamp'; // extend later
export type MediaType = 'video' | 'audio' | 'livestream';

export interface MediaAsset {
  provider: MediaProvider;
  assetId: string;   // youtube video id OR bandcamp 'album=ID' / 'track=ID'
  type: MediaType;
  title: string;     // used for the iframe title + a11y label — REQUIRED
  // Provider-specific embed URL params. Currently used by Bandcamp (bgcol/linkcol).
  // These are third-party player params, NOT component styles — see mediaService.ts.
  embedOptions?: { bgcol?: string; linkcol?: string };
}
