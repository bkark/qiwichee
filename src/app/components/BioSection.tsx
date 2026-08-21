import { createClient } from '@/lib/supabase/server'
import { ARTIST_SLUG } from '@/lib/constants'
import { z } from 'zod'
import BioSwitcher from './BioSwitcher'

const creditsSchema = z.array(z.object({ role: z.string(), name: z.string() }))

const bioBlockSchema = z.object({
  slug: z.string(),
  sort_order: z.number(),
  title: z.string(),
  body: z.string(),
  image_path: z.string(),
  image_hd_path: z.string().nullable().optional(),
  image_alt: z.string(),
  credits: creditsSchema,
})

const bioBlocksSchema = z.array(bioBlockSchema)

export default async function BioSection() {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('get_bio_blocks', {
    p_artist_slug: ARTIST_SLUG,
    p_usage: 'web',
  })

  if (error) {
    console.error('[BioSection] get_bio_blocks a échoué :', error)
    return null
  }
  if (!data) return null

  const parsed = bioBlocksSchema.safeParse(data)
  if (!parsed.success) {
    console.error('[BioSection] schéma Zod invalide :', parsed.error)
    return null
  }
  if (parsed.data.length === 0) return null

  return <BioSwitcher blocks={parsed.data} />
}
