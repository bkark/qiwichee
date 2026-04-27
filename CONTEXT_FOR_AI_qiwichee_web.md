# Qiwichee Project — AI Context File
> Paste this file at the start of any new conversation with Claude or any other AI
> chatbot to resume work instantly.

**Last updated:** 2026-04-26 — End of Session 1 (full)
**Session duration:** ~10 hours
**Next session goal:** Connect Vercel, deploy live, build landing page

---

## CRITICAL — TWO PARALLEL PROJECTS

```
Project 1 — Qiwichee website (building now)
└── Proof of concept, first client, real artist

Project 2 — Résonance platform (designing now, building progressively)
└── Five-sided SaaS marketplace for independent artists
    Qiwichee is the first artist on the platform
```

Build every Qiwichee feature with Résonance architecture in mind.

---

## ABOUT THE DEVELOPER

- **Background:** Telecom engineer (not software developer)
- **Learning:** Learning web development while building
- **Approach:** Explain every command, concept and decision
- **Analogies:** Telecom analogies very helpful
- **Location:** Courbevoie, Île-de-France, France
- **Vision:** Qiwichee → template → Résonance SaaS → marketplace
- **Architecture preference:** Microservices (modular monolith first)

---

## ABOUT THE ARTIST — QIWI CHEE

- **Artist name:** Qiwi Chee (previous stage name: Leï Lani 2019-2020)
- **Style:** Hybrid Pop — Franco-Algerian-American singer-songwriter
- **Languages:** French and English (fully bilingual FR/EN)
- **Current web presence:** msha.ke/qiwichee (keep alive during transition)
- **Music platforms:** Spotify, Deezer, Apple Music, YouTube, YouTube Music,
  Bandcamp, SoundCloud
- **EP:** "Hybrid Fruit"
- **Latest single:** "Une Dernière Chose"
- **Also does:** Voice acting (primary income — DO NOT mix with music site)
- **Target domain:** qiwichee.com (buy at OVH — not yet purchased)
- **Status:** Not yet incorporated

---

## DEVELOPER MACHINE SETUP

