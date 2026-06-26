export type MediaProvider = 'youtube' | 'bandcamp'; // extend later
export type MediaType = 'video' | 'audio' | 'livestream';

export interface MediaAsset {
  provider: MediaProvider;
  assetId: string;   // youtube video id, e.g. 'L0mHWXa2UyQ'
  type: MediaType;
  title: string;     // used for the iframe title + a11y label — REQUIRED
}
