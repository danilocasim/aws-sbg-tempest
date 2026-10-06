# C4 · Handover hardening (week 12)

**Goal:** the site survives the author's graduation. Someone else holds every key, has restored a backup, and has redeployed from zero.
**ADRs:** 0003 (succession risk and mitigations).
**Exit criteria:** `docs/runbook/handover.md` has no TBD; a non-author Technical officer completed C4.3 and C4.4 and signed this file.

## Tasks

### C4.1 / C4.2 Accounts and second holders
For each: registrar, Cloudflare, Coolify, VPS provider (read-only billing access at least), email provider, GitHub org, backup storage, uptime monitor, Turnstile.
- Second holder logs in independently and confirms.
- Shared club password manager vault (Bitwarden free org) holds recovery codes.

### C4.3 Restore drill
- Non-author runs `scripts/restore.sh` with last night's dump into a scratch Postgres, points a local web app at it, opens a known `/p/<id>`. Record date, duration, and operator in the runbook.

### C4.4 Redeploy from zero
- README section "Redeploy from zero": new Coolify project → Postgres → env vars → web → admin → Cloudflare DNS switch → run migrations → restore dump → smoke test. Target: under 60 minutes by someone who did not build it. Time it.

### C4.5 Break-glass
- `isSuperAdmin=true` for the author and one current officer. Document in runbook. Test: in a scratch DB, unset the current Term; both still reach admin.

### C4.6 Monitoring
- Free uptime monitor (e.g. Uptime Kuma self-hosted in Coolify, or a free SaaS tier) on `/api/health` for web and admin, and on one `/p/<sample-id>`. Alerts to a club inbox and one officer's phone. Disk-usage alert at 80%.

### C4.7 Security pass
- `pnpm audit` no high/critical; Dependabot on.
- Headers: CSP (self + Cloudflare), HSTS preload, X-Frame-Options DENY on admin, Referrer-Policy strict-origin.
- Confirm rate limits from C1.5 in production. Rotate `AUTH_SECRET`, DB password, email API key once as a rehearsal; document the procedure.

## Sign-off

| Check | Operator (not author) | Date | Result |
|-------|-----------------------|------|--------|
| Restore drill | | | |
| Redeploy from zero | | | |
| Second-holder logins | | | |
