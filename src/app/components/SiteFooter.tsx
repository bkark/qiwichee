// =============================================================================
// src/app/components/SiteFooter.tsx
//
// Le lien de contact vit UNIQUEMENT ici, pas dans la nav.
// La nav (Musique · À propos) s'adresse aux fans ; un professionnel cherche
// en bas de page. Charger la nav d'un lien qui ne concerne pas 95 % des
// visiteurs dilue les deux.
//
// ⚠️ PAS DE LIENS LÉGAUX POUR L'INSTANT. /mentions-legales et /confidentialite
//    n'existent pas — un lien mort est pire que pas de lien. Ils viendront
//    quand les pages existeront (les mentions légales deviennent d'ailleurs
//    substantielles dès que la SASU est créée : SIREN, capital, siège,
//    directeur de publication, hébergeur).
// =============================================================================

import Link from 'next/link'
import { CONTACT_EMAIL } from '@/lib/constants'

const copy = {
  contact: 'Contact',
  rights: 'Tous droits réservés.',
} as const

export default function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 border-t border-border px-6 py-10">
      <div className="mx-auto flex max-w-4xl flex-col gap-3 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} Qiwi Chee. {copy.rights}</p>

        <nav aria-label="Pied de page" className="flex gap-6">
          {/* Link (pas <a>) : navigation client, pas de rechargement complet. */}
          <Link href="/contact" className="underline">
            {copy.contact}
          </Link>
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
            {CONTACT_EMAIL}
          </a>
        </nav>
      </div>
    </footer>
  )
}
