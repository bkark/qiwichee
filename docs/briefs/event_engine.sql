-- ============================================================================
-- RÉSONANCE / Qiwichee — EVENT ENGINE schema (Phase 1, tiny-concert)
-- Run this in the Supabase SQL editor (browser), top to bottom, in one go.
-- Companion to: docs/briefs/tiny_concert_engine.md
--
-- ONE MANUAL STEP: after running, seed the owner row (see §1, bottom) with the
-- artist/owner auth user UID from  Supabase → Authentication → Users.
-- Until that row exists, is_owner() is false for everyone and /atelier/artiste
-- 404s for you too.
--
-- STANDING DB RULE: every client-writable table is granted to `authenticated`.
-- DELIBERATE EXCEPTION: event_access gets NO client grant + NO select policy —
-- the secret join link is reachable ONLY via get_event_access() (security definer).
-- ============================================================================


-- 1. OWNERS + is_owner() ------------------------------------------------------
create table if not exists public.owners (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);
alter table public.owners enable row level security;
-- read only via security-definer functions; no client policies needed.

create or replace function public.is_owner()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.owners where user_id = auth.uid());
$$;
grant execute on function public.is_owner() to authenticated, anon;


-- 2. EVENTS — public-safe meta only (NO secrets here) -------------------------
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
  venue_name text,                  -- physical only
  city text,                        -- physical only
  cover_image_url text,             -- e.g. /qiwichee_atelier_cover_80s.jpg for now
  chip_in_url text,                 -- EXTERNAL payment link only; platform handles no money
  capacity int,
  rights_confirmed boolean not null default false,  -- band/song cleared before going live
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


-- 3. EVENT_ACCESS — the secret join info (separate table on purpose) ----------
create table public.event_access (
  event_id uuid primary key references public.events(id) on delete cascade,
  provider text not null,           -- 'youtube' | 'jitsi' | ...
  asset_id text,                    -- UNLISTED YouTube id / room id
  url text
);
alter table public.event_access enable row level security;
-- NO client policies, and intentionally NO grant to anon/authenticated.
-- Reachable ONLY through the security-definer functions below.


-- 4. RSVPS — the guest list ---------------------------------------------------
create table public.rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  fan_id uuid not null references public.fans(id) on delete cascade,  -- fans.id == auth.users.id
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


-- 5. RPCs — the only doors to secrets + owner reads ---------------------------

-- Reveal the join link ONLY to a logged-in 'going' fan while announced/live, or the owner.
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

  return;  -- otherwise reveal nothing
end; $$;
grant execute on function public.get_event_access(uuid) to authenticated;


-- Owner sets/updates the secret (client can't write event_access directly).
create or replace function public.owner_set_event_access(
  p_event_id uuid, p_provider text, p_asset_id text, p_url text)
returns void
language plpgsql security definer set search_path = public as $$
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


-- ============================================================================
-- MANUAL SEED — run once, replacing the UID with the owner's auth user id
-- (Supabase → Authentication → Users → copy the UID of you / Qiwi Chee):
--
--   insert into public.owners (user_id)
--   values ('00000000-0000-0000-0000-000000000000')
--   on conflict (user_id) do nothing;
--
-- Verify it took:   select public.is_owner();   -- should return true when logged in as that user
-- ============================================================================
