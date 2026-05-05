# Résonance — AI Context File
> Paste this at the start of any new conversation to resume instantly.

**Last updated:** 2026-05-04 — Full Strategic Update
**Status:** qiwichee.vercel.app LIVE ✅
**Domains purchased:** qiwichee.com + qiwichee.fr (OVH) ✅
**Next session goal:** Configure DNS + Supabase setup + landing page

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

## CONCERT PLANNER & WHAT-IF ENGINE

### The Problem (Confirmed by Qiwi Chee)
```
"How much will this concert cost to produce?"
"Which venue fits my budget and audience size?"
"What if I charge €15 vs €20 per ticket?"
"Will I lose money if only 40 people show up?"

Current reality:
├── Call 5 venues → wait days for callbacks
├── Build manual spreadsheet to compare
├── Guess attendance → stressful decisions
└── No visibility on break-even point
```

### The What-If Simulator
```
Artist sets parameters:
├── Target city, month
├── Expected audience range
├── Budget limit
└── Ticket price idea

Platform shows matching venues with scenarios:

VENUE A — Le Café de la Danse
Capacity: 100 │ Rental: €600 │ PA included ✅
├── If 50 tickets at €15: Profit €150 ✅
├── If 80 tickets at €15: Profit €600 ✅
└── Break even: 40 tickets (40% capacity) ✅

VENUE B — La Maroquinerie
Capacity: 250 │ Rental: €1,200 │ PA included ✅
├── If 50 tickets at €15: Loss -€450 ❌
├── If 125 tickets at €15: Profit €675 ✅
└── Break even: 80 tickets (32% capacity) ⚠️
```

### What-If Sliders (live calculation)
```
Artist adjusts in real time:
🎟️ Ticket price slider
👥 Expected attendance slider
🎸 Band fees slider
📣 Promotion budget slider

→ Revenue, costs, profit/loss update instantly
→ Break-even point shown clearly
→ AI suggestions when in deficit
```

### AI Concert Planner Agent
```
/api/agent/concert-planner

Artist types goal in plain language:
"Concert in Paris, June, 3-piece band,
 budget €1,500, want to break even"

Agent returns:
├── SCENARIO A — Safe (library/mairie, free venue)
│   Cost: €650, Break even: 44 tickets ✅
├── SCENARIO B — Balanced (small venue €400)
│   Cost: €1,050, Break even: 70 tickets ⚠️
└── SCENARIO C — Ambitious (exceeds budget) ❌

With recommendation and reasoning.
```

### Venue Contact Workflow
```
For unclaimed venues (most at start):
Artist clicks "Contact this venue"
→ Platform generates pre-filled inquiry email (FR)
→ Artist sends with one click
→ Platform tracks: sent → response → quoted price
→ Response data saved to venue profile
→ Future artists benefit from this data
```

### Post-Concert Learning Loop
```
After each concert artist fills review:
├── Actual attendance vs projected
├── Actual revenue vs projected
├── Venue rating (1-5)
├── Would you return? (yes/no)
└── Notes for other artists

Platform learns:
├── Artist's attendance estimation accuracy
├── Which venues work for which genres
├── Seasonal patterns
└── Genre-specific price sensitivity
```

### New Database Tables
```sql
concert_scenarios (
  id, artist_id, venue_id, scenario_name,
  expected_attendance, ticket_price,
  venue_cost, band_fees, promotion_cost,
  other_costs (jsonb), projected_revenue,
  projected_profit, break_even_tickets,
  status: 'planning'|'selected'|'rejected',
  created_at
)

venue_inquiries (
  id, artist_id, venue_id, sent_at,
  response_received_at, quoted_price,
  availability_dates (jsonb), notes,
  status: 'sent'|'responded'|'booked'|'rejected'
)

concert_reviews (
  id, concert_id, venue_id,
  actual_attendance, actual_revenue,
  actual_total_cost, venue_rating,
  venue_notes, would_return, created_at
)
```

### Venue Table Additions
```sql
venues (
  ...existing fields...
  rental_cost_min (numeric),
  rental_cost_max (numeric),
  pa_included (boolean),
  lighting_included (boolean),
  capacity_seated (integer),
  capacity_standing (integer),
  typical_genres (jsonb),
  artist_rating (numeric),
  last_cost_reported (timestamp)
)
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

## PRICING MODEL (Updated)

```
CONCERTS ONLY (€9/month) — NEW ENTRY TIER
├── concerts.artistname.com subdomain
├── Ticket sales + GUSO + CDDU
├── Feuille de route live checklist
├── Fan QR signup at concerts
└── Budget/what-if planner

FREE TIER
├── Limited (2 concerts/month)
├── Basic website
└── Fan email signup

