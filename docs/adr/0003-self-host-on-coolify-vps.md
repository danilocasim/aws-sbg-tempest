# ADR-0003: Self-host on a Coolify-managed VPS, lean on free managed services around it

- Status: accepted, with a recorded succession risk
- Date: 2026-10-02

## Context
The club wants to self-host the application backend with Coolify on a VPS it
already has, and use free tiers of external services for everything that is
cheaper to rent than to run. Expected scale is under 150 Profiles. Future
maintainers are next year's Technical department, mixed skill level.

## Decision
- Application and Postgres run as Coolify-managed containers on the VPS.
- Cloudflare (free) fronts the site: DNS, TLS, CDN, and proxy. The VPS IP is
  never what a card or a user sees, so the host can be swapped by a DNS change.
- Transactional email is delegated to a free-tier provider (Resend or Brevo).
- Member photos stay on the VPS (volume) for now; moving them to object
  storage is a later ADR if disk or rebuilds become a problem.
- Hosted Postgres was declined; the database is self-hosted, so automated
  off-box backups are part of the minimum viable deployment, not a follow-up.
- Everything is reproducible from this repository: Dockerfile, compose or
  Coolify config, migrations, seed script. No hand-configured state on the box.

## Consequences
- The club owns patching, backups, and disk space for the VPS and Postgres.
  Automated off-box backups are mandatory, not optional, because NFC cards
  point at this data.
- Succession risk, accepted knowingly: the VPS and domain are currently owned
  personally by the founding maintainer, who commits to keep paying and hand
  over later. Mitigations required before cards are printed:
  1. The domain encoded on cards is registered to (or transferred to) a
     club-controlled account, with at least two officers able to log in.
  2. Cloudflare account is club-controlled for the same reason.
  3. A written handover checklist lives in this repo (docs/runbook/handover.md).
- Mixed-skill maintainers must be able to redeploy from a README in under an
  hour. That caps stack complexity at one app, one database, one deploy target.

## Alternatives considered
- AWS serverless on credits: rejected by the club; it prefers self-hosting and
  does not want to depend on credit availability.
- Fully managed PaaS (Vercel + hosted Postgres): rejected by the club in favour
  of self-hosting the backend.

## Open questions
- Handover date and the second officer who holds registrar and Cloudflare access.
