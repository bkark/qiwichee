'use client'

import { useState } from 'react'
import Image, { type StaticImageData } from 'next/image'
import { getEmbedUrl } from '@/lib/media/mediaService'
import type { MediaAsset } from '@/lib/media/types'

interface EmbedPlayerProps {
  asset: MediaAsset
  poster?: StaticImageData | string
  posterAlt: string
  locked?: boolean
  lockedLabel?: string
  caption?: string
}

function PosterArea({
  poster,
  posterAlt,
  title,
}: {
  poster?: StaticImageData | string
  posterAlt: string
  title: string
}) {
  if (!poster) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-surface">
        <span className="px-6 text-center text-sm text-text">{title}</span>
      </div>
    )
  }
  return (
    <div className="absolute inset-0">
      <Image
        src={poster}
        alt={posterAlt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 48rem"
      />
    </div>
  )
}

export default function EmbedPlayer({
  asset,
  poster,
  posterAlt,
  locked = false,
  lockedLabel,
  caption,
}: EmbedPlayerProps) {
  const [playing, setPlaying] = useState(false)

  return (
    <figure className="w-full">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
        {playing && !locked ? (
          <iframe
            src={getEmbedUrl(asset)}
            title={asset.title}
            className="absolute inset-0 h-full w-full"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : locked ? (
          <>
            <PosterArea poster={poster} posterAlt={posterAlt} title={asset.title} />
            {lockedLabel && (
              <div className="absolute inset-x-0 bottom-0 p-4">
                <span className="rounded bg-accent px-3 py-1.5 text-sm font-medium text-accent-contrast">
                  {lockedLabel}
                </span>
              </div>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Lire : ${asset.title}`}
            className="group absolute inset-0 w-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            <PosterArea poster={poster} posterAlt={posterAlt} title={asset.title} />
            {/* Play glyph — decorative */}
            <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent opacity-90 shadow-lg transition-opacity group-hover:opacity-100">
                <svg
                  viewBox="0 0 24 24"
                  className="h-8 w-8 fill-accent-contrast"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-muted">{caption}</figcaption>
      )}
    </figure>
  )
}
