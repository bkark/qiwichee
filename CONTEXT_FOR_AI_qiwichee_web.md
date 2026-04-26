# Qiwichee Project — AI Context File
> Paste this file at the start of any new conversation with Claude or any other AI
> chatbot to resume work instantly.

**Last updated:** 2026-04-26 — End of Session 1 (extended)
**Session duration:** ~8 hours
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
- **Vision:** Qiwichee site → template → Résonance platform → SaaS business
- **Architecture preference:** Microservices (start modular monolith, extract later)

---

## ABOUT THE ARTIST — QIWI CHEE

- **Artist name:** Qiwi Chee (previous stage name: Leï Lani 2019-2020)
- **Style:** Hybrid Pop — Franco-Algerian-American singer-songwriter
- **Languages:** French and English (website fully bilingual FR/EN)
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
| Mailchimp | ✅ Created | bassim.karkachi@gmail.com |
| Mailchimp Audience | ✅ Created | Qiwichee Fans, ID: c5532d5f66 |
| Mailchimp API key | ✅ Generated | Store privately — never in GitHub |
| Stripe | ⏳ Later | Payments + band splitting |
| OVH | ⏳ Later | Domain qiwichee.com (~€7/year) |
| Sanity.io | ⏳ Later | CMS for content management |
| YouSign | ⏳ Later | Electronic signatures for CDDU |

---

## MAILCHIMP CONFIGURATION

- **Account email:** bassim.karkachi@gmail.com
- **Audience name:** Qiwichee Fans
- **Audience ID:** c5532d5f66
- **Double opt-in:** Enabled ✅
- **GDPR fields:** Enabled ✅
- **reCAPTCHA:** Enabled ✅
- **From name:** Qiwi Chee
- **API key:** [stored privately — never commit to GitHub]
- **Free tier:** 250 contacts max

---

## QIWICHEE PROJECT REPOSITORY

- **GitHub:** https://github.com/bkark/qiwichee
- **Local path:** /home/simba/qiwichee
- **Temporary URL:** qiwichee.vercel.app (not yet connected)
- **Framework:** Next.js 16.2.4 with TypeScript and Tailwind CSS
- **Branch:** main
- **Last commit:** 0f22da2 — "Update README and DECISIONS with full Resonance vision"

### Files In Project
```
qiwichee/
├── README.md                       — project overview
├── DECISIONS.md                    — all decisions + todo
├── CONTEXT_FOR_AI_qiwichee_web.md  — this file
├── src/app/
│   ├── page.tsx                    — default page (to replace)
│   ├── layout.tsx                  — page wrapper
│   └── globals.css                 — global styles
├── public/                         — images go here
├── package.json                    — dependencies
└── next.config.ts                  — Next.js config
```

---

## TECH STACK — QIWICHEE SITE

| Need | Tool | Reason |
|---|---|---|
| Framework | Next.js | Portable, bilingual, free hosting |
| Hosting | Vercel free | Auto-deploys from GitHub |
| Domain | OVH (later) | French, euros, GDPR |
| Fan emails | Mailchimp | Already configured |
| Payments | Stripe | Per-transaction only |
| Merch | Printful | Print on demand |
| Crowdfunding | Ko-fi | Free tier |
| CMS | Sanity.io | Visual editor for artist |
| Bilingual | next-i18n | JSON content files |
| E-signature | YouSign | French, GDPR, for CDDU |
| Database | Supabase | Free tier PostgreSQL |
| Cache/Queue | Upstash Redis | Free tier |

---

## ARCHITECTURE DECISION — MODULAR MONOLITH FIRST

### Developer's Vision
Microservices architecture where semi-agnostic services communicate
via APIs. Independent scaling per service. Fault isolation.
Reusable services across future projects (musicians, painters, etc.)

### Agreed Approach — Three Phases

