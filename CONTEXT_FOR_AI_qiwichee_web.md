# Résonance — AI Context File
> Paste/upload this at the start of any new conversation to resume instantly.

**Last updated:** 2026-06-26 — DMARC LIVE (p=none, verified resolving) → full SPF+DKIM+DMARC stack COMPLETE. EMBEDPLAYER built + shipped (reusable lazy/consent provider-agnostic player; public Lullabies MV on front + LOCKED insider stub behind the gate; front thumbnail DEFERRED). EVENT-ENGINE SQL (docs/briefs/event_engine.sql) confirmed real + committed beside its brief — but UNRUN (verified in DB: 0 of 4 tables exist). LULLABIES PALETTE still pending apply. DYNAMIC PER-RELEASE PALETTE decided feasible. INSIDER CONTENT plan = two layers.
**Status:** qiwichee.com LIVE (4 domains, SSL) ✅ · Homepage ✅ · 6 platform links ✅ · Theme-token layer ✅ · **Atelier gate (magic-link login + editable profile + status badge) ✅ tested** · **SPF+DKIM+DMARC ✅ COMPLETE** · **EmbedPlayer ✅ shipped** (front MV live + locked insider card) · Lullabies palette ✅ extracted+verified (apply pending) · Insider cover frame ✅ chosen · Event-engine SQL ✅ committed, ⛔ UNRUN
**Next session goal:** Apply the **Lullabies palette** as the new default + stand up the `[data-release]` override architecture (lock the functional-input border token ≥3:1; bundle "Hybrid pop → Alternative Pop" text). Insider area still BLOCKED on an UNLISTED YouTube clip ID from Qiwi Chee (one-line flip at the `// UNLOCK:` marker once it arrives). Event engine still queued after the insider area (run event_engine.sql + seed owners row when built). Front MV thumbnail still to add (local poster, no 3rd-party fetch). Also pending from her: confirm band/song rights on the clip.

---

## ⚡ THE PIVOT (read first — overrides older sequencing)

The product is a **machine in the artist's hands to get fans to sign up and organize tiny concerts** — an insider community that grows itself. NOT "a nice artist website with a GUSO tool bolted on."

Older files said *finish site → GUSO calculator → platform*, with GUSO as the "killer feature/hook." **That sequence is reversed.** GUSO/CDDU is a *retention/upsell* feature. The **fan machine is the acquisition hook** — visible, momentum-creating; an artist using it visibly is how we recruit the next beta tester. Acquire with the machine; deepen + monetize with the paperwork.

### Two phases (locked)
```
PHASE 1 — THE FAN MACHINE  (build now, money-free, no paperwork)
  Atelier gate → alive insider area → tiny-concert organizing (online → live)
  → per-teaser tracked links → in-page media embeds.
PHASE 2 — THE PAPERWORK LAYER  (the upsell)
  GUSO / CDDU / intermittence 507h, formal & paid concerts, money flows. Triggered
  when tiny concerts become real/paid gigs at real venues. CAE/legal track MUST be live.
```

### The flywheel
```
Social teaser → fan signs up to Atelier → insider → insiders fund + organize the next tiny
concert → concert (QR / gated stream) recruits the NEXT batch → they sign up → ↺.
Qiwi Chee running this VISIBLY = our beta-tester acquisition. Product = marketing.
The owner dashboard's fan numbers ARE the pitch she shows other artists → referral growth.
```

### The single load-bearing idea
```
Capture the relationship BEFORE sending anyone off to listen. The Atelier gate is the CENTER:
all above it exists to fill it; all below exists because it filled. For a LIVE event the gate
is the mechanism, not friction — "the stream link is inside" makes the gate a door to scarcity.
```

---

## ✅ CURRENT BUILD STATE (2026-06-26)

