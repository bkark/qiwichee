import ExternalLink from "./components/ExternalLink";

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
};

// schema.org MusicGroup — machine-readable identity card.
// Server-rendered into the page so crawlers and AI agents read it directly.
const musicGroupSchema = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  name: artist.name,
  url: artist.url,
  genre: artist.genre,
  description: artist.description,
  sameAs: artist.sameAs,
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Structured data — invisible to humans, read by crawlers/AI */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(musicGroupSchema) }}
      />

      <header className="border-b border-zinc-200">
        <nav
          aria-label="Primary"
          className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5"
        >
          <span className="text-lg font-semibold tracking-tight">Qiwi Chee</span>
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
            className="text-4xl font-semibold tracking-tight sm:text-5xl"
          >
            Qiwi Chee
          </h1>
          <p className="mt-4 max-w-xl text-lg text-zinc-600">
            Franco-Algerian-American singer-songwriter based in Paris. Hybrid pop
            in French and English.
          </p>
        </section>

        <section
          id="music"
          className="border-t border-zinc-200 py-16"
          aria-labelledby="music-heading"
        >
          <h2 id="music-heading" className="text-2xl font-semibold tracking-tight">
            Music
          </h2>
          <p className="mt-4 text-zinc-600">Listen on your platform of choice.</p>
          <ul className="mt-6 flex flex-wrap gap-4 text-sm">
            <li>
              <ExternalLink
                className="rounded-md border border-zinc-300 px-4 py-2 hover:bg-zinc-50"
                href="https://open.spotify.com/artist/4Bu89sfVzy14qW0dK8Ugbs"
              >
                Spotify
              </ExternalLink>
            </li>
            <li>
              <ExternalLink
                className="rounded-md border border-zinc-300 px-4 py-2 hover:bg-zinc-50"
                href="https://www.youtube.com/@qiwichee"
              >
                YouTube
              </ExternalLink>
            </li>
            <li>
              <ExternalLink
                className="rounded-md border border-zinc-300 px-4 py-2 hover:bg-zinc-50"
                href="https://qiwichee.bandcamp.com/"
              >
                Bandcamp
              </ExternalLink>
            </li>
            <li>
              <ExternalLink
                className="rounded-md border border-zinc-300 px-4 py-2 hover:bg-zinc-50"
                href="https://www.instagram.com/qiwichee/"
              >
                Instagram
              </ExternalLink>
            </li>
          </ul>
        </section>

        <section
          id="about"
          className="border-t border-zinc-200 py-16"
          aria-labelledby="about-heading"
        >
          <h2 id="about-heading" className="text-2xl font-semibold tracking-tight">
            About
          </h2>
          <p className="mt-4 max-w-xl text-zinc-600">
            Placeholder bio. Replace this with Qiwi Chee&rsquo;s real story once
            the structure is confirmed.
          </p>
        </section>
      </main>

      <footer className="border-t border-zinc-200">
        <div className="mx-auto max-w-3xl px-6 py-8 text-sm text-zinc-500">
          <p>&copy; {new Date().getFullYear()} Qiwi Chee. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
