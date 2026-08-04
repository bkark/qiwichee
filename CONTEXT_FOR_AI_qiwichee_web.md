# Résonance — AI Context File
> Paste/upload this at the start of any new conversation to resume instantly.

**Last updated:** 2026-08-04 — **PRODUCT MODEL SESSION. NO CODE SHIPPED. FIVE STANDING RULES ADDED.**
This session was strategy + naming, triggered by an external (Kimi) conversation that was imported,
de-conflicted and folded in. Nothing was built. What changed is **the rules everything else obeys**:
(1) **“L’Atelier” → “Atelier”** as the product name (artist’s decision); (2) **curved apostrophe `’`
everywhere in French display text**; (3) **fan-facing labels must be epicene**; (4) the Phase-1 money
rule was **re-framed from timing to custody** — Résonance never *holds* fans’ money, but Stripe
Connect direct charges are viable much earlier than previously written; (5) **ONE SHARED SUPABASE
PROJECT — DECIDED**, which makes every table multi-tenant from line one and puts the **Send Email
Hook on the critical path**.
**Status:** qiwichee.com LIVE ✅ · Atelier gate ✅ · Magic links ✅ · Keepalive CRON VERIFIED ✅ ·
Release-switcher carousel LIVE ✅ · SPF+DKIM+DMARC ✅ · Event-engine SQL ✅ committed, ⛔ UNRUN
**(and now DELIBERATELY HELD — it needs new columns, see LADDER & SEASONS)** ·
Storage: ONE tree, backed up nightly ✅
**Next session goal (in order):** (1) **NAMING/COPY PASS** — Atelier rename + “Accéder à l’Atelier”
+ curved apostrophes, site **and both Supabase email templates** (one brief, mechanical, do it first
so nothing else inherits the old strings). (2) **DESIGN PASS — carousel v2** (song-per-slide +
credits + Bandcamp UX). (3) **DESIGN PASS — ladder & seasons** (blocks the event engine).
(4) EVENT ENGINE (run the *revised* SQL + seed owners row). (5) BILINGUAL next-intl + Send Email Hook.

---

## 🏷️ NAMING — CHANGED 2026-08-04 (artist’s decision; propagate everywhere)

```
THE NAME IS:  Atelier          (NOT “L’Atelier”. The article is no longer part of the name.)

BUT French grammar keeps the article in running prose — same as “Louvre” / “aller au Louvre”:
  Standalone (nav, headings, wordmark, page title, JSON-LD name):  Atelier
  In a sentence:                                                   l’Atelier  (capital A kept)
  Examples:  “Accéder à l’Atelier”  ·  “Bienvenue dans l’Atelier”  ·  “Atelier” (nav item)

CTA COPY CHANGED:  “Accéder à l’Atelier”
  REPLACES: “Rejoindre l’Atelier” (wrong — you join once, you access repeatedly)
  REPLACES: “Entrer dans L’Atelier” (the current string in BOTH Supabase email templates)

⚠️ THE EMAIL TEMPLATES ARE PART OF THIS. If the site says “Accéder” and the first-contact mail
   says “Entrer dans L’Atelier”, the two disagree at the exact moment of first contact.

FILES CARRYING THE OLD STRINGS (grep before assuming this list is complete):
  src/…/AtelierGate.tsx · src/…/AtelierContent.tsx · page copy · nav · metadata/JSON-LD ·
  docs/templates/supabase_emails.md · BOTH LIVE Supabase templates (Confirm signup + Magic Link)

FIXED BRAND STRINGS (never translated, FR or EN): “Atelier” · “Qiwi Chee” · “Résonance”
```

---

## ✍️ FRENCH TYPOGRAPHY — CURVED APOSTROPHE (standing rule, added 2026-08-04)

```
USE  ’  (U+2019 RIGHT SINGLE QUOTATION MARK)   NOT  '  (U+0027 APOSTROPHE)
in ALL French display text. “l’Atelier”, “d’écoute”, “aujourd’hui”.

WHY IT ALSO HELPS TECHNICALLY (three free wins, not just typography):
  - Silences eslint react/no-unescaped-entities (that rule flags ' and ", not ’).
  - 'l’Atelier' does NOT break a single-quoted JS/TS string — no escaping needed.
  - Sidesteps the bash '\'' escaping gymnastics in heredocs and sed.

⛔ WHERE IT MUST NEVER GO (machine text stays straight, or has no apostrophe at all):
  slugs · filenames · URLs · email addresses · DB column/table/enum values · SQL identifiers ·
  CSS class names · sed patterns · env var names · JSON keys.
  RULE OF THUMB: if a human reads it, ’ . If a machine matches it, ' or nothing.

ENFORCEMENT GREP (same discipline as the hex-token grep — run it in every copy review):
  grep -rn "[A-Za-zÀ-ÿ]'[A-Za-zÀ-ÿ]" src/ --include=*.tsx --include=*.ts

TYPING IT (Linux Mint, Apple keyboard): Ctrl+Shift+U → 2019 → Enter in GTK apps.
  In VS Code that shortcut does NOT work — define a snippet or set a Compose key. Do this once.

PARKED (real French typography, not enforced yet): narrow no-break space before : ; ! ?
  and inside « ». Interacts with line-breaking and copy-paste. Revisit in the bilingual session.
```

---

## 🎚️ ENGAGEMENT LADDER & SEASONS — THE PRODUCT (new 2026-08-04, DESIGN PASS PENDING)