```
DONE — THEME-TOKEN FOUNDATION (current palette = aqua/blue underwater; to be REPLACED by Lullabies):
├── Semantic tokens in globals.css :root, Tailwind 4 @theme inline. Bricolage + Inter via
│   next/font. ZERO raw hex in components. WCAG AA verified. Deployed.

DONE & TESTED — ATELIER ACCESS GATE (the heart of the machine):
├── Email front door → Supabase magic link (passwordless). New→/atelier/welcome (nickname +
│   optional cities)→/atelier; returning→/atelier. Editable nickname + multi-city picker, one save.
├── visit_count via touch_fan RPC; status badge Nouveau→Habitué→Fidèle→Pilier (--accent-warm).
├── Mailchimp sync in callback. Honeypot + Zod + server-only key. RLS own-row. Tested end-to-end.

DONE — EMAIL DELIVERABILITY — FULL STACK COMPLETE (DMARC added 2026-06-26):
├── mail-tester.com = 9.5/10. SPF_PASS · DKIM valid + DKIM_VALID_AU + DKIM_VALID_EF (aligned to
│   domain & envelope) · OVH outbound IP on Mailspike whitelist, not blocklisted.
├── DMARC now LIVE: _dmarc TXT "v=DMARC1; p=none; rua=mailto:hello@qiwichee.com" — verified
│   resolving publicly (dig +short TXT _dmarc.qiwichee.com). Monitor-only, zero delivery risk.
│   FUTURE (optional, much later): tighten p=none → quarantine → reject after reviewing rua reports.
└── Ignore mail-tester's HTML nitpicks (bare test email, not the real Supabase template).

DONE — EMBEDPLAYER (reusable lazy/consent media player) — SHIPPED 2026-06-26:
├── Files: src/lib/media/types.ts (MediaProvider|MediaType|MediaAsset) · src/lib/media/mediaService.ts
│   (getEmbedUrl → youtube-nocookie embed; bandcamp stubbed/throws; exhaustiveness check) ·
│   src/app/components/EmbedPlayer.tsx ("use client"; poster-first, iframe mounts ONLY on click;
│   keyboard <button> aria-label "Lire : {title}"; focus-visible ring; locked variant; tokens only).
├── PLACEMENT 1 (front, public): page.tsx — lullabies MediaAsset {youtube, 'L0mHWXa2UyQ', video} in the
│   Music section + server-rendered VideoObject JSON-LD beside MusicGroup. NO poster yet → shows the
│   token-styled placeholder (grey box). Plays on click. ← THUMBNAIL DEFERRED (add local poster later).
├── PLACEMENT 2 (insider, LOCKED): AtelierContent.tsx — "Exclusivité Atelier" section, locked EmbedPlayer,
│   poster /qiwichee_atelier_cover_80s.jpg, assetId '' empty, // UNLOCK: comment marker at the call site.
└── VERIFIED: hex grep clean (nothing outside :root); lazy/consent confirmed (no youtube-nocookie.com
    request until click — iframe src only set after play). Committed + deployed (live).

DONE — LULLABIES PALETTE (extracted from her video, AA-verified — APPLY PENDING):
├── Source: official MV still youtu.be/L0mHWXa2UyQ. Dominant colours pulled from real pixels:
│   peach skin, near-black plum hair, periwinkle sky, dusty rose, periwinkle-blue.
├── This REPLACES the aqua/blue palette (full :root swap, per the re-skin plan). Values below.
└── Bundle the "Hybrid pop → Alternative Pop" genre text change into the same apply pass.

DONE — INSIDER CONTENT plan (two layers) + COVER FRAME:
├── PUBLIC bait (front, ungated): the Lullabies official MV — polished, already public. (Now wired via EmbedPlayer.)
├── INSIDER reward (behind gate): a PRIVATE concert clip she sent (NOT on YouTube yet) — precisely
│   because it's nowhere else. Cover frame chosen at 80s (vocalist + hand-painted "Release + Decay"
│   banner), saved as qiwichee_atelier_cover_80s.jpg → now the LOCKED insider card; swaps to video later.
└── Clip facts: VID-20251117-WA0000.mp4, 848×480, ~128s, h264/aac, WhatsApp-compressed (lo-fi suits
    the "alive, unfinished, inside" feel). RIGHTS FLAG: band/drummer in frame + song clearance must be
    confirmed before any PUBLIC use; insider-gated use is lower-stakes but consent still applies.

DONE (spec stored) — EVENT ENGINE SQL committed but UNRUN:
├── docs/briefs/event_engine.sql sits beside docs/briefs/tiny_concert_engine.md (matched pair).
├── Verified against the DB 2026-06-26: 0 of 4 tables exist (owners/events/event_access/rsvps) → NOT applied.
│   This is the correct state — event engine is queued AFTER the insider area.
└── When building: run the SQL top-to-bottom in the Supabase editor, THEN seed the owners row with the
    artist auth UID (is_owner() is false for everyone, /atelier/artiste 404s for you too, until that row exists).

NEXT, IN ORDER (Phase 1 machine):
├── 1. APPLY LULLABIES PALETTE + [data-release] override architecture (unblocked, do this next).
├── 2. ALIVE INSIDER AREA — reward behind the gate. Locked stub LIVE; BLOCKED on her UNLISTED clip ID
│      (upload private clip Unlisted → send ID → flip `locked`→false + set assetId at the // UNLOCK marker).
├── 3. EVENT ENGINE (tiny-concert) — SQL + BRIEF READY in docs/briefs/. Run SQL → seed owner → build owner UI.
├── 4. PER-TEASER TRACKED LINKS — each clip its own link → lands on the gate → shows what converted.
├── 5. IN-PAGE MEDIA EMBEDS — extend EmbedPlayer to the public leads (Bandcamp full + YouTube clip).
└── 6. FRONT MV THUMBNAIL — add a local poster still to public/ + pass via the poster prop (no 3rd-party fetch).

PENDING FROM QIWI CHEE (parked):
├── Upload the private concert clip to YouTube as UNLISTED → send the video ID (unblocks insider area).
├── Confirm: band OK to appear + the performed song is hers / cleared (rights on the clip).
└── (Bundle w/ palette apply) Genre wording "Hybrid pop" → "Alternative Pop" everywhere.
```

