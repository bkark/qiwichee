# Résonance — AI Context File
> Paste/upload this at the start of any new conversation to resume instantly.

**Last updated:** 2026-06-20 — Homepage build session
**Status:** qiwichee.com LIVE on Vercel (4 domains, SSL) ✅ · Homepage built ✅
**Next session goal:** Bilingual FR/EN refactor (next-intl + [locale] route)

---

## ⚡ CURRENT BUILD STATE (2026-06-20)

```
DONE THIS SESSION:
├── Claude Code installed (v2.1.183) + authenticated (Claude Pro)
├── CLAUDE.md startup-config committed at repo root
├── XDG folder map repaired + Chrome download dir fixed (~/Downloads)
├── Homepage built: src/app/page.tsx + layout.tsx
│   ├── Semantic structure (header/main/footer, h1/h2, aria labels)
│   ├── Server-rendered (no "use client") — crawlers/AI see full HTML
│   ├── Metadata export (title template, description, OG)
│   └── MusicGroup JSON-LD with 5 verified sameAs URLs
└── Committed (7315470) + pushed + auto-deployed to Vercel

NEXT, IN ORDER:
├── 1. Bilingual FR/EN refactor (next-intl, wrap in [locale] segment)
├── 2. Real bio text + images (replace placeholders, alt text)
├── 3. Accessibility statement page + robots.txt (allow AI crawlers)
├── 4. → Homepage template DONE
└── 5. → GUSO social-charge calculator (first free wedge tool)
```

### ⚠️ TEMPLATE GOTCHA — Next.js 16 OpenGraph
```
Next.js 16 REJECTS og:type "music.musician" at RUNTIME (validates
against its own hardcoded list). A TypeScript cast does NOT bypass it.
→ Use og:type "website" (or "profile").
→ The MusicGroup JSON-LD carries the musician signal instead — that's
  the real discoverability workhorse anyway. OG type is just preview cards.
LESSON: `as X` silences compile-time types only; runtime validators
        need the value itself to be valid.
```

---

## 🎵 VERIFIED ARTIST PROFILES — Qiwi Chee (sameAs)

```
Confirmed to her (cross-checked: Hybrid Fruit EP, 🇩🇿🇫🇷🇺🇲 bio, Leï Lani rebrand):
├── Spotify:   https://open.spotify.com/artist/4Bu89sfVzy14qW0dK8Ugbs
├── Instagram: https://www.instagram.com/qiwichee/
├── Bandcamp:  https://qiwichee.bandcamp.com/
├── YouTube:   https://www.youtube.com/@qiwichee  (ID UCR8h9_VrE-mTa-wekiB6luA)
└── Links hub: https://msha.ke/qiwichee/

NOT used (kept sameAs clean — one authoritative YouTube entry):
├── youtube.com/c/LEILANIMUSIC  (old vanity URL, superseded by @qiwichee)
└── YouTube "- Topic" channel UCAGC-ebmLl1lCQEcSAVb-5g (auto-generated audio)

TODO: Deezer + Apple Music URLs exist on her msha.ke hub — add when canonical
      URLs confirmed. Once qiwichee.com is the hub, point sameAs there.
Bio (verbatim, her own): "Auteur/Compositeur-Interprète Franco-algériano-
americaine · Hybrid pop · Paris." Identity: any pronouns fine.
```

---

## VISION STATEMENT

```
RÉSONANCE is not just a tool.
It is a cooperative cultural infrastructure
connecting artists, fans, venues, collaborators,
professionals and institutions.

Grows through: shared fanbase graph · shared venue network ·
shared professional marketplace · shared data + AI automation ·
collective intelligence over time. This is the North Star.
```

---

## NAMING CONVENTION

```
RÉSONANCE = the platform (the SaaS product)
QIWICHEE  = one artist's instance of Résonance (reference template)

GitHub repos:
├── bkark/qiwichee — current (proof of concept + template)
└── bkark/resonance-platform — future (the product, after beta)
```

---

## STANDING BUILD REQUIREMENTS — apply to EVERY page

```
THREE-IN-ONE FOUNDATION (one layer, not three jobs):
├── SEO — server-rendered semantic HTML + metadata + sitemap + hreflang
├── WCAG 2.1 AA accessibility — alt text, keyboard nav, color contrast,
│   visible focus, accessibility statement page
└── AI-agent discoverability — complete server-rendered schema.org JSON-LD
    (MusicGroup, MusicEvent); robots.txt ALLOW AI crawlers (ClaudeBot, GPTBot)

Build in from the start — costly to retrofit. Next.js SSR gives the
server-rendered base for free; JSON-LD + a11y attrs are the deliberate adds.
```

