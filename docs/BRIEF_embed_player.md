# BRIEF — EmbedPlayer (reusable lazy/consent media player) + first two placements

**For:** Claude Code, repo `/home/simba/Projects/qiwichee` (Next.js 16, TS, Tailwind 4 CSS-first `@theme`).
**Owner reviews the diff and commits.** Do NOT commit or push. When done: run `git diff HEAD`, the AA/hex checks below, and stop.

---

## Goal

Build ONE reusable, provider-agnostic media player and place it in two spots:
1. **Front of house (public):** the Lullabies official MV — already public, our designated bait.
2. **Behind the Atelier gate (insider):** a LOCKED "unlocks soon" card using the chosen cover frame, so the slot exists before the real clip arrives.

The real insider clip (an unlisted YouTube ID) is **not available yet**. Build everything around that hole so filling it later is a one-line change (`locked: true → false` + set `assetId`). Do not block on it.

---

## Scope

**IN scope**
- A `mediaService` abstraction that resolves a `{ provider, assetId, type }` descriptor into an embeddable URL. Pure, no network, no side effects.
- An `EmbedPlayer` client component: lazy (poster → iframe on click), consent-by-interaction, keyboard-accessible, themed via tokens only.
- Front-page placement with the public MV (`youtube`, `L0mHWXa2UyQ`).
- A LOCKED insider placement inside the Atelier using `qiwichee_atelier_cover_80s.jpg` as the poster.
- (Should) A server-rendered `VideoObject` JSON-LD block for the public MV on the page that hosts it.

**OUT of scope — do not build**
- Playback of the real insider clip (waiting on the ID).
- Event-engine / livestream wiring. (Keep `'livestream'` in the type union so it's ready, but don't use it.)
- Object storage / signed URLs / insider audio.
- Autoplay before the user clicks; background/looping video.
- Any new DB tables, RPCs, or grants.
- A full Bandcamp implementation. Leave `'bandcamp'` as a future `provider` case in the service (throw "not implemented yet"); don't wire a Bandcamp embed in this pass.

---

## File layout

Match the project's existing convention. Place the media files **beside the existing `supabase/` helpers** (wherever `supabase/client.ts` lives), in a new `media/` folder. The `EmbedPlayer` component goes in the same components folder as `ExternalLink` (`src/app/components/`). If the real paths differ, follow what's already there — these are defaults, not overrides.

Suggested:
```
<lib>/media/types.ts
<lib>/media/mediaService.ts
src/app/components/EmbedPlayer.tsx
```

---

## Types (`types.ts`)

```ts
export type MediaProvider = 'youtube' | 'bandcamp'; // extend later
export type MediaType = 'video' | 'audio' | 'livestream';

export interface MediaAsset {
  provider: MediaProvider;
  assetId: string;   // youtube video id, e.g. 'L0mHWXa2UyQ'
  type: MediaType;
  title: string;     // used for the iframe title + a11y label — REQUIRED
}
```

## `mediaService.ts`

- `getEmbedUrl(asset: MediaAsset): string`
  - `youtube` / `livestream`: return a **privacy-enhanced** URL — `https://www.youtube-nocookie.com/embed/{assetId}?autoplay=1&rel=0`. (`autoplay=1` is acceptable *only* because the iframe is mounted on user click.)
  - `bandcamp`: `throw new Error('bandcamp embed not implemented yet')`.
- No network calls. Pure function. Unit-test-friendly.
- This is the service-layer seam — components must never hardcode a provider URL; they go through `mediaService`.

## `EmbedPlayer.tsx` (`"use client"`)

**Props**
```ts
{
  asset: MediaAsset;
  poster: StaticImageData | string;  // local image (next/Image) — NOT a third-party thumbnail
  posterAlt: string;                 // REQUIRED, non-empty
  locked?: boolean;                  // default false
  lockedLabel?: string;              // shown over the poster when locked
  caption?: string;                  // optional <figcaption>
}
```

