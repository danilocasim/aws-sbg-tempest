# Tempest design system

Basis: the color system of the existing Lovable prototype (sampled from the
screenshot, values below are measured pixels, not guesses) plus the club logo
(blue dragon, gold ring, pink-violet-blue halo). Page structure of the prototype
is **not** adopted; sections follow `docs/scope-v1.md` and the ADRs.

Design intent in one line: **a night sky you build in.** Deep space background,
warm ember call-to-action, one cool "aurora" gradient for the moments that
matter, and the dragon as the only illustration.

---

## 1. Brand attributes → design decisions

| Attribute | What it means in the UI |
|-----------|-------------------------|
| Builder | Crisp geometric type, visible structure, numbers as first-class content (stats, dates). |
| Student-led, friendly | Rounded pill buttons, generous spacing, playful mascot motion, no corporate stock imagery. |
| Night sky / tempest | Near-black navy canvas, subtle starfield, soft nebula glows at the edges, aurora gradient reserved for emphasis. |
| AWS-adjacent, not AWS | Ember orange nods to AWS without copying its UI. Never use the AWS smile or Amazon typography. |

---

## 2. Color

### 2.1 Primitives (measured from the prototype unless marked *est.*)

```
/* canvas */
--navy-950: #040615;   /* page background (measured) */
--navy-900: #070718;   /* nav / footer band (measured) */
--navy-800: #10111e;   /* card / surface (measured) */
--navy-700: #121121;   /* divider lines (measured) */
--navy-600: #282a36;   /* card border (measured) */
--navy-500: #3a3d4d;   /* strong border for inputs (derived, 3:1 vs surface) */

/* nebula glows (edge washes, never text) */
--nebula-violet: #342f57;  /* top-left glow (measured) */
--nebula-steel:  #253144;  /* right glow (measured) */
--nebula-plum:   #3c324c;  /* badge fill (measured) */

/* text */
--white:     #ffffff;  /* headlines, numerals (measured) */
--text-100:  #e0e9f7;  /* body (measured) */
--text-200:  #d1d9e8;  /* nav links, labels (measured) */
--text-300:  #b6becc;  /* eyebrows, meta (measured) */
--text-400:  #8b93a7;  /* placeholders, timestamps (derived, 6.5:1) */

/* ember (primary action) */
--ember-500: #f5a044;  /* CTA fill (measured) */
--ember-400: #ffb45f;  /* hover (derived) */
--ember-600: #d98632;  /* pressed (derived) */
--ember-ink: #000017;  /* text on ember (measured) */

/* gold (accent, badges, ring) */
--gold-300: #ffd35e;   /* badge text (measured) */
--gold-600: #836954;   /* badge border (measured) */
--gold-ring: #f2b84b;  /* logo inner ring *est.* */

/* aurora (the one gradient) */
--aurora-1: #87ccff;   /* sky blue (measured) */
--aurora-2: #b4a5fa;   /* lavender (measured) */
--aurora-3: #eecba1;   /* champagne (measured) */

/* dragon (illustration-only, from logo, *est.*) */
--dragon-blue:   #3b6fe0;
--dragon-deep:   #21498e;  /* measured */
--dragon-cyan:   #78e4f5;  /* measured */
--dragon-violet: #402ea1;  /* measured */
--halo-pink:     #e88aa8;  /* *est.* */
--logo-cyan:     #98ecff;  /* "Tempest" wordmark in nav (measured) */

/* status */
--info:    #5aa9ff;
--success: #4ade80;
--warning: #ffd35e;
--danger:  #ff6b6b;
```

### 2.2 Semantic tokens (what components use)