```
THE PRODUCT INSIGHT (Bassim, this session): THE ARTIST MUST NOT HAVE TO INVENT THE RULES.
Résonance ships the PROGRAM — the levels, the rhythm, the milestones. The artist supplies content.
That is what makes it a tool and not a blank CMS. Without it, the gate produces a DEAD EMAIL
DATABASE: the failure mode this whole layer exists to prevent.

THE LADDER (three tiers — deliberately few, must be explainable in one sentence):
┌───────────┬──────────────┬────────────────────────────────────────────┬──────────┐
│ Visiteur  │ no gate      │ bio, music, links                          │ LIVE ✅  │
│ Membre    │ magic link   │ Atelier, insider content, RSVP, city pin   │ LIVE ✅  │
│ Abonné    │ paid (Stripe)│ online concerts, priority RSVP, votes,     │ DESIGN   │
│           │              │ season arc, producer credits               │          │
└───────────┴──────────────┴────────────────────────────────────────────┴──────────┘
Tier 1 and 2 ALREADY EXIST. Only tier 3 is new. Say this out loud when scoping — it is much
less work than the strategy documents make it sound.

BEHAVIOURAL BADGES sit INSIDE tier 2, driven by visit_count (touch_fan already increments it —
the first rung is built). FIRST BADGE NAMED: “Fidèle à l’écoute”.
  ⛔ REPLACES “Habitué” — gendered. See the EPICENE rule below.

SEASONS — the container (strongest idea of the session, and it is STRUCTURAL, not cosmetic):
  A season = a 3–4 month arc with a start, a fixed ritual rhythm (predictable weekly beats),
  a collective milestone, and a FINALE (the concert). Events therefore DO NOT STAND ALONE —
  an event belongs to a season. This is a schema fact, not a marketing frame.

PRIORITY ACCESS, NOT SEAT MAPS (simplification — take this one):
  “Better seats for high-level fans” ships as a PRIORITY RSVP WINDOW: tier 3 opens 48h before
  tier 2. ONE TIMESTAMP COLUMN instead of a seating engine, and in a tiny venue it delivers
  exactly the same felt privilege. Do not build seat selection.

COLLECTIVE MILESTONE (“40 subscribers = a show”): threshold on RSVP COUNT, money external.
  Same fan psychology, no escrow exposure. If the mechanic doesn’t work free, it won’t work paid.

⚠️ THE REAL BLOCKER ON TIER 3 IS NOT CODE. The artist needs a legal way to RECEIVE the money.
   A fan subscription paid to an artist with no structure is income they cannot invoice cleanly —
   the CAE / billing-provider problem. TIER 3 SHIPS WHEN THE ARTIST HAS A STATUS, not when Stripe
   is wired. → Check where Qiwi Chee stands. This may be the actual critical path.

STILL TO DESIGN (the pass that blocks event_engine.sql):
  - Final tier names + the full badge set (every label passes the EPICENE test).
  - Season object shape, ritual rhythm, what a finale is in data.
  - ⚠️ OPEN FORK: can one fan belong to SEVERAL artists’ Ateliers? If yes, `fans` becomes a join
    on (auth user, artist) rather than one row per person. Decide IN this pass — it is load-bearing
    for the multi-tenant schema. Do not decide it in passing.
```

---

## 💶 MONEY — RULE RE-FRAMED 2026-08-04 (custody, not timing) ⚠️ SUPERSEDES “NO MONEY IN PHASE 1”

```
OLD RULE (retired): “Phase 1 = no money through the platform.”  Timing was a PROXY for the real risk.

THE RULE NOW:  RÉSONANCE NEVER HOLDS OR REDISTRIBUTES FANS’ MONEY.
  Holding and redistributing is what makes you a PAYMENT INTERMEDIARY in the EU (DSP2 / ACPR).
  That is the line. Everything else is a product decision, not a legal one.

✅ ALLOWED, AND EARLIER THAN PREVIOUSLY WRITTEN — STRIPE CONNECT, DIRECT CHARGES:
   The fan’s card is charged to THE ARTIST’S OWN Stripe account. Stripe does KYC on the artist.
   Résonance takes an `application_fee_amount`. Funds never touch us. This is the ordinary
   SaaS-marketplace pattern, NOT payment intermediation. → Stripe is the right start.
   Phase-2 “partner with a company already set up to pay artists” stays a fallback, likely not
   needed to launch subscriptions.

⛔ STILL OUT — TICKET ESCROW / PRE-BUY PENDING A THRESHOLD:
   Holding fans’ money for weeks means charging + refunding ⇒ chargebacks and refund liability
   land on the platform. And a card AUTHORIZATION only holds a few days, not a campaign.
   → Thresholds run on RSVP COUNT. Ticketing stays EXTERNAL. Crowdfunding stays EXTERNAL LINKS.

MONETIZATION OPTIONS (A/B/C + the new D — DECIDE BEFORE PHASE 2, not now):
   B (leaning): free machine, paid paperwork.
   D (new, from the Kimi import): TAKE-RATE ON FAN REVENUE instead of a fixed artist fee.
     Lowest barrier to entry AND the heaviest legally — it is the model that most tempts you
     toward intermediation. Keep it open; do not resolve it in a build session.

⚖️ OPEN QUESTION FOR THE LAWYER + CRESS IDF / Les Scop IDF — REFER vs OPERATE:
   Does Résonance ever EMPLOY anyone, or does it only REFER and PRE-FILL?
     - Referring artists to a billing partner (Coopaname / Oxalis / Appuy Culture) and pre-filling
       GUSO/CDDU = software = the documented plan = fine.
     - Actually employing artists so they accrue intermittence rights = coopérative de production /
       portage spectacle = an EMPLOYER activity, and organising/employing for shows raises the
       LICENCE D’ENTREPRENEUR DE SPECTACLES question. Precedent already in the research file:
       SMart’s French intermittence function was curtailed after a Pôle Emploi dispute.
   The answer shapes the V2 structure choice (SAS-ESS vs SCIC). NOT to be answered from notes.
```

---

## 🏗️ RÉSONANCE vs ATELIER — TWO PRODUCTS (clarified 2026-08-04)

```
ATELIER   = the FAN AREA product. A fan-engagement space an artist can buy on its own and link
            from an existing website they already have. Sellable standalone. This is a real wedge.
RÉSONANCE = the PLATFORM that sells it — subscription gets you Atelier + website + (later)
            the paperwork layer.

⛔ NEVER use “Atelier” to mean the platform. (The imported Kimi document did this throughout —
   it was written without the full concept. Fixed on import. Same reason you don’t reuse a VLAN
   ID on two segments and hope the trunk sorts it out.)

CONSEQUENCE: because Atelier ships standalone to MANY artists, the Supabase question is closed —
see below. A standalone product cannot carry one Supabase project per customer.
```

