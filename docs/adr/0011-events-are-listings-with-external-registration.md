# ADR-0011: Events are listings with an external registration link

- Status: accepted
- Date: 2026-10-02

## Context
Events are a showcase feature, secondary to Profiles (ADR-0001). The club
considered built-in RSVP and NFC check-in.

## Decision
An Event has title, start/end, venue (or online URL), cover image, markdown
description, an optional external registration URL, and the Department that
hosts it (nullable for club-wide). The site shows Upcoming and Past. No RSVP,
attendance, or check-in logic in version one.

## Consequences
- Registration lives in whatever tool the organizers already use.
- NFC check-in is explicitly deferred; if adopted later it becomes its own ADR
  and reuses the canonical Profile ID as the attendee key.

## Alternatives considered
- Built-in RSVP: rejected for v1, adds tables, emails, and moderation.
- NFC check-in: rejected for v1, competes with the primary NFC use case for
  the 3-month window.
