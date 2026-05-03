# Résonance — AI Context File
> Paste this at the start of any new conversation to resume instantly.

**Last updated:** 2026-04-26 — Session 1 Complete + All Reviews
**Status:** qiwichee.vercel.app LIVE ✅
**Next session goal:** Supabase setup + RLS + bilingual foundation

---

## STRATEGIC OVERVIEW

```
Three AI perspectives synthesized:
├── Claude (dev AI) — architecture and build
├── Copilot (business AI) — strategy and positioning
└── Third AI (strategic review) — RBAC, schema, features

Key principle: build like a telecom engineer
├── No single point of failure
├── Graceful degradation when services down
├── Full observability (know what's happening)
└── Right alert to right person at right time
```

---

## NAMING CONVENTION

```
RÉSONANCE = the platform (your product/business)
└── SaaS that artists subscribe to

QIWICHEE = one artist's instance
└── qiwichee.com powered by Résonance
    Like a Shopify store powered by Shopify

GitHub repos:
├── bkark/qiwichee — current (proof of concept)
└── bkark/resonance-platform — future (the product)
    qiwichee becomes a tenant/config of Résonance
    Not a separate repo — just a deployment

Keep qiwichee repo for now.
Extract resonance-platform after beta validation.
```

---

## RÉSONANCE — MVP POSITIONING

```
"The first platform that automates GUSO, CDDU
 and intermittent du spectacle for independent
 French artists — while giving them a professional
 bilingual website and simple concert management."
```

---

## THREE USER ROLES (RBAC via Supabase RLS)

```
OWNER (Artist)
└── Full access: legal, finance, team, content
    GUSO/CDDU, fan list, financial reports
    Intermittent hours, all settings

COLLABORATOR (Staff/Band member)
└── Interactive Feuille de Route (live checklist)
    Check off production milestones
    Technical rider, schedule
    Their own CDDU and payments
    Cannot see GUSO or financial data

MEMBER (Fan — "Atelier" access)
└── Their own guest list status ONLY
    Exclusive "Atelier" fan content
    Cannot see ANY legal or financial data
```

### The Shared Lens Architecture
```
Same concert, three different views:
Fan:          "Concert June 15 — You're on guest list ✅"
Collaborator: "☐ Load-in 10h  ☑ Setup done  ☐ Sound check"
Owner:        "45/100 tickets, GUSO submitted, CDDU 2/4 signed"

One DB record → three RLS policies → three views
```

---

## MVP = THREE MODULES + ONBOARDING

### /onboarding (BUILD FIRST)
```
AI-guided self-setup wizard (Claude API):
├── Step 1: Artist basic info
├── Step 2: AI Data Importer
│   ├── Paste legacy URLs (Milkshake, Spotify,
│   │   YouTube, SoundCloud, Facebook...)
│   ├── AI scrapes: bio, discography, photos, videos
│   ├── Bilingual translation (FR↔EN via Claude API)
│   ├── Maps to Sanity CMS schemas automatically
│   └── Artist reviews: "Does this look right?"
├── Step 3: Style selection
├── Step 4: Domain choice
├── Step 5: Invite collaborators
├── Step 6: First concert setup
└── Step 7: LIVE

Goal: artist live in under 15 minutes
Qiwi Chee self-onboards to test flow
You observe via Clarity session recordings
Note every friction point
```

### /website (BUILD NEXT)
```
├── Bilingual FR/EN (next-i18n)
├── Music player (Songlink/Odesli)
├── Fan email signup (Mailchimp)
├── Sanity CMS (auto-populated by importer)
├── Atelier — gated fan exclusive area
└── PWA manifest (installable on phone)
```

### /concerts (BUILD AFTER)
```
├── Create concert (paid OR free)
├── Public event page + QR fan signup
├── Ticket link (Stripe — simple)
├── Interactive Feuille de Route (LIVE CHECKLIST):
│   ├── ☐ Load-in [time] [assigned to]
│   ├── ☐ Stage setup [time]
│   ├── ☐ Sound check [time]
│   ├── ☐ Doors open [time]
│   └── ☐ Show starts [time]
│   Each item checkable by collaborator on phone
│   Owner sees live completion in real time
├── Stage plot (auto-generated)
├── Technical rider template per artist
├── GUSO declaration (paid AND free concerts)
├── CDDU per band member + YouSign
├── Rehearsal management
├── Guest list (fan sees own status only via RLS)
└── WhatsApp link notifications (free, no API)
```

