# RÉSONANCE — PROJECT STATE DOCUMENT
## Date: 2026-05-07
## Purpose: Resume work in a new Claude chat or Project

---

## IMMEDIATE ACTION — SET UP CLAUDE PROJECT

Before anything else, do this once:
```
1. Click "Projects" in Claude left sidebar
2. Create: "Résonance Dev"
3. Upload:
   ├── CONTEXT_FOR_AI_qiwichee_web.md
   ├── DECISIONS.md
   └── PROJECT_STATE.md (this file)
4. Add custom instructions (copy from context file)
5. Every future chat starts INSIDE this project
   Full context loads automatically
   No pasting needed ever again
```
This solves the "one question per session" problem.
Requires Claude Pro ($20/month).

---

## WHAT EXISTS RIGHT NOW

### Code — What Is Actually Built
```
LIVE: https://qiwichee.vercel.app
      Shows DEFAULT Next.js welcome page only
      NO real content yet

GitHub: https://github.com/bkark/qiwichee
Local:  /home/simba/qiwichee

Files in repo:
├── CONTEXT_FOR_AI_qiwichee_web.md ✅
├── DECISIONS.md ✅
├── README.md ✅
├── src/app/page.tsx ⚠️ DEFAULT PAGE (not replaced yet)
├── src/app/layout.tsx ✅
├── src/app/globals.css ✅
└── public/ (empty)

ZERO custom features built yet.
Everything is documentation + infrastructure only.
```

### Services Configured
```
GitHub:    bkark/qiwichee ✅ connected
Vercel:    ✅ live, auto-deploys from GitHub
Mailchimp: ✅ Audience "Qiwichee Fans" ID: c5532d5f66
           Double opt-in + GDPR enabled
           API key generated (in Vercel env vars)
Sanity:    ✅ Project ID: bayrhx8r, dataset: production
OVH:       ✅ qiwichee.com + qiwichee.fr PURCHASED
           Order confirmed, awaiting provisioning
           Zimbra email included (€0.30/month each)

Vercel env vars set:
NEXT_PUBLIC_SANITY_PROJECT_ID     = bayrhx8r
NEXT_PUBLIC_SANITY_DATASET        = production
NEXT_PUBLIC_MAILCHIMP_AUDIENCE_ID = c5532d5f66
MAILCHIMP_API_KEY                 = [private]

NOT YET CREATED:
Supabase, Better Uptime, MS Clarity, Stripe, YouSign
```

---

## THE VERY NEXT STEPS (In Order)

### Step 1 — Configure DNS At OVH (15 min)
```
ovh.com → login → Domains → qiwichee.com → DNS Zone

Add for qiwichee.com:
Type: A     Name: @   Target: 76.76.21.21    TTL: 3600
Type: CNAME Name: www Target: cname.vercel-dns.com TTL: 3600

Repeat exactly for qiwichee.fr

Then in Vercel → qiwichee project → Settings → Domains:
Add: qiwichee.com
Add: www.qiwichee.com
Add: qiwichee.fr
Add: www.qiwichee.fr

Wait 10-60 min → SSL auto-generated → domains live
```

### Step 2 — Set Up Email (10 min)
```
OVH Panel → Zimbra → Create mailbox
→ booking@qiwichee.com + password
→ Forward to Qiwi Chee's Gmail
→ Optional: Gmail "Send as" booking@qiwichee.com
```

### Step 3 — Google Search Console (10 min)
```
search.google.com/search-console
→ Add qiwichee.com → verify via OVH DNS TXT record
→ Submit sitemap.xml when site has real content
```

### Step 4 — Create Supabase Project (15 min)
```
supabase.com → New project
Name: resonance (or qiwichee)
Region: West EU (Paris)
Password: generate strong, save it

Add to Vercel env vars:
NEXT_PUBLIC_SUPABASE_URL = [from dashboard]
NEXT_PUBLIC_SUPABASE_ANON_KEY = [from dashboard]
SUPABASE_SERVICE_ROLE_KEY = [private, server only]
```

### Step 5 — Run Supabase Schema (20 min)
```
Full schema in CONTEXT_FOR_AI file.
Run in Supabase SQL editor.
Tables include: profiles, artist_members, artists,
concerts, feuille_de_route_items, guso_declarations,
cddu_contracts, guest_list, venues, professionals,
events, service_status, concert_scenarios,
venue_inquiries, concert_reviews, co_events,
co_event_artists, content_pieces, content_clips,
social_accounts, project_journal
Then add RLS policies (in context file).
```

### Step 6 — Install next-i18n + Landing Page (2h)
```bash
npm install next-intl
# Create src/locales/fr.json + en.json
# Replace src/app/page.tsx with real landing:
# - Qiwi Chee name + photo
# - Bio FR/EN toggle
# - All platform links (Spotify, YouTube etc.)
# - Fan email signup → Mailchimp
# - Upcoming concert if any
git add . && git commit -m "Sprint 1 complete" && git push
```

