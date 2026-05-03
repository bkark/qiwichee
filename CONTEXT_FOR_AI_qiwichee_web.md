# Résonance — AI Context File
> Paste this at the start of any new conversation to resume instantly.

**Last updated:** 2026-04-26 — Session 1 + V4 + Strategic Review
**Status:** qiwichee.vercel.app LIVE ✅
**Next session goal:** Supabase schema setup + bilingual foundation

---

## STRATEGIC OVERVIEW

```
Three AI perspectives synthesized:
├── Claude (dev AI) — architecture and build
├── Copilot (business AI) — strategy and positioning
└── Third AI (strategic review) — RBAC, schema, features

Key decisions from strategic review:
├── Interactive Feuille de Route (live checklist, not PDF)
├── RBAC via Supabase RLS (three roles)
├── AI Data Importer with bilingual translation
├── Transfer Ownership (not delete account)
└── WhatsApp links (not Telegram — artist feedback)
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
└── Their own guest list status only
    Exclusive "Atelier" fan content
    Cannot see ANY legal or financial data
    Cannot see other fans' data
```

### The "Shared Lens" Architecture
```
Same concert, three different views:

Fan sees:        "Concert June 15 — You're on guest list ✅"
Collaborator sees: "☐ Load-in 10h  ☑ Setup done  ☐ Sound check"
Owner sees:      "45/100 tickets, GUSO submitted, CDDU 2/4 signed"

One database record, three RLS policies, three views.
```

---

## MVP = THREE MODULES + ONBOARDING

### /onboarding (BUILD FIRST)
```
AI-guided self-setup wizard (Claude API):
├── Step 1: Artist basic info (name, genre, languages)
├── Step 2: AI Data Importer
│   ├── Artist pastes legacy URLs
│   │   (Milkshake, Spotify, YouTube, SoundCloud...)
│   ├── AI scrapes: bio, discography, photos, videos
│   ├── Bilingual translation offered automatically
│   │   (FR→EN or EN→FR via Claude API)
│   ├── Maps directly to Sanity CMS schemas
│   └── Artist reviews: "Does this look right?"
├── Step 3: Style (colors, mood)
├── Step 4: Domain choice
├── Step 5: Invite collaborators
├── Step 6: First concert setup
└── Step 7: LIVE

Goal: artist live in under 15 minutes
Qiwi Chee self-onboards to test the flow
You observe and note friction points
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
├── Interactive Feuille de Route (live checklist):
│   ├── ☐ Load-in [time] [assign to]
│   ├── ☐ Stage setup [time]
│   ├── ☐ Sound check [time]
│   ├── ☐ Doors open [time]
│   ├── ☐ Show starts [time]
│   └── Each item checkable by collaborator
│       Owner sees completion in real time
├── Stage plot (auto-generated)
├── Technical rider template
├── GUSO declaration (paid AND free)
├── CDDU per band member + YouSign
├── Rehearsal management
├── Guest list management (fan member sees own status)
└── WhatsApp link notifications (not Telegram)
```

### /legal (KILLER FEATURE — BUILD LAST)
```
⚠️ Consult entertainment lawyer BEFORE building

├── Legal structure question first
│   (GUSO / CAE / Association / Company)
├── GUSO pre-filled generation
├── CDDU auto-generation
├── Intermittent hours tracker (507h dashboard)
├── Legal compliance dashboard
└── Year-end financial export (DGFiP format)
```

---

## SUPABASE SCHEMA (Full)

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
```

---

## OPEN DATA INTEGRATION — VENUE DATABASE

```
French open data sources for venue pre-loading:

1. Lieux de diffusion du spectacle vivant — Paris
   URL: data.iledefrance.fr
   Contains: name, address, email, phone, geolocation
   Covers: concert halls, libraries, cultural centers

2. Que Faire à Paris — Events API
   URL: opendata.paris.fr
   Contains: active venues hosting events
   Use: identify which venues are actually active

3. Ministère de la Culture — Équipements culturels
   URL: data.culture.gouv.fr
   Contains: all cultural venues in France
   Use: national expansion beyond Paris

4. data.gouv.fr — Salles de spectacles
   URL: data.gouv.fr
   Contains: geolocation of all French performance venues

Licence: ODbL — free to use, must attribute source

Strategy: import hundreds of venues automatically
          Platform launches with rich venue database
          Solves chicken-and-egg problem immediately
          Libraries and mairies included automatically
```

---

## NOTIFICATION STRATEGY (Final)

```
⚠️ Qiwi Chee confirmed: artists use WhatsApp/SMS
   not Telegram — never force tools artists won't use

