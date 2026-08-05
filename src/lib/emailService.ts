import 'server-only'
import crypto from 'crypto'

// Audience ID from CLAUDE.md — per-artist constant, not sensitive
const AUDIENCE_ID = 'c5532d5f66'

function datacenter(): string {
  const key = process.env.MAILCHIMP_API_KEY
  if (!key) throw new Error('MAILCHIMP_API_KEY is not set')
  const dc = key.split('-').at(-1)
  if (!dc) throw new Error('MAILCHIMP_API_KEY format invalid — expected <key>-<dc>')
  return dc
}

function md5(input: string): string {
  return crypto.createHash('md5').update(input).digest('hex')
}

// Called after magic-link verification — email ownership is already proven by Supabase,
// so we use status_if_new:"subscribed" (not "pending") to skip the Mailchimp confirmation mail.
export async function subscribeFan(email: string): Promise<void> {
  const dc = datacenter()
  const normalised = email.toLowerCase().trim()
  const hash = md5(normalised)
  const url = `https://${dc}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members/${hash}`
  const auth = Buffer.from(`anystring:${process.env.MAILCHIMP_API_KEY}`).toString('base64')

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email_address: normalised,
      status_if_new: 'subscribed',
    }),
  })

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as Record<string, unknown>
    throw new Error(`Mailchimp ${res.status}: ${body.detail ?? res.statusText}`)
  }
}
