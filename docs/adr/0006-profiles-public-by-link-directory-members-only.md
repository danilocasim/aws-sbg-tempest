# ADR-0006: Profiles are public by direct link; the directory is members-only

- Status: accepted
- Date: 2026-10-02

## Context
A stranger who taps a Member's card must see the Profile without logging in.
Whether anyone can also list all Members is a privacy question for students.

## Decision
- A Profile page at its canonical URL (ADR-0005) is public and requires no login.
- The Member directory (list, search, filter by Department or batch) is visible
  only to signed-in Members.
- Profile pages are not linked from any public listing and carry
  `noindex` so search engines do not build a directory for us.
- A Member can set their Profile to "card only" (public by URL, hidden from the
  members directory) or deactivate it (shows the neutral inactive page).

## Consequences
- Two render modes for the same Profile: public (card tap) and member view
  (directory). Contact fields can be gated to the member view later.
- Directory features (search, filters) wait until member login works.

## Alternatives considered
- Fully public directory: rejected, exposes a scrapeable list of students.
- No directory: rejected, loses the internal networking value.
