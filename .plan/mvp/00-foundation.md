# C0 · Foundation (weeks 1-2)

**Goal:** both apps deploy from `main` via Coolify, DB is migrated by the pipeline, nightly backup is proven restorable, admin is unreachable without Cloudflare Access.
**ADRs:** 0003 (hosting), 0007 (stack), 0008 (separate admin).
**Exit criteria:** all C0 rows in TODO.md ticked; a stranger can clone, `pnpm i`, `docker compose up`, `pnpm dev` and see both apps.

## Layout

```
apps/web          Next.js App Router, public + member area      → <domain>
apps/admin        Next.js App Router, admin only                 → admin.<domain>
packages/db       Drizzle schema, migrations, seed, query helpers, auth helpers (isAdmin…)
packages/ui       shared components (buttons, forms, profile card)
packages/config   eslint, tsconfig, tailwind presets
docker/           Dockerfile.web, Dockerfile.admin, compose.yaml (local Postgres + mailpit)
.github/workflows ci.yml
```

## Tasks

### C0.1 Monorepo
- pnpm workspaces + Turborepo (or plain pnpm `-r` if Turbo feels heavy for the team).
- Node LTS pinned in `.nvmrc` and `package.json#engines`.
- Verification: fresh clone → `pnpm i && pnpm -r build` green.

### C0.2 Schema and migrations
- Translate `docs/domain-model.md` 1:1 into Drizzle. Table names snake_case, plural.
- Constraints enforced in DB, not only app code:
  - `members.canonical_id` unique, `members.email` unique (citext), `members.handle` unique nullable
  - `terms`: partial unique index `WHERE is_current` (one current)
  - `positions`: partial unique `(department_id, term_id) WHERE is_head`; check `kind='director' ⇒ department_id IS NULL`
  - `application_windows`: unique `(term_id, kind)`
  - `audit_log(id, actor_member_id, action, target_table, target_id, diff jsonb, created_at)`
- Seed: 1 current Term, 1 past Term, 4 Departments (Technical, Marketing, Events, Partnerships), 1 super admin, 5 fake members, 3 events, `pages` slots.
- Scripts: `db:generate`, `db:migrate`, `db:seed`, `db:check` (drizzle-kit check), `db:studio`.
- Migrations run as a Coolify pre-deploy command, never at container start of both apps (race).

### C0.3 Docker
- `output: 'standalone'` in both `next.config`. Multi-stage build; final image `node:lts-alpine`, non-root user.
- Uploads volume for web at `/app/uploads` (ADR-0012). Admin mounts the same volume read-write for moderation.
- `compose.yaml` for local: postgres:16, mailpit (catches set-password/reset mail), both apps.

### C0.4 Coolify
- One project "tempest", three resources: `postgres`, `web`, `admin`. Private network between them; Postgres not exposed publicly.
- Env vars per app: `DATABASE_URL`, `AUTH_SECRET`, `EMAIL_API_KEY`, `EMAIL_FROM`, `PUBLIC_BASE_URL`, `UPLOADS_DIR`.
- Health checks: `GET /api/health` returns `{ok, db: true}`.
- Auto-deploy webhook from GitHub `main`. Preview deploys are out of scope for v1.

### C0.5 / C0.6 Cloudflare
- Account on a club email; two officers as members (C0.10 and C4.2 track ownership).
- DNS: `@` and `www` → VPS (proxied), `admin` → VPS (proxied). SSL/TLS "Full (strict)" with a Cloudflare origin cert on Coolify's proxy.
- VPS firewall (ufw or provider firewall): 80/443 only from Cloudflare IP ranges; 22 from a known IP or via Tailscale.
- Access: application on `admin.<domain>`, policy "allow emails in list", session 24h. List maintained in Cloudflare, mirrored in `docs/runbook/handover.md`.
- Cache rule: bypass cache for `/p/*` (profiles change) except static assets.

