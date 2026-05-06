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

## Strategic Review Integration (2026-04-26)

### Interactive Feuille de Route Decision
Changed from static PDF to live checklist.
Team members check off milestones in real time.
Owner sees live completion status on dashboard.
Collaborator checks items on phone at venue.
Fan member sees nothing of this (RLS enforced).

### RBAC Decision (Supabase RLS)
Three roles enforced at database level:
- Owner: full access including legal/finance
- Collaborator: feuille de route + own CDDU/payment
- Member (Fan): own guest list status + Atelier only
RLS policies prevent ANY cross-role data access.
Even direct API calls return nothing for wrong role.

### Supabase Schema Finalized
Tables: profiles, artist_members, artists, concerts,
feuille_de_route_items, guso_declarations,
cddu_contracts, guest_list, venues
Full schema documented in context file.

### Notification Decision (Final)
Telegram rejected — Qiwi Chee confirmed artists
in her network use WhatsApp/SMS not Telegram.
Decision: WhatsApp pre-filled link generation (free)
No Twilio (has cost), No Telegram (wrong platform).
Future: WhatsApp Business API when budget available.

### AI Data Importer Decision
Scrapes legacy URLs on onboarding.
Extracts bio, discography, photos, videos.
Maps directly to Sanity CMS schemas.
Offers automatic FR/EN bilingual translation.
Uses Claude API for both scraping and translation.

### Transfer Ownership Decision
No account deletion for Qiwi Chee.
Shadow build: develop under dev account.
When ready: transfer Supabase project to her email.
Add her as Vercel owner.
Connect qiwichee.com via OVH DNS.

### Open Data Decision
French government open data pre-populates venue DB.
Sources: data.iledefrance.fr, opendata.paris.fr,
         data.culture.gouv.fr, data.gouv.fr
Licence: ODbL (free, must attribute)
Hundreds of venues imported before first artist joins.
Solves chicken-and-egg problem for venue side.
Libraries and mairies included automatically.

### Monitoring Decision
Microsoft Clarity (free) for session recordings.
Emoji feedback (😊😐😟) on key actions.
Custom Supabase queries for platform metrics.
No paid analytics tools needed for MVP.

### Sprint Plan Finalized
Sprint 1: Supabase schema + RLS + bilingual + landing
Sprint 2: AI importer + bilingual translation + wizard
Sprint 3: /concerts + live checklist + WhatsApp + GUSO
Sprint 4: /legal + intermittent + transfer ownership
Sprint 5: Beta + Clarity monitoring + fix friction

## Monitoring & Resilience Architecture (2026-04-26)

### Naming Convention Decision
RÉSONANCE = the platform (your SaaS product)
QIWICHEE = one artist's instance of Résonance
Like Shopify (platform) vs individual Shopify stores
Keep bkark/qiwichee repo for proof of concept
Create bkark/resonance-platform after beta validation
qiwichee becomes a tenant/config not a separate repo

### Three-Level Monitoring Decision
Level 1: Technical — is it working? (health checks)
Level 2: Business — is it growing? (metrics dashboard)
Level 3: Behavioral — how do people use it? (Clarity)

### Health Check System
Vercel Cron job every 5 minutes (free)
Tests: Supabase, Sanity, Mailchimp, Stripe, Claude API
Results stored in service_status Supabase table
Alert after 3 consecutive failures
Tool: Better Uptime (free) for external monitoring

### Graceful Degradation Decision
Each feature knows which APIs it needs
If dependency down → feature degrades gracefully
Never let one API failure break entire platform
Examples:
- Mailchimp down → save signups locally, sync later
- Stripe down → show friendly message, alert artist
- Sanity down → serve cached content to visitors
- Claude API down → show manual fallback option

### Status Page Decision
resonance.fr/status (public)
Shows per-service status in plain language
Updated automatically from health checks
Artists and fans can check here during issues

### Alert Routing Decision
Admin (you): all technical alerts + business milestones
Artist: only if THEIR features are affected
Collaborator: schedule changes, their CDDU
Fan: new concerts, guest list status, Atelier content
Never show technical error messages to end users
Always show friendly, specific, actionable messages

### Event Tracking Decision
Every meaningful platform action fires an event
Stored in Supabase events table
No personal data in events (artist_id not name)
GDPR compliant — no selling, EU storage
Powers all business metrics and funnel analysis

