# Design review — Tempest mockup (2026-10-02)

**How this was reviewed.** The Chrome extension returned an error page for both
`http://localhost:3100` and `http://127.0.0.1:3100` on every attempt (the server
itself answers 200 on v4 and v6 via curl, so this is an extension site-permission
issue, not the app). Per the fallback rule, this review is based on **curl of every
route plus a full read of the source** (`app/`, `components/`, `lib/data.ts`, the
four stylesheets, `next.config.ts`). Where I make a layout claim I say
"(computed from CSS)" and give the arithmetic; treat those as "very likely, verify
in a browser" rather than "seen". Nothing below is a screenshot.

Routes checked: `/`, `/p/7hq2k`, `/p/q7w2xn`, `/p/nope` (404), `/join`, `/members`,
`/me`, `/events`, `/events/cloud-101-oct-2026`, `/admin`, `/admin/applications`,
`/admin/members`, `/admin/members/export`, `/login`, `/archive`, `/privacy`,
`/departments/technical`, `/@maya` (308 → `/p/7hq2k`). All return 200/expected.

---

> **Resolution (2026-10-02, after review):** all 10 "Fix before anyone sees it" items and all 12
> "Should fix" items are applied in the mockup; `design-system.md` §7 (Profile card order,
> badge floor, nav CTA, focus ring, `--link`, display size) and `landing-experience.md` (mobile
> hero, copy, stats, event border, reduced-motion row) were corrected to match. From "Nice to
> have": admin sidebar scroller, sticky `th` removed, Send-reset confirm, no `_blank` on profile
> links, `/forgot` page, carousel dots, `100dvh`, resize debounce, dead reduced-motion rule,
> icon radius token, `--link` token. **Not done:** re-exporting the dragon at ≥920px (no source
> art beyond the 440px crop), the 143 inline-style cleanup, moving `lib/data.ts` out of client
> components, and replacing 4:5 initials cards with 1:1 rows until photos exist. Console check
> still pending a browser session with localhost permission.

## Verdict

The system is coherent and most of it is better than a typical student-club site:
tokens are real, the hero choreography is implemented as specified, the inactive
page and 404 copy are correct, the admin reads like a product. I would **not** ship
the profile page as-is, and the profile page is the product. On a 390×844 phone the
"Save contact" button sits at or just below the fold behind four social-link rows
(computed from CSS, ~750px of content above it), the browser tab/share preview says
"Tempest · AWS Student Builder Group" instead of the member's name, and the vCard is
a client-side Blob download, which is the one mechanism that does not reliably open
the Contacts sheet on iOS. Fix the profile hierarchy and the vCard delivery first;
everything else is polish. Second-biggest problem: the landing hero on mobile puts
the dragon above the fold and the message and CTA below it.

---

## Fix before anyone sees it

1. **`/p/[id]` — "Save contact" is not the first thing a stranger can tap.**
   Order is avatar → name → headline → badge → bio → 4 link rows (56px each) →
   Save contact. At 390px that is ~750px before the primary action (24 + 32 padding,
   136 ring, ~55 name/headline, 30 badge, ~67 bio, 253 links, 16 + 48 button, plus
   gaps). ADR-0012 says the vCard is the point. Move `VCardButton` directly under the
   headline/badge, make it the only ember on the page, and push the social rows below
   the bio. Also change `design-system.md` §7 "Profile card" anatomy to match, since
   the mock faithfully follows the spec's (wrong) order.

2. **`/p/[id]` — generic `<title>`, no per-member metadata.** curl shows
   `<title>Tempest · AWS Student Builder Group</title>` and only a `robots` tag. The
   tab, the history entry, and any Messenger/Viber/iMessage preview of a card link
   show the club, not the person. Replace the static `metadata` export with
   `generateMetadata` → `"{displayName} · Tempest"`, description = headline, keep
   `noindex`, add OG title/description and a neutral OG image (logo), never the
   member photo without opt-in.

3. **`/p/[id]` — vCard delivered as a client Blob (`VCardButton.tsx`).**
   `a.download` + `URL.createObjectURL` is the path most likely to dump a `.vcf` into
   Files on iOS instead of opening the "Create New Contact" sheet, and in-app
   browsers on Android often ignore it. It also calls `URL.revokeObjectURL` synchronously
   after `click()`, which cancels the download in some browsers. Serve
   `GET /p/<id>.vcf` (or `/p/<id>/vcard`) with `Content-Type: text/vcard; charset=utf-8`
   and `Content-Disposition: attachment; filename="..."`, and make the button a plain
   `<a href>`. This also satisfies ADR-0012's "no client JS except the vCard button"
   more honestly. Toast copy "Contact card downloaded" is wrong on iOS (it opens a
   sheet); drop the toast when it's a plain link.

