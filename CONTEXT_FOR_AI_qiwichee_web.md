# Résonance — AI Context File
> Paste/upload this at the start of any new conversation to resume instantly.

**Last updated:** 2026-07-16 — **CAROUSEL SHIPPED + FIXED · STORAGE CONSOLIDATED · CRON CLOSED.**
Shipped: the music **release-switcher carousel** (commit `caf0938`) + a post-real-device fix round
(`7eed377`: single active player, card alignment, desktop arrows, overscroll, cleaner Lullabies
visual) + a page-level horizontal-overflow fix (`9178230`, flexbox min-width trap). Closed: the
keepalive **CRON verification** (logged 2XX + 1 Supabase API call — end-to-end proven). Migrated:
**single storage source of truth = `/media/Main_HDD/GDrive/`** (the old `~/GDrive` and
`~/Documents/GDrive` trees were divergent stale snapshots — rescued unique content, quarantined
them). Decided (design, not yet built): **carousel goes ONE SLIDE PER SONG** (album = a label on a
song, not a container slide) — next session's design pass, together with the credits line and the
Bandcamp two-click/stop-button UX.
**Status:** qiwichee.com LIVE ✅ · Atelier gate ✅ · Magic links on qiwichee.com ✅ · Keepalive ✅
**CRON VERIFIED — CLOSED** · Lullabies palette ✅ · **Release-switcher carousel LIVE ✅ (4 releases,
per-release recolour = the signature element)** · Single-active-player ✅ · Desktop arrows ✅ ·
Page overflow FIXED ✅ · SPF+DKIM+DMARC ✅ · Event-engine SQL ✅ committed, ⛔ UNRUN ·
**Storage: ONE tree, backed up nightly ✅**
**Next session goal (in order):** (1) **DESIGN PASS — carousel v2**: one-slide-per-song restructure
+ credits line + Bandcamp two-click/stop affordance (see CAROUSEL V2 below; produce a brief, then
Claude Code). (2) EVENT ENGINE (run event_engine.sql + seed owners row). (3) BILINGUAL next-intl
(own session). **Also due July 16+: delete the storage quarantine folder (see STORAGE).**

---

## 🗄️ STORAGE — SINGLE SOURCE OF TRUTH (changed 2026-07-15 — READ THIS, old paths are DEAD)

```
THE ONE TRUE TREE:  /media/Main_HDD/GDrive/
  ├── Resonance/                     (project root: 00_Claude_Projects … 04_Qiwichee)
  │   ├── 02_Produit_Tech/Specs/     (context files — the sync source)
  │   ├── 04_Qiwichee/               (artist assets: Dilemma/ Hybrid Fruit/ Lullabies/
  │   │                               'Une dernière chose-Photo'/ 'Atelier content video'/)
  │   └── sync_resonance.sh          (the REAL script; SPECS= now points at Main_HDD)
  └── Dropbox/                       (personal archive, ~20 dirs, incl. rescued Amine/)

BACKED UP NIGHTLY by /home/simba/automation/scripts/backup_gdrive.sh (rclone, cron.daily, runs as
root): Main_HDD/GDrive → gdrive:Laptop_Sync/GDrive with --backup-dir time-machine archiving. It
ALSO backs up ~/Projects (excl. node_modules/.git/.next) and ~/automation. ONE-WAY local→cloud:
anything added on the Drive web/app side NEVER comes down. Email alert on failure (msmtp).

DEAD PATHS (do not use, do not resurrect):
  ~/GDrive/…            and   ~/Documents/GDrive/…
  Both were divergent partial snapshots from a Jun-15/16 reorganisation. Unique content rescued
  (Dropbox/Amine → Main_HDD; a truncated pptx discarded — it was cut at exactly 1 MiB, a
  power-of-two boundary = interrupted copy, not a fork). Both trees quarantined in:
      /home/simba/_TO_DELETE_after_2026-07-16/
  ⏰ ACTION DUE: on/after 2026-07-16, after ≥2 clean nightly backups:
      rm -rf /home/simba/_TO_DELETE_after_2026-07-16

LAUNCHER: ~/sync_resonance.sh → bash /media/Main_HDD/GDrive/Resonance/sync_resonance.sh
  (repointed 2026-07-15; SPECS= inside the real script also fixed to Main_HDD.)
  ⚠️ FIRST POST-MIGRATION RUN of the sync is the migration's end-to-end test — watch it.

LESSON (standing): "WHICH folder is backed up?" is answered by the BACKUP SCRIPT'S SOURCE PATH,
not by notes or memory. cat the script; make the machine name the truth. Corollary: a one-way
backup means cloud-side additions are invisible locally — know your sync direction per tree.
```