### Qiwichee theme — token values

**CURRENT (deployed, aqua/blue underwater — being replaced):**
```
--bg #EAF4F8 · --surface #FFFFFF · --text #14181C · --text-muted #566B73 · --border #CFE2E9 ·
--accent #1257D6 · --accent-bright #2E8BFF (decorative) · --accent-contrast #FFFFFF ·
--accent-warm #F2B705 · --accent-warm-contrast #1A1405 · --accent-soft #E86B9A (decorative).
```

**NEW DEFAULT — LULLABIES (extracted + AA-verified 2026-06-24, APPLY PENDING):**
```
--bg #E8EBF5 (pale periwinkle sky) · --surface #FFFFFF · --text #1F0610 (deep plum-black hair) ·
--text-muted #5C3944 (muted plum) · --border #CBD3E7 (periwinkle; DECORATIVE dividers) ·
--accent #4453B5 (DEEPENED periwinkle — buttons/links, white text) ·
--accent-bright #99AADB (vivid periwinkle — DECORATIVE only) · --accent-contrast #FFFFFF ·
--accent-warm #DF9DB0 (dusty rose — badges/status, DARK text) · --accent-warm-contrast #1F0610 ·
--accent-soft #FACFB7 (peach — DECORATIVE/tertiary).
AA verified: text/bg 16.15 · muted/bg 8.30 · text/surface 19.23 · link(accent)/bg 5.60 ·
white/accent 6.67 · dark/warm 8.78.
NOTE: --border #CBD3E7 is for DECORATIVE dividers (exempt from 3:1). FUNCTIONAL input outlines
(sole boundary of a control) need a deepened border token ≥3:1 vs --bg — LOCK its value at apply time.
```

### DYNAMIC PER-RELEASE PALETTE — DECISION (2026-06-24): feasible, do it (curated)
```
The token layer (zero raw hex, everything reads CSS vars) makes per-content theming nearly free:
scope variable overrides on a wrapper and the cascade re-themes everything, no component changes.
  [data-release="lei-lani"] { --bg:…; --accent:…; }  + transition for a smooth fade between sections.
RULE: move only ACCENT tokens per release; keep STRUCTURE tokens (text/surface/border) in a tight
family AND keep the Atelier GATE on the constant palette (it's the home/front door). "Identity stays,
songs change." Curated per-release palettes (hand-picked, AA-verified) — NOT auto-extraction yet.
The Lullabies palette becomes the DEFAULT; per-release palettes are overrides layered on top.
Auto "palette-from-photo" extractor stays PARKED for /onboarding (auto-colours fail AA without a guard).
Implement the default+override architecture in the same pass as the Lullabies apply (no rebuild later).
```

---

## 🛑 STANDING DB RULE — GRANTS ON RAW-SQL TABLES (hard-won, 2026-06-22)
```
Tables created via the SQL editor start with NO role grants. RLS alone is NOT enough — Postgres
checks TABLE-LEVEL grants FIRST, then RLS. A missing grant returns the SAME 42501/403 as RLS.
RULE: every table the app writes to → final line:  grant select, insert, update on public.<t> to authenticated;
(delete only if the client legitimately deletes; never anon unless truly needed.)
DELIBERATE EXCEPTION (secret-hiding pattern): a table holding secrets the client must NEVER read
(e.g. event_access.join-link) gets NO client grant + NO select policy; it's reachable ONLY via a
security-definer RPC that authorizes the caller. See EVENT ENGINE.
DIAGNOSIS: 42501 + valid Bearer + correct policy = missing grant. Read the Postgres error BODY.
VERIFY-DON'T-ASSUME: a committed .sql file is NOT a built schema. Check the DB (information_schema.tables)
before assuming a module is applied — event_engine.sql lived in the repo committed-but-UNRUN.
```

---