```
--bg:            var(--navy-950);
--bg-band:       var(--navy-900);
--surface:       var(--navy-800);
--surface-glass: rgb(16 17 30 / 0.6);      /* + backdrop-blur 12px */
--border:        var(--navy-600);
--border-strong: var(--navy-500);
--divider:       var(--navy-700);

--fg:            var(--white);
--fg-body:       var(--text-100);
--fg-muted:      var(--text-200);
--fg-subtle:     var(--text-300);
--fg-faint:      var(--text-400);

--accent:        var(--ember-500);
--accent-hover:  var(--ember-400);
--accent-active: var(--ember-600);
--accent-fg:     var(--ember-ink);

--highlight:     var(--gold-300);
--highlight-bg:  var(--nebula-plum);
--highlight-border: var(--gold-600);

--gradient-aurora: linear-gradient(90deg, var(--aurora-1), var(--aurora-2) 55%, var(--aurora-3));
--gradient-halo:   conic-gradient(from 180deg, var(--halo-pink), var(--dragon-violet), var(--dragon-cyan), var(--gold-ring), var(--halo-pink));
--glow-violet:     radial-gradient(60% 60% at 0% 0%, var(--nebula-violet) 0%, transparent 70%);
--glow-steel:      radial-gradient(50% 50% at 100% 40%, var(--nebula-steel) 0%, transparent 70%);

--focus-ring:    0 0 0 3px rgb(135 204 255 / 0.55);   /* aurora-1 at 55%; applied as outline + 2px offset, never as a radius-changing box-shadow */
--link:          var(--aurora-1);                      /* flat link colour in body copy and forms */
```

### 2.3 Contrast (WCAG, measured)

| Pair | Ratio | Use |
|------|-------|-----|
| white on bg | 20.2:1 | headlines |
| text-100 on bg | 16.5:1 | body |
| text-300 on bg | 10.8:1 | eyebrows |
| text-400 on bg | 6.6:1 | smallest allowed text (≥ 12px) |
| ember-ink on ember-500 | 9.9:1 | CTA label |
| ember-500 on bg | 9.6:1 | orange as text or icon |
| gold-300 on nebula-plum | 8.4:1 | badge |
| aurora-2 on bg (weakest stop) | 9.3:1 | gradient text stays readable at every stop |
| text-100 on surface | 15.3:1 | card body |
| border vs surface | 1.3:1 | decorative only; use border-strong (3:1) on inputs |

Rules: never put text on the aurora gradient; the gradient *is* the text. Ember is for the single primary action per view; gold is for labels and rings, never buttons.

### 2.4 Light mode
Not in scope. The brand is a night sky. `color-scheme: dark` only; admin inherits the same tokens.

---

## 3. Typography

| Role | Font | Fallback | Notes |
|------|------|----------|-------|
| Display / headings | **Space Grotesk** (600/700) | system-ui | Geometric with character; matches the prototype's numerals. Self-host via `next/font`. |
| Body / UI | **Inter** (400/500/600) | system-ui | `font-feature-settings: "cv11","ss01"` for the single-storey a. |
| Code / IDs | **JetBrains Mono** (400) | ui-monospace | Canonical IDs, export tables. |

Scale (rem, 1rem = 16px), fluid on display sizes:

```
--fs-display: clamp(2.25rem, 1.5rem + 3.5vw, 4.5rem);   /* hero; capped so a ~15-char line fits the 7/12 column at 1280px */
--fs-h1: clamp(2.25rem, 1.75rem + 2vw, 3.5rem);
--fs-h2: clamp(1.75rem, 1.5rem + 1vw, 2.25rem);
--fs-h3: 1.375rem;
--fs-lead: 1.25rem;    /* hero paragraph, line-height 1.6 */
--fs-body: 1rem;       /* line-height 1.65 */
--fs-small: 0.875rem;
--fs-eyebrow: 0.75rem; /* uppercase, tracking 0.18em */
--fs-stat: clamp(2rem, 1.5rem + 1.5vw, 2.5rem);
```

Headings: line-height 1.05, letter-spacing -0.02em, color `--fg`. Eyebrows: uppercase, `--fg-subtle`, tracking 0.18em (the "AWS STUDENT BUILDER GROUP" line in the prototype).

---

## 4. Space, shape, elevation

- Spacing scale: 4px base → `1 2 3 4 6 8 12 16 20 24 32` (×4px). Section padding `clamp(3.5rem, 6vw, 6rem)` top and `clamp(2rem, 4vw, 4rem)` bottom, so two adjacent sections share about 130px on desktop and under 90px on phones; symmetric padding doubled up into dead air. Content max-width 1200px, gutter 16px mobile, 24px tablet, 40px desktop.
- Radius: `--r-sm 8px` (inputs, chips) · `--r-md 16px` (cards) · `--r-lg 24px` (hero panels, profile card) · `--r-pill 9999px` (buttons, badges).
- Elevation is glow, not shadow:
  - `--elev-1`: `0 1px 0 rgb(255 255 255 / 0.04) inset, 0 8px 24px rgb(0 0 0 / 0.35)` (cards)
  - `--elev-accent`: `0 8px 30px rgb(245 160 68 / 0.35)` (primary button hover)
  - `--elev-aurora`: `0 0 40px rgb(135 204 255 / 0.25)` (dragon halo only; the profile card is flat since 2026-10-03)
