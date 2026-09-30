# BRIEF — Canonical domain: https://qiwichee.com
# Path in repo: docs/briefs/BRIEF_canonical_domain.md

## ⚠️ STATUS 2026-09-30 — READ FIRST

**All redirects are DONE and VERIFIED IN PRODUCTION, via the Vercel dashboard only. No code was involved.**
- qiwichee.com = Production · www.qiwichee.com, qiwichee.fr, www.qiwichee.fr = 301 → qiwichee.com
- curl table observed: https variants 301 / 1 hop; http variants 308 then 301 / 2 hops; path + query kept
- OVH DNS clean (single A, no AAAA, no CAA), MX unchanged
- Supabase Site URL already https://qiwichee.com; callback allowed
- Contact form, Atelier magic link, share card, phone access: all tested OK

⚠️ Until today the site was SERVED ON www.qiwichee.com (qiwichee.com redirected to it),
and www.qiwichee.fr served a full duplicate. Canonical tags or hard-coded strings may
therefore reference www — look for it specifically.

**YOUR SCOPE IS ONLY:** canonical tags, metadataBase, hard-coded domain strings (JSON-LD
included), sitemap/robots if they exist. **Do NOT add any redirect logic** — not in
next.config, not in proxy/middleware, not in vercel.json.
**Ignore** the "Status codes", "Manual checklist" and "Test checklist" sections below:
they are done.
**Start with Phase 1 (read-only), report, and STOP.**

You are acting as a senior web engineer on Qiwi Chee's production site (Next.js 16, Vercel, Supabase).

**The repository is authoritative. If this brief names a file, field or route that does not exist, report the real one — do not create what the brief assumed.**

## Goal

`https://qiwichee.com` (HTTPS, non-www) is the single canonical public host. Every other hostname redirects to it permanently, preserving path and query string:

| From | To |
|---|---|
| http://qiwichee.com | https://qiwichee.com |
| http(s)://www.qiwichee.com | https://qiwichee.com |
| http(s)://qiwichee.fr | https://qiwichee.com |
| http(s)://www.qiwichee.fr | https://qiwichee.com |

Examples (use these REAL routes — there is NO `/music` route; the carousel is the `#music` section of the home page, and `/music` returns 404):

- `https://qiwichee.fr/` → `https://qiwichee.com/`
- `https://qiwichee.fr/contact` → `https://qiwichee.com/contact`
- `https://www.qiwichee.fr/?release=<slug>&song=<slug>#music` → `https://qiwichee.com/?release=<slug>&song=<slug>#music`
  (the fragment is never sent to the server; browsers re-attach it after a redirect — verify, do not assume)

## Status codes — what is actually achievable

- Cross-domain redirects (`.fr`, `www.*`) → **301**, configured at Vercel domain level.
- HTTP→HTTPS on the same host is done automatically by Vercel with **308**. This cannot be changed and is acceptable (permanent, treated like 301 by search engines). **Do not write code to "fix" it.**
- `http://qiwichee.fr` will likely be 2 hops (308 upgrade, then 301). Platform behaviour, acceptable — measure it, do not promise 1 hop.
- No client-side JS redirects, no meta-refresh, no 302/307.

## Constraints

- Keep `qiwichee.fr` registered and connected, redirect-only.
- Do not break: the contact form (`/api/contact`, relative URL), Atelier magic-link auth, email (OVH: MX, SPF, DKIM, DMARC on qiwichee.com), the keepalive cron, the share-card deep links, the Vercel deployment workflow.
- No change to design, text, images or unrelated features.
- Architecture contract: nothing hard-coded. The canonical origin comes from `NEXT_PUBLIC_SITE_ORIGIN` (already exists on Vercel in Production, Preview and Development, type Config). Do not introduce a second variable for the same fact.
- Next 16: `middleware.ts` is being renamed to `proxy.ts`, and there is already a Supabase session middleware/proxy. **Do not add host redirects there.** Prefer the Vercel dashboard. If code is truly required, use `next.config` `redirects()` with a `has: [{ type: 'host', value: ... }]` condition and `statusCode: 301` (NOT `permanent: true`, which emits 308).

## Phase 1 — READ ONLY. Report, then STOP.

Inspect and report actual names and contents for:

1. Next.js version; `next.config.*`; `vercel.json` (if any); `middleware.ts` / `proxy.ts` and its `matcher`.
2. **Canonical metadata — known to exist.** The root layout declares a hard-coded `alternates.canonical`, and `(public)/page.tsx` overrides it. Also report `metadataBase`, every `alternates` occurrence, and whether `(public)/contact/page.tsx` sets its own.
3. Every hard-coded domain string: `grep -rn "qiwichee\." src/ public/ next.config.* ` (include JSON-LD blocks in `(public)/page.tsx`, the share module, the mail templates). Count occurrences, not result lines (two can share a line).
4. `sitemap` / `robots`: `src/app/sitemap.ts`, `src/app/robots.ts`, or files in `public/`. Report if absent — **do not create them in this brief.**
5. Analytics: expected to be NONE (no GA, no GTM; Clarity deferred; `log_event` not built). Confirm or report what exists. Add nothing.
6. How `NEXT_PUBLIC_SITE_ORIGIN` is read today (share module) and its value format (trailing slash or not).

