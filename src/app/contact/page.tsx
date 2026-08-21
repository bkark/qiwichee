// =============================================================================
// src/app/contact/page.tsx
//
// ★ POURQUOI UNE ADRESSE VISIBLE EN PLUS DU FORMULAIRE.
//   Un crawler ne remplit pas de formulaire. Un agent IA à qui on demande
//   « comment contacter Qiwi Chee » ne trouverait RIEN sur une page qui ne
//   contient que des champs vides. Le formulaire sert l'intake structuré ;
//   le mailto + le JSON-LD servent la DÉCOUVRABILITÉ. Les deux, pas l'un.
//
//   Coût assumé : l'adresse est moissonnable par les robots à spam. Mais une
//   adresse de booking cachée est une adresse inutile — être trouvable est
//   précisément son métier.
// =============================================================================

import type { Metadata } from 'next'
import ContactForm from '@/app/components/ContactForm'
import { CONTACT_EMAIL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Contact',   // devient « Contact | Qiwi Chee » via le template du layout
  description:
    'Contacter Qiwi Chee — booking, presse, collaborations. Autrice-compositrice-interprète indépendante basée à Paris.',
  // ⚠️ SURCHARGE OBLIGATOIRE. Le layout déclare un canonical en dur vers
  //    https://qiwichee.com : sans cette ligne, /contact se déclarerait
  //    canonique vers la page d'accueil et ne serait jamais indexée.
  alternates: { canonical: 'https://qiwichee.com/contact' },
  openGraph: {
    title: 'Contact — Qiwi Chee',
    description: 'Booking, presse, collaborations.',
    url: 'https://qiwichee.com/contact',
  },
}

// JSON-LD rendu CÔTÉ SERVEUR : présent dans le HTML initial, donc lu par
// Google et par les agents. Un JSON-LD injecté par JavaScript ne l'est pas.
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MusicGroup',
  name: 'Qiwi Chee',
  url: 'https://qiwichee.com',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'booking',
    email: CONTACT_EMAIL,
    availableLanguage: ['fr', 'en'],
  },
}

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <a href="/" className="text-sm text-muted underline">← Qiwi Chee</a>

      <h1 className="mt-6 text-3xl font-semibold">Contact</h1>

      <p className="mt-4 text-muted">
        Pour un concert, une demande presse ou une collaboration — écris ici, ou
        directement à{' '}
        {/* Un mailto n'est PAS un lien externe : il ne passe pas par
            ExternalLink. Un target="_blank" sur un mailto laisserait un onglet
            vide ouvert derrière le client mail. */}
        <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
          {CONTACT_EMAIL}
        </a>
        .
      </p>

      <div className="mt-10">
        <ContactForm />
      </div>
    </main>
  )
}
