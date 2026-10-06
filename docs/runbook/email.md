# Email runbook

Implements C0.8. `packages/email` sends through SMTP when `SMTP_URL` is set (local mailpit, never real inboxes) and through the Resend HTTP API when `EMAIL_API_KEY` is set (production).

## Provider setup (Resend free tier: 3,000 mails/month, 100/day)

1. Create the account on the club email; add a second officer (`handover.md`).
2. Domains → Add `<domain>` (or `mail.<domain>`), region closest to Manila.
3. Add the DNS records Resend shows, in Cloudflare with proxy **off** (DNS only):
   - SPF: `TXT @ "v=spf1 include:amazonses.com ~all"` (merge if an SPF record exists),
   - DKIM: the three `CNAME` records,
   - DMARC: `TXT _dmarc "v=DMARC1; p=quarantine; rua=mailto:<club email>"`.
4. Create an API key with "Sending access" only; set `EMAIL_API_KEY` and `EMAIL_FROM="Tempest <no-reply@<domain>>"` in Coolify for both apps.

## Templates

`set-password` (ADR-0014) ships now; `reset-password`, `application-received`, `application-decision` are added in C1/C3 using the same `layout()`.

## Test

```bash
pnpm email:test you@example.test          # local: lands in mailpit at http://localhost:8025
EMAIL_API_KEY=… EMAIL_FROM=… pnpm email:test <mail-tester address>   # prod: aim for 10/10 on mail-tester.com
```

## Status (2026-10-03)

Sender and template are implemented with unit tests. Domain verification, SPF/DKIM/DMARC, and the mail-tester/Gmail check are **pending the domain (C0.10)**.
