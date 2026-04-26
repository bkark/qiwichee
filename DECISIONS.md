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
