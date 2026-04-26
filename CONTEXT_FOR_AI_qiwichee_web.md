# Qiwichee Project — AI Context File
> Paste this file at the start of any new conversation with Claude or any other AI
> chatbot to resume work instantly.

**Last updated:** 2026-04-26 — End of Session 1
**Session duration:** ~6 hours
**Next session goal:** Connect Vercel, deploy live, build landing page

---

## IMPORTANT — TWO PARALLEL PROJECTS

This conversation covers two interconnected things:

```
Project 1 — Qiwichee website (building now)
└── Proof of concept, first client, real artist

Project 2 — Résonance platform (designing now, building later)
└── Multi-tenant SaaS platform for independent artists
    Qiwichee is the first artist on the platform
```

Always keep both in mind when building. Every decision for
Qiwichee should be made with Résonance architecture in mind.

---

## ABOUT THE DEVELOPER

- **Background:** Telecom engineer (not software developer)
- **Learning:** Learning web development while building this project
- **Approach:** Explain every command, every concept, every decision
- **Analogies:** Telecom analogies are very helpful
- **Location:** Courbevoie, Île-de-France, France
- **Goal:** Build Qiwichee site → extract as template → build Résonance platform
- **Business vision:** Web agency for artists + SaaS platform + marketplace

---

## ABOUT THE ARTIST — QIWI CHEE

- **Artist name:** Qiwi Chee (previous stage name: Leï Lani 2019-2020)
- **Style:** Hybrid Pop — Franco-Algerian-American singer-songwriter
- **Languages:** French and English (website must be fully bilingual FR/EN)
- **Current web presence:** msha.ke/qiwichee (Milkshake — keep alive during transition)
- **Music platforms:** Spotify, Deezer, Apple Music, YouTube, YouTube Music,
  Bandcamp, SoundCloud
- **EP:** "Hybrid Fruit"
- **Latest single:** "Une Dernière Chose"
- **Also does:** Voice acting (primary income source — DO NOT mix with music site)
- **Target domain:** qiwichee.com (to buy at OVH — not yet purchased)
- **Status:** Not yet incorporated

---

## DEVELOPER MACHINE SETUP

