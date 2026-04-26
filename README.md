# Qiwichee — Official Website
## Proof of concept for Résonance platform

Artist website for Qiwi Chee, Franco-Algerian-American
hybrid pop singer-songwriter.

## This Project Is Two Things

### 1. Qiwichee.com
Professional artist website for Qiwi Chee.
Bilingual French and English.

### 2. Résonance Proof of Concept
First implementation of Résonance — a SaaS platform
for independent artists in France and the francophone world.

## Tech Stack
- Framework: Next.js 16 with TypeScript
- Styling: Tailwind CSS
- Hosting: Vercel free tier
- CMS: Sanity.io
- Fan emails: Mailchimp
- Payments: Stripe
- Merch: Printful
- Bilingual: next-i18n

## Local Development
    cd ~/qiwichee
    npm run dev
Opens at http://localhost:3000

## Deployment
Push to GitHub — Vercel auto-deploys automatically

## Project Structure
    src/app/          - Pages (folder = URL)
    src/components/   - Reusable UI components
    src/locales/      - FR and EN JSON content files
    public/           - Images and static files

## Documentation
- README.md — this file
- DECISIONS.md — all decisions with reasoning
- CONTEXT_FOR_AI_qiwichee_web.md — AI conversation context

## Accounts
- GitHub: bkark
- Vercel: connected to GitHub
- Domain: qiwichee.com (to buy at OVH)
- Milkshake: msha.ke/qiwichee (keep alive during transition)

## Developer Notes
- Linux Mint, Node v22, Apple keyboard adapted for Linux
- Use View > Terminal in VS Code
- Long pastes via cat > file << ENDOFFILE pattern
- gh CLI v2.4 — run gh auth setup-git if push fails