### /legal (KILLER FEATURE — BUILD LAST)
```
⚠️ Consult entertainment lawyer BEFORE building

├── Legal structure question FIRST
│   (GUSO / CAE / Association / Company)
├── GUSO pre-filled generation
├── CDDU auto-generation
├── Intermittent hours tracker (507h dashboard)
├── Legal compliance dashboard
└── Year-end financial export (DGFiP format)
```

---

## SUPABASE SCHEMA (Complete)

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
  created_at
)

-- CONCERTS
concerts (
  id, artist_id, title, date, venue_id,
  is_paid, ticket_price, ticket_link,
  capacity, description_fr, description_en,
  status: 'draft'|'published'|'completed',
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
```

### Key RLS Policies
```sql
-- Fan sees only own guest list row
fan_id = auth.uid() on guest_list

-- Fan sees published concerts only
status = 'published' on concerts

-- Collaborator can update feuille de route
role IN ('owner','collaborator') on fdr_items

-- Owner only for legal tables
role = 'owner' on guso_declarations, cddu_contracts

-- Admin sees everything
role = 'admin' on all tables
```

---

## RESILIENCE ARCHITECTURE

### Three Layers
```
Layer 1 — Health checks (technical)
Layer 2 — Graceful degradation (per feature)
Layer 3 — Status communication (users + admin)
```

### Health Check System
```
Every 5 minutes (Vercel Cron — free):
/api/health-check tests each service:
├── Supabase: simple query
├── Sanity: fetch one record
├── Mailchimp: ping API
├── Stripe: check connection
├── Claude API: minimal call
└── Spotify/YouTube: fetch one item

Results stored in service_status table
Alert sent after 3 consecutive failures
```

### Graceful Degradation Matrix
```
SERVICE DOWN  → LOST              → KEPT
────────────────────────────────────────────
Supabase      → Most dynamic      → Static cached pages
Sanity        → Content editing   → Cached site loads
Mailchimp     → Email campaigns   → Signups saved locally
                                    synced when recovered
Stripe        → Ticket payments   → Everything else
                                    Artist alerted urgently
Claude API    → AI features       → Manual fallback shown
Spotify API   → Auto-import       → Manual entry option
Vercel        → Entire site       → Nothing (hosting)
```

### Status Communication
```
Admin (you):
├── Email alert: any service down > 5 min
├── Admin dashboard: red indicators
└── Weekly report every Monday 8h

Artist (owner):
└── Only if THEIR features affected
    "Ticket sales temporarily paused due to
     payment processor issue"

Fans (public):
└── Friendly, minimal, specific
    "Ticket sales temporarily unavailable ⏱️"
    Never show technical error messages

Public status page: resonance.fr/status
├── 🟢 Website — operational
├── 🔴 Ticket sales — disrupted since 14h32
└── 🟢 Fan signups — operational
```

### Caching Strategy
```
Vercel Edge Cache as fallback:
├── Artist bio/photos: 1 hour TTL
├── Concert listings: 5 minutes TTL
├── Venue data: 24 hours TTL
└── Legal documents: never cached (sensitive)

If Sanity down → cached content serves visitors
Content slightly stale but site still works
```

---

## MONITORING ARCHITECTURE

### Three Levels
```
Level 1 — Technical: is it working?
Level 2 — Business: is it growing?
Level 3 — Behavioral: how do people use it?
```

### Admin Dashboard (/admin — owner only)
```
resonance.fr/admin
├── /admin — NOC overview
├── /admin/artists — all artists, MRR, status
├── /admin/concerts — platform-wide activity
├── /admin/legal — GUSO/CDDU activity
├── /admin/onboarding — funnel analysis
├── /admin/health — all API statuses
├── /admin/events — raw event stream
└── /admin/revenue — MRR, growth, churn

Protected: admin Supabase role only
Other roles → /admin returns 404
```

### Key Metrics Tracked
```
GROWTH (weekly):
├── New artists (MoM %)
├── New fans across all artists
├── Concerts created
└── MRR (Monthly Recurring Revenue)

ENGAGEMENT (daily):
├── Daily Active Artists
├── Features used per session
├── Documents generated
└── Average session duration

HEALTH (monthly):
├── Churn rate
├── Feature adoption % per module
├── NPS score
└── Support requests by category

LEGAL (monthly):
├── GUSO declarations generated
├── CDDU contracts created/signed
├── Intermittent hours tracked
└── Artists at risk of losing status
```

### Event Tracking System
```typescript
// Every meaningful action fires an event
trackEvent({
  event: 'concert_created',
  artist_id: artist.id,
  properties: { is_paid, has_ticket_link }
})

trackEvent({
  event: 'guso_generated',
  artist_id: artist.id,
  properties: { concert_id, is_free_concert }
})

trackEvent({
  event: 'onboarding_step_completed',
  properties: { step, step_name, time_spent_seconds }
})

trackEvent({
  event: 'feature_abandoned',
  properties: { feature, step, time_before_abandon }
})

// Stored in Supabase events table
// Queryable for any metric
// No personal data — artist_id not name
```

### Onboarding Funnel Tracking
```
Step 1 Enter name:        15 started   100%
Step 2 Paste URLs:        13 reached    87%
Step 3 Review data:       11 reached    73%
Step 4 Choose style:      10 reached    67%
Step 5 Domain choice:      9 reached    60%
Step 6 Invite team:        8 reached    53%
Step 7 First concert:      7 reached    47%
Published live:            6 completed  40%

Drop at step 6 → investigate in Clarity
```

### Weekly Automated Report
```
Every Monday 8h (Vercel Cron):
├── New artists this week
├── New fans this week
├── Concerts created
├── GUSO declarations
├── MRR and growth
├── Concerns (churn risk, drop-off spikes)
└── Top performing artist

Sent via email to admin (you)
```

### Alert Routing
```
YOU get alerted:
├── Any API down > 5 minutes
├── New artist signs up
├── Artist cancels subscription
├── Error rate spike
├── Onboarding completion drops
└── Revenue milestone reached

ARTIST gets alerted:
├── New fan signup
├── Ticket sold
├── CDDU awaiting signature
├── Intermittent status warning
├── Concert tomorrow reminder
└── GUSO deadline approaching

COLLABORATOR gets alerted:
├── Concert schedule change
├── Feuille de route item overdue
└── CDDU ready to sign

FAN gets alerted:
├── New concert announced
├── Guest list confirmed
└── New Atelier content
```

### Monitoring Tools Stack (All Free)
```
Microsoft Clarity → session recordings, heatmaps
Better Uptime → external uptime, status page
Vercel Analytics → page views, performance
Supabase dashboard → database activity
Custom /admin → business metrics dashboard
Weekly email → automated Monday report
Emoji feedback → 😊😐😟 on key actions
```

---

## OPEN DATA — VENUE DATABASE

```
French government open data (ODbL licence):

1. Lieux de diffusion spectacle vivant Paris
   data.iledefrance.fr — name, address, email, geo

2. Que Faire à Paris (events agenda)
   opendata.paris.fr — active venues hosting events

3. Ministère de la Culture
   data.culture.gouv.fr — all French cultural venues

4. data.gouv.fr salles de spectacles
   National venue geolocation database

Strategy: import hundreds of venues automatically
Solves chicken-and-egg before first artist joins
Libraries and mairies included automatically
```

---

## NOTIFICATION STRATEGY (Final)

```
⚠️ Artist feedback: WhatsApp/SMS not Telegram

PRIMARY: Email (Mailchimp) — formal, campaigns
SECONDARY: WhatsApp pre-filled links (free, no API)
  wa.me/+33X?text=pre-filled+message
TERTIARY: In-platform dashboard notifications
NOT USED: Telegram, Twilio (has cost)
FUTURE: WhatsApp Business API when budget allows
```

---

## QIWI CHEE STRATEGY

```
Role: First client AND first beta tester

Process:
├── Build under dev account
├── She self-onboards via wizard (you observe)
├── Clarity records her session
├── Note every friction point
├── Fix top 3 problems per week
└── Transfer when ready:
    ├── Supabase project → her email
    ├── Vercel → add her as owner
    └── Connect qiwichee.com (OVH DNS)
```

---

## BETA STRATEGY

```
Week 1-2: Platform ready, venues pre-loaded
Week 3: Qiwi Chee self-onboards (observed)
Week 4: Fix friction + invite 2 more artists
Week 5-6: Invite 2 more artists
Week 7-8: Approach venues (show active artists)
Month 3: Do they pay? → continue or pivot
```

---

## ARTIST VALIDATION — CONFIRMED

```
✅ GUSO + CDDU paperwork = nightmare
✅ Intermittent tracking = critical
✅ Free concerts matter → build fans → paid concerts
✅ Feuille de route = essential (now LIVE checklist)
✅ Rehearsal management needed
✅ Equipment/backline management needed
```

---

## 🚫 OUT OF SCOPE FOR MVP

PR tools, influencer marketplace, studio/venue
marketplace, full crowdfunding, sync licensing,
band marketplace, Telegram, Twilio, Redis,
queues, event streaming, microservices.

---

## WHAT IS LIVE RIGHT NOW

```
✅ qiwichee.vercel.app — LIVE (default page)
✅ github.com/bkark/qiwichee
✅ Mailchimp — ID: c5532d5f66
✅ Sanity — Project ID: bayrhx8r
✅ Vercel environment variables set
```

---

## ENVIRONMENT VARIABLES (Vercel)

```
NEXT_PUBLIC_SANITY_PROJECT_ID     = bayrhx8r
NEXT_PUBLIC_SANITY_DATASET        = production
NEXT_PUBLIC_MAILCHIMP_AUDIENCE_ID = c5532d5f66
MAILCHIMP_API_KEY                 = [private]
```

---

## DEVELOPER

- **Background:** Telecom engineer learning web dev
- **Location:** Courbevoie, Île-de-France, France
- **OS:** Linux Mint, Apple keyboard adapted
  → View > Terminal in VS Code (not Ctrl+`)
  → Long pastes: `cat > file << 'ENDOFFILE'`
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
| Better Uptime | ⏳ | Free uptime monitoring |
| MS Clarity | ⏳ | Free session recording |
| OVH | ⏳ | qiwichee.com ~€7/year |