---

## 🗄️ SUPABASE ARCHITECTURE — ★ DECIDED 2026-08-04: ONE SHARED PROJECT

```
DECISION: ONE SHARED RÉSONANCE SUPABASE PROJECT. ARTISTS ARE ROWS. (Closes the open decision
that was flagged “decide before artist #3”.) It is the only shape in which standalone Atelier works.

CONSEQUENCE 1 — MULTI-TENANT FROM LINE ONE:
  EVERY table gets a tenant column (artist_id / owner_id) at creation. RLS partitions on it.
  This includes the UNRUN event_engine.sql — which is exactly why it is still unrun. Good.

CONSEQUENCE 2 — `fans` NEEDS A MIGRATION, AND IT IS LIVE WITH REAL ROWS:
  `fans` has no tenant column. Migration: add artist_id nullable → backfill every existing row to
  Qiwi Chee → set NOT NULL → rewrite RLS to (own row AND artist scope).
  CHEAP TODAY. UGLY AT 200 FANS. Do it before the event engine, not after.

CONSEQUENCE 3 — ⚠️ THE SEND EMAIL HOOK IS NOW ON THE CRITICAL PATH (this is the big one):
  Supabase AUTH CONFIG IS PER-PROJECT, NOT PER-ARTIST. One shared project ⇒ ONE Site URL,
  ONE set of email templates, and ONE custom SMTP sender.
  But the whole deliverability design depends on the OPPOSITE: mail sent from the ARTIST’S OWN
  mailbox, with the link on the ARTIST’S OWN domain — because sender-domain ≠ link-domain is the
  phishing fingerprint that put the first magic link in a Yahoo spam folder (2026-07-13).
  ❌ {{ .SiteURL }} DOES NOT RESCUE THIS — in a shared project it resolves to one shared URL for
     everybody. Close the “test {{ .SiteURL }}” action item: the shared decision makes it moot.
  ✅ THE ANSWER IS THE SEND EMAIL HOOK: take over sending. Look up which artist the fan belongs to,
     send via THAT artist’s SMTP, build the link on THAT artist’s domain, and localise in the same
     place. Previously scoped as a bilingual-session nicety; it is now **what unblocks artist #2**.
     It grew a tenant lookup. Budget for it accordingly.

STILL TRUE MEANWHILE: qiwichee is currently a single-tenant project in practice. Nothing breaks
today. The cost of the decision is paid at artist #2, and the schema work is paid NOW (free).
```

---

## 🗺️ TOUR BUILDER — the named destination for owner_city_density (added 2026-08-04)

```
ROADMAP ITEM (Bassim confirmed: real, not parked). Fans drop pins / pick cities; density unlocks a
city’s tour date. THE SIGNAL IS ALREADY BEING COLLECTED — the Atelier gate’s multi-city picker
feeds owner_city_density. Tour Builder is the VISIBLE SURFACE of a silent signal.

TWO CONSEQUENCES:
1. The parked CITY-PICKER MICROCOPY fix (clarify the field asks where they would want to ATTEND a
   concert) is no longer cosmetic — it is load-bearing. PROMOTED.
2. SCHEMA: is `city` free text or normalised? A map needs coordinates ⇒ Géoplateforme geocoding
   https://data.geopf.fr/geocodage/search   (⚠️ the old api-adresse.data.gouv.fr is DECOMMISSIONED —
   see RESEARCH_SUMMARY). Free-text cities will need cleaning later. Decide in the ladder pass.
```

---

## 🎠 CAROUSEL V2 — NEXT DESIGN PASS (decided 2026-07-15; +1 item 2026-08-04)

```
1. ONE SLIDE PER SONG: the SONG is the atomic unit; “album” becomes a LABEL on a song
   (“Album · Hybrid Fruit · 2/6”), not a container slide. Each song eventually carries its own
   artwork + clip; fans participate in creating/choosing per-song art; later per-song crowdfunding
   (EXTERNAL LINKS ONLY) can finance a clip or artwork.
   CONSEQUENCES: 4 slides → ~9 (Hybrid Fruit = 6 songs) — do dots scale? visual grouping of album
   siblings? per-song Bandcamp track IDs each verified from its embed dialog; JSON-LD shifts to
   MusicRecording-per-song with inAlbum; fan co-creation touches the RIGHTS-AT-UPLOAD gate.
2. CREDITS LINE per song (video/photo/artwork credits), length-independent.
   ★ CHANGED 2026-08-04: STORE CREDITS AS STRUCTURED RECORDS `{role, name}[]`, NOT A FORMATTED
   STRING. Reason: the ladder’s PRODUCER CREDITS (fans earning credits on releases) are the same
   field with a different author. Structured now = rows later; string now = a text-parsing problem
   later. Costs nothing today.
   ⚠️ Bassim proposed a slow auto-scrolling marquee — flagged honestly: continuous auto-motion
   collides with the no-autoplay/motion principles (WCAG 2.2.2 pause-stop-hide +
   prefers-reduced-motion). Alternatives to present: static truncation + expand-on-tap; marquee
   ONLY behind prefers-reduced-motion:no-preference AND pausable; or credits in the slide flow.
3. BANDCAMP TWO-CLICK + STOP AFFORDANCE: click 1 loads Bandcamp’s iframe (our poster consent),
   click 2 is BANDCAMP’S OWN play button. Keep the two-step but make it LEGIBLE (“Charger le
   lecteur”) + a visible labelled STOP on the active card (unmount-to-poster — true pause inside a
   cross-origin iframe is unreachable). Do NOT render iframes without click-consent; do NOT fetch
   Bandcamp audio into our own <audio> (rights/ToS).
   All three fold into ONE design pass → one brief → Claude Code.
```

