'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { renderShareCard } from './ShareCard'
import { buildSongDeepLink, fillTemplate } from './deepLink'
import type {
  ShareDeepLinkConfig,
  ShareIdentity,
  ShareLabels,
  ShareStatus,
  ShareableSong,
} from './types'

export interface UseShareSongOptions {
  identity: ShareIdentity
  labels: ShareLabels
  deepLink: ShareDeepLinkConfig
}

export interface UseShareSongResult {
  /** Slug de la chanson en cours de partage, ou null. */
  activeSlug: string | null
  status: ShareStatus
  /** Pré-génère hors du chemin critique du clic. Idempotent. */
  prepare: (song: ShareableSong, scope?: Element | null) => void
  share: (song: ShareableSong, scope?: Element | null) => Promise<void>
}

const STATUS_RESET_MS = 2400

/**
 * ⚠️ CACHE BORNÉ. Un bouton par diapo × 200 chansons, sans plafond, ce sont
 * 200 PNG de 1080×1350 en mémoire. Quatre suffisent : la diapo centrée et
 * ses voisines immédiates.
 */
const CACHE_LIMIT = 4

function canShareFiles(files: File[]): boolean {
  if (typeof navigator === 'undefined' || !navigator.canShare) return false
  try {
    return navigator.canShare({ files })
  } catch {
    return false
  }
}

export function useShareSong(options: UseShareSongOptions): UseShareSongResult {
  const { identity, labels, deepLink } = options

  const [status, setStatus] = useState<ShareStatus>('idle')
  const [activeSlug, setActiveSlug] = useState<string | null>(null)

  const cache = useRef(new Map<string, Promise<Blob>>())
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const alive = useRef(true)

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  const flash = useCallback((next: ShareStatus) => {
    if (!alive.current) return
    setStatus(next)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      if (!alive.current) return
      setStatus('idle')
      setActiveSlug(null)
    }, STATUS_RESET_MS)
  }, [])

  const blobFor = useCallback(
    (song: ShareableSong, scope?: Element | null): Promise<Blob> => {
      const hit = cache.current.get(song.slug)
      if (hit) {
        // Remise en tête : Map conserve l'ordre d'insertion.
        cache.current.delete(song.slug)
        cache.current.set(song.slug, hit)
        return hit
      }

      const pending = renderShareCard({
        song,
        identity,
        labels,
        themeScope: scope,
      }).catch((error: unknown) => {
        // Un échec ne reste pas en cache : le prochain clic réessaie.
        cache.current.delete(song.slug)
        throw error
      })

      cache.current.set(song.slug, pending)
      while (cache.current.size > CACHE_LIMIT) {
        const oldest = cache.current.keys().next().value
        if (oldest === undefined) break
        cache.current.delete(oldest)
      }
      return pending
    },
    [identity, labels],
  )

  const prepare = useCallback<UseShareSongResult['prepare']>(
    (song, scope) => {
      if (typeof window === 'undefined') return
      if (cache.current.has(song.slug)) return
      const run = () => {
        void blobFor(song, scope).catch(() => {
          /* silencieux : la pré-génération n'a pas le droit d'alerter */
        })
      }
      const idle = (window as Window & {
        requestIdleCallback?: (cb: () => void) => number
      }).requestIdleCallback
      if (idle) idle(run)
      else setTimeout(run, 200)
    },
    [blobFor],
  )

  const share = useCallback<UseShareSongResult['share']>(
    async (song, scope) => {
      const url = buildSongDeepLink(song, deepLink)
      const values = { title: song.title, name: identity.name }
      const title = fillTemplate(labels.shareTitleTemplate, values)
      const text = fillTemplate(labels.shareTextTemplate, values)

      setActiveSlug(song.slug)
      setStatus('pending')

      let file: File | null = null
      try {
        const blob = await blobFor(song, scope)
        file = new File([blob], `${song.slug}.png`, { type: 'image/png' })
      } catch {
        file = null // On partagera le lien seul plutôt que rien.
      }

      // 1. Partage natif AVEC image.
      if (file && canShareFiles([file])) {
        try {
          await navigator.share({ files: [file], title, text, url })
          flash('shared')
          return
        } catch (error) {
          if ((error as Error)?.name === 'AbortError') {
            setStatus('idle')
            setActiveSlug(null)
            return
          }
          // NotAllowedError = geste expiré pendant la génération. On descend.
        }
      }

      // 2. Partage natif SANS image (desktop Chrome, Android partiel).
      if (typeof navigator !== 'undefined' && navigator.share) {
        try {
          await navigator.share({ title, text, url })
          flash('shared')
          return
        } catch (error) {
          if ((error as Error)?.name === 'AbortError') {
            setStatus('idle')
            setActiveSlug(null)
            return
          }
        }
      }

      // 3. Repli : lien au presse-papier, image téléchargée si elle existe.
      try {
        await navigator.clipboard.writeText(url)
        if (file) {
          const href = URL.createObjectURL(file)
          const a = document.createElement('a')
          a.href = href
          a.download = file.name
          a.click()
          URL.revokeObjectURL(href)
        }
        flash('copied')
      } catch {
        flash('failed')
      }
    },
    [blobFor, deepLink, flash, identity.name, labels],
  )

  return { activeSlug, status, prepare, share }
}
