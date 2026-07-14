# BRIEF — Music Release-Switcher (horizontal snap carousel)
> Repo path when adopted: `docs/briefs/release_switcher.md`
> Drafted 2026-07-14. Hand to Claude Code scoped. NO auto-commit — Bassim reviews the
> full diff and commits manually. Show `git status` AND full files at the end.

---

## GOAL

The release-switcher IS the `[data-release]` feature: selecting a release recolours the
page accent. This brief builds it as a **horizontal scroll-snap carousel** — the mobile
swipe gesture fans already have from social media becomes the release selector.

**Signature element (the one memorable thing): the page recolours as you swipe.**
Everything else stays quiet. No other section of the page goes horizontal in this build.

---

## SCOPE

### IN
- One horizontal carousel section on the homepage: one slide per release.
- Each slide = wrapped in `<div data-release="SLUG">`, overriding ACCENT tokens only.
- One `EmbedPlayer` per slide. Bandcamp/full-audio LEADS; Spotify/Apple = small
  "also on →" `ExternalLink`s.
- Featured release randomised on load — as a CLIENT-SIDE SCROLL POSITION, never as
  DOM order (see HYDRATION TRAP below).
- Per-release palettes: hand-picked, AA-verified, defined as token overrides.
- Dot indicators + partial-peek affordance.

### OUT (do not build, do not "improve into")
- Analytics/instrumentation (separate decision — `log_event` RPC pattern, own brief).
- Photo strip / bio section (photos parked, waiting on that build).
- Lyrics / music sheets (new content types; rights review first).
- Any autoplay, auto-advance, or snippet cycling (ruled out: consent, WCAG, flaky APIs).
- Horizontal navigation BETWEEN page sections. Vertical spine + anchors is the nav model.
- The Atelier gate. It is NEVER wrapped in `[data-release]` and never inside the carousel.

---

## STRUCTURE — pure CSS scroll-snap, no carousel library

```
<section aria-label="Musique — parcourir les sorties">        <- vertical-spine section
  <div class="scroller" tabindex="0" role="group"             <- the snap container
       aria-roledescription="carrousel" aria-label="Sorties">
    <div data-release="lullabies">      … slide …  </div>
    <div data-release="hybrid-fruit">   … slide …  </div>
    <div data-release="une-derniere-chose"> … slide … </div>
  </div>
  <div>dot indicators (BUTTONS, not divs)</div>
</section>
```

- Scroller: `overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch`.
- Slide: `scroll-snap-align: center; flex: 0 0 88%` (or similar) — the ~12% remainder IS
  the partial-peek affordance. The next slide's edge must be visible at rest on mobile.
  This is the strongest "there's more →" signal; do not make slides 100% wide.
- WHY no JS carousel library (telecom: passive splitter over active mux — nothing to fail):
  - SEO/AI-agents: every slide is real server-rendered HTML from the first byte.
  - No dependency, no hydration cost, native momentum scrolling.
  - Keyboard scroll works natively once the container is focusable.

---

## ⚠️ HYDRATION TRAP — randomised featured release

"Random on load" done in the render path = server HTML ≠ client render = React
hydration mismatch, AND crawlers see a different page each visit.

**RULE: DOM order is FIXED (canonical release order). Randomisation is ONLY a scroll
position applied client-side after mount.**

- `useEffect` on mount: pick a random index → `scroller.scrollTo({ left: …, behavior: 'instant' })`.
- `behavior: 'instant'` (or 'auto') — never smooth-scroll on load. This also makes the
  randomisation `prefers-reduced-motion`-safe with zero extra code.
- Set the matching dot active in the same effect.
- SSR output is therefore deterministic; SEO and hydration are untouched.

---

## PER-RELEASE PALETTES (tokens only — hex lives in globals.css, NEVER in components)

- Each `[data-release="SLUG"]` overrides ACCENT-ROLE tokens only. STRUCTURE tokens
  (bg / surface / text / border / border-strong) stay constant — established architecture.
