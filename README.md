# AWS Student Builder Group – Tempest · club website

Public site, member profiles for NFC cards, and an admin app. One pnpm monorepo, two Next.js apps, one Postgres (ADR-0007/0008).

```
apps/web          public site + member area      → <domain>        (port 3000)
apps/admin        admin app                      → admin.<domain>  (port 3001, behind Cloudflare Access)
packages/db       Drizzle schema, migrations, seed, health helper
packages/ui       tokens.css, Tailwind preset, components (design-system.md §7), /dev/ui preview in web
packages/email    transactional email sender + templates
packages/config   shared tsconfig + eslint
docker/           Dockerfile.web, Dockerfile.admin, compose.yaml, backup job
scripts/          restore.sh (backup drill), cloudflare-firewall.sh
```

## Run it

```bash
pnpm install
cp .env.example .env                     # keys only; fill DATABASE_URL etc.
docker compose -f docker/compose.yaml up -d postgres mailpit   # Postgres on localhost:5433, mailpit UI on :8025
pnpm db:migrate && pnpm db:seed          # DATABASE_URL=postgres://tempest:tempest@localhost:5433/tempest
pnpm dev                                 # web :3000, admin :3001; component preview at http://localhost:3000/dev/ui
```

Everything in one stack, same images as production: `docker compose -f docker/compose.yaml up --build`
(override host ports with `PG_PORT`, `WEB_PORT`, `ADMIN_PORT` if they are taken).

Checks: `pnpm lint`, `pnpm typecheck`, `pnpm test` (needs `DATABASE_URL` for the constraint tests), `pnpm build`, `pnpm db:check`,
`pnpm --filter @tempest/web axe` (axe + token check against a running dev server).

## Read first

- [Scope for version 1](docs/scope-v1.md) — what ships in the next ~3 months and in what order
- [Domain model](docs/domain-model.md) — entities, derived rules, surfaces
- [Glossary](docs/glossary.md) — the one name for each concept
- [Architecture decision records](docs/adr/) — why things are the way they are
- [Runbooks](docs/runbook/) — [deploy](docs/runbook/deploy.md), [Cloudflare](docs/runbook/cloudflare.md), [backups](docs/runbook/backups.md), [email](docs/runbook/email.md), [domain](docs/runbook/domain.md), [handover](docs/runbook/handover.md)
- [MVP plan](.plan/mvp/TODO.md) — clusters, tasks, verification; [design system](.plan/mvp/design-system.md); [clickable mockup](.plan/mvp/mockup/README.md)
