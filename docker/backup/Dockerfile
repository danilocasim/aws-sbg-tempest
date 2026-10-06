# Nightly pg_dump → age-encrypt → rclone to off-box storage, with retention. Runs crond in the foreground.
FROM alpine:3.21
RUN apk add --no-cache postgresql18-client rclone age bash tzdata curl
COPY backup.sh restore.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/backup.sh /usr/local/bin/restore.sh
ENV BACKUP_CRON="10 19 * * *" BACKUP_RETENTION_DAYS=30
CMD ["/bin/bash", "-c", "echo \"$BACKUP_CRON /usr/local/bin/backup.sh >> /proc/1/fd/1 2>&1\" | crontab - && echo \"backup cron: $BACKUP_CRON\" && crond -f -l 2"]
