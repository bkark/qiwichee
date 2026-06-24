# CLAUDE CODE BRIEF — Tiny-Concert / Event Engine (Phase 1)

> Hand this whole file to Claude Code as a scoped brief. **No auto-commit.** Show `git diff HEAD`, AA-verify, grep for hex, then I review and push myself.

---

## 0. What this builds (one sentence)

The **event object** that turns the Atelier from a profile page into a live machine: the artist creates an event (online stream / co-create session / physical), announces it wide, and **the only way in is through the Atelier gate** — fans log in, RSVP, and the access link is revealed only to them. The artist sees who joined and where they are.

### Why this shape (the load-bearing logic)
- **The gate is the mechanism, not friction.** For a free Spotify link a gate feels like a tax; for "tonight's stream link is *inside*," it feels like a door to something scarce. Announce wide on social (the net), funnel access through the gate (the boat).
- **Two channels, never mixed.** Magic-link logins = *transactional* mail (OVH SMTP, one-at-a-time, ~30/hr). An event blast to the whole list = *broadcast* (Mailchimp, with legal unsubscribe headers). Do not push a broadcast down the transactional bearer.
- **Online-first is strategic, not lazy.** Zero venue cost, zero paperwork, zero geography, Phase-1-legal. And it *generates the city-density data that picks the first physical room.*
- **The owner dashboard is the referral asset.** The fan numbers she grows are the exact numbers she shows other artists. Product is the marketing.

---

## 1. Scope — build now vs defer (hold this line)

**BUILD NOW (Core):**
- Tables: `events`, `event_access`, `rsvps` (+ `owners` if not present).
- RPCs: `is_owner`, `get_event_access`, `owner_set_event_access`, `owner_event_roster`, `owner_fan_roster`, `owner_city_density`.
- Event landing page `/atelier/event/[slug]` — public meta + gate + RSVP + **gated stream reveal** (watch-only).
- Atelier home: an "À venir / Upcoming" section listing announced/live events.
- Owner page `/atelier/artiste` — fan roster + city density + create/announce event + per-event "who's coming".
- `EmbedPlayer`: extend to `type:'livestream'` (provider-agnostic, lazy-load + consent).
- Chip-in = **external link only** (`ExternalLink`); platform processes no money.

**THIN / FAST-FOLLOW (only if Core lands clean):**
- Announce action creates a Mailchimp **DRAFT** campaign to the "Qiwichee Fans" audience (server-only key). She reviews + sends from Mailchimp. **No auto-send.**

