# Qiwichee Project — Decision Log
Last updated: 2026-04-26 — Session 1

## Project Vision
Started as artist website for Qiwi Chee.
Evolved into proof of concept for Résonance —
a full SaaS platform for independent artists in France.

## Platform Name
RÉSONANCE — works identically in French and English,
music metaphor, implies connection between artists and fans.

## Stack Decisions
- Framework: Next.js — portable, free hosting, bilingual
- Hosting: Vercel free tier — auto-deploys from GitHub
- Domain registrar: OVH — French, euros, GDPR compliant
- Fan emails: Mailchimp free tier (500 contacts)
- Payments: Stripe — per transaction, no monthly fee
- Merch: Printful — print on demand, zero inventory
- Crowdfunding: Ko-fi free tier
- CMS: Sanity.io — visual editor for non-technical artists
- Bilingual: next-i18n with JSON content files
- Electronic signature: YouSign — French, GDPR compliant

## Architecture Decisions
- Music site separate from voice acting portfolio
- Content in JSON files — no database for v1
- Domain at OVH not Vercel — keep independent from host
- Build with multi-tenant architecture in mind from day one
- Environment variables for all client-specific config
- One concert entry triggers multiple automated actions

## Business Decisions
- Qiwichee is proof of concept and first client
- Template extracted after Qiwichee — becomes Résonance
- Auto-entrepreneur to start, SASU when expenses justify it
- Need comptable specialise spectacle before incorporating
- Keep Milkshake page alive during transition
- Buy domain at OVH not Vercel

## Two Separate Brands (Qiwichee)
- qiwichee.com — music, concerts, merch, fan club
- separate voice acting portfolio site
- same legal entity bills for both

## Résonance Platform Decisions
- Four-sided marketplace: artists, fans, venues, studios
- Fan pool with explicit GDPR consent opt-in
- Collective radio plugger — mutualized resource
- Collective media database — grows with every artist
- Intermittent du spectacle tracking — core differentiator
- SACEM and ADAMI integration — French music law
- GUSO and CDDU automation per concert
- Portage salarial via CAE partner (not built in-house)
- Legal advice NOT provided — platform assists only
- Sync licensing marketplace — 10-15% commission

## Pricing Model (Résonance)
- Starter: 60 EUR/month
- Pro: 100 EUR/month
- Complete: 150 EUR/month
- Managed: 300 EUR/month
- Setup fee: 500-2500 EUR per artist

## Domain Strategy
- Target: qiwichee.com
- Registrar: OVH (French, euros, GDPR)
- Temporary: qiwichee.vercel.app
- Never buy domain from hosting provider

## Environment
- OS: Linux Mint
- Node: v22.22.2
- npm: 10.9.7
- Git: 2.34.1
- VS Code: 1.117.0
- Vercel CLI: 52.0.0
- GitHub CLI: 2.4.0

## Accounts
- GitHub: bkark
- Vercel: connected to GitHub
- Mailchimp: to create
- Stripe: later
- Sanity: later
- OVH: later

## Todo
- [ ] Create Mailchimp account
- [ ] Connect GitHub to Vercel
- [ ] Deploy qiwichee.vercel.app
- [ ] Build bilingual landing page
- [ ] Add fan email signup
- [ ] Install Sanity CMS
- [ ] Build concert/events page
- [ ] GUSO declaration generator
- [ ] CDDU contract generator
- [ ] Intermittent hours dashboard
- [ ] SACEM setlist declaration
- [ ] Press release AI generator
- [ ] Media database
- [ ] Multi-tenant architecture
- [ ] Fan pool with consent layer
- [ ] Venue marketplace
- [ ] Studio marketplace
- [ ] Buy qiwichee.com at OVH
- [ ] Approach CAE for portage salarial
- [ ] Apply for CNM funding
- [ ] Talk to 5 artists to validate
- [ ] Talk to 2-3 venues
- [ ] Consult entertainment lawyer for intermittent feature

## Updates — Session 1 Extended (2026-04-26)

### New Decisions

