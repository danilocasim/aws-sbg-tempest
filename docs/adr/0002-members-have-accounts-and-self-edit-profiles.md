# ADR-0002: Members have accounts and edit their own Profiles

- Status: accepted (auth mechanism: ADR-0014)
- Date: 2026-10-02

## Context
A Profile holds LinkedIn, Facebook, photo and bio. These go stale. The club had
to choose between admin-only editing, edit-by-request, or member self-service.

## Decision
Every Member has a login and edits their own Profile. Admins can also edit any
Profile for moderation and recovery.

## Consequences
- The site is a multi-user application, not a single-admin CMS. It needs
  sign-in, account recovery, and a role model (Member vs Admin at minimum).
- Onboarding flow is required: an accepted Application must become an account.
- Moderation surface is required: an admin can hide or correct a Profile.

## Alternatives considered
- Admin-only edits via request form: simpler to build, rejected because officers
  will not keep up with change requests and links will rot.
- Frozen-at-application: rejected, contradicts the networking purpose.
