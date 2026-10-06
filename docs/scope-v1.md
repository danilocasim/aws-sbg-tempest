# Version 1 scope — cards in hand in ~3 months (target: early January 2027)

## Problem statement
Tempest members meet people at events and have no fast, club-branded way to
share who they are. A tap of an NFC card should open a profile that works on
any phone, and members must be able to keep it current themselves.

## Recommended direction
One monorepo, two Next.js apps (public web, admin), one Postgres, deployed with
Coolify on the existing VPS behind Cloudflare. Email-and-password sign-in. The Profile
and its permanent URL come first; the landing page and applications fill in
around it.

## Milestones

1. **Foundation (weeks 1-2)**
   Monorepo, `packages/db` schema + migrations, Dockerfiles, Coolify deploy of
   both apps, Cloudflare DNS + Access on admin, Postgres backup job to off-box
   storage with a tested restore. Club-controlled domain registered.
2. **Profiles (weeks 3-5)** ← the win
   Member table, canonical IDs, `/p/<id>` public render, vCard, photo upload,
   email/password login with set-password and reset flows, "edit my profile", visibility settings, inactive page.
   Admin: CSV import of current members, card-print export (name, URL).
   **First cards can be printed at the end of this milestone.**
3. **Landing page (weeks 6-8)**
   Terms, Departments, Positions, Events listing, Pages (markdown slots).
   Admin CRUD for each. Archive page for past Terms.
4. **Applications (weeks 9-11)**
   Membership form with consent, admin review, accept → Member + set-password link.
   Officer application for members, Director review, accept → Position.
   Application windows.
5. **Handover hardening (week 12)**
   Runbook complete, second holders on every account, restore drill, README
   "redeploy from zero in under an hour" verified by someone other than the author.

## Key assumptions
- Under 150 Members; no performance work needed.
- Transactional email free tier is enough (set-password/reset links + application notices).
- The VPS stays personally owned for now; the domain and Cloudflare move to
  club accounts before milestone 2 ends.
- Students accept a privacy notice at application time; a short notice page
  is written before milestone 4 ships.

## Not doing in v1
- RSVP, attendance, or NFC check-in at events (ADR-0011)
- Public member directory or search engine indexing of profiles (ADR-0006)
- Google or password sign-in (ADR-0004)
- Object storage for photos (ADR-0003)
- Payments, dues, merch, newsletters
- Mobile app

## Cut order if the deadline slips
Applications (keep Google Forms + CSV import) → Term archive page → Events →
Pages editing (copy in code). Profiles and login are never cut.