PRIMARY: Email (Mailchimp) — formal docs, campaigns
SECONDARY: WhatsApp link generation — free, no API
  Platform generates: wa.me/+33X?text=pre-filled+message
  Artist clicks → opens WhatsApp → sends to team
TERTIARY: In-platform dashboard notifications
FUTURE: WhatsApp Business API when platform has budget
NOT NOW: Telegram, Twilio SMS (has cost)
```

---

## QIWI CHEE STRATEGY

```
Role: First client AND first beta tester

Build process:
├── Build under dev account (your GitHub/Vercel)
├── Qiwi self-onboards via wizard (you observe)
├── Note every friction point
├── Fix top 3 problems
└── Transfer ownership when ready:
    ├── Supabase: transfer project to her email
    ├── Vercel: add her as owner
    └── Connect qiwichee.com (OVH DNS)

Shadow Build = build first, observe her setup,
               improve before next artist
```

---

## MONITORING STACK (All Free)

```
Microsoft Clarity → session recordings, heatmaps
Vercel Analytics → page views, performance
Supabase dashboard → database activity
Mailchimp reports → email open rates
Custom admin → concerts created, GUSO generated

Emoji feedback on key actions:
"How was that? 😊 😐 😟"
If 😟 → optional text field appears
```

---

## BETA STRATEGY

```
Week 1-2: Platform ready for first user
Week 3: Qiwi Chee self-onboards (observed)
Week 4: Fix top friction points
Week 4: Invite 2 more artists
Week 5-6: Invite 2 more artists
Week 7-8: First venue conversation
          (show them active artists as proof)
Month 3: Assessment — do they pay? → continue/pivot
```

---

## ARTIST VALIDATION — CONFIRMED

```
✅ GUSO + CDDU paperwork = nightmare
✅ Intermittent tracking = critical
✅ Free concerts matter (build fans → paid concerts)
✅ Feuille de route = essential (now live checklist)
✅ Rehearsal management needed
✅ Equipment/backline management needed
```

---

## WHAT IS FEUILLE DE ROUTE (Updated)

```
No longer a static PDF.
Now a LIVE CHECKLIST in /concerts module.

Team members check off milestones in real time:
☐ Load-in [10h00] — assigned to: Jean-Marc
☐ Stage setup [11h00]
☐ Sound check [13h00] — assigned to: all
☐ Break [14h30]
☐ Doors open [16h00]
☐ Show [20h00]

Owner sees live completion status
Collaborator checks items on their phone
Fan member sees NOTHING of this
```

---

## 🚫 OUT OF SCOPE FOR MVP

PR tools, influencer marketplace, studio/venue
marketplace, full crowdfunding, sync licensing,
band marketplace, Redis, queues, Twilio,
event streaming, microservices, Telegram.

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
  → View > Terminal in VS Code
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
| OVH | ⏳ | qiwichee.com ~€7/year |

---

## TECH STACK

| Need | Tool | Notes |
|---|---|---|
| Framework | Next.js | ✅ installed |
| Hosting | Vercel | ✅ live |
| Database | Supabase | ⏳ + RLS policies |
| CMS | Sanity | ✅ account ready |
| Auth | Supabase Auth | ⏳ built-in |
| Fan emails | Mailchimp | ✅ configured |
| Payments | Stripe | ⏳ later |
| Bilingual | next-i18n | ⏳ next session |
| AI onboarding | Claude API | ⏳ next session |
| Notifications | WhatsApp links | ⏳ free |
| Monitoring | MS Clarity | ⏳ one script |
| Mobile | PWA | ⏳ after /website |
| E-signature | YouSign | ⏳ later |

---

## SPRINT PLAN

```
SPRINT 1 (next sessions):
├── Supabase setup with full schema
├── RLS policies for all three roles
├── next-i18n bilingual setup
└── Basic landing page (replace default)

SPRINT 2:
├── AI Data Importer (scrape → Sanity)
├── Bilingual translation on import (Claude API)
└── Onboarding wizard UI

SPRINT 3:
├── /concerts module
├── Interactive Feuille de Route (live checklist)
├── WhatsApp link notifications
└── GUSO/CDDU generation

SPRINT 4:
├── /legal module (lawyer consultation first)
├── Intermittent tracker
└── Transfer ownership function

SPRINT 5:
├── Beta with Qiwi Chee (self-onboard)
├── Microsoft Clarity monitoring
└── Fix friction points
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
- Feuille de route = live checklist not PDF
- Free concerts need GUSO+CDDU too
- Three roles: Owner/Collaborator/Member
- Supabase RLS enforces role separation
- Qiwi Chee = client AND beta tester
- Shadow build → transfer ownership
- Remind to consult lawyer before /legal
- Platform: RÉSONANCE
- Fan exclusive area: ATELIER
- Full vision: DECISIONS.md north star only