- Platform name confirmed: RÉSONANCE
- Influencer side name confirmed: AMPLIFICATEURS
- Fifth marketplace side added: Influencers
- Architecture: Modular monolith first, microservices later
- 12 modules defined mirroring future service boundaries
- Modules never access each other's database directly
- Communication via defined interfaces only
- Supabase for PostgreSQL database (free tier)
- Upstash Redis for caching and queues (free tier)
- YouSign for electronic signatures (French, GDPR)
- Mailchimp configured: Audience ID c5532d5f66
- Double opt-in and GDPR fields enabled on Mailchimp

### Résonance Five Sides
- Artists: pay subscription, get complete platform
- Fans: free, discover, buy, fund
- Venues: pay listing, fill empty dates
- Studios: pay listing, fill empty studio time
- Amplificateurs: free basic, paid premium, promote artists

### Architecture Phases
- Phase 1: Modular monolith (now to 10 artists)
- Phase 2: Extract notification, AI, legal services
- Phase 3: Full microservices on AWS/GKE when funded


## Updates — Session 1 Part 2 (2026-04-26)

### New Features Designed

- Band building marketplace (open positions, musician profiles)
- Rehearsal space marketplace (extends studio marketplace)
- Band management dashboard (schedule, payments, documents)
- Multi-band support (musician belongs to multiple bands)
- Rehearsal cost splitting (automatic via Stripe)
- Role-based access control (owner/manager/band member/
  editor/accountant/collaborator/read-only)
- Team invitation system with role assignment
- Permission matrix (each role sees only what they need)
- Project management (project cards, tasks, activity feed)
- Smart notification system (13 notification types,
  per-user preferences, smart escalation)
- Crowdfunder journey (backer number, exclusive content,
  milestone updates, behind the scenes access)
- Crowdfunder viral loop (backers share → friends back)
- Referral system (unique links, warm introductions)
- Ambassador program (10+ referrals = free Complete tier)
- Founding Artist badge (permanent recognition)

### Emotional Design Principle
Make every person feel like an insider not a customer:
- Crowdfunders: backer number, studio photos, early access
- Band members: their own dashboard, their own data
- Fans: concert demand detector, presale access
- Amplificateurs: early artist discovery, tastemaker value

### Notification Escalation Rules
- Day 1: push notification
- Day 3: email sent
- Day 5: SMS sent
- Day 6: manager alerted

### Backer Tiers
- €5: digital supporter
- €15: credited supporter
- €30: inner circle (early access)
- €100: founding supporter (signed copy + session)
- €500: executive producer (studio visit + lifetime)

### Modules Added
- /modules/team — roles, invitations, band management
- /modules/projects — project cards, tasks, activity feed
- Total modules: 14

## MVP RESET — Session 1 Final (2026-04-26)

### Decision: Scope Reset After External Review
A second AI reviewed the full vision and gave
brutally honest feedback. Key findings accepted:

- We were building 8 startups simultaneously
- 14 modules is enterprise architecture for a solo dev
- Network effects don't exist at 1-10 artists
- Legal automation is high risk — needs lawyer first
- Non-incorporated artists cannot issue invoices
- Must ask legal structure before ANY payment workflow

### What We Agreed With
- Full vision is correct as north star
- Modular monolith approach is correct
- GUSO + CDDU + Intermittent = killer feature
- French legal complexity = unfair advantage
- Emotional design principle = brilliant
- Build phases were too ambitious

### What We Partially Disagreed With
- Sanity overkill: disagree for multi-artist template
- Full crowdfunding complex: simple presale is fine later
- Vision being wrong: vision is right, TIMING was wrong

### New MVP Definition
THREE MODULES ONLY:
1. /website — bilingual, player, fan signup, CMS
2. /concerts — events, tickets, attendee list
3. /legal — GUSO, CDDU, intermittent tracker (KILLER)

### Legal Payment Workflow Decision
Non-incorporated artist workflow:
- Cannot issue invoices legally
- Platform MUST ask legal structure first
- GUSO (venue employer) → most common for MVP
- CAE / Association / Company → later phases
- Consult entertainment lawyer before building /legal

### Out Of Scope Until Phase 4 Validation
PR tools, influencers, crowdfunding, marketplaces,
SACEM automation, Redis, queues, event streaming,
microservices, team roles, analytics, AI suite,
multi-tenant, notifications engine.

### Validation Gate (Phase 4)
Show working MVP to 5-10 real artists.
If they pay → continue building.
If they don't → pivot one feature.
Do not expand scope without this validation.

