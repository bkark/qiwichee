-- =============================================================================
-- keepalive.sql — stop the Supabase free tier pausing the project
-- Repo path: docs/briefs/keepalive.sql
-- Applied to qiwichee (cieefpigrwlhklkkqmdb) 2026-07-13. RUN — not just committed.
-- =============================================================================
--
-- WHY
--   Supabase pauses free-tier projects after 7 days of inactivity. When the project
--   is paused THE ATELIER GATE IS DEAD — a fan clicking "join" gets an error.
--   Discovered the hard way: the project paused during a holiday.
--
--   A daily database read resets the idle timer. (Telecom: a BFD keepalive — tiny
--   periodic traffic whose only job is to prove the circuit is up so the far end
--   doesn't tear it down.)
--
-- WHY NOT JUST `select * from fans limit 1`
--   That was the first attempt and it FAILED with:
--       42501 — permission denied for table fans
--   The cron caller is ANONYMOUS. Anon has NO table-level grant on `fans`, and
--   Postgres checks GRANTS **before** RLS — so the query dies before RLS ever gets
--   a chance to return zero rows. This is the STANDING DB RULE, rediscovered.
--
--   And we do NOT fix it by granting anon access to `fans`: that table holds fan
--   EMAIL ADDRESSES. It stays locked.
--
--   Instead: a security-definer function that returns a constant. It touches NO
--   table, leaks NOTHING, and produces exactly the database ACTIVITY the idle timer
--   measures. Purpose-built loopback ping instead of fetching a real customer record.
-- =============================================================================

create or replace function public.keepalive()
returns text
language sql
security definer
set search_path = public
as $$
  select 'ok'::text;
$$;

-- Explicit grants: nothing by accident.
revoke all on function public.keepalive() from public;
grant execute on function public.keepalive() to anon;

-- =============================================================================
-- THE OTHER HALF (in the repo, not here)
--
--   src/app/api/keepalive/route.ts
--     - export const dynamic = 'force-dynamic'   <-- REQUIRED. Without it Next.js may
--       statically optimise the route: it returns 200 without ever touching the DB —
--       defeating the entire purpose while looking perfectly healthy.
--     - Auth FIRST: compares the Authorization header to process.env.CRON_SECRET.
--       Vercel sends that env var automatically as `Authorization: Bearer <value>`
--       when it invokes a cron. Missing/wrong -> 401. Fails closed.
--     - Then: await supabase.rpc('keepalive')
--     - Returns JSON (never a redirect — Vercel does not log cron invocations that
--       respond with a redirect or a cached response).
--
--   vercel.json
--     { "$schema": "https://openapi.vercel.sh/vercel.json",
--       "crons": [{ "path": "/api/keepalive", "schedule": "0 4 * * *" }] }
--
--   Vercel env var: CRON_SECRET  (openssl rand -hex 32, Production+Preview+Development)
--
-- WHY DAILY AND NOT EVERY 6 DAYS
--   Strictly, 6 days would clear a 7-day timer. But a 6-day interval against a 7-day
--   dead-timer is 1.17x — ONE lost ping and the project pauses. Daily means six
--   CONSECUTIVE failures are needed before the window opens. (Telecom: you don't set
--   the keepalive interval equal to the dead-timer.) Vercel Hobby caps cron at
--   once/day anyway, so daily is both the safest and the only option. Cost ~ zero.
--
-- VERIFY (both halves — the happy path alone proves nothing)
--   curl -i -H "Authorization: Bearer $CRON_SECRET" https://www.qiwichee.com/api/keepalive
--     -> 200 {"ok":true,"at":"..."}      and  x-vercel-cache: BYPASS (force-dynamic works)
--   curl -i https://www.qiwichee.com/api/keepalive
--     -> 401 Unauthorized                (proves it is NOT a public handle on the DB)
--
-- ⚠ STILL OPEN (2026-07-13): does the CRON itself reach the route?
--   qiwichee.com 308-redirects to www.qiwichee.com. A redirect typically DROPS the
--   Authorization header, and Vercel does not log cron responses that are redirects.
--   So there is a live path where the cron fires, gets bounced, loses its token, 401s,
--   and shows NOTHING in the log — a keepalive that looks deployed and does nothing.
--   The curl proves the ROUTE; it does not prove the CRON reaches it.
--   -> CHECK Vercel → Cron Jobs after 04:00 UTC. Logged 200 = done.
--      Empty log or non-200 = make www canonical in Vercel and re-test.
--
-- NOT A PERMANENT FIX
--   This works around a free-tier limit. The moment a real event with real RSVPs
--   depends on the gate, Supabase Pro ($25/mo) stops being an expense and becomes
--   cheap insurance. Keepalive now; Pro when fans are counting on it.
-- =============================================================================