```
PHASE 1 — Modular Monolith (now → first 10 artists)
└── One Next.js app organized in modules
    mirroring future service boundaries:
    ├── /modules/auth
    ├── /modules/artist
    ├── /modules/fans
    ├── /modules/concerts
    ├── /modules/legal
    ├── /modules/finance
    ├── /modules/pr
    ├── /modules/influencers
    └── /modules/ai
    Each module: own folder, own DB tables,
    own API routes, communicates via defined interfaces

PHASE 2 — Extract First Services (10-50 artists)
└── Extract services that need independent scaling:
    ├── Notification service (email blast spikes)
    ├── AI service (rate limiting needed)
    └── Legal document service (CPU intensive)

PHASE 3 — Full Microservices (50+ artists, funded)
└── Full split, Docker containers, Kubernetes
    AWS ECS or GKE, Redis/Kafka event streaming
    API gateway, CloudFront CDN
```

### Communication Patterns
```
REST API — synchronous (service A calls B, waits)
Message Queue — asynchronous (fire and forget)
Event Streaming — broadcast (one emits, many listen)
```

### Key Rule
```
Never access another module's database directly
Always communicate through defined interfaces
This makes future extraction clean
```

### Reusability Across Projects
```
Future project (painters, restaurants, etc.):
Reuses: Auth, Website, Fan, Finance,
        Notification, Analytics, AI services
Adapts: Domain-specific services only
Result: New vertical in 4-5 months not 18
```

---

## RÉSONANCE — COMPLETE PLATFORM VISION

### What It Is
A five-sided SaaS marketplace for independent artists
in France and the francophone world.

### The Five Sides

```
1. ARTISTS — the core
   Pay subscription, get complete platform

2. FANS — the audience
   Free, discover artists, buy tickets, fund productions

3. VENUES — the spaces
   Pay listing, receive bookings, fill empty dates

4. STUDIOS — the production
   Pay listing, fill empty studio time, get bookings

5. INFLUENCERS — the amplifiers (new)
   Free basic, paid premium, discover + promote artists
```

### The Network Effects
```
More artists → bigger fan pool → more valuable for fans
More artists → more bookings → venues want listing
More artists → more recording → studios want listing
More artists → better content → influencers want access
More influencers → more reach → more valuable for artists
Each side reinforces all others → compound growth
```

### The Fan Pool — Core Differentiator
```
Fans opt in explicitly (GDPR compliant)
Platform matches fans to similar artists
Artists reach beyond their own audience
Pool grows with every new artist
Impossible to replicate without scale
```

### The Influencer Side (Fifth Side)

#### Who Are Influencers On This Platform
```
├── Social media music accounts (TikTok, Instagram, YouTube)
├── Music bloggers and newsletter writers
├── Spotify/Deezer playlist curators (independent)
├── Podcast hosts (music discovery, interviews)
├── Content creators who use music
└── Local scene influencers (city-level tastemakers)
```

#### Influencer Profile Contains
```
├── Platforms and verified follower counts
├── Genre specialties (primary + secondary)
├── Languages and location
├── Audience demographics
├── Content types they create
├── Collaboration preferences and pricing
└── Past collaborations and impact portfolio
```

#### How Matching Works
```
Artist releases single:
└── Platform suggests matching influencers by:
    ├── Genre affinity
    ├── Audience overlap with artist's fans
    ├── Location (for concert promotion)
    ├── Language match
    └── Past collaboration success rate

Influencer logs in:
└── Platform shows emerging artists matching their taste
    before they blow up (tastemaker value)
```

#### Impact Tracking
```
Unique tracking link per influencer per campaign:
├── Clicks from their post
├── New fan signups attributed
├── Streams generated
├── Tickets sold
└── Revenue attributed

Artist sees ROI per influencer collaboration
Influencer sees their impact dashboard
Platform improves matching with this data
```

#### Concert Promotion To Influencers
```
Concert announced:
├── Local influencers in city notified automatically
├── Genre-matching influencers notified
├── Press passes offered through platform
└── Playlist curators pitched the single
```

#### Influencer Tiers
```
Nano (1k-10k): High engagement, often free, perfect for emerging artists
Micro (10k-100k): Sweet spot, €50-500/collaboration
Mid-tier (100k-500k): Significant reach, €500-2,000
Macro (500k+): Platform facilitates introduction only
```