---

## MVP POSITIONING

```
"The first platform that automates GUSO, CDDU and intermittent du
 spectacle for independent French artists — while giving them a
 professional bilingual website and simple concert management."

Beta hook: GUSO + CDDU + intermittent + website + concerts + feuille de route.
Crowdfunding is a bonus — NOT the hook.
```

---

## THREE USER ROLES (RBAC via Supabase RLS)

```
OWNER (Artist) — full: legal, finance, team, content, GUSO/CDDU, fan list
COLLABORATOR (Staff/Band/Pro) — feuille de route, own CDDU/payments;
                                NOT GUSO or financial data
MEMBER (Fan — "ATELIER") — own guest-list status only + Atelier content;
                           NO legal/financial data
```

---

## MVP = FOUR MODULES + ONBOARDING

```
/onboarding (build first) — AI wizard, legacy URL scraper, FR↔EN translate,
                            auto-populate Sanity, <15 min to live
/website   — bilingual FR/EN, music player, fan signup (Mailchimp),
             Sanity CMS, Atelier gated area, PWA
/concerts  — create concert (paid OR free), public page + QR signup,
             ticket link, feuille de route (LIVE CHECKLIST not PDF),
             stage plot, rider, GUSO (paid AND free), CDDU + YouSign,
             guest list (RLS)
/legal (KILLER FEATURE — build LAST, lawyer FIRST) — GUSO/CDDU/intermittent
             507h tracker, compliance dashboard
```

---

## CONCERT PLANNER & WHAT-IF ENGINE (summary)

```
Problem (confirmed by Qiwi Chee): "how much will this concert cost?
which venue fits budget/audience? what if €15 vs €20? lose money at 40 people?"

What-if simulator: ticket price / attendance / band fees / promo sliders →
revenue, costs, profit/loss, break-even update live. AI suggests when in deficit.

AI Concert Planner agent: plain-language goal → Safe / Balanced / Ambitious
scenarios with break-even + reasoning.

Venue contact workflow: pre-filled inquiry email → track sent/response/quote →
data saved to venue profile → future artists benefit.

Post-concert learning loop: actual vs projected attendance/revenue, venue
rating, would-return → platform learns estimation accuracy + venue fit.

Tables: concert_scenarios, venue_inquiries, concert_reviews,
        venues (+ rental_cost, pa_included, capacity, typical_genres, rating).
```

---

## CO-EVENTS (multi-artist concerts) — summary

```
Multiple artists, one venue/event/feuille de route, SEPARATE legal docs.
Running order by fanbase size (smaller opens). Combined crowdfunding.
Viral growth: invite artist not on platform → they join free.
Tables: co_events, co_event_artists, co_event_costs, co_event_cost_shares.
```

---

## CONTENT STUDIO (social engine) — summary

```
"Upload once → posts everywhere." Raw video → AI finds best moments →
all formats (Reel/Story/Post/TikTok/Shorts) → bilingual captions →
optimal times → approve → auto-post.
Agents: content-analyzer (timestamped best moments), content-writer (captions).
Privacy flags: band-member consent, background-music rights, venue restrictions.
Stack: Cloudflare Stream + Claude vision + Whisper. ~€0.50-2/artist/month.
Tables: content_pieces, content_clips, social_accounts.
```

---

## ENTERTAINERS BEYOND MUSICIANS

```
Discipline picked at onboarding → platform adapts:
├── Musicians → SACEM
├── Comedians/Theatre/Circus → SACD
└── Rider templates + content suggestions per discipline
GUSO/CDDU/intermittent = same for ALL performing artists. Killer feature for all.
```

---

## COVER ARTISTS & VISUAL CREATORS — summary

```
Auto-generated Artwork Brief from recording project (mood, palette, refs,
formats, budget, deadline) → marketplace → cover artists apply → Stripe
on approval, 10-15% commission. Cover artist = COLLABORATOR (artwork tasks only).
```

---

## PROJECT JOURNAL (communications) — summary

```
Every project = unified journal. Entry types: email/whatsapp/note/document/
call/auto/milestone. booking@qiwichee.com auto-links incoming to projects;
outgoing sent + stored. Unified inbox (urgent/unread/pending) by project.
Table: project_journal (full audit trail).
```

---

## OPEN SOURCE MIGRATION ARCHITECTURE

