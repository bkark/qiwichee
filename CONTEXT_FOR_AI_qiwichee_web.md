# Résonance — AI Context File
> Paste this at the start of any new conversation to resume instantly.

**Last updated:** 2026-05-04 — Business Planning Update
**Status:** qiwichee.vercel.app LIVE ✅
**Next session goal:** Supabase setup + RLS + bilingual foundation

---

## VISION STATEMENT (Updated)

```
RÉSONANCE is not just a tool.
It is a cooperative cultural infrastructure
connecting artists, fans, venues, collaborators,
professionals and institutions.

The platform grows through:
├── Shared fanbase graph
├── Shared venue network
├── Shared professional marketplace
├── Shared data and AI automation
└── Collective intelligence over time

This is the long-term North Star.
```

---

## NAMING CONVENTION

```
RÉSONANCE = the platform (your SaaS product)
QIWICHEE = one artist's instance of Résonance

GitHub repos:
├── bkark/qiwichee — current (proof of concept)
└── bkark/resonance-platform — future (the product)
    After beta validation
```

---

## MVP POSITIONING

```
"The first platform that automates GUSO, CDDU
 and intermittent du spectacle for independent
 French artists — while giving them a professional
 bilingual website and simple concert management."

Beta hook (what artists join for):
├── GUSO automation ✅
├── CDDU automation ✅
├── Intermittent tracking ✅
├── Concert management ✅
├── Bilingual website ✅
├── WhatsApp notifications ✅
└── Feuille de route ✅

Crowdfunding is a bonus — NOT the hook.
```

---

## THREE USER ROLES (RBAC via Supabase RLS)

```
OWNER (Artist)
└── Full access: legal, finance, team, content
    GUSO/CDDU, fan list, all settings

COLLABORATOR (Staff/Band/Professional)
└── Interactive Feuille de Route (live checklist)
    Their own CDDU and payments
    Cannot see GUSO or financial data

MEMBER (Fan — "Atelier" access)
└── Their own guest list status ONLY
    Exclusive Atelier fan content
    Cannot see ANY legal or financial data
```

---

## MVP = THREE MODULES + ONBOARDING

### /onboarding (BUILD FIRST)
```
AI-guided self-setup wizard (Claude API):
├── Step 1: Artist basic info
├── Step 2: AI Data Importer
│   ├── Paste legacy URLs
│   ├── Scrape: bio, discography, photos, videos
│   ├── Bilingual translation (Claude API FR↔EN)
│   └── Auto-populate Sanity CMS
├── Step 3: Style selection
├── Step 4: Domain choice
├── Step 5: Invite collaborators
├── Step 6: First concert setup
└── Step 7: LIVE (under 15 minutes)

Qiwi Chee self-onboards as first beta test
You observe via Clarity session recordings
```

### /website
```
├── Bilingual FR/EN (next-i18n)
├── Music player (Songlink/Odesli)
├── Fan email signup (Mailchimp)
├── Sanity CMS (auto-populated)
├── Atelier — gated fan exclusive area
└── PWA manifest
```

### /concerts
```
├── Create concert (paid OR free)
├── Public event page + QR fan signup
├── Ticket link (Stripe — simple)
├── Support button (Phase 2A crowdfunding)
│   └── External links: PayPal.me, Lydia,
│       Ko-fi, Tipeee, Stripe Payment Link
├── Interactive Feuille de Route (LIVE CHECKLIST)
│   ☐ Load-in  ☐ Setup  ☐ Sound check
│   ☐ Doors   ☐ Show starts
├── Stage plot (auto-generated)
├── Technical rider template
├── GUSO declaration (paid AND free concerts)
├── CDDU per band member + YouSign
├── Rehearsal management
└── Guest list (fan sees own status via RLS)
```

### /legal (KILLER FEATURE — BUILD LAST)
```
⚠️ Consult entertainment lawyer BEFORE building

├── Legal structure: GUSO/CAE/Association/Company
├── GUSO pre-filled generation
├── CDDU auto-generation
├── Intermittent hours tracker (507h dashboard)
└── Legal compliance dashboard
```

---

## CROWDFUNDING STRATEGY (Phased)

### Phase 2A — Light Crowdfunding (early, safe)
```
What it is:
├── Support button on concert/project pages
├── Progress bar (goal, raised, deadline)
├── External payment links:
│   ├── PayPal.me
│   ├── Lydia
│   ├── Stripe Payment Link
│   ├── Ko-fi
│   └── Tipeee
└── Perks: Atelier access, early content,
          supporter wall, name in credits

What it is NOT:
├── Résonance does NOT handle money
├── No refunds handled by platform
├── No KYC required
├── No Stripe Connect
└── No escrow logic

Build complexity: LOW (button + progress bar + links)
Legal risk: ZERO (money goes directly to artist)
When: After core MVP is stable
```