## 🎟️ EVENT ENGINE (tiny-concert) — SQL + BRIEF READY (docs/briefs/), next major build after insider area
```
Files: docs/briefs/tiny_concert_engine.md (full Claude Code brief) + docs/briefs/event_engine.sql
(the schema — committed, UNRUN; 0/4 tables exist as of 2026-06-26). Summary of the locked design:

ONE event object, three TYPES: 'stream' (she performs, fans watch), 'cocreate' (band jams / writes
a song live — V1 WATCH-ONLY), 'physical' (small room). One MECHANISM: announce wide, the only way
in is the gate. Fan hits event link → gate → login → RSVP → THEN the join link is revealed to them.

GATED-ACCESS (the security spine):
  - events table = public-safe meta only (RLS: public read non-draft; owner writes via is_owner()).
  - event_access table = the secret join link; NO client grant, NO select policy; reachable ONLY via
    get_event_access(event_id) (security definer) which returns it ONLY to a logged-in 'going' fan
    while status in (announced,live), or the owner. Anon / non-RSVP fan get NOTHING (verify in source+network).
  - rsvps table = the guest list (fan RLS own-row; owner reads all). RSVP-as-guest-list.

OWNER SIDE (/atelier/artiste, server component, is_owner() via owners table, 404 for non-owners):
  - owner_fan_roster() — who joined, with status badge.
  - owner_city_density() — fan count per city → "where do I play next?" (turns the cities field into the
    data that picks the first physical room: online-first GENERATES the touring signal).
  - owner_event_roster(event_id) — who's coming.
  - create/announce event; owner_set_event_access() writes the secret (client can't).

MANUAL STEP after running the SQL: seed ONE owners row with the artist auth UID (Supabase → Auth → Users).
  Until it exists, is_owner() is false for everyone and /atelier/artiste 404s even for you.

EMAIL = two channels, never mixed: magic links = transactional (OVH SMTP, ~30/hr); event blast =
  broadcast (Mailchimp audience c5532d5f66, has legal unsubscribe). V1 announce = create a Mailchimp
  DRAFT she sends herself (NO auto-send). Native invite = the event card inside the Atelier.

RIGHTS GATE: events.rights_confirmed default false; Announce is BLOCKED for stream/cocreate until she
  ticks "band OK + song mine/cleared". Assists, never advises.

MONEY: none through the platform — chip_in_url = external link only (Lydia/Ko-fi/PayPal). No Stripe.

ONLINE-FIRST: stream/cocreate = YouTube (unlisted/live) via EmbedPlayer type:'livestream'. Co-create
  interactive room (Jitsi/LiveKit) + fan-visible recording-consent = DEFERRED (start watch-only).
```

---

## 🚀 PER-ARTIST ONBOARDING — required infra steps (standing checklist)
```
1. Domain DNS → Vercel (apex A + www CNAME).
2. Supabase: redirect allow-list (domain + www + localhost /auth/callback), Site URL, magic link on,
   Confirm email on.
3. Custom SMTP from the artist's own mailbox (lifts dev rate limit; on-brand sender).
4. SPF + DKIM at the registrar/mail host — REQUIRED (verify via mail-tester; OVH: Email diagnostic).
   DMARC p=none after SPF/DKIM stable 48h. (qiwichee.com: full SPF+DKIM+DMARC done 2026-06-26.)
5. Every raw-SQL table → grant to authenticated (STANDING DB RULE).
Use standard TXT records (not OVH proprietary types) so APIs/tools read them.
```

---

## 🎯 MVP POSITIONING (reframed)
```
"A machine that helps an independent artist turn passive listeners into an insider fan community —
 and organize tiny concerts with them, online first then live — starting today, with zero paperwork."
Hook = the Atelier fan machine + gated live events. GUSO/CDDU = the later upsell once concerts go formal.
```

---

## 🎬 MEDIA POLICY (standing — keep visitors, never feed platforms)
```
Music/video plays IN-PAGE; the site captures traffic, never exports it. Social = net, site = boat.
EMBED HIERARCHY: LEAD with full-audio on her turf (Bandcamp / a YouTube clip). Spotify/Apple = small
"also on →" links (30s previews, don't credit plays). SoundCloud = full, fine.
CRITICAL: player + gate ALWAYS together (listening is bait for capture). LAZY-LOAD every embed
(thumbnail → iframe on click) — non-negotiable on mobile (Core Web Vitals + GDPR/EAA consent).
ONE reusable EmbedPlayer = BUILT (lazy + consent + provider-agnostic {provider, assetId, type};
type video|livestream). src/app/components/EmbedPlayer.tsx + src/lib/media/. Extend providers as needed.

HOSTING (DECISION 2026-06-22, holds): YouTube (UNLISTED) for insider content NOW — free, her channel.
Do NOT pay for Cloudflare Stream until there's must-be-un-leakable content (a 480p WhatsApp clip isn't).
VIDEO never in the repo. IMAGES → next/Image + alt. AUDIO (insider) → object storage behind the gate
(signed URLs) when that layer is built.
POSTERS/THUMBNAILS: local images only (next/Image), NO third-party thumbnail CDN fetch before the user
clicks (keeps the no-network-before-consent property). Front MV currently shows a token placeholder until
a local still is added.
RAW staging: ~/GDrive/Resonance/02_Produit_Tech/. Claude CANNOT watch video — frames are a human call
(Claude can extract & view frames from an uploaded video to pick a cover/thumbnail — done for the 80s frame).
```