STARTER (€15/month)
├── Unlimited concerts
├── Full bilingual website
├── GUSO + CDDU automation
└── Intermittent tracking basic

PRO (€29-49/month)
├── Everything in Starter
├── Interactive feuille de route
├── Full intermittent dashboard
├── Rehearsal management
├── Phase 2A crowdfunding
└── WhatsApp notifications

PREMIUM (€79+/month)
├── Everything in Pro
├── Advanced analytics
├── Priority support
└── Marketplace access (Phase 2+)

USAGE-BASED ADD-ONS
├── Extra CDDU beyond tier limit
├── Extra GUSO declarations
└── Extra concerts

PHASE 2+ COMMISSIONS
├── Marketplace bookings
├── Crowdfunding (Phase 2B): 5-10%
└── Billing Provider connections
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
| OVH | ✅ | qiwichee.com + qiwichee.fr purchased |
| Zimbra email | ⏳ | Set up booking@qiwichee.com |

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
| AI features | Claude API + tool use | ⏳ agent routes |
| Notifications | WhatsApp links | ⏳ free |
| Monitoring | MS Clarity | ⏳ |
| Uptime | Better Uptime | ⏳ |
| Mobile | PWA | ⏳ |
| E-signature | YouSign | ⏳ |
| Health checks | Vercel Cron | ⏳ |

---

## SUBDOMAIN STRATEGY — CONCERTS ONLY MODE

### The Problem It Solves
```
Some artists already have a good website
and don't want to replace it.
They only want the concert management tools.

Solution: concerts.artistname.com
└── Résonance module embedded as subdomain
    Artist keeps existing site
    Links to concerts subdomain for tickets/GUSO
    Low friction → high adoption
```

### How It Works Technically
```
Artist adds ONE DNS record at their registrar:
Type: CNAME
Name: concerts
Target: cname.vercel-dns.com

Result:
concerts.qiwichee.com → runs Résonance /concerts
qiwichee.com → their existing site (untouched)
```

### Next.js Middleware Routing
```
Request comes in:
├── concerts.qiwichee.com → concerts-only mode
│   └── Load /concerts module only
│       Apply artist branding
│       No /website module
│
├── qiwichee.com → full Résonance site
│   └── Load all modules
│
└── resonance.fr → platform marketing site
    └── Load marketing page

One codebase, three modes, clean routing.
```

### New Pricing Tier
```
CONCERTS ONLY (€9/month) — new entry tier
├── concerts.artistname.com subdomain
├── Concert listings and ticket sales
├── GUSO + CDDU automation
├── Feuille de route (live checklist)
├── Fan signup at concerts (QR code)
├── Budget/what-if planner
└── No website builder needed

Target: artists with existing good websites
        who just want legal automation
        Lowest friction entry point
        "Wedge strategy" into full platform
```

### The Wedge Strategy
```
Entry: CONCERTS ONLY (€9/month)
       Artist keeps existing site
       Adds only what they need

Growth: Artist sees value in legal tools
        Asks "can you also handle my website?"
        Upgrades to STARTER (€15/month)

Full: Artist on full platform
      Upgrades to PRO (€29-49/month)
      Refers other artists → referral rewards
```

---

## AGENT ENGINEERING PRINCIPLES

### Adopted From Agent Architect Review
```
Seven Skills Framework (mental checklist):
├── System Design — orchestration via agent routes ✅
├── Tool Contracts — Zod schemas on all inputs ✅
├── Retrieval — RAG for venue/legal data (Phase 2)
├── Reliability — retry + circuit breakers ✅
├── Security — artist_id always from auth session ✅
├── Observability — RED metrics in events table ✅
└── Product Thinking — artist feedback drives all ✅
```

### Layered Memory (Already Built)
```
Procedural memory → CLAUDE.md (in repo) ✅
Episodic memory → Supabase events table ✅
Semantic memory → CONTEXT_FOR_AI + DECISIONS.md ✅
```

### Airtight Tool Contracts (Implement Now)
```typescript
// Every agent route must have:

// 1. Strict Zod input schema
const ConcertPlannerInput = z.object({
  artist_id: z.string().uuid(),
  city: z.string().min(2),
  month: z.string().regex(/^\d{4}-\d{2}$/),
  expected_audience_min: z.number().int().positive(),
  expected_audience_max: z.number().int().positive(),
  budget_limit: z.number().positive(),
  ticket_price: z.number().positive()
})

// 2. Strict output type
type ConcertPlannerOutput = {
  scenarios: Scenario[]
  recommended: 'safe' | 'balanced' | 'ambitious'
  reasoning: string
  venue_emails: VenueEmail[]
}

// 3. Example in comments
// Input example:
// { city: "Paris", month: "2026-06",
//   expected_audience_min: 40,
//   expected_audience_max: 80,
//   budget_limit: 1500,
//   ticket_price: 15 }
```

