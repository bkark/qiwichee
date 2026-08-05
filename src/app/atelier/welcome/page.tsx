import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import WelcomeForm from './WelcomeForm'

export default async function WelcomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/')

  return (
    <div className="min-h-screen bg-bg text-text">
      <main className="mx-auto max-w-xl px-6 py-20">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Bienvenue dans l’Atelier ✦
        </h1>
        <p className="mt-3 text-muted">
          Dis-nous comment t’appeler. Tu pourras tout changer plus tard.
        </p>
        <WelcomeForm />
      </main>
    </div>
  )
}
