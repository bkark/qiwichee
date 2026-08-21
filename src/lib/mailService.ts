// =============================================================================
// src/lib/mailService.ts — couche d'abstraction ENVOI DE MAIL
//
// RÈGLE MAISON : service layer sur toute API externe.
//   Aujourd'hui OVH SMTP. Demain Brevo ou Resend. Le reste du code appelle
//   sendMail() et ne sait RIEN du fournisseur — changer de fournisseur =
//   changer CE fichier, pas les appelants.
//   (Télécom : les appelants parlent à une interface logique ; le transport
//    physique dessous se remplace sans toucher au plan d'adressage.)
//
// CE FICHIER NE LÈVE JAMAIS D'EXCEPTION.
//   Il retourne un résultat. Un envoi de mail est une NOTIFICATION : son échec
//   ne doit jamais faire tomber l'appelant, qui a déjà persisté la vérité en
//   base. C'est la moitié « forward » du store-and-forward — la moitié « store »
//   a déjà réussi avant qu'on arrive ici.
// =============================================================================

import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'
import { z } from 'zod'

// -----------------------------------------------------------------------------
// TYPES PUBLICS — le contrat que voient les appelants.
// Volontairement pauvre : pas de pièces jointes, pas de CC/BCC, pas de
// templates. On n'expose que ce qui est utilisé. Une interface large est une
// interface qu'on devra porter chez le fournisseur suivant.
// -----------------------------------------------------------------------------

export type MailMessage = {
  to: string
  subject: string
  text: string
  html?: string
  /** Adresse de l'expéditeur réel : permet de répondre en un clic. */
  replyTo?: string
}

export type MailResult =
  | { ok: true; messageId: string }
  | { ok: false; error: string }

// -----------------------------------------------------------------------------
// CONFIG — validée par Zod, comme toute entrée externe.
//
// ★ POURQUOI PAS AU CHARGEMENT DU MODULE.
//   Un throw au top-level ferait échouer le BUILD Vercel si une variable manque,
//   y compris sur des pages qui n'envoient aucun mail. On valide au PREMIER
//   ENVOI : la panne reste locale au formulaire au lieu d'abattre le site.
//   (Rappel : une variable enregistrée dans Vercel est INERTE tant qu'un
//    nouveau déploiement ne l'a pas prise.)
// -----------------------------------------------------------------------------

const EnvSchema = z.object({
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().int().positive(),
  SMTP_USER: z.string().email(),
  SMTP_PASSWORD: z.string().min(1),
})

type MailEnv = z.infer<typeof EnvSchema>

// -----------------------------------------------------------------------------
// ASSAINISSEMENT DES EN-TÊTES — dernière ligne de défense.
//
// Le RPC nettoie déjà nom et adresse. On le refait ici parce que ce module peut
// être appelé depuis n'importe où : un \r\n dans un en-tête permet d'INJECTER
// un Bcc: et de transformer le formulaire en relais de spam. Le corps du
// message (`text`) n'est PAS concerné : les retours ligne y sont légitimes.
// -----------------------------------------------------------------------------

function sanitizeHeader(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\r\n\u0000-\u001F\u007F]/g, ' ').trim()
}

// -----------------------------------------------------------------------------
// TRANSPORT — créé une fois, réutilisé.
//
// Sur Vercel une même instance chaude peut servir plusieurs requêtes : garder
// le transporter au niveau du module évite de refaire TCP + TLS + AUTH à chaque
// message. Sur une instance froide il est simplement recréé. Aucun risque de
// fuite : c'est un objet de config, pas une socket ouverte en permanence.
// -----------------------------------------------------------------------------

let cachedTransporter: Transporter | null = null

function getTransporter(env: MailEnv): Transporter {
  if (cachedTransporter) return cachedTransporter

  cachedTransporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,

    // ★ 587 = STARTTLS, donc secure:false — le chiffrement est NÉGOCIÉ après
    //   connexion, il n'est pas absent. secure:true est réservé au port 465
    //   (TLS implicite). Mettre secure:true sur 587 échoue à la poignée de main
    //   avec une erreur incompréhensible : c'est le piège classique.
    secure: env.SMTP_PORT === 465,
    requireTLS: env.SMTP_PORT === 587,

    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },

    // ★ TIMEOUTS EXPLICITES — 10 s.
    //   Le plafond Vercel du projet est à 300 s. Sans ces timeouts, un OVH
    //   injoignable laisserait la fonction PENDRE jusqu'à 5 minutes pour un mail
    //   déjà mort. Échouer vite et loguer l'id de la ligne donne le même résultat
    //   en 10 s. Le plafond généreux ne supprime pas le besoin de timeout — il en
    //   change juste la raison : ce n'est plus « ne pas se faire couper »,
    //   c'est « ne pas pendre ».
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 10_000,
  })

  return cachedTransporter
}

// -----------------------------------------------------------------------------
// API PUBLIQUE
// -----------------------------------------------------------------------------

/**
 * Envoie un mail. Ne lève jamais : retourne { ok: false, error } en cas d'échec.
 *
 * ⚠️ Node.js runtime UNIQUEMENT. L'edge runtime n'a pas de sockets TCP brutes,
 *    donc pas de SMTP. La route appelante doit déclarer :
 *      export const runtime = 'nodejs'
 */
export async function sendMail(message: MailMessage): Promise<MailResult> {
  const parsed = EnvSchema.safeParse({
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  })

  if (!parsed.success) {
    // ★ On logue les NOMS des champs manquants, JAMAIS leurs valeurs.
    //   Un mot de passe dans les logs Vercel est un mot de passe à faire tourner.
    const missing = parsed.error.issues.map((i) => i.path.join('.')).join(', ')
    return { ok: false, error: `smtp_config_invalid: ${missing}` }
  }

  const env = parsed.data

  try {
    const info = await getTransporter(env).sendMail({
      // ★ FROM = la boîte authentifiée, TOUJOURS.
      //   Mettre l'adresse du visiteur en From casserait SPF/DKIM (le domaine
      //   qiwichee.com n'autorise pas gmail.com à envoyer en son nom) et le mail
      //   partirait en spam — ou serait rejeté. L'expéditeur réel va en Reply-To.
      from: `"Contact qiwichee.com" <${env.SMTP_USER}>`,
      to: sanitizeHeader(message.to),
      subject: sanitizeHeader(message.subject),
      text: message.text,
      html: message.html,
      replyTo: message.replyTo ? sanitizeHeader(message.replyTo) : undefined,
    })

    return { ok: true, messageId: info.messageId }
  } catch (err) {
    // Un transporter peut rester dans un état bancal après un échec réseau.
    // On le jette : la prochaine tentative repartira d'une connexion neuve.
    cachedTransporter = null

    const error = err instanceof Error ? err.message : String(err)
    return { ok: false, error }
  }
}

/**
 * Test de connexion SMTP SANS envoyer de mail (commande NOOP côté serveur).
 *
 * Sert au diagnostic : distingue « les credentials sont faux » de « le mail
 * n'est pas parti ». Ne pas exposer sur une route publique — ça donnerait un
 * moyen gratuit de sonder la configuration.
 */
export async function verifyMailConnection(): Promise<MailResult> {
  const parsed = EnvSchema.safeParse({
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  })

  if (!parsed.success) {
    const missing = parsed.error.issues.map((i) => i.path.join('.')).join(', ')
    return { ok: false, error: `smtp_config_invalid: ${missing}` }
  }

  try {
    await getTransporter(parsed.data).verify()
    return { ok: true, messageId: 'verify_ok' }
  } catch (err) {
    cachedTransporter = null
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}
