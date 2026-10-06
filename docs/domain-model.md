# Domain model

Derived from ADR-0001 through ADR-0013. Names here are the glossary names.

## Entities

```
Member
  id (uuid)            internal key
  canonicalId (text)   6-char opaque, unique, immutable  → /p/<canonicalId>
  handle (text?)       unique, changeable                → /@handle → 301
  email (text)         login identity, unique; admin-assisted change only
  passwordHash (text?) Argon2id; null until set-password link is used
  displayName, headline, bio, photoKey
  linkedinUrl, facebookUrl, githubUrl, websiteUrl
  contactEmail?, contactPhone?   opt-in, vCard only
  visibility           public | card-only | inactive
  isSuperAdmin (bool)  break-glass, default false
  joinedTermId → Term
  createdAt, updatedAt

Term
  id, label ("AY 2026-2027"), startsOn, endsOn, isCurrent (exactly one true)

Department
  id, slug, name, description (markdown), sortOrder, isActive

Position
  id, memberId → Member, termId → Term
  kind         director | officer
  title        ("President", "Events Officer")
  departmentId → Department   (null when kind = director)
  isHead (bool)               (officer only; one per department per term)

Event
  id, title, slug, startsAt, endsAt?, venue?, onlineUrl?, coverKey?
  description (markdown), registrationUrl?, departmentId? → Department
  status: draft | published

MembershipApplication
  id, email, fullName, course, yearLevel, motivation, consentAt
  termId → Term, status: submitted | accepted | rejected | waitlisted
  decidedBy? → Member, decidedAt?, resultingMemberId? → Member

OfficerApplication
  id, memberId → Member, termId → Term, departmentId → Department
  statement, status: submitted | accepted | rejected
  decidedBy? → Member, decidedAt?, resultingPositionId? → Position

ApplicationWindow
  id, termId → Term, kind: membership | officer, opensAt, closesAt

Page
  slug (about | mission | join | ...), body (markdown), updatedBy → Member, updatedAt
```

## Derived rules

- `isAdmin(member)` = member.isSuperAdmin
  OR exists Position(member, currentTerm, kind=director)
  OR exists Position(member, currentTerm, kind=officer, department=Technical)
- `canEditDepartment(member, dept)` = isAdmin(member)
  OR exists Position(member, currentTerm, kind=officer, department=dept)
- A `MembershipApplication` cannot be submitted for an email that already
  belongs to a Member.
- Accepting a `MembershipApplication` is one transaction: create Member
  (generate canonicalId, joinedTerm = current), link resultingMemberId, enqueue
  set-password email (ADR-0014).
- Accepting an `OfficerApplication` creates a Position in that Department/Term.
- `/p/<canonicalId>` for a Member with visibility=inactive renders the neutral
  inactive page; the id is never reused.

## Surfaces

| Surface | App | Auth | Reads | Writes |
|---------|-----|------|-------|--------|
| Landing page (about, directors, departments, officers, events) | web | none | Term, Position, Department, Event, Page | none |
| Profile `/p/<id>`, `/@handle`, `.vcf` | web | none | Member, Position | none |
| Membership application form | web | none | ApplicationWindow | MembershipApplication |
| Member area: edit profile, directory, officer application | web | email + password | Member, Position, Department | own Member, OfficerApplication |
| Admin: review applications, manage terms/positions/departments/events/pages, member moderation, card export | admin (behind Cloudflare Access) | email + password + isAdmin | all | all |