- Hand-pick each accent from the release artwork. VERIFY AA for every override:
  - white (or text-on-accent token) on accent ≥ 4.5:1
  - accent on bg ≥ 3:1 where used as a non-text/UI colour, ≥ 4.5:1 where used as text
  Record the ratios as a comment next to each override (same convention as prune #7A3B8C).
- Recolour transition: a short `transition` on the affected properties is fine, but wrap
  it in `@media (prefers-reduced-motion: no-preference)`.
- Which release is "active" (drives the page-level accent outside the slide, if any):
  an IntersectionObserver watching slide centring. Threshold ~0.6. The same observer
  drives the dot indicators — one observer, two consumers.

---

## SLIDE CONTENT (per release)

1. Artwork (`next/Image`, meaningful alt, local file — NO third-party CDN fetch).
2. Release title + one-line descriptor.
3. `EmbedPlayer` — lazy/consent, click-to-play. Bandcamp (or the release's YouTube clip)
   as the LEAD full-audio embed. Existing component; if it needs a prop added, that is a
   SHARED-COMPONENT change — call it out explicitly in the diff summary.
4. "Aussi sur →" row: small `ExternalLink`s (Spotify / Apple / Deezer). Existing
   verified URLs from the `artist.links` array ONLY — never insert an unverified ID.
5. Optional in-slide text link that anchors DOWN the page (e.g. to L'Atelier). Links,
   not gestures, for cross-section jumps.

Data: a `releases` array (slug, title, palette slug, embed ref, artwork, links) —
same per-artist data pattern as `artist.links`. Only VERIFIED refs; source from the
canonical profile list in CONTEXT_FOR_AI.

---

## ACCESSIBILITY CHECKLIST (WCAG 2.1 AA — verify each, don't assume)

- [ ] Scroller focusable (`tabindex="0"`) with a VISIBLE focus style (focus-visible ring
      via tokens) → arrow-key scrolling works.
- [ ] Dot indicators are `<button>`s with `aria-label="Aller à SORTIE"`, `aria-current`
      on the active one, ≥44px tap targets.
- [ ] `aria-roledescription="carrousel"` + `aria-label` on the group; each slide
      `role="group"` + `aria-label="SORTIE, x sur n"` (or equivalent).
- [ ] All content reachable and operable with keyboard ONLY (embeds included — the
      existing EmbedPlayer is already keyboard accessible; don't regress it).
- [ ] No motion on load; recolour transition behind `prefers-reduced-motion`.
- [ ] Nothing essential is horizontal-only: every release is also reachable via dots
      (buttons) — a screen-reader or keyboard user never NEEDS the swipe gesture.
- [ ] Contrast ratios recorded for every new token value.

---

## SEO / AI-AGENT (standing three-in-one)

- All slides server-rendered, fixed order (see HYDRATION TRAP).
- JSON-LD: extend the existing structured data with `MusicAlbum` / `MusicRecording`
  entries per release, `byArtist` → the existing MusicGroup. Server-rendered, as always.
- No content behind interaction: embeds are lazy, but titles/links/text are in the HTML.

---

## CLAUDE CODE HANDOFF RULES (standing)

- Scoped to this brief. NO auto-commit. Bassim commits manually after full diff review.
- End with `git status` + full contents of every created/modified file.
- New files will NOT show in `git diff` — that's why `git status` is required.
- `grep -rn "#" src` (or targeted hex grep) → components must stay hex-clean; tokens only.
- If `EmbedPlayer` or any SHARED component changes, say so explicitly at the top of the
  summary — shared-component diffs get extra review.
- AA-verify every new colour pair; write the ratio in the CSS comment.
- Do not suggest dashboard steps (Vercel/Supabase) — Bassim handles those; Code can't see them.

---

## VERIFY BEFORE CLOSING (both halves — the happy path alone proves nothing)

- Mobile: swipe browses releases; page accent follows; next-slide edge visibly peeks.
- Load ×5: featured release varies; NO hydration warning in the console.
- Keyboard only: tab to scroller → arrows browse; tab to dots → activate; focus visible.
- View-source (not DevTools DOM): all releases present in the raw server HTML.
- `prefers-reduced-motion: reduce` emulated: no animated recolour, no smooth scroll.
- Lighthouse a11y pass on the homepage after the change.
# APPENDIX — Release-Switcher DATA BLOCK (verified)
> Append to `docs/briefs/release_switcher.md`. Assembled 2026-07-14 with Bassim.
> Everything here is VERIFIED from a canonical source. Claude Code must NOT invent,
> guess, or "improve" any value below. If something is missing, STOP and ask.

---

## 1. RELEASES — canonical DOM order (newest first, FIXED — see HYDRATION TRAP)

| # | slug | title | type | lead embed | date |
|---|---|---|---|---|---|
| 1 | `lullabies` | Lullabies | single (MV) | YouTube `L0mHWXa2UyQ` | — |
| 2 | `hybrid-fruit` | Hybrid Fruit | album (6 titres) | Bandcamp `album=2331494883` | 27 oct 2024 |
| 3 | `une-derniere-chose` | Une dernière chose | single | Bandcamp `track=2132072682` | 31 mars 2023 |
| 4 | `dilemma` | Dilemma | album | Bandcamp `album=2503435136` | LEILANI era |

**Canonical URLs (source: browser address bar / Bandcamp embed dialog, 2026-07-14):**
```
qiwichee.bandcamp.com/album/hybrid-fruit
qiwichee.bandcamp.com/track/une-derni-re-chose
leilanigroove.bandcamp.com/album/dilemma      <- different account (LEILANI)
youtu.be/L0mHWXa2UyQ                          <- Lullabies official MV
```

**Bandcamp iframe src pattern (verified):**
```
https://bandcamp.com/EmbeddedPlayer/album=<ID>/size=large/bgcol=<hex>/linkcol=<hex>/tracklist=false/transparent=true/
```
⚠️ `bgcol` / `linkcol` are **URL parameters for a third party**, not component styles. They
are the ONE legitimate place a hex appears outside `globals.css`. Feed them from the release's
palette values and **leave a code comment saying so**, or a future hex-grep will flag a false
positive.

---

## 2. DILEMMA / LEILANI — identity decision (settled)

Qiwi Chee is **not** burying the LEILANI name — it is simply a former artist name.
Therefore:
- Dilemma ships as a **full slide**, not hidden.
- JSON-LD: the existing `MusicGroup` gains **`"alternateName": "LEILANI"`**.
- Dilemma's `MusicAlbum` → `byArtist` → **the same MusicGroup** (same person, prior name).
  This lets search engines and AI agents merge the two identities instead of treating
  LEILANI as a stranger — the back catalogue starts feeding the fan machine.
- Slide descriptor should carry the context so a new fan doesn't blink, e.g.
  *"Dilemma — sorti sous le nom LEILANI"*. **Copy is Qiwi Chee's voice → she confirms wording.**

---

## 3. ARTWORK — files on disk

Staging root (NEW — the old `~/GDrive/...` path is dead, see session notes):
`/media/Main_HDD/GDrive/Resonance/04_Qiwichee/`

| slug | file | dims | status |
|---|---|---|---|
| `lullabies` | `Lullabies/Lullabies.png` | 1366×768 | ⚠️ **PLACEHOLDER** — 16:9 YouTube screenshot, not cover art |
| `hybrid-fruit` | `Hybrid Fruit/Hybrid Fruit.jpg` | 350×350 | ⚠️ **PLACEHOLDER** — Bandcamp thumbnail, blurry at 2× |
| `une-derniere-chose` | `Une dernière chose-Photo/une derniere chose-IMG-20250608-WA0002.jpg` | 1600×1600 | ✅ good |
| `dilemma` | `Dilemma/Dilemma-cover~3.jpg` | 1200×1200 | ✅ good |

**PENDING WHATSAPP ASK → Qiwi Chee:** square Lullabies cover (the Spotify/Deezer one) +
Hybrid Fruit source file. Both are drop-in replacements in `public/` — **no code change**.
Do NOT let the placeholders quietly become permanent.

**Prep before `public/`:** rename to slug-based ASCII filenames (no spaces/accents), convert
the PNG to JPG/WebP (photographic content in PNG is pure waste), keep square crops.
Meaningful `alt` per image. `next/Image`, local files only — NO third-party CDN fetch.

*(Note: the other six `IMG-2026...` files in the Une-dernière-chose folder are the photo batch
for the PARKED bio/images build. Out of scope here. Don't touch.)*

---

## 4. PALETTES — one accent per release

### `lullabies` → **NO OVERRIDE** (deliberate)
The site's default accent **prune `#7A3B8C`** was itself extracted from the Lullabies MV.
So Lullabies **is** the base palette. Its `[data-release]` div carries no accent overrides —
swiping to it returns the page to base colour. Zero new tokens, zero new AA checks.

### The three overrides (PROPOSED — Qiwi Chee's veto stands, same as prune-vs-periwinkle)

| slug | accent | reading | white-on-accent |
|---|---|---|---|
| `hybrid-fruit` | `#C2185B` framboise | the artwork's hot magenta-fuchsia vortex | **5.40:1** ✅ |
| `une-derniere-chose` | `#1C6E8C` bleu d'eau profond | the water's deep petrol undertone (the pale blue is too light to be an accent) | **5.74:1** ✅ |
| `dilemma` | `#9E1B32` carmin profond | the cover's red half — purple is already the site identity, so Dilemma takes the other side of the dilemma | **7.90:1** ✅ |

Carousel spread: purple → pink → blue → red. No two neighbours alike.

### ⚠️ AA VERIFICATION IS NOT DONE — Claude Code MUST re-verify
- The **white-on-accent** ratios above are exact.
- The **accent-on-bg** ratios were *derived* (back-calculated from prune's recorded 6.23:1),
  **not measured against the real `--bg` token.**
- **RE-COMPUTE ALL SIX PAIRS against the actual token values in `globals.css`** before writing
  anything. Required: white-on-accent ≥ 4.5:1; accent-on-bg ≥ 3:1 as UI colour, ≥ 4.5:1 as text.
- Record every measured ratio in a CSS comment next to the override — same convention as
  `#7A3B8C`. If a pair fails, darken the accent and say so; do not ship an unverified colour.
- STRUCTURE tokens (bg/surface/text/border/border-strong) stay **constant**. Accent roles only.

---

## 5. PLATFORM LINKS PER SLIDE ("Aussi sur →")

Use the existing **`artist.links`** array ONLY (six verified URLs: Spotify, Apple Music, Deezer,
YouTube, Bandcamp, Instagram). `ExternalLink` component. **NEVER insert an unverified ID or URL.**
No per-release Spotify/Apple deep links exist in verified form yet — if a slide wants one, it is a
NEW verified value and must be sourced from the browser address bar first. Don't guess it.

---

## 6. STILL OPEN — do not let these vanish

- [ ] WhatsApp Qiwi Chee: square Lullabies cover + Hybrid Fruit source file.
- [ ] WhatsApp Qiwi Chee: approve/veto the three accent colours (send swatches + covers).
- [ ] WhatsApp Qiwi Chee: confirm the Dilemma/LEILANI slide descriptor wording.
- [ ] Replace both placeholder images once received.