---

## 🔐 RIGHTS-AT-UPLOAD (standing)
```
Every media upload carries a RIGHTS RECORD; nothing publishes until it clears. A GATE, not a nag.
Music → your recording? sample/cover? who performed + agreed public? Video → own footage? music cleared?
anyone identifiable who must consent? Photo → took it / permission? recognizable people?
THREE RULES: safe defaults (1 tap); status DRIVES behavior (uncleared → save private + flag); assists,
never advises. For events: rights_confirmed blocks Announce on stream/cocreate (see EVENT ENGINE).
```

---

## 💶 MONETIZATION (early SaaS — model OPEN, lean B)
```
GOAL: paying SaaS EARLY once there's artist traction.
A) Freemium on the machine (~€9). B) Free machine, paid paperwork (first euro at Phase 2). ← LEAN.
C) Free now, paid on a 2nd signal. DON'T paywall the core viral loop. DECIDE before Phase 2.
NON-NEGOTIABLES: recurring SaaS fee = commercial revenue → needs CAE V1 to invoice legally ⇒ CRESS IDF /
Les Scop IDF + a CAE on the CRITICAL PATH to the first euro. "Charge artists a SaaS fee" ≠ "process fans'
concert money" (escrow/Stripe Connect = Phase 2B, lawyer+accountant; keep far away).
```

---

## ⚖️ LEGAL & STRUCTURE (V1 → V2)
```
V1 — host in a cultural CAE (Coopérative d'Activité et d'Emploi) as entrepreneur-salarié. Cheap,
  reversible, cooperative, can invoice now, IP portable BY CONTRACT (confirm in writing), ~10% of turnover.
V2 (with traction) — SAS w/ ESS statutes in BPI ICC lane, OR a SCIC. Don't found a SCIC now (asset trap).
  Don't build IP in an association to privatize later.
PHASE 1 RULE: NO money through the platform. Fan chip-in = external links. Keeps V1 legal TODAY, no lawyer.
⚠️ Older files say "SASU owns all IP" — SUPERSEDED by the CAE V1 plan (see Resonance_context.md).
NEXT LEGAL ACTIONS: Call CRESS Île-de-France (free) + Les Scop IDF — CAE shortlist + IP clause.
  Shortlist: Coopetic (Paris, media/culture, keeps intermittent — closest) · Coopaname (IDF) ·
  Smart (verify 2026) · Artefacts (check IDF) · Artenréel (Strasbourg). Skip CLARA/CLARAbis.
```

---

## 👥 THREE USER ROLES (RBAC via Supabase RLS)
```
OWNER (Artist) — full: media, events, fan roster, (Phase 2) legal/finance. is_owner() via owners table;
  /atelier/artiste 404s for non-owners. Privileged reads via security-definer RPCs (never ship service-role
  to the client; never trust request body for identity).
COLLABORATOR (Staff/Band/grassroots helper) — assigned tasks; NOT financial/legal.
MEMBER (Fan — "ATELIER") — own RSVP/profile + Atelier content; NO legal/financial.
```

---

## 🛠️ STANDING BUILD REQUIREMENTS — every page
```
THREE-IN-ONE: SEO (server-rendered semantic HTML + metadata + sitemap + hreflang) · WCAG 2.1 AA
  (alt, keyboard, contrast, visible focus, a11y statement) · AI-agent discoverability (schema.org JSON-LD
  MusicGroup/MusicEvent; robots ALLOW ClaudeBot, GPTBot).
DB: every raw-SQL table → grant to authenticated (+ the deliberate secret-table exception).
MEDIA: lazy-load + consent EmbedPlayer, mediaService-resolved; pair with the gate. RIGHTS record per upload.
THEME: via tokens, never raw hex (grep src for hex → nothing outside :root). Per-release = accent overrides.
SECURITY: user_id/owner ALWAYS from auth session, never request body. getUser() before authenticated writes.
  Zod on every route. Server-only secrets never NEXT_PUBLIC. External links → ExternalLink. Images → Image+alt.
```

---