---

## 🎠 RELEASE-SWITCHER CAROUSEL — LIVE (commits caf0938 → 7eed377 → 9178230)

```
Horizontal CSS scroll-snap carousel in the Music section, no library. Slides 88% wide (partial peek
= load-bearing affordance). Signature element: swiping recolours the page accent per release.
4 slides, canonical DOM order (newest first): lullabies → hybrid-fruit → une-derniere-chose →
dilemma. Fixed order server-rendered; “random featured” = CLIENT-SIDE SCROLL POSITION ONLY
(useEffect + scrollTo behavior:'instant') — hydration-safe, no console warning.
Files: src/app/components/ReleaseSwitcher.tsx · src/data/releases.ts · 4 covers in public/ ·
globals.css carousel + palette blocks.
EmbedPlayer: poster prop per slide + CONTROLLED MODE (isActive/onActivate/onDeactivate — BOTH
isActive+onActivate required; omitting them preserves uncontrolled behaviour so the Atelier insider
clip is untouched). SHARED COMPONENT — any change gets extra diff review.
SINGLE ACTIVE PLAYER: carousel owns activeEmbedSlug; play on B unmounts A’s iframe to poster.
Iframe teardown IS the stop mechanism.
Desktop arrows: real <button>s, aria-labels, ≥44px, disabled at hard ends (NO wrap), CSS-only
visibility via @media (pointer: fine). Dots remain (buttons, aria-current, 44px).
mediaService: Bandcamp EmbeddedPlayer URL with bgcol/linkcol from asset.embedOptions.
  ⚠️ THIRD-PARTY URL PARAMS = the ONE legitimate hex outside globals.css (commented; grep-exempt).
JSON-LD: MusicAlbum/MusicRecording per release, byArtist → MusicGroup; MusicGroup carries
  "alternateName": "LEILANI" (Dilemma = LEILANI era; an ID change, not a burial).
Card alignment: releases without a date render an invisible aria-hidden placeholder line.
Iframe resilience (best-effort): error event + offline→online → unmount to poster.

PAGE-LEVEL OVERFLOW BUG + FIX (9178230) — THE FLEXBOX MIN-WIDTH TRAP:
  A plain <div class="relative"> between max-w-3xl and the scroller was pushed to content width
  (~2249px vs 811px viewport) because wrappers default to min-width:auto — the WHOLE PAGE scrolled
  sideways. overflow-x:auto only clips when the box’s width is CONSTRAINED.
  FIX: "relative w-full max-w-full min-w-0 overflow-hidden".
  DIAGNOSIS RECIPE (reusable) — DevTools console:
    document.body.scrollWidth + ' vs ' + window.innerWidth
    [...document.querySelectorAll('*')].filter(el => el.scrollWidth >
      document.documentElement.clientWidth).map(el => el.className || el.tagName)
  overscroll-behavior-x:contain only stops SCROLL CHAINING — it treated a symptom.

VERIFIED ON REAL DEVICE (Android Chrome, 2026-07-15): swipe + recolour + peek ✅ · one player at a
time ✅ · alignment ✅ · Bandcamp plays IN-PAGE ✅ · overflow gone ✅.
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
Bandcamp embed IDs come ONLY from the release page’s Partager/Intégrer dialog (not the URL slug).
NEVER insert an unverified ID; per-song track IDs for the v2 restructure must EACH be pulled
from that dialog.

PALETTES (globals.css, [data-release] accent-only overrides; structure tokens constant):
  lullabies          NO OVERRIDE — site default prune #7A3B8C WAS extracted from this MV;
                     swiping to Lullabies = returning to base colour. Deliberate.
  hybrid-fruit       #C2185B framboise        white-on-accent 5.87:1 ✅  on-bg 4.93:1 ✅
  une-derniere-chose #1C6E8C bleu d’eau       white-on-accent 5.74:1 ✅  on-bg 4.82:1 ✅
  dilemma            #9E1B32 carmin profond   white-on-accent 7.90:1 ✅  on-bg 6.64:1 ✅
  Ratios MEASURED (WCAG formula vs --bg #E8EBF5, cross-checked against prune 6.23:1).
  Colours remain PLACEHOLDER pending Qiwi Chee’s artistic approval only.

ARTWORK in public/: dilemma-cover.jpg 1200² ✅ · une-derniere-chose-cover.jpg 1600² ✅ ·
  hybrid-fruit-cover.jpg ⚠️ 350px Bandcamp thumbnail PLACEHOLDER · lullabies-cover.jpg ⚠️ 1368×768
  16:9 YouTube screenshot PLACEHOLDER. Remaining photo batch (6× IMG-2026…) in 04_Qiwichee =
  parked bio/images build. Don’t touch.
```

---

## ⚠️ OPEN — PENDING QIWI CHEE (piecemeal drop-ins)

```
[ ] Square Lullabies cover (Spotify/Deezer artwork) → drop-in replaces public/ placeholder.
[ ] Hybrid Fruit hi-res source (Bandcamp original: cover URL suffix _0.jpg trick, or her file).
[ ] Approve/veto the 3 accent colours (send swatches + covers; her artistic veto stands).
[ ] Confirm Dilemma slide descriptor wording (currently: “Album — sorti sous le nom LEILANI”).
[ ] ★ NEW: her legal status for receiving subscription income (CAE / auto-entrepreneur / none).
    This gates TIER 3, not the code. Ask early.
[✓] Product name: “Atelier”, not “L’Atelier”. DECIDED by her, 2026-08-04.
```

---

## 🗄️ STORAGE — SINGLE SOURCE OF TRUTH (unchanged since 2026-07-15)

