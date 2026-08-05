'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import CitiesPicker from '@/components/CitiesPicker'

export default function WelcomeForm() {
  const [nickname, setNickname] = useState('')
  const [cities, setCities] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!nickname.trim()) {
      setError('Un surnom est requis.')
      return
    }

    setSaving(true)
    setError('')

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/')
      return
    }

    // RLS ensures this only touches the row owned by the authenticated user.
    // Assumes fans.id = auth.users.id (standard Supabase pattern).
    const { error: updateError } = await supabase
      .from('fans')
      .update({ nickname: nickname.trim(), cities })
      .eq('id', user.id)

    if (updateError) {
      setError('Une erreur est survenue. Réessaie.')
      setSaving(false)
      return
    }

    router.push('/atelier')
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <label htmlFor="nickname" className="text-sm font-medium text-text">
          Ton surnom <span aria-hidden="true">*</span>
          <span className="sr-only">(obligatoire)</span>
        </label>
        <input
          id="nickname"
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
          disabled={saving}
          placeholder="Comment te faire appeler ?"
          autoComplete="nickname"
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
        />
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-text">Où viendrais-tu la voir en concert ?</p>
        <p className="text-sm text-muted">Choisis une ou plusieurs villes — ça aide Qiwi Chee à savoir où organiser le prochain concert.</p>
        <CitiesPicker value={cities} onChange={setCities} />
      </div>

      {error && (
        <p role="alert" className="text-sm text-text">
          {error}
        </p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-accent px-5 py-2 text-sm font-medium text-accent-contrast hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg disabled:opacity-50"
        >
          {saving ? 'Sauvegarde…' : 'Accéder à l’Atelier'}
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => router.push('/atelier')}
          className="text-sm text-muted hover:text-text focus:outline-none focus:underline disabled:opacity-50"
        >
          Passer
        </button>
      </div>
    </form>
  )
}
