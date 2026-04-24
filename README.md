# Qiwichee — Official Website

Artist website for Qiwi Chee, Franco-Algerian-American hybrid pop singer-songwriter.

## Project Overview
A bilingual (French/English) artist website built to:
- Centralize all music, social media and platform links in one place
- Build and manage a fan email list
- Promote and sell tickets for live concerts
- Sell merchandise
- Support crowdfunding campaigns

## Tech Stack
- **Framework:** Next.js 16 with TypeScript
- **Styling:** Tailwind CSS
- **Hosting:** Vercel (free tier)
- **Fan emails:** Mailchimp (free up to 500 contacts)
- **Payments:** Stripe (per transaction, no monthly fee)
- **Merch:** Printful (print on demand)
- **Crowdfunding:** Ko-fi

## Local Development
Run the development server:
    npm run dev
Opens at http://localhost:3000

## Deployment
Push to GitHub then Vercel auto-deploys automatically

## Project Structure
src/app/          - Pages, each folder becomes one URL
src/components/   - Reusable UI pieces
src/locales/      - French and English text files
public/           - Images and static files

## Accounts and Services
- GitHub: bkark
- Vercel: connected to GitHub account
- Domain: qiwichee.com to be purchased at OVH when ready
- Milkshake page: msha.ke/qiwichee keep alive during transition

## Developer Notes
- Built on Linux Mint, Node v22
- Dev server runs on localhost:3000
- Network accessible at 192.168.1.5:3000 for mobile testing
- Apple aluminum keyboard adapted for Linux