---

## 🎠 RELEASE-SWITCHER CAROUSEL — LIVE (commits caf0938 → 7eed377 → 9178230)

```
WHAT SHIPPED (2026-07-15):
├── Horizontal scroll-snap carousel in the Music section — pure CSS scroll-snap, NO library.
│   Slides 88% wide (partial peek = load-bearing affordance). Signature element WORKS: swiping
│   recolours the page accent per release.
├── 4 slides, canonical DOM order (newest first): lullabies → hybrid-fruit → une-derniere-chose
│   → dilemma. Fixed order server-rendered; "random featured" = CLIENT-SIDE SCROLL POSITION ONLY
│   (useEffect + scrollTo behavior:'instant') — hydration-safe, verified no console warning.
├── Files: src/app/components/ReleaseSwitcher.tsx · src/data/releases.ts (per-artist data
│   pattern) · 4 covers in public/ · globals.css carousel + palette blocks.
├── EmbedPlayer gained: poster prop use per slide + CONTROLLED MODE (isActive/onActivate/
│   onDeactivate — BOTH isActive+onActivate required to activate it; omitting them preserves the
│   uncontrolled behaviour, so the Atelier insider clip is untouched). SHARED COMPONENT — any
│   future change to it gets extra diff review.
├── SINGLE ACTIVE PLAYER: carousel owns activeEmbedSlug; clicking play on B unmounts A's iframe
│   back to poster. Iframe teardown IS the stop mechanism — no audio API, no singleton Audio().
├── Desktop arrows: real <button>s, aria-labels, ≥44px, disabled at hard ends (NO wrap), CSS-only
│   visibility via @media (pointer: fine). Dots remain (buttons, aria-current, 44px).
├── mediaService: Bandcamp branch built — EmbeddedPlayer URL with bgcol/linkcol from
│   asset.embedOptions. ⚠️ Those are THIRD-PARTY URL PARAMS, the ONE legitimate hex outside
│   globals.css (commented as such — hex-grep exemption).
├── JSON-LD: MusicAlbum/MusicRecording per release, byArtist → MusicGroup; MusicGroup gained
│   "alternateName": "LEILANI" (Dilemma = LEILANI-era album; she is NOT burying the old name —
│   just an ID change; alternateName lets search/AI merge the identities).
├── Card alignment: releases without a date render an invisible aria-hidden placeholder line.
└── Iframe resilience (best-effort): error event + offline→online → unmount to poster; a tap
    reloads fresh. Cross-origin iframe internals are UNOBSERVABLE — no retry framework.

PAGE-LEVEL OVERFLOW BUG + FIX (9178230) — THE FLEXBOX MIN-WIDTH TRAP (new standing lesson):
  The arrows' plain <div class="relative"> wrapper sat between max-w-3xl and the scroller. Flex
  content pushed it to full content width (~2249px vs 811px viewport) because wrappers default
  to min-width:auto — so the WHOLE PAGE scrolled horizontally (blank space visible in EVERY
  section, worst on desktop). overflow-x:auto only clips when the box's width is CONSTRAINED.
  FIX: wrapper → "relative w-full max-w-full min-w-0 overflow-hidden".
  DIAGNOSIS RECIPE (worked perfectly): DevTools console →
    document.body.scrollWidth + ' vs ' + window.innerWidth      (measure)
    [...document.querySelectorAll('*')].filter(el => el.scrollWidth >
      document.documentElement.clientWidth).map(el => el.className || el.tagName)   (name culprit)
  Note: overscroll-behavior-x:contain (added in 7eed377) only stops SCROLL CHAINING — it treated
  a symptom; the wrapper constraint was the root cause.

VERIFIED ON REAL DEVICE (Android Chrome, 2026-07-15): swipe + recolour + peek ✅ · one player at
a time ✅ · alignment ✅ · Bandcamp plays IN-PAGE ✅ · overflow gone after 9178230 ✅.
```