### Onboarding Funnel Tracking
Track completion % per step
Drop-off point = what to fix first
Target: 70%+ full completion rate
Anything below 50% = critical problem

### Admin Dashboard Decision
/admin route in Next.js (protected by Supabase admin role)
Other roles: /admin returns 404
Contains: NOC overview, artists, concerts, legal,
          onboarding funnel, health, events, revenue
Weekly automated report every Monday 8h via Vercel Cron

### Microsoft Clarity Decision
Free, GDPR compliant, one script tag
Session recordings, heatmaps, rage clicks, dead clicks
Used during beta to watch where artists get stuck
Never watch sessions of fans (only artists during beta)

### Emoji Feedback Decision
After key actions: 😊 😐 😟 (one click)
If 😟 clicked → optional text field appears
Frictionless, honest, real-time UX feedback
Stored in Supabase feedback table

### Caching Strategy
Vercel Edge Cache as resilience fallback
Bio/photos: 1 hour TTL
Concert listings: 5 minutes TTL
Venue data: 24 hours TTL
Legal documents: never cached (sensitive data)

### Monitoring Tools Stack (All Free)
Microsoft Clarity → behavioral (session recordings)
Better Uptime → technical (external uptime checks)
Vercel Analytics → technical (page views, performance)
Supabase dashboard → technical (database activity)
Custom /admin → business (metrics, growth, revenue)
Weekly email → business (automated Monday report)
Emoji feedback → behavioral (in-app UX signals)
Total cost: €0

### Supabase Schema Additions
events table: id, artist_id, event_name,
              properties(jsonb), session_id, created_at
service_status table: id, service_name, is_up,
                      last_checked, last_down_at,
                      error_message, consecutive_failures
feedback table: id, user_id, action, rating,
                comment, created_at

## Business Planning Update (2026-05-04)

### Crowdfunding Decision — Two Phases
Phase 2A (light, safe, early):
- Support button + progress bar + external links
- PayPal.me, Lydia, Ko-fi, Tipeee, Stripe Payment Link
- Résonance does NOT handle money
- No KYC, no Stripe Connect, no escrow
- Build complexity: LOW, legal risk: ZERO
- Perks: Atelier access, supporter wall, early content

Phase 2B (full, advanced, later):
- Stripe Connect + KYC + escrow + auto-refunds
- Auto-payouts to artist and collaborators
- Résonance commission 5-10%
- VAT handling and accounting logs
- Only after platform stability and real fanbase
- Needs lawyer + accountant before building

Crowdfunding is NOT part of MVP.
Beta hook is legal automation, NOT crowdfunding.

### Marketplace Decision (Phase 2+)
Professionals marketplace deferred to Phase 2+:
Roles: musicians, sound engineers, photographers,
videographers, lighting technicians, stage managers,
graphic designers, community managers.
Ranking: concerts completed, artist ratings, reliability.
professionals table added to schema NOW (hidden).
Build later when platform has enough artists.

### Fanbase Graph Decision
Long-term data asset built automatically from:
QR check-ins, Atelier logins, guest lists,
fan signups, crowdfunding support, city/genre data.
Enables: cross-artist discovery, venue suggestions,
         crowdfunding predictions, fanbase recommendations.
This graph is the platform's primary defensive moat.
Grows automatically — no manual intervention needed.

### Concert Budget Fields Decision
Hidden fields added to concerts table now:
estimated_costs, musician_fees, venue_cost,
equipment_cost, funding_goal, funding_raised,
funding_deadline, funding_status.
Not shown to users yet — prepares for Phase 2A.
Zero cost to add now, avoids painful migration later.

### Pricing Model Decision (Revised)
Previous pricing (€60-150) was too high for indie artists.
New model with lower entry barrier:
Free: limited concerts, basic website
Starter: €9-15/month — full GUSO/CDDU/website
Pro: €29-49/month — feuille de route, intermittent, Phase 2A
Premium: €79+/month — analytics, marketplace, priority support
Usage-based add-ons: extra CDDU, GUSO, concerts
Phase 2+ commissions: marketplace, crowdfunding, venue booking
Goal: low barrier → fast adoption → scale with usage

