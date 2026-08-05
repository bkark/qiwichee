import AtelierGate from "@/components/AtelierGate";
import ReleaseSwitcher from "./components/ReleaseSwitcher";
import { releases } from "@/data/releases";

// ─────────────────────────────────────────────────────────────
// ARTIST DATA — the ONLY block that changes per artist in the
// Résonance template. Everything below is reusable structure.
// ─────────────────────────────────────────────────────────────
const artist = {
  name: "Qiwi Chee",
  url: "https://qiwichee.com",
  genre: "Hybrid Pop",
  description:
    "Franco-Algerian-American singer-songwriter based in Paris. Hybrid pop in French and English.",
  // sameAs = verified official profiles. Identity-linking for search + AI.
  sameAs: [
    "https://open.spotify.com/artist/4Bu89sfVzy14qW0dK8Ugbs",
    "https://www.instagram.com/qiwichee/",
    "https://qiwichee.bandcamp.com/",
    "https://www.youtube.com/@qiwichee",
    "https://msha.ke/qiwichee/",
  ],
  // Streaming/social links rendered in the Music section.
  links: [
    { name: "Spotify",     href: "https://open.spotify.com/artist/4Bu89sfVzy14qW0dK8Ugbs" },
    { name: "Apple Music", href: "https://music.apple.com/fr/artist/qiwi-chee/1676154343" },
    { name: "Deezer",      href: "https://www.deezer.com/fr/artist/204585817" },
    { name: "YouTube",     href: "https://www.youtube.com/@qiwichee" },
    { name: "Bandcamp",    href: "https://qiwichee.bandcamp.com/" },
    { name: "Instagram",   href: "https://www.instagram.com/qiwichee/" },
  ],
};

// schema.org MusicGroup — alternateName links the LEILANI back catalogue to this identity.
const musicGroupSchema = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  name: artist.name,
  alternateName: "LEILANI",
  url: artist.url,
  genre: artist.genre,
  description: artist.description,
  sameAs: artist.sameAs,
};

const lullabiesEmbed = releases[0].embed // always Lullabies (canonical DOM order, fixed)
const videoObjectSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: lullabiesEmbed.title,
  description: "Le clip officiel de Lullabies par Qiwi Chee.",
  embedUrl: `https://www.youtube-nocookie.com/embed/${lullabiesEmbed.assetId}`,
  contentUrl: `https://youtu.be/${lullabiesEmbed.assetId}`,
};

// MusicAlbum / MusicRecording per release — byArtist always the same MusicGroup.
// Dilemma: byArtist carries alternateName so search/AI can merge LEILANI → Qiwi Chee.
const byArtist = { "@type": "MusicGroup", name: artist.name, alternateName: "LEILANI", url: artist.url }
const musicReleasesSchema = [
  {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    name: "Lullabies",
    byArtist,
    url: `https://youtu.be/${lullabiesEmbed.assetId}`,
  },
  {
    "@context": "https://schema.org",
    "@type": "MusicAlbum",
    name: "Hybrid Fruit",
    numTracks: 6,
    datePublished: "2024-10-27",
    byArtist,
    url: "https://qiwichee.bandcamp.com/album/hybrid-fruit",
  },
  {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    name: "Une dernière chose",
    datePublished: "2023-03-31",
    byArtist,
    url: "https://qiwichee.bandcamp.com/track/une-derni-re-chose",
  },
  {
    "@context": "https://schema.org",
    "@type": "MusicAlbum",
    name: "Dilemma",
    byArtist,
    url: "https://leilanigroove.bandcamp.com/album/dilemma",
  },
]

// searchParams carries error codes forwarded from the auth callback
type SearchParams = Promise<{ error?: string }>

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const { error } = await searchParams;
  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Structured data — invisible to humans, read by crawlers/AI */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(musicGroupSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoObjectSchema) }}
      />
      {musicReleasesSchema.map((schema) => (
        <script
          key={schema.name}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <header className="border-b border-border">
        <nav
          aria-label="Primary"
          className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5"
        >
          <span className="font-display text-lg font-semibold tracking-tight">Qiwi Chee</span>
          <ul className="flex gap-6 text-sm">
            <li>
              <a className="hover:underline" href="#music">
                Music
              </a>
            </li>
            <li>
              <a className="hover:underline" href="#about">
                About
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-6">
        <section className="py-20" aria-labelledby="hero-heading">
          <h1
            id="hero-heading"
            className="font-display text-4xl font-semibold tracking-tight sm:text-5xl"
          >
            Qiwi Chee
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted">
            Franco-Algerian-American singer-songwriter based in Paris. Hybrid pop
            in French and English.
          </p>
        </section>

        <AtelierGate initialError={error} />

        <section
          id="music"
          className="border-t border-border py-16"
          aria-labelledby="music-heading"
        >
          <h2 id="music-heading" className="font-display text-2xl font-semibold tracking-tight">
            Music
          </h2>
          <ReleaseSwitcher artistLinks={artist.links} />
        </section>

        <section
          id="about"
          className="border-t border-border py-16"
          aria-labelledby="about-heading"
        >
          <h2 id="about-heading" className="font-display text-2xl font-semibold tracking-tight">
            About
          </h2>
          <p className="mt-4 max-w-xl text-muted">
            Placeholder bio. Replace this with Qiwi Chee’s real story once
            the structure is confirmed.
          </p>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-3xl px-6 py-8 text-sm text-muted">
          <p>&copy; {new Date().getFullYear()} Qiwi Chee. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