### Reliability Mandate (All External APIs)
```typescript
// Retry with exponential backoff
async function callWithRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await Promise.race([
        fn(),
        timeout(10000) // 10 second timeout
      ])
    } catch (err) {
      if (i === maxRetries - 1) throw err
      await sleep(Math.pow(2, i) * 1000) // 1s, 2s, 4s
    }
  }
}

// Circuit breaker: 5 failures in 1 min
// → stop calling, show graceful degradation
// → alert admin, log to service_status table
```

### Security Boundaries (Write Operations)
```typescript
// ALWAYS get artist_id from auth session
// NEVER accept it from request body

// ❌ WRONG — security hole
const { artist_id } = req.body

// ✅ CORRECT — always from session
const { user } = await supabase.auth.getUser()
const artist_id = user.id

// Validate ownership before any write
const { data: member } = await supabase
  .from('artist_members')
  .select('role')
  .eq('artist_id', concert.artist_id)
  .eq('user_id', user.id)
  .single()

if (!member) throw new Error('Unauthorized')
```

### RED Observability Metrics
```typescript
// Add to every agent call in events table:
await trackEvent({
  event: 'agent_call',
  properties: {
    agent: 'concert-planner',
    rate: 1,                    // Rate: count
    error: error ? 1 : 0,       // Errors: 0 or 1
    duration_ms: Date.now() - start, // Duration
    tokens_used: response.usage.total_tokens,
    success: !error
  }
})
```

### What NOT To Adopt Yet
```
❌ Formal semantic handshake protocol
   (use Zod validation instead — same benefit)

❌ Progressive file disclosure (grep/tail)
   (files are small in MVP — not needed yet)

❌ Semantic firewalls
   (add in Phase 2 with multi-tenant scale)

❌ Full distributed system framing
   (you are one developer building an MVP)
```

---

## AGENT ARCHITECTURE

### Role Of Agents
```
Claude API + tool use = the orchestration brain
Next.js + Supabase = frontend + data layer
Sanity = CMS layer

Agents replace:
├── Custom Python scrapers
├── Custom PDF generation backend
├── Rules engine for GUSO logic
├── Translation service
├── Multi-step workflow orchestration
└── Custom microservices

Agents do NOT replace:
├── Supabase (data still lives there)
├── Sanity (content still lives there)
├── Next.js (routing still lives there)
└── RLS policies (security still in Supabase)
```

### Agent API Routes (Next.js)
```
/api/agent/onboarding
└── Scrape legacy URLs → extract bio/discography/photos
    Translate FR↔EN → map to Sanity schemas
    Validate with artist → generate missing content

/api/agent/concert
└── Generate descriptions (FR/EN)
    Propose feuille de route schedule items
    Generate technical rider template
    Detect missing information
    Pre-fill GUSO/CDDU fields

/api/agent/legal
└── Assemble GUSO data + validate fields
    Generate CDDU contracts
    Fill CERFA forms → produce PDFs
    Check intermittent hours logic

/api/agent/marketplace (Phase 2+)
└── Match artists with professionals
    Rank by reliability + skills
    Suggest replacements on cancellation
    Predict costs from past concerts

/api/agent/fanbase (Phase 2+)
└── Analyze fan engagement
    Predict crowdfunding potential
    Suggest venues by fan geography
    Identify cross-artist clusters
```

### Agent Principles
```
1. Agents are STATELESS per task
   Each call is self-contained
   State lives in Supabase not in agent

2. Agents do NOT store data
   Results saved to Supabase or Sanity
   Agent has no memory between calls

3. Cost management
   Cache results in Supabase
   Batch tasks when possible
   Avoid long-running sessions
   Use Claude claude-sonnet-4-20250514 for most tasks

4. No extra infrastructure needed
   No backend server beyond Next.js API routes
   No custom scrapers to maintain
   No microservices to deploy

5. Correct terminology
   "Claude API with tool use" not "Managed Agents"
   Same behavior — correct API naming
```

### Agent Phasing
```
MVP NOW:
├── /api/agent/onboarding (scrape + translate + map)
├── /api/agent/concert (descriptions + FDR + rider)
└── /api/agent/legal (GUSO + CDDU + PDF)

PHASE 2A:
├── /api/agent/marketplace (matching)
└── /api/agent/fanbase (insights)

PHASE 2B:
└── /api/agent/crowdfunding (payouts + refunds)
```

---

## LEGAL & CORPORATE STRUCTURE