```
THE ONE TRUE TREE:  /media/Main_HDD/GDrive/
  ├── Resonance/                     (00_Claude_Projects … 04_Qiwichee)
  │   ├── 02_Produit_Tech/Specs/     (context files — the sync source)
  │   ├── 04_Qiwichee/               (artist assets)
  │   └── sync_resonance.sh          (the REAL script; SPECS= points at Main_HDD)
  └── Dropbox/                       (personal archive, incl. rescued Amine/)

BACKED UP NIGHTLY by /home/simba/automation/scripts/backup_gdrive.sh (rclone, cron.daily, as root):
Main_HDD/GDrive → gdrive:Laptop_Sync/GDrive with --backup-dir time-machine archiving. Also backs up
~/Projects (excl. node_modules/.git/.next) and ~/automation. ONE-WAY local→cloud. Email alert on fail.

DEAD PATHS (do not resurrect): ~/GDrive/… and ~/Documents/GDrive/…
LAUNCHER: ~/sync_resonance.sh → bash /media/Main_HDD/GDrive/Resonance/sync_resonance.sh

LESSON (standing): “WHICH folder is backed up?” is answered by the BACKUP SCRIPT’S SOURCE PATH,
not by notes. cat the script; make the machine name the truth. A one-way backup means cloud-side
additions are invisible locally — know your sync direction per tree.
```

---

## 🔑 HARD-WON LEARNINGS (standing)

```
1. THE BACKUP SCRIPT’S SOURCE PATH IS THE ONLY TRUTH about what is backed up.
2. WHEN TWO COMPUTATIONS OF THE SAME NUMBER DISAGREE, RE-DERIVE FROM THE FORMULA before deciding
   which to distrust. Verify-don’t-assume includes your own earlier arithmetic.
3. FLEXBOX MIN-WIDTH TRAP: a plain wrapper between a width constraint and a flex scroller gets
   pushed wide (min-width:auto) → overflow-x:auto never engages. Fix at the wrapper: min-w-0 /
   max-w-full. overscroll-behavior only stops chaining; it is not a width constraint.
4. A file cut at EXACTLY a power-of-two size (1 MiB) is a truncated interrupted copy.
5. Quarantine-then-delete beats direct rm: reversible, and breaks hidden dependencies LOUDLY.
6. Vercel cron invocations ARE logged with status + external API calls under Observability →
   Cron Jobs. The apex→www 308 did NOT eat the cron: Vercel invokes the deployment directly.
★ 7. (2026-08-04) IMPORTED STRATEGY DOCUMENTS CARRY FOREIGN VOCABULARY. The Kimi document used
   “Atelier” to mean the platform. Read imports as INPUT, not spec; de-conflict names BEFORE the
   file reaches the Specs folder, or every downstream brief inherits the ambiguity.
★ 8. (2026-08-04) A RULE STATED AS TIMING IS USUALLY A PROXY FOR A RULE ABOUT STRUCTURE.
   “No money in Phase 1” really meant “never take custody of fans’ money”. Once restated as
   custody, subscriptions became available immediately and escrow stayed correctly excluded.
   When a rule blocks something that feels right, check whether the rule is the proxy or the thing.
★ 9. (2026-08-04) PLATFORM-LEVEL CONFIG IS PER-PROJECT, NOT PER-TENANT. Supabase Site URL,
   email templates and custom SMTP are all one-per-project. Any “one shared project” decision must
   be checked against every per-project setting BEFORE it is called cheap.
```

---

## ⚡ THE PIVOT (unchanged — overrides older sequencing)

The product is a **machine in the artist’s hands to get fans to sign up and organize tiny
concerts**. PHASE 1 = fan machine (gate → Atelier → tiny concerts → tracked links → in-page media).
PHASE 2 = paperwork layer (GUSO/CDDU/intermittence — the upsell). Capture the relationship BEFORE
sending anyone off to listen. If the gate’s email doesn’t arrive or the DB is paused, the machine
does not exist — deliverability + uptime ARE the product.
★ 2026-08-04 addition: and if the machine has no LADDER, the gate produces a dead email database.
The engagement program is not decoration on the fan machine; it is the reason the artist pays.

---

## 🚀 PER-ARTIST ONBOARDING — required infra steps (STANDING CHECKLIST)

```
1. Domain DNS → Vercel (apex A + www CNAME).
2. Supabase: redirect allow-list, Site URL, magic link on, Confirm email on.
   ⚠️ REVISED by the shared-project decision — items 2/3/5 collapse into the Send Email Hook
   once artist #2 exists. Until then this checklist is single-tenant reality.
3. Custom SMTP from the artist’s own mailbox.
4. SPF + DKIM at the registrar/mail host; DMARC p=none after 48h stable.
5. EMAIL TEMPLATES: BOTH “Confirm signup” (type=email) AND “Magic Link” (type=magiclink) →
   <artist-domain>/auth/confirm?token_hash={{ .TokenHash }}&type=… Never {{ .ConfirmationURL }}.
   After saving, confirm & wasn’t escaped to &amp;. CTA copy = “Accéder à l’Atelier”.
6. KEEPALIVE: run docs/briefs/keepalive.sql; CRON_SECRET env; vercel.json cron; VERIFY the cron log.
7. Every raw-SQL table → grant to authenticated (secret tables = exception). Plus artist_id + RLS.
8. TELL THE FAN ABOUT SPAM (sent-state microcopy) — non-optional on a fresh domain.
9. Release data: embed IDs from each release’s Bandcamp dialog; palettes hand-picked + AA-measured.
```

---

## 🛑 STANDING DB RULE — GRANTS ON RAW-SQL TABLES

```
Postgres checks TABLE-LEVEL grants BEFORE RLS — missing grant = same 42501 as RLS. Every table the
app writes to → grant select, insert, update to authenticated. EXCEPTION: secret tables (e.g.
event_access) get NO client grant, reachable only via security-definer RPC. ANON has no grant on ANY
app table — anything anon triggers goes through a security-definer RPC that reads nothing (keepalive
pattern). Read error BODIES. Committed .sql ≠ built schema — check information_schema.tables.
★ ADDED 2026-08-04: every new table also carries a TENANT COLUMN and RLS partitions on it.
```

---

## ✅ EARLIER BUILD STATE (still current)