---

## 🎵 RELEASE DATA — VERIFIED (2026-07-14, from Bandcamp embed dialogs / canonical URLs)

```
lullabies            YouTube  L0mHWXa2UyQ                    (official MV)
hybrid-fruit         Bandcamp album=2331494883   27 oct 2024 (album, 6 titres)
une-derniere-chose   Bandcamp track=2132072682   31 mars 2023 (single)
dilemma              Bandcamp album=2503435136              (LEILANI era)
Canonical: qiwichee.bandcamp.com/album/hybrid-fruit · /track/une-derni-re-chose ·
           leilanigroove.bandcamp.com/album/dilemma
Bandcamp embed IDs come ONLY from the release page's Partager/Intégrer dialog (not the URL slug).
NEVER insert an unverified ID; per-song track IDs for the v2 restructure must each be pulled
from that dialog.

PALETTES (in globals.css, [data-release] accent-only overrides — structure tokens constant):
  lullabies          NO OVERRIDE — site default prune #7A3B8C WAS extracted from this MV;
                     swiping to Lullabies = returning to base colour. Deliberate.
  hybrid-fruit       #C2185B framboise        white-on-accent 5.87:1 ✅  on-bg 4.93:1 ✅
  une-derniere-chose #1C6E8C bleu d'eau       white-on-accent 5.74:1 ✅  on-bg 4.82:1 ✅
  dilemma            #9E1B32 carmin profond   white-on-accent 7.90:1 ✅  on-bg 6.64:1 ✅
  Ratios are MEASURED (WCAG formula vs --bg #E8EBF5, cross-checked against prune 6.23:1) —
  Claude Code computed them; a hand re-derivation confirmed Claude Code right and the earlier
  doubt wrong. Colours remain PLACEHOLDER pending Qiwi Chee's artistic approval only.

ARTWORK in public/: dilemma-cover.jpg 1200² ✅ · une-derniere-chose-cover.jpg 1600² ✅ ·
  hybrid-fruit-cover.jpg ⚠️ 350px Bandcamp thumbnail PLACEHOLDER · lullabies-cover.jpg ⚠️ 1368×768
  16:9 YouTube screenshot PLACEHOLDER (cleaner one swapped in 7eed377, still not square cover art).
  Remaining photo batch (6× IMG-2026…) in 04_Qiwichee = parked bio/images build. Don't touch.
```

---

## 🎨 CAROUSEL V2 — NEXT DESIGN PASS (decided 2026-07-15, NOT yet designed/briefed)

