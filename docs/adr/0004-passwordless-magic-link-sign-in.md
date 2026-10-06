# ADR-0004: Sign-in is a passwordless email magic link, any email address

- Status: superseded by ADR-0014 (email and password)
- Date: 2026-10-02

## Context
Members edit their own Profiles (ADR-0002), so they need to sign in. Options
were school Google sign-in, magic link, email+password, or several at once.
Alumni lose school accounts; passwords create reset tickets for next year's
officers; Google OAuth adds an app registration to hand over.

## Decision
A Member signs in by entering their email and clicking a one-time link sent by
the transactional email provider. Any email address is allowed. There are no
passwords and no third-party OAuth apps.

## Consequences
- Email deliverability is now on the critical path for login. The provider,
  sending domain, SPF/DKIM records, and a fallback (admin can issue a link) are
  part of the deployment checklist.
- A Member's identity is their email. Changing email is an admin-assisted
  action to avoid account takeover via self-service email change.
- Admins sign in the same way; admin rights are a role on the account, not a
  separate login system.

## Alternatives considered
- Google with school domain: rejected, alumni lose access and the OAuth app is
  one more owned asset to hand over.
- Email and password: rejected, highest support burden for the maintainers.
- Google plus magic link: rejected for now, adds surface area without a known
  need; can be added later without breaking existing accounts.
