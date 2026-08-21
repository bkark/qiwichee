'use client'

// =============================================================================
// src/app/components/ContactForm.tsx
//
// ★ TOUTE LA COPIE DANS UN SEUL OBJET PLAT, clés en anglais, valeurs en
//   français. Ce n'est pas next-intl — c'est la FORME que next-intl attend.
//   Le jour du bilingue, cet objet se déplace tel quel dans fr.json.
//
// ★ DEUX NIVEAUX DE VALIDATION, ET C'EST DÉLIBÉRÉ :
//   1. PRÉVENIR — les contraintes sont affichées AVANT l'erreur (indication
//      sous le champ, compteur de caractères). La meilleure erreur est celle
//      qui n'arrive pas.
//   2. SIGNALER — si elle arrive quand même, elle s'affiche SOUS LE CHAMP
//      concerné, pas en bas du formulaire. « Certains champs sont incomplets »
//      est exact et inutilisable : le visiteur ne sait pas lequel.
//
//   La validation client est un CONFORT, pas une barrière. Le serveur revalide
//   tout, et le RPC revalide encore. Un bot qui poste directement ne voit
//   jamais ce fichier.
//
// ★ Apostrophes COURBES (’) dans le texte affiché. Droites dans les `value`
//   des <option>, qui partent en base.
// =============================================================================

import { useState } from 'react'

const MIN_MESSAGE = 10
const MAX_MESSAGE = 5000

const copy = {
  nameLabel: 'Ton nom',
  emailLabel: 'Ton adresse email',
  subjectLabel: 'Objet',
  subjectConcert: 'Concert / booking',
  subjectPresse: 'Presse',
  subjectCollaboration: 'Collaboration',
  subjectAutre: 'Autre',
  messageLabel: 'Ton message',
  messagePlaceholder: 'Dis-nous en quelques lignes ce qui t’amène.',
  messageHint: `Au moins ${MIN_MESSAGE} caractères.`,
  submit: 'Envoyer',
  sending: 'Envoi en cours…',
  successTitle: 'Message envoyé',
  successBody: 'Merci — une réponse arrivera par email.',
  backHome: '← Retour à l’accueil',

  // Erreurs PAR CHAMP — chacune dit quoi faire, pas seulement ce qui ne va pas.
  errName: 'Indique ton nom (2 caractères minimum).',
  errEmail: 'Cette adresse email ne semble pas valide.',
  errSubject: 'Choisis un objet.',
  errMessage: `Ton message est trop court — ${MIN_MESSAGE} caractères minimum.`,
  errMessageLong: `Ton message dépasse ${MAX_MESSAGE} caractères.`,

  errorGeneric: 'L’envoi a échoué. Réessaie dans un instant.',
  errorRateLimited:
    'Trop de messages envoyés depuis cette connexion. Réessaie dans une heure.',
  errorInvalid: 'Vérifie les champs signalés ci-dessus.',
} as const