#### Influencer Business Model
```
Free tier: Profile, discovery, press copies, press passes
Premium (€20-30/month):
├── Priority placement in artist searches
├── Early access to releases
├── Verified badge
├── Impact analytics
└── Access to emerging artists exclusively

Collaboration facilitation fee: 5-10% on paid deals above €100
```

### Mutualized Resources (Collective Intelligence)
```
All artists share:
├── Media database (grows with every coverage logged)
├── Collective radio plugger network
├── Influencer impact data (anonymized)
├── Festival deadline calendar
├── Equipment rental pool
├── Session musician pool
├── Transport pooling for regional tours
└── Photographer/videographer pool
```

---

## COMPLETE FEATURE MAP — RÉSONANCE

### 🌐 PRESENCE
- Bilingual website FR/EN (Next.js)
- Smart music player (Songlink/Odesli API — all platforms)
- AI press kit generator
- Social media card generator (auto-sized per platform)
- Voice acting portfolio (separate site, same platform)

### 👥 FANS
- Email list (Mailchimp)
- SMS list (Twilio)
- Cross-artist fan pool (explicit GDPR consent)
- Fan membership/club
- Concert demand detector

### 🎪 CONCERTS
- Event management and self-managed ticketing (Stripe)
- Venue marketplace (commission on bookings)
- GUSO declaration auto-generated per concert
- CDDU contract auto-generated + YouSign
- Intermittent du spectacle hours tracker
- Band payment splitting (Stripe Connect)
- QR code tickets generation and validation

### 🎵 RIGHTS & ROYALTIES
- SACEM registration assistant
- Automatic setlist declaration after each concert
- Venue SACEM compliance tracker
- Royalty tracking dashboard
- ADAMI declaration assistant (neighboring rights)
- Co-writer split management
- Future: SACEM API partnership

### 📣 PR & MEDIA
- AI press release generator (FR + EN)
- Media database (collective intelligence)
- Smart targeting by genre and market
- Automated PR timeline (8 weeks before → post-release)
- Radio submission assistant (per-station requirements)
- Collective radio plugger network (mutualized)
- Spotify/Deezer playlist pitching
- Festival submission tracker with deadline alerts
- Press coverage tracker and clipping generator
- Sync licensing marketplace (10-15% commission)

### 📱 INFLUENCERS
- Influencer profiles and discovery
- Smart artist-influencer matching
- Collaboration request management
- Press copy and press pass distribution
- Concert promotion to local influencers
- Impact tracking (streams, fans, revenue per collaboration)
- ROI measurement dashboard for artists
- Mutual promotion pool
- Verified badge system

### 💰 PRODUCTION & FINANCE
- Production cost calculator (templates: single, EP, album,
  concert, music video)
- AI budget advisor (flags unrealistic costs)
- Crowdfunding campaigns (fans see what their money funds)
- Presale system
- Invoice generation (correct VAT: 2.1% live performance)
- Band payment splitting (Stripe Connect)
- Portage salarial via CAE partner
- Year-end financial report (DGFiP formatted)

### ⚖️ LEGAL & COMPLIANCE (France Specific)
- Intermittent du spectacle 507h tracker
- Hours counting rules (performance vs rehearsal vs recording)
- GUSO submission before each concert
- CDDU per performance (YouSign)
- France Travail file preparation at 507h
- AUDIENS integration
- URSSAF social charge calculations

### 🎙️ RESOURCES MARKETPLACE
- Recording studio listings
- Session musician pool
- Equipment rental between artists
- Photographer/videographer pool
- Graphic designer pool
- Transport pooling

### 🤖 AI TOOLS (Claude API)
- Bio writer (FR + EN)
- Press release generator
- Concert announcement (social posts both languages)
- Budget advisor and reality check
- PR timeline generator
- Royalty gap detector
- Influencer pitch writer

---

## REVENUE MODEL — RÉSONANCE

### Artist Subscriptions
```
Starter: €60/month — website + fans + basic invoicing
Pro: €100/month — + pool + SACEM + PR + influencer DB
Complete: €150/month — + intermittent + GUSO + finance
Managed: €300/month — + dedicated manager + accountant
```

### Venue & Studio
```
Venue listing: €30-80/month
Studio listing: €30-80/month
```