---

## PLATFORM VISION SUMMARY

```
RÉSONANCE = cooperative cultural infrastructure
            for ALL independent performing artists in France
            (musicians, comedians, circus, mime, poets...)

SIX MODULES:
/onboarding  — AI wizard, legacy URL scraper
/website     — bilingual, CMS, Atelier fan area
/content     — social media engine, repurpose content
/concerts    — events, feuille de route (LIVE checklist)
/legal       — GUSO, CDDU, intermittent (KILLER FEATURE)
/admin       — your NOC dashboard

KEY FEATURES (MVP):
├── Interactive Feuille de Route (live checklist)
├── What-if concert budget simulator
├── GUSO + CDDU automation
├── Intermittent 507h tracker
├── Fan email signup (Mailchimp)
├── Bilingual FR/EN
└── AI data importer (scrape legacy URLs)

KEY FEATURES (Phase 2+):
├── Cover artist marketplace + brief form
├── Project journal / communications
├── Co-events (multi-artist concerts)
├── Content studio (upload once → posts everywhere)
├── Crowdfunding 2A (external links, no money handling)
├── Professional marketplace (all performing arts)
├── Fanbase graph (cross-artist intelligence)
└── Crowdfunding 2B (Stripe Connect, full)

CORPORATE:
├── SASU (France) owns all IP
└── Local cooperatives per country (license)
    France → Belgium/Switzerland → Quebec → MENA
```

---

## SPRINT ROADMAP

```
SPRINT 1 (NOW):
├── DNS config (OVH → Vercel)
├── Email setup (Zimbra → Gmail forward)
├── Google Search Console
├── Supabase setup + schema + RLS
├── next-i18n bilingual setup
└── Real landing page at qiwichee.com

SPRINT 2:
├── AI Data Importer (scrape → Sanity)
├── Bilingual Claude API translation
└── Onboarding wizard UI

SPRINT 3:
├── /concerts module
├── Live feuille de route checklist
├── GUSO + CDDU generation
└── WhatsApp notification links

SPRINT 4:
├── /legal module (⚠️ lawyer FIRST)
├── Intermittent 507h tracker
├── Admin dashboard (/admin)
└── Transfer ownership to Qiwi Chee

SPRINT 5:
├── Qiwi Chee self-onboards (observed)
├── MS Clarity monitoring
└── Fix friction weekly

SPRINT 6+:
├── /content module
├── Co-events
├── Cover artist marketplace
├── Project journal/communications
└── Beta with more artists
```

---

## ARCHITECTURE QUICK REFERENCE

```
Framework:     Next.js 16 (TypeScript + Tailwind)
Database:      Supabase (PostgreSQL + Auth + RLS)
CMS:           Sanity (bayrhx8r)
Hosting:       Vercel (auto-deploy)
AI:            Claude API with tool use
               Service layer: aiService.ts
Bilingual:     next-intl (fr.json + en.json)
Email:         Mailchimp → emailService.ts abstraction
               (swap to Brevo/Listmonk later)
Payments:      Stripe → paymentService.ts
Notifications: WhatsApp pre-filled links (free)
Monitoring:    MS Clarity + Better Uptime
Mobile:        PWA manifest
E-sign:        YouSign (CDDU)
Video:         Cloudflare Stream (content studio)

SERVICE LAYER PATTERN (portability):
emailService.ts → Mailchimp today, Brevo tomorrow
cmsService.ts → Sanity today, Payload tomorrow
aiService.ts → Claude today, Mistral tomorrow
All secrets in env vars, never in code
Data always in Supabase first
```

---

## CRITICAL REMINDERS

```
⚠️ Consult entertainment lawyer BEFORE /legal module
⚠️ Never commit secrets to GitHub
⚠️ artist_id ALWAYS from Supabase auth, never request body
⚠️ Qiwi Chee = first client AND first beta tester
⚠️ OVH Zimbra: check billing after ~30 days
⚠️ Sanity: 30-day trial, downgrades to free (no card)
⚠️ Use service layer abstraction on every external API
⚠️ Entertainers: musicians → SACEM, others → SACD
```

---

## GIT WORKFLOW

```bash
cd ~/qiwichee
git add .
git commit -m "What and why"
git push
# Auto-deploys to qiwichee.vercel.app in ~30 seconds
```

---

## UPDATE FILES EVERY SESSION

```bash
cp ~/Downloads/CONTEXT_FOR_AI_qiwichee_web.md \
   ~/qiwichee/CONTEXT_FOR_AI_qiwichee_web.md
cp ~/Downloads/PROJECT_STATE.md \
   ~/qiwichee/PROJECT_STATE.md
git add . && git commit -m "Update context - session [date]" && git push
```

---
*Generated: 2026-05-07*
*Next action: Set up Claude Project → Configure OVH DNS*
