# Qiwichee Project — AI Context File
> Paste this file at the start of any new conversation with Claude or any other AI chatbot to resume work instantly.

**Last updated:** 2026-04-26 — End of Session 1
**Session duration:** ~4 hours
**Next session goal:** Connect Vercel, deploy live, build landing page

---

## What You Are Helping With

I am building a professional artist website for **Qiwi Chee**, a Franco-Algerian-American hybrid pop singer-songwriter based in France. The goal is to build this progressively, starting free, with the ability to add a paid domain later without changing any code.

I am a telecom engineer (not a software developer) with some technical understanding. I am learning as I build. Please explain every step in detail, including what each command does and why. I want to understand, not just copy-paste.

---

## About The Artist

- **Artist name:** Qiwi Chee (previous stage name: Leï Lani)
- **Style:** Hybrid Pop — Franco-Algerian-American singer-songwriter
- **Languages:** French and English (website must be fully bilingual)
- **Current web presence:** msha.ke/qiwichee (Milkshake page — keep alive during transition)
- **Music platforms:** Spotify, Deezer, Apple Music, YouTube, YouTube Music, Bandcamp, SoundCloud
- **EP:** "Hybrid Fruit"
- **Latest single:** "Une Dernière Chose"
- **Also does:** Voice acting (separate income stream — do NOT mix with music site)
- **Target domain:** qiwichee.com (to be bought at OVH when ready — not yet purchased)

---

## My Setup