```
1. ONE SLIDE PER SONG (Bassim's product decision): the SONG is the atomic unit; "album" becomes
   a LABEL on a song (e.g. "Album · Hybrid Fruit · 2/6"), not a container slide. Rationale: each
   song will eventually carry its own artwork + video clip; fans participate in creating/choosing
   per-song art; later per-song crowdfunding (EXTERNAL LINKS ONLY — Phase 1 no-money rule) can
   finance a clip or artwork per song.
   CONSEQUENCES TO DESIGN THROUGH: 4 slides → ~9 (Hybrid Fruit = 6 songs) — do dots scale? visual
   grouping of album siblings? per-song Bandcamp track IDs (each verified from its embed dialog);
   JSON-LD shifts to MusicRecording-per-song with inAlbum; fan co-creation touches the
   RIGHTS-AT-UPLOAD gate.
2. CREDITS LINE per song (video/photo/artwork credits), length-independent. ⚠️ Bassim proposed a
   slow auto-scrolling marquee — flag honestly: continuous auto-motion collides with the standing
   no-autoplay/consent/motion principles (WCAG 2.2.2 pause-stop-hide + prefers-reduced-motion).
   Design alternatives to present: static truncation + expand-on-tap; marquee ONLY behind
   prefers-reduced-motion:no-preference AND pausable; or a credits line in the slide's flow.
   Decision pending the design discussion — don't pre-build.
3. BANDCAMP TWO-CLICK + STOP AFFORDANCE: click 1 loads Bandcamp's iframe (our poster consent),
   click 2 is BANDCAMP'S OWN play button — their embed has no autoplay param (deliberate on
   their side; mobile blocks iframe audio autoplay anyway). Chosen direction: keep the two-step
   but make it LEGIBLE ("Charger le lecteur" label for bandcamp assets) + add a visible labelled
   STOP control on the active card (unmount-to-poster — true pause inside a cross-origin iframe
   is unreachable; Bandcamp's own pause exists inside the player). Do NOT render iframes without
   click-consent; do NOT fetch Bandcamp audio into our own <audio> (rights/ToS).
   All three fold into ONE design pass → one brief → Claude Code, to avoid reworking the card
   surface twice.
```

---

## ⚠️ OPEN — PENDING QIWI CHEE (out of the country; WhatsApp asks, can arrive piecemeal)

```
[ ] Square Lullabies cover (the Spotify/Deezer artwork) → drop-in replaces public/ placeholder.
[ ] Hybrid Fruit hi-res source (Bandcamp original: cover URL suffix _0.jpg trick, or her file).
[ ] Approve/veto the 3 accent colours (send swatches + covers; her artistic veto stands).
[ ] Confirm Dilemma slide descriptor wording (currently: "Album — sorti sous le nom LEILANI").
Each is an independent drop-in (one file in public/ or one token in globals.css + linkcol in
releases.ts). Nothing blocks on the slowest answer.
```

---

## 🔑 HARD-WON LEARNINGS — ADDED THIS SESSION

```
1. THE BACKUP SCRIPT'S SOURCE PATH IS THE ONLY TRUTH about what is backed up. Three "GDrive"
   trees existed; notes pointed at the wrong one; cat the script ended the debate. And a uniform
   timestamp across a whole tree = a bulk-copy snapshot, not a live folder.
2. WHEN TWO COMPUTATIONS OF THE SAME NUMBER DISAGREE, RE-DERIVE FROM THE FORMULA before deciding
   which to distrust. The AA-ratio dispute: Claude Code's measured 5.87:1 was right; the hand
   estimate was wrong; the "cautious" correction was the error. Verify-don't-assume includes
   your own earlier arithmetic.
3. FLEXBOX MIN-WIDTH TRAP: a plain wrapper between a width constraint and a flex scroller gets
   PUSHED WIDE by content (min-width:auto default) → overflow-x:auto never engages → the whole
   page scrolls sideways. Fix at the wrapper: min-w-0 / max-w-full. overscroll-behavior only
   stops chaining; it is not a width constraint.
4. A file cut at EXACTLY a power-of-two size (1 MiB) is a truncated interrupted copy, not a
   variant worth keeping.
5. Quarantine-then-delete (mv to a dated _TO_DELETE folder) beats direct rm: instant, reversible,
   and breaks hidden dependencies LOUDLY during the grace window.
6. Vercel cron invocations ARE logged with status + external API calls under Observability →
   Cron Jobs (invocation detail shows the outbound Supabase call — proof force-dynamic executed).
   The apex→www 308 did NOT eat the cron: Vercel invokes the deployment directly.
```

---

## ⚡ THE PIVOT (unchanged — overrides older sequencing)

The product is a **machine in the artist's hands to get fans to sign up and organize tiny
concerts**. PHASE 1 = fan machine (gate → insider area → tiny concerts → tracked links → in-page
media). PHASE 2 = paperwork layer (GUSO/CDDU/intermittence — the upsell). Capture the relationship
BEFORE sending anyone off to listen. If the gate's email doesn't arrive or the DB is paused, the
machine does not exist — deliverability + uptime ARE the product.

