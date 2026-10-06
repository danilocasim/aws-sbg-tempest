# Handover checklist (owner → next officers)

Status: skeleton. Fill in as accounts are created.

| Asset | Account owner today | Second holder | Transfer plan |
|-------|---------------------|---------------|---------------|
| Domain registrar | founding maintainer (personal) | TBD | move to club account before first card print |
| Cloudflare | TBD | TBD | club account from day one |
| VPS provider | founding maintainer (personal) | TBD | stays personal for now; DNS makes it swappable |
| Coolify admin | TBD | TBD | |
| Email provider (Resend/Brevo) | TBD | TBD | |
| GitHub repo | TBD | TBD | org-owned, 2 admins |
| Postgres backups location | TBD (B2 bucket to create) | TBD | off-box, encrypted with age; restore drill 2026-10-03 (`backups.md`) |
| age backup secret key | TBD | TBD | two holders in password managers; never in the repo |

## Cloudflare Access allow-list (admin.<domain>)

Mirror of the Access policy "Officers" (`cloudflare.md`). Update both when officers change.

| Email | Role | Added |
|-------|------|-------|
| TBD | founding maintainer | |
| TBD | Technical head | |

## Runbooks

`deploy.md` (Coolify), `cloudflare.md` (DNS/TLS/firewall/Access), `backups.md`, `email.md`, `domain.md`.

## Routine tasks

- **Member forgot password and cannot receive reset mail:** admin app → Members → open member → "Send password reset". Verify identity (student ID or known officer vouch) first.