- **OS:** Linux Mint (Ubuntu/Debian based)
- **Machine:** Laptop with SSD, ~45GB free on home partition
- **Keyboard:** Apple aluminum adapted for Linux (some shortcuts differ — use View > Terminal in VS Code instead of Ctrl+`)
- **Browser:** Chrome
- **Location:** Courbevoie, France (Île-de-France)
- **Node.js:** v22.22.2
- **npm:** 10.9.7
- **Git:** 2.34.1
- **VS Code:** 1.117.0 (updated session 1)
- **Vercel CLI:** 52.0.0
- **GitHub CLI (gh):** 2.4.0 (older version from Ubuntu repos — requires `gh auth setup-git` before git push)

---

## Accounts

| Service | Status | Details |
|---|---|---|
| GitHub | ✅ Connected | Username: bkark |
| Vercel | ✅ Account created | Connected to GitHub — not yet linked to project |
| Mailchimp | ⏳ To create | Free up to 500 contacts — homework before next session |
| Stripe | ⏳ Later | For ticket payments |
| OVH | ⏳ Later | For domain purchase (~€7/year) |

---

## Project Repository

- **GitHub:** https://github.com/bkark/qiwichee
- **Local path:** /home/simba/qiwichee
- **Temporary URL:** qiwichee.vercel.app (not yet connected — first task next session)
- **Framework:** Next.js 16.2.4 with TypeScript and Tailwind CSS
- **Branch:** main
- **Last commit:** 998d38a — "Initial project setup with Next.js, documentation and decision log"

---

## Tech Stack Decisions

| Need | Tool | Reason |
|---|---|---|
| Framework | Next.js | Portable, free hosting, built-in bilingual support |
| Hosting | Vercel free tier | Auto-deploys from GitHub on every push |
| Domain registrar | OVH (when ready) | French company, euros, GDPR compliant |
| Fan emails | Mailchimp free | Up to 500 contacts free |
| Payments | Stripe | Per-transaction fee, no monthly cost |
| Merch | Printful | Print on demand, zero inventory |
| Crowdfunding | Ko-fi | Free tier available |
| Bilingual | next-i18n | FR/EN toggle, content in JSON files |

---

## Architecture Decisions

- Music site (qiwichee.com) is **completely separate** from voice acting portfolio
- Content stored in **JSON files** (not a database) for portability
- No database for now — static content only
- Domain bought at **OVH, not Vercel** — keeps domain independent from host
- Milkshake page stays alive during transition to avoid losing traffic
- Long terminal pastes use `cat > file.md << 'ENDOFFILE'` pattern (avoids clipboard issues)

---

## Business Context

- Artist not yet incorporated
- Plan: start as **auto-entrepreneur** to bill immediately (voice acting income)
- Move to **SASU** when professional expenses (instruments, studio) justify deductions
- Auto-entrepreneur does NOT allow expense deductions — important limitation
- Need **comptable spécialisé spectacle** before incorporating (not a generic accountant)
- **SACEM** registration for music royalties is separate from company structure
- **Intermittent du spectacle** status may apply — needs specialist advice
- Voice acting funds music career until concerts become profitable

---

## Two Separate Brands, One Legal Entity (future)

```
Legal entity (future SASU)
├── qiwichee.com — music, concerts, merch, fan club
└── [voice-acting-site].com — portfolio for casting directors
```

---

## Project Files Already Created

```
qiwichee/
├── README.md          — project overview, stack, accounts, how to run
├── DECISIONS.md       — all decisions with reasoning and todo list
├── CONTEXT_FOR_AI.md  — this file, saved in repo for easy access
├── src/app/
│   ├── page.tsx       — currently default Next.js page (to be replaced)
│   ├── layout.tsx     — page wrapper
│   └── globals.css    — global styles
├── public/            — static files (images go here)
├── package.json       — project dependencies
└── next.config.ts     — Next.js configuration
```

---

## What Was Accomplished In Session 1 (2026-04-26)

- ✅ Diagnosed and fixed npm global permissions on Linux Mint
- ✅ Configured Git identity (name and email)
- ✅ Installed Vercel CLI (v52.0.0)
- ✅ Installed GitHub CLI (gh v2.4.0)
- ✅ Created Next.js project with TypeScript and Tailwind
- ✅ Written README.md and DECISIONS.md
- ✅ Made first Git commit (998d38a)
- ✅ Authenticated GitHub CLI
- ✅ Created GitHub repository (github.com/bkark/qiwichee)
- ✅ Pushed code to GitHub successfully
- ✅ System fully updated, 4GB freed by removing old kernels
- ✅ Created this CONTEXT_FOR_AI.md file

---

## What To Do Next (In Order)

```
NEXT SESSION:
├── 1. Connect GitHub repo to Vercel (5 minutes)
├── 2. Get site live at qiwichee.vercel.app (automatic)
├── 3. Create Mailchimp account (homework — do before session)
├── 4. Replace default Next.js page with real landing page
├── 5. Add bilingual FR/EN toggle
└── 6. Add Mailchimp fan email signup form

SOON:
├── Music page (embed YouTube, platform links)
├── Shows/concerts page
└── Install next-i18n for proper bilingual routing

LATER:
├── Buy qiwichee.com at OVH (~€7/year)
├── Point domain to Vercel (DNS change only, no code change)
├── Set up Stripe for ticket payments
├── Build merch page with Printful
├── Build voice acting portfolio (separate site)
└── Consult accountant before incorporating
```

---

## How To Resume Working Locally

```bash
cd ~/qiwichee
npm run dev
```
Site runs at http://localhost:3000
Also accessible on local network at http://192.168.1.5:3000 (useful for mobile testing)

---

## Git Workflow (Save And Push Changes)

```bash
git add .
git status                        # review what changed
git commit -m "What and why"      # write a meaningful message
git push                          # Vercel auto-deploys after this
```

---

## How To Update This File

At the end of each work session tell Claude:
> "We're done for today, please update the CONTEXT_FOR_AI.md file"

Then download the updated file and run:
```bash
cp ~/Downloads/CONTEXT_FOR_AI.md ~/qiwichee/CONTEXT_FOR_AI.md
git add .
git commit -m "Update AI context file - session [date]"
git push
```

---

## Important Notes For The AI

- **Explain every command** — user is learning, not just building
- **Explain the why**, not just the what — telecom analogies are helpful
- **Go step by step** — one thing at a time, wait for confirmation before next step
- **French context matters** — GDPR, OVH, French legal structure, euros
- **Apple keyboard on Linux** — use View > Terminal in VS Code, not Ctrl+`
- **Paste long content** via terminal using `cat > file << 'ENDOFFILE'` pattern
- **gh CLI is version 2.4.0** — run `gh auth setup-git` if git push fails with auth error
- **User is in Courbevoie, Île-de-France, France**
- **Do not mix** music site and voice acting — they are separate brands
- **Update this file** at the end of every session with timestamp and progress
