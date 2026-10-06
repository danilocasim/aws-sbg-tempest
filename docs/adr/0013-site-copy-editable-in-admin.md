# ADR-0013: Landing-page copy is editable in the admin app

- Status: accepted
- Date: 2026-10-02

## Decision
A `pages` table holds named content slots (`about`, `mission`, `join`, and one
per Department description) as markdown, edited in the admin app. Everything
else on the landing page (Directors, Departments, Officers, Events) renders
from structured data. Layout and design remain in code.

## Consequences
- Officers update copy without a deploy. Technical department owns layout.
- Markdown is rendered server-side with a sanitizer; no raw HTML.

## Alternatives considered
- Copy in code via pull request: rejected, non-technical officers must be able
  to fix a typo.