### Business Planning
Separate track with Copilot AI:
- Positioning and messaging
- Pricing strategy
- Investor narrative
- Market validation plan
- Go-to-market strategy

## Session 1 Final Update (2026-04-26)

### Milestones Reached
- qiwichee.vercel.app is LIVE ✅
- Vercel connected to GitHub (auto-deploys) ✅
- Sanity.io account created (Project ID: bayrhx8r) ✅
- All environment variables set in Vercel ✅
- Mailchimp fully configured ✅

### Sanity Decision
- Project ID: bayrhx8r
- Dataset: production
- Free tier (30-day trial, no credit card)
- Minimal schema only for MVP

### Vercel Decision
- Connected via GitHub App (bkark account)
- Only qiwichee repository selected (least privilege)
- Auto-deploys on every git push to main
- Environment variables stored securely in Vercel

### Two AI Strategy
- Claude = Dev AI (build, explain, step by step)
- Copilot = Business AI (positioning, pricing, GTM)
- Both work from same CONTEXT_FOR_AI file
- No repetition needed between sessions

### Next Session Priority
1. Install next-i18n
2. Create FR/EN content files
3. Build real landing page
4. Connect Mailchimp signup form
5. Push → live on qiwichee.vercel.app

## Domain Management Decisions (2026-04-26)

### Domain Transparency
- Visitors never see vercel.app after domain connected
- SSL certificate automatic and free via Vercel
- Sanity CMS completely invisible to visitors
- Every page stays on artist's own domain

### DNS Records For Vercel
- A record: @ → 76.76.21.21
- CNAME record: www → cname.vercel-dns.com
- Propagation: 10 min to 48h (usually under 1h)

### Three Onboarding Scenarios
1. No domain → use vercel.app temporarily
2. Has domain, no site → 2 DNS records, done
3. Has domain + live site → build first, switch after

### Email Warning Decision
Always warn artist about MX records before DNS change
A record change does NOT affect email
Only add/edit A and CNAME records we specify

### Multi-Tenant Domain (Phase 5+)
One Vercel project serves all artists
Next.js reads domain from HTTP request
Each domain added to same Vercel project
Like virtual hosting in telecom

### Sanity Studio Access
Phase 1: sanity.io/manage (simple)
Phase 5+: artist.com/studio (professional, embedded)

## Artist Validation + Concert Module Update (2026-04-26)

### Artist Validation — Confirmed Pain Points
Real artists confirmed these needs in conversation:
- GUSO + CDDU paperwork is a nightmare ✅
- Intermittent du spectacle tracking is critical ✅
- Concert organization needed even for FREE concerts ✅
- Free concerts build fans → leads to paid concerts ✅
- Feuille de route essential for production ✅
- Rehearsal management and organization needed ✅
- Equipment/backline management needed ✅
- Team coordination before/during concert needed ✅

### Free Concert Decision
Free concerts need full legal treatment:
- GUSO still required (venue declares even if free)
- CDDU still required per band member
- Intermittent hours still count
- Public event page still generated
- QR code fan signup critical (no ticket = no email)
- Platform supports paid AND free equally

### Feuille De Route — New Feature
Standard French music industry production document.
Platform auto-generates from concert data.
Contains: timing schedule, technical rider,
backline requirements, catering, contacts,
parking, guest list.
Sent to correct person automatically:
- Band member → their schedule + CDDU
- Sound engineer → technical rider + stage plot
- Venue → full document
- Fans → public event page

### Concert Module Expanded
Now includes:
- Full day schedule (heure par heure)
- Technical rider template (saved per artist)
- Equipment list (artist brings vs venue provides)
- Stage plot auto-generation
- Catering rider
- Guest list
- Rehearsal management linked to concert
- QR code for fan signup at free concerts
- Feuille de route PDF generation
- Distribution to all parties automatically

### Beta Testers Identified
Artists confirmed interest during validation conversations.
Contact when MVP /concerts module is ready.
Their feedback shapes Phase 5+.

### Rehearsal Management Added To /concerts
- Create rehearsal linked to concert
- Set list for rehearsal session
- Member availability and confirmation
- Equipment needs per rehearsal
- Cost split between members
- 24h reminder to all members

### Stage Plot Feature
Auto-generated diagram showing musician positions
and equipment layout on stage.
Exported as PDF for venue and sound engineer.