### Phase 2B — Full Crowdfunding (later, advanced)
```
What it adds:
├── Stripe Connect onboarding
├── KYC verification
├── Escrow logic (hold until goal reached)
├── Automatic refunds if goal not reached
├── Automatic payouts to artist + collaborators
├── Résonance commission (5-10%)
├── Accounting logs and VAT handling
└── Full financial compliance

When: After platform stability + trust + real fanbase
Build complexity: HIGH (fintech product)
Legal risk: SIGNIFICANT (needs lawyer + accountant)
```

---

## MARKETPLACE VISION (Phase 2+, not MVP)

```
RÉSONANCE becomes marketplace for professionals:
├── Musicians (session players)
├── Sound engineers
├── Photographers
├── Videographers
├── Lighting technicians
├── Stage managers
├── Graphic designers
└── Community managers

How professionals work:
├── Join platform with profile
├── Added by artists during concert creation
├── Offer services to multiple artists
└── Build reputation inside Résonance

Ranking system:
├── Concerts completed on platform
├── Artist ratings
├── Reliability (no-shows, delays)
└── Skills and specialization

Revenue: marketplace commission on bookings
When: Phase 2+, after beta validation
```

---

## FANBASE GRAPH (Long-term Data Asset)

```
Résonance builds collective fan graph from:
├── QR code check-ins at concerts
├── Atelier logins and engagement
├── Guest list confirmations
├── Fan signups per artist
├── Crowdfunding support patterns
└── City and genre preferences

Graph enables:
├── Extended fanbase recommendations
│   "Fans of Qiwi Chee also like..."
├── Crowdfunding predictions
│   "Based on your fanbase, expect €X"
├── Venue suggestions
│   "Your fans are concentrated in Lyon"
├── Artist-to-artist discovery
└── Cross-artist concert promotion

This graph is the moat that grows automatically.
No competitor can replicate without the same scale.
```

---

## SUPABASE SCHEMA (Complete + Updated)

```sql
-- USERS & ROLES
profiles (id, email, full_name, avatar_url, created_at)

artist_members (
  id, artist_id, user_id,
  role: 'owner'|'collaborator'|'member',
  invited_by, joined_at, is_active
)

-- ARTISTS
artists (
  id, stage_name, bio_fr, bio_en,
  photo_url, genre, owner_id,
  sanity_project_id, mailchimp_audience_id,
  legal_structure: 'guso'|'cae'|'association'|'company',
  subscription_tier, created_at
)

-- CONCERTS (with hidden Phase 2 fields)
concerts (
  id, artist_id, title, date, venue_id,
  is_paid, ticket_price, ticket_link,
  capacity, description_fr, description_en,
  status: 'draft'|'published'|'completed',

  -- Phase 2A crowdfunding (hidden for now)
  estimated_costs (jsonb),
  musician_fees (jsonb),
  venue_cost (numeric),
  equipment_cost (numeric),
  funding_goal (numeric),
  funding_raised (numeric),
  funding_deadline (timestamp),
  funding_status: 'draft'|'active'|'successful'|'failed',
  budget_notes text, -- artist annotations, hidden during MVP

  created_at
)

-- FEUILLE DE ROUTE (live checklist)
feuille_de_route_items (
  id, concert_id, label, scheduled_time,
  is_complete, completed_by, completed_at,
  sort_order
)

-- LEGAL (owner only via RLS)
guso_declarations (
  id, concert_id, artist_id,
  status: 'draft'|'submitted'|'confirmed',
  declaration_data (jsonb), created_at
)

cddu_contracts (
  id, concert_id, band_member_id,
  role_on_stage, fee_amount,
  signed_at, document_url, created_at
)

-- GUEST LIST (member sees own row only)
guest_list (
  id, concert_id, fan_id,
  status: 'pending'|'confirmed'|'denied',
  plus_one, added_by
)

-- VENUES (from open data + manual)
venues (
  id, name, address, city, postal_code,
  latitude, longitude, email, phone, website,
  capacity, venue_type, source,
  claimed, last_updated
)

-- PROFESSIONALS (hidden Phase 2 table)
professionals (
  id, user_id,
  role, -- musician/photographer/sound_engineer/etc.
  skills (jsonb),
  rating (numeric),
  completed_concerts (integer),
  hourly_rate (numeric),
  availability (jsonb),
  is_visible boolean default false, -- must opt-in to be listed
  created_at
)

-- MONITORING
events (
  id, artist_id, event_name,
  properties (jsonb),
  session_id, created_at
)

service_status (
  id, service_name, is_up,
  last_checked, last_down_at,
  error_message, consecutive_failures
)

feedback (
  id, user_id, action,
  rating, comment, created_at
)
```

---

## PRICING MODEL (Revised — Lower Entry Barrier)

