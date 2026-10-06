# C0 verification evidence (2026-10-03, local machine: macOS arm64, Node 26, pnpm 9.15.9, Postgres.app 18, Docker Desktop 4.77)

| Task | Command / check | Result |
|------|-----------------|--------|
| C0.1 | `pnpm install` then `pnpm lint && pnpm typecheck && pnpm test && pnpm build` from the repo root | all green; `pnpm -r build` builds db (migrate bundle), email, ui, admin, web |
| C0.2 | `pnpm db:migrate && pnpm db:seed` on empty `tempest` DB; `pnpm db:check` | migrations applied in 86 ms; seeded 2 terms, 4 departments, 12 members, 14 positions, 6 events, 7 pages, 2 windows; "Everything's fine" |
| C0.2 | `pnpm --filter @tempest/db test` (DB constraints) | 5/5 pass: one current term, director/officer department check, one head per dept per term, citext email + canonical id check, one window per term/kind |
| C0.3 | `docker build` web + admin (`docker/Dockerfile.*`) | `docker save | wc -c`: web 83 MB, admin 79 MB (`docker image inspect .Size` agrees); `docker image ls` shows ~330 MB because Docker Desktop's containerd store counts compressed + unpacked content |
| C0.3 | `docker compose -f docker/compose.yaml up` (postgres, mailpit, migrate, web, admin) | migrate exited 0 ("migrations applied … 88 ms"); web and admin `healthy`; `/api/health` 200 `{ok:true,db:true}` on both; web `/` 200; admin `/` 200 showing 12 members; `/opengraph-image` 200 image/png; `/app/uploads` writable as user `app` |
| C0.7 | `scripts/restore.sh <pg_dump -Fc of dev DB>` | restored into `tempest_scratch`, `db:check` clean; logged in `docs/runbook/backups.md` |
| C0.8 | `SMTP_URL=smtp://localhost:1025 pnpm email:test maya@example.edu` with mailpit from compose | "sent via smtp"; mailpit API shows 1 message "Set your Tempest password" to maya@example.edu |
| C0.11 | `pnpm --filter @tempest/ui test` | 60/60: every §2.2 / §5 / type / shape token defined and resolvable; §2.3 contrast table reproduced (white/bg 20.2, body 16.5, eyebrow 10.8, faint 6.6, ember-ink/ember 9.9, ember/bg 9.6, gold/plum 8.4, aurora-2/bg 9.3, body/surface 15.3, border/surface 1.3); all text tokens ≥ 4.5:1 on bg, bg-band, surface |
| C0.11 / C0.12 | `node apps/web/scripts/axe.mjs http://localhost:3020` against `next dev` | mobile 390px and desktop 1280px: axe violations 0 (wcag2a/aa, wcag21a/aa, best-practice); tokens unresolved 0/102 via `getComputedStyle` |
| C0.12 | screenshots `C0.12-dev-ui-mobile.png`, `C0.12-dev-ui-desktop.png` (this folder) | all 17 §7 rows rendered in their listed states |
| C0.13 | `pnpm --filter @tempest/web brand` | dragon-440.webp 72.5 kB, dragon-220.webp 26.8 kB (cap 120 kB); icon-192/512, apple-touch-icon, favicon.ico (16/32/48); OG rendered by `sharp` metadata as 1200×630 png |

Not verifiable here (needs accounts/domain): C0.4 push-to-deploy timing, C0.5 `dig`/firewall, C0.6 incognito Access login, C0.7 off-box retention, C0.8 mail-tester/Gmail, C0.9 blocked merge on a PR, C0.10 registrar logins.