---

## TECH STACK

| Need | Tool | Notes |
|---|---|---|
| Framework | Next.js | ✅ installed |
| Hosting | Vercel | ✅ live |
| Database | Supabase | ⏳ + RLS |
| Auth | Supabase Auth | ⏳ built-in |
| CMS | Sanity | ✅ account ready |
| Fan emails | Mailchimp | ✅ configured |
| Payments | Stripe | ⏳ later |
| Bilingual | next-i18n | ⏳ next session |
| AI features | Claude API | ⏳ onboarding |
| Notifications | WhatsApp links | ⏳ free |
| Monitoring | MS Clarity | ⏳ one script |
| Uptime | Better Uptime | ⏳ free |
| Mobile | PWA | ⏳ after /website |
| E-signature | YouSign | ⏳ later |
| Health checks | Vercel Cron | ⏳ free |

---

## SPRINT PLAN

```
SPRINT 1 (next sessions):
├── Supabase setup with full schema + RLS
├── next-i18n bilingual setup
├── Better Uptime + MS Clarity setup
└── Replace default page with real landing

SPRINT 2:
├── AI Data Importer (scrape → Sanity)
├── Bilingual translation (Claude API)
└── Onboarding wizard UI

SPRINT 3:
├── /concerts module
├── Interactive live checklist (feuille de route)
├── WhatsApp link notifications
└── GUSO/CDDU generation

SPRINT 4:
├── /legal module (lawyer first)
├── Intermittent tracker
├── Admin dashboard (/admin)
└── Transfer ownership function

SPRINT 5:
├── Beta with Qiwi Chee (self-onboard)
├── Watch Clarity recordings daily
└── Fix friction points weekly
```