```
FREE TIER
├── Limited concerts (2-3/month)
├── Basic website
├── Fan email signup
└── Manual GUSO guidance

STARTER (€9-15/month)
├── Unlimited concerts
├── Full bilingual website
├── GUSO + CDDU automation
└── Basic intermittent tracking

PRO (€29-49/month)
├── Everything in Starter
├── Interactive feuille de route
├── Full intermittent dashboard
├── Rehearsal management
├── Phase 2A crowdfunding (support button)
└── WhatsApp notifications

PREMIUM (€79+/month)
├── Everything in Pro
├── Advanced analytics
├── Priority support
├── Early access to new features
└── Marketplace access (Phase 2+)

USAGE-BASED (add-ons)
├── Extra CDDU beyond tier limit
├── Extra GUSO declarations
└── Extra concerts

PHASE 2+ REVENUE
├── Marketplace commissions
├── Phase 2B crowdfunding commission (5-10%)
└── Venue booking commission

Goal: low entry barrier → fast adoption
      Scale revenue with usage → sustainable growth
```

---

## RESILIENCE ARCHITECTURE

### Health Checks (Vercel Cron — free, every 5 min)
```
Tests: Supabase, Sanity, Mailchimp, Stripe, Claude API
Results → service_status table
Alert after 3 consecutive failures
```

### Graceful Degradation
```
Mailchimp down → save signups locally, sync later
Stripe down → friendly message + alert artist
Sanity down → serve cached content
Claude API down → show manual fallback
```

### Status Page: resonance.fr/status
### Caching: Vercel Edge Cache (1h bio, 5min concerts)

---

## MONITORING ARCHITECTURE

### Three Levels
```
Level 1 — Technical (health checks, uptime)
Level 2 — Business (growth, MRR, concerts)
Level 3 — Behavioral (Clarity, funnel, features)
```

### Tools (All Free)
```
Microsoft Clarity → session recordings
Better Uptime → external uptime monitoring
Vercel Analytics → page views
Custom /admin → business dashboard
Weekly email → automated Monday report
Emoji feedback → 😊😐😟 on key actions
```

### Admin Dashboard (/admin — your NOC view)
```
├── Platform health (all API statuses)
├── Artists (count, MRR, active, churned)
├── Concerts (created, GUSO generated)
├── Onboarding funnel (step-by-step drop-off)
├── Revenue (MRR, growth, tier breakdown)
└── Fanbase graph preview
```

---

## OPEN DATA — VENUE DATABASE

```
Sources (ODbL licence — free):
├── data.iledefrance.fr — Paris venues
├── opendata.paris.fr — active event venues
├── data.culture.gouv.fr — national cultural venues
└── data.gouv.fr — national performance venues

Hundreds of venues pre-loaded before first artist joins
Libraries and mairies included automatically
Solves chicken-and-egg problem
```

---

## NOTIFICATION STRATEGY

```
PRIMARY: Email (Mailchimp)
SECONDARY: WhatsApp pre-filled links (free)
TERTIARY: In-platform dashboard
NOT USED: Telegram (artist said no), Twilio (cost)
```

---

## QIWI CHEE STRATEGY

```
Role: First client AND first beta tester

Process:
├── Build under dev account
├── She self-onboards via wizard (observed)
├── Fix friction points
└── Transfer when ready:
    Supabase → her email
    Vercel → add her as owner
    Connect qiwichee.com (OVH DNS)
```

---

## BETA STRATEGY

```
Beta hook: GUSO + CDDU + intermittent + website
NOT: crowdfunding (that comes later)

Week 1-2: Platform ready, venues pre-loaded
Week 3: Qiwi Chee self-onboards
Week 4: Fix friction, invite 2 more artists
Week 5-6: Invite 2 more artists
Week 7-8: Approach venues
Month 3: Do they pay? → continue or pivot
```

---

## BUILD PHASES (Complete Roadmap)

```
MVP (NOW):
├── /onboarding wizard
├── /website module
├── /concerts module
└── /legal module (lawyer first)

PHASE 2A (after stable MVP):
├── Light crowdfunding (support button)
├── Professional profiles (visible)
└── Basic fanbase graph

PHASE 2B (after trust + fanbase):
├── Full crowdfunding (Stripe Connect)
├── KYC + escrow + refunds
└── Résonance commission

PHASE 3+:
├── Full marketplace (professionals)
├── Advanced fanbase graph
├── Venue marketplace
└── Francophone expansion
```

---

## ARTIST VALIDATION — CONFIRMED

```
✅ GUSO + CDDU = nightmare
✅ Intermittent tracking = critical
✅ Free concerts matter → build fans
✅ Feuille de route = live checklist
✅ Rehearsal management needed
✅ Equipment management needed
```

---

## WHAT IS LIVE

