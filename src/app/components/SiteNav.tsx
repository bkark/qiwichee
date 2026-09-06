import Link from 'next/link'

export default function SiteNav() {
  return (
      <header className="sticky top-0 z-40 border-b border-border bg-bg">

        {/* ⚠️ py-2 ≈ 44px de haut. Si cette valeur change, le `scroll-mt-*` des
    sections ancrées dans (public)/page.tsx doit suivre — sinon les titres
    passent sous le header ou flottent trop bas. Deux valeurs couplées, et
    rien dans le code ne les relie. */}
    
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-3xl items-center justify-between px-6 py-2"
      >
        <Link href="/" className="font-display text-lg font-semibold tracking-tight">
          Qiwi Chee
        </Link>
        <ul className="flex gap-6 text-sm">
                  {/* ★ <a> DÉLIBÉRÉ sur les ancres : <Link> ne garantit pas le défilement
            vers l'ancre lors d'un changement de route. Vérifié en local :
            /contact → « Musique » arrive bien SUR la section. Un rechargement
            complet est le prix, et il est acceptable pour deux liens. */}
          <li>
                        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a className="hover:underline" href="/#music">
              Musique
            </a>
          </li>
          <li>
                        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a className="hover:underline" href="/#about">
              À propos
            </a>
          </li>
          <li>
            <Link className="hover:underline" href="/contact">
              Contact
            </Link>
          </li>
          
        </ul>
      </nav>
    </header>
  )
}
