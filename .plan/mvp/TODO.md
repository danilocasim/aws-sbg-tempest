# MVP TODO — cards in hand by early January 2027

Source of truth for *why*: `docs/adr/`, `docs/domain-model.md`, `docs/scope-v1.md`.
Source of truth for *how it looks and moves*: [design-system.md](design-system.md) and [landing-experience.md](landing-experience.md). Every UI task below is verified against them.
A clickable reference implementation lives in [mockup/](mockup/README.md) (Next.js, static data). When a task's UI is done, it should match the mockup or the mockup gets updated first. Designer critique: [mockup/REVIEW.md](mockup/REVIEW.md).
This file is the *what* and *how we know it's done*. One cluster per milestone;
each cluster has a detail file next to this one. Tick a task only when its
verification passes.

Legend: `[ ]` todo · `[~]` in progress · `[x]` done · `[-]` cut (say why in the detail file)

Cut order if the deadline slips (scope-v1): C3 Applications → C2 archive page →
C2 events → C2 pages editing. **C1 Profiles and auth are never cut.**

---

## C0 · Foundation — weeks 1-2 → [00-foundation.md](00-foundation.md)
Implements ADR-0003, 0007, 0008. Goal: both apps deploy from `main`, DB is backed up and restorable.
Evidence for the ticked rows: [evidence/C0-verification.md](evidence/C0-verification.md). `[~]` rows have their code and runbooks done; what remains is account/domain work listed in [00-foundation.md](00-foundation.md#status-2026-10-03).

| # | Task | Verification |
|---|------|--------------|
| [x] C0.1 | pnpm monorepo: `apps/web`, `apps/admin`, `packages/db`, `packages/ui`, `packages/config` | `pnpm -r build` passes from a clean clone |
| [x] C0.2 | `packages/db`: Drizzle + Postgres, full schema from domain-model.md, migrations, seed | `pnpm db:migrate && pnpm db:seed` on empty DB; `pnpm db:check` shows no drift |
| [x] C0.3 | Dockerfiles (Next standalone) for web and admin; `docker compose` for local Postgres | `docker build` both images < 300 MB; `docker compose up` serves both on localhost |
| [~] C0.4 | Coolify: Postgres service, web service, admin service, env vars, auto-deploy on push to `main` | Push a commit → both URLs update within 10 min; health endpoints return 200 |
| [~] C0.5 | Cloudflare: club-controlled account, DNS for apex/`www`/`admin`, proxy on, TLS full-strict | `dig` shows Cloudflare IPs, not the VPS; VPS firewall drops non-Cloudflare 80/443 |
| [~] C0.6 | Cloudflare Access policy on `admin.<domain>` allow-listing officer emails | Incognito hit on admin URL shows Access login, not the app |
| [~] C0.7 | Nightly `pg_dump` to off-box storage, 30-day retention, restore script | Restore into a scratch DB and run `pnpm db:check`; drill recorded in runbook |
| [~] C0.8 | Transactional email: domain verified, SPF/DKIM/DMARC, one test template | Test mail scores 10/10 on mail-tester.com; lands in Gmail inbox, not spam |
| [~] C0.9 | CI: lint, typecheck, test, build on PR | A failing test blocks merge on a test PR |
| [ ] C0.10 | Club-controlled domain for cards registered or transferred; 2 officers on registrar | Both officers log in; recorded in `docs/runbook/handover.md` |
| [x] C0.11 | `packages/ui/tokens.css` + Tailwind preset from design-system.md §2–5; fonts via `next/font` (Space Grotesk, Inter, JetBrains Mono) | Every token in §2.2 and §5 resolves in DevTools; contrast table §2.3 reproduced by a unit test |
| [x] C0.12 | `packages/ui` components per design-system.md §7 with a dev-only `/dev/ui` preview route | All 16 components render in every state listed; axe reports 0 violations on `/dev/ui` |
| [x] C0.13 | Brand assets: logo SVG/PNG, dragon cut-out webp ×2, OG template, favicon set | Dragon webp ≤ 120 kB; OG renders at 1200×630 |

## C1 · Profiles + Auth — weeks 3-5 · **the win** → [01-profiles.md](01-profiles.md)
Implements ADR-0001, 0002, 0005, 0006, 0012, 0014. Goal: a card tap opens a correct profile; member can edit it.

| # | Task | Verification |
|---|------|--------------|
| [ ] C1.1 | `canonicalId` generator (6 chars, no vowels, collision-checked) | 1M generated ids: zero collisions, zero dictionary words from a blocklist |
| [ ] C1.2 | Public `/p/<id>` Server Component render as the Profile card (design-system §7): halo border, avatar ring, badge, link rows, pinned vCard button | Lighthouse mobile ≥ 90 perf; page has `noindex`; `inactive` id shows neutral page; unknown id → 404; matches the Profile card spec on 360px and 1280px screenshots |
| [ ] C1.3 | `/@handle` → 301 to canonical; handle uniqueness and change | Change handle; old handle 404s, new one redirects; card URL unaffected |
| [ ] C1.4 | `/p/<id>.vcf` vCard with opt-in fields only | iPhone and Android import the contact; with nothing exposed, vcf has name + URL + org only |
| [ ] C1.5 | Auth: email + password (Argon2id), set-password link, reset link, rate limit, server sessions | Breached password rejected; 6 bad logins → locked 15 min; reset link single-use; session revoke logs user out |
| [ ] C1.6 | Member area: edit profile, photo upload (resize, 2 MB cap), links validated, visibility toggle | Upload 8 MB jpg → rejected; 1.5 MB → stored as 512px webp under `/uploads/<canonicalId>/` |
| [ ] C1.7 | Members-only directory with search and department filter | Logged out → redirect to login; `card-only` members absent from list but reachable by URL |
| [ ] C1.8 | Admin: CSV import of current members → accounts + set-password emails | Import 20-row sample; 20 members, 20 emails, 0 duplicates on re-import |
| [ ] C1.9 | Admin: member moderation (edit any field, set visibility, revoke sessions, send reset) | Each action audited with actor + timestamp in `audit_log` |
| [ ] C1.10 | Admin: card-print export CSV (name, canonicalId, URL) | Export opens in Sheets; every URL in it resolves 200 |
| [ ] C1.11 | **Print test batch of 5 cards and tap them** | All 5 open the right profile on iOS and Android with no app installed |

## C2 · Landing page + content — weeks 6-8 → [02-landing.md](02-landing.md)
Implements ADR-0009, 0011, 0013. Goal: public site renders from structured data; officers edit content without a deploy.

| # | Task | Verification |
|---|------|--------------|
| [ ] C2.1 | Admin CRUD: Terms (exactly one current), Departments, Positions (director/officer, head flag) | DB constraint rejects a second current Term and a second head per dept per term |
| [ ] C2.2 | Derived `isAdmin` / `canEditDepartment` helpers used by every admin route | Unit tests for all branches; a plain member gets 403 on every admin route |
| [ ] C2.3 | Landing page sections in landing-experience.md order, built only from `packages/ui` | Renders from seed with zero hardcoded names or copy; 360/768/1280 screenshots match the section specs |
| [ ] C2.4 | Pages: markdown slots (`about`, `mission`, `join`, per-department) with sanitizer | `<script>` in markdown is stripped; edit shows live on next request |
| [ ] C2.5 | Events: admin CRUD, draft/published, cover upload; public Upcoming/Past lists and detail page | Draft event invisible publicly; past event moves to Past automatically after end time |
| [ ] C2.6 | Archive page: past Terms with their directors and officers | Create a past Term in seed; appears in archive, not on landing |
| [ ] C2.7 | Department-scoped editing: officer edits own dept copy and events only | Marketing officer gets 403 editing Technical content |
| [ ] C2.8 | SEO basics: titles, OG image, sitemap of public pages (never `/p/*`) | sitemap.xml contains no `/p/` URLs; OG preview correct in a link debugger |
| [ ] C2.9 | Backdrop: starfield canvas, nebula glows, desktop cursor parallax | Canvas idle CPU < 3% in Performance panel; static under reduced motion; pointer-events none |
| [ ] C2.10 | Hero choreography: staggered entrance, dragon float + cursor follow, aurora shimmer, count-up stats, window-aware CTA | Timings within ±20% of the table; CTA label changes when the application window is closed in seed |
| [ ] C2.11 | Reveal + hover system: `useReveal`, card lift with pointer highlight, nav scroll-spy + aurora underline, mobile sheet with focus trap, rotating border on next event | Reveals fire once at 15%; Tab order and focus trap verified; scroll-spy matches section in view |
| [ ] C2.12 | Motion QA | Reduced-motion matrix holds; Lighthouse mobile ≥ 90 / 100 / 100 with animations on; CLS 0; landing JS ≤ 90 kB gz; evidence saved in `.plan/mvp/evidence/` |
| [ ] C2.13 | Mobile QA at 390px: every public and member route, no horizontal overflow, CTA in first screen on landing and profile | `node scripts/shots.mjs` (port from the mockup) reports `ok` on every route; screenshots reviewed and attached to the PR |

## C3 · Applications — weeks 9-11 → [03-applications.md](03-applications.md)
Implements ADR-0010. Goal: accepted applicants become members with no manual account work.

| # | Task | Verification |
|---|------|--------------|
| [ ] C3.1 | Privacy notice page and consent checkbox copy | Page published; consent timestamp stored on every application |
| [ ] C3.2 | Application windows per Term per kind; forms close themselves | Set window in the past → form shows "closed"; future → "opens on" |
| [ ] C3.3 | Public membership form with duplicate-email check and spam protection (Turnstile) | Existing member email → "please sign in"; bot submit without token → 400 |
| [ ] C3.4 | Admin review queue: filter by status, accept / reject / waitlist, notes | Accept is one transaction: member + canonicalId + set-password email; failure leaves no half-state |
| [ ] C3.5 | Applicant status emails (received, decision) | All three templates render and deliver to a test inbox |
| [ ] C3.6 | Officer application (members only): department + term + statement | Non-member gets login redirect; second application same dept/term rejected |
| [ ] C3.7 | Director review of officer applications; accept creates Position | Non-director admin cannot decide; accept shows the officer on landing immediately |
| [ ] C3.8 | Reapply rules: rejected applicants may reapply next Term | Same email rejected this Term → blocked; next Term → allowed |

## C4 · Handover hardening — week 12 → [04-handover.md](04-handover.md)
Implements ADR-0003 consequences. Goal: someone who isn't the author can run this.

| # | Task | Verification |
|---|------|--------------|
| [ ] C4.1 | `docs/runbook/handover.md` fully filled: every asset has owner + second holder | No "TBD" in the file |
| [ ] C4.2 | Second holder on: registrar, Cloudflare, Coolify, email provider, GitHub org, backup storage | Each second holder logs in and screenshots |
| [ ] C4.3 | Restore drill from latest backup to a fresh Postgres | Done by a non-author; time and result recorded |
| [ ] C4.4 | "Redeploy from zero" README section | A Technical officer who didn't build it redeploys to a scratch Coolify project in under 60 min |
| [ ] C4.5 | Break-glass super admins: author + one officer, `isSuperAdmin` set, documented | Both can reach admin with the current Term removed in a test DB |
| [ ] C4.6 | Uptime monitor (free tier) on web, admin, and `/p/<sample-id>` with alerts to a club inbox | Stop the web container → alert arrives within 5 min |
| [ ] C4.7 | Security pass: dependency audit, headers (CSP, HSTS), rate limits confirmed, secrets rotated once | `pnpm audit` no high/critical; securityheaders.com grade A |

---

## Cross-cutting (apply throughout) → [conventions.md](conventions.md)
- No raw hex in app code; only tokens from `packages/ui`. No animation outside the motion tokens; reduced motion always handled.
- Every DB change is a migration in `packages/db`; no manual SQL on the VPS.
- Every admin write goes to `audit_log` (actor, action, target, timestamp).
- Glossary names are the code names: `Member`, `Term`, `Position`, `Department`, `Event`, `Page`, `MembershipApplication`, `OfficerApplication`, `ApplicationWindow`.
- Secrets only in Coolify env; `.env.example` documents keys, never values.
