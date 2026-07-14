# Résonance — AI Context File
> Paste/upload this at the start of any new conversation to resume instantly.

**Last updated:** 2026-07-14 — **COPY FIX + RELEASE-SWITCHER DESIGN SESSION.** Shipped: removed the confusing `(optionnel)` from the cities label in `CitiesPicker.tsx` (commit ee1a0ce — user feedback: it contradicted the "helps Qiwi Chee choose where to play" microcopy). Decided: the release-switcher will be built as a **horizontal scroll-snap CAROUSEL** (mobile swipe = release selector; page accent recolours as you swipe = the signature element). Brief written → `docs/briefs/release_switcher.md`. Design rule locked: horizontal swipe = browsing SIBLINGS within one section ONLY, never navigation between sections; the Atelier gate NEVER lives behind a swipe. Analytics direction chosen: first-party `log_event` security-definer RPC (keepalive pattern) → `analytics_events` table; MS Clarity DEFERRED (session recording ⇒ GDPR consent banner the site deliberately doesn't have). Lyrics + music sheets = new backlog content types, rights review flagged.
**Status:** qiwichee.com LIVE ✅ · Atelier gate ✅ · Magic links 100% on qiwichee.com ✅ · Spam microcopy ✅ · Keepalive ✅ (route verified; CRON path still to confirm) · Lullabies palette ✅ · `[data-release]` architecture ✅ · EmbedPlayer ✅ · Insider clip ✅ LIVE · SPF+DKIM+DMARC ✅ · Event-engine SQL ✅ committed, ⛔ UNRUN · **Cities label fixed ✅ · Release-switcher brief ✅ READY (docs/briefs/release_switcher.md)**
**Next session goal (in order):** (1) **MUSIC RELEASE-SWITCHER** — build from `docs/briefs/release_switcher.md` (scroll-snap carousel; mind the HYDRATION TRAP + the 88%-width partial peek). (2) EVENT ENGINE (run event_engine.sql + seed owners row). (3) BILINGUAL next-intl refactor (own session). **First, though: check Vercel → Cron Jobs (see OPEN VERIFICATION below) — still open.**

---

## ⚠️ OPEN VERIFICATION — DO THIS FIRST NEXT SESSION

```
CRON PATH UNCONFIRMED. The keepalive ROUTE is verified working (200 with the Bearer,
401 without). But we have NOT confirmed the Vercel CRON actually reaches it.

THE RISK: qiwichee.com 308-redirects to www.qiwichee.com. A redirect typically DROPS the
Authorization header. And Vercel does NOT log cron invocations that respond with a redirect.
=> There is a live path where the cron fires, gets bounced, loses its token, 401s, and shows
   NOTHING in the log. A keepalive that looks deployed and does nothing.
   The curl proves the ROUTE. It does not prove the CRON reaches it.

ACTION: Vercel dashboard → Cron Jobs (left sidebar) → after 04:00 UTC.
  · Logged 200            -> done, close it out.
  · Empty log / non-200   -> make www canonical in Vercel (or repoint), then re-test.
NOTE: Hobby retains runtime logs only 1 HOUR — check the same day, not three days later.
```

---

## ⚡ THE PIVOT (read first — overrides older sequencing)

The product is a **machine in the artist's hands to get fans to sign up and organize tiny concerts** — an insider community that grows itself. NOT "a nice artist website with a GUSO tool bolted on."

Older files said *finish site → GUSO calculator → platform*, with GUSO as the "killer feature." **That sequence is reversed.** GUSO/CDDU is a *retention/upsell* feature. The **fan machine is the acquisition hook**.

### Two phases (locked)
```
PHASE 1 — THE FAN MACHINE  (build now, money-free, no paperwork)
  Atelier gate → alive insider area → tiny-concert organizing (online → live)
  → per-teaser tracked links → in-page media embeds.
PHASE 2 — THE PAPERWORK LAYER  (the upsell)
  GUSO / CDDU / intermittence 507h, formal & paid concerts, money flows.
```

### The single load-bearing idea
```
Capture the relationship BEFORE sending anyone off to listen. The Atelier gate is the CENTER.
=> COROLLARY (learned 2026-07-13): if the gate's EMAIL doesn't arrive, the machine does not
   exist. Deliverability is not plumbing — it IS the product's front door. Same for uptime:
   a paused Supabase = a dead gate = a fan who leaves and doesn't come back.
```

---

## ✅ DONE THIS SESSION (2026-07-14) — COPY FIX + RELEASE-SWITCHER DESIGN

```
1. CITIES LABEL FIX — shipped (commit ee1a0ce)
├── src/components/CitiesPicker.tsx line 39: removed `(optionnel)` span from the "Villes" label.
├── WHY: real-user feedback — "(optionnel)" contradicted the microcopy explaining the field
│   feeds owner_city_density() ("this matters… but skip it"). Label now pulls one direction.
└── No validation/a11y change: the field carries no `required` attr; screen readers announce
    required-ness from markup, not label text. Field stays skippable, just stops advertising it.

2. RELEASE-SWITCHER DESIGN LOCKED — horizontal scroll-snap carousel
├── User insight: mobile fans have the left/right swipe reflex from social media. Applied to
│   the RELEASES only (homogeneous siblings) — the pattern's documented weakness is that
│   off-screen content gets missed, so heterogeneous must-see content stays on the vertical spine.
├── The carousel IS the [data-release] feature: each slide wrapped in its own data-release div;
│   swiping recolours the page accent = THE SIGNATURE ELEMENT of the page.
├── DESIGN RULE (standing): horizontal swipe = browsing siblings WITHIN a section only. NEVER
│   navigation between sections (fights vertical scroll; no keyboard/SR equivalent). Cross-section
│   jumps = links/anchors inside slides. The ATELIER GATE never lives behind a swipe.
├── Pure CSS scroll-snap, NO carousel library (telecom: passive splitter over active mux) —
│   server-rendered slides (SEO/AI-agents), native keyboard scroll, zero dependency.
├── ⚠️ HYDRATION TRAP identified: "featured release randomised on load" must be a CLIENT-SIDE
│   SCROLL POSITION (useEffect + scrollTo behavior:'instant'), NEVER randomised DOM order —
│   otherwise React hydration mismatch + crawlers see a different page each visit.
├── Partial peek is LOAD-BEARING: slides ~88% wide so the next slide's edge shows. Do not let
│   a cleanup pass make slides 100% and kill the affordance.
└── FULL BRIEF: docs/briefs/release_switcher.md (scope, a11y checklist, JSON-LD MusicAlbum,
    Claude Code handoff rules, verify list). Build from the brief, not from memory.

3. ANALYTICS DIRECTION CHOSEN (not built — needs its own small brief)
├── Q: "how do we see what real fans look at?" → TWO layers:
├── LAYER 1 (chosen, first-party): log_event(event_type, release_slug) SECURITY-DEFINER RPC →
│   analytics_events table, NO client grant (keepalive pattern, but INSERTs one row).
│   Events: slide viewed >1s (the carousel's IntersectionObserver already knows), play clicked,
│   atelier_gate_view, gate_email_submitted (the conversion pair the machine is judged on).
│   No cookies, no consent banner, no third-party script. Dovetails with per-teaser tracked
│   links (same table, same RPC, one system).
└── LAYER 2 (DEFERRED): MS Clarity heatmaps/recordings ⇒ GDPR consent banner + privacy-statement
    update. The site deliberately has no banner (only the future functional locale cookie).
    Revisit only if watching scroll behaviour becomes necessary; accept the consent cost then.

4. BACKLOG ADDITIONS: Lyrics + Music Sheets as insider/site content — new content types.
   Rights-at-upload rule applies; she's author/composer so likely her call, but published
   sheet music/lyrics goes on the entertainment-lawyer list alongside the /legal review.
```

---

## ✅ PREVIOUS SESSION (2026-07-13) — DELIVERABILITY + RESILIENCE

```
THE TRIGGER — a real user test, not a lab metric:
├── A friend (YAHOO inbox) received the magic link → SPAM. Despite mail-tester 9.5/10 and
│   SPF+DKIM+DMARC all passing. Auth records prove a mail is AUTHENTIC; they do not prove
│   it is WANTED. Yahoo/Gmail also weigh DOMAIN REPUTATION — and qiwichee.com has almost
│   no send history, so it has no track record. (Telecom: the trunk is configured perfectly,
│   but the far-end operator still rate-limits you because they've never peered with you.)
│   Reputation is earned over weeks, via volume + engagement (opens, clicks, "not spam").
└── SEPARATELY: the free-tier Supabase project PAUSED after 7 days idle during a holiday.

1. SPAM-CHECK MICROCOPY — shipped (commit e099b50)
├── src/components/AtelierGate.tsx — a <p> in the `status === 'sent'` branch ONLY:
│   "Pas d'e-mail dans ta boîte de réception ? Regarde dans tes spams / indésirables —
│    et marque-le comme « non spam » pour recevoir les prochains directement."
├── Styled `mt-2 text-xs text-muted`. Tokens only, hex-grep clean.
└── The "mark as non spam" half is LOAD-BEARING: that click trains the filter for that
    recipient AND slowly builds qiwichee.com's sender reputation. It is not just a rescue.

2. MAGIC LINKS NOW VERIFY ON OUR OWN DOMAIN — shipped
├── PROBLEM: default Supabase `{{ .ConfirmationURL }}` → https://<ref>.supabase.co/auth/v1/verify…
│   So the mail was FROM qiwichee.com but every LINK pointed at supabase.co.
│   Sender domain ≠ link domain = textbook PHISHING FINGERPRINT. Plus a trust cost: a fan
│   hovering the link sees a stranger's hostname in a mail claiming to be from the artist.
├── NEW FILE src/app/auth/confirm/route.ts — mirrors /auth/callback exactly, swapping
│   exchangeCodeForSession → supabase.auth.verifyOtp({ type, token_hash }).
│   Zod: token_hash string().min(1); type enum(['email','magiclink']).
│   NO `next` param — deliberately: destination comes from isNew, and accepting `next` would
│   open a classic OPEN-REDIRECT hole (…/auth/confirm?next=https://evil.com).
│   Then IDENTICAL to the callback: touch_fan RPC → isNew → fire-and-forget subscribeFan →
│   redirect /atelier/welcome if new else /atelier.
├── /auth/callback KEPT ALIVE — links already sitting in inboxes still point there.
├── VERIFIED END-TO-END: token arrives as `pkce_…` and verifyOtp accepts it. Both paths work.
└── (Telecom: signalling and media used to terminate on different hosts. Now collapsed —
    the fan's browser only ever talks to our edge; Supabase is a backend we call, not a
    host the fan is bounced through.)

3. BOTH EMAIL TEMPLATES REBUILT — bilingual FR/EN (see docs/templates/supabase_emails.md)
├── ⚠️ THERE ARE **TWO** TEMPLATES, NOT ONE (Confirm-email is ON):
│     new address (first ever)  → "Confirm signup" template → type=email
│     returning fan             → "Magic Link"     template → type=magiclink
│   Getting `type` wrong → Zod rejects → fan bounces to /?error=missing_token.
│   The Confirm-signup one IS the first-contact mail — i.e. THE ONE THAT WENT TO SPAM.
│   Fixing only Magic Link would have left the actual failure untouched.
├── Supabase templates are STATIC — they cannot branch on the recipient's locale from the
│   dashboard. Locale-aware mail needs the SEND EMAIL HOOK → deferred to the bilingual session.
│   Interim = bilingual-in-one-mail, FR first then EN.
├── ONE link per mail (the EN block says "use the link above"): two identical links is a mild
│   spam signal AND doubles the chance a mail scanner pre-fetches and burns the single-use token.
└── AFTER SAVING, ALWAYS reopen and read the raw href: some editors escape & → &amp;, which
    silently kills the `type` param. Must read &type=email / &type=magiclink.

4. SUPABASE KEEPALIVE — shipped (see docs/briefs/keepalive.sql)
├── PROBLEM: free tier pauses after 7 days idle. A paused project = a DEAD ATELIER GATE.
│   Found out by email, on holiday. A fan would just have left.
├── public.keepalive() — security-definer fn returning 'ok'. Touches NO table, leaks NOTHING,
│   produces exactly the DB ACTIVITY the idle timer measures. grant execute to anon only.
├── src/app/api/keepalive/route.ts — force-dynamic; auth FIRST (Bearer vs process.env.CRON_SECRET,
│   401 on mismatch = fails closed); then supabase.rpc('keepalive'); returns JSON (never a redirect).
├── vercel.json (new) — crons: [{ path: /api/keepalive, schedule: "0 4 * * *" }]
├── CRON_SECRET in Vercel env (Production+Preview) — Vercel auto-sends it as an Authorization
│   Bearer header on cron invocations. Rotated once (leaked into a chat transcript).
├── DAILY, not every-6-days: 6d interval vs a 7d dead-timer is 1.17× — ONE lost ping and the
│   project pauses. Daily requires SIX CONSECUTIVE failures. Hobby caps cron at once/day anyway.
└── VERIFIED: 200 {"ok":true} with the Bearer · 401 without · x-vercel-cache: BYPASS (proves
    force-dynamic actually executed). ⚠ CRON PATH STILL UNVERIFIED — see OPEN VERIFICATION.
```

---

## 🔑 HARD-WON LEARNINGS ADDED THIS SESSION

```
1. A VERCEL ENV VAR IS INERT UNTIL A DEPLOY.
   Rotating CRON_SECRET in the dashboard and re-curling gave a 401 that looked exactly like a
   typo. The variable was saved; production was still running the OLD build. Fix:
       git commit --allow-empty -m "chore: redeploy to pick up rotated secret" && git push
   (Telecom: running-config vs startup-config. Saving isn't reloading.)

2. ANON HAS NO GRANT ON APP TABLES — A HEALTH CHECK MUST NOT READ A TABLE.
   First keepalive attempt did `select id from fans limit 1` and returned:
       42501 — permission denied for table fans
   Grants are checked BEFORE RLS, so the query died before RLS could return zero rows.
   This is the project's OWN STANDING DB RULE and the brief walked straight past it.
   And the fix is NOT to grant anon access to `fans` — that table holds fan EMAILS. It stays
   locked. Use a security-definer RPC returning a constant instead.

3. ONLY THE ERROR **BODY** NAMES THE BUG.
   The route originally returned a bare `{ ok: false }` 500 — unmonitorable. Temporarily
   surfacing error.message + code produced "42501" and ended the guessing in one deploy.
   Then reverted (no reason to leak Postgres internals). Read the BODY, not the status.

4. GREP FROM `src`, NOT `src/app`.
   A grep scoped to src/app "proved" the gate lived in one file. It didn't — AtelierGate.tsx
   is in src/components/. The search was fine; the ROOT was wrong. Components live OUTSIDE
   the app dir. Claude Code caught this; trust the tool that reads the filesystem.

5. A NEW FILE DOES NOT APPEAR IN `git diff`.
   "The diff is clean" was true AND misleading — /auth/confirm/route.ts had never been
   written. Verify creations with `git status`, not `git diff`.

6. SPF+DKIM+DMARC ≠ INBOX. Auth records prove a mail is AUTHENTIC, not WANTED. Domain
   reputation is a separate axis, earned over time. Budget for first-contact spam placement
   on every new artist domain — and TELL THE FAN where to look.

7. `>>` APPENDS, `>` DESTROYS. (`echo … >> .env.local`, never `>`.) And never paste the
   angle brackets from a <placeholder> — bash reads `<` as input redirection.
```

---

## 🚀 PER-ARTIST ONBOARDING — required infra steps (STANDING CHECKLIST, updated)

```
1. Domain DNS → Vercel (apex A + www CNAME).
2. Supabase: redirect allow-list (domain + www + localhost /auth/callback), Site URL,
   magic link on, Confirm email on.
3. Custom SMTP from the artist's own mailbox (lifts dev rate limit; on-brand sender).
4. SPF + DKIM at the registrar/mail host — REQUIRED (verify via mail-tester).
   DMARC p=none after SPF/DKIM stable 48h.
5. ★ NEW — EMAIL TEMPLATES: rewrite **BOTH** "Confirm signup" (type=email) AND "Magic Link"
   (type=magiclink) to link to <artist-domain>/auth/confirm?token_hash={{ .TokenHash }}&type=…
   Never leave {{ .ConfirmationURL }} in place. Copy from docs/templates/supabase_emails.md.
   After saving, reopen and confirm & was not escaped to &amp;.
6. ★ NEW — KEEPALIVE: run docs/briefs/keepalive.sql; add CRON_SECRET to Vercel env
   (openssl rand -hex 32); vercel.json cron. Then VERIFY the cron log, not just a curl.
7. Every raw-SQL table → grant to authenticated (STANDING DB RULE); secret tables = exception.
8. ★ NEW — TELL THE FAN ABOUT SPAM. The gate's sent-state microcopy is not optional on a
   fresh domain; it is the difference between a signup and a lost fan.
Use standard TXT records (not OVH proprietary types) so APIs/tools read them.
```

---

## 🛑 STANDING DB RULE — GRANTS ON RAW-SQL TABLES

```
Tables created via the SQL editor start with NO role grants. RLS alone is NOT enough — Postgres
checks TABLE-LEVEL grants FIRST, then RLS. A missing grant returns the SAME 42501/403 as RLS.
RULE: every table the app writes to → final line:  grant select, insert, update on public.<t> to authenticated;
DELIBERATE EXCEPTION (secret-hiding): a table holding secrets the client must NEVER read
(e.g. event_access.join-link) gets NO client grant + NO select policy; reachable ONLY via a
security-definer RPC that authorizes the caller.
★ COROLLARY (2026-07-13): the ANON role has no grant on ANY app table. Anything an anonymous
caller must trigger (health checks, keepalives) goes through a SECURITY-DEFINER RPC that reads
NOTHING — never by loosening grants on a table that holds user data.
DIAGNOSIS: 42501 + valid Bearer + correct policy = missing grant. Read the Postgres error BODY.
VERIFY-DON'T-ASSUME: a committed .sql file is NOT a built schema. Check information_schema.tables.
```

---

## ✅ EARLIER BUILD STATE (still current)

```
THEME-TOKEN FOUNDATION + LULLABIES PALETTE (2026-06-27) — deployed, live.
├── Semantic tokens in globals.css :root, Tailwind 4 @theme inline. ZERO raw hex in components.
├── ACCENT = PRUNE #7A3B8C (deliberately NOT the extracted periwinkle #4453B5 — the artist felt
│   the MV reads pinker/purpler). AA: white on accent 7.42:1, accent on bg 6.23:1.
├── --border-strong #6671A8 = FUNCTIONAL input-outline token (3.92:1 vs bg). Gate input wired to it.
└── NOTE the @theme naming is NOT symmetrical: --text → --color-text → class `text-text`, while
    --text-muted → --color-muted → class `text-muted`. Both correct. Check globals.css, don't infer.

[data-release] PER-RELEASE PALETTE ARCHITECTURE (2026-06-27) — stood up, template commented.
├── A release section wraps content in <div data-release="NAME"> and overrides ONLY accent tokens.
│   STRUCTURE tokens (bg/surface/text/border/border-strong) stay constant. Gate NEVER wrapped.
└── SAME FEATURE as the music release-switcher. Selecting a release = recolouring the page.

ATELIER ACCESS GATE — tested end-to-end.
├── Email → Supabase magic link (passwordless). Editable nickname + multi-city picker, one save.
├── visit_count via touch_fan RPC; status badge Nouveau→Habitué→Fidèle→Pilier.
├── Mailchimp sync in callback. Honeypot + Zod + server-only key. RLS own-row.
└── ★ NOTE (2026-07-13): new-fan onboarding (nickname + city picker) RENDERS IN PLACE at /atelier —
    the URL does not change to /atelier/welcome. Behaviour VERIFIED CORRECT; new fans DO see the
    city picker. Older notes implying a distinct URL are stale.

CITIES-FIELD MICROCOPY (2026-06-28): "Où viendrais-tu la voir en concert ?" + helper. This field is
  the owner_city_density() signal — online-first GENERATES the touring signal. Load-bearing.

PLATFORM-LINKS MONOCHROME ICON ROW (2026-06-28): BrandIcon.tsx, 6 inline simple-icons paths,
  fill=currentColor, no npm dep. --text-muted → --accent on hover/focus, 44px tap targets.

EMBEDPLAYER (2026-06-26): lazy/consent (poster → iframe on click), provider-agnostic mediaService,
  keyboard accessible, tokens only, locked variant.
├── FRONT (public): Lullabies MV, youtube L0mHWXa2UyQ + VideoObject JSON-LD. ⚠ thumbnail still a
│   token placeholder — local poster still to add.
└── INSIDER (behind gate): unlisted YouTube Ashg6NO8azo, poster qiwichee_atelier_cover_80s.jpg.
    Rights CONFIRMED (band + song). LIVE.
    ⚠ insiderClip is still a single hardcoded const. 2nd clip → promote to an insider_media table.

EMAIL DELIVERABILITY: mail-tester 9.5/10. SPF_PASS · DKIM valid+aligned · DMARC p=none live.
  (…and STILL landed in a Yahoo spam folder. See LEARNING #6.)

EVENT ENGINE SQL: docs/briefs/event_engine.sql committed but ⛔ UNRUN. 0 of 4 tables exist
  (owners/events/event_access/rsvps). Correct state — queued.
```

---

## 🎟️ EVENT ENGINE (tiny-concert) — SQL + BRIEF READY, next major build after the release-switcher

```
ONE event object, three TYPES: 'stream' · 'cocreate' (V1 watch-only) · 'physical'.
ONE MECHANISM: announce wide, the only way in is the gate. Fan hits event link → gate → login →
RSVP → THEN the join link is revealed.

GATED-ACCESS (the security spine):
  - events        = public-safe meta only (RLS: public read non-draft; owner writes via is_owner()).
  - event_access  = the secret join link; NO client grant, NO select policy; reachable ONLY via
                    get_event_access(event_id) (security definer) → only to a logged-in 'going' fan
                    while status in (announced,live), or the owner. Anon gets NOTHING.
  - rsvps         = the guest list (fan RLS own-row; owner reads all).

OWNER SIDE (/atelier/artiste, is_owner() via owners table, 404 for non-owners):
  owner_fan_roster() · owner_city_density() ("where do I play next?") · owner_event_roster(event_id)
  · create/announce event · owner_set_event_access() writes the secret (client can't).

MANUAL STEP after running the SQL: seed ONE owners row with the artist auth UID.

EMAIL = two channels, never mixed: magic links = transactional (OVH SMTP, ~30/hr); event blast =
  broadcast (Mailchimp c5532d5f66, has legal unsubscribe). V1 announce = a Mailchimp DRAFT she sends.
RIGHTS GATE: events.rights_confirmed default false; Announce BLOCKED for stream/cocreate until ticked.
MONEY: none through the platform — chip_in_url = external link only.
```

---

## 🌍 BILINGUAL FR/EN — APPROACH LOCKED (build = its own next-intl session)

```
FIRST VISIT: middleware reads Accept-Language → picks fr/en → redirects to that locale route.
  (Telecom: capability negotiation — client advertises, server picks.)
AFTER: explicit toggle stored in a cookie → overrides the browser guess on every later visit.
Mechanism: [locale] route segments + fr.json/en.json; every string lifted out of components.
FIXED STRINGS (never translation keys): "L'Atelier", "Qiwi Chee", "Résonance".
DECIDE AT BUILD TIME: default-locale URL shape (qiwichee.com/ vs /fr/).
Cookie = functional/strictly-necessary → no GDPR consent, but DOES belong in the a11y/privacy statement.
★ ALSO IN SCOPE NOW: the SEND EMAIL HOOK — the only way to make auth emails locale-aware
  (Supabase dashboard templates are static). Today's bilingual-in-one-mail is the interim.
CURRENT INCONSISTENCY: homepage copy EN, Atelier FR. The refactor makes it consistent.
```

---

## 🎬 MEDIA POLICY (standing)

```
Music/video plays IN-PAGE; the site captures traffic, never exports it. Social = net, site = boat.
EMBED HIERARCHY: LEAD with full-audio on her turf (Bandcamp / a YouTube clip). Spotify/Apple =
  small "also on →" links. CRITICAL: player + gate ALWAYS together.
LAZY-LOAD every embed (thumbnail → iframe on click) — non-negotiable (Core Web Vitals + GDPR/EAA).
NO AUTOPLAY / NO snippet auto-cycling — breaks consent-first, WCAG auto-audio, and leans on flaky
  preview APIs. Variety instead = randomise the FEATURED release on load; user clicks to play.
HOSTING: YouTube (UNLISTED) for insider content. No paid Cloudflare Stream until there is
  must-be-un-leakable content. VIDEO never in the repo. IMAGES → next/Image + alt.
POSTERS/THUMBNAILS: local images only — NO third-party thumbnail CDN fetch before the user clicks.
RAW staging: ~/GDrive/Resonance/02_Produit_Tech/. Claude CANNOT watch video, but CAN extract and
  view frames (ffmpeg) to pick a cover.
```

---

## 🔐 RIGHTS-AT-UPLOAD (standing)

```
Every media upload carries a RIGHTS RECORD; nothing publishes until it clears. A GATE, not a nag.
THREE RULES: safe defaults (1 tap); status DRIVES behavior (uncleared → save private + flag);
assists, never advises. Events: rights_confirmed blocks Announce on stream/cocreate.
```

---

## 💶 MONETIZATION (model OPEN, lean B)

```
A) Freemium on the machine (~€9). B) Free machine, paid paperwork (first euro at Phase 2). ← LEAN.
C) Free now, paid on a 2nd signal. DON'T paywall the core viral loop. DECIDE before Phase 2.
NON-NEGOTIABLE: a recurring SaaS fee = commercial revenue → needs CAE V1 to invoice legally
⇒ CRESS IDF / Les Scop IDF + a CAE on the CRITICAL PATH to the first euro.
★ ALSO ON THAT PATH (flagged 2026-07-13): **Vercel Hobby is for personal, NON-COMMERCIAL use.**
  Fine for qiwichee.com today (Phase 1 = no money through the platform). The day Résonance charges,
  Vercel Pro joins Supabase Pro + the CAE on the list. Not a surprise to discover later.
```

---

## ⚖️ LEGAL & STRUCTURE (V1 → V2)

```
V1 — host in a cultural CAE as entrepreneur-salarié. Cheap, reversible, cooperative, can invoice now,
  IP portable BY CONTRACT (confirm in writing), ~10% of turnover.
V2 (with traction) — SAS w/ ESS statutes in the BPI ICC lane, OR a SCIC. Don't found a SCIC now
  (asset trap). Don't build IP in an association to privatize later.
PHASE 1 RULE: NO money through the platform. Fan chip-in = external links. Keeps V1 legal TODAY.
NEXT LEGAL ACTIONS: Call CRESS Île-de-France (free) + Les Scop IDF — CAE shortlist + IP clause.
  Shortlist: Coopetic (closest) · Coopaname · Smart (verify 2026) · Artefacts · Artenréel.
⚠️ EAA: European Accessibility Act enforceable since 28 June 2025 (France: Law 2023-171).
  Microenterprise exemption likely covers you + Qiwi Chee TODAY; stops being optional once
  ticketing/e-commerce is added. Confirm with the entertainment lawyer at V2.
```

---

## 👥 THREE USER ROLES (RBAC via Supabase RLS)

```
OWNER (Artist) — full: media, events, fan roster, (Phase 2) legal/finance. is_owner() via owners table.
COLLABORATOR (Staff/Band) — assigned tasks; NOT financial/legal.
MEMBER (Fan — "ATELIER") — own RSVP/profile + Atelier content; NO legal/financial.
ANON — no grant on any app table. Anything anon must trigger goes through a security-definer RPC.
```

---

## 🛠️ STANDING BUILD REQUIREMENTS — every page

```
THREE-IN-ONE: SEO (server-rendered semantic HTML + metadata + sitemap + hreflang) · WCAG 2.1 AA
  (alt, keyboard, contrast, visible focus, a11y statement) · AI-agent discoverability (schema.org
  JSON-LD MusicGroup/MusicEvent; robots ALLOW ClaudeBot, GPTBot).
DB: every raw-SQL table → grant to authenticated (+ the deliberate secret-table exception).
MEDIA: lazy-load + consent EmbedPlayer. RIGHTS record per upload.
THEME: via tokens, never raw hex. Per-release = accent overrides only; gate stays constant.
SECURITY: user_id/owner ALWAYS from auth session, never request body. getUser() before writes.
  Zod on every route. NO `next`/redirect params accepted from the URL (open-redirect). Server-only
  secrets never NEXT_PUBLIC. External links → ExternalLink. Images → Image + alt.
A11Y BACKLOG (gate): input lacks aria-describedby for errors + errors render in --text not an error
  colour → associate + style as an error state when the gate is next revisited.
```

---

## 🔁 TEMPLATE PATTERNS (reuse per artist instance)

```
THEME TOKENS → per artist, only :root values + the `artist` data block change.
ExternalLink → noopener noreferrer + sr-only new-tab cue (UNCONDITIONAL) + optional aria-label
  and showArrow (gates ONLY the visual ↗).
BrandIcon → 6 inline single-colour SVG paths, fill=currentColor, no npm dep.
AtelierGate → email → magic link. Sent-state includes the SPAM-CHECK microcopy. DONE.
Auth confirm (/auth/confirm) → verifyOtp({type, token_hash}) on OUR domain → touch_fan → new fan
  sees the onboarding (nickname + cities) in place. NO `next` param. DONE. ★ THE STANDARD.
Auth callback (/auth/callback) → exchangeCodeForSession. KEPT for links already in inboxes.
Keepalive → public.keepalive() security-definer RPC + /api/keepalive + vercel.json cron. DONE.
EmbedPlayer → lazy thumbnail→iframe, consent-by-click, provider-agnostic. DONE.
Event engine (SQL + brief ready, UNRUN) → docs/briefs/.
supabase/client.ts = createBrowserClient. supabase/server.ts = @supabase/ssr cookie-based.
```

---

## 🎵 VERIFIED ARTIST PROFILES — Qiwi Chee

```
Spotify open.spotify.com/artist/4Bu89sfVzy14qW0dK8Ugbs · Apple music.apple.com/fr/artist/qiwi-chee/1676154343
Deezer deezer.com/fr/artist/204585817 · YouTube youtube.com/@qiwichee (UCR8h9_VrE-mTa-wekiB6luA)
Bandcamp qiwichee.bandcamp.com · Instagram instagram.com/qiwichee · Links hub msha.ke/qiwichee
Lullabies official MV: youtu.be/L0mHWXa2UyQ (palette source · public front bait).
Insider concert clip: unlisted YouTube Ashg6NO8azo; cover qiwichee_atelier_cover_80s.jpg. Rights CONFIRMED.
Bio: "Auteur/Compositeur-Interprète Franco-algériano-americaine · Hybrid pop · Paris."
  → "Hybrid pop" → "Alternative Pop" change PARKED. EP: Hybrid Fruit. Single: Une Dernière Chose.
NEVER insert an unverified artist ID or URL. Source canonical URLs from the browser address bar.
```

---

## 🗄️ SUPABASE — PROJECT FACTS

```
PROJECT: ref cieefpigrwlhklkkqmdb · eu-west-1 (Ireland). Org "Resonance" (FREE tier).
  ⚠️ FREE TIER PAUSES AFTER 7 DAYS IDLE → a paused project = A DEAD ATELIER GATE.
  Mitigated by the daily keepalive cron. NOT a permanent fix: the moment a real event with real
  RSVPs depends on the gate, Supabase Pro (~$25/mo) stops being an expense and becomes insurance.
AUTH: magic link on. Confirm email ON (⇒ TWO email templates, see above). Site URL https://qiwichee.com.
  Redirect allow-list: qiwichee.com/auth/callback (+www, +.fr, +localhost:3000).
EMAIL/SMTP: custom SMTP via OVH → hello@qiwichee.com, pro2.mail.ovh.net:587 STARTTLS. Rate 30/hr.
KEYS: client uses the anon public key. service_role NEVER client-side, NEVER in a health check.

TABLES (built):
  fans(id uuid PK → auth.users, email, nickname, cities text[], visit_count, created_at, last_seen_at)
    RLS own-row; GRANTED select/insert/update to authenticated. NOT to anon — deliberately.
FUNCTIONS (built):
  touch_fan(p_email) → (is_new, visits); security definer.
  ★ keepalive() → 'ok'; security definer; grant execute to anon. Touches no table.
TABLES (SPEC READY, UNRUN): owners · events · event_access · rsvps (event engine).
```

---

## INFRASTRUCTURE FACTS (verified, don't re-derive)

```
EMAIL — OVH Email Pro: pro2.mail.ovh.net, IMAP 993 SSL / SMTP 587 STARTTLS. hello@qiwichee.com +
  booking@ (alias). SPF + DKIM + DMARC all verified (DMARC p=none, monitor only).
DNS — Vercel: apex A 216.198.79.1; www CNAME 42d7eef65754d8a8.vercel-dns-017.com. .fr → redirect to .com.
  ⚠️ qiwichee.com 308-REDIRECTS TO www.qiwichee.com. This matters for the cron (see OPEN VERIFICATION)
     and for anything that must carry an Authorization header — redirects DROP it.
VERCEL: Hobby plan. Cron = ONCE PER DAY MAX, fires anywhere within the specified hour, UTC only.
  Runtime logs retained 1 HOUR on Hobby. Cron invocations that return a redirect are NOT LOGGED.
  CRON_SECRET env var → Vercel auto-sends it as `Authorization: Bearer <value>` on cron calls.
  ⚠️ AN ENV VAR IS INERT UNTIL A DEPLOY. After rotating a secret: git commit --allow-empty && push.
ENV VARS: NEXT_PUBLIC_SUPABASE_URL · NEXT_PUBLIC_SUPABASE_ANON_KEY · NEXT_PUBLIC_SANITY_PROJECT_ID
  · NEXT_PUBLIC_SANITY_DATASET · NEXT_PUBLIC_MAILCHIMP_AUDIENCE_ID · MAILCHIMP_API_KEY (server-only)
  · ★ CRON_SECRET (server-only).
SERVICES: github.com/bkark/qiwichee · Vercel auto-deploys from main · Sanity bayrhx8r · OVH domains.
DEPLOY NOTE: preview *.vercel.app URLs are NOT on the Supabase redirect allow-list → gated flows
  cannot be tested on a random preview. Test on localhost:3000 or production.
```

---

## DEVELOPER ENVIRONMENT

```
OS: Linux Mint · user simba · hostname ssd. Repo: /home/simba/Projects/qiwichee
Specs/raw: /home/simba/GDrive/Resonance/02_Produit_Tech/ · Sync: ~/sync_resonance.sh
Briefs in repo: docs/briefs/ (tiny_concert_engine.md, event_engine.sql, keepalive.sql,
  ★ release_switcher.md)
  docs/templates/ (★ supabase_emails.md) · docs/BRIEF_embed_player.md
Node v22.22.3 · Next.js 16.2.4 · TS · Tailwind 4 (CSS-first @theme) · @supabase/ssr
Apple keyboard. VS Code integrated terminal: View > Terminal.

★ CLAUDE DESKTOP FOR LINUX now exists (BETA — Ubuntu/Debian; Mint is Ubuntu-based but NOT officially
  tested). Install via Anthropic's apt repo so updates arrive with the system. The valuable part is
  the CODE tab (parallel sessions, VISUAL DIFF REVIEW, integrated terminal/editor, live preview) —
  visual diff review maps directly onto the strict diff-review gate. COWORK is for non-dev knowledge
  work and adds little to a Next.js repo; it also needs KVM + ~25 GB disk + 8 GB RAM. Side-quest,
  not mid-build.

WORKFLOW QUIRKS:
  - TERMINAL HEREDOC mangles fast multi-line pastes. For multi-line files: download-then-cp, or
    hand to Claude Code. Never paste long heredocs.
  - `git --no-pager diff` avoids the `less` pager.
  - ★ A NEW FILE DOES NOT SHOW IN `git diff` — verify creations with `git status`.
  - ★ GREP FROM `src`, NOT `src/app` — components live in src/components/.
  - `sed -i` with `|` as delimiter when the text contains `/`.
  - ★ `>>` appends, `>` DESTROYS. And never paste the angle brackets from a <placeholder>:
    bash reads `<` as input redirection.
  - Claude Code briefs: scoped, NO auto-commit, show `git status` AND the full file, AA verify,
    grep hex. Review the FULL diff — including any SHARED component the brief didn't name.
    Bassim commits and pushes MANUALLY. Claude Code will sometimes suggest steps already done in
    the dashboard (e.g. `vercel env add`) — it cannot see the dashboard. Ignore those.
  - DEPLOY: commit + push to main → Vercel auto-deploys. Keeps main = source of truth.
  - SQL runs in the Supabase SQL editor (browser). No Supabase MCP/CLI wired yet.
  - ★ VERIFY-DON'T-ASSUME cuts BOTH ways: a committed .sql is not a built schema, AND a chat
    snippet is not a deployed function. Check the DB / the filesystem / git status.
  - DEBUG: read the actual error BODY, not just the status. If a route hides the error, TEMPORARILY
    surface it, diagnose, then revert.
GOTCHA: Next.js 16 rejects og:type "music.musician" at runtime → use "website"; MusicGroup JSON-LD
  carries the signal.
```

---

## INSTRUCTIONS FOR THIS AI

```
- Explain every command + WHY (telecom analogies help). One step, wait for confirmation.
- BUILD SEQUENCE: theme tokens ✅ → Atelier gate ✅ → SPF/DKIM/DMARC ✅ → EmbedPlayer ✅ → Lullabies
  palette + [data-release] ✅ → cities microcopy ✅ → platform icon-row ✅ → insider clip ✅ →
  deliverability + keepalive ✅ → (NEXT) music release-switcher → event engine → bilingual next-intl
  (own session) → per-teaser links. THEN Phase 2 GUSO/CDDU.
- The site is a fan MACHINE; the Atelier gate is the center. AND: if the gate's email doesn't
  arrive, or the DB is paused, the machine does not exist. Deliverability + uptime ARE the product.
- Every raw-SQL table → grant to authenticated. ANON has no table grants — anything anon triggers
  goes through a security-definer RPC that reads nothing. Read error BODIES, not statuses.
- An env var saved in Vercel is INERT until a deploy. After rotating a secret: redeploy.
- Never accept a `next`/redirect parameter from a URL (open-redirect). Destination comes from state.
- Theme via tokens, never raw hex. Every page: SEO + WCAG AA + JSON-LD.
- Phase 1 = NO money through the platform. SaaS fee needs the CAE live (and Vercel Pro, and probably
  Supabase Pro) → CRESS IDF / Les Scop IDF on the critical path once charging.
- user_id/owner ALWAYS from the auth session, never the request body. Zod on every route.
- Claude Code briefs: scoped, no auto-commit, show `git status` + full files. Review the FULL diff.
- ★ Horizontal swipe = browsing SIBLINGS within a section only (releases, later photos). NEVER
  navigation between sections. Cross-section jumps = links/anchors. The gate never behind a swipe.
- Never suggest Telegram (WhatsApp links). Flag geographic/institutional risks neutrally.
- Remind to consult the entertainment lawyer before the /legal module.
- End of session: ask if instructions need updating; offer an updated CONTEXT_FOR_AI; remind
  ~/sync_resonance.sh (cp to Specs FIRST, then run — the script copies Specs → repo, not the reverse).
```

---

## OPEN DECISIONS / NEXT ACTIONS

```
[x] Theme-token foundation · Lullabies palette · [data-release] architecture.
[x] Atelier access gate — magic-link login + profile + status badge + Mailchimp sync. TESTED.
[x] SPF + DKIM + DMARC. (…and still hit a Yahoo spam folder — see LEARNING #6.)
[x] EmbedPlayer + insider clip unlocked + LIVE.
[x] Cities microcopy · platform-links icon row.
[x] ★ Spam-check microcopy on the gate's sent state (2026-07-13).
[x] ★ /auth/confirm — magic links verified on OUR domain; zero supabase.co in any email (2026-07-13).
[x] ★ BOTH email templates rebuilt, bilingual FR/EN (2026-07-13). Saved to docs/templates/.
[x] ★ Supabase keepalive — RPC + route + daily cron; route VERIFIED (200/401) (2026-07-13).

[ ] ★★ VERIFY THE CRON ACTUALLY FIRES — Vercel → Cron Jobs, after 04:00 UTC, SAME DAY (logs kept 1h
    on Hobby). The apex→www 308 may be eating the Authorization header, and redirected cron responses
    are NOT logged. Empty log = make www canonical and re-test. DO THIS FIRST NEXT SESSION.
[ ] ★ TEST `{{ .SiteURL }}` IN THE EMAIL TEMPLATES — would make the template text artist-agnostic
    (one field changes per artist instead of hand-edited HTML). UNTESTED. Verify on a real send
    before rolling it out to a live artist.
[ ] ★★ DECIDE: ONE SUPABASE PROJECT PER ARTIST vs. ONE SHARED RÉSONANCE PROJECT.
    Email templates are PER-PROJECT ⇒ per-artist projects means hand-pasting templates forever.
    Fine at 1–5 artists; not fine at 50. The scalable answer is one project, artists as rows, one
    auth surface. This is an ARCHITECTURAL decision with a long tail. DECIDE BEFORE ARTIST #3.
[ ] ★ Fix the remaining Supabase templates (Invite / Change email / Reset password) — they still
    carry {{ .ConfirmationURL }} and will leak supabase.co the day a flow fires them. Known, parked.
[ ] ★ Consider a dead-man's-switch monitor (Healthchecks.io / UptimeRobot) — alert on the ABSENCE of
    the keepalive ping. Converts "I think it's working" into "I'd be told if it stopped."
[ ] (NEXT BUILD) Music release-switcher = the [data-release] feature, as a HORIZONTAL SCROLL-SNAP
    CAROUSEL — build from docs/briefs/release_switcher.md. Key traps written in the brief:
    HYDRATION (random featured = client-side scroll position, never DOM order) and the ~88%-width
    partial peek (load-bearing affordance). Per-release palettes hand-picked + AA-verified here.
    Bandcamp full-audio leads; click-to-play; no autoplay; gate never inside the carousel.
[ ] ★ Analytics layer 1 brief — analytics_events table + log_event security-definer RPC (keepalive
    pattern, INSERT one row, no client grant). Events: slide view / play click / gate view / gate
    submit. Also carries the per-teaser tracked links (same table, same RPC). Clarity DEFERRED
    (GDPR consent banner). Build after (or alongside) the carousel — the IntersectionObserver
    the carousel needs anyway is the emitter.
[ ] Lyrics + music sheets as content types — PARKED behind rights review (lawyer list).
[ ] (THEN) Event engine — run docs/briefs/event_engine.sql → seed owners row → owner UI + RSVP flow.
[ ] (THEN, own session) Bilingual next-intl refactor — [locale] segments, fr/en.json, toggle, hreflang.
    ALSO IN SCOPE: the Send Email Hook (the only way to make auth emails locale-aware).
[ ] Add front MV thumbnail — local poster to public/ + poster prop.
[ ] (When a 2nd insider clip arrives) Promote insiderClip const → insider_media table.
[ ] (Gate a11y) input aria-describedby for errors + error-state colour.
[ ] Watch visit_count double-fire (mail scanners pre-fetch links; a GET on /auth/confirm burns the
    token exactly as a GET on the supabase.co URL did — moving domains did NOT fix this). If it bites,
    the fix is an interstitial page with a button (scanner GETs the page; only a human's click POSTs).
    Don't pay that extra-click cost until the problem is real.
[ ] Genre text "Hybrid pop" → "Alternative Pop" — PARKED.
[ ] DECIDE monetization model A/B/C (lean B) — before Phase 2.
[ ] Call CRESS IDF + Les Scop IDF (CAE shortlist + IP clause) — critical path once charging.
[ ] Document Qiwi Chee's journey publicly (build-in-public = beta-tester acquisition).
```

---
*Updated 2026-07-14 · Copy fix + release-switcher design session. Cities label de-confused (real
user feedback). The release-switcher is now fully specified as a scroll-snap carousel — swipe
between releases, page recolours, hydration trap and partial-peek written into the brief. Analytics
answered first-party (log_event RPC, keepalive pattern); Clarity deferred behind the consent
decision. Cron verification STILL open. NEXT BUILD = the carousel, from docs/briefs/release_switcher.md.*
