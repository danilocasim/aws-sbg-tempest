# ADR-0005: Profile URLs on NFC cards are opaque short IDs

- Status: accepted
- Date: 2026-10-02

## Context
A URL encoded on a physical NFC Card cannot be changed after printing (ADR-0001).
Options were an opaque ID, a username slug, or a name-based path.

## Decision
The canonical Profile URL is `https://<club-domain>/p/<id>` where `<id>` is a
short, random, URL-safe identifier (about 6 characters, unambiguous alphabet,
no vowels to avoid accidental words) generated once at Member creation and never
reassigned, even after a Member leaves.

A Member may later claim a vanity handle (`/@handle`) that 301-redirects to the
canonical URL. Handles can change; canonical IDs cannot. Cards are always
encoded with the canonical URL.

## Consequences
- The `/p/<id>` route must stay reachable for the lifetime of the domain. Any
  future rewrite must keep it or ship permanent redirects.
- A departed Member's URL resolves to a neutral "this member is no longer
  active" page, never a 404 and never someone else's Profile.
- Card printing needs an export: list of (member, canonical URL) from the admin.

## Alternatives considered
- Username slug: rejected, a rename breaks printed cards unless every old slug
  is kept forever.
- Name-based path: rejected, name changes, duplicates, and typos all break cards.