## 🔁 TEMPLATE PATTERNS (reuse per artist instance)
```
THEME TOKENS → per artist, only :root values + the `artist` data block change. qiwichee = theme #1.
  Per-release palettes = [data-release] accent overrides on the default.
ExternalLink → noopener noreferrer + a11y cue. Internal nav = Next.js <Link>.
AtelierGate → email → magic link (signInWithOtp, emailRedirectTo /auth/callback OR a specific event slug). DONE.
Auth callback → exchangeCodeForSession → rpc touch_fan → new→/atelier/welcome else→/atelier. DONE.
Profile (AtelierContent) → editable nickname + city picker, ONE save. DONE. (Add "À venir" events section.)
EmbedPlayer → DONE. Lazy thumbnail→iframe (mounts on click), consent-by-click, mediaService-resolved,
  provider-agnostic {provider, assetId, type}, type video|livestream-ready, locked variant for "unlocks
  soon" slots, tokens-only. src/app/components/EmbedPlayer.tsx + src/lib/media/{types,mediaService}.ts.
Event engine (SQL + brief ready, UNRUN) → events/event_access/rsvps + security-definer RPCs. docs/briefs/.
supabase/client.ts = createBrowserClient(url, anonKey). supabase/server.ts = @supabase/ssr cookie-based.
  middleware.ts = session refresh.
```

---

## 🎵 VERIFIED ARTIST PROFILES — Qiwi Chee
```
ON SITE NOW (artist.links via ExternalLink), LIVE: Spotify open.spotify.com/artist/4Bu89sfVzy14qW0dK8Ugbs ·
Apple music.apple.com/fr/artist/qiwi-chee/1676154343 · Deezer deezer.com/fr/artist/204585817 ·
YouTube youtube.com/@qiwichee (UCR8h9_VrE-mTa-wekiB6luA) · Bandcamp qiwichee.bandcamp.com ·
Instagram instagram.com/qiwichee. JSON-LD sameAs also msha.ke/qiwichee (keep alive during transition;
its layout is one-section-per-release — the model for the per-release palette idea).
Lullabies official MV: youtu.be/L0mHWXa2UyQ (palette extraction source · public front bait · now wired
  via EmbedPlayer in the Music section, with VideoObject JSON-LD).
EMBED LEADS (when built): Bandcamp (full) + a YouTube jam clip. Spotify/Apple = small links.
Bio (CURRENT): "Auteur/Compositeur-Interprète Franco-algériano-americaine · Hybrid pop · Paris."
  → CHANGE PENDING: "Hybrid pop" → "Alternative Pop" (bundle w/ palette apply). EP: Hybrid Fruit.
  Single: Une Dernière Chose. Releases seen on Milkshake: Hybrid Fruit, Une dernière chose, Leï Lani (old name).
  Voice acting = separate site.
PRIVATE CONCERT CLIP (insider reward, pending unlisted upload): VID-20251117-WA0000.mp4; cover frame
  qiwichee_atelier_cover_80s.jpg (80s, "Release + Decay" banner) — now the LOCKED insider card poster.
  Band/song rights to confirm before public. UNLOCK = flip `locked`→false + set assetId at // UNLOCK marker.
```

---

## 🗄️ SUPABASE — PROJECT FACTS + SCHEMA
```
PROJECT: ref cieefpigrwlhklkkqmdb · URL https://cieefpigrwlhklkkqmdb.supabase.co · Region eu-west-1 (Ireland).
  Org "Resonance" (Free). JWT ES256 current. Free tier PAUSES after ~1 week idle → click Restore.
AUTH: magic link on. Redirect allow-list: qiwichee.com/auth/callback (+www, +.fr, + localhost:3000). Site URL
  https://qiwichee.com. Confirm email ON.
EMAIL/SMTP: custom SMTP via OVH → sender hello@qiwichee.com, pro2.mail.ovh.net:587 STARTTLS, user=full address.
  Rate 30/hr. SPF+DKIM+DMARC all VERIFIED (mail-tester 9.5/10; DMARC p=none live 2026-06-26).
KEYS: client uses legacy anon public key as NEXT_PUBLIC_SUPABASE_ANON_KEY. service_role NOT client-side.

TABLES (built):
fans ( id uuid PK → auth.users, email, nickname, cities text[] default '{}', visit_count int, created_at,
       last_seen_at ) — RLS own-row; GRANTED select/insert/update to authenticated.
rpc touch_fan(p_email) → (is_new, visits); security definer. fanStatus: 1 Nouveau · 2–4 Habitué ·
  5–9 Fidèle · 10+ Pilier.

TABLES (SPEC READY, UNRUN — event engine, per docs/briefs/event_engine.sql + tiny_concert_engine.md):
owners(user_id) · events(public meta + rights_confirmed) · event_access(secret link, NO client grant) ·
rsvps(guest list). RPCs: is_owner, get_event_access, owner_set_event_access, owner_event_roster,
owner_fan_roster, owner_city_density. ⛔ NOT applied — verified 0/4 tables exist 2026-06-26. Run the .sql
+ seed owners row when building the event engine.

PLANNED (later): media(rights), teaser_links, + Phase-2 (artists, artist_members, concerts, feuille_de_route,
guso_declarations, cddu_contracts, venues, professionals, events-analytics, service_status, …).
REMINDER: every new table → grant to authenticated (STANDING DB RULE); secret tables = the exception.
```

