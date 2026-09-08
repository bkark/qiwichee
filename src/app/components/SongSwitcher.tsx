'use client'

// =============================================================================
// src/app/components/SongSwitcher.tsx
//
// ★★ TROIS ZONES, TROIS RÔLES — et c'est ce qui tient à 200 chansons.
//   1. LE CARROUSEL est purement VISUEL : pochette + lecteur, rien d'autre.
//      Le texte en sortait de toute façon coupé sous l'en-tête collant.
//   2. LE BLOC ÉPINGLÉ porte TOUT le texte de la chanson active : titre,
//      sortie, année, crédits — et les paroles plus tard. Il ne bouge pas,
//      il ne défile pas hors de vue, et il grandit sans casser la mise en page.
//   3. LA LISTE ne sert qu'à NAVIGUER. Elle peut faire 9 ou 200 lignes.
//
//   ⇒ Le problème résolu : en dessous du carrousel, le surlignage descendait
//     hors de l'écran dès la 6ᵉ chanson. Au-dessus, la liste repoussait le
//     contenu trop bas. Le bloc épinglé rend la question caduque — la chanson
//     active a sa place à elle, quelle que soit la longueur de la liste.
//
// ★ LA CHANSON ACTIVE RESTE DANS LA LISTE, fortement marquée.
//   La retirer créerait un trou mouvant : les lignes se réordonnent à chaque
//   changement et l'œil perd son repère. Une liste stable vaut mieux qu'une
//   liste sans doublon.
//
// ★ SCROLL INTERNE EN DESKTOP UNIQUEMENT.
//   Un cadre défilant dans une page défilante, sur mobile, c'est deux zones
//   qui se disputent le doigt : on veut descendre dans la page, la liste bouge.
//   À la souris le problème n'existe pas. ⇒ md:max-h + md:overflow-y-auto.
//   (Même arbitrage que les largeurs de diapo : la largeur décide.)
//
// ★ AUCUN DÉFILEMENT AUTOMATIQUE. La page ne bouge jamais sous les pieds de
//   quelqu'un qui explore le carrousel. Le repère visuel est le bloc épinglé,
//   pas une liste qui se recale toute seule.
//
// ★ COMPOSANT PUR : tout arrive en props. Aucun appel Supabase, aucune
//   constante d'artiste, aucun texte en dur hors `copy` (qui part en 3b).
// =============================================================================

