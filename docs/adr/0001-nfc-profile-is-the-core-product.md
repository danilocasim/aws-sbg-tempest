# ADR-0001: The NFC member profile is the core product

- Status: accepted
- Date: 2026-10-02

## Context
The brief lists a landing page, directors/officers/departments showcase, events,
member profiles for NFC networking, an admin area, and membership/officer
applications. Asked which single piece must work this semester for the site to
count as a win, the club chose the NFC profile pages.

## Decision
The member Profile reachable from a physical NFC Card is the primary product.
Every other feature is prioritized by how much it supports creating, keeping
accurate, and discovering Profiles. Scope cuts fall on the showcase, events, and
application features before they fall on Profiles.

## Consequences
- Profile URLs are a permanent contract: a card encoded today must still resolve
  in four years. URL scheme and domain ownership are now first-class decisions.
- Profile pages must load fast on a phone over mobile data (the tap-to-open path).
- Members must be able to keep their own links current (see ADR-0002).
- The landing page can ship as mostly static content without blocking the win.

## Alternatives considered
- Recruitment funnel first: rejected, applications can keep running on a form tool
  for one more cycle without losing anything irreversible.
- Showcase first: rejected, a brochure has no physical dependency and can be
  redone at any time.
