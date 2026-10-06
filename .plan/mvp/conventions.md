# Conventions for the MVP build

Short rules that apply to every cluster. If a PR violates one, that is a review failure.

## Naming
- Code names are glossary names (`docs/glossary.md`): `Member`, `Profile` (view of a Member), `Term`, `Department`, `Position`, `Event`, `Page`, `MembershipApplication`, `OfficerApplication`, `ApplicationWindow`.
- DB: snake_case plural tables, `id` uuid v7, `created_at`/`updated_at` on every table.
- Routes: kebab-case; the only permanent public contract is `/p/<canonicalId>` (ADR-0005).

## Data
- Schema changes are Drizzle migrations in `packages/db`; never hand-run SQL on the VPS.
- Constraints live in the database (unique, partial unique, check), and the app explains them nicely.
- Soft-delete members (`visibility=inactive`, scrub PII); hard-delete nothing that a card could point at.
- Every admin write appends to `audit_log`.

## Security
- Secrets only in Coolify env vars. `.env.example` lists keys with empty values.
- All user input validated with zod on the server; markdown sanitized; uploads re-encoded with `sharp`.
- Admin app only behind Cloudflare Access; both apps check roles server-side anyway.
- Passwords per ADR-0014: Argon2id, breach check, rate limits, revocable sessions.

## Design
- `design-system.md` is the only source of colors, type, radius, elevation, and motion. Raw hex values or ad-hoc easings in app code fail review.
- New UI goes into `packages/ui` first, with a `/dev/ui` preview, then into an app.
- Every animation: transform/opacity/filter only, uses a motion token, and has a reduced-motion branch. Loops pause when the tab is hidden.
- Ember is the one primary action per view; aurora gradient is for text emphasis only; gold is for badges and rings.
- Screenshots at 360, 768, 1280 are attached to any PR that touches a public page.

## Delivery
- Branch from `main`, PR with CI green and one review. Squash merge.
- Each PR names the TODO task id(s) it closes (e.g. `C1.4`). Tick the box in `TODO.md` in the same PR and paste the verification evidence (command output, screenshot path, Lighthouse score).
- A task is not done until its verification column passes in the deployed environment, not only locally.
- Cuts are marked `[-]` with a one-line reason in the cluster file, never silently dropped.

## Definition of done for the MVP
All C1 boxes ticked and C1.11 passed (cards work), C0 and C4 complete, C2 and C3 complete or explicitly cut per the cut order in `TODO.md`.