4. **`/p/[id]` — starfield canvas runs a `requestAnimationFrame` loop forever on the
   card page.** `Profile` renders `<Backdrop />` with `stars` defaulting to `true`,
   so the page the ADR says should be "Server Component, cached, no client JS except
   the vCard button" ships a 200-star canvas animating at 60fps on a phone that was
   just tapped. Use `<Backdrop stars={false} />` (the static `.dots` fallback) on
   `/p` and `/login`, keep the canvas for the landing only.

5. **`/` at phone width — dragon owns the first screen, the message doesn't.**
   Mobile order is nav (72) → `.hero-art` (min-height 280, dragon 60vw ≈ 234px) →
   badge → h1 at ~47px (`--fs-display` = 2rem + 4vw) which wraps to 4 lines ≈ 200px
   → lead → buttons. Computed from CSS, "Apply now" lands ~850–900px down on an
   844px-tall viewport, i.e. below the fold. Either shrink the dragon to ~40vw and
   cap `.hero-art` min-height on mobile, or put the dragon after the copy on mobile
   (spec says above; the spec is wrong here). Also consider a shorter line 1 so the
   h1 is ≤ 3 lines on a 390px phone.

6. **`/admin/applications` — Reject, Accept, and bulk Accept fire with no confirm.**
   `decide()` is called directly from the drawer's "Accept · create member", "Reject"
   (`.btn-danger`), and the toolbar "Accept N". Accept creates a member *and* sends an
   email; Reject is destructive. `design-system.md` §8 requires a confirm step for
   destructive actions. Add a two-step confirm (inline "Reject? [Confirm] [Cancel]"
   or a small dialog) for Reject and for any bulk action; for single Accept at least
   show what will happen before the click (it already does in the footnote, good).

7. **`/admin/applications` — Review drawer has no focus management.** `role="dialog"
   aria-modal="true"` is set, but unlike the nav sheet there is no focus move into the
   drawer, no focus trap, and no Escape handler. Keyboard users keep tabbing through
   the table behind the overlay. Reuse the sheet's `onKey` + `panel.querySelector('button').focus()`
   pattern from `Nav.tsx`.

8. **Global focus-ring rule changes element shape (`ui.css` line 12).**
   `:focus-visible{outline:none;box-shadow:var(--focus-ring);border-radius:var(--r-sm)}`
   forces an 8px radius onto whatever is focused, so a 9999px pill button visibly
   snaps to a rounded rectangle on keyboard focus, and a circular social icon gets
   square corners. Drop the `border-radius` from the global rule and use
   `outline: 3px solid rgb(135 204 255 / .55); outline-offset: 2px` instead; modern
   browsers follow the element's own radius.

9. **`/join` — the public form reveals who is already a member.** Entering
   `maya@example.edu` returns "You're already a member. Sign in instead." That is
   account enumeration on an unauthenticated form, and the app otherwise goes out of
   its way (ADR-0006, noindex, card-only visibility) to avoid leaking who is a member.
   Accept the application silently and handle duplicates in admin, or say "If this
   email is already registered we'll email you a sign-in link" for every submission.

10. **Nav brand at phone width will overflow or wrap (computed from CSS).** The
    brand is logo (40) + gap (12) + eyebrow "AWS STUDENT BUILDER GROUP" at 0.7rem with
    0.18em tracking (~25 chars × ~10.4px ≈ 260px) ≈ 312px, plus the 44px burger and
    32px of gutters = ~388px on a 390px viewport, and more on 360px Androids. Hide the
    eyebrow below ~480px (`.brand .eyebrow{display:none}`) or shorten it to
    "AWS SBG"; keep the "Tempest" wordmark. The eyebrow is also 11.2px, under the
    design system's 12px floor.

---

## Should fix

1. **`/` — three ember buttons on one page, two in the first viewport.** Nav
   "Apply now", hero "Apply now", and join-band "Apply for membership" are all
   `.btn-primary`. The system says one primary per view. Make the nav CTA secondary
   (outline) until `.is-scrolled`, then swap to ember once the hero CTA is off-screen.

2. **`/` — hero headline likely wraps to an orphan at 1280px (computed from CSS).**
   Copy column is 7/12 of (1120 − 48) ≈ 625px; "Build, learn, and" at 80px Space
   Grotesk 700 with −0.02em tracking is ≈ 650px. Line 1 wraps to "Build, learn, /
   and", so the per-line `clip-path` reveal no longer matches visual lines. Either cap
   `--fs-display` lower at `lg` (e.g. `clamp(2.75rem, 1.5rem + 3.5vw, 4.5rem)`) or
   re-break the copy ("Build, learn, / and grow with Tempest" as the two `.line`s).
   Verify in a browser before changing.

