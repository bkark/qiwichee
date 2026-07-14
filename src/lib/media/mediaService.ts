import type { MediaAsset } from './types';

// Components must never build provider URLs directly — go through here.
export function getEmbedUrl(asset: MediaAsset): string {
  switch (asset.provider) {
    case 'youtube':
      // privacy-enhanced embed; autoplay=1 is safe here because the iframe
      // mounts only after the user explicitly clicks the play button.
      return `https://www.youtube-nocookie.com/embed/${asset.assetId}?autoplay=1&rel=0`;
    case 'bandcamp': {
      // bgcol / linkcol are Bandcamp iframe URL params — third-party player colours,
      // NOT component styles. Values come from asset.embedOptions (set in releases data).
      // transparent=true lets the player bg show through; bgcol still affects some chrome.
      const bgcol  = asset.embedOptions?.bgcol  ?? 'f0f0f0';
      const linkcol = asset.embedOptions?.linkcol ?? '7A3B8C'; // fallback: prune
      return `https://bandcamp.com/EmbeddedPlayer/${asset.assetId}/size=large/bgcol=${bgcol}/linkcol=${linkcol}/tracklist=false/transparent=true/`;
    }
    default: {
      const _exhaustive: never = asset.provider;
      throw new Error(`Unknown provider: ${_exhaustive}`);
    }
  }
}
