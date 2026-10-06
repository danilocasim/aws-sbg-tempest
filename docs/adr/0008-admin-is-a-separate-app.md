# ADR-0008: Admin is a separate app sharing the database

- Status: accepted
- Date: 2026-10-02

## Context
The club chose a separate admin application over role-gated routes in the
public app. The maintainer cost is two deploys and two auth configurations.

## Decision
- Monorepo: `apps/web` (public site, member area) and `apps/admin`.
- Both import `packages/db` (Drizzle schema, migrations, queries) so there is
  exactly one schema definition.
- `apps/admin` is served at `admin.<club-domain>` and sits behind Cloudflare
  Access (free tier) so only allow-listed emails reach it at all. Inside, it
  still checks the Admin role on the Member record.
- Both apps use the same email-and-password auth (ADR-0014) and the same `members` table;
  Admin is a role, not a separate account.

## Consequences
- Two Coolify services, two Dockerfiles, one database.
- Shared code lives in packages; copy-paste between apps is a review failure.
- Public app has zero admin code, which shrinks its attack surface.

## Alternatives considered
- Same app, role-gated routes: the maintainer's recommendation; declined by the
  club. Reason: security. The club wants no admin code shipped in, or reachable
  from, the public application. Cloudflare Access in front of `admin.<domain>`
  is the guardrail that makes this split worth two deploys.
- Headless CMS: rejected, member self-service does not fit CMS collections.
