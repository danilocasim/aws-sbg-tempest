# ADR-0014: Sign-in is email and password, with email-based reset

- Status: accepted, supersedes ADR-0004
- Date: 2026-10-02

## Context
ADR-0004 chose passwordless magic links to avoid reset tickets and keep email
off the login critical path for every sign-in. The club reconsidered and
prefers the familiar email-and-password flow for members.

## Decision
- A Member signs in with their email and a password.
- Passwords are hashed with Argon2id (bcrypt acceptable if the runtime lacks
  Argon2). Never stored or logged in plain text. Minimum 12 characters, checked
  against a breached-password list (e.g. the HIBP k-anonymity API) at set time.
- Account creation on application accept (ADR-0010) sends a **set-password
  link** (single use, 24h expiry) instead of a magic link. The account has no
  usable password until the Member sets one.
- "Forgot password" sends a single-use reset link (1h expiry) via the
  transactional email provider. Admins can also trigger a reset from the admin
  app, which is the fallback for members who cannot receive mail.
- Login is rate-limited per account and per IP. Sessions are server-side,
  HttpOnly cookies, revocable from the admin app.
- Admins use the same credentials; the admin app additionally sits behind
  Cloudflare Access (ADR-0008), so admin login is effectively two-factor.
- Changing the login email remains admin-assisted (carried over from ADR-0004).

## Consequences
- Day-to-day sign-in no longer depends on email delivery; only onboarding and
  resets do.
- Next year's officers will field reset requests. The admin "send reset" button
  and this runbook entry exist to make that a one-click task.
- Password handling is now a security surface the Technical department owns:
  hashing, breach checks, rate limits, and session revocation are launch
  requirements, not follow-ups.
- Auth.js Credentials provider is used; magic-link email provider is removed.

## Alternatives considered
- Keep magic links (ADR-0004): rejected by the club in favour of familiarity.
- Password plus optional magic link: rejected, two paths to maintain.
- Google sign-in: still rejected for the reasons in ADR-0004.
