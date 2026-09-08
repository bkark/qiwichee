'use client'

import { useRef } from 'react'
import { fillTemplate } from './deepLink'
import type {
  ShareButtonVariant,
  ShareLabels,
  ShareStatus,
  ShareableSong,
} from './types'

export interface ShareButtonProps {
  song: ShareableSong
  labels: ShareLabels
  /** Statut du hook, transmis uniquement si CETTE chanson est concernée. */
  status: ShareStatus
  /**
   * 'icon' dans les diapos : AUCUN texte visible, le carrousel reste visuel.
   * Le mot « Partager » vit dans l'aria-label, lu par les lecteurs d'écran.
   */
  variant?: ShareButtonVariant
  onShare: (song: ShareableSong, scope: Element | null) => void
  onPrepare: (song: ShareableSong, scope: Element | null) => void
}

function visibleLabel(status: ShareStatus, labels: ShareLabels): string {
  switch (status) {
    case 'pending':
      return labels.pending
    case 'copied':
      return labels.copied
    case 'failed':
      return labels.failed
    default:
      return labels.action
  }
}

export default function ShareButton(props: ShareButtonProps) {
  const { song, labels, status, variant = 'icon', onShare, onPrepare } = props
  const ref = useRef<HTMLButtonElement>(null)

  const busy = status === 'pending'
  const label = fillTemplate(labels.actionAriaTemplate, { title: song.title })

  // La diapo porte data-release le jour de la palette par release ;
  // en attendant, closest() renvoie null et le thème tombe sur :root.
  const scope = () => ref.current?.closest('[data-release]') ?? ref.current

  // Le pointerdown précède le click : la génération démarre avant même que
  // le doigt se lève. C'est ce qui sauve le geste sur Safari iOS.
  const warm = () => onPrepare(song, scope())

  return (
    <button
      ref={ref}
      type="button"
      disabled={busy}
      title={label}
      aria-label={label}
      onFocus={warm}
      onPointerEnter={warm}
      onPointerDown={warm}
      onClick={() => onShare(song, scope())}
      className={[
        'inline-flex min-h-11 min-w-11 items-center justify-center gap-2',
        'rounded-full text-muted transition-colors',
        'hover:text-accent',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        'focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-60',
        variant === 'labelled' ? 'px-4 py-2 text-sm font-medium' : 'p-2',
      ].join(' ')}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
        <path d="M16 6l-4-4-4 4" />
        <path d="M12 2v14" />
      </svg>
      {variant === 'labelled' ? <span>{visibleLabel(status, labels)}</span> : null}
      <span className="sr-only" role="status" aria-live="polite">
        {status === 'idle' ? '' : visibleLabel(status, labels)}
      </span>
    </button>
  )
}