---

## 🚀 PER-ARTIST ONBOARDING — required infra steps (STANDING CHECKLIST)

```
1. Domain DNS → Vercel (apex A + www CNAME).
2. Supabase: redirect allow-list, Site URL, magic link on, Confirm email on.
3. Custom SMTP from the artist's own mailbox.
4. SPF + DKIM at the registrar/mail host; DMARC p=none after 48h stable.
5. EMAIL TEMPLATES: rewrite BOTH "Confirm signup" (type=email) AND "Magic Link" (type=magiclink)
   to <artist-domain>/auth/confirm?token_hash={{ .TokenHash }}&type=… Never leave
   {{ .ConfirmationURL }}. After saving, confirm & wasn't escaped to &amp;.
6. KEEPALIVE: run docs/briefs/keepalive.sql; CRON_SECRET env; vercel.json cron; VERIFY the cron
   log (Observability → Cron Jobs → invocation detail must show 2XX + the Supabase API call).
7. Every raw-SQL table → grant to authenticated (secret tables = exception).
8. TELL THE FAN ABOUT SPAM (sent-state microcopy) — non-optional on a fresh domain.
9. Release data: embed IDs from each release's Bandcamp Partager/Intégrer dialog; palettes
   hand-picked + AA-measured; releases.ts + public/ covers + [data-release] overrides.
```

---

## 🛑 STANDING DB RULE — GRANTS ON RAW-SQL TABLES

```
Postgres checks TABLE-LEVEL grants BEFORE RLS — missing grant = same 42501 as RLS. Every table
the app writes to → grant select, insert, update to authenticated. EXCEPTION: secret tables
(e.g. event_access) get NO client grant, reachable only via security-definer RPC. ANON has no
grant on ANY app table — anything anon triggers goes through a security-definer RPC that reads
nothing (keepalive pattern). Read error BODIES. Committed .sql ≠ built schema — check
information_schema.tables.
```

---

## ✅ EARLIER BUILD STATE (still current)

```
THEME TOKENS + LULLABIES PALETTE: semantic tokens in globals.css :root, Tailwind 4 @theme inline,
  ZERO raw hex in components (Bandcamp URL-param exception documented). ACCENT prune #7A3B8C
  (white-on 7.42:1, on-bg 6.23:1). --border-strong #6671A8. @theme naming asymmetry: --text →
  class text-text but --text-muted → class text-muted. Check globals.css, don't infer.
[data-release] ARCHITECTURE: accent-only overrides; structure tokens constant; gate NEVER wrapped.
  Recolour transition behind prefers-reduced-motion: no-preference.
ATELIER GATE: magic-link login, nickname + multi-city picker (owner_city_density signal),
  visit_count via touch_fan, Mailchimp sync, spam-check microcopy in sent state. New-fan
  onboarding renders IN PLACE at /atelier (URL doesn't change — verified correct).
AUTH: /auth/confirm = verifyOtp({type, token_hash}) on OUR domain, NO next param (open-redirect).
  /auth/callback kept for old links. BOTH email templates bilingual FR/EN, one link per mail.
EMBEDPLAYER: lazy/consent poster→iframe, keyboard accessible, locked variant, + controlled mode
  (2026-07-15). Insider clip (unlisted Ashg6NO8azo) LIVE behind the gate — uncontrolled mode.
EMAIL: hello@qiwichee.com OVH Email Pro pro2.mail.ovh.net; booking@ alias; SPF+DKIM+DMARC(p=none).
EVENT ENGINE SQL: docs/briefs/event_engine.sql committed ⛔ UNRUN (owners/events/event_access/
  rsvps = 0 of 4 exist). Correct state — queued after carousel v2.
```

---

## 🎟️ EVENT ENGINE / 🌍 BILINGUAL / 🎬 MEDIA POLICY / 🔐 RIGHTS / 💶 MONETIZATION / ⚖️ LEGAL / 👥 ROLES

