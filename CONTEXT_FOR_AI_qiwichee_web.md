# Résonance — AI Context File
> Paste this at the start of any new conversation to resume instantly.

**Last updated:** 2026-04-26 — Session 1 (MVP Reset)
**Next session goal:** Connect Vercel, deploy Qiwichee landing page

---

## ⚠️ IMPORTANT — MVP RESET

After review by a second AI (business/strategy role),
the project has been refocused. The full Résonance vision
is preserved as a north star in DECISIONS.md but the
BUILD scope is now strictly limited to 3 modules.

```
FULL VISION: preserved in DECISIONS.md
BUILD NOW:   3 modules only (see below)
```

---

## TWO PARALLEL TRACKS

```
Track 1 — BUILD (now)
└── Qiwichee website + MVP features
    3 modules, laser focused

Track 2 — VISION (north star, build later)
└── Full Résonance 6-sided ecosystem
    Everything designed in session 1
    Only built after MVP is validated
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

## MVP = THREE MODULES ONLY

### Module 1 — /website
```
├── Bilingual FR/EN (next-i18n)
├── Music player (Songlink/Odesli)
├── Fan email signup (Mailchimp)
├── Simple CMS (Sanity — minimal schema)
└── Clean artist presentation
```

### Module 2 — /concerts
```
├── Create concert (date, venue, pay)
├── Public event page
├── Ticket link (Stripe — simple)
├── Attendee export
└── Data source for legal automation
```

### Module 3 — /legal (THE KILLER FEATURE)
```
├── Legal structure question FIRST:
│   GUSO / CAE / Association / Company
├── Pre-filled GUSO form generation
├── Automatic CDDU generation
├── Intermittent du spectacle tracker:
│   ├── Hours earned
│   ├── Hours remaining (of 507)
│   ├── Deadline countdown
│   └── Alert when status at risk
└── Legal compliance dashboard
```

---

## 🚫 OUT OF SCOPE FOR MVP

DO NOT BUILD OR PLAN:
- PR tools
- Influencer marketplace
- Studio/venue marketplace
- Crowdfunding
- Sync licensing
- Band marketplace
- Team roles
- Notifications engine
- Analytics dashboards
- AI suite
- Multi-tenant SaaS
- Marketplace sides
- Complex finance tools
- SACEM automation
- Redis / queues / event streaming
- Microservices

These come ONLY after MVP is validated
by real paying artists.

---

## TARGET USER (MVP ONLY)

```
Independent French artist who:
├── Is NOT incorporated
│   (no company, no auto-entreprise)
├── Performs small concerts occasionally
├── Is at risk of losing intermittent status
├── Is overwhelmed by GUSO/CDDU/URSSAF paperwork
└── Needs a simple professional online presence
```

---

## LEGAL CONTEXT — CRITICAL FOR /legal MODULE

```
Non-incorporated artist CANNOT issue invoices.
Payment received only via:
├── GUSO (venue as employer) — most common
├── CAE/portage salarial — more complex
├── Association loi 1901 — requires setup
└── Company (SASU) — full incorporation

Platform MUST ask legal structure first.
Each structure triggers different workflow:
├── Venue employer → GUSO + CDDU
├── CAE → mission request to CAE
├── Association → contrat de prestation
└── Company → standard invoice

⚠️ IMPORTANT: Consult entertainment lawyer
BEFORE launching /legal module.
Getting intermittent hours wrong = real harm to artist.
```

---

## ABOUT THE DEVELOPER

- **Background:** Telecom engineer (not software developer)
- **Learning:** Learning web development while building
- **Approach:** Explain every command, concept, decision
- **Analogies:** Telecom analogies very helpful
- **Location:** Courbevoie, Île-de-France, France

---

## ABOUT THE ARTIST — QIWI CHEE

- **Name:** Qiwi Chee (ex Leï Lani 2019-2020)
- **Style:** Hybrid Pop — Franco-Algerian-American
- **Languages:** French and English
- **Current page:** msha.ke/qiwichee (keep alive)
- **Platforms:** Spotify, Deezer, Apple Music, YouTube,
  YouTube Music, Bandcamp, SoundCloud
- **EP:** "Hybrid Fruit" / **Single:** "Une Dernière Chose"
- **Also does:** Voice acting — DO NOT mix with music site
- **Domain target:** qiwichee.com (OVH, not yet bought)
- **Status:** Not yet incorporated

---

## DEVELOPER MACHINE

- **OS:** Linux Mint (Ubuntu/Debian)
- **Keyboard:** Apple aluminum adapted for Linux
  → View > Terminal in VS Code (not Ctrl+`)
  → Long pastes: `cat > file << 'ENDOFFILE'`
