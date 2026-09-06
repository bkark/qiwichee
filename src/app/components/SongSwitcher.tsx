'use client'

// =============================================================================
// src/app/components/SongSwitcher.tsx
//
// ★★ POURQUOI UNE DIAPO PAR CHANSON.
//   Hybrid Fruit était UNE diapo et les gens écoutaient la piste 1. Six diapos
//   = six occasions d'être découverte. Ce n'est pas de l'habillage, c'est un
//   autre modèle de données — d'où la table `songs`.
//
// ★★ DEUX PARCOURS, ET UN SEUL EXISTAIT.
//   1. DÉCOUVERTE — une chanson à la fois, flèches. Le carrousel le fait bien.
//   2. ACCÈS DIRECT — quelqu'un veut « Une dernière chose ». Faire défiler
//      jusqu'à elle n'est pas un accès, c'est un labyrinthe.
//   ⇒ LA LISTE DE TITRES SOUS LE CARROUSEL couvre le second. Elle remplace les
//     pastilles, qui ne passent pas à 9, et donne au passage des titres lisibles
//     par un crawler + une vue d'ensemble du catalogue.
//
// ★ COMPOSANT PUR : tout arrive en props. Aucun appel Supabase, aucune
//   constante d'artiste, aucun texte en dur hors `copy` (qui part en 3b).
// =============================================================================

import { useRef, useState, useCallback } from 'react'
import EmbedPlayer from './EmbedPlayer'
import CarouselLayout, { type CarouselHandle, type CarouselItem } from './CarouselLayout'
import type { Song } from '@/lib/modules/catalogue/types'

// ── Copie ────────────────────────────────────────────────────────────────────
// ★ UN SEUL OBJET PLAT EN HAUT DU COMPOSANT, clés anglaises, valeurs françaises.
//   Forme déjà appliquée dans ContactForm et SiteFooter : à l'étape 3b, ça se
//   déplace dans fr.json par copier-coller.
// ★ `releaseType` traduit un ÉNUMÉRÉ DE PLATEFORME — une fois pour TOUS les
//   artistes. C'est la moitié A de « Single — clip officiel ».
const copy = {
  carouselLabel: 'Chansons',
  roleDescription: 'carrousel',
  prev: 'Chanson précédente',
  next: 'Chanson suivante',
  trackListLabel: 'Toutes les chansons',
  slideOf: (title: string, i: number, n: number) => `${title}, ${i} sur ${n}`,
  goTo: (title: string) => `Aller à ${title}`,
  releaseType: { album: 'Album', ep: 'EP', single: 'Single' } as const,
}

interface SongSwitcherProps {
  songs: Song[]
  /** Slug de la chanson mise en avant. Null = pas de choix éditorial. */
  featuredSlug: string | null
}

