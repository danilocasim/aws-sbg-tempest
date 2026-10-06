# C3 · Applications (weeks 9-11)

**Goal:** people apply on the site; accepting creates a member with a set-password email in one transaction; officer applications go to directors.
**ADRs:** 0010 (applications), 0014 (set-password), 0009 (positions).
**Exit criteria:** a full cycle runs without anyone touching the database: open window → apply → accept → applicant sets password → profile exists → appears in card export.
**Cut rule:** this cluster is first to go if the deadline slips. Fallback: keep Google Forms and use C1.8 CSV import.

## Routes

| Route | App | Auth |
|-------|-----|------|
| `/join` (form or closed/opens-on message), `/privacy` | web | public |
| `/me/apply-officer` | web | member |
| `/admin/applications/membership`, `/admin/applications/officer`, `/admin/windows` | admin | isAdmin; officer decisions require director |

## Tasks

### C3.1 Privacy notice + consent
- `/privacy`: what is collected (name, email, course, year, motivation, later profile fields), why, retention (rejected applications purged after 2 Terms), how to request deletion (email to a club address). Written in plain language; a Director signs off.
- Consent checkbox required; `consent_at` stored on the application.

### C3.2 Application windows
- `application_windows(term_id, kind, opens_at, closes_at)`. Form route reads the current Term's window: before → "opens on", inside → form, after/none → "closed, follow our socials".

### C3.3 Membership form
- Fields: fullName, email, course, yearLevel, motivation (≤ 1000 chars), consent. zod validation, Cloudflare Turnstile (free) on submit.
- Duplicate check: email exists in `members` → "You're already a member, sign in". Pending application with same email this Term → "already received".
- Send `application-received` email.

### C3.4 Review queue (admin)
- Table with status filter, search, applicant detail drawer, internal notes. Actions: accept / reject / waitlist.
- Accept = one DB transaction: insert member (canonicalId, joinedTerm = application Term, email), set `resulting_member_id`, `decided_by`, `decided_at`; then enqueue set-password email. If email enqueue fails, the member still exists and the queue shows "email failed, resend" (do not roll back the member).
- Bulk accept allowed (max 50 at a time).

### C3.5 Emails
- `application-received`, `application-decision` (accepted → includes set-password link; waitlisted; rejected → neutral, mentions reapplying next Term).

### C3.6 Officer application (member)
- Choose Department (active) and the Term the window belongs to; statement ≤ 1500 chars. One per member per department per Term (unique index).

### C3.7 Director review
- Only `canDecideOfficerApplications` can decide. Accept creates a Position (kind=officer, title from a dropdown, isHead unchecked by default) and emails the member.

### C3.8 Reapply rules
- Membership: rejected in Term N may apply in Term N+1; blocked in Term N. Officer: same rule per department.