---

## DOMAIN MANAGEMENT

```
DNS records for Vercel (when ready):
Type: A     Name: @   Value: 76.76.21.21
Type: CNAME Name: www Value: cname.vercel-dns.com

⚠️ Always warn about MX records before DNS changes
SSL automatic and free via Vercel
Visitors never see vercel.app after domain connected
```

---

## TWO AI ROLES

```
Claude → Dev AI (build, explain, step by step)
Copilot → Business AI (positioning, GTM, pitch)
Both work from this context file.
```

---

## FULL VISION — NORTH STAR

Complete 6-sided ecosystem in DECISIONS.md.
DO NOT BUILD until beta validation succeeds.

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
# Vercel auto-deploys in ~30 seconds
```

---

## UPDATE THIS FILE

End of session: "please update the context file"
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
- Use WhatsApp links not Twilio/Telegram
- Feuille de route = LIVE CHECKLIST not PDF
- Free concerts need GUSO+CDDU too
- Three roles: Owner/Collaborator/Member (RLS)
- Supabase RLS enforces role separation at DB level
- Qiwi Chee = client AND beta tester
- Shadow build → observe → fix → transfer ownership
- Naming: Résonance = platform, Qiwichee = instance
- Monitor at 3 levels: technical, business, behavioral
- Graceful degradation — never let one API kill all features
- Right alert to right person at right time
- Admin dashboard at /admin (your NOC view)
- Remind to consult lawyer before /legal module
- Platform: RÉSONANCE
- Fan exclusive area: ATELIER
- Full vision: DECISIONS.md north star only
- Site is LIVE — every push deploys automatically
