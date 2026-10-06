#!/usr/bin/env bash
# Restore drill from the host: pulls the latest dump from the rclone remote (or uses a local file),
# restores into a fresh `tempest_scratch` database, then runs `pnpm db:check` and a row count.
# usage: scripts/restore.sh [dump-file]      env: PG_URL_BASE (postgres://user@host:5432), RCLONE_REMOTE, AGE_SECRET_KEY_FILE
set -euo pipefail
BASE="${PG_URL_BASE:-postgres://localhost:5432}"
SCRATCH="$BASE/tempest_scratch"
DUMP="${1:-}"
if [ -z "$DUMP" ]; then
  : "${RCLONE_REMOTE:?set RCLONE_REMOTE or pass a dump file}"
  LATEST="$(rclone lsf "$RCLONE_REMOTE/db/" | sort | tail -1)"
  rclone copy "$RCLONE_REMOTE/db/$LATEST" /tmp/ && DUMP="/tmp/$LATEST"
fi
echo "restoring $DUMP → $SCRATCH"
psql "$BASE/postgres" -v ON_ERROR_STOP=1 -q -c "drop database if exists tempest_scratch" -c "create database tempest_scratch"
if [[ "$DUMP" == *.age ]]; then : "${AGE_SECRET_KEY_FILE:?}"; age -d -i "$AGE_SECRET_KEY_FILE" "$DUMP" > /tmp/restore.dump; DUMP=/tmp/restore.dump; fi
pg_restore --no-owner --no-privileges --exit-on-error --dbname="$SCRATCH" "$DUMP"
psql "$SCRATCH" -At -c "select 'members='||count(*) from members" -c "select 'migrations='||count(*) from drizzle.__drizzle_migrations"
DATABASE_URL="$SCRATCH" pnpm --filter @tempest/db db:check
echo "restore drill OK: $(date -u +%Y-%m-%dT%H:%MZ)"
