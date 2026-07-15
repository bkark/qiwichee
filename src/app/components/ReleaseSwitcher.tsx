'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import EmbedPlayer from './EmbedPlayer'
import ExternalLink from './ExternalLink'
import BrandIcon, { type BrandName } from './BrandIcon'
import { releases } from '@/data/releases'

interface ArtistLink {
  name: string
  href: string
}

interface ReleaseSwitcherProps {
  artistLinks: ArtistLink[]
}

const nameToIcon: Record<string, BrandName> = {
  'Spotify':     'spotify',
  'Apple Music': 'applemusic',
  'Deezer':      'deezer',
  'YouTube':     'youtube',
  'Bandcamp':    'bandcamp',
  'Instagram':   'instagram',
}

export default function ReleaseSwitcher({ artistLinks }: ReleaseSwitcherProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  // Single active player: null = no embed playing.
  const [activeEmbedSlug, setActiveEmbedSlug] = useState<string | null>(null)

  const handleDeactivate = useCallback(() => setActiveEmbedSlug(null), [])

  // Hydration-safe random: DOM order is FIXED (canonical). Randomisation is ONLY
  // a scroll position applied after mount — SSR output is always deterministic.
  // behavior:'instant' is prefers-reduced-motion safe (no animation).
  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const randomIndex = Math.floor(Math.random() * releases.length)
    const slides = el.querySelectorAll<HTMLElement>('[data-release]')
    const target = slides[randomIndex]
    if (!target) return
    const left = target.offsetLeft - (el.clientWidth - target.clientWidth) / 2
    el.scrollTo({ left: Math.max(0, left), behavior: 'instant' })
    setActiveIndex(randomIndex)
  }, [])

  // One IntersectionObserver, two consumers: activeIndex state (dots + arrows) + aria-current.
  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const slides = Array.from(el.querySelectorAll<HTMLElement>('[data-release]'))
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = slides.indexOf(entry.target as HTMLElement)
            if (idx !== -1) setActiveIndex(idx)
          }
        }
      },
      { root: el, threshold: 0.6 },
    )
    slides.forEach((slide) => observer.observe(slide))
    return () => observer.disconnect()
  }, [])

  const scrollToSlide = useCallback((index: number) => {
    if (index < 0 || index >= releases.length) return
    const el = scrollerRef.current
    if (!el) return
    const slides = el.querySelectorAll<HTMLElement>('[data-release]')
    const target = slides[index]
    if (!target) return
    const left = target.offsetLeft - (el.clientWidth - target.clientWidth) / 2
    el.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
  }, [])

  return (
    <section aria-label="Musique — parcourir les sorties" className="mt-6">
      {/* Relative wrapper lets arrow buttons be absolutely positioned over carousel edges */}
      <div className="relative">
        {/* Scroll-snap container — tabIndex=0 enables arrow-key scrolling */}
        <div
          ref={scrollerRef}
          role="group"
          aria-roledescription="carrousel"
          aria-label="Sorties"
          tabIndex={0}
          className="release-scroller flex overflow-x-auto gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-sm"
        >
          {releases.map((release, idx) => (
            <div
              key={release.slug}
              data-release={release.slug}
              role="group"
              aria-label={`${release.title}, ${idx + 1} sur ${releases.length}`}
              className="release-slide flex flex-col gap-4 pb-4"
            >
              {/* Title block — invisible date placeholder keeps all cards top-aligned
                  when a release has no date (e.g. Lullabies). */}
              <div>
                <h3 className="font-display text-xl font-semibold tracking-tight text-text">
                  {release.title}
                </h3>
                <p className="mt-1 text-sm text-muted">{release.descriptor}</p>
                {release.date
                  ? <p className="text-xs text-muted">{release.date}</p>
                  : <p className="text-xs invisible" aria-hidden="true">{' '}</p>
                }
              </div>

              {/* Artwork poster + lazy embed — controlled mode: only one iframe live at a time */}
              <EmbedPlayer
                asset={release.embed}
                poster={release.artworkSrc}
                posterAlt={release.artworkAlt}
                isActive={activeEmbedSlug === release.slug}
                onActivate={() => setActiveEmbedSlug(release.slug)}
                onDeactivate={handleDeactivate}
              />

              {/* "Aussi sur →" — verified artist.links only (brief §5) */}
              <div>
                <p className="mb-2 text-xs font-medium text-muted">Aussi sur →</p>
                <ul className="flex flex-wrap gap-1">
                  {artistLinks.map(({ name, href }) => (
                    <li key={name}>
                      <ExternalLink
                        href={href}
                        aria-label={`${release.title} sur ${name}, nouvel onglet`}
                        showArrow={false}
                        className="flex items-center justify-center rounded-md p-2.5 text-muted transition-colors duration-200 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                      >
                        <BrandIcon name={nameToIcon[name]} />
                      </ExternalLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Prev / Next arrow buttons — hidden on touch (pointer:coarse), shown on pointer:fine.
            CSS handles visibility; no JS touch-sniffing. Disabled at hard ends (no wrap). */}
        <button
          type="button"
          onClick={() => scrollToSlide(activeIndex - 1)}
          disabled={activeIndex === 0}
          aria-label="Sortie précédente"
          className="carousel-arrow carousel-arrow--prev"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <polyline points="15,18 9,12 15,6" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => scrollToSlide(activeIndex + 1)}
          disabled={activeIndex === releases.length - 1}
          aria-label="Sortie suivante"
          className="carousel-arrow carousel-arrow--next"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <polyline points="9,18 15,12 9,6" />
          </svg>
        </button>
      </div>

      {/* Dot indicators — buttons, not divs; ≥44 px tap targets (WCAG 2.5.5) */}
      <div
        role="group"
        aria-label="Navigation par sortie"
        className="mt-4 flex justify-center gap-2"
      >
        {releases.map((release, idx) => (
          <button
            key={release.slug}
            type="button"
            onClick={() => scrollToSlide(idx)}
            aria-label={`Aller à ${release.title}`}
            aria-current={activeIndex === idx ? 'true' : undefined}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-sm"
          >
            <span
              aria-hidden="true"
              className={`block h-2 w-2 rounded-full transition-colors duration-200 ${
                activeIndex === idx ? 'bg-accent' : 'bg-muted opacity-40'
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  )
}