Then propose: exact files to change, the canonical helper design, and the dashboard/DNS actions that code cannot do. **Do not edit until approved.**

## Phase 2 — Implement (after approval)

### Canonical helper
- ONE function (e.g. `canonicalUrl(path)` in `src/lib/`) that builds `${NEXT_PUBLIC_SITE_ORIGIN}${path}`, normalising slashes, never including query or fragment.
- Replace hard-coded canonicals in the layout and pages with it. Home → `https://qiwichee.com/`.
- Design it so a future `/en` locale can reuse it for hreflang (step 5 of the copy engine). Do not implement hreflang now.
- JSON-LD and other hard-coded `qiwichee.com` strings → same origin source. Third-party URLs untouched.
- Verify the RENDERED HTML (`curl -s <url> | grep -i canonical`), not the source.

### Sitemap / robots
Only if they exist: make URLs use the canonical origin, and make robots point to the canonical sitemap.

### Workflow
- Branch `fix/canonical-domain` → `git push -u origin` → test the preview → merge. Do not commit to main; do not merge.
- The preview can verify canonical tags ONLY. Host redirects exist only on production domains → verified after merge.

### Points `tsc` cannot check — list each in your report
- The canonical never contains `www`, `.fr`, `vercel.app`, a query string or a fragment.
- `/contact` still overrides the canonical correctly (not the home URL).
- No new redirect logic in middleware/proxy.

## Manual checklist (for Bassim — produce it precisely)

### Vercel → Project → Settings → Domains
1. Add all four: `qiwichee.com`, `www.qiwichee.com`, `qiwichee.fr`, `www.qiwichee.fr`.
2. `qiwichee.com` = connected to Production (no redirect).
3. `www.qiwichee.com`, `qiwichee.fr`, `www.qiwichee.fr` = "Redirect to `qiwichee.com`", status **301**.
4. Each domain shows "Valid Configuration" and an issued certificate.

### OVH → Domains → DNS zone (for EACH of qiwichee.com and qiwichee.fr)
- Use the exact A / CNAME values the Vercel dashboard displays (older values `76.76.21.21` / `cname.vercel-dns.com` still work, but the dashboard is authoritative).
- **Exactly one** A record on `@`. Delete any OVH default A on `@` pointing to 213.186.33.x.
- **No AAAA** on `@` or `www` (Vercel is reached over IPv4; an OVH AAAA causes intermittent failures).
- `www` = CNAME only (no A alongside it).
- Check CAA records: if present, they must allow Let's Encrypt (`letsencrypt.org`), otherwise the certificate fails.
- Check that no OVH "web redirection" is active on the domain (it recreates A records).
- **Do not touch** MX, SPF (TXT `v=spf1`), DKIM, DMARC, or the Zimbra/OVH mail records.
- DNSSEC can stay enabled.

### Supabase → Authentication → URL Configuration
- Site URL = `https://qiwichee.com` (no www, no trailing path).
- Redirect allowlist contains the `https://qiwichee.com/...` callback; no `.fr` / `www` entries needed after the redirect.

### Search Console (optional, after)
- Property for `qiwichee.com`; submit the sitemap if one exists.

## Test checklist (after merge, from a terminal)

`curl -sI <url>` for each; `curl -sIL <url>` to see the full chain.

| URL | Expected first hop | Final |
|---|---|---|
| http://qiwichee.com | 308 → https://qiwichee.com/ | 200 |
| https://qiwichee.com | 200 | — |
| http://www.qiwichee.com | 308 or 301 | https://qiwichee.com/ 200 |
| https://www.qiwichee.com | 301 | https://qiwichee.com/ 200 |
| http://qiwichee.fr | 308 then 301 (2 hops acceptable) | https://qiwichee.com/ 200 |
| https://qiwichee.fr | 301 | https://qiwichee.com/ 200 |
| http://www.qiwichee.fr | 308 then 301 | https://qiwichee.com/ 200 |
| https://www.qiwichee.fr | 301 | https://qiwichee.com/ 200 |
| https://qiwichee.fr/contact | 301 | https://qiwichee.com/contact 200 |
| https://www.qiwichee.fr/?release=…&song=…#music | 301, query kept | correct song opens (browser test) |

Plus, in production:
- Send one contact form → row in `contact_messages` + email received on hello@.
- One magic-link login into the Atelier from qiwichee.com.
- One share card from a phone → the link opens on qiwichee.com, on the right song.
- `dig +short qiwichee.fr MX` and `dig +short qiwichee.com MX` → unchanged from before.

## Final report format

1. Summary of what changed.
2. Every changed file + one-line reason.
3. Final redirect configuration (dashboard + any code).
4. Remaining manual Vercel / OVH / Supabase actions.
5. Test table with OBSERVED status codes (not expected ones) — or "not yet verified".
6. Risks, assumptions, and anything that could not be verified.

**Never state that a redirect or domain is working unless it was observed on the production domain.**