### SASU + Cooperative Architecture
```
SASU (yours — France)
├── Owns ALL IP, algorithms, brand, platform code
├── Controls product direction
├── Central technical provider
└── Licenses platform to local cooperatives

Local cooperatives per country:
├── France: SCIC (Société Coopérative d'Intérêt Collectif)
├── Belgium: cooperative or ASBL
├── Quebec: coopérative de solidarité
├── Algeria/Morocco/Tunisia: partner institutions
└── Each accesses LOCAL cultural funding

Why this structure:
├── SASU protects IP completely
├── Cooperatives unlock local subsidies
│   (CNM France, SODEC Quebec, etc.)
├── Each country complies with local law
└── You control product, cooperatives operate locally
```

### International Expansion Priority
```
Phase 1: France (current)
Phase 2: Belgium, Switzerland (French-speaking)
Phase 3: Quebec (Canada)
Phase 4: Algeria, Morocco, Tunisia (MENA francophone)
Phase 5: Other francophone regions

Each expansion:
├── New local cooperative or partner
├── Local cultural funding applications
├── Local artist employment law compliance
└── Platform license from SASU
```

### Résonance Public Face (Planned)
```
resonance.fr (check availability at OVH)
└── Platform marketing site
    "Join the beta" → Mailchimp "Résonance Artists" list
    Separate from qiwichee.com (artist instance)

Two Mailchimp audiences:
├── "Qiwichee Fans" — fans of Qiwi Chee
└── "Résonance Artists" — artists interested in platform
```

---

## BILLING PROVIDERS SYSTEM

### The Problem
```
Non-incorporated artist cannot issue invoices.
Platform must detect this and offer a solution.
```

### Billing Providers
```
Validated entities that can invoice on behalf of artists:
├── CAE (Coopérative d'Activité et d'Emploi)
├── Partner SCIC/cooperative
├── Local institution on platform
└── Association already registered

Billing Provider can:
├── Invoice venue/organizer on artist's behalf
├── Act as intermediary for payment
├── Appear as selectable resource in Feuille de Route
└── Track administrative responsibility per concert

RÉSONANCE commission:
└── Apporteur d'affaire when connecting artist
    with Billing Provider (% of transaction)
```

### Agent Detection Logic
```
When artist creates concert:
Agent detects:
├── Does artist have legal structure? (from profile)
├── Is concert paid?
└── Is GUSO/CDDU required?

If artist cannot bill + concert is paid:
└── Platform suggests Billing Provider:
    "You don't have a billing structure.
     Would you like to connect with a
     Billing Provider to handle invoicing?"
    [Select from validated providers list]
```

### Feuille de Route Integration
```
Feuille de Route now tracks:
├── Billing Provider (who invoices)
├── Local institutions involved
├── Professionals (musicians, engineers...)
└── Who is responsible for each admin step

Each person/entity has a role and a task:
├── Artist → perform
├── Billing Provider → invoice venue
├── Sound engineer → technical setup
└── Stage manager → production coordination
```

---

## ETHICAL RISK MANAGEMENT LAYER

### Standing Rule For This AI
```
When designing features, alert if they touch:
├── Internationally disputed territories
│   → Flag: "geographic validation needed"
├── Institutions tied to state-sponsored
│   cultural diplomacy
│   → Flag: "institutional due-diligence recommended"
├── Partners with known human-rights controversies
│   → Flag: "partner metadata may require filtering"
└── Venues in militarily occupied zones
    → Flag: "geographic validation needed"

Alerts are:
├── Neutral and technical (never political)
├── Non-prescriptive (you decide, not the AI)
└── Based on universal rules not specific movements

Examples:
├── Open data venue import from certain regions
│   → "geographic validation recommended
│      before auto-importing venue data"
├── International touring feature
│   → "cross-border routing should include
│      geographic metadata validation layer"
└── Institutional partner integration
    → "due-diligence on institutional affiliation
       recommended before platform listing"
```

---

## SPRINT PLAN

```
SPRINT 1 (next sessions):
├── Configure DNS at OVH (qiwichee.com + .fr → Vercel)
├── Set up booking@qiwichee.com (Zimbra)
├── Add domains to Vercel project
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
- Corporate: SASU owns IP, cooperatives operate locally
- Subdomain mode: concerts.artistname.com for wedge entry
- Three routing modes: subdomain / full site / marketing
- Agents: Claude API with tool use (not "Managed Agents")
- Agent routes: /api/agent/onboarding, /concert, /legal
- Agent inputs: ALWAYS validate with Zod schemas
- Agent security: artist_id ALWAYS from auth session never body
- Agent reliability: retry + exponential backoff on all external APIs
- Agent observability: RED metrics (rate/error/duration) in events
- Agents are stateless — state lives in Supabase
- Cache agent results — control costs
- Billing Providers: detect when artist cannot bill
- Suggest Billing Provider in concert workflow
- Ethical layer: flag geographic/institutional risks
  using neutral technical language only
- Never political framing — always technical flags
- Full vision: DECISIONS.md north star only