```
(Unchanged from 2026-07-14 — summarised; details in docs/briefs/ + previous context version.)
EVENT ENGINE: one event object, 3 types (stream/cocreate/physical); announce wide, entry only via
  gate; event_access secret join-link table (no client grant, security-definer get_event_access);
  seed ONE owners row post-SQL; magic links = transactional (OVH), blasts = Mailchimp draft;
  rights_confirmed blocks Announce; money = external chip_in_url only.
BILINGUAL: Accept-Language first visit → locale route; cookie toggle after; next-intl [locale]
  segments; fixed strings "L'Atelier"/"Qiwi Chee"/"Résonance"; Send Email Hook in scope (only way
  to localise auth mail). Functional cookie → no consent banner, but goes in the privacy statement.
MEDIA POLICY: in-page plays, site captures traffic; lead full-audio on her turf (Bandcamp/YouTube),
  streaming = "aussi sur" links; lazy-load every embed; NO AUTOPLAY / NO auto-cycling / NO
  auto-advance (reaffirmed 2026-07-15 against the audit doc — see FORBIDDEN below); unlisted
  YouTube for insider; posters local only; VIDEO never in the repo.
RIGHTS-AT-UPLOAD: every upload carries a rights record; uncleared → private + flag; assists never
  advises. Lyrics + music sheets parked behind rights review (lawyer list).
MONETIZATION: lean B (free machine, paid paperwork). Phase 1 = NO money through the platform.
  First euro needs: CAE (CRESS IDF / Les Scop IDF calls) + Vercel Pro + probably Supabase Pro.
LEGAL: V1 = cultural CAE entrepreneur-salarié (IP portable BY CONTRACT); V2 = SAS-ESS (BPI ICC
  lane) or SCIC — never found a SCIC early. EAA: microenterprise exemption likely covers today;
  stops being optional at ticketing/e-commerce → entertainment lawyer at V2.
ROLES: OWNER via is_owner()/owners table · COLLABORATOR (no financial/legal) · MEMBER (Atelier,
  own-row RLS) · ANON (no table grants; RPC only).
```

---

## ⛔ FORBIDDEN "IMPROVEMENTS" (reaffirmed 2026-07-15 vs an external audit prompt — standing)

```
- AUTOPLAY in any form: auto-advance on ended, radio mode, carousel auto-slide.
- INFINITE LOOP / CLONED SLIDES in the carousel (duplicate DOM = SEO poison + hydration trap).
- Engagement popups triggered by listening behaviour ("join after 3 songs") — requires listen
  tracking (analytics DEFERRED behind the consent decision) and cheapens the gate.
- Fetching Bandcamp audio into our own <audio> / custom chrome around their content (rights/ToS).
- Server-side device sniffing. The architecture is client-side capability negotiation: media
  queries + fluid layout + next/Image srcset. The server sends ONE document + rules; the device
  self-selects. (Explained 2026-07-15; the overflow bug was one element BREAKING that contract,
  not the contract failing.)
```

---

## 🗄️ SUPABASE — PROJECT FACTS

```
ref cieefpigrwlhklkkqmdb · eu-west-1 · FREE tier (pauses after 7 idle days — mitigated by the
VERIFIED daily keepalive cron; Supabase Pro when real RSVPs depend on the gate).
AUTH: magic link + Confirm email ON (⇒ two templates) · Site URL https://qiwichee.com ·
redirect allow-list (+www, +.fr, +localhost:3000). SMTP: OVH hello@, 30/hr.
TABLES: fans (RLS own-row, granted to authenticated, NOT anon). FUNCTIONS: touch_fan ·
keepalive (security definer, anon execute, touches nothing).
UNRUN: owners · events · event_access · rsvps.
```

---

## INFRASTRUCTURE FACTS (verified, don't re-derive)

