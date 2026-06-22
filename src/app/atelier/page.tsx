import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getFanStatus } from '@/lib/fanStatus'
import AtelierContent from './AtelierContent'

export default async function AtelierPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/')

  const { data: fan } = await supabase
    .from('fans')
    .select('nickname, cities, visit_count')
    .eq('id', user.id)
    .single()

  const nickname = fan?.nickname ?? user.email?.split('@')[0] ?? 'Ami·e'
  const cities: string[] = fan?.cities ?? []
  const visitCount: number = fan?.visit_count ?? 1
  const status = getFanStatus(visitCount)

  return (
    <div className="min-h-screen bg-bg text-text">
      <main className="mx-auto max-w-3xl px-6 py-16">
        <AtelierContent initialNickname={nickname} initialCities={cities} status={status} />

        {/* Coming-soon placeholder */}
        <section
          aria-labelledby="content-heading"
          className="mt-16 border-t border-border pt-12"
        >
          <h2
            id="content-heading"
            className="font-display text-lg font-semibold tracking-tight text-text"
          >
            Contenu
          </h2>
          <p className="mt-3 text-muted">
            L&rsquo;Atelier arrive — contenu en route ✦
          </p>
        </section>
      </main>
    </div>
  )
}
