#!/usr/bin/env bash
# Restore an age-encrypted custom-format dump into a database (default: a scratch DB, never the live one).
# usage: restore.sh <dump.age|dump> <target DATABASE_URL>     env: AGE_SECRET_KEY_FILE (identity file) when the dump is .age
set -euo pipefail
SRC="${1:?dump file}"; TARGET="${2:?target DATABASE_URL}"
case "$TARGET" in *tempest_scratch*|*scratch*) ;; *) echo "refusing: target is not a scratch database ($TARGET)"; exit 2;; esac
if [[ "$SRC" == *.age ]]; then
  : "${AGE_SECRET_KEY_FILE:?}"; age -d -i "$AGE_SECRET_KEY_FILE" "$SRC" > /tmp/restore.dump; SRC=/tmp/restore.dump
fi
pg_restore --no-owner --no-privileges --clean --if-exists --exit-on-error --dbname="$TARGET" "$SRC"
echo "restored $1 into $TARGET"
