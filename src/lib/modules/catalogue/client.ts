// =============================================================================
// src/lib/modules/catalogue/client.ts
//
// ★★ PREMIER DES CINQ CLIENTS DE MODULE — IL FAIT JURISPRUDENCE.
//    bioClient, copyClient, contactClient et modulesClient suivront cette forme.
//    Écrire le deuxième différemment du premier, c'est avoir deux conventions
//    pour toujours.
//
// FORME RETENUE :
//   · une fonction par lecture, nommée d'après le domaine (getSongs)
//   · le slug de l'artiste est un PARAMÈTRE, jamais une constante importée
//   · Zod valide le retour BRUT du RPC (la base peut changer sous nos pieds)
//   · un mapping explicite vers les types métier
//   · ★ LE CLIENT LÈVE. Il ne rend pas null, il ne logue pas en silence.
//     C'est l'APPELANT (une section serveur) qui décide quoi montrer.
//     BioSection fait l'inverse aujourd'hui : elle logue et rend null, donc la
//     section disparaît sans que personne le sache. Pour la musique, une section
//     absente c'est la page privée de son contenu principal — il faut que ça se
//     voie dans les logs serveur, pas juste dans la console.
//
// ⚠️ CE FICHIER EST LE SEUL ENDROIT DU MODULE QUI PARLE À SUPABASE.
//    Aucun composant n'importe createClient (contrat d'architecture).
// =============================================================================

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import type { MediaAsset, MediaProvider, MediaType } from '@/lib/media/types'
import type { Catalogue, Credit, Song, SongRelease } from './types'

// ── Forme BRUTE du RPC ───────────────────────────────────────────────────────
// Miroir exact des colonnes de get_songs. Si la base change, Zod échoue ICI,
// bruyamment, plutôt que de laisser un undefined filtrer jusqu'au rendu.

const creditSchema = z.object({ role: z.string(), name: z.string() })

const rowSchema = z.object({
  artist_name: z.string(),
  song_slug: z.string(),
  song_title: z.string(),
  song_descriptor: z.string().nullable(),
  song_credits: z.array(creditSchema).nullable(),
  is_featured: z.boolean(),
  release_slug: z.string().nullable(),
  release_title: z.string().nullable(),
  release_type: z.enum(['album', 'ep', 'single']).nullable(),
  release_descriptor: z.string().nullable(),
  released_on: z.string().nullable(),
  buy_url: z.string().nullable(),
  embed_options: z
    .object({ bgcol: z.string().optional(), linkcol: z.string().optional() })
    .nullable(),
  track_no: z.number().nullable(),
  audio_url: z.string().nullable(),
  media_provider: z.enum(['youtube', 'bandcamp']).nullable(),
  media_asset_id: z.string().nullable(),
  media_type: z.enum(['video', 'audio', 'livestream']).nullable(),
  artwork: z.string().nullable(),
  artwork_alt: z.string().nullable(),
  resolved_locale: z.string().nullable(),
})

const rowsSchema = z.array(rowSchema)

type Row = z.infer<typeof rowSchema>

// ── Helpers explicites (contrat : « pas de magie cachée ») ───────────────────

/**
 * Construit le MediaAsset attendu par EmbedPlayer.
 *
 * ★ `title` est OBLIGATOIRE côté EmbedPlayer : il alimente le title de l'iframe
 *   ET le aria-label « Lire : … ». Le RPC ne le stocke pas — on le COMPOSE.
 *   « Qiwi Chee — Flatline » plutôt que « Flatline » seul : un lecteur d'écran
 *   et un moteur de recherche gagnent tous les deux le contexte de l'artiste.
 *
 * ★ La base garantit déjà que provider et assetId vont par paire
 *   (contrainte songs_media_pair_check). On revérifie quand même : une
 *   contrainte peut être retirée, ce code ne doit pas rendre une iframe vide.
 */
function buildMediaAsset(row: Row, artistName: string): MediaAsset | null {
  if (!row.media_provider || !row.media_asset_id) return null

  return {
    provider: row.media_provider as MediaProvider,
    assetId: row.media_asset_id,
    type: (row.media_type ?? 'audio') as MediaType,
    title: `${artistName} — ${row.song_title}`,
    // ★ SEULE EXCEPTION HEX HORS :root, et elle est assumée : ce sont des
    //   paramètres d'URL du lecteur Bandcamp, pas des styles de composant.
    //   Les omettre ferait retomber mediaService sur ses défauts (prune) —
    //   régression visible sur la palette Lullabies.
    ...(row.embed_options ? { embedOptions: row.embed_options } : {}),
  }
}

function buildRelease(row: Row): SongRelease | null {
  if (!row.release_slug || !row.release_title || !row.release_type) return null
  return {
    slug: row.release_slug,
    title: row.release_title,
    type: row.release_type,
    descriptor: row.release_descriptor,
    releasedOn: row.released_on,
    buyUrl: row.buy_url,
  }
}

function toSong(row: Row, artistName: string): Song {
  const release = buildRelease(row)
  return {
    slug: row.song_slug,
    title: row.song_title,
    descriptor: row.song_descriptor,
    credits: (row.song_credits ?? []) as Credit[],
    isFeatured: row.is_featured,
    trackNo: row.track_no,
    release,
    // voir types.ts : la clé de palette est celle de la SORTIE
    paletteKey: release?.slug ?? null,
    media: buildMediaAsset(row, artistName),
    audioUrl: row.audio_url,
    artwork: row.artwork,
    artworkAlt: row.artwork_alt,
  }
}

// ── API publique du module ───────────────────────────────────────────────────

/**
 * Lit le catalogue d'un artiste dans la langue demandée.
 *
 * @throws si le RPC échoue ou si la forme du retour a changé.
 *         L'appelant décide de l'affichage dégradé — voir MusicSection.
 */
export async function getSongs(
  artistSlug: string,
  locale: string,
): Promise<Catalogue> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc('get_songs', {
    p_artist_slug: artistSlug,
    p_locale: locale,
  })

  if (error) {
    throw new Error(
      `[catalogueClient.getSongs] RPC en échec pour « ${artistSlug} » / ${locale} : ${error.message}`,
    )
  }

  const parsed = rowsSchema.safeParse(data ?? [])
  if (!parsed.success) {
    throw new Error(
      `[catalogueClient.getSongs] forme inattendue du RPC : ${parsed.error.message}`,
    )
  }

  const rows = parsed.data

  // Catalogue vide : ce n'est PAS une erreur. Un artiste qui n'a rien publié
  // est un état légitime — l'appelant choisit de masquer la section.
  if (rows.length === 0) {
    return { artistName: '', songs: [], resolvedLocale: null }
  }

  const artistName = rows[0].artist_name

  return {
    artistName,
    songs: rows.map((row) => toSong(row, artistName)),
    resolvedLocale: rows.find((r) => r.resolved_locale)?.resolved_locale ?? null,
  }
}