**DEFER — explicitly OUT of this brief:**
- Interactive live room (Jitsi/LiveKit) for co-create — for now a co-create event is **watch-only stream** too. Fan-visible video / recording-consent workflow is later (GDPR).
- Auto-sending broadcast email.
- Per-teaser tracked links (separate brief).
- Anything physical-event legal: GUSO / CDDU (that's the Phase-2 upsell).
- Any money flow / Stripe / Stripe Connect.

---

## 2. Data model (Supabase SQL editor)

> **STANDING DB RULE:** every table the app writes to needs a `grant` to `authenticated` as the final step — Postgres checks table grants *before* RLS, and a missing grant returns the same `42501/403` as an RLS failure. The one deliberate exception below is `event_access`, which is **never** granted to client roles (that is how the secret stays secret).

### 2.1 owners (skip if it already exists)
```sql
create table if not exists public.owners (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);
alter table public.owners enable row level security;
-- read only via security-definer functions; no client policies needed.

create or replace function public.is_owner()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.owners where user_id = auth.uid());
$$;
grant execute on function public.is_owner() to authenticated, anon;
```
**Seed once:** `insert into public.owners(user_id) values ('<Qiwi-Chee-or-dev-owner-auth-uid>');`

### 2.2 events — public-safe meta only (NO secrets here)
```sql
create table public.events (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('stream','cocreate','physical')),
  title text not null,
  slug text not null unique,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  timezone text not null default 'Europe/Paris',
  status text not null default 'draft'
    check (status in ('draft','announced','live','ended','cancelled')),
  venue_name text,                 -- physical only
  city text,                       -- physical only
  cover_image_url text,            -- e.g. the 80s concert frame for now
  chip_in_url text,                -- EXTERNAL payment link (Lydia/Ko-fi/PayPal); platform handles no money
  capacity int,
  rights_confirmed boolean not null default false,  -- band/song cleared before going live (see §6)
  created_by uuid not null references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.events enable row level security;

create policy events_public_read on public.events
  for select using (status <> 'draft' or public.is_owner());
create policy events_owner_write on public.events
  for all using (public.is_owner()) with check (public.is_owner());

grant select on public.events to anon, authenticated;
grant insert, update, delete on public.events to authenticated;  -- RLS gates writes to is_owner()
```

### 2.3 event_access — the secret join info (separate table on purpose)
```sql
create table public.event_access (
  event_id uuid primary key references public.events(id) on delete cascade,
  provider text not null,          -- 'youtube' | 'jitsi' | ...
  asset_id text,                   -- UNLISTED YouTube id / room id
  url text
);
alter table public.event_access enable row level security;
-- NO client policies, and intentionally NO grant to anon/authenticated.
-- Reachable ONLY through the security-definer functions below.
```

### 2.4 rsvps — the guest list
```sql
create table public.rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  fan_id uuid not null references public.fans(id) on delete cascade, -- fans.id == auth.users.id
  status text not null default 'going' check (status in ('going','maybe','cancelled')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (event_id, fan_id)
);
alter table public.rsvps enable row level security;
create policy rsvps_fan_rw on public.rsvps
  for all using (fan_id = auth.uid()) with check (fan_id = auth.uid());
create policy rsvps_owner_read on public.rsvps
  for select using (public.is_owner());
grant select, insert, update on public.rsvps to authenticated;  -- STANDING DB RULE
```

---

## 3. RPCs (security-definer — the only doors to secrets + owner reads)

```sql
-- Reveal the join link ONLY to a logged-in 'going' fan while announced/live, or to the owner.
create or replace function public.get_event_access(p_event_id uuid)
returns table(provider text, asset_id text, url text)
language plpgsql stable security definer set search_path = public as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  if public.is_owner() then
    return query select a.provider, a.asset_id, a.url
                 from public.event_access a where a.event_id = p_event_id;
    return;
  end if;

  if exists (
    select 1 from public.rsvps r
    join public.events e on e.id = r.event_id
    where r.event_id = p_event_id
      and r.fan_id   = auth.uid()
      and r.status   = 'going'
      and e.status in ('announced','live')
  ) then
    return query select a.provider, a.asset_id, a.url
                 from public.event_access a where a.event_id = p_event_id;
    return;
  end if;

  return; -- otherwise reveal nothing
end; $$;
grant execute on function public.get_event_access(uuid) to authenticated;

-- Owner sets/updates the secret (client can't write event_access directly).
create or replace function public.owner_set_event_access(
  p_event_id uuid, p_provider text, p_asset_id text, p_url text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_owner() then raise exception 'forbidden' using errcode = '42501'; end if;
  insert into public.event_access(event_id, provider, asset_id, url)
  values (p_event_id, p_provider, p_asset_id, p_url)
  on conflict (event_id) do update
    set provider = excluded.provider, asset_id = excluded.asset_id, url = excluded.url;
end; $$;
grant execute on function public.owner_set_event_access(uuid,text,text,text) to authenticated;

-- Owner: who's coming to one event.
create or replace function public.owner_event_roster(p_event_id uuid)
returns table(fan_id uuid, nickname text, email text, status text,
              cities text[], visit_count int, rsvp_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_owner() then raise exception 'forbidden' using errcode = '42501'; end if;
  return query
    select f.id, f.nickname, f.email, r.status, f.cities, f.visit_count, r.created_at
    from public.rsvps r join public.fans f on f.id = r.fan_id
    where r.event_id = p_event_id
    order by r.created_at;
end; $$;
grant execute on function public.owner_event_roster(uuid) to authenticated;

-- Owner: full fan roster.
create or replace function public.owner_fan_roster()
returns table(fan_id uuid, nickname text, email text, cities text[],
              visit_count int, created_at timestamptz, last_seen_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_owner() then raise exception 'forbidden' using errcode = '42501'; end if;
  return query select f.id, f.nickname, f.email, f.cities, f.visit_count, f.created_at, f.last_seen_at
               from public.fans f order by f.created_at desc;
end; $$;
grant execute on function public.owner_fan_roster() to authenticated;

-- Owner: fan density by city — answers "where do I play next?".
create or replace function public.owner_city_density()
returns table(city text, fans bigint)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_owner() then raise exception 'forbidden' using errcode = '42501'; end if;
  return query
    select c as city, count(*)::bigint as fans
    from public.fans f, unnest(f.cities) as c
    group by c order by count(*) desc;
end; $$;
grant execute on function public.owner_city_density() to authenticated;
```

---

## 4. Pages & components (Next.js App Router)

### 4.1 `/atelier/event/[slug]` — event landing (server component)
- Fetch public meta by `slug` (works for **anon** — needed for the social link + SEO).
- **Three states:**
  1. **Not logged in** → render meta + cover + the existing `AtelierGate` (`signInWithOtp`, `emailRedirectTo` = back to this same event URL). The social-announcement link lands *here*.
  2. **Logged in, no `going` RSVP** → `RsvpButton` (upserts `rsvps` with `fan_id = auth.uid()`, status `going`).
  3. **Logged in + `going` + status `announced`/`live`** → call `get_event_access(id)`; if it returns a row, render the access UI:
     - `stream` / `cocreate` → `EmbedPlayer` (`{provider, asset_id, type:'livestream'}`), lazy-load + consent.
     - `physical` → address + map link + "add to calendar"; no secret link needed.
- `chip_in_url` (if set) → `ExternalLink` ("Soutenir ↗").
- **SEO/WCAG/JSON-LD:** server-rendered semantic HTML, metadata, hreflang FR/EN, AA (alt text, keyboard, focus, contrast), and `schema.org/MusicEvent` JSON-LD. Online events: `eventAttendanceMode: OnlineEventAttendanceMode` + `VirtualLocation`. Physical: `location` + `eventAttendanceMode: OfflineEventAttendanceMode`.

### 4.2 `/atelier` (existing `AtelierContent`) — add "À venir" section
- List `announced`/`live` events (public meta) with cover, date, type badge, and RSVP state; each links to its event page. Lead with what's coming, in keeping with "content before who's-here."

### 4.3 `/atelier/artiste` — OWNER page (server component)
- `getUser()`; if `!is_owner` → `notFound()` (404, same pattern as `/admin`). Never render owner UI to non-owners.
- Sections:
  - **Fan roster** (`owner_fan_roster`) with the status badge (Nouveau→Habitué→Fidèle→Pilier).
  - **City density** (`owner_city_density`) — simple ranked list/bar; the "where to play" signal.
  - **Events** — list + **create** form (Zod-validated server action): type, title, slug, starts_at, etc.; for online, also calls `owner_set_event_access` with the unlisted YouTube id. **Announce** action → status `announced` (blocked if `type in ('stream','cocreate')` and `rights_confirmed = false` — see §6).
  - **Per-event roster** (`owner_event_roster`) — "who's coming".

### 4.4 Announce (thin, fast-follow) — server action or `/api/events/[id]/announce`
- Zod-validated; `getUser()` + `is_owner` check (never trust the body for identity). Sets `status = 'announced'`.
- THIN email: create a Mailchimp **DRAFT** campaign to audience `c5532d5f66` with the event link. Server-only `MAILCHIMP_API_KEY`. **Do not auto-send.**

### 4.5 Components
- **`EmbedPlayer`** (extend): support `type:'livestream'` (YouTube live embed) alongside `'video'`. Lazy-load thumbnail → iframe on click; consent baked in; `mediaService` resolves `{provider, asset_id, type}`. One reusable component, provider-agnostic ("YouTube now → other later" = a config change, no rebuild).
- **`RsvpButton`** (client): `getUser()` → upsert rsvp → optimistic state. No `fan_id` from props/body; from session only.
- **`AtelierGate`** (reuse): `emailRedirectTo` must support returning to the event slug.
- **`ExternalLink`** (reuse): chip-in.

---

## 5. Security checklist (must all hold)
- **Secret never leaks.** `event_access` has no client grant; the join link reaches the browser only via `get_event_access` for a logged-in `going` fan (or owner). **Test as anon AND as a logged-in non-RSVP fan: `asset_id`/`url` must not appear in page source or any network response.**
- **Identity from session, never body.** `auth.uid()` / `getUser()` everywhere; `is_owner()` server-side; owner page 404s for non-owners.
- **Zod** on every route/server action input.
- **Grants** on every new table to `authenticated` (except the deliberate `event_access` exception). Read Postgres error **bodies** when debugging (42501 → grant vs policy vs missing-grant, not JWT).
- **No money** through the platform — `chip_in_url` is an external link only.

## 6. Rights gate (standing rule — assists, never advises)
- A `stream`/`cocreate` event shows a band and/or performs songs. `events.rights_confirmed` defaults `false`.
- **The Announce action must block** an online event whose `rights_confirmed = false`, with a plain prompt: "Confirm the band is OK to appear and the song is yours / cleared." Owner ticks it → `rights_confirmed = true` → can announce.
- This is a checkbox gate, not legal advice. Fan-visible/interactive recording consent is out of scope here (watch-only for now).

## 7. Build-foundation checklist (every page)
- Server-rendered semantic HTML + metadata + sitemap entry + hreflang.
- WCAG 2.1 AA: alt text, keyboard nav, visible focus, contrast.
- JSON-LD `MusicEvent` on event pages; `robots.txt` allows `ClaudeBot`, `GPTBot`.
- **Theme via tokens only — no raw hex.** `grep -rIn '#[0-9a-fA-F]\{3,6\}' src` → nothing outside `globals.css :root`.
- Media: lazy-load + consent `EmbedPlayer`, paired with the gate; no autoplay.

---

## 8. Acceptance tests (end-to-end, before I review the diff)
1. **Anon** opens an announced stream event → sees title/date/cover + the gate; **no** access link in source or network.
2. New fan: email → magic link → returns to the **same** event page logged in → RSVP → status `going`.
3. Logged-in `going` fan, event `live` → `get_event_access` returns link → `EmbedPlayer` renders the stream (click-to-load, not autoplay).
4. Logged-in fan **without** RSVP → `get_event_access` returns nothing; no embed appears.
5. Owner → `/atelier/artiste` loads; non-owner → 404.
6. Owner sees fan roster + city density; creates an event; sets unlisted YT id; ticks rights; announces → event appears in fans' Atelier "À venir".
7. Owner opens the event → sees the RSVP roster (who's coming).
8. `grep` hex → clean. AA verified on new pages. `git diff HEAD` shown; **nothing committed.**

---

## 9. Workflow rules (standing)
- **No auto-commit.** Show `git diff HEAD`. I review, commit, push.
- Run SQL in the Supabase SQL editor; remember the grants; if the project is paused (free tier ~1 week idle) click Restore.
- Don't `npm audit fix --force` on cosmetic warnings.
- Read-only commands (grep/cat/tsc) fine to run freely; keep git/writes gated.
- End: confirm whether CONTEXT_FOR_AI needs updating; remind me to run `~/sync_resonance.sh`.