---

## INFRASTRUCTURE FACTS (verified, don't re-derive)
```
EMAIL — OVH Email Pro: pro2.mail.ovh.net for IMAP (993 SSL) + SMTP (587 STARTTLS). Mailboxes
  hello@qiwichee.com · booking@ (alias→hello@). SPF + DKIM + DMARC all VERIFIED. DMARC: _dmarc TXT
  "v=DMARC1; p=none; rua=mailto:hello@qiwichee.com" live + resolving 2026-06-26 (monitor only).
  SRV "off" = ignore. Domain mode Non-authoritative (OK). DON'T touch the Email Authoritative wizard.
DNS — Vercel: apex A 216.198.79.1; www CNAME 42d7eef65754d8a8.vercel-dns-017.com. .fr → redirect to .com.
ENV VARS (Vercel + .env.local): NEXT_PUBLIC_SUPABASE_URL · NEXT_PUBLIC_SUPABASE_ANON_KEY ·
  NEXT_PUBLIC_SANITY_PROJECT_ID=bayrhx8r · NEXT_PUBLIC_SANITY_DATASET=production ·
  NEXT_PUBLIC_MAILCHIMP_AUDIENCE_ID=c5532d5f66 · MAILCHIMP_API_KEY=[private, server-only].
SERVICES: github.com/bkark/qiwichee · CLAUDE.md committed · Claude Code authed (Pro) · Vercel auto-deploys
  from main · Sanity bayrhx8r · OVH domains live · Supabase cieefpigrwlhklkkqmdb.
```

---

## DEVELOPER ENVIRONMENT
```
OS: Linux Mint · user simba · hostname ssd. Repo: /home/simba/Projects/qiwichee · Live: qiwichee.com + .fr
Specs/raw: /home/simba/GDrive/Resonance/02_Produit_Tech/ · Sync: ~/sync_resonance.sh
Briefs/specs in repo: docs/briefs/ (tiny_concert_engine.md, event_engine.sql) · docs/BRIEF_embed_player.md
Node v22.22.3 · Next.js 16.2.4 · TS · Tailwind 4 (CSS-first @theme) · @supabase/ssr · supabase-js

WORKFLOW QUIRKS:
  - Big pastes → "[Pasted text #N]" chip = it WENT THROUGH; type the instruction after. Long files: save the
    .md/.sql into the repo (e.g. docs/briefs/) and point Claude Code at the path rather than pasting.
  - Hand build steps to Claude Code as a scoped BRIEF: no auto-commit; show git diff HEAD; AA verify; grep hex.
    Review the diff, then commit/push yourself.
  - SQL runs in the Supabase SQL editor (browser), not Claude Code's filesystem (no Supabase MCP/CLI wired yet)
    — copy the .sql into the editor yourself; Claude Code writes the app code.
  - VERIFY-DON'T-ASSUME: a committed .sql is not a built schema. Check information_schema.tables before
    assuming a module is applied. (event_engine.sql was committed but unrun — checked the DB to be sure.)
  - DEBUG: read the actual error BODY, not just the status (42501 named the missing GRANT). git not staging a
    file → run `git check-ignore -v` and `git ls-files --error-unmatch`; make git name the rule, don't theorize.
  - Don't `npm audit fix --force` on cosmetic warnings.
GOTCHA: Next.js 16 rejects og:type "music.musician" at RUNTIME → use "website"/"profile"; MusicGroup JSON-LD
  carries the signal. Claude can extract & view video frames (ffmpeg) to pick covers — it cannot watch video.
```

---

