'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import CitiesPicker from '@/components/CitiesPicker'
import EmbedPlayer from '@/app/components/EmbedPlayer'
import type { MediaAsset } from '@/lib/media/types'

// UNLOCK: when the unlisted YouTube ID arrives → set assetId and remove `locked`
const insiderClip: MediaAsset = {
  provider: 'youtube',
  assetId: '',
  type: 'video',
  title: 'Concert privé — clip Atelier',
}

interface AtelierContentProps {
  initialNickname: string
  initialCities: string[]
  status: string
}

export default function AtelierContent({ initialNickname, initialCities, status }: AtelierContentProps) {
  const [nickname, setNickname] = useState(initialNickname)
  const [cities, setCities] = useState<string[]>(initialCities)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error' | 'required'>('idle')
  const router = useRouter()

  async function saveProfile() {
    if (!nickname.trim()) {
      setSaveStatus('required')
      return
    }

    setSaving(true)
    setSaveStatus('idle')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setSaving(false)
      setSaveStatus('error')
      return
    }

    const { error } = await supabase
      .from('fans')
      .update({ nickname: nickname.trim(), cities: cities as string[] })
      .eq('id', user.id)

    setSaving(false)
    if (!error) setNickname(nickname.trim())
    setSaveStatus(error ? 'error' : 'saved')
  }

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      {/* Header — nickname updates reactively after save */}
      <header className="border-b border-border pb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Bienvenue, {nickname}
        </h1>
        <span className="mt-2 inline-block rounded-full bg-accent-warm px-3 py-0.5 text-xs font-medium text-accent-warm-contrast">
          {status}
        </span>
      </header>

      <div className="mt-8 flex flex-col gap-8">
        {/* Insider clip — locked until the unlisted YouTube ID arrives */}
        <section aria-labelledby="insider-heading" className="border-t border-border pt-8">
          <h2
            id="insider-heading"
            className="font-display text-lg font-semibold tracking-tight text-text"
          >
            Exclusivité Atelier
          </h2>
          <div className="mt-4">
            <EmbedPlayer
              asset={insiderClip}
              poster="/qiwichee_atelier_cover_80s.jpg"
              posterAlt="Qiwi Chee en concert, bannière peinte « Release + Decay »"
              locked
              lockedLabel="Bientôt — réservé à l'Atelier"
              caption="Un extrait qui n'existe nulle part ailleurs."
            />
          </div>
        </section>

        {/* Profile — nickname + cities, one combined save */}
        <section aria-labelledby="profile-heading" className="border-t border-border pt-8">
          <h2
            id="profile-heading"
            className="font-display text-lg font-semibold tracking-tight text-text"
          >
            Ton profil
          </h2>

          {/* Nickname */}
          <div className="mt-4 flex flex-col gap-1">
            <label htmlFor="nickname" className="text-sm font-medium text-text">
              Ton pseudo
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => { setNickname(e.target.value); setSaveStatus('idle') }}
              maxLength={30}
              placeholder="Le nom que voient les autres dans l'Atelier."
              className="max-w-xs rounded-md border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Cities */}
          <div className="mt-6">
            <CitiesPicker value={cities} onChange={(c) => { setCities(c); setSaveStatus('idle') }} />
          </div>

          {/* Save */}
          <div className="mt-4 flex items-center gap-4">
            <button
              type="button"
              disabled={saving}
              onClick={saveProfile}
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-contrast hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg disabled:opacity-50"
            >
              {saving ? 'Sauvegarde…' : 'Sauvegarder'}
            </button>
            <div aria-live="polite" aria-atomic="true" className="text-sm">
              {saveStatus === 'saved' && (
                <span className="text-accent">Sauvegardé ✓</span>
              )}
              {saveStatus === 'required' && (
                <span role="alert" className="text-text">Choisis un pseudo.</span>
              )}
              {saveStatus === 'error' && (
                <span role="alert" className="text-text">Erreur — réessaie.</span>
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
    </>
  )
}
