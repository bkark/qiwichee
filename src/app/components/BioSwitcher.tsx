'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'

export interface BioBlock {
  slug: string
  sort_order: number
  title: string
  body: string
  image_path: string
  image_hd_path?: string | null
  image_alt: string
  credits: Array<{ role: string; name: string }>
}

interface BioSwitcherProps {
  blocks: BioBlock[]
}

export default function BioSwitcher({ blocks }: BioSwitcherProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const slides = Array.from(el.querySelectorAll<HTMLElement>('[data-bio]'))
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
    if (index < 0 || index >= blocks.length) return
    const el = scrollerRef.current
    if (!el) return
    const slides = el.querySelectorAll<HTMLElement>('[data-bio]')
    const target = slides[index]
    if (!target) return
    const left = target.offsetLeft - (el.clientWidth - target.clientWidth) / 2
    el.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
  }, [blocks.length])

  return (
    <section aria-label="Bio — parcourir les blocs" className="mt-4">
      <div className="relative w-full max-w-full min-w-0 overflow-hidden">
        <div
          ref={scrollerRef}
          role="group"
          aria-roledescription="carrousel"
          aria-label="Biographie"
          tabIndex={0}
          className="bio-scroller flex overflow-x-auto gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-sm"
        >
          {blocks.map((block, idx) => (
            <div
              key={block.slug}
              data-bio={block.slug}
              role="group"
              aria-label={`${block.title}, ${idx + 1} sur ${blocks.length}`}
              className="bio-slide flex flex-col gap-3 pb-2"
            >
              <h3 className="font-display text-xl font-semibold tracking-tight text-text">
                {block.title}
              </h3>

              <div className="relative w-full h-[clamp(160px,30vh,300px)] rounded-sm">
                <Image
                  src={block.image_path}
                  alt={block.image_alt}
                  fill
                  className="object-contain object-left"
                  sizes="(min-width: 768px) 676px, 88vw"
                  priority={idx === 0}
                />
              </div>

              {block.credits.length > 0 && (
                <p className="text-xs text-muted">
                  {block.credits
                    .map((c) => `${c.role.charAt(0).toUpperCase() + c.role.slice(1)} : ${c.name}`)
                    .join(' · ')}
                </p>
              )}

              <p className="text-muted">{block.body}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollToSlide(activeIndex - 1)}
          disabled={activeIndex === 0}
          aria-label="Bloc précédent"
          className="carousel-arrow carousel-arrow--prev"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <polyline points="15,18 9,12 15,6" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => scrollToSlide(activeIndex + 1)}
          disabled={activeIndex === blocks.length - 1}
          aria-label="Bloc suivant"
          className="carousel-arrow carousel-arrow--next"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <polyline points="9,18 15,12 9,6" />
          </svg>
        </button>
      </div>

      <div
        role="group"
        aria-label="Navigation par bloc"
        className="mt-2 flex justify-center gap-2"
      >
        {blocks.map((block, idx) => (
          <button
            key={block.slug}
            type="button"
            onClick={() => scrollToSlide(idx)}
            aria-label={`Aller à ${block.title}`}
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
