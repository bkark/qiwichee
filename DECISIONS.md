# Qiwichee Project — Decision Log

## Stack Decisions
- Framework: Next.js — portable, free hosting, bilingual support built in
- Hosting: Vercel free tier — auto-deploys from GitHub on every push
- Domain registrar: OVH when ready — French company, euros, GDPR compliant
- Fan email list: Mailchimp free tier — up to 500 contacts
- Payments: Stripe — per transaction fee, no monthly cost
- Merch: Printful — print on demand, zero inventory risk
- Crowdfunding: Ko-fi — free tier available

## Architecture Decisions
- Separate music site (qiwichee.com) from voice acting portfolio
- Content stored in JSON files for easy translation and portability
- No database for now — static content only, simpler and free
- Bilingual routing via next-i18n — FR/EN toggle on every page

## Business Decisions
- Auto-entrepreneur to start billing immediately with zero startup cost
- Move to SASU when expenses justify deductions (instruments, studio, travel)
- Consult comptable specialise in spectacle before incorporating
- Register with SACEM separately for music royalties
- Keep Milkshake page alive during transition to avoid losing traffic
- Buy domain at OVH not Vercel — keep domain independent from hosting

## Two Separate Brands Under One Company
- qiwichee.com — music, concerts, merch, fan club
- voice acting portfolio site — separate, targets casting directors
- Same legal entity bills for both activities

## Domain Decision
- Target domain: qiwichee.com
- Registrar: OVH (French, euros, GDPR, phone support)
- Timing: buy when ready to go public
- Temporary URL: qiwichee.vercel.app

## Environment
- OS: Linux Mint
- Node: v22.22.2
- npm: 10.9.7
- Git: 2.34.1
- VS Code: 1.116.0
- Keyboard: Apple aluminum adapted for Linux

## Accounts
- GitHub: bkark
- Vercel: connected to GitHub
- Mailchimp: to be created
- Stripe: to be created when ready for tickets

## Todo
- [ ] Create Mailchimp account
- [ ] Connect GitHub to Vercel
- [ ] Build landing page with bilingual bio
- [ ] Add fan email signup form
- [ ] Embed YouTube and platform links
- [ ] Add shows/concerts page
- [ ] Set up Stripe for tickets
- [ ] Build merch page with Printful
- [ ] Build voice acting portfolio site
- [ ] Buy qiwichee.com at OVH
- [ ] Point domain to Vercel