import { useRef, useState, useCallback, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import EmbedPlayer from './EmbedPlayer'
import ShareButton from '@/lib/modules/share/ShareButton'
import CarouselLayout, { type CarouselHandle, type CarouselItem } from './CarouselLayout'
import type { Song } from '@/lib/modules/catalogue/types'
import type {
  ShareableSong,
  ShareIdentity,
  ShareLabels,
  ShareDeepLinkConfig,
} from '@/lib/modules/share/types'
import { useShareSong } from '@/lib/modules/share/useShareSong'
import { readSongDeepLink } from '@/lib/modules/share/deepLink'

// ── Mapping catalogue → share ─────────────────────────────────────────────────
// ⚠️ SEUL POINT DE COUPLAGE entre catalogue/types.ts et share/types.ts.
//    Retourne null si song.artwork est absent (RÈGLE POCHETTE : une carte
//    sans visuel ne doit pas circuler).
function toShareableSong(song: Song): ShareableSong | null {
  if (!song.artwork) return null
  return {
    slug: song.slug,
    title: song.title,
    releaseTitle: song.release?.title ?? null,   // null = chanson orpheline
    releaseSlug: song.release?.slug ?? null,     // null = pas de paramètre release dans le lien
    artworkUrl: song.artwork,
    artworkAlt: song.artworkAlt,
  }
}

// ── Copie ────────────────────────────────────────────────────────────────────
// ★ UN SEUL OBJET PLAT, clés anglaises, valeurs françaises. Forme déjà appliquée
//   dans ContactForm et SiteFooter : à l'étape 3b, ça se déplace dans fr.json
//   par copier-coller.
// ★ `releaseType` traduit un ÉNUMÉRÉ DE PLATEFORME — une fois pour TOUS les
//   artistes, jamais par artiste.
const copy = {
  carouselLabel: 'Chansons',
  roleDescription: 'carrousel',
  prev: 'Chanson précédente',
  next: 'Chanson suivante',
  trackListLabel: 'Toutes les chansons',
  nowShowing: 'Chanson affichée',
  creditsLabel: 'Crédits',
  slideOf: (title: string, i: number, n: number) => `${title}, ${i} sur ${n}`,
  goTo: (title: string) => `Aller à ${title}`,
  releaseType: { album: 'Album', ep: 'EP', single: 'Single' } as const,
}

interface SongSwitcherProps {
  songs: Song[]
  /** Slug de la chanson mise en avant. Null = pas de choix éditorial. */
  featuredSlug: string | null
  shareIdentity: ShareIdentity
  shareLabels: ShareLabels
  shareDeepLink: ShareDeepLinkConfig
}

export default function SongSwitcher({
  songs,
  featuredSlug,
  shareIdentity,
  shareLabels,
  shareDeepLink,
}: SongSwitcherProps) {
  const carouselRef = useRef<CarouselHandle>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  // Un seul lecteur vivant à la fois : null = aucune iframe montée.
  const [activeEmbedSlug, setActiveEmbedSlug] = useState<string | null>(null)
  const searchParams = useSearchParams()

  const handleDeactivate = useCallback(() => setActiveEmbedSlug(null), [])

  const activeSong = songs[activeIndex] ?? songs[0]

  // Map slug → ShareableSong pour les chansons qui ont une pochette.
  // Les chansons sans artwork ne sont pas dans la map (RÈGLE POCHETTE).
  const shareableMap = useMemo<Map<string, ShareableSong>>(() => {
    const map = new Map<string, ShareableSong>()
    for (const song of songs) {
      const s = toShareableSong(song)
      if (s) map.set(song.slug, s)
    }
    return map
  }, [songs])

  const { activeSlug, status, prepare, share } = useShareSong({
    identity: shareIdentity,
    labels: shareLabels,
    deepLink: shareDeepLink,
  })

  // Pré-chauffage de la SEULE diapo centrée. Le cache borné fait le reste.
  useEffect(() => {
    const song = songs[activeIndex]
    if (!song) return
    const s = shareableMap.get(song.slug)
    if (s) prepare(s)
  }, [activeIndex, prepare, shareableMap, songs])

  // Navigation par deep link (?song=<slug>). Le #music amène la section ;
  // ce useEffect centre la bonne diapo à l'intérieur. Deux mécanismes distincts.
  useEffect(() => {
    const target = readSongDeepLink(new URLSearchParams(searchParams.toString()))
    if (!target) return
    // Résolution dans l'ensemble des chansons (pas seulement celles avec artwork)
    // pour que le lien fonctionne même si la pochette est absente.
    const index = songs.findIndex((s) => s.slug === target.song)
    if (index < 0) return
    requestAnimationFrame(() => carouselRef.current?.scrollToIndex(index))
  }, [searchParams, songs])

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
        // ★ LE NAVIGATEUR A DÉJÀ RENONCÉ À DÉFILER : il cherche l'ancre au
        //   chargement initial, AVANT que React n'ait monté les diapos.
        //   ⇒ on refait le défilement nous-mêmes, une fois monté.
        requestAnimationFrame(() => {
          const el = document.getElementById(hash)
          if (!el) return
          // ⚠️ COUPLÉ À `py-2` DANS SiteNav ET AUX `scroll-mt-*` DE page.tsx.
          //    Trois valeurs, aucun lien dans le code. À unifier un jour via
          //    une variable CSS `--header-height`.
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

  // ── Diapos : VISUEL SEUL ───────────────────────────────────────────────────
  // Le titre reste en aria-label : invisible à l'œil, présent pour les
  // technologies d'assistance, qui n'ont pas le bloc épinglé sous les yeux.
  const items: CarouselItem[] = songs.map((song, idx) => {
    const shareableSong = song.media ? shareableMap.get(song.slug) : undefined
    return {
      key: song.slug,
      // ★ data-release = slug de la SORTIE. Les règles de recoloration sont
      //   écrites à ce niveau ; y mettre le slug de chanson ferait échouer la
      //   recoloration EN SILENCE.
      slideAttrs: song.paletteKey ? { 'data-release': song.paletteKey } : undefined,
      label: copy.slideOf(song.title, idx + 1, songs.length),
      content: song.media ? (
        <div className="relative">
          <EmbedPlayer
            asset={song.media}
            poster={song.artwork ?? undefined}
            posterAlt={song.artworkAlt ?? song.title}
            isActive={activeEmbedSlug === song.slug}
            onActivate={() => setActiveEmbedSlug(song.slug)}
            onDeactivate={handleDeactivate}
          />
          {shareableSong && (
            <div className="absolute right-3 top-3 z-10">
              <ShareButton
                song={shareableSong}
                labels={shareLabels}
                status={activeSlug === song.slug ? status : 'idle'}
                variant="icon"
                onShare={share}
                onPrepare={prepare}
              />
            </div>
          )}
        </div>
      ) : null,
    }
  })

  return (
    <>
      <div className="mt-6">
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
      </div>

      {/* ── BLOC ÉPINGLÉ — LA FICHE DE LA CHANSON AFFICHÉE ───────────────────
          `aria-live="polite"` : quand le carrousel change, un lecteur d'écran
          annonce la nouvelle chanson sans interrompre ce qui est en cours.
          Sans ça, le changement serait totalement silencieux. */}
      <section
        aria-label={copy.nowShowing}
        aria-live="polite"
        className="mt-5 border-t border-border pt-5"
      >
        <h3 className="font-display text-xl font-semibold tracking-tight text-text">
          {activeSong.title}
        </h3>

        {/* ★ GABARIT DE CHROME, PAS UNE CHAÎNE D'ARTISTE : « Hybrid Fruit ·
            Album · 2024 ». Traduit une fois, marche pour tout artiste. Le
            descriptor d'artiste, s'il existe, passe devant. */}
        {activeSong.descriptor ? (
          <p className="mt-1 text-sm text-muted">{activeSong.descriptor}</p>
        ) : activeSong.release ? (
          <p className="mt-1 text-sm text-muted">
            {activeSong.release.title} · {copy.releaseType[activeSong.release.type]}
            {activeSong.release.releasedOn && (
              <> · {activeSong.release.releasedOn.slice(0, 4)}</>
            )}
          </p>
        ) : null}

        {/* Crédits — la table dédiée arrive ; en attendant, la colonne jsonb
            `songs.credits` est lue telle quelle et reste vide sans dommage. */}
        {activeSong.credits.length > 0 && (
          <dl className="mt-4 flex flex-col gap-1 text-sm">
            {activeSong.credits.map((credit) => (
              <div key={`${credit.role}-${credit.name}`} className="flex gap-2">
                <dt className="shrink-0 text-muted">{credit.role}</dt>
                <dd className="text-text">{credit.name}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      {/* ── LISTE DE TITRES — NAVIGATION SEULE ───────────────────────────────
          Des <button>, pas des <a> : on déplace le carrousel, on ne change pas
          de page. Les ancres /#slug restent servies par l'id posé sur chaque
          diapo par CarouselLayout.
          ★ md:max-h-80 + md:overflow-y-auto : cadre défilant à la souris,
            flux normal au doigt. */}
      <nav
        aria-label={copy.trackListLabel}
        className="mt-6 md:max-h-80 md:overflow-y-auto md:rounded-sm md:border md:border-border"
      >
        <ul className="flex flex-col">
          {songs.map((song, idx) => (
            <li key={song.slug}>
              <button
                type="button"
                onClick={() => carouselRef.current?.scrollToIndex(idx)}
                aria-label={copy.goTo(song.title)}
                aria-current={activeIndex === idx ? 'true' : undefined}
                className={`flex w-full items-baseline gap-3 rounded-sm px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                  activeIndex === idx
                    ? 'bg-surface font-semibold text-accent'
                    : 'text-text hover:bg-surface/50'
                }`}
              >
                <span className="w-6 shrink-0 text-xs tabular-nums text-muted">
                  {song.trackNo ?? '·'}
                </span>
                <span>{song.title}</span>
                {song.release && (
                  <span className="ml-auto shrink-0 text-sm text-muted">
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
