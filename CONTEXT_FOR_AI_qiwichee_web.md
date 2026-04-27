# Résonance — AI Context File
> Paste this at the start of any new conversation to resume instantly.

**Last updated:** 2026-04-26 — End of Session 1 (FINAL)
**Session duration:** ~12 hours
**Status:** Site is LIVE at qiwichee.vercel.app ✅
**Next session goal:** Replace default page with real Qiwichee landing page

---

## ⚠️ MVP RESET — READ FIRST

After review by a second AI (business/strategy),
the project was refocused to 3 modules only.
Full vision preserved in DECISIONS.md as north star.

```
FULL VISION: preserved in DECISIONS.md
BUILD NOW:   3 modules only
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

### /website (BUILD NEXT)
```
├── Bilingual FR/EN (next-i18n)
├── Music player (Songlink/Odesli)
├── Fan email signup (Mailchimp)
├── Simple CMS (Sanity — minimal)
└── Clean artist presentation
```

### /concerts (BUILD AFTER)
```
├── Create concert (date, venue, pay)
├── Public event page
├── Ticket link (Stripe — simple)
└── Attendee export
```

### /legal (KILLER FEATURE — BUILD LAST)
```
├── Legal structure question FIRST
│   (GUSO / CAE / Association / Company)
├── Pre-filled GUSO generation
├── Automatic CDDU generation
├── Intermittent hours tracker
│   ├── Hours earned
│   ├── Hours remaining (of 507)
│   ├── Deadline countdown
│   └── Alert when at risk
└── Legal compliance dashboard
⚠️ Consult entertainment lawyer before building
```

---

## 🚫 OUT OF SCOPE FOR MVP

Do NOT build or plan:
PR tools, influencer marketplace, studio/venue
marketplace, crowdfunding, sync licensing, band
marketplace, team roles, notifications engine,
analytics, AI suite, multi-tenant, marketplace
sides, SACEM automation, Redis, queues, Twilio,
event streaming, microservices.

---

## WHAT IS LIVE RIGHT NOW

```
✅ qiwichee.vercel.app — LIVE
   (showing default Next.js page)
   Auto-deploys on every git push

✅ github.com/bkark/qiwichee — code repository
✅ Mailchimp — Qiwichee Fans audience configured
✅ Sanity.io — project created (30-day trial, no card)
✅ All environment variables set in Vercel
```

---

## ENVIRONMENT VARIABLES (set in Vercel)

```
NEXT_PUBLIC_SANITY_PROJECT_ID  = bayrhx8r
NEXT_PUBLIC_SANITY_DATASET     = production
NEXT_PUBLIC_MAILCHIMP_AUDIENCE_ID = c5532d5f66
MAILCHIMP_API_KEY              = [private — in Vercel only]
```

---

## ABOUT THE ARTIST — QIWI CHEE

- **Name:** Qiwi Chee (ex Leï Lani 2019-2020)
- **Style:** Hybrid Pop — Franco-Algerian-American
- **Languages:** French and English
- **Current page:** msha.ke/qiwichee (keep alive)
- **Platforms:** Spotify, Deezer, Apple Music, YouTube,
  YouTube Music, Bandcamp, SoundCloud
- **EP:** "Hybrid Fruit"
- **Single:** "Une Dernière Chose"
- **Also does:** Voice acting — DO NOT mix with music site
- **Domain target:** qiwichee.com (OVH, not yet bought)
- **Status:** Not yet incorporated

---

## DEVELOPER

- **Background:** Telecom engineer learning web dev
- **Location:** Courbevoie, Île-de-France, France
- **OS:** Linux Mint
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
| Vercel | ✅ | Live, auto-deploys from GitHub |
| Mailchimp | ✅ | Audience ID: c5532d5f66 |
| Sanity.io | ✅ | Project ID: bayrhx8r, dataset: production |
| Supabase | ⏳ | Needed for /concerts module |
| Stripe | ⏳ | Simple ticket links only |
| OVH | ⏳ | qiwichee.com ~€7/year |

---

## REPOSITORY

- **GitHub:** https://github.com/bkark/qiwichee
- **Local:** /home/simba/qiwichee
- **Live URL:** https://qiwichee.vercel.app ✅
- **Framework:** Next.js 16.2.4, TypeScript, Tailwind
- **Branch:** main

---

## TECH STACK — MINIMAL

| Need | Tool | Status |
|---|---|---|
| Framework | Next.js | ✅ installed |
| Hosting | Vercel | ✅ live |
| CMS | Sanity | ✅ account created |
| Fan emails | Mailchimp | ✅ configured |
| Database | Supabase | ⏳ later |
| Payments | Stripe | ⏳ later |
| Bilingual | next-i18n | ⏳ next session |
| Domain | OVH | ⏳ later |

NO Redis, NO Twilio, NO queues, NO microservices.

---

## WHAT TO BUILD NEXT SESSION

```
Priority order:
1. Install next-i18n for bilingual support
2. Create src/locales/fr.json and en.json
3. Replace src/app/page.tsx with real landing page:
   ├── Qiwi Chee name and photo
   ├── Short bio (FR + EN toggle)
   ├── Links to Spotify, YouTube, Instagram,
   │   Facebook, Bandcamp, SoundCloud
   └── Fan email signup form → Mailchimp
4. Connect Sanity for content management
5. Push → auto-deploys to qiwichee.vercel.app
```

---

## LEGAL CONTEXT — CRITICAL

```
Non-incorporated artist CANNOT issue invoices.
Must ask legal structure first:
├── GUSO (venue employer) → most common
├── CAE → mission request
├── Association → contrat de prestation
└── Company → standard invoice

⚠️ Consult entertainment lawyer BEFORE
   building /legal module.
```

---

## BUILD PHASES

```
PHASE 1 — Website (NOW)
└── Real landing page on qiwichee.vercel.app

PHASE 2 — Concert manager (month 2)
└── /modules/concerts

PHASE 3 — Legal killer feature (months 3-4)
└── /modules/legal — lawyer first

PHASE 4 — Validate (month 5)
└── 5-10 artists, do they pay?

PHASE 5+ — Full Résonance vision
└── Only after validation
```

---

## FULL VISION — NORTH STAR

Complete Résonance vision in DECISIONS.md:
6-sided ecosystem, 14 features, full roadmap.
DO NOT BUILD until Phase 4 validates MVP.

---

## TWO AI ROLES

```
Claude (this AI) → Dev AI
└── Build the 3 modules step by step

Copilot → Business AI
└── Positioning, pricing, pitch deck,
    marketing, go-to-market strategy

Both work from this context file.
```

---

## RESUME LOCALLY

```bash
cd ~/qiwichee
npm run dev
```
Local: http://localhost:3000
Mobile: http://192.168.1.5:3000
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
- Explain WHY not just what — telecom analogies help
- One step at a time — wait for confirmation
- French legal context always matters
- Apple keyboard — View > Terminal in VS Code
- DO NOT suggest out-of-scope features
- DO NOT plan beyond 3 modules
- Remind user to consult lawyer before /legal
- Keep dependencies minimal
- Update this file every session
- Platform: RÉSONANCE
- Influencer side: AMPLIFICATEURS
- Full vision exists — north star only
- MVP first — validate before expanding
- Site is LIVE — every push deploys automatically