```
✅ qiwichee.vercel.app — LIVE
✅ github.com/bkark/qiwichee
✅ Mailchimp — ID: c5532d5f66
✅ Sanity — Project ID: bayrhx8r
✅ Vercel environment variables set
```

---

## ENVIRONMENT VARIABLES

```
NEXT_PUBLIC_SANITY_PROJECT_ID     = bayrhx8r
NEXT_PUBLIC_SANITY_DATASET        = production
NEXT_PUBLIC_MAILCHIMP_AUDIENCE_ID = c5532d5f66
MAILCHIMP_API_KEY                 = [private]
```

---

## DEVELOPER

- **OS:** Linux Mint, Apple keyboard adapted
  → View > Terminal in VS Code
  → Long pastes: `cat > file << 'ENDOFFILE'`
- **Location:** Courbevoie, Île-de-France, France
- **Node.js:** v22.22.2 / **npm:** 10.9.7
- **Git:** 2.34.1 / **VS Code:** 1.117.0
- **Vercel CLI:** 52.0.0
- **GitHub CLI:** 2.4.0 (gh auth setup-git if push fails)

---

## ACCOUNTS

| Service | Status | Details |
|---|---|---|
| GitHub | ✅ | bkark |
| Vercel | ✅ | Live, auto-deploys |
| Mailchimp | ✅ | Audience ID: c5532d5f66 |
| Sanity.io | ✅ | Project ID: bayrhx8r |
| Supabase | ⏳ | Create next session |
| Stripe | ⏳ | Simple ticket links |
| Better Uptime | ⏳ | Free monitoring |
| MS Clarity | ⏳ | Free session recording |
| OVH | ⏳ | qiwichee.com ~€7/year |

---

## TECH STACK

| Need | Tool | Notes |
|---|---|---|
| Framework | Next.js | ✅ |
| Hosting | Vercel | ✅ live |
| Database | Supabase | ⏳ + RLS |
| Auth | Supabase Auth | ⏳ |
| CMS | Sanity | ✅ account |
| Fan emails | Mailchimp | ✅ |
| Payments | Stripe | ⏳ simple |
| Bilingual | next-i18n | ⏳ |
| AI features | Claude API | ⏳ |
| Notifications | WhatsApp links | ⏳ free |
| Monitoring | MS Clarity | ⏳ |
| Uptime | Better Uptime | ⏳ |
| Mobile | PWA | ⏳ |
| E-signature | YouSign | ⏳ |
| Health checks | Vercel Cron | ⏳ |

---

## SPRINT PLAN

```
SPRINT 1:
├── Supabase setup + schema + RLS policies
├── next-i18n bilingual setup
├── MS Clarity + Better Uptime setup
└── Replace default page with real landing

SPRINT 2:
├── AI Data Importer (scrape → Sanity)
├── Bilingual translation (Claude API)
└── Onboarding wizard UI

SPRINT 3:
├── /concerts module
├── Interactive live checklist
├── Phase 2A support button (simple)
└── GUSO/CDDU generation

SPRINT 4:
├── /legal module (lawyer first)
├── Intermittent tracker
├── Admin dashboard (/admin)
└── Transfer ownership function

SPRINT 5:
├── Beta with Qiwi Chee
├── Watch Clarity recordings
└── Fix friction weekly
```

---

## RESUME LOCALLY

```bash
cd ~/qiwichee
npm run dev
```
Local: http://localhost:3000
Live: https://qiwichee.vercel.app

---

## GIT WORKFLOW

```bash
git add .
git status
git commit -m "What and why"
git push
```

---

## UPDATE THIS FILE

```bash
cp ~/Downloads/CONTEXT_FOR_AI_qiwichee_web.md \
   ~/qiwichee/CONTEXT_FOR_AI_qiwichee_web.md
git add .
git commit -m "Update AI context - session [date]"
git push
```

---

## INSTRUCTIONS FOR THIS AI

- Explain every command — user learns while building
- Explain WHY — telecom analogies help
- One step at a time — wait for confirmation
- French legal context always matters
- Apple keyboard — View > Terminal in VS Code
- DO NOT suggest out-of-scope features
- DO NOT suggest Telegram (artist said no)
- Feuille de route = LIVE CHECKLIST not PDF
- Free concerts need GUSO+CDDU too
- Three roles enforced by Supabase RLS
- Crowdfunding = Phase 2A only (no money handling now)
- Professionals table exists but hidden for now
- Pricing: free → €9-15 → €29-49 → €79+
- Beta hook = legal automation not crowdfunding
- Monitor at 3 levels: technical/business/behavioral
- Graceful degradation — one API down ≠ all broken
- Platform: RÉSONANCE
- Fan exclusive: ATELIER
- Vision: cooperative cultural infrastructure
- Full vision: DECISIONS.md north star only