- Borders: 1px `--border`; cards get a 1px top highlight `rgb(255 255 255 / 0.06)` for the glass feel.
- Starfield: two layers of 1px dots at 0.35 and 0.6 opacity, generated once, `position: fixed`, never blocks pointer events.

---

## 5. Motion tokens

```
--dur-fast: 150ms;   /* hover, focus */
--dur-base: 250ms;   /* buttons, chips */
--dur-slow: 500ms;   /* section reveals */
--dur-hero: 900ms;   /* hero entrance */
--ease-out:   cubic-bezier(0.16, 1, 0.3, 1);     /* reveals */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);   /* loops */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);/* pops, badges */
```

Rules:
- Animate only `transform`, `opacity`, `filter`, and background-position. Never width/height/top/left.
- Every loop (float, shimmer, starfield drift) stops under `prefers-reduced-motion: reduce`; entrances collapse to a 150ms fade.
- Nothing moves on scroll by more than 24px of parallax. The site must not feel like a slideshow.
- Hover states exist for pointer devices only (`@media (hover: hover)`); touch gets the pressed state.

Full choreography for the landing page is in `landing-experience.md`, including the interaction layer (tilt, shared glow, marquee, route transitions; magnetic buttons were removed 2026-10-03) and the matching reduced-motion rows.

Cursor-driven effects live in one global pointer handler (`Pointer.tsx` in the mockup): one `pointermove` listener drives highlight, glow, and tilt so components stay declarative (`.tilt`, `[data-glow]`).

---

## 6. Iconography and imagery

- Icons: Lucide, 1.5px stroke, 20px in UI, 24px in nav. Social icons: Simple Icons (LinkedIn, Facebook, GitHub) rendered monochrome `--fg-muted`, brand color on hover.
- Dragon: one transparent PNG/WebP cut-out (full body, from the prototype) and the circular logo. Dragon appears in hero and on the inactive-profile page only. Logo mark appears in nav, favicon, OG image, vCard photo fallback.
- Photos: member avatars 1:1, 512px webp, 2px ring `--border`; director and officer cards are full-bleed 4:5 portraits with the name over a bottom scrim.
- No stock photography. Event covers are the only user-uploaded landscape images; shown with a bottom gradient to `--surface` so text sits on them.

---

## 7. Components (spec, not code)

