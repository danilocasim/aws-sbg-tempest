# ADR-0009: Roles are Positions held per Term; Admin is derived from Position

- Status: accepted
- Date: 2026-10-02

## Context
The landing page shows Directors, Officers, and Departments. Officers rotate
every academic year. Admin access must follow leadership without manual role
toggling each year.

## Decision
- A **Term** is an academic year (e.g. "AY 2026-2027") with start and end dates.
  Exactly one Term is "current".
- A **Department** is a long-lived unit (Technical, Marketing, ...). It has a
  name, description, and ordering.
- A **Position** is a Member holding a role during a Term. Two kinds:
  - Director position: club-level (President, Vice President, Secretary, ...),
    no Department.
  - Officer position: belongs to exactly one Department; one Officer per
    Department per Term is flagged as its Head.
- **Admin** access is derived, not stored: a Member is Admin for the current
  Term if they hold a Director position, or any Officer position in the
  Technical department. Other Officers may edit only their own Department's
  content and events. Plain Members have no admin access.
- A Member may hold several Positions over time; history is kept so past
  leadership can be shown.

## Consequences
- Rolling over a year is: create the new Term, create Positions, mark it
  current. Admin access moves automatically; nobody is left with stale access.
- A "break-glass" flag on a Member (`isSuperAdmin`) exists for the maintainer
  and one backup, independent of Term, documented in the handover runbook.
- The landing page renders Directors and Departments from the current Term.

## Alternatives considered
- Director as head of a Department only: rejected, the club has club-level roles.
- Free-text titles: rejected, cannot derive Admin access or render structure.
