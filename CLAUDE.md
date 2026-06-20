# CLAUDE.md — Qiwichee / Résonance

Startup context for Claude Code. Read this first, every session.

## What this is
- **Résonance** = cooperative cultural infrastructure (SaaS) for independent French performing artists.
- **Qiwichee** = first artist instance of Résonance, and the **reference template** the platform reuses. Artist: Qiwi Chee.
- This repo builds the Qiwichee website. Treat it as the template, not a one-off.

## Developer
- Telecom engineer learning web dev. Explain commands and WHY. One step at a time; wait for confirmation.
- Linux Mint, user `simba`. Long file writes: `cat > file << 'ENDOFFILE'` (heredoc).
- GitHub: bkark/qiwichee · Live: qiwichee.vercel.app

## Stack
- Next.js (TypeScript + Tailwind) · Vercel hosting · Supabase (Postgres + Auth + RLS) · Sanity CMS (id: bayrhx8r) · Mailchimp (audience c5532d5f66) · Claude API for agent routes.
- Bilingual FR/EN via next-intl.

## Current state (June 2026)
- DNS: 4 domains live on Vercel with SSL (qiwichee.com/.fr + www). OK
- Email: OVH Email Pro active. hello@qiwichee.com (mailbox), booking@qiwichee.com (free alias to hello@). Server: pro2.mail.ovh.net (IMAP 993 SSL, SMTP 587 STARTTLS). OK
- Now building: the Qiwichee website itself.

## Build sequence (do not reorder)
1. Finish Qiwichee website (reference template).
2. Then GUSO social-charge calculator — first free acquisition wedge tool. Scope = computation that ASSISTS, never advises ("estimate, not legal advice").

## Three-in-one foundation — apply to EVERY page
SEO + WCAG 2.1 AA accessibility + AI-agent discoverability are ONE layer, not three jobs:
- Server-rendered semantic HTML (Next.js gives this).
- Complete schema.org JSON-LD (MusicGroup, MusicEvent), server-rendered.
- WCAG 2.1 AA: alt text, keyboard nav, color contrast, visible focus, accessibility statement.
- hreflang FR/EN. robots.txt ALLOW AI crawlers (ClaudeBot, GPTBot).

## Non-negotiables
- `artist_id` ALWAYS from Supabase auth session, NEVER from request body.
- Service-layer abstraction on every external API (emailService, cmsService, aiService) — swap providers via env vars.
- Zod validation on all agent route inputs/outputs.
- Feuille de route = LIVE CHECKLIST, never a PDF.
- Free concerts need GUSO + CDDU too.
- Three roles enforced by Supabase RLS: owner / collaborator / member (Atelier = fan area).
- Never suggest Telegram — use WhatsApp pre-filled links.
- Crowdfunding = Phase 2A only (external links, platform handles no money).
- Consult entertainment lawyer BEFORE the /legal module.
- Flag geographic/institutional risks neutrally (technical, never political).

## Legal flag (later)
European Accessibility Act enforceable since 28 June 2025. Microenterprise exemption likely applies now; expires when consumer-facing ticketing/e-commerce is added. Lawyer territory.
