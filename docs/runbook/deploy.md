# Deploy runbook: Coolify

Implements C0.4 (`.plan/mvp/00-foundation.md`). One Coolify project `tempest`, three resources on one private network. Postgres is never exposed publicly.

## Resources

| Resource | Type | Source | Port | Domain |
|----------|------|--------|------|--------|
| `postgres` | Database → PostgreSQL 18 | Coolify-managed | internal 5432 only | none |
| `web` | Application → Dockerfile | this repo, branch `main`, `docker/Dockerfile.web` | 3000 | `https://<domain>`, `https://www.<domain>` |
| `admin` | Application → Dockerfile | this repo, branch `main`, `docker/Dockerfile.admin` | 3001 | `https://admin.<domain>` |

Build context is the repository root (set "Base directory" to `/` and "Dockerfile location" to `docker/Dockerfile.web` / `docker/Dockerfile.admin`).

## Environment variables (per app; keys listed in `.env.example`, values only in Coolify)

| Key | web | admin | Notes |
|-----|-----|-------|-------|
| `DATABASE_URL` | ✓ | ✓ | internal URL from the Postgres resource (`postgres://…@postgres:5432/tempest`) |
| `AUTH_SECRET` | ✓ | ✓ | `openssl rand -base64 32`, same value in both apps |
| `PUBLIC_BASE_URL` | ✓ | ✓ | `https://<domain>` |
| `ADMIN_BASE_URL` | | ✓ | `https://admin.<domain>` |
| `EMAIL_API_KEY`, `EMAIL_FROM` | ✓ | ✓ | see `email.md` |
| `UPLOADS_DIR` | ✓ | ✓ | `/app/uploads` (default in the image) |

Storage: one persistent volume `tempest-uploads` mounted at `/app/uploads` on **both** web and admin (admin needs it for moderation, ADR-0012).

## Migrations

Migrations run once per deploy, never at container start of both apps (race). On the **web** resource only, set
Pre-deployment command: `node /app/migrate.mjs`. It applies `packages/db/migrations` with Drizzle's migrator and exits non-zero on failure, which aborts the deploy.

## Health checks and auto-deploy

- Health check path on both apps: `/api/health` (expects 200 and `{"ok":true,"db":true}`; returns 503 when the DB is unreachable).
- Enable "Auto deploy" with the GitHub app or the webhook on push to `main`. Preview deploys are out of scope for v1.
- Pin the Coolify version; upgrade only after a verified backup (`backups.md`).

## Redeploy from zero (target: under 60 minutes)

1. Install Coolify on a fresh VPS (official script), log in, add the GitHub source.
2. Create project `tempest`; add the Postgres resource; copy its internal URL.
3. Add `web` and `admin` as Dockerfile apps from this repo (`main`), set ports, domains, env vars, the uploads volume, the pre-deploy command on web, and health paths.
4. Deploy. Run `scripts/restore.sh <latest-dump>` against the new Postgres to bring data back (or `pnpm db:seed` for an empty club).
5. Point Cloudflare DNS at the new VPS (`cloudflare.md`); run `scripts/cloudflare-firewall.sh` on the box.
6. Verify: `curl https://<domain>/api/health`, `https://admin.<domain>` shows the Cloudflare Access login, a known `/p/<id>` renders.

## Local equivalent

`docker compose -f docker/compose.yaml up --build` runs Postgres (host port 5433), mailpit, a one-shot `migrate` job, then web (3000) and admin (3001) — the same images and the same start order as production.

## Status (2026-10-03)

Dockerfiles, compose stack, health endpoints, and the migrate bundle are in the repo and verified locally. The Coolify project itself is **not created yet**: it needs the VPS login and the domain (C0.10). Verification for C0.4 ("push a commit → both URLs update within 10 min") is pending that setup.
