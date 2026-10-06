# Cloudflare runbook: DNS, TLS, firewall, Access

Implements C0.5 and C0.6. The Cloudflare account is club-controlled (club email), with two officers as members (`handover.md`).

## DNS (proxied, orange cloud on)

| Name | Type | Target | Proxy |
|------|------|--------|-------|
| `@` | A | VPS IPv4 | on |
| `www` | CNAME | `<domain>` | on |
| `admin` | A | VPS IPv4 | on |

Cards encode `https://<domain>/p/<id>`; the VPS IP never appears anywhere a user sees, so the host can be swapped with a DNS change (ADR-0003).

## TLS

- SSL/TLS mode: **Full (strict)**.
- Origin certificate: create a Cloudflare Origin CA cert for `<domain>`, `*.<domain>` (15 years) and install it on Coolify's proxy (Traefik) as the certificate for all three hosts. Coolify: Server → Proxy → add the cert files, or terminate with the origin cert in the proxy dynamic config.
- Edge: "Always use HTTPS" on, minimum TLS 1.2, HSTS enabled after a week of clean operation (C4.7).

## Cache rule

Bypass cache for `/p/*` and `/api/*` (profiles change, health must be live); default caching for `/_next/static/*` and `/brand/*`.

## VPS firewall

Only Cloudflare may reach 80/443; SSH only from a known IP or Tailscale:

```bash
ADMIN_CIDR=<your-ip>/32 sudo scripts/cloudflare-firewall.sh
```

Verify: `curl -m 5 http://<vps-ip>` times out; `curl https://<domain>/api/health` returns 200; `dig +short <domain>` returns Cloudflare IPs, not the VPS.

## Cloudflare Access on `admin.<domain>` (C0.6)

1. Zero Trust → Access → Applications → Add → Self-hosted. Domain `admin.<domain>`, session duration **24h**.
2. Policy "Officers": action Allow, include **Emails** → the officer list. Keep the list mirrored in `handover.md`.
3. Identity: One-time PIN is enough (no IdP needed). Optionally add Google.
4. Verify in an incognito window: `https://admin.<domain>` shows the Access login page, not the app. After login, the app still checks `isAdmin` server-side (ADR-0008).

## Status (2026-10-03)

Runbook and firewall script are in place. DNS, TLS, cache rule and the Access application are **not configured yet**: they need the club Cloudflare account and the domain (C0.10).
