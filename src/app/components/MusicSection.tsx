// =============================================================================
// src/app/components/MusicSection.tsx
//
// ★ COMPOSANT SERVEUR. Il appelle le client de module, décide quoi faire d'un
//   échec, et passe des données PURES au composant client.
//   Aucune iframe, aucun état, aucun 'use client'.
//
// ★ POURQUOI LA GESTION D'ÉCHEC EST ICI ET PAS DANS LE CLIENT :
//   le client LÈVE (il ne sait pas ce qu'une page veut montrer). C'est cette
//   section qui tranche : catalogue vide → on masque ; RPC en échec → on masque
//   AUSSI, mais on logue avec le contexte, parce que la page vient de perdre son
//   contenu principal et que personne ne le verrait autrement.
//   ⚠️ BioSection fait l'inverse (log + return null dans le composant). C'est le
//     motif que le contrat d'architecture remplace — bioClient suivra CELUI-CI.
//
// ★ `artistSlug` ARRIVE EN PROP. Plus de ARTIST_SLUG importé d'un fichier de
//   constantes : c'est ce qui rend la section réutilisable telle quelle pour
//   l'artiste #2. La constante ne survit qu'au BORD (page.tsx), en attendant
//   qu'elle vienne du domaine ou du segment de route.
// =============================================================================

import { getSongs } from '@/lib/modules/catalogue/client'
import SongSwitcher from './SongSwitcher'
import ExternalLink from './ExternalLink'
import BrandIcon, { type BrandName } from './BrandIcon'

// ★ « Aussi sur → » EST SORTI DU CARROUSEL.
//   Ce sont les liens de l'ARTISTE, pas de la chanson. Répétés dans 9 diapos
//   c'était du bruit, et le aria-label mentait (« Flatline sur Spotify » pointe
//   en réalité vers un profil, pas vers le morceau).
// ⚠️ DETTE MULTI-TENANT ASSUMÉE : `artistLinks` descend encore d'un const dans
//   page.tsx. Tant que `artists` n'a pas de table de liens, aucun client ne peut
//   les fournir. À traiter avec l'audit de remédiation.
export interface ArtistLink {
  name: string
  href: string
  icon: BrandName
}

const copy = {
  heading: 'Aussi sur →',
}

interface MusicSectionProps {
  artistSlug: string
  locale: string
  artistLinks: ArtistLink[]
}

export default async function MusicSection({
  artistSlug,
  locale,
  artistLinks,
}: MusicSectionProps) {
  let catalogue
  try {
    catalogue = await getSongs(artistSlug, locale)
  } catch (err) {
    // Le message porte déjà le slug et la locale (voir client.ts).
    console.error('[MusicSection]', err)
    return null
  }

  // Catalogue vide : état légitime, pas une panne. Un artiste qui n'a rien
  // publié n'a pas de section musique.
  if (catalogue.songs.length === 0) return null

  const featuredSlug =
    catalogue.songs.find((song) => song.isFeatured)?.slug ?? null

  return (
    <>
      <SongSwitcher songs={catalogue.songs} featuredSlug={featuredSlug} />

      <div className="mt-8">
        <p className="mb-2 text-xs font-medium text-muted">{copy.heading}</p>
        <ul className="flex flex-wrap gap-1">
          {artistLinks.map(({ name, href, icon }) => (
            <li key={name}>
              <ExternalLink
                href={href}
                aria-label={`${catalogue.artistName} sur ${name}, nouvel onglet`}
                showArrow={false}
                className="flex items-center justify-center rounded-md p-2.5 text-muted transition-colors duration-200 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                <BrandIcon name={icon} />
              </ExternalLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
