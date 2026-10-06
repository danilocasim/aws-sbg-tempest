# C1 · Profiles + Auth (weeks 3-5) — the win

**Goal:** tapping a card opens the right profile fast on any phone; a member signs in and keeps it current; admins can import, moderate, and export for printing.
**ADRs:** 0001, 0002, 0005, 0006, 0012, 0014.
**Exit criteria:** C1.11 passes — five physical cards tapped on iOS and Android open the right profiles. Cards may be printed for everyone after this.

## Routes

| Route | App | Auth | Notes |
|-------|-----|------|-------|
| `GET /p/[canonicalId]` | web | public | Server Component, `Cache-Control: s-maxage=60, stale-while-revalidate`, `<meta name="robots" content="noindex">` |
| `GET /p/[canonicalId].vcf` | web | public | `text/vcard`, opt-in fields only |
| `GET /@[handle]` | web | public | 301 to canonical |
| `GET /login`, `/forgot`, `/reset/[token]`, `/set-password/[token]` | web | public | |
| `GET /me`, `POST /me` | web | member | edit profile |
| `GET /members` | web | member | directory |
| `GET /admin/members`, `/admin/members/[id]`, `/admin/members/import`, `/admin/members/export` | admin | isAdmin | |

## Tasks

### C1.1 canonicalId
- Alphabet `bcdfghjkmnpqrstvwxz23456789` (no vowels, no 0/1/l/o/i). Length 6 → ~1.5×10¹⁰ space.
- Generate with `crypto.getRandomValues`, retry on unique violation, reject if in a small profanity blocklist.
- Never reused: deleting a member is a soft delete (`visibility=inactive`, PII scrubbed), the row stays.
- Test: generate 1,000,000 in-memory → no duplicates, none in blocklist.

### C1.2 Public profile page
- Fields per ADR-0012. Position badge = current Term position(s) joined with department name.
- Visibility: `public` and `card-only` render fully; `inactive` renders the neutral page ("This Tempest member profile is no longer active") with the dragon-head mark and the club link; unknown id → 404 using the same empty-state component.
- Design (`design-system.md` → Profile card, Link button, Badge): the page is a single Profile card centred on the `--bg` canvas with the two nebula glows and a static starfield (no canvas, CSS dots) so it feels like the physical card. Halo conic-gradient border, avatar with 3 px halo ring, name in Space Grotesk, position badge in gold pill, social link rows, ember "Save contact" button pinned at the bottom on mobile. Entrance: card fades + rises 12 px in 400 ms; avatar ring rotates once 360° in 1.2 s then stays. Reduced motion: fade only. No client JS except the vCard button and the reveal class toggle.
- Verification: Lighthouse mobile perf ≥ 90, a11y 100, `noindex` present, 3G throttle load < 2s.

### C1.3 Handle
- Regex `^[a-z0-9_]{3,20}$`, unique case-insensitively, reserved list (`admin`, `login`, `p`, `me`, `members`…).
- Changing frees the old handle immediately (no redirect chain); only canonical is permanent.

### C1.4 vCard
- vCard 3.0 for widest phone support. Fields: `FN`, `N`, `ORG:AWS Student Builder Group – Tempest`, `TITLE` (headline), `URL` (canonical), `EMAIL`/`TEL` only if exposed, `PHOTO;VALUE=URI` optional.
- Filename `<displayName>.vcf`. Test import on one iPhone and one Android.

### C1.5 Auth (ADR-0014)
- Auth.js Credentials provider; Argon2id via `@node-rs/argon2` (fallback bcrypt cost 12).
- Password policy: ≥ 12 chars, k-anonymity check against HIBP range API at set/reset time; reject with a plain message.
- Tokens table `auth_tokens(id, member_id, kind: set|reset, token_hash, expires_at, used_at)`; set = 24h, reset = 1h, single use.
- Rate limit: 6 failed logins per account per 15 min → temporary lock + email notice; 30 per IP per 15 min. Store counters in Postgres (no Redis in v1).
- Sessions: database sessions, HttpOnly, Secure, SameSite=Lax, 30-day idle. `sessions` table so admins can revoke.
- Login email change is admin-only (ADR-0004 carry-over).

### C1.6 Edit profile
- Form with server actions + zod. URL validation: LinkedIn host `linkedin.com`, Facebook `facebook.com`/`fb.com`, GitHub `github.com`, website any https.
- Photo: accept jpg/png/webp/heic ≤ 2 MB; `sharp` → 512×512 cover webp + 128 thumb; store `/uploads/<canonicalId>/avatar.webp`; strip EXIF.
- Visibility toggle with explanation copy of what each state means.

### C1.7 Directory
- Members only. Search by name/headline, filter by Department (current positions) and joined Term. Excludes `card-only` and `inactive`.
- Paginate at 30. Verification: logged-out → `/login?next=/members`.

### C1.8 CSV import (admin)
- Columns: `email, displayName, headline, linkedinUrl?, facebookUrl?`. Preview → confirm → create members, generate ids, send set-password mails (batched, 10/s).
- Idempotent on email: existing rows skipped and reported.

### C1.9 Moderation (admin)
- Edit any field, change visibility, revoke all sessions, send reset link, change login email. All write `audit_log`.

### C1.10 Card export
- CSV `displayName, canonicalId, url` for visibility ≠ inactive, filter by Term. URL built from `PUBLIC_BASE_URL`.

### C1.11 Physical test
- Encode 5 NTAG215 (or whatever the vendor uses) with `https://<domain>/p/<id>` as an NDEF URI record. Tap on iPhone (background tag reading) and a Pixel/Samsung. Record results in this file.

## Out of scope here
Google sign-in, public directory, object storage for photos, profile analytics.