type Status = 'idle' | 'sending' | 'sent' | 'error'
type FieldErrors = Partial<Record<'name' | 'email' | 'subject' | 'message', string>>

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('concert')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('')   // honeypot
  const [status, setStatus] = useState<Status>('idle')
  const [formError, setFormError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  /** Mêmes bornes que le schéma serveur ET que le RPC. Si elles divergent,
   *  le visiteur voit « tout est bon » et le serveur refuse quand même. */
  function validate(): FieldErrors {
    const errs: FieldErrors = {}
    if (name.trim().length < 2) errs.name = copy.errName
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) errs.email = copy.errEmail
    if (!['concert', 'presse', 'collaboration', 'autre'].includes(subject)) {
      errs.subject = copy.errSubject
    }
    const m = message.trim()
    if (m.length < MIN_MESSAGE) errs.message = copy.errMessage
    else if (m.length > MAX_MESSAGE) errs.message = copy.errMessageLong
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'sending') return

    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs)
      setFormError('')
      setStatus('error')
      // Amener le focus sur le premier champ fautif : sans ça, un utilisateur
      // au clavier ou au lecteur d'écran ne sait pas où l'erreur se trouve.
      document.getElementById(`contact-${Object.keys(errs)[0]}`)?.focus()
      return
    }

    setStatus('sending')
    setFormError('')
    setFieldErrors({})

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message, website, locale: 'fr' }),
      })

      const data = await res.json()

      if (res.ok && data.ok) {
        setStatus('sent')
        return
      }

      if (res.status === 429) {
        setFormError(copy.errorRateLimited)
      } else if (data?.error === 'invalid_input' && Array.isArray(data.fields)) {
        // Le serveur renvoie la LISTE des champs fautifs. On la traduit en
        // messages par champ plutôt que de l'ignorer.
        const map: FieldErrors = {}
        for (const f of data.fields) {
          if (f === 'name') map.name = copy.errName
          if (f === 'email') map.email = copy.errEmail
          if (f === 'subject') map.subject = copy.errSubject
          if (f === 'message') map.message = copy.errMessage
        }
        setFieldErrors(map)
        setFormError(copy.errorInvalid)
      } else {
        setFormError(copy.errorGeneric)
      }

      setStatus('error')
    } catch {
      setFormError(copy.errorGeneric)
      setStatus('error')
    }
  }

  // --- Succès : on remplace le formulaire, avec une issue ---------------------
  if (status === 'sent') {
    return (
      <div role="status" className="rounded-lg border border-border p-6">
        <p className="font-medium">{copy.successTitle}</p>
        <p className="mt-2 text-muted">{copy.successBody}</p>
        <a href="/" className="mt-4 inline-block text-sm underline">
          {copy.backHome}
        </a>
      </div>
    )
  }

  const busy = status === 'sending'
  const messageLength = message.trim().length

  /** Classe du champ : bordure rouge si en faute. */
  const fieldClass = (err?: string) =>
    `rounded-md border px-3 py-2 ${err ? 'border-red-600' : 'border-border'}`

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {/* --- Nom --- */}
      <div className="flex flex-col gap-1">
        <label htmlFor="contact-name" className="text-sm font-medium text-text">
          {copy.nameLabel}
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          maxLength={120}
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={busy}
          aria-invalid={!!fieldErrors.name}
          aria-describedby={fieldErrors.name ? 'contact-name-err' : undefined}
          className={fieldClass(fieldErrors.name)}
        />
        {fieldErrors.name && (
          <p id="contact-name-err" className="text-sm text-red-700">
            {fieldErrors.name}
          </p>
        )}
      </div>

      {/* --- Email --- */}
      <div className="flex flex-col gap-1">
        <label htmlFor="contact-email" className="text-sm font-medium text-text">
          {copy.emailLabel}
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={busy}
          aria-invalid={!!fieldErrors.email}
          aria-describedby={fieldErrors.email ? 'contact-email-err' : undefined}
          className={fieldClass(fieldErrors.email)}
        />
        {fieldErrors.email && (
          <p id="contact-email-err" className="text-sm text-red-700">
            {fieldErrors.email}
          </p>
        )}
      </div>

      {/* --- Objet --- */}
      <div className="flex flex-col gap-1">
        <label htmlFor="contact-subject" className="text-sm font-medium text-text">
          {copy.subjectLabel}
        </label>
        {/* ★ Les `value` sont des chaînes MACHINE : elles partent en base.
            Seuls les libellés se traduisent. */}
        <select
          id="contact-subject"
          name="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={busy}
          className={fieldClass(fieldErrors.subject)}
        >
          <option value="concert">{copy.subjectConcert}</option>
          <option value="presse">{copy.subjectPresse}</option>
          <option value="collaboration">{copy.subjectCollaboration}</option>
          <option value="autre">{copy.subjectAutre}</option>
        </select>
      </div>

      {/* --- Message --- */}
      <div className="flex flex-col gap-1">
        <label htmlFor="contact-message" className="text-sm font-medium text-text">
          {copy.messageLabel}
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          maxLength={MAX_MESSAGE}
          placeholder={copy.messagePlaceholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={busy}
          aria-invalid={!!fieldErrors.message}
          aria-describedby="contact-message-hint"
          className={fieldClass(fieldErrors.message)}
        />
        {/* ★ PRÉVENTION : la contrainte est visible AVANT toute erreur, et le
            compteur montre où on en est. C'est ce qui manquait. */}
        <p
          id="contact-message-hint"
          className={`text-sm ${fieldErrors.message ? 'text-red-700' : 'text-muted'}`}
        >
          {fieldErrors.message ?? copy.messageHint}
          {messageLength > 0 && messageLength < MIN_MESSAGE && ` (${messageLength}/${MIN_MESSAGE})`}
        </p>
      </div>

      {/* Honeypot — même convention qu'AtelierGate (name="website").
          Masqué par CSS explicite : pas de sr-only, qui signifie l'inverse.
          ⚠️ La vraie barrière est côté serveur : un bot qui poste sur
          /api/contact ne charge jamais ce composant. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Erreur globale (réseau, rate-limit) — role="alert" pour l'annonce. */}
      {status === 'error' && formError && (
        <p role="alert" className="text-sm text-red-700">
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="btn-primary self-start disabled:opacity-60"
      >
        {busy ? copy.sending : copy.submit}
      </button>
    </form>
  )
}