## INSTRUCTIONS FOR THIS AI
```
- Explain every command + WHY (telecom analogies help). One step, wait.
- BUILD SEQUENCE: theme tokens ✅ → Atelier gate ✅ → SPF/DKIM/DMARC ✅ → EmbedPlayer ✅ → APPLY LULLABIES
  PALETTE + [data-release] (NEXT) → alive insider area (needs her unlisted clip ID; locked stub already live)
  → event engine (run docs/briefs/event_engine.sql + seed owner) → per-teaser links → more in-page embeds.
  THEN Phase 2 GUSO/CDDU.
- The site is a fan MACHINE; the Atelier gate is the center. Capture before sending anyone to listen. For live
  events the gate is the access mechanism. Media in-page (lazy + consent EmbedPlayer, provider-agnostic).
- Every raw-SQL table → grant to authenticated (secret tables = deliberate no-grant exception). Read error BODIES.
  VERIFY a schema is actually in the DB before assuming it's applied (a committed .sql ≠ a built table).
- Every media upload carries a rights record; nothing publishes until cleared; assists, never advises. Events:
  rights_confirmed blocks Announce on stream/cocreate.
- Phase 1 = NO money through the platform (chip-in = external links). SaaS fee needs CAE live → CRESS IDF /
  Les Scop IDF on the critical path once charging. Monetization A/B/C = OPEN (lean B).
- user_id/owner ALWAYS from auth session, never body. getUser() before writes. Zod on routes. Three roles via RLS.
- Theme via tokens, never raw hex; per-release = accent overrides on the Lullabies default; gate stays constant.
  Every page: SEO + WCAG AA + JSON-LD. Posters/thumbnails = local images, no 3rd-party fetch before click.
- YouTube (unlisted) for content now; no paid Cloudflare until un-leakable content needs it.
- Never suggest Telegram (WhatsApp links). Flag geographic/institutional risks neutrally.
- End of session: ask if instructions need updating; offer updated CONTEXT_FOR_AI; remind ~/sync_resonance.sh.
```

---

## OPEN DECISIONS / NEXT ACTIONS
```
[x] Theme-token foundation (photo palette, AA, deployed) — current aqua/blue.
[x] Atelier access gate — magic-link login + profile + status badge + Mailchimp sync + grants. TESTED.
[x] SPF + DKIM at OVH — VERIFIED mail-tester 9.5/10 (SPF pass, DKIM valid+aligned, not blocklisted).
[x] DMARC at OVH — LIVE 2026-06-26. _dmarc TXT v=DMARC1; p=none; rua=mailto:hello@qiwichee.com, verified
    resolving. Full SPF+DKIM+DMARC stack complete. Future: optionally tighten to quarantine/reject after rua review.
[x] EmbedPlayer — BUILT + shipped. Reusable lazy/consent provider-agnostic player; public Lullabies MV on
    front (+ VideoObject JSON-LD) + LOCKED insider stub behind the gate. Hex-clean, consent-verified.
[x] event_engine.sql — confirmed real, committed to docs/briefs/ beside its brief. UNRUN (0/4 tables exist).
[x] Lullabies palette — extracted from her MV + AA-verified (new default; apply pending).
[x] Dynamic per-release palette — DECIDED feasible (curated accent overrides; gate constant).
[x] Insider content — two-layer plan (public Lullabies MV bait; private concert clip = inside reward).
[x] Insider cover frame chosen (80s) → qiwichee_atelier_cover_80s.jpg (now the locked card poster).
[x] Event engine — brief + SQL written (docs/briefs/).
[ ] (NEXT build) Apply Lullabies palette as the new default + set up [data-release] override architecture;
    bundle the "Hybrid pop → Alternative Pop" text change. Lock the functional-input border token (≥3:1).
[ ] (FROM HER) Upload private concert clip UNLISTED → send video ID (unblocks insider area build).
[ ] (FROM HER) Confirm band OK + song mine/cleared on the clip.
[ ] (THEN build) Alive insider area behind the gate — flip locked→false + set assetId at // UNLOCK once ID arrives.
[ ] (THEN build) Event engine — run docs/briefs/event_engine.sql in Supabase editor → seed owners row →
    feed tiny_concert_engine.md to Claude Code for the owner UI + RSVP/get_event_access flow (Core scope only).
[ ] Add front MV thumbnail — local poster still to public/ + pass via poster prop (no 3rd-party fetch).
[ ] Watch visit_count double-fire (magic-link pre-fetch can fire callback twice). Harden touch_fan if seen.
[ ] DECIDE monetization model A/B/C (lean B) — before Phase 2.
[ ] Call CRESS IDF + Les Scop IDF (CAE shortlist + IP clause) — critical path once charging.
[ ] Document Qiwi Chee's journey publicly (build-in-public = beta-tester acquisition).
[ ] (Later) palette-from-photo auto-extractor in /onboarding.
```

---
*Updated 2026-06-26 · DMARC live → SPF+DKIM+DMARC complete · EmbedPlayer shipped (front MV + locked insider
stub; thumbnail deferred) · event_engine.sql committed-but-UNRUN (0/4 tables) · Lullabies palette apply pending.
Next: apply the Lullabies palette + [data-release] architecture. Insider area still waiting on her unlisted clip ID.*