### Vision Statement Updated
RÉSONANCE is a cooperative cultural infrastructure.
Not just a tool — a living ecosystem connecting:
artists, fans, venues, collaborators, professionals,
and institutions.
Growth through: shared fanbase, shared venues,
shared professionals, shared data, AI automation.
This language resonates with French cultural values
and CNM funding applications.

### Beta Strategy Clarified
Beta testers join for: GUSO, CDDU, intermittent,
concert management, bilingual website, feuille de route.
Crowdfunding is a bonus, not the reason to join.
Do not lead with crowdfunding in artist conversations.
Lead with: "We automate your GUSO and CDDU."

## Schema Delta Update (2026-05-04)

### professionals table — is_visible field added
professionals (
  ...
  is_visible boolean default false,
  ...
)
Purpose: professionals must explicitly opt-in to public listing.
GDPR-safe: no one is listed without their choice.
Default false: joining platform does not mean being listed publicly.
Marketplace remains opt-in at individual level.

### concerts table — budget_notes field added
concerts (
  ...
  budget_notes text,
  ...
)
Purpose: artists annotate costs, negotiations, venue conditions.
Hidden during MVP — visible in Phase 2A+.
Free text field — no structure required, flexible.

## Agent Architecture Decision (2026-05-04)

### Core Decision
Claude API with tool use = orchestration brain of Résonance.
Replaces: custom scrapers, PDF backend, rules engine,
          translation service, microservices.
Does NOT replace: Supabase, Sanity, Next.js, RLS policies.

### Terminology Clarification
Use "Claude API with tool use" not "Managed Agents".
Managed Agents is an emerging Anthropic product not yet
fully available. Claude API + tool use achieves same result.
Agent behavior: multi-step reasoning, web scraping,
                code execution, API calls, file generation.

### Agent Routes Defined
/api/agent/onboarding — scrape, translate, map to Sanity
/api/agent/concert — descriptions, FDR, rider, GUSO prefill
/api/agent/legal — GUSO assembly, CDDU, CERFA, PDF, hours
/api/agent/marketplace — matching, ranking (Phase 2+)
/api/agent/fanbase — engagement, predictions (Phase 2+)
/api/agent/crowdfunding — payouts, refunds (Phase 2B)

### Agent Principles
Stateless per task — state lives in Supabase not agent.
No data storage in agent — results saved externally.
Cost management — cache results, batch tasks.
No extra infrastructure — Next.js API routes only.
One model: claude-sonnet-4-20250514 for most agent tasks.

### What This Eliminates
No custom Python scraper to build or maintain.
No PDF generation server to deploy.
No translation microservice.
No rules engine for GUSO validation.
No orchestration server.
Significant reduction in build complexity and maintenance.

### Cost Control Strategy
Cache agent results in Supabase after first call.
Batch multiple tasks in one agent call when possible.
Use cheaper model for simple tasks (summaries, short text).
Reserve full agent calls for complex multi-step workflows.
Monitor token usage in Supabase events table.

## Strategic Update (2026-05-04)

### Corporate Structure Decision — SASU + Cooperatives
SASU (France) owns all IP, algorithms, brand, platform code.
SASU controls product direction and technical updates.
SASU licenses platform to local cooperatives per country.
Local cooperatives: access local funding, comply local law,
                    manage local governance and onboarding.
This structure: protects IP, unlocks local subsidies,
                scales internationally without losing control.

### International Expansion Order
Phase 1: France (current)
Phase 2: Belgium, Switzerland
Phase 3: Quebec (Canada)
Phase 4: Algeria, Morocco, Tunisia
Phase 5: Other francophone regions
Each expansion requires local cooperative or partner entity.

### Billing Providers Decision
New validated entity type on platform.
Billing Providers can invoice on behalf of artists.
Types: CAE, partner SCIC, local institution, association.
Platform detects when artist cannot bill (no legal structure).
Agent suggests Billing Provider when needed.
RÉSONANCE takes commission as apporteur d'affaire.
Billing Provider appears in Feuille de Route.
Each entity has clearly assigned administrative responsibility.

### Feuille de Route Extended
Now tracks: Billing Provider, local institutions,
            professionals, and administrative responsibility.
Each person/entity has role + specific task assignment.
Replaces chaotic WhatsApp coordination with structured workflow.