```
DNS — Vercel: apex A 216.198.79.1; www CNAME 42d7eef65754d8a8.vercel-dns-017.com; .fr → redirect.
  qiwichee.com 308→www (matters for anything carrying an Authorization header — but NOT the cron,
  which is invoked against the deployment directly: verified).
VERCEL Hobby: cron 1/day max, UTC; runtime logs 1 HOUR; Observability → Cron Jobs keeps
  invocation history + status + external API calls (longer than runtime logs — use it).
  ENV VARS ARE INERT UNTIL A DEPLOY (git commit --allow-empty after rotating a secret).
ENV: NEXT_PUBLIC_SUPABASE_URL/ANON_KEY · NEXT_PUBLIC_SANITY_* · NEXT_PUBLIC_MAILCHIMP_AUDIENCE_ID ·
  MAILCHIMP_API_KEY · CRON_SECRET (server-only).
SERVICES: github.com/bkark/qiwichee → Vercel auto-deploy from main · Sanity bayrhx8r · OVH.
Preview *.vercel.app not on Supabase allow-list → gated flows test on localhost or prod only.
```

---

## DEVELOPER ENVIRONMENT

```
Linux Mint · user simba · host ssd · Apple keyboard. Repo /home/simba/Projects/qiwichee.
★ ASSETS/SPECS: /media/Main_HDD/GDrive/Resonance/ (SEE STORAGE SECTION — ~/GDrive is DEAD).
Sync: ~/sync_resonance.sh → Main_HDD script. cp updated context to
  /media/Main_HDD/GDrive/Resonance/02_Produit_Tech/Specs/ FIRST, then run (script copies
  Specs → repo, then commits + pushes; then manually re-upload CONTEXT_FOR_AI to the four
  Claude Projects: Resonance Dev / Strategy / Research / Qiwichee).
Node v22 · Next.js 16.2.4 (⚠️ middleware→proxy deprecation warning pending — address in the
  next-intl session) · TS · Tailwind 4 @theme · @supabase/ssr.
Briefs: docs/briefs/ (release_switcher.md ★with verified DATA BLOCK · carousel_fixes.md ·
  event_engine.sql · keepalive.sql · tiny_concert_engine.md) · docs/templates/supabase_emails.md.

WORKFLOW QUIRKS (all still true):
  - Long files: download-then-cp, never paste heredocs. `git --no-pager diff`.
  - NEW FILES don't show in `git diff` — use `git status`. Grep from src, not src/app.
  - `sed -i` with `|` delimiter for slash-heavy text; escape `*` as `\*` when matching /* */;
    apostrophes inside single quotes: '\''.
  - `>>` appends, `>` destroys. Never paste <placeholder> angle brackets.
  - Claude Code briefs: scoped, NO auto-commit, `git status` + FULL files at end, review the
    ENTIRE diff incl. shared components, hex grep, AA re-verify. Bassim commits manually.
    ★ Claude Code's SUMMARY is not the diff — verify its claims against the filesystem (it
    skipped reporting the aspect-ratio check 2026-07-15; the action was right, the report absent).
  - DevTools console: read-only measurement lines are fine; Chrome asks to type "allow pasting"
    once. The overflow-diagnosis pair of one-liners is in the CAROUSEL section — reusable.
  - DEBUG: read error BODIES; temporarily surface, diagnose, revert.
GOTCHA: Next.js 16 rejects og:type "music.musician" → use "website"; MusicGroup JSON-LD carries it.
```

---

## INSTRUCTIONS FOR THIS AI

```
- Explain every command + WHY (telecom analogies help). One step, wait for confirmation.
- BUILD SEQUENCE: …deliverability + keepalive ✅ → release-switcher carousel ✅ + fixes ✅ →
  (NEXT) carousel v2 design pass (song-per-slide + credits + Bandcamp UX) → event engine →
  bilingual next-intl (own session) → per-teaser links. THEN Phase 2 GUSO/CDDU.
- Verify-don't-assume: filesystem/git/DB over notes; the backup script over memory; re-derive
  disputed numbers from the formula. A Claude Code summary is a claim, not evidence.
- Every raw-SQL table → grant to authenticated; anon via security-definer RPC only.
- Theme via tokens; Bandcamp URL params are the sole hex exception (must carry the comment).
- Every page: SEO + WCAG AA + JSON-LD. NO autoplay/auto-advance/infinite-loop/engagement popups
  (see FORBIDDEN). Horizontal swipe = siblings within a section only; gate never behind a swipe.
- Phase 1 = NO money through the platform (crowdfunding = external links only).
- user_id/owner from auth session, never request body. Zod everywhere. No `next` URL params.
- Claude Code: scoped briefs, no auto-commit, full-diff review, shared-component changes flagged.
- Never suggest Telegram (WhatsApp links). Flag geographic/institutional risks neutrally.
- Remind: entertainment lawyer before /legal; CRESS IDF + Les Scop IDF before first euro.
- End of session: ask if instructions need updating; offer updated CONTEXT_FOR_AI; remind the
  sync (cp to Main_HDD Specs FIRST, then ~/sync_resonance.sh).
```

