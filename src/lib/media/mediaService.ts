import type { MediaAsset } from './types';

// Components must never build provider URLs directly — go through here.
export function getEmbedUrl(asset: MediaAsset): string {
  switch (asset.provider) {
    case 'youtube':
      // privacy-enhanced embed; autoplay=1 is safe here because the iframe
      // mounts only after the user explicitly clicks the play button.
      return `https://www.youtube-nocookie.com/embed/${asset.assetId}?autoplay=1&rel=0`;
    case 'bandcamp':
      throw new Error('bandcamp embed not implemented yet');
    default: {
      const _exhaustive: never = asset.provider;
      throw new Error(`Unknown provider: ${_exhaustive}`);
    }
  }
}
