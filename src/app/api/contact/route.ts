// =============================================================================
// src/app/api/contact/route.ts — réception du formulaire de contact pro
//
// ORDRE DES OPÉRATIONS (c'est tout le fichier) :
//   1. Valider          → Zod, honeypot, taille
//   2. PERSISTER        → RPC Supabase. C'est ICI que le message devient sûr.
//   3. Répondre         → le visiteur voit « envoyé »
//   4. Notifier ENSUITE → after(), hors du chemin de l'utilisateur
//
// L'étape 4 peut échouer sans que le message soit perdu : la ligne existe déjà.
// C'est la moitié « forward » du store-and-forward.
// =============================================================================

import { createHash } from 'node:crypto'
import { after } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { ARTIST_SLUG } from '@/lib/constants'
import { sendMail } from '@/lib/mailService'

// ⚠️ nodejs OBLIGATOIRE : l'edge runtime n'a pas de socket TCP brute, donc pas
//    de SMTP. Le mail échouerait sans message clair.
export const runtime = 'nodejs'

// ⚠️ force-dynamic : une route POST ne devrait pas être optimisée statiquement,
//    mais on l'écrit plutôt que de l'espérer. Même piège que /api/keepalive,
//    qui renvoyait 200 sans jamais toucher la base.
export const dynamic = 'force-dynamic'

// -----------------------------------------------------------------------------
// SCHÉMA — la validation d'entrée. Zod sur toute entrée externe.
// Les bornes doivent correspondre à celles du RPC : si elles divergent, le
// visiteur voit un message d'erreur générique là où il devrait voir un champ
// précis en faute.
// -----------------------------------------------------------------------------

const ContactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(254),
  subject: z.enum(['concert', 'presse', 'collaboration', 'autre']),
  message: z.string().trim().min(10).max(5000),
    // ★ TÉLÉPHONE : FACULTATIF. Bornes IDENTIQUES à celles du RPC — si elles
  //   divergent, le visiteur voit une erreur générique au lieu du champ fautif.
  // ★ `.or(z.literal(''))` est INDISPENSABLE : un champ non rempli poste ''
  //   et non `undefined`. Sans ça, laisser le champ vide serait une erreur
  //   de validation sur un champ optionnel — exactement l'inverse du but.
  phone: z
    .string()
    .trim()
    .min(6)
    .max(32)
    .regex(/^[+0-9][0-9 ().-]*$/)
    .optional()
    .or(z.literal('')),
  locale: z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/).default('fr'),
  // Honeypot. Doit rester VIDE : un humain ne voit pas le champ.
  website: z.string().max(0).optional().or(z.literal('')),
})

// -----------------------------------------------------------------------------
// HACHAGE D'IP
//
// ★ On ne stocke JAMAIS l'IP. Sans sel, un hash d'IPv4 se casse par force brute
//   en quelques secondes (4 milliards de possibilités) — ce serait un déguisement,
//   pas une protection. Le sel rend la table impossible à pré-calculer.
// -----------------------------------------------------------------------------

function hashIp(ip: string | null): string | null {
  const salt = process.env.IP_HASH_SALT
  if (!ip || !salt) return null
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex')
}

function clientIp(req: Request): string | null {
  // Vercel place l'IP réelle en tête de x-forwarded-for.
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0]?.trim() ?? null
  return req.headers.get('x-real-ip')
}

// -----------------------------------------------------------------------------
// SORTIE DU RPC — on valide aussi ce qui REVIENT de la base.
// -----------------------------------------------------------------------------

const RpcResultSchema = z.union([
  z.object({ ok: z.literal(true), id: z.string() }),
  z.object({ ok: z.literal(false), reason: z.string() }),
])

// -----------------------------------------------------------------------------

