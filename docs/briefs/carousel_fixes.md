# BRIEF — Carousel fixes v1 (post-launch, user-tested 2026-07-15)
> Repo path when adopted: `docs/briefs/carousel_fixes.md`
> Hand to Claude Code scoped. NO auto-commit — Bassim reviews the full diff and
> commits manually. End with `git status` AND full contents of every created/modified file.
> If EmbedPlayer or any SHARED component changes, say so at the TOP of the summary.

---

## CONTEXT

The release-switcher carousel (commit caf0938) is live and working: swipe browses,
page recolours, Bandcamp plays in-page. Real-device testing (Android Chrome) found
the bugs below. Fix ONLY what is listed IN. The OUT list exists because those
"fixes" violate locked project decisions — do not build them, do not "improve" into them.

---

## IN — six fixes + one asset swap

### 1. Single active player (two tracks can play simultaneously) — THE PRIORITY
Observed: play Dilemma, then play Une dernière chose → both audible at once.
Cause: each EmbedPlayer mounts its own iframe on click; players are independent.

FIX — lift "active embed" state up, kill the previous iframe:
- ReleaseSwitcher owns `activeEmbedSlug: string | null`.
- EmbedPlayer gains a CONTROLLED mode: props `isActive` + `onActivate` (keep the
  existing uncontrolled behaviour as default so the Atelier insider clip and any
  other standalone usage are NOT affected — this is a SHARED component, flag it).
- Clicking play on slide B → carousel sets activeEmbedSlug = B → slide A's
  EmbedPlayer receives isActive=false → unmounts its iframe, returns to poster.
- ONE iframe alive at any time. No audio API, no fetching Bandcamp files directly,
  no singleton Audio() manager — the iframe teardown IS the stop mechanism.

### 2. Card vertical alignment (missing release date drops a line)
Observed: Lullabies has no `date` → its content sits higher than neighbours.
FIX: slides are already flex-col. Give the title/descriptor/date text block a
consistent min-height (or render an invisible placeholder line when date is
absent — `aria-hidden`, `&nbsp;` or a min-h utility). Tokens/Tailwind only.
All four cards must align at the artwork top edge regardless of date presence.

### 3. Blank white area when swiping past Dilemma (mobile)
Observed: overscrolling past the last slide lands on empty space, offset from
the wrapper; user must swipe back.
FIX the ROOT CAUSE — likely trailing gap/padding creating a phantom snap area,
or the scroller's content box extending past the last slide. Inspect and correct
padding/margin/gap at the container edges; consider `scroll-padding` /
`overscroll-behavior-x: contain` on the scroller.
⛔ Do NOT implement infinite looping or cloned slides (see OUT).

### 4. Iframe network-error resilience (best-effort only)
Observed: mobile network change (Wi-Fi→4G) left the Bandcamp iframe showing
Chrome's "A network change was detected" error inside the card.
REALITY CHECK: the iframe is cross-origin — its internal errors are NOT
observable from our page. Do what is actually possible:
- Listen to the iframe `error` event and `navigator.onLine` offline→online
  transitions; on either signal affecting the ACTIVE embed, unmount the iframe
  back to the poster state so one tap reloads it fresh.
- Poster/consent flow already exists — reuse it. No spinner framework, no retry
  loops, no reconnection UI beyond returning to the clickable poster.

### 5. Desktop arrows (no affordance for mouse users)
- Show prev/next arrow buttons over the carousel edges ONLY on fine pointers:
  CSS `@media (pointer: fine)` (no JS touch-sniffing).
- Buttons: real `<button>`s, aria-labels ("Sortie précédente" / "Sortie suivante"),
  ≥44px targets, visible focus ring via tokens, disabled state at the ends
  (no wrap-around). Click → same scrollToSlide() the dots use.
- Arrows must NOT overlap/obscure the play button or platform links.

### 6. Lazy-load cover images
- `loading="lazy"` on the artwork images (all four are offscreen candidates).
- If artwork renders via next/Image it may already lazy-load by default — VERIFY
  what the current EmbedPlayer poster does before changing anything, and say
  what you found. Do not add a second lazy mechanism on top of an existing one.

### 7. Lullabies artwork swap
New file provided by Bassim (cleaner visual):
  /media/Main_HDD/GDrive/Resonance/04_Qiwichee/Lullabies/lullabies1.png
- Convert to JPG/WebP (photographic content; match the other covers' format),
  reasonable web size, replace public/lullabies-cover.jpg.
- Check its aspect ratio: if square, ALSO remove the "visuel provisoire" wording
  from artworkAlt in src/data/releases.ts (it is no longer the 16:9 placeholder).
  If still 16:9, keep the placeholder note and say so.
- The Hybrid Fruit 350px placeholder stays — its replacement is still pending.

---

## OUT — explicitly forbidden (locked decisions; do not build)

- ⛔ AUTOPLAY of any kind: no auto-advance to next track on `ended`, no radio
  mode, no carousel auto-slide. Standing media policy: consent-first,
  click-to-play, WCAG auto-audio. A track ending = silence until the user acts.
- ⛔ INFINITE LOOP / cloned slides: duplicate DOM = duplicate content for
  crawlers + reintroduces the hydration trap. Four real slides, hard ends.
- ⛔ "Join L'Atelier" popup triggered by listening behaviour: requires listen
  tracking (analytics layer is DEFERRED behind the consent decision) and
  interrupts listening. Not now, possibly not ever in popup form.
- ⛔ Fetching/streaming Bandcamp audio into our own <audio> element or custom
  player chrome around their content — rights/ToS territory; embeds only.
- ⛔ Sticky bottom global player bar — out of scope, new surface, not briefed.
- ⛔ Restructuring to <ol>/<li>/<article> — defer; the current group/aria
  structure was built to the a11y checklist. Semantic restructure is its own
  small a11y pass later, not a drive-by here.

## KNOWN / PARKED (do not fix here, do not delete these notes)
- Keyboard tab-order drags through all off-screen slides' links (~28 stops).
  Real a11y debt; fix is roving tabindex or `inert` on non-active slides —
  needs its own careful pass. PARKED.
- Hybrid Fruit hi-res artwork + palette approvals + Dilemma descriptor wording:
  pending Qiwi Chee (out of country).

## VERIFY BEFORE CLOSING
- Play A then play B → A's iframe is GONE (poster restored), only B audible.
- Atelier insider clip still works unchanged (uncontrolled EmbedPlayer mode).
- All four cards top-aligned, with and without date.
- Swipe past Dilemma → snaps back to Dilemma, no blank area.
- Desktop: arrows visible with mouse, absent on touch, keyboard operable,
  disabled at ends; dots still work.
- npm run build clean. Hex grep clean (tokens only; Bandcamp URL params exempt).
- git status + full files shown. NO commit.
