# ADR-0010: Accepting a membership Application creates the Member and sends a set-password link

- Status: accepted
- Date: 2026-10-02

## Context
The site hosts two application kinds: membership and officer. Manual account
creation does not scale for mixed-skill admins and delays card printing.

## Decision
- **Membership Application**: public form (name, email, course/year, why join,
  consent to privacy notice). Status: submitted → accepted | rejected |
  waitlisted. On accept, the system creates the Member, generates the canonical
  Profile ID (ADR-0005), and emails a set-password link (ADR-0014). The Member lands
  on "complete your profile".
- **Officer Application**: available only to existing Members, for a chosen
  Department and the upcoming or current Term. Reviewed and decided by
  Directors. On accept, a Position is created (ADR-0009).
- An Application window (open/close dates) is set per Term per kind so forms
  close themselves.
- Rejections are soft: the record is kept, the applicant may reapply next Term.
- Duplicate detection by email: an existing Member cannot submit a membership
  Application; they are told to sign in.

## Consequences
- Email is on the critical path for onboarding as well as login.
- A consent checkbox and a privacy notice page are required before launch.
- Card printing export = accepted Members for the current Term with canonical URLs.

## Alternatives considered
- Batch member creation: rejected, adds a manual step; batching the card print
  does not require batching account creation.
- Keep Google Forms: rejected as the end state, but acceptable as a stop-gap if
  the 3-month deadline forces a cut (see MVP scope).