3. **Copy — the headline and eyebrow read as template.** "Build, learn, and grow
   with Tempest" says nothing a stranger can't guess, and "It's always day one" is an
   Amazon slogan lifted verbatim, which sits badly next to the design system's own
   "AWS-adjacent, not AWS" rule. The lead paragraph already has the real pitch
   ("learn cloud by shipping", "weekly build nights", "PLMUN"). Put the specific in the
   headline: e.g. "Learn AWS by shipping it" / "PLMUN's cloud builders", and make the
   eyebrow factual ("AWS Student Builder Group · PLMUN").

4. **`/` — stats row has one filler number.** "4 Departments" is structural trivia;
   "₱0 Cost to join" is the one that lands. Replace Departments with something people
   care about (build nights held, projects shipped, AWS credits given out) or drop to
   three stats. Also `CountUp` sets `aria-live` *after* the number finishes, which
   announces nothing; put `aria-live="polite"` on the container up front and update
   the text once at the end, as the spec actually describes.

5. **"Head of Technical · Technical" — redundant badge on `/p/7hq2k`, `/members`,
   `/me`.** `positionsFor` + `deptBySlug` appends the department even when the title
   already contains it. Append the department only when the title doesn't include
   the department name (officers titled "Technical Officer" also don't need it).

6. **Touch targets under 44px on member-facing pages.** `.chip` is 34px
   (`/members` filters), `.btn-sm` is 36px (`/me` Preview, Upload photo),
   `.socials a` is 40px (footer), `.btn-ghost` is 40px. Admin can keep 36/40; on
   public/member routes set `min-height:44px` under `@media (pointer: coarse)` or
   just make chips 44px.

7. **Text under the 12px floor.** `/members` badge inline `fontSize:".65rem"`
   (10.4px uppercase with 0.18em tracking), `AdminNav.tsx` count badge `.65rem`,
   `admin/terms` `.6rem`, `.brand .eyebrow` `.7rem`. The design system's own contrast
   table says ≥12px. Make a `.badge-sm` at 12px/height 24 and delete the inline
   overrides.

8. **`/p/[id]` — bio is 14px on the one page that needs to be read in ten
   seconds.** `.profile-card .bio{font-size:var(--fs-small)}`. Use `--fs-body` (16px)
   and keep `max-width:36ch`. Same page: the footer club name should be a link to
   `/` (right now the only way back to the club is nothing).

9. **`/me` — email rendered as an uppercase, letter-spaced eyebrow.** "SIGNED IN
   AS MAYA@EXAMPLE.EDU" in `.eyebrow` (uppercase, 0.18em tracking) is hard to read
   and looks broken. Render the email in `.mono` or normal case under the h1.
   Also: the form is ~1,400px tall with "Save profile" at the very bottom and no
   dirty-state indicator; add a sticky bottom save bar (there is already a
   `.vcard-bar` pattern to copy) or at least "Unsaved changes" next to the button.

10. **`/join` — validation has no ARIA plumbing.** Errors are shown visually but
    inputs never get `aria-invalid`/`aria-describedby`, focus doesn't move to the
    first error, and the consent error is rendered outside the `<label>`. Add the two
    attributes, `focus()` the first invalid field on submit, and put the consent
    error inside the `.check` block. Also default the Course select to a placeholder
    ("Select your course") instead of "BS Computer Science".

11. **Hardcoded copy that a seed swap won't change** (fails the landing-experience
    checklist). `page.tsx:31` and `departments/[slug]/page.tsx:15` "AY 2026–2027"
    (use `currentTerm.label`); the second About paragraph is literal JSX, not
    `club.about`; `JoinForm.tsx:17` "24 Oct" (use `windowState().date`);
    `admin/page.tsx` "24 Oct", "02 Oct"; `admin/applications/page.tsx:13`. In a mock
    this is cosmetic, but these are exactly the strings that will be forgotten when
    the real pages are built from the mock.

12. **`.event.is-next` animates a custom property for 12s on loop.** `@property
    --ang` + `@keyframes spinAng` repaints the card's conic border every frame
    (not compositor-only), contradicting "transform/opacity/filter only" and the
    performance principle. Rotate a pseudo-element with the gradient instead
    (`::before` oversized square, `transform: rotate()`), or play the sweep once on
    reveal rather than infinitely.

---

## Nice to have / opinions

- `/admin` sidebar on phones stacks six nav rows above every page's content; collapse
  to a horizontal scroller below 1024px.
