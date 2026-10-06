# ADR-0007: Stack is Next.js, TypeScript, and Postgres

- Status: accepted
- Date: 2026-10-02

## Context
Maintainers after this year are mixed-skill students. Hosting is Coolify on a
VPS (ADR-0003) which runs Docker containers. Sign-in is email and password (ADR-0014).

## Decision
- Next.js (App Router) with TypeScript for every web surface.
- Postgres as the only database. Schema and migrations in the repo, applied on
  deploy. ORM: Drizzle (type-safe, SQL-shaped, small learning curve); Prisma is
  the acceptable alternative if the team already knows it.
- Auth.js (next-auth) Credentials provider with Argon2id hashing; the
  transactional email service from ADR-0003 handles set-password and reset links.
- Deployed as Docker images built from the repo; Coolify runs them.
- Monorepo with pnpm workspaces so a shared `db` package can be used by more
  than one app (see ADR-0008 on the admin surface).

## Consequences
- One language end to end. A student who knows React can contribute anywhere.
- Server Components make the public Profile page a fast, cacheable render.
- Coolify builds need a Dockerfile with Next.js standalone output.

## Alternatives considered
- Django/FastAPI + JS frontend: rejected, two languages double onboarding.
- Laravel/Rails: rejected, no existing club familiarity.