- **OS:** Linux Mint (Ubuntu/Debian based)
- **Machine:** Laptop with SSD
- **Storage:** ~45GB free on /home, ~70GB free on Main_HDD
- **RAM:** ~16GB
- **Keyboard:** Apple aluminum adapted for Linux
  → Use View > Terminal in VS Code instead of Ctrl+`
  → Long pastes use `cat > file << 'ENDOFFILE'` pattern
- **Browser:** Chrome (with React Developer Tools to install)
- **Node.js:** v22.22.2
- **npm:** 10.9.7 (global packages in ~/.npm-global)
- **Git:** 2.34.1
- **VS Code:** 1.117.0
- **Vercel CLI:** 52.0.0
- **GitHub CLI (gh):** 2.4.0 (old version — run `gh auth setup-git` if push fails)
- **Also on machine:** Windows (dual boot), older Linux Mint 20.3 partition on /dev/sda5

---

## ACCOUNTS

| Service | Status | Details |
|---|---|---|
| GitHub | ✅ Connected | Username: bkark |
| Vercel | ✅ Created | Connected to GitHub — not yet linked to project |
| Mailchimp | ⏳ To create | Free up to 500 contacts — do before next session |
| Stripe | ⏳ Later | Ticket payments + band payment splitting |
| OVH | ⏳ Later | Domain qiwichee.com (~€7/year) |
| Sanity.io | ⏳ Later | CMS for content management |
| SACEM | ⏳ Later | Qiwi Chee needs to register songs |
| ADAMI | ⏳ Later | Neighboring rights for performer |

---

## QIWICHEE PROJECT REPOSITORY

- **GitHub:** https://github.com/bkark/qiwichee
- **Local path:** /home/simba/qiwichee
- **Temporary URL:** qiwichee.vercel.app (not yet connected)
- **Framework:** Next.js 16.2.4 with TypeScript and Tailwind CSS
- **Branch:** main
- **Last commit:** 119864e — "Add AI context file with session 1 timestamp"

### Files Already Created
```
qiwichee/
├── README.md                      — project overview
├── DECISIONS.md                   — all decisions with reasoning
├── CONTEXT_FOR_AI_qiwichee_web.md — this file
├── src/app/
│   ├── page.tsx                   — default Next.js page (to replace)
│   ├── layout.tsx                 — page wrapper
│   └── globals.css                — global styles
├── public/                        — static files
├── package.json                   — dependencies
└── next.config.ts                 — Next.js config
```

---

## TECH STACK DECISIONS — QIWICHEE SITE

| Need | Tool | Reason |
|---|---|---|
| Framework | Next.js | Portable, free hosting, bilingual support |
| Hosting | Vercel free tier | Auto-deploys from GitHub on push |
| Domain registrar | OVH (when ready) | French, euros, GDPR compliant |
| Fan emails | Mailchimp free | Up to 500 contacts |
| Payments | Stripe | Per-transaction, no monthly fee |
| Merch | Printful | Print on demand, zero inventory |
| Crowdfunding | Ko-fi | Free tier |
| Bilingual | next-i18n | FR/EN JSON files |
| CMS | Sanity.io | Visual editor for non-technical artist |
| Electronic signature | YouSign | French, GDPR compliant, for CDDU contracts |

---

## ARCHITECTURE DECISIONS

- Music site completely separate from voice acting portfolio
- Content in JSON files for portability — no database for v1
- Domain at OVH, not Vercel — keep domain independent from host
- Milkshake page stays alive during transition
- Build with Résonance multi-tenant architecture in mind from day one
- Use environment variables for all client-specific config
- One action in platform triggers multiple automated outcomes

---

## BUSINESS CONTEXT — QIWI CHEE

- Not yet incorporated
- Plan: auto-entrepreneur to start billing immediately (voice acting)
- Move to SASU when expenses justify deductions
- Auto-entrepreneur does NOT allow expense deductions — key limitation
- Need comptable spécialisé spectacle (not generic accountant)
- SACEM registration for music royalties — separate from company structure
- Intermittent du spectacle status — critical for income, needs proper tracking
- Voice acting funds music career until concerts become profitable

### Two Separate Brands, One Legal Entity (future)
```
Future SASU
├── qiwichee.com — music, concerts, merch, fan club
└── [voiceacting].com — portfolio for casting directors
```

---

## RÉSONANCE — THE PLATFORM VISION

### What It Is
A complete multi-tenant SaaS platform for independent artists in France
and the francophone world. Qiwichee is the proof of concept and first client.

### The Problem It Solves
Independent artists are underserved — they need:
- A professional web presence
- Fan relationship management (owning their audience)
- Concert booking and ticketing
- Legal compliance (intermittent, GUSO, CDDU)
- Rights management (SACEM, ADAMI)
- PR and media outreach
- Production financing
- Accounting assistance
- All of this is currently fragmented across 10+ tools

### The Four-Sided Marketplace
```
ARTISTS (pay subscription)
└── Get website, tools, fan management, legal help

FANS (free)
└── Discover artists, buy tickets, fund productions

VENUES (pay listing fee)
└── Fill empty dates, receive booking requests

STUDIOS (pay listing fee)
└── Fill empty studio time, receive recording bookings
```

### The Fan Pool — Core Differentiator
```
Each artist brings their fans into a shared pool
├── Fans opt in explicitly (GDPR compliant)
├── Platform matches fans to similar artists
├── Artists reach beyond their own audience
├── Pool grows with every new artist
└── Network effect: more artists = more valuable pool
```

### Multi-Tenant Architecture
```
One Next.js application serves all artists
├── qiwichee.com → Qiwi Chee's site
├── artist2.com → Artist 2's site
└── artist3.com → Artist 3's site