- `.table th{position:sticky;top:0}` never engages because `.table-wrap` has no
  `max-height`; either give it one or drop the sticky.
- `/admin/members` "Send reset" emails a member instantly from a ghost button in a row
  of 12 identical ghost buttons; give it the same confirm treatment as Reject.
- Social link rows on the profile use `target="_blank"`; after an NFC tap the user is
  already in a throwaway tab, and `_blank` blocks app deep-links on some Android
  browsers. Plain navigation is fine here.
- `/login` prefilled password dots as `defaultValue` and `href="#"` on "Forgot
  password?" look like leftovers once someone demos it; wire the link to a
  `/forgot` placeholder page.
- Departments mobile carousel has no dots indicator (spec asks for one).
- `.profile-wrap{min-height:100vh}` → `100dvh` for iOS.
- Directors/officer cards are 4:5 "photo" boxes showing two initials on a gradient;
  until real photos exist these read as placeholders. Consider a 1:1 avatar + text row
  layout as the default, with the 4:5 crop only when a photo exists.
- `dragon.png` is a 440×480 PNG (421 KB on disk, 66 KB after Next's optimizer) and
  is rendered at 460 CSS px on desktop, so retina gets an upscaled 1x. The spec wants
  a ≤120 KB WebP; export the dragon at ≥920px wide.
- 143 inline `style={{}}` usages. Fine for a mock, but every one of them is a token
  that didn't make it into `ui.css` (`.stack`, `.row`, `.center`, `.max-w-*`). Pull the
  six most repeated into classes before the real build copies the pattern.
- `lib/data.ts` is imported by client components (`Nav`, `VCardButton`, `/members`),
  so the entire seed ships to the browser; irrelevant for the mock, but the real
  `Nav` should receive `windowState` as a prop.
- The gold `.dept .icon` tile uses `border-radius:12px`, not a token radius
  (8/16/24). Use `--r-sm` or `--r-md`.
- Aurora-1 as a flat link colour (`/me` card URL, `/login` "Apply") isn't in the
  system; add a `--link` token so it's deliberate.
- Starfield regenerates on every `resize`, which on iOS fires when the URL bar
  collapses; debounce or only regenerate on width change.
- Reduced motion collapses everything to 1ms rather than the matrix's "150ms fade";
  that is arguably better than the spec, but the `!important` on the universal rule
  also overrides the `.reveal{transition:opacity 150ms}` line that follows it, so that
  line is dead code.

---

## What's working

- Token file mirrors the design system exactly; semantic names are used everywhere
  that matters. Contrast of body/muted/faint text on `--surface` all pass (faint on
  surface ≈ 6.1:1 at 14px).
- Hero choreography matches the timing table (badge 0 → lines 120/220 → lead 400 →
  buttons 520/600 → dragon 300 → divider 700 → stats 760–940) and uses
  transform/opacity/clip-path only.
- Reduced motion is honoured in CSS and in every JS loop (`Backdrop`, `CountUp`,
  `DragonFollow`), hover effects are gated behind `@media (hover: hover)`, and the
  starfield pauses on `visibilitychange`.
- Mobile nav sheet: `aria-expanded`, `role="dialog"`, `aria-modal`, Escape, overlay
  click, focus trap, body scroll lock, staggered links. Copy this for the admin drawer.
- Inactive profile page and 404 copy are exactly right for ADR-0005 ("Card URLs are
  never reused, so this one was never printed").
- `noindex, nofollow` on profiles; `card-only` members correctly hidden from
  `/members`; non-public members are rendered as non-links on the landing (no dead
  links); vanity `/@maya` 308s to the canonical URL.
- Status chips carry text, not just colour. Empty states exist on directory, events,
  applications. Toast has `role="status"`.
- Admin: no starfield, no entrance animations, 14px density, 44px rows, zebra, the
  "Needs attention" card and audit log make it feel like a real product, and the
  "Accepting creates the Member, generates their permanent card URL, and emails a
  set-password link in one step" footnote is exactly the kind of sentence that makes
  a mock look implemented.
- Join form: inline validation copy is human ("There are no wrong answers, only empty
  ones"), consent is explicit and links to a real privacy page, success state tells
  the applicant what happens next.
- Inputs: 48px, `--bg-band` fill, `--border-strong`, aurora focus border + ring, danger
  border on error, labels on every field.

---

## Design-system compliance

| Rule | Result | Where |
|------|--------|-------|
| Colours only via tokens | Partial | `landing.css:70-75` `.art-*` covers use raw hex (dragon primitives written literally); `ui.css:143` / `profile.css:12` brand hover hex is allowed by §6 |
| Ember = single primary action per view | Fail | `/`: nav + hero + join band all `.btn-primary` (2 visible at once above the fold); `/admin/applications`: toolbar "Accept N" + drawer "Accept" |
| Gold only for badges and rings | Pass | `.badge`, `.dept .icon` tile, mock banner, profile ring; no gold buttons |
| Aurora gradient only for text emphasis (plus the spec'd chip/nav/event-border uses) | Pass | `.aurora-text`, chip selected border, nav underline, `.is-next` border, pullquote rule; aurora-1 used as a flat link colour on `/me` and `/login` (not specified either way) |
| Radii from `--r-sm/md/lg/pill` | Fail (minor) | `landing.css:50` `.dept .icon{border-radius:12px}`; `departments/[slug]` icon `borderRadius:14` |
| Spacing on 4px scale | Partial | `.9rem`, `.6rem`, `.4rem`, `.35rem` gaps throughout `ui.css`/inline styles |
| Type ≥ 12px | Fail | `.brand .eyebrow` 11.2px; `/members` badge 10.4px; `AdminNav` count 10.4px; `admin/terms` 9.6px |
| Type scale tokens (`--fs-*`) | Pass | All headings/lead/small use tokens; a few `1.125rem`/`1.25rem` literals in admin/person cards |
| Buttons 48px pill, hover lift + `--elev-accent`, active 0.98, loading state | Pass | `ui.css` `.btn*`; "Sending…"/"Saving…" lock text but not width |
| Cards: surface, `--r-md`, border, `--elev-1`, 24px, top highlight, hover lift + pointer glow | Pass | `.card`, `.card-interactive`, `Pointer.tsx` |
| Glass nav 72px, sticky, shrink to 64 after 80px, aurora underline, scroll-spy | Pass | `.nav`, `Nav.tsx` |
| Profile card anatomy (`--r-lg`, halo border, `--elev-aurora`, 128px avatar + 3px ring, h1, headline, badge, bio, links, vCard primary) | Pass (but see Fix #1: the spec'd order buries the primary action) | `profile.css`, `p/[id]/page.tsx` |
| Inputs 48px, `--r-sm`, `--bg-band`, `--border-strong`, focus ring, error state, labels | Pass | `ui.css` forms block |
| 44px minimum touch targets | Fail | `.chip` 34, `.btn-sm` 36, `.socials a` 40, `.btn-ghost` 40 on member-facing routes |
| Visible focus ring everywhere | Partial | Present, but global rule forces 8px radius (Fix #8) |
| `aria-live` on toasts and count-ups | Partial | Toast yes; `CountUp` sets it after the change (announces nothing) |
| Motion: transform/opacity/filter/background-position only | Partial | `.nav` height transition is the one allowed exception; `.is-next` animates `--ang` (paint every frame, 12s loop) |
| Reduced motion: loops stop, entrances collapse | Pass | Universal 1ms rule + JS checks; collapses to instant rather than 150ms fade |
| Hover only on pointer devices | Pass (mostly) | `@media(hover:hover)` on buttons/cards/links; `.footer a:hover`, `.admin-side a:hover`, `.nav-links a:hover` are ungated (harmless) |
| Admin: no starfield, no glows, ≤150ms fades, 240px sidebar, 14px tables, danger outline + confirm | Partial | All present except the confirm step on Reject / bulk Accept / Send reset |
| Empty state: mark + h3 + sentence + button | Pass | Landing events fallback, `/members`, `/join` closed, applications table |
| Stat: numeral/label, count-up, 2×2 on mobile | Pass | `.hero-stats`, `CountUp` |
| Dragon only in hero and inactive page | Partial | Hero yes; inactive page uses the circular logo, not the dragon (fine, but not what §6 says) |
| No hardcoded names/numbers/copy (seed swap) | Fail | `stats` object is fine (mock DB), but term labels and "24 Oct" are literal in 6 files (Should-fix #11) |
| Performance budget (JS ≤ 90 kB gz, dragon webp ≤ 120 kB) | Not measurable in dev | Dev chunks are unminified; `dragon.png` is 440×480 PNG, served at 66 KB but 1x only |

---

## Console errors

Could not be read: the Chrome extension could not load the page (error frame on both
`localhost` and `127.0.0.1`). Server-side, every route above returned 200 (404 for
`/p/nope` as intended) with no error markup in the HTML. Re-run
`read_console_messages` on `/` and `/p/7hq2k` once the extension has permission for
`localhost`; the two things I would expect to see are a Next hydration warning if
`CountUp`'s SSR "0" differs from the client, and nothing else.
