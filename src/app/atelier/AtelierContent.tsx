'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import CitiesPicker from '@/components/CitiesPicker'

interface AtelierContentProps {
  userId: string
  initialCities: string[]
}

export default function AtelierContent({ userId, initialCities }: AtelierContentProps) {
  const [cities, setCities] = useState<string[]>(initialCities)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const router = useRouter()

  async function saveCities() {
    setSaving(true)
    setSaveStatus('idle')

    const supabase = createClient()
    const { error } = await supabase
      .from('fans')
      .update({ cities })
      .eq('id', userId)

    setSaving(false)
    setSaveStatus(error ? 'error' : 'saved')
  }

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="mt-8 flex flex-col gap-8">
      {/* Cities */}
      <section aria-labelledby="cities-heading" className="border-t border-border pt-8">
        <h2
          id="cities-heading"
          className="font-display text-lg font-semibold tracking-tight text-text"
        >
          Tes villes
        </h2>
        <div className="mt-4">
          <CitiesPicker value={cities} onChange={setCities} />
        </div>
        <div className="mt-4 flex items-center gap-4">
          <button
            type="button"
            disabled={saving}
            onClick={saveCities}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-contrast hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg disabled:opacity-50"
          >
            {saving ? 'Sauvegarde…' : 'Sauvegarder'}
          </button>
          <div aria-live="polite" aria-atomic="true" className="text-sm">
            {saveStatus === 'saved' && <span className="text-accent">Sauvegardé ✓</span>}
            {saveStatus === 'error' && (
              <span role="alert" className="text-text">
                Erreur — réessaie.
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Sign out */}
      <div className="border-t border-border pt-8">
        <button
          type="button"
          onClick={signOut}
          className="text-sm text-muted hover:text-text focus:outline-none focus:underline"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  )
}