Each domain shows different content/branding
Same codebase, same infrastructure
New client = clone template + customize = deploy
```

### Mutualized Resources
Artists share resources none could afford alone:
- Collective radio plugger network
- Shared media database (collective intelligence)
- Equipment rental pool between artists
- Session musician pool
- Transport pooling for regional tours
- Shared graphic designer/photographer pool

---

## COMPLETE FEATURE MAP — RÉSONANCE

### 🌐 PRESENCE
- Bilingual website FR/EN (Next.js)
- Smart music player (all platforms via Songlink/Odesli API)
- AI press kit generator
- Social media card generator (auto-sized for each platform)
- Voice acting portfolio (separate site, same platform)

### 👥 FANS
- Email list (Mailchimp integration)
- SMS list (Twilio)
- Cross-artist fan pool (with explicit GDPR consent)
- Fan membership/club (Ko-fi or Patreon integration)
- Concert demand detector (fans request city, artist sees demand before booking)

### 🎪 CONCERTS
- Event management and ticketing (Stripe)
- Venue marketplace (venues pay to list, platform takes commission)
- GUSO declaration — auto-generated for each concert
- CDDU contract — auto-generated, electronically signed (YouSign)
- Intermittent du spectacle hours tracker and dashboard
- Band payment splitting (Stripe Connect)
- QR code ticket generation and validation

### 🎵 RIGHTS & ROYALTIES
- SACEM registration assistant (guided form, correct format)
- Automatic setlist declaration after each concert
- Venue SACEM compliance tracker (alerts if venue didn't declare)
- Royalty tracking dashboard (expected vs received)
- ADAMI declaration assistant (neighboring rights for performers)
- Co-writer split management (documented, dispute prevention)
- SCPP/SPPF awareness for producers

### 📣 PR & MEDIA
- AI press release generator (FR + EN, professional format)
- Media database (collective intelligence, grows with platform)
- Smart targeting by genre, market, language
- Automated PR timeline with tasks (8 weeks before release to post-release)
- Radio submission assistant (per-station requirements)
- Collective radio plugger network (mutualized)
- Spotify/Deezer playlist pitching assistant
- Festival submission tracker with deadline reminders
- Press coverage tracker and clipping generator
- Sync licensing marketplace (music in film/TV/ads)

### 💰 PRODUCTION & FINANCE
- Production cost calculator (concert, EP, album, music video templates)
- AI budget advisor (flags unrealistic costs)
- Crowdfunding campaigns (fans see exactly what their money funds)
- Presale system (sell before production)
- Invoice generation (legally compliant, correct VAT)
- Band payment splitting (Stripe Connect)
- Portage salarial coordination (via CAE partner)
- Year-end financial report (ready for tax declaration)
- URSSAF social charge calculations

### 🎙️ RESOURCES MARKETPLACE
- Recording studio listings (studios pay commission)
- Session musician pool
- Equipment rental between artists
- Photographer/videographer pool
- Graphic designer pool
- Transport pooling for tours

### 🤖 AI TOOLS (Claude API)
- Bio writer (FR + EN)
- Press release generator
- Concert announcement generator (social posts in both languages)
- Budget advisor and reality check
- PR timeline generator
- Royalty gap detector (flags unclaimed royalties)
- Lyric translation assistant

---

## LEGAL & COMPLIANCE FEATURES (France Specific)

### Intermittent du Spectacle
- 507 hours tracker with rolling 12-month window
- Hours counting rules applied automatically
  (performance vs rehearsal vs recording vs teaching)
- CDDU contract auto-generation per performance
- GUSO submission before each concert
- France Travail file preparation when 507h reached
- AUDIENS integration for pension/health
- Alerts when artist is at risk of losing status

### SACEM Integration
- Song registration guidance and form generation
- Setlist declaration automation
- ISWC code management per song
- Venue compliance monitoring
- Quarterly royalty payment tracking
- ADAMI declaration (separate from SACEM)
- Future: SACEM API partnership for direct submission

### Accounting Assistance
- Invoice generation with correct VAT (2.1% live performance)
- GUSO pre-filled declarations
- CAE/portage salarial coordination (partner)
- Year-end income/expense report by category
- Formatted for DGFiP (French tax authority)
- Integration with Shine or Qonto (neobanks for professionals)

---

## REVENUE MODEL — RÉSONANCE

### Recurring Revenue
```
Artist subscriptions:
├── Starter: €60/month — website + fan list + basic invoicing
├── Pro: €100/month — + pool access + SACEM + PR tools
├── Complete: €150/month — + intermittent + GUSO + finance tools
└── Managed: €300/month — + dedicated manager + accountant review