- **OS:** Linux Mint (Ubuntu/Debian based)
- **Storage:** ~45GB free on /home, ~70GB on Main_HDD
- **RAM:** ~16GB
- **Keyboard:** Apple aluminum adapted for Linux
  → Use View > Terminal in VS Code (not Ctrl+`)
  → Long pastes: `cat > file << 'ENDOFFILE'` pattern
- **Browser:** Chrome
- **Node.js:** v22.22.2
- **npm:** 10.9.7 (global packages in ~/.npm-global)
- **Git:** 2.34.1
- **VS Code:** 1.117.0
- **Vercel CLI:** 52.0.0
- **GitHub CLI:** 2.4.0 (run `gh auth setup-git` if push fails)
- **Dual boot:** Linux Mint + Windows on same machine

---

## ACCOUNTS

| Service | Status | Details |
|---|---|---|
| GitHub | ✅ Connected | Username: bkark |
| Vercel | ✅ Created | Connected to GitHub — not yet linked to project |
| Mailchimp | ✅ Configured | bassim.karkachi@gmail.com |
| Mailchimp Audience | ✅ Ready | Qiwichee Fans, ID: c5532d5f66 |
| Mailchimp API key | ✅ Generated | Store privately — NEVER in GitHub |
| Stripe | ⏳ Later | Payments + band splitting (Stripe Connect) |
| OVH | ⏳ Later | Domain qiwichee.com (~€7/year) |
| Sanity.io | ⏳ Later | CMS — create account before next session |
| YouSign | ⏳ Later | Electronic signatures for CDDU |
| Supabase | ⏳ Later | PostgreSQL database (free tier) |
| Upstash | ⏳ Later | Redis cache and queues (free tier) |
| Twilio | ⏳ Later | SMS notifications |

---

## MAILCHIMP CONFIGURATION

- **Audience name:** Qiwichee Fans
- **Audience ID:** c5532d5f66
- **Double opt-in:** Enabled ✅
- **GDPR fields:** Enabled ✅
- **reCAPTCHA:** Enabled ✅
- **From name:** Qiwi Chee
- **API key:** stored privately — never commit to GitHub

---

## QIWICHEE PROJECT REPOSITORY

- **GitHub:** https://github.com/bkark/qiwichee
- **Local path:** /home/simba/qiwichee
- **Temporary URL:** qiwichee.vercel.app (not yet connected)
- **Framework:** Next.js 16.2.4 with TypeScript and Tailwind CSS
- **Branch:** main
- **Last commit:** 8c04b4a — "Add Amplificateurs, microservices, Mailchimp config"

---

## TECH STACK

| Need | Tool | Reason |
|---|---|---|
| Framework | Next.js | Portable, bilingual, free hosting |
| Hosting | Vercel free | Auto-deploys from GitHub |
| Domain | OVH (later) | French, euros, GDPR |
| Fan emails | Mailchimp | Already configured |
| Payments | Stripe | Per-transaction only |
| Merch | Printful | Print on demand |
| Crowdfunding | Built-in (Stripe) | Own the experience |
| CMS | Sanity.io | Visual editor for artist |
| Bilingual | next-i18n | JSON content files |
| E-signature | YouSign | French, GDPR, for CDDU |
| Database | Supabase | Free PostgreSQL |
| Cache/Queue | Upstash Redis | Free tier |
| SMS | Twilio | Notifications |

---

## ARCHITECTURE — MODULAR MONOLITH FIRST

### Three Phases
```
PHASE 1 — Modular Monolith (now → 10 artists)
└── One Next.js app, modules mirror future services
    Each module: own folder, own DB tables,
    own API routes, interfaces only (no direct DB access)

PHASE 2 — Extract First Services (10-50 artists)
└── Notification service, AI service, Legal service

PHASE 3 — Full Microservices (50+ artists, funded)
└── Docker, Kubernetes, AWS/GKE, Kafka/Redis streaming
```

### Communication Patterns
```
REST API — synchronous calls between modules
Message Queue — async fire and forget
Event Streaming — one emits, many listen (most powerful)

Example: concert.confirmed event triggers:
├── Legal module → generate GUSO
├── SACEM module → prepare declaration
├── Fan module → send email blast
├── Notification module → alert band members
├── Influencer module → notify local influencers
└── Analytics module → update metrics
```

### 13 Modules
```
/modules/auth          — login, JWT, roles, permissions
/modules/artist        — profiles, subscriptions, multi-tenant
/modules/website       — page rendering, bilingual, CMS
/modules/fans          — email, SMS, fan pool, consent
/modules/concerts      — events, tickets, QR codes
/modules/legal         — GUSO, CDDU, intermittent, SACEM
/modules/finance       — invoices, splitting, crowdfunding
/modules/influencers   — profiles, matching, impact tracking
/modules/pr            — press releases, media DB, submissions
/modules/ai            — Claude API, generators
/modules/analytics     — dashboards, ROI, geography
/modules/notifications — smart routing, escalation, channels
/modules/team          — roles, invitations, band management
/modules/projects      — project cards, tasks, activity feed
```

---

## RÉSONANCE — COMPLETE PLATFORM VISION

### Platform Name: RÉSONANCE
### Influencer Side Name: AMPLIFICATEURS

### The Five Sides
```
1. ARTISTS — pay subscription, get complete platform
2. FANS — free, discover, buy tickets, fund productions
3. VENUES — pay listing, fill empty dates
4. STUDIOS & REHEARSAL SPACES — pay listing
5. AMPLIFICATEURS — influencers, free/paid tiers
```

### The Network Effects
```
More artists → bigger fan pool → more valuable for fans
More artists → more bookings → venues want listing
More artists → more recording → studios want listing
More artists → better content → amplificateurs want access
More amplificateurs → more reach → more valuable for artists
Crowdfunders share projects → viral loops → more fans
Each side reinforces all others → compound growth
```

---

## COMPLETE FEATURE MAP

### 🌐 PRESENCE
- Bilingual website FR/EN
- Smart music player (Songlink/Odesli — all platforms)
- AI press kit generator
- Social media card generator
- Voice acting portfolio (separate site)

### 👥 FANS
- Email list (Mailchimp)
- SMS list (Twilio)
- Cross-artist fan pool (GDPR consent)
- Fan membership/club
- Concert demand detector

### 🎪 CONCERTS
- Event management and ticketing (Stripe)
- Venue marketplace
- GUSO declaration auto-generated
- CDDU contract + YouSign
- Intermittent du spectacle hours tracker
- Band payment splitting (Stripe Connect)
- QR code tickets

### 🎵 RIGHTS & ROYALTIES
- SACEM registration assistant
- Automatic setlist declaration
- Venue SACEM compliance tracker
- Royalty tracking dashboard
- ADAMI declaration assistant
- Co-writer split management

### 📣 PR & MEDIA
- AI press release generator (FR + EN)
- Media database (collective intelligence)
- Smart targeting by genre/market
- Automated PR timeline
- Radio submission assistant
- Collective radio plugger (mutualized)
- Spotify/Deezer playlist pitching
- Festival submission tracker with deadline alerts
- Press coverage tracker
- Sync licensing marketplace (10-15% commission)

### 📱 AMPLIFICATEURS
- Influencer profiles and discovery
- Smart artist-influencer matching by genre/location
- Collaboration request management
- Press copy and press pass distribution
- Concert promotion to local influencers
- Impact tracking (streams, fans, revenue per collab)
- ROI measurement per collaboration
- Mutual promotion pool
- Verified badge system
- Nano/micro/mid/macro tier handling

### 💰 PRODUCTION & FINANCE
- Production cost calculator (templates per project type)
- AI budget advisor
- Crowdfunding campaigns with backer journey
- Presale system
- Invoice generation (2.1% VAT live performance)
- Band payment splitting (Stripe Connect)
- Portage salarial via CAE partner
- Year-end financial report (DGFiP format)

### ⚖️ LEGAL & COMPLIANCE
- Intermittent du spectacle 507h tracker
- Hours counting rules applied automatically
- GUSO submission before each concert
- CDDU per performance + YouSign
- France Travail file at 507h
- AUDIENS integration
- URSSAF social charge calculations

### 🎸 BAND BUILDING
- Open position listings (bassist, drummer, etc.)
- Musician profiles with audio samples
- Availability calendars
- Rehearsal space marketplace
- Band management dashboard
- Shared calendar and setlist manager
- Rehearsal cost splitting (automatic)
- Band expense tracking
- Map view of local musicians
- Multi-band support (musician in multiple bands)

### 👥 TEAM & ROLES
- Role-based access control
- Invitation system with role assignment
- Permission matrix (owner/manager/band member/
  editor/accountant/collaborator/read-only)
- Each person sees only what their role allows
- Band member sees own payments, contracts, hours
- Accountant sees financials only
- Access revocation anytime
- Temporary access with expiry (collaborators)

### 📊 PROJECT MANAGEMENT
- Project cards (concerts, recordings, campaigns)
- Visual progress tracking per project
- Task assignment per team member
- Overdue task alerts with escalation
- Team availability confirmation
- Activity feed (shared timeline)
- Overview timeline (all projects in one view)
- Smart escalation (push → email → SMS → manager alert)

### 🔔 NOTIFICATIONS
- Channels: in-platform, email, push, SMS
- Per-user notification preferences
- Smart routing by role and relevance
- Escalation for no-response (1 day → 3 days → 5 days)
- Notification matrix:
  - Owner: everything
  - Manager: everything except billing
  - Band member: their concerts, rehearsals, payments, docs
  - Accountant: financial only
  - Backer: milestones, exclusive content, rewards
  - Fan: concerts, releases, campaigns
  - Amplificateur: matching artists, press, city concerts
  - Venue: booking requests, confirmations
  - Studio: booking requests, confirmations

### 🎗️ CROWDFUNDER JOURNEY
- Backer number assigned (#23 feels special)
- Personal welcome from artist
- Backer dashboard (progress, exclusive content, rewards)
- Milestone notifications (25%, 50%, 75%, 100%)
- Exclusive behind-the-scenes updates (studio photos, previews)
- Early listening access (48h before public)
- Reward delivery tracking
- Post-project relationship maintenance
- Backers → highest quality leads for fan pool
- Viral loop: backers share → friends back → campaign grows

### Backer Tiers Example
```
€5   — Digital supporter (download + updates)
€15  — Credited (name in credits + behind scenes)
€30  — Inner circle (early access + private message)
€100 — Founding supporter (signed copy + listening session)
€500 — Executive producer (studio visit + lifetime membership)
```

### 🤝 REFERRAL & GROWTH
- Unique referral link per artist
- Warm introduction emails (personalized, from artist)
- Reward tiers:
  - Profile completed: 1 month free
  - Stays 3 months: 3 months free
  - Upgrades to paid: 10% lifetime discount
  - 5+ referrals: Founding Artist badge + 6 months free
- Ambassador program (10+ referrals):
  - Free Complete tier
  - 10% commission on referred artist revenue
  - Early feature access
  - Annual Résonance gathering invitation
- Referral leaderboard (opt-in)
- One-click sharing (WhatsApp, Instagram, Email)
- Referral analytics

### 🤖 AI TOOLS (Claude API)
- Bio writer (FR + EN)
- Press release generator
- Concert announcement (social posts both languages)
- Budget advisor and reality check
- PR timeline generator
- Royalty gap detector
- Influencer pitch writer
- Backer update writer (milestone messages)
- Setlist suggestion based on venue/audience

---

## REVENUE MODEL

### Artist Subscriptions
```
Starter:   €60/month  — website + fans + basic invoicing
Pro:       €100/month — + pool + SACEM + PR + amplificateurs
Complete:  €150/month — + intermittent + GUSO + finance + team
Managed:   €300/month — + dedicated manager + accountant review
```

### Other Recurring
```
Venue listing:          €30-80/month
Studio listing:         €30-80/month
Amplificateur premium:  €20-30/month
Rehearsal space listing: €20-50/month
```

### Transactions
```
Ticket commission:           3-5%
Venue booking:               5-8%
Studio/rehearsal booking:    5-8%
Sync licensing:              10-15%
Crowdfunding:                3%
Influencer collaboration:    5-10% (on paid deals >€100)
Equipment rental:            10%
Session musician booking:    5%
```

### Setup
```
Artist onboarding: €500-2,500
```

---

## COMPETITIVE MOATS

```
1. Fan pool — impossible without scale
2. Crowdfunder viral loops — organic growth engine
3. Referral network — artists recruit artists
4. Amplificateur impact data — improves matching over time
5. Collective media intelligence — smarter with every artist
6. Intermittent du spectacle system — deep French law
7. SACEM/ADAMI integration — French music industry
8. Artist switching cost — everything in one place
9. French/GDPR compliance — US competitors can't replicate
10. Francophone market — 300M people, no equivalent exists
```

---

## BUILD PHASES

```
PHASE 1 — Qiwichee proof of concept (NOW)
├── Website live on Vercel
├── Bilingual FR/EN
├── Fan email signup (Mailchimp)
├── Music player (Songlink)
├── Concert/events page
└── Sanity CMS

PHASE 2 — Legal & compliance (months 2-3)
├── GUSO + CDDU + YouSign
├── Intermittent hours tracker
├── SACEM declaration
└── Basic financial reporting

PHASE 3 — Team & projects (months 3-4)
├── Role-based access control
├── Band member invitations
├── Project cards and task management
├── Notification system
└── Crowdfunder journey

PHASE 4 — Multi-tenant + amplificateurs (months 4-5)
├── Modular architecture refactored
├── 2-3 more artists onboarded free
├── Amplificateur profiles and matching
├── Fan pool foundation
└── Impact tracking

PHASE 5 — PR & media tools (months 5-6)
├── Press release AI generator
├── Media database
├── Radio submission assistant
└── Festival deadline tracker

PHASE 6 — Marketplace (months 6-8)
├── Venue listings
├── Studio + rehearsal space listings
├── Band building marketplace
├── Fan pool activated
└── First commissions earned

PHASE 7 — Partner conversations (month 6+)
├── 5+ artists on platform with working demo
├── CAE for portage salarial
├── Expert-comptable partnership
├── CNM funding application
└── SACEM API partnership

PHASE 8 — Scale (year 2)
├── Self-serve onboarding
├── Sync licensing marketplace
├── Francophone expansion (Belgium, Quebec, Africa)
└── Consider investment
```

---

## IMMEDIATE NEXT STEPS

```
Before next session:
└── Create Sanity.io account (free, use GitHub login)

Next coding session:
├── 1. Connect GitHub to Vercel
├── 2. Deploy qiwichee.vercel.app
├── 3. Store Mailchimp API key in Vercel env vars
├── 4. Replace default page with landing page
├── 5. Add bilingual FR/EN toggle
└── 6. Add fan email signup → Mailchimp

Questions to ask Qiwichee:
├── Are you intermittent du spectacle?
├── Are your songs registered with SACEM?
├── How painful is CDDU/GUSO currently?
├── Would you pay €100/month for this?
└── Do you know 3-5 other artists with same problems?

Business actions:
├── Write one-page concept note for Résonance
├── Talk to 5 independent artists (validate)
├── Talk to 2-3 venues (validate)
└── Consult entertainment lawyer (intermittent feature)
```

---

## HOW TO RESUME LOCALLY

```bash
cd ~/qiwichee
npm run dev
```
Site: http://localhost:3000
Mobile test: http://192.168.1.5:3000

---

## GIT WORKFLOW

```bash
git add .
git status
git commit -m "What and why"
git push
```
If push fails: `gh auth setup-git` then retry.

---

## HOW TO UPDATE THIS FILE

End of session say: "please update the context file"
Then download and run:
```bash
cp ~/Downloads/CONTEXT_FOR_AI_qiwichee_web.md \
   ~/qiwichee/CONTEXT_FOR_AI_qiwichee_web.md
git add .
git commit -m "Update AI context - session [date]"
git push
```

---

## INSTRUCTIONS FOR THE AI

- Explain every command — user learns while building
- Explain WHY not just what — telecom analogies help
- One step at a time — wait for confirmation
- French context always matters (GDPR, OVH, French law)
- Apple keyboard on Linux — View > Terminal in VS Code
- Long pastes: `cat > file << 'ENDOFFILE'` pattern
- gh CLI v2.4.0 — `gh auth setup-git` if push fails
- Never mix music site and voice acting
- Build Qiwichee WITH Résonance architecture in mind
- Modular monolith now — microservices later
- Modules never access each other's database directly
- Update this file every session with new timestamp
- Platform name: RÉSONANCE
- Influencer side name: AMPLIFICATEURS
- Emotional design principle: make everyone feel like
  an insider not a customer
