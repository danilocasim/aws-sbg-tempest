# Backups runbook

Implements C0.7. NFC cards point at this database, so off-box backups are part of the minimum deployment (ADR-0003).

## What runs

`docker/backup/` builds a small Alpine image (`postgresql18-client`, `rclone`, `age`, `crond`). Nightly at 03:10 Asia/Manila (`BACKUP_CRON=10 19 * * *` UTC) it:

1. `pg_dump --format=custom` of `DATABASE_URL`, piped through `age -r $AGE_PUBLIC_KEY` (encrypted before it leaves the box),
2. `rclone copy` to `$RCLONE_REMOTE/db/` (Backblaze B2 free tier, or any S3-compatible bucket),
3. on Sundays also tars `/app/uploads` (member photos) to `$RCLONE_REMOTE/uploads/`,
4. prunes dumps older than `BACKUP_RETENTION_DAYS` (30) and upload archives older than 90 days.

On Coolify: add it as a fourth resource (Dockerfile app from `docker/backup`, no domain, no port) on the same network, mount the uploads volume read-only, and mount an rclone config with the bucket credentials. Env: `DATABASE_URL`, `RCLONE_REMOTE`, `AGE_PUBLIC_KEY`, `BACKUP_RETENTION_DAYS`, optional `HEALTHCHECK_URL` (free healthchecks.io ping; alerts if a night is missed).

Locally: `RCLONE_REMOTE=… AGE_PUBLIC_KEY=… docker compose -f docker/compose.yaml --profile ops up backup`.

## Keys

- `age-keygen -o tempest-backup.key` once. The **public** key goes in Coolify env. The **secret** key is held by two officers (password manager), never in the repo. Without it, dumps cannot be restored.

## Restore

```bash
# into a scratch database, never the live one (the script refuses otherwise)
PG_URL_BASE=postgres://user@host:5432 AGE_SECRET_KEY_FILE=~/tempest-backup.key RCLONE_REMOTE=b2:tempest-backups scripts/restore.sh
# or from a local file
scripts/restore.sh /path/to/tempest-2026…dump.age
```

The script creates `tempest_scratch`, restores, prints row counts, and runs `pnpm db:check`. To promote a restore to live: point `DATABASE_URL` at it, or `pg_restore` into the live DB during a maintenance window.

## Drill log

| Date | Operator | Source | Result |
|------|----------|--------|--------|
| 2026-10-03 | founding maintainer (author) | local `pg_dump -Fc` of the seeded dev DB (36 kB) → `tempest_scratch` on Postgres 18 | OK: 12 members restored, migrations table intact, `db:check` clean |

Next: C4.3 requires the drill to be repeated by a non-author from a real off-box dump.