```
RULE 1 — Abstract every external service (emailService/cmsService/aiService)
RULE 2 — Data always in Supabase first (sync out to providers)
RULE 3 — Env vars for all endpoints
RULE 4 — Normalize external data to own schema

OSS targets (prefer French/EU): Mailchimp→Brevo · Claude→Mistral ·
Sanity→Payload · Vercel→Coolify · Supabase already OSS.
Migrate when: cost >€200/mo, pricing change, outage >4h, GDPR issue.
```

---

## CROWDFUNDING (phased)

```
Phase 2A (early, safe): support button + progress bar + EXTERNAL links
  (PayPal.me, Lydia, Ko-fi, Tipeee, Stripe Payment Link). Platform handles
  NO money. Zero legal risk. Build after MVP stable.
Phase 2B (later): Stripe Connect, KYC, escrow, refunds, payouts, 5-10%
  commission. High complexity, significant legal risk (lawyer + accountant).
```

---

## SUPABASE SCHEMA (key tables)

```sql
profiles · artist_members(role: owner|collaborator|member) · artists ·
concerts(+ hidden Phase-2 crowdfunding fields) · feuille_de_route_items ·
guso_declarations · cddu_contracts · guest_list · venues · professionals
(is_visible default false) · events · service_status · feedback ·
concert_scenarios · venue_inquiries · concert_reviews · co_events(+children) ·
content_pieces · content_clips · social_accounts · project_journal

Security: artist_id ALWAYS from auth session, NEVER request body.
RLS enforces the three roles.
```

---

## PRICING MODEL

```
CONCERTS ONLY €9/mo (wedge — concerts.artistname.com subdomain)
FREE (2 concerts/mo, basic site, fan signup)
STARTER €15/mo (unlimited concerts, full bilingual site, GUSO+CDDU, basic 507h)
PRO €29-49/mo (+ live feuille de route, full 507h, rehearsals, Phase 2A, WhatsApp)
PREMIUM €79+/mo (+ analytics, priority, marketplace)
Add-ons: extra CDDU/GUSO/concerts. Phase 2+: marketplace + crowdfunding commission.
```

---

## SEO STRATEGY (summary)

```
Two targets: resonance.fr (artists/venues/pros) vs qiwichee.com (fans).

Qiwichee technical: title template "%s | Qiwi Chee", OG website (NOT music.musician
  — see gotcha), canonical, hreflang FR/EN, schema.org MusicGroup + MusicEvent
  per concert, Next.js Image everywhere, Core Web Vitals (LCP<2.5 CLS<0.1).

After DNS (DONE): Google Search Console (verify via OVH TXT, submit sitemap) +
Google My Business (Musician/Band category).

Résonance content flywheel: free guides ("Comment remplir un GUSO 2026",
"intermittent du spectacle", "CDDU rédiger", "organiser un concert",
"feuille de route") → rank → artists find → sign up → concert pages indexed →
domain authority ↑ → guides rank higher ↺. Cost €0. Primary acquisition channel.
```

---

## AGENT ENGINEERING (summary)

```
Claude API + tool use = orchestration brain. Next.js + Supabase = frontend+data.
Routes: /api/agent/onboarding, /concert, /legal (MVP); /marketplace, /fanbase
(P2A); /crowdfunding (P2B); /content-analyzer, /content-writer, /co-event.

Principles:
├── Zod strict input/output schemas on EVERY route
├── artist_id from auth session, validate ownership before writes
├── Retry + exponential backoff + 10s timeout + circuit breaker on external APIs
├── RED metrics (rate/error/duration) → events table
├── Stateless per task — state in Supabase, cache results to control cost
└── Use Sonnet for most tasks. "Claude API with tool use", not "Managed Agents".
```

---

## BILLING PROVIDERS (summary)

```
Non-incorporated artist can't invoice. Platform detects (no legal structure +
paid concert + GUSO/CDDU needed) → suggests validated Billing Provider
(CAE / SCIC / association) to invoice on artist's behalf. Résonance =
apporteur d'affaire (% commission). Provider appears as resource in feuille
de route with admin responsibility.
```

---

## LEGAL & CORPORATE (summary)

```
SASU (yours, France) owns ALL IP → licenses platform to local cooperatives.
Local: France SCIC · Belgium ASBL · Quebec coop de solidarité · MENA partners.
Cooperatives unlock local funding (CNM, SODEC...). Expansion: France → BE/CH →
Quebec → MENA francophone.

⚠️ See Resonance_context.md for the V1→V2 structure decision (CAE entrepreneur-
   salarié first, then SAS-ESS in BPI ICC lane or SCIC). Do NOT found a SCIC now.
   Do NOT build IP inside an association to privatize later (asset trap).
```

---

## ⚠️ LEGAL FLAG — European Accessibility Act (neutral / lawyer territory)