```
THEME TOKENS + LULLABIES PALETTE: semantic tokens in globals.css :root, Tailwind 4 @theme inline,
  ZERO raw hex in components (Bandcamp URL-param exception documented). ACCENT prune #7A3B8C
  (white-on 7.42:1, on-bg 6.23:1). --border-strong #6671A8. @theme naming asymmetry: --text →
  class text-text but --text-muted → class text-muted. Check globals.css, don’t infer.
[data-release] ARCHITECTURE: accent-only overrides; structure tokens constant; gate NEVER wrapped.
  Recolour transition behind prefers-reduced-motion: no-preference.
ATELIER GATE: magic-link login, nickname + multi-city picker (owner_city_density signal — now the
  Tour Builder input), visit_count via touch_fan (now the badge/ladder input), Mailchimp sync,
  spam-check microcopy in sent state. New-fan onboarding renders IN PLACE at /atelier.
AUTH: /auth/confirm = verifyOtp({type, token_hash}) on OUR domain, NO next param (open-redirect).
  /auth/callback kept for old links. BOTH email templates bilingual FR/EN, one link per mail.
EMBEDPLAYER: lazy/consent poster→iframe, keyboard accessible, locked variant, + controlled mode.
  Insider clip (unlisted Ashg6NO8azo) LIVE behind the gate — uncontrolled mode.
EMAIL: hello@qiwichee.com OVH Email Pro pro2.mail.ovh.net; booking@ alias; SPF+DKIM+DMARC(p=none).
EVENT ENGINE SQL: docs/briefs/event_engine.sql committed ⛔ UNRUN — and now DELIBERATELY HELD
  pending the ladder/season pass + multi-tenant columns. Correct state.
```

---

## 🎟️ EVENT ENGINE — REVISED SCOPE (do NOT run the SQL as committed)

```
The committed event_engine.sql predates the ladder, seasons and the shared-project decision.
It now needs, BEFORE it runs (all free now, a migration later):
  - artist_id / owner_id on EVERY table + RLS partitioning        (shared-project decision)
  - seasons table, or at minimum season_id on events              (seasons are structural)
  - target_count on events                                        (collective milestone)
  - min_tier on events                                            (which tier may RSVP)
  - rsvp_opens_at per tier                                        (priority access window)
  - tier on fans                                                  (subscription state gets its own
                                                                   table later; the column belongs now)
UNCHANGED from the original design: one event object, 3 types (stream/cocreate/physical); announce
wide, entry only via the gate; event_access secret join-link table (no client grant,
security-definer get_event_access); seed ONE owners row post-SQL; magic links = transactional (OVH),
blasts = Mailchimp draft; rights_confirmed blocks Announce; money = external chip_in_url only.
```

---

## 🌍 BILINGUAL / 🎬 MEDIA / 🔐 RIGHTS / ⚖️ LEGAL / 👥 ROLES

```
BILINGUAL: Accept-Language first visit → locale route; cookie toggle after; next-intl [locale]
  segments; fixed strings “Atelier”/“Qiwi Chee”/“Résonance”; SEND EMAIL HOOK now in scope for TWO
  reasons (locale AND multi-tenant sender/domain). Functional cookie → no consent banner, but goes
  in the privacy statement. Curved apostrophes apply to every FR string in the message files.
MEDIA POLICY: in-page plays, site captures traffic; lead full-audio on her turf (Bandcamp/YouTube),
  streaming = “aussi sur” links; lazy-load every embed; NO AUTOPLAY / NO auto-cycling / NO
  auto-advance; unlisted YouTube for insider; posters local only; VIDEO never in the repo.
RIGHTS-AT-UPLOAD: every upload carries a rights record; uncleared → private + flag; assists never
  advises. Lyrics + music sheets parked behind rights review. ★ Fan co-creation (fan-designed
  artwork, a ladder feature) lands squarely on this gate — design it as an upload, not a perk.
LEGAL: V1 = cultural CAE entrepreneur-salarié (IP portable BY CONTRACT); V2 = SAS-ESS (BPI ICC lane)
  or SCIC — never found a SCIC early. EAA: microenterprise exemption likely covers today; stops
  being optional at ticketing/e-commerce → entertainment lawyer at V2.
  ★ NEW lawyer question: REFER vs OPERATE (see MONEY). Shapes the V2 choice.
ROLES: OWNER via is_owner()/owners table · COLLABORATOR (no financial/legal) · MEMBER (Atelier,
  own-row RLS) · ANON (no table grants; RPC only).
  ★ STANDING RULE 2026-08-04: COMMUNITY TITLES ≠ AUTHORIZATION ROLES. A fan badged “Designer” or
  “Archiviste” must NEVER inherit COLLABORATOR grants. Different axes, different tables. The only
  legitimate bridge is that a contributing fan’s upload hits the rights-at-upload gate.
```

---

## ⛔ FORBIDDEN “IMPROVEMENTS” (standing)

```
- AUTOPLAY in any form: auto-advance on ended, radio mode, carousel auto-slide.
- INFINITE LOOP / CLONED SLIDES in the carousel (duplicate DOM = SEO poison + hydration trap).
- Engagement popups triggered by listening behaviour (“join after 3 songs”) — requires listen
  tracking (analytics deferred behind the consent decision) and cheapens the gate.
- Fetching Bandcamp audio into our own <audio> / custom chrome around their content (rights/ToS).
- Server-side device sniffing. The architecture is client-side capability negotiation.
★ - RÉSONANCE TAKING CUSTODY OF FANS’ MONEY (escrow, pooled wallets, pay-outs from our balance).
★ - “Netflix for artists / the platform takes a percentage” as EXTERNAL vocabulary. Internally fine.
    To the RIF / ESS world it is exactly the extractive-startup framing they screen for. Keep the
    vision, keep TWO vocabularies: outil coopératif, mutualisation.
★ - Behavioural fan SCORING built on tracking before the analytics/consent decision. visit_count via
    touch_fan is a first-party counter and defensible; a behavioural scoring engine is a much harder
    privacy-statement argument. Badges may use visit_count today; nothing more.
```

