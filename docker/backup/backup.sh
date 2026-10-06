#!/usr/bin/env bash
# Dumps Postgres (custom format), encrypts with age, uploads with rclone, prunes old copies.
# Env: DATABASE_URL, AGE_PUBLIC_KEY, RCLONE_REMOTE (e.g. b2:tempest-backups), BACKUP_RETENTION_DAYS (30),
#      UPLOADS_DIR (/app/uploads, tar'd weekly on Sundays), BACKUP_DIR (/backups, local staging), HEALTHCHECK_URL (optional ping).
set -euo pipefail
: "${DATABASE_URL:?}" "${AGE_PUBLIC_KEY:?}" "${RCLONE_REMOTE:?}"
RET="${BACKUP_RETENTION_DAYS:-30}"; DIR="${BACKUP_DIR:-/backups}"; UP="${UPLOADS_DIR:-/app/uploads}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"; mkdir -p "$DIR"
DUMP="$DIR/tempest-$STAMP.dump.age"
echo "[$STAMP] pg_dump → $DUMP"
pg_dump --format=custom --no-owner --no-privileges "$DATABASE_URL" | age -r "$AGE_PUBLIC_KEY" > "$DUMP"
test -s "$DUMP"
rclone copy --quiet "$DUMP" "$RCLONE_REMOTE/db/"
if [ "$(date -u +%u)" = "7" ] && [ -d "$UP" ]; then
  TAR="$DIR/uploads-$STAMP.tar.gz.age"; tar -C "$UP" -czf - . | age -r "$AGE_PUBLIC_KEY" > "$TAR"
  rclone copy --quiet "$TAR" "$RCLONE_REMOTE/uploads/"; echo "uploads archived → $TAR"
fi
rclone delete --quiet --min-age "${RET}d" "$RCLONE_REMOTE/db/"
rclone delete --quiet --min-age "$((RET * 3))d" "$RCLONE_REMOTE/uploads/"
find "$DIR" -type f -mtime +2 -delete
echo "[$STAMP] done: $(du -h "$DUMP" | cut -f1); remote has $(rclone lsf "$RCLONE_REMOTE/db/" | wc -l) dumps"
[ -n "${HEALTHCHECK_URL:-}" ] && curl -fsS -m 10 "$HEALTHCHECK_URL" >/dev/null || true
