# Glossary — AWS Student Builder Group: Tempest

Terms are added as they are settled during design interviews. A term listed here
is the single name we use in code, UI, and docs. Rejected synonyms are noted so
nobody reintroduces them.

| Term | Definition | Rejected synonyms | Status |
|------|------------|-------------------|--------|
| Club | AWS Student Builder Group – Tempest as an organization. | org, group | accepted |
| Member | A person accepted into the Club. Has an account (email and password) and a Profile. | user (too generic) | accepted (ADR-0002) |
| Director | A club-level Position (President, VP, Secretary...) held for a Term. Not tied to a Department. | board, exec | accepted (ADR-0009) |
| Officer | A Position within exactly one Department for a Term. One Officer per Department per Term is the Head. | lead, coordinator | accepted (ADR-0009) |
| Department | A long-lived functional unit (Technical, Marketing...). Officers belong to one. | team, committee | accepted (ADR-0009) |
| Term | An academic year with start/end dates; exactly one is current. Positions are held per Term. | year, batch, season | accepted (ADR-0009) |
| Position | A Member holding a Director or Officer role during a Term. | role, title | accepted (ADR-0009) |
| Head | The Officer flagged as leading a Department for a Term. | dept director, lead | accepted (ADR-0009) |
| Event | A dated activity shown as Upcoming or Past with an external registration link. No RSVP in v1. | meetup, session | accepted (ADR-0011) |
| Page | A named markdown content slot (about, mission, join, department copy) edited in admin. | CMS block | accepted (ADR-0013) |
| vCard | The `.vcf` contact file a Profile offers via 'Save contact'; carries only opt-in contact fields. | contact card | accepted (ADR-0012) |
| Visibility | Profile state: public, card-only, or inactive. | status, privacy | accepted (ADR-0006, ADR-0012) |
| Profile | A Member's public networking page (LinkedIn, Facebook, etc.) reachable by a stable URL. Owned and edited by the Member. | card, bio | accepted (ADR-0001, ADR-0002) |
| NFC Card | A physical card encoded with a Member's canonical Profile URL `/p/<id>`. Never re-encoded. | | accepted (ADR-0005) |
| Application | A Membership Application (public, creates a Member on accept) or an Officer Application (members-only, reviewed by Directors). | form, signup | accepted (ADR-0010) |
| Application Window | Open/close dates for a kind of Application in a Term. | cycle, recruitment period | accepted (ADR-0010) |
| Admin | Derived access: Directors and Technical Officers in the current Term, plus break-glass super admins. Grants the admin app. | superuser, staff | accepted (ADR-0008, ADR-0009) |
| Canonical URL | The permanent `/p/<id>` address of a Profile. | permalink | accepted (ADR-0005) |
| Handle | Optional changeable vanity name; `/@handle` redirects to the Canonical URL. | username, slug | accepted (ADR-0005) |
| Directory | Members-only searchable list of Profiles. | member list | accepted (ADR-0006) |