**Behavior**
- Render as a `<figure>`. The media area is a fixed-aspect (16:9) container.
- **Unlocked:** the poster is a real `<button>` (keyboard-focusable, visible focus ring, accessible name = `Lire : {asset.title}` / "Play"). A play glyph overlays it (decorative, `aria-hidden`). On click/Enter/Space → swap the poster for the `<iframe>` (this is the lazy + consent moment — **no YouTube network request happens before this click**).
- **Locked:** render the poster as a non-interactive image with an overlay badge showing `lockedLabel` (e.g. "Bientôt — réservé à l'Atelier"). No play button, nothing focusable that implies playback, no iframe. It's a placeholder slot.
- **iframe** (after click): `title={asset.title}`, `loading="lazy"`, `referrerPolicy="strict-origin-when-cross-origin"`, `allow="autoplay; encrypted-media; picture-in-picture; fullscreen"`, `allowFullScreen`, `src={mediaService.getEmbedUrl(asset)}`, fills the 16:9 box.
- Poster image via `next/Image` with `alt={posterAlt}`.
- **Theme:** every colour via existing CSS tokens (`--accent`, `--accent-contrast`, `--surface`, `--border`, etc.). No raw hex anywhere.

---

## Placement 1 — front (public MV)

On the page that currently holds the homepage content, add the player:

```ts
const lullabies: MediaAsset = {
  provider: 'youtube',
  assetId: 'L0mHWXa2UyQ',
  type: 'video',
  title: 'Qiwi Chee — Lullabies (clip officiel)',
};
```

**Poster:** use a LOCAL still committed to `public/` (so no third-party request before consent). If no still exists yet, ship with a token-styled placeholder (solid `--surface` block with the title centred in `--text`) so the lazy/consent architecture is proven now; the real still swaps in later via the `poster` prop. Do not fetch YouTube's thumbnail CDN.

**JSON-LD (should):** in the SERVER component for this page, emit a `VideoObject` block (`name`, `description`, `thumbnailUrl` = the local poster, `uploadDate` if known, `embedUrl` = the nocookie embed, `contentUrl` = `https://youtu.be/L0mHWXa2UyQ`). Keep it alongside the existing `MusicGroup` block. The player is client-side; the JSON-LD is server-rendered — keep that boundary.

---

## Placement 2 — gated insider stub (LOCKED)

Inside the Atelier (in `AtelierContent` or a new insider section component rendered behind the gate), add:

```ts
const insiderClip: MediaAsset = {
  provider: 'youtube',
  assetId: '',                // FILLED when she sends the unlisted ID
  type: 'video',
  title: 'Concert privé — clip Atelier',
};
```
```tsx
<EmbedPlayer
  asset={insiderClip}
  poster={atelierCover80s}            // qiwichee_atelier_cover_80s.jpg
  posterAlt="Qiwi Chee en concert, bannière peinte « Release + Decay »"
  locked
  lockedLabel="Bientôt — réservé à l'Atelier"
  caption="Un extrait qui n'existe nulle part ailleurs."
/>
```
Add a short code comment at this call site: `// UNLOCK: when the unlisted YouTube ID arrives → set assetId and remove `locked``.

---

## Standing requirements (must hold)

- **Lazy + consent:** verify in the browser Network tab that NO request to `youtube-nocookie.com` / `youtube.com` / `googlevideo.com` fires until the play button is clicked.
- **WCAG 2.1 AA:** real `<button>`, visible focus ring (token-based), accessible name on the play control, non-empty `alt`, locked overlay text meets contrast against its backing.
- **Tokens only:** `grep -rn` for hex colours in `src/` — nothing outside `globals.css :root`.
- **SEO/AI:** server-rendered JSON-LD; client interactivity isolated to `EmbedPlayer`.
- **Service layer:** no provider URL built outside `mediaService`.
- **Images:** `next/Image` + `alt`. **External links** (if any added): existing `ExternalLink` component.
- No new env vars, no secrets, nothing `NEXT_PUBLIC` that shouldn't be.

---

## Workflow (hard rules)

1. Do NOT commit or push. Do NOT enable any auto-accept/auto-commit.
2. When finished, run and show `git diff HEAD`.
3. Run the checks: hex grep (above), and confirm the lazy/consent network behaviour.
4. State explicitly which files were created/changed and why.
5. Stop. The owner reviews the diff and commits.

## Acceptance criteria

- [ ] `mediaService.getEmbedUrl` returns the nocookie embed for `youtube`; throws for `bandcamp`.
- [ ] `EmbedPlayer` renders poster-first; iframe mounts only on click; keyboard-operable; focus visible.
- [ ] Locked variant shows the cover + badge, no playback, nothing misleading to AT.
- [ ] Public MV plays from the front placement after click.
- [ ] Insider stub renders locked with the 80s cover behind the gate.
- [ ] No third-party media request before click (Network tab).
- [ ] No raw hex in `src/` outside `:root`. All colours tokenised.
- [ ] `VideoObject` JSON-LD present and server-rendered (if done).
- [ ] `git diff HEAD` shown; nothing committed.
