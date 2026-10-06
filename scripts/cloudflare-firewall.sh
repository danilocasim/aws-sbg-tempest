#!/usr/bin/env bash
# VPS firewall: allow 80/443 only from Cloudflare IP ranges, 22 only from ADMIN_CIDR (or Tailscale). Run as root on the VPS.
# usage: ADMIN_CIDR=203.0.113.4/32 scripts/cloudflare-firewall.sh      (re-run monthly; Cloudflare ranges change rarely)
set -euo pipefail
: "${ADMIN_CIDR:?set ADMIN_CIDR (your IP/32 or 100.64.0.0/10 for Tailscale)}"
command -v ufw >/dev/null || { apt-get update -qq && apt-get install -y -qq ufw; }
ufw --force reset >/dev/null
ufw default deny incoming; ufw default allow outgoing
ufw allow from "$ADMIN_CIDR" to any port 22 proto tcp comment "ssh admin"
for ip in $(curl -fsS https://www.cloudflare.com/ips-v4) $(curl -fsS https://www.cloudflare.com/ips-v6); do
  ufw allow from "$ip" to any port 80,443 proto tcp comment "cloudflare" >/dev/null
done
ufw --force enable; ufw status numbered | head -40
echo "Verify from outside: curl -m 5 http://<vps-ip> must time out; curl https://<domain> must work."
