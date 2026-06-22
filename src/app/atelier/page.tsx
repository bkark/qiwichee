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
        {/* Header */}
        <header className="border-b border-border pb-8">
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Bienvenue, {nickname}
          </h1>
          {/* Status badge — bg-accent-warm gives contrast-passing dark text on yellow */}
          <span className="mt-2 inline-block rounded-full bg-accent-warm px-3 py-0.5 text-xs font-medium text-accent-warm-contrast">
            {status}
          </span>
        </header>

        <AtelierContent userId={user.id} initialCities={cities} />

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