### C0.7 Backups
- Cron container or Coolify scheduled task: `pg_dump -Fc` nightly → rclone to off-box free storage (e.g. Backblaze B2 10 GB free, or a second provider's object storage). Encrypt with age before upload.
- Also back up the uploads volume weekly (photos, ADR-0012).
- `scripts/restore.sh <dump>` into `postgres-scratch`, then `pnpm db:check`.
- Record the first successful drill in the runbook with date and operator.

### C0.8 Email
- Provider: Resend or Brevo free tier. Sending domain `mail.<domain>` or apex; SPF, DKIM, DMARC `p=quarantine`.
- Templates (React Email or plain MJML): `set-password`, `reset-password`, `application-received`, `application-decision`.
- Local dev sends to mailpit; never to real inboxes.

### C0.9 CI
- GitHub Actions: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm -r build`, `pnpm db:check` against a service Postgres.
- Branch protection on `main`: CI required, 1 review.

### C0.10 Domain
- The domain encoded on cards is registered to or transferred into a club-controlled registrar account (ADR-0003 mitigation 1). Must be done before C1.11 prints anything.

## Risks
- Coolify upgrade breaking deploys → pin Coolify version, upgrade only after a backup.
- VPS disk full from uploads/backups → alert at 80% (C4.6), retention policy on dumps.

## Status (2026-10-03)

Code, images, scripts and runbooks for every C0 row are in the repo and verified locally (`evidence/C0-verification.md`).
What is still blocked on accounts the author cannot create alone, in the order to do them:

1. **C0.10 domain** (`docs/runbook/domain.md`): register/transfer under the club registrar account, two officers on it. Blocks everything below.
2. **C0.5 / C0.6 Cloudflare** (`docs/runbook/cloudflare.md`): DNS, Full (strict) TLS with an origin cert, cache bypass for `/p/*`, `scripts/cloudflare-firewall.sh` on the VPS, Access application on `admin.<domain>`.
3. **C0.4 Coolify** (`docs/runbook/deploy.md`): project `tempest`, Postgres + web + admin, env vars, uploads volume, `node /app/migrate.mjs` as the web pre-deploy command, auto-deploy from `main`. Then verify "push → both URLs update within 10 min".
4. **C0.7 off-box target** (`docs/runbook/backups.md`): B2 bucket + rclone config + age keypair, add the `backup` resource. The restore drill already passed locally; repeat it from the first real dump and log it.
5. **C0.8 sending domain** (`docs/runbook/email.md`): Resend domain, SPF/DKIM/DMARC, mail-tester 10/10 and a Gmail inbox check. Local path (SMTP → mailpit) is verified.
6. **C0.9 branch protection**: push the repo, require the `CI / check` job, open a PR with a deliberately failing test and confirm merge is blocked. The workflow itself is written.

Decisions taken while building (deviations from the text above):
- Postgres **18** everywhere (compose, CI, backup client) instead of 16: the author's machine already runs 18 and `pg_dump`/`pg_restore` must match the server major; nothing in the schema needs 18-only features (uuid v7 is generated in the app).
- Plain `pnpm -r` instead of Turborepo; builds take under a minute, so a task cache is not worth another tool.
- Next.js 16, Tailwind v4 (CSS-first: the "preset" is the `@theme` block in `packages/ui/styles.css`), ESLint 9 flat config (the Next plugins do not support ESLint 10 yet), TypeScript 5.9 (TS 7 is too new for the Next type plugin).
- `packages/email` was added as its own package (the layout lists it under neither `db` nor `ui`); it holds the sender and templates.
- `logo-mark.svg` is a simplified geometric mark, not a vector trace of the dragon logo; the PNG stays the source for nav/favicon/OG until Marketing supplies vector art. Dragon source art is still the 440×480 crop (`dragon-src.png`); `dragon-440.webp` is 72 kB, `dragon-220.webp` 27 kB.
- `/dev/ui` is prerendered as a 404 in production builds (`notFound()` at build time); run it with `pnpm dev` or set `DEV_UI=1` at build time.
- Local ports: compose publishes Postgres on **5433** (a local Postgres usually owns 5432); `PG_PORT`, `WEB_PORT`, `ADMIN_PORT` override the host ports.