Venue listings: €30-80/month
Studio listings: €30-80/month
```

### Transaction Revenue
```
Concert ticket commission: 3-5%
Venue booking commission: 5-8%
Studio booking commission: 5-8%
Sync licensing commission: 10-15%
Crowdfunding: 3% (or 0% as differentiator vs Kickstarter)
```

### Promotion Revenue
```
Fan pool campaigns: €15-50 per campaign
Featured placement: €20-50/month
Collective radio plugger: included in Pro tier
```

### Setup Revenue
```
Artist onboarding: €500-2,500 depending on complexity
```

---

## COMPETITIVE ADVANTAGES (MOATS)

1. **Fan pool** — grows with every artist, impossible to replicate without scale
2. **Venue/studio network** — switching cost once integrated
3. **Intermittent du spectacle system** — requires deep French law knowledge
4. **SACEM/ADAMI integration** — requires French music industry relationships
5. **Collective media intelligence** — gets smarter with every artist
6. **Artist switching cost** — fan list, history, contracts all in one place
7. **French/GDPR compliance** — US competitors cannot easily replicate
8. **Francophone market** — France + Belgium + Switzerland + Quebec + Africa

---

## BUILD PHASES

```
PHASE 1 — Qiwichee proof of concept (NOW)
├── Website live on Vercel
├── Bilingual FR/EN
├── Fan email signup (Mailchimp)
├── Music player with Songlink
├── Concert/events page
└── Sanity CMS for content

PHASE 2 — Legal & compliance tools (months 2-3)
├── GUSO declaration generator
├── CDDU contract generator
├── Intermittent hours tracker
├── SACEM setlist declaration
└── Basic financial reporting

PHASE 3 — Multi-tenant extraction (months 3-4)
├── Architecture refactored for multiple artists
├── 2-3 more artists onboarded free
├── Fan pool foundation
└── Validate concept with real users

PHASE 4 — PR & media tools (months 4-5)
├── Press release generator (AI)
├── Media database launched
├── Radio submission assistant
└── Festival deadline tracker

PHASE 5 — Marketplace (months 5-7)
├── Venue listings live
├── Studio listings live
├── First commissions earned
└── Fan pool activated

PHASE 6 — Partner conversations (month 6+)
├── Working demo with 5+ artists
├── Approach CAE for portage salarial
├── Approach expert-comptable
├── Apply for CNM funding
└── SACEM API partnership discussion

PHASE 7 — Scale (year 2)
├── Self-serve artist onboarding
├── Sync licensing marketplace
├── Francophone expansion (Belgium, Quebec, Africa)
└── Consider investment/funding
```

---

## IMMEDIATE NEXT STEPS

```
Before next coding session:
└── Create Mailchimp account (free, mailchimp.com)

Next coding session:
├── 1. Connect GitHub to Vercel
├── 2. Deploy qiwichee.vercel.app
├── 3. Replace default page with real landing page
├── 4. Add bilingual FR/EN toggle
└── 5. Add fan email signup form

Questions to ask Qiwichee:
├── Are you currently intermittent du spectacle?
├── How do you currently track your hours?
├── Have you registered your songs with SACEM?
├── How painful is the CDDU/GUSO process?
├── Would you pay €100/month for a tool handling all this?
└── Do you know 3-5 other artists with same problems?
```

---

## HOW TO RESUME WORKING LOCALLY

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
git commit -m "What you did and why"
git push
```
Vercel auto-deploys on every push.
If push fails: run `gh auth setup-git` first.

---

## HOW TO UPDATE THIS FILE

At end of each session say: "please update the context file"
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

- Explain every command — user is learning while building
- Explain the WHY not just the what
- One step at a time — wait for confirmation before next step
- Telecom analogies are very helpful
- French context always matters (GDPR, OVH, French law, euros)
- Apple keyboard on Linux — use View > Terminal in VS Code
- Long terminal pastes use `cat > file << 'ENDOFFILE'` pattern
- gh CLI v2.4.0 — run `gh auth setup-git` if git push fails
- Never mix music site and voice acting — separate brands
- Build Qiwichee site WITH Résonance multi-tenant architecture in mind
- Update this file at end of every session with new timestamp
- The platform name is RÉSONANCE
