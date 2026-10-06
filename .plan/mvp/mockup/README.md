# Tempest mockup (Next.js)

A clickable, static-data mockup of the club site as it will look after the MVP ships.
It follows `../design-system.md` and `../landing-experience.md` and the ADRs in `docs/`.

**It is only a mockup.** No database, no auth, no email. Every "member", "event", and
"application" is hardcoded in `lib/data.ts`. Forms show success toasts without saving.
The admin pages live under `/admin` here for convenience; in production they are a
separate app on `admin.<domain>` behind Cloudflare Access (ADR-0008).

```bash
pnpm install
pnpm dev          # http://localhost:3100
```

| Route | What it mocks |
|-------|---------------|
| `/` | Landing page with the full choreography (starfield, hero entrance, dragon float, reveals, count-ups, scroll-spy) |
| `/p/7hq2k` | NFC profile (public card view) with vCard download |
| `/p/q7w2xn` | Inactive member page (neutral, never a 404) |
| `/@maya` | Vanity handle redirecting to the canonical URL |
| `/events`, `/events/[slug]`, `/departments/[slug]`, `/archive` | Public structured pages |
| `/join` | Membership application with window state and consent |
| `/login`, `/forgot` | Email-first sign-in (password or one-time link), two-pane layout |
| `/me`, `/members` | Member area (mocked as signed in) |
| `/admin`, `/admin/applications`, `/admin/members`, `/admin/events` | Admin app surfaces (sidebar ≥ 1024px, top bar + menu sheet below; review drawer with action footer) |

Toggle "Reduce motion" in your OS to check the reduced-motion matrix.

```bash
node scripts/shots.mjs   # phone + desktop screenshots of every route → ../evidence/, flags horizontal overflow
```

Interaction layer (see `../landing-experience.md`): route fades, 3D tilt and shared cursor glow on card grids, services marquee, live countdown on the next event, profile page with Share/Copy, join page with inline validation, a live step list, and a receipt on success, animated directory filtering with `/` to search, back-to-top. Removed after the 2026-10-03 review: magnetic buttons, profile-card tilt/sheen/gradient ring.
