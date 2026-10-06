# C2 · Landing page + content (weeks 6-8)

**Goal:** the public site shows the club, directors, departments, officers, and events from structured data; officers maintain copy and events in the admin without a deploy.
**ADRs:** 0009 (roles/terms), 0011 (events), 0013 (pages).
**Design:** `design-system.md` (tokens, components) and `landing-experience.md` (sections, choreography, budgets). The prototype's structure is not reused; its color system is.
**Exit criteria:** landing page has zero hardcoded names or copy; a Marketing officer can publish an event and fix the About text on their own.

## Routes

| Route | App | Auth |
|-------|-----|------|
| `/` landing, `/about`, `/departments/[slug]`, `/events`, `/events/[slug]`, `/archive`, `/archive/[termLabel]`, `/join` | web | public |
| `/admin/terms`, `/admin/departments`, `/admin/positions`, `/admin/events`, `/admin/pages` | admin | isAdmin (dept-scoped for officers, see C2.7) |

## Tasks

### C2.1 Terms, Departments, Positions CRUD
- Term: label, startsOn, endsOn, isCurrent (toggle "make current" moves the flag atomically).
- Department: slug, name, description (Page slot), sortOrder, isActive.
- Position: pick Member (search), Term, kind, title, Department (hidden when director), isHead.
- Rely on the DB constraints from C0.2; surface violations as friendly errors.

### C2.2 Authorization helpers (`packages/db/auth`)
```
isAdmin(member, currentTerm)
canEditDepartment(member, dept, currentTerm)
canDecideOfficerApplications(member, currentTerm)  // directors only, used in C3
```
- Unit-tested with a fixture matrix: super admin, director, technical officer, marketing officer, plain member, inactive member.
- Admin middleware denies anything not passing `isAdmin`; department-scoped routes additionally check `canEditDepartment`.

### C2.3 Landing page
Sections in order (see `landing-experience.md` for each): backdrop, nav, hero with dragon and live stats, about + mission (Pages), directors (current Term), departments with officers, upcoming events, join CTA band with application-window state, footer. All content from DB or Pages. Built only from `packages/ui` components and tokens.

### C2.9 Backdrop and starfield
Fixed canvas starfield (2 layers), nebula glows, cursor parallax on desktop, paused when hidden or reduced motion. Lazy-mounted after first paint.

### C2.10 Hero choreography
Entrance sequence per the timing table, dragon idle float + cursor follow, aurora shimmer once, count-up stats from DB, primary CTA state driven by the application window.

### C2.11 Section reveals and hover system
IntersectionObserver reveal hook (`useReveal`) with stagger; card hover lift + pointer-tracked highlight; nav scroll-spy + aurora underline; mobile nav sheet with focus trap; rotating aurora border on the next event.

### C2.12 Motion QA
Reduced-motion matrix verified, keyboard run, performance budget met, no CLS. Record Lighthouse JSON under `.plan/mvp/evidence/`.

### C2.4 Pages
- `pages(slug, body_md, updated_by, updated_at)`. Admin editor: textarea + live preview. Render with `remark` + `rehype-sanitize` (no raw HTML, no scripts, safe links).
- Slots seeded: `about`, `mission`, `join`, `department:<slug>` per department.

### C2.5 Events
- Fields per ADR-0011. Status `draft|published`. Cover upload reuses the C1.6 image pipeline (1200×630 webp for OG).
- Public: `/events` Upcoming (startsAt ≥ now) and Past; detail page with "Register" external button when `registrationUrl` set.

### C2.6 Archive
- `/archive` lists non-current Terms; `/archive/[label]` shows that Term's directors and departments/officers. Links to profiles only if the member is `public` visibility.

### C2.7 Department-scoped editing
- Officer (non-admin) can: edit `department:<own>` page, create/edit events where `departmentId = own`. Cannot touch Terms, Positions, Members, or other departments. Tests in the C2.2 matrix.

### C2.8 SEO
- `generateMetadata` per route, OG image for landing and events, `sitemap.xml` from public routes **excluding** `/p/*` and `/@*`, `robots.txt` disallowing `/p/`, `/@`, `/me`, `/members`.