---

## 🗄️ SUPABASE — PROJECT FACTS

```
ref cieefpigrwlhklkkqmdb · eu-west-1 · FREE tier (pauses after 7 idle days — mitigated by the
VERIFIED daily keepalive cron; Supabase Pro when real RSVPs depend on the gate).
AUTH: magic link + Confirm email ON (⇒ two templates) · Site URL https://qiwichee.com ·
redirect allow-list (+www, +.fr, +localhost:3000). SMTP: OVH hello@, 30/hr.
TABLES: fans (RLS own-row, granted to authenticated, NOT anon — ⚠️ needs artist_id migration).
FUNCTIONS: touch_fan · keepalive (security definer, anon execute, touches nothing).
UNRUN: owners · events · event_access · rsvps (+ seasons, to be added).
```

---

## INFRASTRUCTURE FACTS (verified, don’t re-derive)

```
DNS — Vercel: apex A 216.198.79.1; www CNAME 42d7eef65754d8a8.vercel-dns-017.com; .fr → redirect.
  qiwichee.com 308→www (matters for anything carrying an Authorization header — but NOT the cron,
  which is invoked against the deployment directly: verified).
VERCEL Hobby: cron 1/day max, UTC; runtime logs 1 HOUR; Observability → Cron Jobs keeps invocation
  history + status + external API calls. ENV VARS ARE INERT UNTIL A DEPLOY
  (git commit --allow-empty after rotating a secret).
ENV: NEXT_PUBLIC_SUPABASE_URL/ANON_KEY · NEXT_PUBLIC_SANITY_* · NEXT_PUBLIC_MAILCHIMP_AUDIENCE_ID ·
  MAILCHIMP_API_KEY · CRON_SECRET (server-only).
SERVICES: github.com/bkark/qiwichee → Vercel auto-deploy from main · Sanity bayrhx8r · OVH.
Preview *.vercel.app not on Supabase allow-list → gated flows test on localhost or prod only.
```

---

## DEVELOPER ENVIRONMENT

```
Linux Mint · user simba · host ssd · Apple keyboard. Repo /home/simba/Projects/qiwichee.
★ ASSETS/SPECS: /media/Main_HDD/GDrive/Resonance/ (~/GDrive is DEAD).
Sync: ~/sync_resonance.sh → Main_HDD script. cp updated context to
  /media/Main_HDD/GDrive/Resonance/02_Produit_Tech/Specs/ FIRST, then run (script copies Specs →
  repo, then commits + pushes; then manually re-upload CONTEXT_FOR_AI to the four Claude Projects:
  Resonance Dev / Strategy / Research / Qiwichee).
Node v22 · Next.js 16.2.4 (⚠️ middleware→proxy deprecation pending — the next-intl session) · TS ·
Tailwind 4 @theme · @supabase/ssr.
Briefs: docs/briefs/ (release_switcher.md · carousel_fixes.md · event_engine.sql · keepalive.sql ·
  tiny_concert_engine.md) · docs/templates/supabase_emails.md.

WORKFLOW QUIRKS (all still true):
  - Long files: download-then-cp, never paste heredocs. `git --no-pager diff`.
  - NEW FILES don’t show in `git diff` — use `git status`. Grep from src, not src/app.
  - `sed -i` with `|` delimiter for slash-heavy text; escape `*` as `\*`; apostrophes inside single
    quotes: '\''  ★ (largely avoided now that display text uses ’ instead of ').
  - `>>` appends, `>` destroys. Never paste <placeholder> angle brackets.
  - Claude Code briefs: scoped, NO auto-commit, `git status` + FULL files at end, review the ENTIRE
    diff incl. shared components, hex grep, ★ apostrophe grep, AA re-verify. Bassim commits manually.
    ★ Claude Code’s SUMMARY is not the diff — verify its claims against the filesystem.
  - DevTools console: read-only measurement lines are fine; Chrome asks to type “allow pasting” once.
  - DEBUG: read error BODIES; temporarily surface, diagnose, revert.
GOTCHA: Next.js 16 rejects og:type “music.musician” → use “website”; MusicGroup JSON-LD carries it.
```

---

## INSTRUCTIONS FOR THIS AI

```
- Explain every command + WHY (telecom analogies help). One step, wait for confirmation.
- BUILD SEQUENCE: …carousel shipped ✅ → (NEXT) NAMING/COPY PASS (Atelier + “Accéder à l’Atelier” +
  curved apostrophes, site AND both email templates) → carousel v2 design pass → LADDER & SEASONS
  design pass → revised event-engine SQL (multi-tenant + seasons + thresholds) → bilingual next-intl
  + Send Email Hook. THEN Phase 2 GUSO/CDDU.
- ★ NAMING: the product is “Atelier”, not “L’Atelier”. Standalone = “Atelier”; in a French sentence
  the article is grammatical and the A stays capital = “l’Atelier”. CTA = “Accéder à l’Atelier”.
- ★ “Atelier” = the fan-area product. “Résonance” = the platform that sells it. NEVER use Atelier
  for the platform.
- ★ TYPOGRAPHY: curved apostrophe ’ (U+2019) in ALL French display text; straight ' or none in
  slugs, filenames, URLs, DB values, identifiers. Grep before every copy commit.
- ★ FAN-FACING LABELS MUST BE EPICENE — identical in both genders by construction. No “Habitué·e”
  mid-dot forms (they read badly to screen readers). “Fidèle à l’écoute” ✅ · “Passeur” ✅ ·
  “Archiviste” ✅ · “Créateur” ❌ · “Ambassadeur” ❌. Test every new label.
- ★ RÉSONANCE NEVER HOLDS OR REDISTRIBUTES FANS’ MONEY. Stripe Connect DIRECT CHARGES to the
  artist’s own account + application_fee. No escrow, no pooled wallets, no pay-outs from our balance.
- ★ COMMUNITY TITLES ≠ AUTHORIZATION ROLES. A badge never grants a permission.
- ★ ONE SHARED SUPABASE PROJECT, ARTISTS AS ROWS. Every table carries a tenant column from line one.
- Verify-don’t-assume: filesystem/git/DB over notes; the backup script over memory; re-derive
  disputed numbers from the formula. A Claude Code summary is a claim, not evidence.
- Every raw-SQL table → grant to authenticated; anon via security-definer RPC only.
- Theme via tokens; Bandcamp URL params are the sole hex exception (must carry the comment).
- Every page: SEO + WCAG AA + JSON-LD. NO autoplay/auto-advance/infinite-loop/engagement popups.
  Horizontal swipe = siblings within a section only; the gate never behind a swipe.
- user_id/owner from auth session, never request body. Zod everywhere. No `next` URL params.
- Claude Code: scoped briefs, no auto-commit, full-diff review, shared-component changes flagged.
- Never suggest Telegram (WhatsApp links). Flag geographic/institutional risks neutrally.
- Remind: entertainment lawyer before /legal (now also: REFER vs OPERATE); CRESS IDF + Les Scop IDF
  before the first euro — and to ask them the artist-status question that gates tier 3.
- Imported strategy documents are INPUT, not spec. De-conflict vocabulary before filing them.
- End of session: ask if instructions need updating; offer updated CONTEXT_FOR_AI; remind the sync
  (cp to Main_HDD Specs FIRST, then ~/sync_resonance.sh).
```

