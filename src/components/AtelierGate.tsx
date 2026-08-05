'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface AtelierGateProps {
  initialError?: string
}

const ERROR_MESSAGES: Record<string, string> = {
  expired_link: 'Ton lien a expiré — redemande-en un ci-dessous.',
  missing_code: 'Lien invalide — redemande-en un ci-dessous.',
}

export default function AtelierGate({ initialError }: AtelierGateProps) {
  const [email, setEmail] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState(
    initialError ? (ERROR_MESSAGES[initialError] ?? 'Une erreur est survenue.') : ''
  )

  const supabase = createClient()
  const busy = status === 'submitting' || status === 'sent'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (honeypot) return // silent bot trap

    setStatus('submitting')
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      setStatus('sent')
    } catch {
      setErrorMsg('Une erreur est survenue. Réessaie dans un instant.')
      setStatus('error')
    }
  }

  return (
    <section aria-labelledby="gate-heading" className="border-t border-border py-16">
      <div className="max-w-xl">
        <h2
          id="gate-heading"
          className="font-display text-2xl font-semibold tracking-tight text-text"
        >
          Atelier
        </h2>
        <p className="mt-3 text-muted">
          Entre dans l’Atelier — les versions inédites, l’accès en
          avant-première aux mini-concerts, et ton mot à dire sur la suite.
          C’est ici, pas sur Spotify.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
          {/* Honeypot — hidden from real users, traps bots */}
          <div className="sr-only">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              type="text"
              aria-hidden="true"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="gate-email" className="text-sm font-medium text-text">
              Ton adresse email
            </label>
            <input
              id="gate-email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={busy}
              placeholder="toi@example.com"
              autoComplete="email"
              className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="self-start rounded-md bg-accent px-5 py-2 text-sm font-medium text-accent-contrast hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg disabled:opacity-50"
          >
            {status === 'submitting' ? 'Envoi…' : 'Accéder à l’Atelier'}
          </button>

          <div aria-live="polite" aria-atomic="true" className="min-h-[1.25rem] text-sm">
            {status === 'sent' && (
              <p className="text-accent">
                Vérifie ta boîte mail — ton lien vers l’Atelier arrive ✦
              </p>
            )}
            {status === 'sent' && (
              <p className="mt-2 text-xs text-muted">
                Pas d’e-mail dans ta boîte de réception&nbsp;? Regarde dans tes spams&nbsp;/
                indésirables — et marque-le comme &laquo;&nbsp;non spam&nbsp;&raquo; pour recevoir les
                prochains directement.
              </p>
            )}
            {(status === 'error' || (status === 'idle' && errorMsg)) && (
              <p role="alert" className="text-text">
                {errorMsg}
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}