export async function POST(req: Request) {
  // --- 1. Lire le corps ------------------------------------------------------
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  const parsed = ContactSchema.safeParse(body)

  if (!parsed.success) {
    // ★ HONEYPOT : si le seul problème est le champ `website`, c'est un bot.
    //   On répond 200 « envoyé » SANS RIEN ÉCRIRE. Lui dire qu'il a échoué
    //   l'aiderait à s'adapter ; le silence le laisse croire qu'il a réussi.
    //   ⚠️ Cette vérification est CÔTÉ SERVEUR — celle d'AtelierGate est
    //   côté client, donc invisible pour un bot qui poste directement ici.
    const onlyHoneypot =
      parsed.error.issues.length > 0 &&
      parsed.error.issues.every((i) => i.path[0] === 'website')

    if (onlyHoneypot) {
      return Response.json({ ok: true }, { status: 200 })
    }

    const fields = [...new Set(parsed.error.issues.map((i) => String(i.path[0])))]
    return Response.json({ ok: false, error: 'invalid_input', fields }, { status: 400 })
  }

  const { name, email, phone, subject, message, locale } = parsed.data

  // --- 2. PERSISTER (la vérité) ---------------------------------------------
  const supabase = await createClient()

  const { data, error } = await supabase.rpc('submit_contact_message', {
    p_artist_slug: ARTIST_SLUG,   // ★ jamais depuis le body
    p_name: name,
    p_email: email,
    p_subject: subject,
    p_message: message,
    p_locale: locale,
    p_ip_hash: hashIp(clientIp(req)),
        // '' → null : on n'envoie pas une chaîne vide à la base. Le RPC a son
    // propre nullif, mais on ne s'appuie pas sur le filet de l'autre couche.
    p_phone: phone || null,
  })

  if (error) {
    console.error('[contact] RPC submit_contact_message a échoué :', error)
    return Response.json({ ok: false, error: 'server_error' }, { status: 500 })
  }

  const result = RpcResultSchema.safeParse(data)
  if (!result.success) {
    console.error('[contact] réponse RPC inattendue :', data)
    return Response.json({ ok: false, error: 'server_error' }, { status: 500 })
  }

  if (!result.data.ok) {
    const reason = result.data.reason
    if (reason === 'rate_limited') {
      return Response.json({ ok: false, error: 'rate_limited' }, { status: 429 })
    }
    console.error('[contact] RPC a refusé :', reason)
    return Response.json({ ok: false, error: reason }, { status: 400 })
  }

  const messageId = result.data.id

  // --- 3 & 4. Notifier APRÈS la réponse -------------------------------------
  // after() prolonge la vie de la fonction serverless une fois la réponse
  // envoyée : le visiteur ne subit jamais la latence SMTP (1–3 s).
  //
  // ⚠️ Cela déplace la latence, ce n'est PAS une garantie de livraison.
  //    Si l'envoi échoue, le visiteur a déjà lu « envoyé ». D'où le log avec
  //    l'id : la ligne est en base et l'envoi est rejouable à la main.
  after(async () => {
    const to = process.env.CONTACT_TO
    if (!to) {
      console.error(`[contact] CONTACT_TO absent — mail non envoyé. id=${messageId}`)
      return
    }

    const labels: Record<string, string> = {
      concert: 'Concert / booking',
      presse: 'Presse',
      collaboration: 'Collaboration',
      autre: 'Autre',
    }

    const res = await sendMail({
      to,
      subject: `[qiwichee.com] ${labels[subject] ?? subject} — ${name}`,
      // ★ replyTo = l'expéditeur réel : Qiwi Chee répond en un clic.
      //   Le From reste la boîte authentifiée (sinon SPF/DKIM cassent).
      replyTo: email,
      text: [
        `Objet   : ${labels[subject] ?? subject}`,
        `Nom     : ${name}`,
        `Email   : ${email}`,
        `Tél.    : ${phone || '—'}`,
        `Langue  : ${locale}`,
        '',
        message,
        '',
        '---',
        `Référence : ${messageId}`,
        'Envoyé depuis le formulaire de qiwichee.com',
      ].join('\n'),
    })

    if (!res.ok) {
      // Le message N'EST PAS PERDU : il est en base. Cette ligne dit
      // exactement laquelle rejouer.
      console.error(`[contact] envoi du mail échoué. id=${messageId} err=${res.error}`)
    }
  })

  return Response.json({ ok: true }, { status: 200 })
}