### Ethical Risk Management Layer (Standing Rule)
AI must flag when features touch:
- Internationally disputed territories
- State-sponsored cultural diplomacy institutions
- Partners with human-rights controversies
- Venues in militarily occupied zones

Flag language (neutral, technical, never political):
- "geographic validation needed"
- "institutional due-diligence recommended"
- "partner metadata may require filtering"

This applies to: venue data imports, touring features,
                 institutional partnerships, API integrations.

### Résonance Public Face Decision
resonance.fr target domain (check at OVH).
Separate Vercel project: resonance-platform.
Simple one-page beta site: tagline + 3 features + signup.
New Mailchimp audience: "Résonance Artists" (separate from fans).
Build after Qiwi Chee landing page is live.

### Two Mailchimp Audiences
"Qiwichee Fans" — fans of Qiwi Chee the artist
"Résonance Artists" — artists interested in joining platform
Never mix these two audiences.

## Concert Planner & Domain Decisions (2026-05-04)

### Domain Purchase Decision
Purchased at OVH:
- qiwichee.com: €7.99 first year, €13.49/year after
- qiwichee.fr: €4.99 first year, €7.79/year after
Both .com and .fr purchased: international + French audiences.
DNSSEC enabled on both (included free, security best practice).
Zimbra Starter email included: activate booking@qiwichee.com
Next step: configure DNS at OVH to point to Vercel.
Both domains point to same site, zero extra build work.

### Email Strategy
Activate booking@qiwichee.com via OVH Zimbra.
Use for venue inquiries and professional contacts.
More professional than Gmail for artist communications.
Forward to personal email for convenience.

### Concert Planner Feature Decision
Direct feedback from Qiwi Chee confirmed this need:
- Comparing venue options is difficult and time-consuming
- Budget planning for concerts is stressful
- What-if thinking (if I charge X, what happens?) is missing
- Need to know break-even point before committing to venue

Feature design:
- What-if simulator with live sliders (ticket price, attendance, costs)
- Side-by-side venue comparison with scenarios per venue
- Break-even calculation shown clearly
- AI agent generates 3 scenarios: safe/balanced/ambitious
- Venue contact workflow (pre-filled inquiry emails)
- Response tracking per venue inquiry
- Post-concert review enriches venue database

New agent route: /api/agent/concert-planner

New database tables:
- concert_scenarios: what-if planning records
- venue_inquiries: contact tracking and responses
- concert_reviews: post-concert actual vs projected

Venue table additions:
rental_cost_min/max, pa_included, lighting_included,
capacity_seated/standing, typical_genres, artist_rating,
last_cost_reported

### Learning Loop Decision
Platform learns from every concert:
- Artist's attendance estimation accuracy over time
- Which venues work for which genres
- Seasonal attendance patterns
- Price sensitivity by city and genre
This collective intelligence improves recommendations for all artists.

### Crowdsourced Venue Data Decision
After each concert: artist rates venue and reports actual costs.
This builds real pricing data no open data source provides.
Gets richer with every concert on platform.
Future artists benefit from data contributed by past artists.
Classic cooperative intelligence model.

## Subdomain Strategy & Agent Engineering (2026-05-04)

### Subdomain Strategy Decision
New entry mode: concerts.artistname.com
Target: artists with existing website who only want
        legal automation and concert management.
DNS: artist adds one CNAME record at their registrar.
Next.js middleware reads subdomain → loads concerts mode only.
Artist's existing site stays completely untouched.
This is the "wedge strategy" — enter through smallest door,
expand when artist trusts the platform.

### New Pricing Tier: CONCERTS ONLY (€9/month)
Lowest friction entry point.
Includes: subdomain, tickets, GUSO, CDDU, feuille de route,
          fan QR signup, budget/what-if planner.
No website builder required.
Converts to higher tiers when artist sees value.

### Three Routing Modes Decision
One Next.js codebase handles three distinct modes:
1. concerts.artistname.com → concerts module only
2. artistname.com → full Résonance site (all modules)
3. resonance.fr → platform marketing site
Routing determined by Next.js middleware reading subdomain.
No extra repos or deployments needed.

### Agent Architect Principles — What We Adopted
From the Seven Skills Framework review:

