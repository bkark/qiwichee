# Supabase Auth Email Templates — Résonance standard

> Repo path: `docs/templates/supabase_emails.md`
> Established 2026-07-13 (qiwichee.com). Reuse for every artist instance.

---

## WHY THESE EXIST

The **default** Supabase templates use `{{ .ConfirmationURL }}`, which resolves to
`https://<project-ref>.supabase.co/auth/v1/verify?...`. Result: the mail is sent
**from** the artist's domain but every link points at a stranger's domain.

Two costs:
1. **Deliverability.** Sender domain ≠ link domain is a classic phishing fingerprint.
   (Observed 2026-07-13: a first-contact magic link landed in a Yahoo spam folder.)
2. **Trust.** A fan who hovers the link sees a random hostname in a mail claiming to
   be from the artist.

The fix: build the link on the artist's own domain using `{{ .TokenHash }}`, and
verify it server-side in `/auth/confirm` (see `src/app/auth/confirm/route.ts`).

---

## ⚠️ THERE ARE TWO TEMPLATES, NOT ONE

Because **Confirm email is ON**, a fan's *first* mail and their *returning* mail come
from different templates, **with different `type` values**:

| Situation | Template | `type=` |
|---|---|---|
| Brand-new email address (first ever signup) | **Confirm signup** | `email` |
| Returning fan (already confirmed once) | **Magic Link** | `magiclink` |

Getting `type` wrong → Zod rejects → fan bounces to `/?error=missing_token`.
The **Confirm signup** one is the first-contact mail — i.e. the one that actually
went to spam. Don't fix only the Magic Link template.

Location: Supabase dashboard → **Authentication → Email Templates**.

---

## TEMPLATE 1 — "Confirm signup"

**Subject heading:**
```
Bienvenue dans L'Atelier — Welcome to L'Atelier
```

**Message body:**
```html
<h2>Bienvenue dans L'Atelier</h2>

<p>Confirme ton adresse pour entrer. Ce lien expire rapidement et ne fonctionne qu'une seule fois.</p>

<p><a href="https://qiwichee.com/auth/confirm?token_hash={{ .TokenHash }}&type=email">Entrer dans L'Atelier</a></p>

<hr>

<p><em>Confirm your address to enter. This link expires shortly and can only be used once. Use the link above.</em></p>

<p>Qiwi Chee · <a href="https://qiwichee.com">qiwichee.com</a></p>
```

---

## TEMPLATE 2 — "Magic Link"

**Subject heading:**
```
Ton lien pour L'Atelier — Your L'Atelier link
```

**Message body:**
```html
<h2>Ton lien de connexion</h2>

<p>Clique pour retrouver L'Atelier. Ce lien expire rapidement et ne fonctionne qu'une seule fois.</p>

<p><a href="https://qiwichee.com/auth/confirm?token_hash={{ .TokenHash }}&type=magiclink">Entrer dans L'Atelier</a></p>

<hr>

<p><em>Click to return to L'Atelier. This link expires shortly and can only be used once. Use the link above.</em></p>

<p>Qiwi Chee · <a href="https://qiwichee.com">qiwichee.com</a></p>
```

---

## DESIGN RULES (deliberate — don't "fix" these)

- **ONE link per mail.** The English block says "use the link above" rather than
  repeating the anchor. Two identical links is a mild spam signal, and it doubles the
  chance a mail scanner pre-fetches and burns the single-use token.
- **FR first, EN second.** Supabase templates are **static** — they cannot branch on the
  recipient's locale from the dashboard. Truly locale-aware mail needs the **Send Email
  Hook** (take over sending yourself). That belongs in the bilingual next-intl session,
  not here. Bilingual-in-one-mail is the correct interim.
- **"L'Atelier" / "Qiwi Chee" / "Résonance" are never translated.** Fixed brand strings,
  same rule as in the app.
- **The footer domain link** gives the mail a second same-domain link, reinforcing
  sender/link alignment rather than undermining it.

---

## AFTER SAVING — ALWAYS CHECK

Reopen the template and read the raw `href`. Some editors HTML-escape `&` into `&amp;`
on save, which silently kills the `type` parameter → Zod rejects → dead signup.

It must read `&type=email` / `&type=magiclink`. Not `&amp;type=`.

---

## PER-ARTIST REUSE — THE HARDCODED-DOMAIN PROBLEM

As written above, the artist's domain is **hardcoded in the href**. That means artist #2
requires hand-editing the HTML. Fine at 1–5 artists. Not fine at 50.

### Untested improvement (verify before relying on it)
Supabase exposes `{{ .SiteURL }}`, which resolves to the project's configured Site URL.
So the href *should* become:

```
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
```

…making the **template text identical for every artist**, with only the Site URL field
changing (which is set during onboarding anyway). One field instead of hand-edited HTML.

⚠️ **NOT TESTED as of 2026-07-13.** Confirm it renders correctly on a real send before
trusting it. Do not roll it out to a live artist unverified.

### The real fix is architectural
Supabase email templates are **per-project**. One Supabase project per artist ⇒ one set of
templates per artist, forever. The scalable answer is **one shared Résonance Supabase
project, artists as rows**, with a single auth surface — then there is one set of templates,
period.

**→ OPEN DECISION: one Supabase project per artist vs. one shared project. Decide before artist #3.**

---

## OTHER TEMPLATES — DELIBERATE NEGLECT

`Invite user`, `Change email address`, `Reset password` are **untouched** and still carry
`{{ .ConfirmationURL }}`. Unused today; the moment one fires it will leak `supabase.co`.

Known, not forgotten. Fix them when a flow starts using them.
