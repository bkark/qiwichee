import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { subscribeFan } from '@/lib/emailService'

const ConfirmParams = z.object({
  token_hash: z.string().min(1),
  type: z.enum(['email', 'magiclink']),
})

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)

  const parsed = ConfirmParams.safeParse({
    token_hash: searchParams.get('token_hash'),
    type: searchParams.get('type'),
  })
  if (!parsed.success) {
    return NextResponse.redirect(`${origin}/?error=missing_token`)
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.verifyOtp({
    type: parsed.data.type,
    token_hash: parsed.data.token_hash,
  })

  if (error || !data.session) {
    return NextResponse.redirect(`${origin}/?error=expired_link`)
  }

  const email = data.session.user.email!

  const { data: fanResult } = await supabase.rpc('touch_fan', { p_email: email })
  // touch_fan returns { is_new: boolean }
  const isNew: boolean = fanResult?.is_new ?? false

  // Best-effort Mailchimp sync — never blocks the redirect
  subscribeFan(email).catch((err) =>
    console.error('[emailService] subscribeFan failed:', err)
  )

  return NextResponse.redirect(`${origin}${isNew ? '/atelier/welcome' : '/atelier'}`)
}