ADOPT NOW:
- Zod validation on ALL agent inputs and outputs
- Strict TypeScript types for all agent contracts
- Retry with exponential backoff (1s, 2s, 4s) on all external APIs
- 10 second timeout on all external API calls
- Circuit breaker: 5 failures/minute → stop + alert + degrade
- artist_id ALWAYS from auth session, NEVER from request body
- Validate ownership via artist_members table before any write
- RED metrics (Rate, Errors, Duration) in events table
- Token usage logged per agent call

ADOPT IN PHASE 2:
- Full circuit breaker library implementation
- Progressive context loading (grep/tail)
- Semantic firewalls for multi-tenant isolation

DO NOT ADOPT:
- Formal semantic handshake protocol (Zod achieves same)
- Full distributed system framing (solo dev MVP)
- Red Team every single proposal (creates paralysis)

### Layered Memory Validation
Review confirmed our existing structure is correct:
Procedural → CLAUDE.md in repo ✅
Episodic → Supabase events table ✅
Semantic → CONTEXT_FOR_AI + DECISIONS.md ✅
No changes needed — already well structured.

### Security Rule Formalized
NEVER accept artist_id from request body.
ALWAYS get from Supabase auth session.
ALWAYS verify membership in artist_members before writes.
Log ALL write operations to events table.
This applies to every agent route and API endpoint.

### Observability Addition
Add to events table per agent call:
- rate (count = 1 per call)
- error (0 or 1)
- duration_ms (response time)
- tokens_used (Claude API usage)
- agent_name (which route)
This enables RED monitoring per agent type.

## Co-Events & Content Studio Decisions (2026-05-04)

### Co-Events Feature Decision
Multi-artist concert coordination built into platform.
Triggered by artist feedback: sharing costs and fanbases
is a real need for emerging independent artists.

Key decisions:
- Running order suggested by fanbase size (smaller opens)
- Cost split: equal or proportional to fanbase size
- ONE shared feuille de route for all artists
- SEPARATE GUSO + CDDU per artist (legal requirement)
- Combined crowdfunding campaign across all artist fanbases
- 4+ artists unlocks festival mode with lineup poster
- Artists not on platform invited automatically when tagged
  → viral artist acquisition with zero marketing cost

New agent route: /api/agent/co-event
New tables: co_events, co_event_artists,
            co_event_costs, co_event_cost_shares

Business model: +1% coordination fee on co-event ticket sales
Strategic value: every co-event is a potential new artist signup

### Content Studio Feature Decision
Direct response to artist pain point:
raw content exists but never gets repurposed.
Social media goes quiet. Fans disengage.

Core promise: "Upload once → posts everywhere"

Key decisions:
- AI analyzes video and finds best moments automatically
- All platform formats generated from one upload
  (Instagram 9:16, Twitter 16:9, TikTok, YouTube Shorts, etc.)
- Bilingual captions generated per platform per language
- Optimal posting times suggested based on audience activity
- Artist approves everything before posting
- Platform auto-posts at scheduled times
- Proactive content plan generated 14 days before concert
- Automated milestone posts (crowdfunding, fan counts)

Privacy rules:
- Band members in video → consent request sent
- Background music → rights reminder shown
- Venue recording → agreement reminder shown

Technical stack:
- Video processing: Cloudflare Stream (free 1000min/month)
- AI analysis: Claude API with vision
- Subtitles: Whisper API (FR + EN auto-transcription)
- Scheduling: Supabase Edge Functions
- Social APIs: Meta, X, TikTok, YouTube (all free tiers)
- Cost per artist: ~€0.50-2.00/month

New agent routes:
- /api/agent/content-analyzer (find best moments)
- /api/agent/content-writer (bilingual captions)

New tables: content_pieces, content_clips, social_accounts

Module position: /content sits between /website and /concerts
Feeds into: /concerts (event clips), /website (embed posts),
            fan engagement (social → signups)

### MVP Now Has Four Modules
Updated from three to four modules:
1. /onboarding — AI-guided self-setup wizard
2. /website — bilingual site, CMS, Atelier
3. /content — social media engine (new)
4. /concerts — event management, feuille de route
5. /legal — GUSO, CDDU, intermittent (killer feature)

Content module deferred to Sprint 3 or 4.
Core MVP (website + concerts + legal) remains priority.
Content studio adds value but is not blocking.