export default function SongSwitcher({ songs, featuredSlug }: SongSwitcherProps) {
  const carouselRef = useRef<CarouselHandle>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  // Un seul lecteur vivant à la fois : null = aucune iframe montée.
  const [activeEmbedSlug, setActiveEmbedSlug] = useState<string | null>(null)

  const handleDeactivate = useCallback(() => setActiveEmbedSlug(null), [])

  /**
   * ★★ HIÉRARCHIE DE DÉMARRAGE : ancre > featured > aléatoire.
   *   Une règle, pas une condition à retenir : si quelqu'un arrive par
   *   /#flatline, il veut Flatline — l'aléatoire serait une trahison.
   *   Sinon le choix éditorial de l'artiste. Sinon la découverte.
   *
   *   Appelé APRÈS le montage par CarouselLayout : `location.hash` n'existe
   *   pas au SSR et Math.random() casserait l'hydratation.
   */
  const resolveInitialIndex = useCallback((): number | null => {
  const hash = window.location.hash.replace(/^#/, '')
    if (hash) {
      const i = songs.findIndex((s) => s.slug === hash)
      if (i !== -1) {
        // ★ LE NAVIGATEUR A DÉJÀ RENONCÉ À DÉFILER.
        //   Il cherche l'ancre au chargement initial, AVANT que React n'ait
        //   monté les diapos : #flatline n'existait pas encore dans le DOM.
        //   Le carrousel s'ouvre au bon endroit mais la page reste en haut.
        //   ⇒ on refait le défilement nous-mêmes, une fois monté.
        requestAnimationFrame(() => {
                    const el = document.getElementById(hash)
          if (!el) return
          // ★ `block:'center'` ne connaît pas le header sticky : il centre la
          //   diapo dans la fenêtre et son titre passe dessous. On aligne en
          //   HAUT, moins la hauteur du header.
          // ⚠️ COUPLÉ À `py-2` DANS SiteNav. Si la nav change de hauteur,
          //    cette valeur ET les `scroll-mt-*` de page.tsx doivent suivre.
          const HEADER_OFFSET = 56
          const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
          window.scrollTo({ top, behavior: 'instant' })
        })
        return i
      }
    }
    if (featuredSlug) {
      const i = songs.findIndex((s) => s.slug === featuredSlug)
      if (i !== -1) return i
    }
    return Math.floor(Math.random() * songs.length)
  }, [songs, featuredSlug])

  const items: CarouselItem[] = songs.map((song, idx) => ({
    key: song.slug,
    // ★ data-release = slug de la SORTIE. Les règles de recoloration sont
    //   écrites à ce niveau ; y mettre le slug de chanson ferait échouer la
    //   recoloration EN SILENCE.
    slideAttrs: song.paletteKey ? { 'data-release': song.paletteKey } : undefined,
    label: copy.slideOf(song.title, idx + 1, songs.length),
    content: (
      <>
        <div>
          <h3 className="font-display text-xl font-semibold tracking-tight text-text">
            {song.title}
          </h3>
          {/* ★ GABARIT DE CHROME, PAS UNE CHAÎNE D'ARTISTE :
              « Hybrid Fruit · Album ». Traduit une fois, marche pour tout
              artiste. Le descriptor d'artiste, s'il existe, passe devant. */}
          {song.descriptor ? (
            <p className="mt-1 text-sm text-muted">{song.descriptor}</p>
          ) : song.release ? (
            <p className="mt-1 text-sm text-muted">
              {song.release.title} · {copy.releaseType[song.release.type]}
            </p>
          ) : (
            <p className="mt-1 text-sm invisible" aria-hidden="true">{' '}</p>
          )}
        </div>

        {song.media ? (
          <EmbedPlayer
            asset={song.media}
            poster={song.artwork ?? undefined}
            posterAlt={song.artworkAlt ?? song.title}
            isActive={activeEmbedSlug === song.slug}
            onActivate={() => setActiveEmbedSlug(song.slug)}
            onDeactivate={handleDeactivate}
          />
        ) : null}

        {song.credits.length > 0 && (
          <ul className="text-xs text-muted">
            {song.credits.map((credit) => (
              <li key={`${credit.role}-${credit.name}`}>
                {credit.role} : {credit.name}
              </li>
            ))}
          </ul>
        )}
      </>
    ),
  }))

  return (
    <>
      <CarouselLayout
        items={items}
        ariaLabel={copy.carouselLabel}
        labels={{
          roleDescription: copy.roleDescription,
          prev: copy.prev,
          next: copy.next,
        }}
        resolveInitialIndex={resolveInitialIndex}
        onActiveChange={setActiveIndex}
        controlsRef={carouselRef}
      />

      {/* ── LISTE DE TITRES — l'ACCÈS DIRECT ──────────────────────────────────
          Sous le carrousel (mobile-first). Des <button>, pas des <a> : on
          déplace le carrousel, on ne change pas de page. Les ancres /#slug
          restent servies par l'id posé sur chaque diapo. */}
      <nav aria-label={copy.trackListLabel} className="mt-6">
        <ul className="flex flex-col">
          {songs.map((song, idx) => (
            <li key={song.slug}>
              <button
                type="button"
                onClick={() => carouselRef.current?.scrollToIndex(idx)}
                aria-label={copy.goTo(song.title)}
                aria-current={activeIndex === idx ? 'true' : undefined}
                className={`flex w-full items-baseline gap-3 rounded-sm px-2 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                  activeIndex === idx ? 'text-accent' : 'text-text hover:text-accent'
                }`}
              >
                <span className="w-6 shrink-0 text-xs tabular-nums text-muted">
                  {song.trackNo ?? ''}
                </span>
                <span className="font-medium">{song.title}</span>
                {song.release && (
                  <span className="ml-auto shrink-0 text-xs text-muted">
                    {song.release.title}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