---

## OPEN DECISIONS / NEXT ACTIONS

```
[x] ★ CRON VERIFIED — keepalive end-to-end proven. CLOSED.
[x] ★ STORAGE CONSOLIDATED — one tree on Main_HDD, backed up; launcher + SPECS repointed.
[x] ★ RELEASE-SWITCHER SHIPPED (caf0938 + 7eed377 + 9178230). Verified on real device.
[x] ★★ SUPABASE ARCHITECTURE DECIDED — ONE SHARED PROJECT, artists as rows. (2026-08-04)
[x] ★ NAME DECIDED — “Atelier”, CTA “Accéder à l’Atelier”, curved apostrophes. (2026-08-04)
[x] ★ MONEY RULE RE-FRAMED — custody, not timing. Stripe direct charges in; escrow out. (2026-08-04)
[x] ★ Test {{ .SiteURL }} in email templates — MOOT, closed by the shared-project decision.
    (Superseded by the Send Email Hook.)

[ ] ★★ NAMING/COPY PASS (do FIRST — mechanical, and everything downstream inherits the strings):
    Atelier rename · “Accéder à l’Atelier” · curved apostrophes · site copy + BOTH live Supabase
    templates + docs/templates/supabase_emails.md. Run the apostrophe grep as the acceptance check.
[ ] ★★ CAROUSEL V2 DESIGN PASS: song-per-slide + credits as {role,name}[] + Bandcamp two-click/stop.
[ ] ★★ LADDER & SEASONS DESIGN PASS — BLOCKS the event engine. Tier names, badge set (epicene),
    season object, ritual rhythm, and the OPEN FORK: one fan across several artists’ Ateliers?
[ ] ★★ `fans` MULTI-TENANT MIGRATION: add artist_id → backfill to Qiwi Chee → NOT NULL → RLS.
    Cheap now, ugly at 200 fans. Before the event engine.
[ ] ★★ REVISE event_engine.sql (tenant column, seasons, target_count, min_tier, rsvp_opens_at,
    fans.tier) THEN run it + seed the owners row.
[ ] ★★ SEND EMAIL HOOK — now what unblocks artist #2 (per-artist SMTP + per-artist link domain +
    locale). Scope it in the bilingual session but know it is no longer optional.
[ ] ★ TOUR BUILDER — roadmap item. Promote the city-picker microcopy fix; decide free-text vs
    normalised city (Géoplateforme geocoding if a map is real).
[ ] ★ ASK QIWI CHEE: her legal status for receiving subscription income. Gates tier 3.
[ ] ★ PENDING QIWI CHEE (piecemeal): Lullabies square cover · Hybrid Fruit hi-res · 3 accent
    approvals · Dilemma descriptor wording.
[ ] ★ LAWYER + CRESS IDF / Les Scop IDF: REFER vs OPERATE on intermittence/employment.
    Also the licence d’entrepreneur de spectacles question. Shapes the V2 structure.
[ ] ★ MONETIZATION A/B/C/D — leaning B; D (take-rate on fan revenue) added, deliberately unresolved.
[ ] ★ Fix remaining Supabase templates (Invite/Change email/Reset password) — still leak
    supabase.co when they fire. Known, parked.
[ ] ★ Dead-man’s-switch monitor (Healthchecks.io/UptimeRobot) on the keepalive. Optional, parked.
[ ] ★ A11Y DEBT (own pass): keyboard tab-order drags through all off-screen slides’ links (~28
    stops) — roving tabindex or inert on non-active slides.
[ ] ★ Analytics layer 1 brief (log_event RPC, keepalive pattern). Clarity DEFERRED (consent banner).
[ ] Promote insiderClip const → insider_media table when a 2nd clip arrives.
[ ] Gate a11y: input aria-describedby + error-state colour.
[ ] Watch visit_count double-fire (mail scanner pre-fetch). Interstitial-button fix ONLY if it bites.
[ ] Genre “Hybrid pop” → “Alternative Pop” — PARKED. Lyrics/sheets — PARKED (rights).
[ ] Document Qiwi Chee’s journey publicly (build-in-public).
[ ] ★ Verify the quarantine folder /home/simba/_TO_DELETE_after_2026-07-16 was actually deleted.
```

---
*Updated 2026-08-04 · A strategy session, not a build session — but the rules changed underneath
everything. The product now has a shape: three tiers, seasons, a collective milestone, and money
that never touches us. The name lost its article and the apostrophes got their curve. The event
engine stayed unrun, which turned out to be luck worth keeping.*