```
EAA enforceable since 28 June 2025. France: Law 2023-171 / Ord. 2023-859 /
Decree 2023-931. Standard EN 301 549 (= WCAG 2.1 AA). Enforcement: DGCCRF.
Microenterprise exemption (<10 employees AND <€2M turnover) likely covers
you + Qiwi Chee NOW. Stops being optional once site has ticketing/e-commerce
or Résonance is consumer-facing above threshold. Confirm with ESS/entertainment
lawyer when choosing V2 structure. Not a decision to make from notes.
```

---

## ETHICAL RISK LAYER (standing rule)

```
Flag features touching: disputed territories, state cultural-diplomacy
institutions, partners with human-rights controversies, venues in occupied
zones. Alerts: neutral/technical, non-prescriptive, universal rules — never
political framing. E.g. open-data venue import → "geographic validation
recommended"; institutional partner → "due-diligence recommended".
```

---

## WHAT IS LIVE

```
✅ qiwichee.com + .fr + www (Vercel, SSL valid)
✅ Homepage built + deployed (semantic + metadata + MusicGroup JSON-LD)
✅ OVH Email Pro: hello@qiwichee.com (mailbox), booking@ (alias → hello@)
✅ github.com/bkark/qiwichee · CLAUDE.md committed
✅ Claude Code installed + authenticated (Claude Pro)
✅ Mailchimp ID c5532d5f66 · Sanity ID bayrhx8r · Vercel env vars set
```

---

## INFRASTRUCTURE FACTS (verified, don't re-derive)

```
EMAIL — OVH Email Pro:
├── Server pro2.mail.ovh.net for BOTH IMAP (993 SSL/TLS) + SMTP (587 STARTTLS)
│   NOT ssl0.ovh.net (that's shared MX Plan — common wrong answer in guides)
├── Webmail: https://pro2.mail.ovh.net
└── Gmail app setup: choose "Other (IMAP)", NOT "Google"

DNS — Vercel:
├── Apex A record: 216.198.79.1 (RE-VERIFY in Vercel at any reconfig)
├── www CNAME: 42d7eef65754d8a8.vercel-dns-017.com. (project-specific,
│   NOT generic cname.vercel-dns.com.)
└── .fr strategy: canonical redirect → .com recommended (awaiting confirm)

ENV VARS:
NEXT_PUBLIC_SANITY_PROJECT_ID=bayrhx8r · NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_MAILCHIMP_AUDIENCE_ID=c5532d5f66 · MAILCHIMP_API_KEY=[private]
```

---

## DEVELOPER ENVIRONMENT

```
OS: Linux Mint · user simba · hostname ssd
Repo: /home/simba/Projects/qiwichee
Specs source: /home/simba/GDrive/Resonance/02_Produit_Tech/Specs/
Sync: /home/simba/GDrive/Resonance/sync_resonance.sh
Node v22.22.3 · Next.js 16.2.4 · TypeScript · Tailwind 4

WORKFLOW QUIRKS:
├── Terminal MANGLES fast multi-line pastes (reorders bytes). For long files:
│   download + cp, OR let Claude Code write directly. NEVER paste a big heredoc.
├── Chrome downloads → ~/Downloads (fixed this session; XDG map was broken)
├── Heredoc for short writes only: cat > file << 'ENDOFFILE'
├── sed -i for bulk edits, grep to verify before commit
└── Apple keyboard: View > Terminal in VS Code
```

---

## INSTRUCTIONS FOR THIS AI

```
- Explain every command + WHY (telecom analogies help). One step, wait.
- Keep to MVP scope. Never suggest Telegram (WhatsApp links).
- artist_id ALWAYS from auth session, never body.
- Service-layer abstraction + Zod on every external API / agent route.
- Feuille de route = LIVE CHECKLIST not PDF. Free concerts need GUSO+CDDU.
- Three roles via RLS. Atelier = fan area. Crowdfunding = Phase 2A only.
- Every page: three-in-one foundation (SEO + WCAG 2.1 AA + schema.org JSON-LD).
- Flag geographic/institutional risks neutrally (technical, never political).
- Remind: consult entertainment lawyer BEFORE /legal module.
- Build sequence: finish Qiwichee site (template) → GUSO calculator → platform.
- Platform: RÉSONANCE. Fan area: ATELIER. Corporate: SASU owns IP.
- End of session: ask if instructions need updating; offer updated CONTEXT_FOR_AI;
  remind to run ~/sync_resonance.sh.
```

---
*Updated 2026-06-20 · Next: bilingual FR/EN refactor (next-intl + [locale])*