### Influencer
```
Premium influencer: €20-30/month
Collaboration facilitation: 5-10% on paid deals
```

### Transactions
```
Ticket commission: 3-5%
Venue booking: 5-8%
Studio booking: 5-8%
Sync licensing: 10-15%
Crowdfunding: 3%
```

### Setup
```
Artist onboarding: €500-2,500
```

---

## COMPETITIVE MOATS

```
1. Fan pool — impossible to replicate without scale
2. Influencer impact data — grows and improves over time
3. Collective media intelligence — smarter with every artist
4. Intermittent du spectacle system — deep French law knowledge
5. SACEM/ADAMI integration — French music industry relationships
6. Artist switching cost — everything in one place
7. French/GDPR compliance — US competitors cannot replicate
8. Francophone market — 300M people, France + Belgium +
   Switzerland + Quebec + West Africa + North Africa
```

---

## BUILD PHASES

```
PHASE 1 — Qiwichee proof of concept (NOW)
├── Website live on Vercel
├── Bilingual FR/EN
├── Fan email signup (Mailchimp connected)
├── Music player with Songlink
├── Concert/events page
└── Sanity CMS

PHASE 2 — Legal & compliance tools (months 2-3)
├── GUSO declaration generator
├── CDDU + YouSign
├── Intermittent hours tracker
├── SACEM setlist declaration
└── Basic financial reporting

PHASE 3 — Multi-tenant + influencers (months 3-4)
├── Modular architecture refactored
├── 2-3 more artists onboarded free
├── Influencer profiles and matching
├── Fan pool foundation
└── Impact tracking

PHASE 4 — PR & media tools (months 4-5)
├── Press release AI generator
├── Media database
├── Radio submission assistant
└── Festival deadline tracker

PHASE 5 — Marketplace (months 5-7)
├── Venue listings
├── Studio listings
├── Fan pool activated
└── First commissions

PHASE 6 — Partner conversations (month 6+)
├── 5+ artists on platform with working demo
├── CAE for portage salarial
├── Expert-comptable partnership
├── CNM funding application
└── SACEM API partnership

PHASE 7 — Scale (year 2)
├── Self-serve onboarding
├── Sync licensing marketplace
├── Francophone expansion
└── Consider investment
```

---

## MICROSERVICES MODULES (Build Order)

```
/modules/auth          — login, JWT, roles
/modules/artist        — profiles, subscriptions, multi-tenant
/modules/website       — page rendering, bilingual, CMS
/modules/fans          — email list, SMS, fan pool, consent
/modules/concerts      — events, tickets, QR codes
/modules/legal         — GUSO, CDDU, intermittent, SACEM
/modules/finance       — invoices, splitting, crowdfunding
/modules/influencers   — profiles, matching, impact tracking
/modules/pr            — press releases, media DB, submissions
/modules/ai            — Claude API calls, generators
/modules/analytics     — dashboards, ROI, geography
/modules/notifications — email, SMS, webhooks, alerts
```

---

## IMMEDIATE NEXT STEPS

```
Next coding session:
├── 1. Connect GitHub to Vercel
├── 2. Deploy qiwichee.vercel.app
├── 3. Store Mailchimp API key in Vercel env vars
├── 4. Replace default page with landing page
├── 5. Add bilingual FR/EN toggle
└── 6. Add fan email signup → Mailchimp

Questions to ask Qiwichee:
├── Are you intermittent du spectacle?
├── How do you track your hours currently?
├── Are your songs registered with SACEM?
├── How painful is CDDU/GUSO for you?
├── Would you pay €100/month for this tool?
└── Do you know 3-5 other artists with same problems?

Business actions (when ready):
├── Write one-page concept note for Résonance
├── Talk to 5 independent artists (validate)
├── Talk to 2-3 venues (validate)
├── Consult entertainment lawyer (intermittent feature)
└── Research CNM funding for music tech innovation
```

---

## HOW TO RESUME LOCALLY

```bash
cd ~/qiwichee
npm run dev
```
Site: http://localhost:3000
Mobile: http://192.168.1.5:3000

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

End of session: "please update the context file"
Then:
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
- Influencer side name: TBD (considering Amplificateurs, Voix)
