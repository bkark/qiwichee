'use client'

// =============================================================================
// src/app/components/CarouselLayout.tsx
//
// ★ MÉCANISME SEUL, AUCUNE LOGIQUE MÉTIER.
//   Il ne sait pas ce qu'est une chanson, une sortie ni un bloc de bio.
//   Il sait défiler, observer la diapo active, et rendre deux flèches.
//   SongSwitcher le consomme ; BioSwitcher le consommera (chantier séparé —
//   ★ NE PAS fusionner les deux switchers : un composant qui porte deux récits
//     finit par mal servir les deux).
//
// ⚠️ LES CLASSES S'APPELLENT `release-*` ET LE RÔLE EST GÉNÉRIQUE.
//   `.release-scroller` / `.release-slide` portent le scroll-snap et la largeur
//   88 %. Les renommer serait un chantier CSS gratuit qui casserait AUSSI
//   BioSwitcher, qui les partage déjà. Le nom ment, le comportement est bon.
//
// ⚠️ TEXTE EN PROPS, PAS EN DUR.
//   Les libellés arrivent de l'appelant. Le composant reste pur et traduisible :
//   à l'étape 3b ils viendront de fr.json sans toucher ce fichier.
// =============================================================================

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
  type ReactNode,
  type Ref,
} from 'react'

export interface CarouselItem {
  /** Identifiant stable. Sert de clé React et d'ancre (id du slide). */
  key: string
  /** Attributs posés sur le slide — p. ex. data-release pour la recoloration. */
  slideAttrs?: Record<string, string>
  /** Libellé lu par les technologies d'assistance pour ce slide. */
  label: string
  content: ReactNode
}

export interface CarouselHandle {
  scrollToIndex: (index: number) => void
}

interface CarouselLayoutProps {
  items: CarouselItem[]
  /** Nom du carrousel pour les lecteurs d'écran (ex. « Chansons »). */
  ariaLabel: string
  labels: {
    /** Rôle annoncé : « carrousel ». */
    roleDescription: string
    prev: string
    next: string
  }
  /**
   * ★ RÉSOLUTION DU POINT DE DÉPART, CÔTÉ APPELANT.
   *   Appelé UNE FOIS après le montage. C'est là que vit la hiérarchie
   *   ancre > featured > aléatoire — décision MÉTIER, pas de mise en page.
   *   Retourner null laisse le carrousel sur la première diapo.
   *
   *   ★ POURQUOI APRÈS LE MONTAGE : `location.hash` n'existe pas au SSR, et
   *     Math.random() rendrait le HTML serveur différent du client. L'ORDRE DOM
   *     RESTE CANONIQUE ET FIXE ; seule la POSITION DE DÉFILEMENT varie.
   */
  resolveInitialIndex?: () => number | null
  onActiveChange?: (index: number) => void
  controlsRef?: Ref<CarouselHandle>
}

export default function CarouselLayout({
  items,
  ariaLabel,
  labels,
  resolveInitialIndex,
  onActiveChange,
  controlsRef,
}: CarouselLayoutProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const scrollTo = useCallback(
    (index: number, behavior: ScrollBehavior) => {
      if (index < 0 || index >= items.length) return
      const el = scrollerRef.current
      if (!el) return
      const slides = el.querySelectorAll<HTMLElement>('[data-carousel-slide]')
      const target = slides[index]
      if (!target) return
      const left = target.offsetLeft - (el.clientWidth - target.clientWidth) / 2
      el.scrollTo({ left: Math.max(0, left), behavior })
    },
    [items.length],
  )

  const scrollToIndex = useCallback(
    (index: number) => scrollTo(index, 'smooth'),
    [scrollTo],
  )

  useImperativeHandle(controlsRef, () => ({ scrollToIndex }), [scrollToIndex])

  // Position initiale. `behavior:'instant'` respecte prefers-reduced-motion :
  // il n'y a pas d'animation à réduire.
  useEffect(() => {
    if (!resolveInitialIndex) return
    const index = resolveInitialIndex()
    if (index === null || index < 0) return
    scrollTo(index, 'instant')
        // ★ setState au montage UNIQUEMENT : cet effet a [] en dépendances, il ne
    //   peut pas cascader. Le calcul DOIT être après montage (location.hash
    //   n'existe pas au SSR). Suppression délibérée, pas un oubli.
        // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveIndex(index)
    onActiveChange?.(index)
    // Volontairement au montage seulement : rejouer ce calcul déplacerait le
    // visiteur pendant qu'il navigue.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Un seul observer, deux consommateurs : l'état actif (flèches, liste) et
  // aria-current côté appelant.
  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const slides = Array.from(
      el.querySelectorAll<HTMLElement>('[data-carousel-slide]'),
    )
    const observer = new IntersectionObserver(
      (entries) => {
        // ★ CHOISIR LA PLUS VISIBLE, PAS LA PREMIÈRE À FRANCHIR LE SEUIL.
        //   Slides à 88 % + seuil unique : deux diapos peuvent dépasser le seuil
        //   en même temps pendant le défilement. Prendre la première rendait
        //   DEUX entrées actives dans la liste de titres.
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!best) return
        const idx = slides.indexOf(best.target as HTMLElement)
        if (idx === -1) return
        setActiveIndex(idx)
        onActiveChange?.(idx)
      },
            { root: el, threshold: [0.5, 0.75, 1] },
    )
    slides.forEach((slide) => observer.observe(slide))
    return () => observer.disconnect()
  }, [items, onActiveChange])

  return (
    <div className="relative w-full max-w-full min-w-0 overflow-hidden">
      <div
        ref={scrollerRef}
        role="group"
        aria-roledescription={labels.roleDescription}
        aria-label={ariaLabel}
        tabIndex={0}
        className="release-scroller flex overflow-x-auto gap-4 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
                {items.map((item) => (
          <div
            key={item.key}
            id={item.key}
            data-carousel-slide=""
            {...item.slideAttrs}
            role="group"
            aria-label={item.label}
            className="release-slide flex flex-col gap-4 pb-4"
          >
            {item.content}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scrollToIndex(activeIndex - 1)}
        disabled={activeIndex === 0}
        aria-label={labels.prev}
        className="carousel-arrow carousel-arrow--prev"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <polyline points="15,18 9,12 15,6" />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => scrollToIndex(activeIndex + 1)}
        disabled={activeIndex === items.length - 1}
        aria-label={labels.next}
        className="carousel-arrow carousel-arrow--next"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <polyline points="9,18 15,12 9,6" />
        </svg>
      </button>
    </div>
  )
}