- **Browser:** Chrome
- **Node.js:** v22.22.2
- **npm:** 10.9.7 (~/.npm-global)
- **Git:** 2.34.1
- **VS Code:** 1.117.0
- **Vercel CLI:** 52.0.0
- **GitHub CLI:** 2.4.0 (gh auth setup-git if push fails)

---

## ACCOUNTS

| Service | Status | Details |
|---|---|---|
| GitHub | ✅ | bkark |
| Vercel | ✅ | Connected to GitHub, not yet linked |
| Mailchimp | ✅ | Qiwichee Fans, ID: c5532d5f66 |
| Mailchimp API | ✅ | Generated — store privately |
| Supabase | ⏳ | Create before /concerts module |
| Sanity.io | ⏳ | Create before next session |
| Stripe | ⏳ | Simple ticket links only |
| OVH | ⏳ | qiwichee.com ~€7/year |

---

## REPOSITORY

- **GitHub:** https://github.com/bkark/qiwichee
- **Local:** /home/simba/qiwichee
- **URL:** qiwichee.vercel.app (not yet connected)
- **Framework:** Next.js 16.2.4, TypeScript, Tailwind
- **Branch:** main

---

## TECH STACK — MINIMAL

| Need | Tool | Notes |
|---|---|---|
| Framework | Next.js | Already installed |
| Hosting | Vercel free | Auto-deploys |
| Database | Supabase | Free PostgreSQL |
| CMS | Sanity | Minimal schema only |
| Fan emails | Mailchimp | Already configured |
| Payments | Stripe | Simple links only |
| Bilingual | next-i18n | JSON files |
| Domain | OVH later | Not yet |

NO Redis, NO Twilio, NO YouSign yet,
NO queues, NO event streaming.

---

## ARCHITECTURE

```
Modular monolith (Next.js)
Three modules mirroring future services:

/src/modules/website/
/src/modules/concerts/
/src/modules/legal/

Rules:
├── Modules never access each other's DB directly
├── Communication through defined interfaces only
├── Keep it simple — no premature abstraction
└── Build for today, structure for tomorrow
```

---

## BUILD PHASES — REVISED

```
PHASE 1 — Qiwichee website (NOW — 2-3 weeks)
└── /modules/website live on Vercel
    Bilingual, music player, fan signup

PHASE 2 — Concert manager (month 2)
└── /modules/concerts working
    Create events, ticket links, attendee list

PHASE 3 — Legal killer feature (months 3-4)
└── /modules/legal working
    ⚠️ Consult lawyer FIRST
    GUSO, CDDU, intermittent tracker

PHASE 4 — Validate (month 5)
└── Show to 5-10 real artists
    Do they pay? → continue
    They don't? → pivot

PHASE 5 — Multi-tenant (month 6+)
└── Only after validation with paying users

PHASE 6+ — Full Résonance vision
└── Fan pool, amplificateurs, PR tools,
    marketplaces — only with proven demand
```

---

## NEXT IMMEDIATE STEPS

```
Before next session:
└── Create Sanity.io account (free, GitHub login)

Next coding session:
├── 1. Connect GitHub to Vercel
├── 2. Deploy qiwichee.vercel.app
├── 3. Store Mailchimp API key in Vercel env vars
├── 4. Replace default page with landing page
├── 5. Add bilingual FR/EN toggle
└── 6. Add fan email signup → Mailchimp

Business actions (parallel):
├── Talk to 5 independent artists (validate pain)
├── Talk to entertainment lawyer (legal module)
├── Write one-page concept note
└── Continue business planning with Copilot
```

---

## FULL VISION — PRESERVED (north star)

The complete Résonance vision designed in session 1
is preserved in DECISIONS.md. It includes:

```
6-sided ecosystem:
├── Artists
├── Fans
├── Venues
├── Studios
├── Amplificateurs (influencers)
└── Talents (art management students)

Features designed (build later):
├── Fan pool (cross-artist discovery)
├── PR and media tools
├── SACEM/ADAMI automation
├── Crowdfunding with backer journey
├── Band building marketplace
├── Referral and ambassador program
├── Content import from existing platforms
├── Project management and notifications
├── Team roles and permissions
└── TikTok viral engine
```

Build none of this until Phase 4 validation succeeds.

---

## RESUME LOCALLY

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
- Explain WHY not just what — telecom analogies help
- One step at a time — wait for confirmation
- French legal context always matters
- Apple keyboard on Linux — View > Terminal
- DO NOT suggest out-of-scope features
- DO NOT plan beyond 3 modules for now
- Remind user to consult lawyer before /legal module
- Keep dependencies minimal
- Update this file every session
- Platform name: RÉSONANCE
- Emotional design: insider not customer
- Full vision exists — reference DECISIONS.md
- MVP first — validate before expanding