---

## OPEN DECISIONS / NEXT ACTIONS

```
[x] ★ CRON VERIFIED — keepalive end-to-end proven (2XX + Supabase call in invocation detail). CLOSED.
[x] ★ STORAGE CONSOLIDATED — one tree on Main_HDD, backed up; launcher + SPECS repointed;
    unique content rescued (Amine); stale trees quarantined.
[x] ★ RELEASE-SWITCHER SHIPPED (caf0938) + fix round (7eed377) + overflow fix (9178230).
    Verified on real device.

[ ] ★★ DELETE THE QUARANTINE (due 2026-07-16+, after ≥2 clean nightly backups):
    rm -rf /home/simba/_TO_DELETE_after_2026-07-16
[ ] ★★ CAROUSEL V2 DESIGN PASS (next session): song-per-slide + credits line + Bandcamp
    two-click/stop affordance. Design discussion → one brief → Claude Code. Per-song track IDs
    each verified from Bandcamp embed dialogs.
[ ] ★ PENDING QIWI CHEE (piecemeal drop-ins): Lullabies square cover · Hybrid Fruit hi-res ·
    3 accent approvals · Dilemma descriptor wording.
[ ] ★ First post-migration run of ~/sync_resonance.sh = the migration's end-to-end test.
[ ] ★★ DECIDE: one Supabase project per artist vs one shared Résonance project. BEFORE ARTIST #3.
[ ] ★ Test {{ .SiteURL }} in email templates (artist-agnostic templates). UNTESTED.
[ ] ★ Fix remaining Supabase templates (Invite/Change email/Reset password) — still leak
    supabase.co when they fire. Known, parked.
[ ] ★ Dead-man's-switch monitor (Healthchecks.io/UptimeRobot) on the keepalive. Optional, parked.
[ ] ★ A11Y DEBT (parked, needs its own pass): keyboard tab-order drags through all off-screen
    slides' links (~28 stops) — roving tabindex or inert on non-active slides.
[ ] ★ Analytics layer 1 brief (log_event RPC, keepalive pattern) — after/alongside carousel v2;
    Clarity DEFERRED (consent banner).
[ ] (THEN) Event engine — run event_engine.sql → seed owners row → owner UI + RSVP flow.
[ ] (THEN, own session) Bilingual next-intl (+ Send Email Hook, + middleware→proxy migration).
[ ] Promote insiderClip const → insider_media table when a 2nd clip arrives.
[ ] Gate a11y: input aria-describedby + error-state colour.
[ ] Watch visit_count double-fire (mail scanner pre-fetch). Interstitial-button fix ONLY if it bites.
[ ] Genre "Hybrid pop" → "Alternative Pop" — PARKED. Lyrics/sheets — PARKED (rights).
[ ] DECIDE monetization A/B/C (lean B) before Phase 2. Call CRESS IDF + Les Scop IDF.
[ ] Document Qiwi Chee's journey publicly (build-in-public).
```

---
*Updated 2026-07-16 · Carousel shipped and hardened in one day (three commits), storage
consolidated onto the backed-up disk, cron verification closed. Next: the carousel v2 design
pass (song as the atomic unit), then the event engine. Delete the quarantine folder after
July 16. The machine has its music now — swipe, and the page changes colour.*
