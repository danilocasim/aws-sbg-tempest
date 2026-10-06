# ADR-0012: Profile fields, derived badge, and opt-in vCard

- Status: accepted
- Date: 2026-10-02

## Context
The Profile is what a card tap opens (ADR-0001). It must be useful to a
stranger in ten seconds and safe for a student to publish.

## Decision
Member-editable fields:
- photo, display name, headline (course and year), short bio (markdown-lite)
- links: LinkedIn, Facebook, GitHub, personal site (each optional, validated
  as URLs on the expected host where one exists)
- vCard contact exposure: opt-in. A Member may expose an email and/or phone
  specifically for the "Save contact" button. These are stored separately
  from the login email and default to empty.
- visibility: `public` (default) | `card-only` (hidden from directory) |
  `inactive` (neutral page) (ADR-0006)

System-derived, not editable by the Member:
- current Position and Department badge (ADR-0009)
- canonical URL and optional handle (ADR-0005)
- member-since Term

"Save contact" downloads a `.vcf` built from display name, headline, the
exposed contact fields, the Profile URL, and the club as organization. If the
Member exposed nothing, the button still works and carries name, URL, and
organization only.

## Consequences
- Photo upload needs size limits and server-side resize; stored on the VPS
  volume (ADR-0003) under the Member's canonical ID so a rebuild is restorable
  from backup.
- Public render must be fast on mobile: Server Component, cached, no client JS
  except the vCard button.

## Alternatives considered
- Expose login email on the Profile: rejected, forces every member to publish
  the address they sign in with.
