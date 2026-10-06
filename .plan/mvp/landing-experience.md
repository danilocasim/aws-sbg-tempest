# Landing page experience

How the landing page looks, moves, and responds. Tokens come from
`design-system.md`; sections come from `docs/scope-v1.md` and ADR-0009/0011/0013.
The prototype's page structure (Tracks, Projects, Contact) is intentionally not
reused.

## Principles

1. **One wow, then calm.** The hero earns attention with the dragon and the aurora headline. Every section after it reveals quietly; nothing competes with content.
2. **Motion explains structure.** Staggers show reading order; hover highlights show what is clickable; count-ups say "these are live numbers". No motion for its own sake.
3. **Cheap to run.** Transform/opacity only, one lightweight canvas (starfield), IntersectionObserver for reveals, `motion` (framer-motion's small package) or plain CSS. Target: no long task > 50 ms on a mid-range Android, Lighthouse perf ≥ 90 with animations on.
4. **Honours reduced motion** everywhere, and the page is fully understandable with animation off.

## Page anatomy and choreography

### 0. Backdrop (persistent)
- `--bg` canvas with `--glow-violet` top-left and `--glow-steel` right, fixed.
- Starfield: `<canvas>` fixed, 2 layers of ~140 and ~60 stars, drifting at 2 px/min and 4 px/min with a 6 s twinkle on 10% of stars. Pauses when tab hidden and under reduced motion. Pointer-events none. Lazy-mounted after first paint.
- Mouse parallax: backdrop glows shift up to 12 px opposite the cursor (desktop only, lerped, 60 fps cap). Off on touch.

### 1. Nav
- Glass band. On load: fades in over `--dur-base`, no slide.
- Scroll > 80 px: band gains `--elev-1` and shrinks from 80 → 64 px (height transition is allowed here once, via padding).
- The nav carries exactly one accent line: the scroll-spy underline on the active link. No progress bar, no decorative rule under the band; the glass border is the only edge. Three stacked rules in 20 px read as clutter.
- Link hover: aurora underline grows from left (`scaleX` 0→1, `--dur-fast`). Active section link stays underlined (scroll-spy).
- Mobile: hamburger → full-height sheet slides from right (`--dur-base`, `--ease-out`), links stagger in 40 ms apart, body scroll locked, Esc/overlay closes.

### 2. Hero
Layout: 7/5 split on desktop (copy left, dragon right); stacked on mobile with a **small** dragon (40vw, max 180px, no reserved min-height) above the copy so the headline, lead, and primary CTA all land in the first 844px screen. Headline is two lines of at most ~15 characters each at every width.

Copy: eyebrow is factual, "AWS Student Builder Group · PLMUN" (no borrowed slogans). Headline says the specific thing: "Learn AWS / by **shipping it.**" with the aurora on the differentiator. Lead carries the proof: build nights, beginner-first workshops, projects shipped together.

Entrance sequence (runs once, total ~1.1 s, `--ease-out`):
| t (ms) | Element | Motion |
|--------|---------|--------|
| 0 | eyebrow badge "AWS Student Builder Group · PLMUN" | fade + translateY(8px→0), spring pop of the sparkle icon |
| 120 | headline line 1 | clip-path reveal bottom→top per line (mask), 500 ms |
| 220 | headline line 2 incl. aurora "shipping it." | same; aurora gradient then shimmers once left→right (background-position, 1.2 s) and settles |
| 400 | lead paragraph | fade + translateY(12px→0) |
| 520 | primary + secondary buttons | fade + translateY(12px→0), 80 ms apart |
| 300 | dragon | fade + scale(0.96→1) + translateY(16px→0), 700 ms; then enters idle loop |
| 700 | stat strip | divider line draws left→right (`scaleX`), stats fade in 60 ms apart, count-up 900 ms |

Dragon idle loop: translateY ±6 px over 6 s `--ease-in-out`, plus a 2° rotate on the cloud layer offset by 1.5 s so it reads as floating, not bobbing. Soft `--elev-aurora` glow behind it pulses 0.25→0.4 opacity over 8 s. Cursor within 300 px: dragon translates up to 8 px toward the cursor (lerp). Reduced motion: static image, glow static.

Buttons:
- Primary "Apply now": hover lifts 1 px, `--elev-accent`; a radial highlight follows the cursor inside the pill. Press: scale 0.98. It is the only ember button while the hero is on screen; the nav CTA is secondary until the nav enters its scrolled state.
- Secondary "See upcoming events →": arrow slides 4 px on hover.
- If no application window is open (ADR-0010), the primary button reads "Join the waitlist" and links to `/join` which explains when it opens; the hero never shows a dead CTA.

Stats (from DB, not hardcoded): members, events this year, build nights held, cost to join (always "₱0"). The visible numeral is `aria-hidden` while it animates; a visually hidden `aria-live="polite"` region receives the final value once.

### 3. About + mission (Pages)
- Two-column: left sticky eyebrow + h2, right markdown body. Reveal: left fades, right paragraphs stagger 60 ms.
- Pull quote from `mission` slot in `--fs-h3`, aurora left rule (2 px gradient bar).

### 4. Directors (current Term)
- Section header, then a row of up to 6 cards: a full-bleed 4:5 portrait with name and title set over a dark scrim at the bottom (no circular avatar inside a box). Until a photo exists the portrait is a hue-keyed field with a large faint monogram (`Portrait.tsx`). Reveal: cards rise 16 px with 70 ms stagger.
- Hover: card lifts 4 px, photo scales 1.03 inside its clip, a pointer-tracked radial highlight (aurora at 10%) on the card. Click → `/p/<id>` only if the member is `public`; otherwise not clickable (no dead links).

### 5. Departments with officers
- Grid of department cards (icon, name, one-line description, head + officer avatars stacked). Reveal with stagger.
- Hover on a card: avatars fan out 4 px each; "View department →" appears. Click → `/departments/[slug]`.
- Mobile: horizontal snap-scroll carousel with scroll padding; dots indicator.

### 6. Upcoming events
- Next 3 events as cards with cover (bottom gradient to `--surface`), date chip in `--highlight` style, title, venue.
- Nearest event card gets an aurora border that sweeps once (3 s) when the card reveals, then stays static. No infinite paint loop.
- Hover: cover scales 1.04, title color → `--aurora-1`. "All events →" secondary button below.
- Empty state: dragon-head mark and "No events scheduled yet. Follow us on Facebook." with the link.

### 7. Join CTA band
- Full-width `--bg-band` with the halo conic gradient at 12% opacity as a huge blurred disc behind the text. H2 "Build with us", one line, primary button. Reveal: disc scales 0.8→1 slowly (1.2 s) while text fades.
- Shows the application window state: "Applications open until 24 Jan" / "Applications open 10 Jan" / "Closed for this term".

### 8. Footer
- `--bg-band`, logo, three columns (Club, Members, Follow), copyright + "Built by the Technical department". Social icons monochrome → brand color on hover.

## Interaction layer (added 2026-10-03)

Everything below is transform/opacity only, pointer-device gated where it needs a cursor, and off or static under reduced motion.

| Interaction | Where | Behaviour | Job it does |
|-------------|-------|-----------|-------------|
| Route transition | every page | content fades in over 400 ms (opacity only, so fixed elements are not re-parented) | navigation feels continuous |
| Shared cursor glow | any `[data-glow]` grid | every card in the grid lights relative to the cursor, not just the hovered one | the grid reads as one surface |
| 3D tilt | `.tilt` cards (directors, departments, events, officers, directory) | ±7° rotateX/Y toward the cursor plus the 4 px lift | cards feel physical, invite clicking |
| ~~Magnetic buttons~~ | hero and join-band | removed 2026-10-03 ("I don't like the animation"); buttons keep the hover lift and radial highlight only | — |
| Eyebrow rule | every section header | a 24 px aurora line draws in before the eyebrow text on reveal | consistent section rhythm |
| Services marquee | under About | AWS service chips loop at 45 s, pause on hover, wrap statically under reduced motion | proof of what members build with |
| Countdown | "Up next" event badge | "in 15 days" / "in 3h 20m", refreshed each minute | urgency without a timer UI |
| Aurora re-shimmer | hero headline word | hovering the aurora word replays the 1.2 s sweep | a reward for curiosity |
| Back to top | after 900 px | glass pill bottom-right, spring in | long-page escape hatch |
| Footer delights | footer | logo spins once on hover; links underline from the left | polish |
| Profile card feel | `/p/<id>` | flat surface, route fade only; Share and Copy link under the link list. Tilt and holographic sheen removed 2026-10-03 (review: too much gradient and animation) | the page reads as a contact card in ten seconds |
| Join steps | `/join` | a four-row "How it works" list beside the form; rows stagger in, the current step is marked, and step 1 ticks off once the application is received | the list *is* the progress indicator; no separate stepper |
| Inline validation | `/join` | fields validate on blur and clear as you type; a PLMUN address gets a "fastest to verify" hint; submit shows a spinner with the label width locked; the success state is a receipt | fewer failed submits, no guessing what went wrong |
| Character counter | `/join` motivation | live "123 / 1000", warns past 900 | reduces abandoned submissions |
| Directory filtering | `/members` | results re-mount with a 40 ms stagger; `/` focuses search | filtering feels responsive |

## Scroll behaviour
- Reveals trigger at 15% visibility, once, never re-hide (no "pop out" on scroll up).
- Scroll-spy updates the nav underline per section.
- Smooth scrolling for in-page anchors with `scroll-margin-top` = nav height.
- No scroll hijacking, no horizontal scroll sections, no pinned sections.

## Responsive breakpoints
`sm 640 · md 768 · lg 1024 · xl 1280`. Hero stacks < lg with a small dragon above the copy. Stat strip 2×2 < md. People cards (directors, officers) are 2-up < sm, 4:5 portraits at every width. Departments are a snap carousel with dots < sm. Event cards 1 col < sm. The join page is one column < lg (intro, form, then the steps list) and a sticky 5/7 split ≥ lg (intro and a four-line steps list left, form right; help text appears only on error or when a PLMUN address is detected). Admin tables scroll inside their frame on phones. Section padding is top/bottom only so the container's side gutters always apply. The nav eyebrow hides < 480px. Nothing is hidden on mobile except cursor-only effects.

**Verification:** `node scripts/shots.mjs` in the mockup captures every route at 390×844 (touch, DPR 2) and 1280×800 into `.plan/mvp/evidence/{mobile,desktop}/` and prints any horizontal overflow with the offending element. Run it after any layout change.

## Performance budget (landing)
| Metric | Budget |
|--------|--------|
| JS for landing route | ≤ 90 kB gzipped incl. motion lib and starfield |
| LCP | ≤ 2.0 s on 4G mid-range phone (dragon webp ≤ 120 kB, `priority`) |
| CLS | 0 (reserve space for dragon and stats) |
| Long tasks | none > 50 ms after hydration |
| Lighthouse mobile | perf ≥ 90, a11y 100, best practices 100 |

## Reduced motion matrix
| Element | Full | Reduced |
|---------|------|---------|
| Starfield | drifting, twinkle | static dots |
| Hero entrance | staggered 1.1 s | single 150 ms fade |
| Dragon | float + cursor-follow | static |
| Aurora shimmer | once | none, static gradient |
| Count-ups | 900 ms | instant |
| Section reveals | rise + fade | fade only |
| Hover lifts | yes | color change only |
| Event aurora border | one 3 s sweep on reveal | static gradient |
| Route transition | 400 ms fade | 150 ms fade |
| Tilt (card grids) | on | off |
| Services marquee | looping | static, wrapped |
| Eyebrow rule / steps connector | draws | appears |
| Countdown | ticks | ticks (text only) |

## Acceptance checklist (used by TODO C2.9–C2.12)
- [ ] Every animation in the choreography table exists and matches timing within ±20%.
- [ ] `prefers-reduced-motion` toggled in DevTools: matrix above holds.
- [ ] Keyboard-only run: nav, all cards, buttons reachable; focus ring visible; mobile sheet traps focus.
- [ ] Lighthouse mobile ≥ 90 / 100 / 100 with animations enabled.
- [ ] No hardcoded names, numbers, or copy; seed swap changes everything.