| Component | Anatomy | States | Notes |
|-----------|---------|--------|-------|
| **Button / primary** | pill, 48px tall, 24px padding, Inter 600, `--accent` fill, `--accent-fg` text | hover: `--accent-hover` + `--elev-accent` + translateY(-1px); active: `--accent-600`; focus: `--focus-ring`; loading: spinner replaces label, width locked | One per view. "Apply now", "Save profile", "Accept". |
| **Button / secondary** | pill, 1px `--border-strong`, transparent, `--fg` text, trailing arrow icon | hover: border `--fg-subtle`, arrow translateX(4px) | "Explore events →". |
| **Button / ghost** | text-only, `--fg-muted` | hover: `--fg` | Tertiary actions, admin tables. |
| **Badge / eyebrow pill** | pill, `--highlight-bg` fill, 1px `--highlight-border`, `--highlight` text, uppercase 12px tracking 0.18em, leading icon 14px; `badge-sm` variant 24px tall, still 12px text | static | Hero eyebrow ("AWS Student Builder Group · PLMUN"), department tags, position badge on profiles. Position badges append the department only when the title doesn't already name it. Never below 12px. |
| **Chip** | `--r-sm`, `--surface`, 1px `--border` | selected: aurora border via `background: linear-gradient(--surface,--surface) padding-box, var(--gradient-aurora) border-box` | directory filters. |
| **Card** | `--surface`, `--r-md`, 1px `--border`, `--elev-1`, 24px padding | hover (interactive only): translateY(-4px), border `--fg-faint`, pointer-tracked radial highlight | officers, events, departments. |
| **Glass panel** | `--surface-glass`, blur 12px, 1px `rgb(255 255 255 / 0.08)` | — | sticky nav, hero stat strip. |
| **Stat** | numeral (Space Grotesk, `--fs-stat`, `--fg`) over label (`--fg-muted`, 14px) | count-up on reveal | 4 max in a row; 2×2 on mobile. |
| **Nav** | glass band 72px, logo+wordmark left (wordmark in `--logo-cyan`, eyebrow hidden under 480px), links `--fg-muted` 16px, CTA right as **secondary** until scrolled past the hero, then ember; mobile: sheet from right | link hover: `--fg` + 2px aurora underline sliding in | sticky after 80px scroll with `--elev-1`. Keeps "one ember per view" while the hero CTA is visible. |
| **Section header** | eyebrow badge → h2 → one-line lead | staggered reveal | every landing section starts with this. |
| **Profile card** | `--r-lg`, `--surface`, 1px `--border`, `--elev-1`; left-aligned header: 72px avatar beside name h1, headline, position as gold `.role-line` text (no badge); **vCard primary button** full width; bio (16px); link rows as a hairline list; Share / Copy as ghost buttons; footer with club link and card URL | — | the NFC landing view; see `01-profiles.md`. No gradient border, ring animation, tilt, or sheen (removed 2026-10-03 after review: "too much gradient and animation"). "Save contact" is the only ember on the page. Served as `/p/<id>/vcard` (text/vcard), not a client-side blob. Static CSS dots, no canvas. |
| **Link button (social)** | full-width row, 56px, `--surface`, icon left, label, external-link icon right | hover: brand color icon, border `--fg-faint` | LinkedIn, Facebook, GitHub, website. |
| **Input / textarea / select** | 48px, `--r-sm`, `--bg-band` fill, 1px `--border-strong`, label above in `--fg-muted` 14px, help/error below | focus: `--focus-ring`, border `--aurora-1`; error: border `--danger` + message; disabled: 50% opacity | all forms. |
| **Toast** | glass panel bottom-center, icon + text, 4s | enter: spring up; exit: fade | saves, errors. |
| **Table (admin)** | dense, 44px rows, sticky header `--bg-band`, zebra `rgb(255 255 255 / 0.02)` | row hover `--surface` | applications, members. |
| **Empty state** | small dragon-head mark, h3, one sentence, one button | — | no events, no applications. |
| **Skeleton** | `--surface` blocks with shimmer (aurora at 8% opacity) | — | directory, admin lists. |

Accessibility baseline: 44px minimum touch targets on coarse pointers (chips, small and ghost buttons, social icons grow to 44px under `@media (pointer: coarse)`), visible focus ring via `outline` + `outline-offset` so the element keeps its own radius, labels on every input, `aria-live` on toasts and count-ups, reduced-motion respected, no information carried by color alone (status chips carry text).

---

## 8. Admin app

Same tokens, no decoration: no starfield, no glows, no entrance animations beyond 150ms fades. Denser spacing (`--fs-body` 14px in tables), sidebar nav 240px on `--bg-band` at ≥ lg, content on `--bg`. Below lg the sidebar becomes a 56px top bar (menu button, current section, logo) and a left menu sheet with the same list, signed-in user, and "Public site" link; no horizontal nav scroller. Overview: a single KPI strip whose cells link into their section, a task list with one action button per row, a System block, and a stacked activity feed (actor + action, time underneath); columns never stretch to each other. List tables (`.table.rows`) stack into rows under sm: identity cell and status on the first line, a secondary line (`.cell-sub`), actions right-aligned on their own line (`.cell-actions`); secondary columns are `.hide-sm`. Wide reference tables (terms, export) keep the sideways scroll. Review drawer: identity header, scrolling body, action footer (Accept primary, Waitlist, Reject pushed right). Primary button remains ember so "Accept" and "Save" are unmistakable; destructive actions use `--danger` outline buttons with a confirm step.

---

## 9. Deliverables (tracked in TODO.md)

1. `packages/ui/tokens.css` — every variable in sections 2–5, plus Tailwind preset mapping (`bg-surface`, `text-fg-muted`, `rounded-pill`, `ease-out`, …).
2. `packages/ui` components from section 7, each with a story/preview route at `/dev/ui` in web (dev only).
3. `apps/web/public/brand/` — logo SVG/PNG, dragon cut-out webp (2 sizes), OG template.
4. Figma or static preview is optional; the `/dev/ui` route is the source of truth.
