# Responsive UI Matrix Design

## Goal

Make every homepage section fit and remain legible continuously from 320×568
through 2560×1440 while preserving the immersive design. Scale and simplify
motion on constrained screens. Keep every section and every service diagram
visible at all viewport sizes.

## Principle

Viewport profiles are Playwright test fixtures only. CSS remains fluid and
content-driven. Breakpoints respond to content width and layout thresholds,
not to device model names or profile labels.

## Viewport Matrix

All dimensions are CSS pixels (logical viewport), not physical display
resolution. The matrix covers UK-leading sizes plus boundary and stress cases.

```
Profile            Width  Height  Purpose
------------------ ------ ------- ------------------------------------------
stress-compact     320    568     Minimum supported viewport; hero fit stress
uk-phone-compact   360    780     UK compact phone
uk-phone-standard  390    844     UK standard phone
uk-phone-large     414    896     UK large phone
phone-landscape    844    390     Phone landscape; short viewport height
tablet-portrait    768    1024    Tablet portrait
tablet-landscape   1024   768     Tablet landscape
compact-laptop     1366   768     Compact laptop
uk-desktop         1536   864     UK desktop
full-hd            1920   1080    Full HD desktop
wide-desktop       2560   1440    Wide desktop balance
```

## Breakpoint Bands

CSS uses five content-driven bands. Existing section-specific thresholds
(22rem, 26rem, 30rem, 48rem, 52rem) remain where content requires them; they
map within these bands rather than replacing them.

```
Band      Range              Pixel equivalent
--------- ------------------ ------------------
compact   below 23rem        below 368px
phone     23rem – 40rem      368px – 640px
tablet    40rem – 64rem      640px – 1024px
desktop   64rem – 96rem      1024px – 1536px
wide      above 96rem        above 1536px
```

Hero viewport height keeps `100svh` as fallback, then `100dvh`, minus
`--header-height`.

## Section Behaviour

### Header

- Sticky bar with logo and navigation; no collision between wordmark and menu
  control at any profile.
- Mobile menu toggle visible below 48rem; inline navigation at 48rem and
  above.
- Navigation links and menu toggle maintain at least 44px touch targets.
- Open mobile menu remains usable without horizontal overflow.

### Hero

- Fills first viewport using `svh` then `dvh` minus header height.
- Portrait phone profiles (320×568, 360×780, 390×844, 414×896): Call,
  WhatsApp, and Email actions fully visible within the first viewport below
  the header.
- Short landscape profiles (844×390): hero contact actions may sit below the
  first viewport; user scrolls to reach them. Horizontal bounds and control
  visibility still apply after scroll.
- Contact actions wrap without horizontal overflow; labels and icons remain
  vertically centred.
- Hero pipeline is decorative; clipping by the hero container is intentional
  and must not cause document-level horizontal overflow.
- Pipeline and ambient motion scale down on compact and short viewports.
- Signal graphic recentres at 40rem and above.

### Services

- Five service rows remain one full-width row each at every profile; rows are
  never hidden.
- Section heading “What do you need?” stays on one line where space permits.
- Service body uses stacked layout below 48rem; 68/32 diagram/capabilities
  split at 48rem and above without squeezing tablet artwork.
- Secondary SVG detail (`.art-detail--secondary`) may hide below 26rem to
  reduce clutter; primary diagram content stays visible.
- Capabilities grid collapses to one column below 22rem.
- Diagram artwork reveals on scroll when enhancements are enabled; service
  header, question, and body text remain visible before the reveal.
- Service CTA controls maintain at least 48px touch height.

### Journey

- Vertical timeline below 52rem: numbered steps, signal icons, and copy in
  readable single-column flow.
- Horizontal four-step route at 52rem and above with balanced spacing.
- Route animation direction matches layout (vertical scale below 52rem,
  horizontal scale at 52rem and above).

### Team

- Single-column founder cards below 48rem.
- Two-column founder grid with side heading at 48rem and above.
- Portrait and details grid prevent collision; LinkedIn links maintain 44px
  targets.

### Contact

- Three equal columns where space permits; single-column stack below 40rem.
- Sticky left heading rail activates at 64rem.
- All contact actions maintain at least 48px touch height.
- Trial note remains readable without stretching line length on wide screens.

### Footer

- Flex wrap with space-between; links maintain 44px minimum height.
- Prose and links stay within the shell; no horizontal overflow.

### Decorative Layers

- Ambient grid and code-field fragments remain behind content; scale and
  drift simplify on compact and short viewports.
- Decorative layers never block interaction or cause document overflow.
- Pipeline clipping in hero is intentional decorative overflow, not a layout
  defect.

## Motion

- On compact viewports and short viewports (including phone landscape):
  reduce animation amplitude, duration, or parallax; do not remove sections
  or service diagrams.
- `prefers-reduced-motion: reduce`: all content visible immediately; no
  entrance animations; journey route, service artwork, hero pipeline signals,
  and reveal states render complete and static.
- Horizontal journey route uses `scaleX(1)` under reduced motion at 52rem
  and above.
- Never hide a section or service diagram to compensate for motion
  constraints.

## Accessibility

- Primary contact and service actions: minimum 48px touch target height.
- Navigation, skip link, wordmark, footer links, and founder LinkedIn:
  minimum 44px touch target height.
- Browser zoom remains enabled; no `user-scalable=no` or maximum-scale
  restrictions.
- DOM source order matches visual reading order and keyboard focus order
  at every profile.
- Reduced-motion preference yields a complete, static page with no hidden
  content.

## Automated Acceptance Checks

Playwright smoke tests run at every matrix profile unless noted.

### Universal (all profiles, Chromium)

1. **No horizontal document overflow:** `document.documentElement.scrollWidth
   <= document.documentElement.clientWidth`.
2. **No console or page errors:** zero console errors and zero uncaught page
   errors during load and smoke interaction.
3. **Primary controls in horizontal bounds:** header wordmark, menu toggle or
   nav links, and hero contact actions are visible with bounding boxes fully
   within the viewport width at every profile.
4. **Minimum target sizes:** hero contact actions ≥ 48px height; navigation
   controls ≥ 44px height.

### Portrait phone (320×568, 360×780, 390×844, 414×896)

5. **Hero actions in first viewport:** bottom edge of the lowest hero contact
   action ≤ viewport height (accounting for sticky header). Applies to
   portrait phone profiles only; not short landscape.

### Short landscape (844×390)

6. **Hero actions reachable by scroll:** scroll hero contact actions into
   view; assert each action is visible and within horizontal viewport bounds
   after scroll.

### Layout transitions (content thresholds)

7. **40rem contact stack:** below 640px width, contact actions stack in one
   column.
8. **48rem service split:** at and above 768px width, service body uses
   two-column diagram/capabilities layout.
9. **48rem team grid:** at and above 768px width, team uses two-column
   founder grid.
10. **52rem journey horizontal:** at and above 832px width, journey moments
    use horizontal four-step layout.
11. **64rem contact rail:** at and above 1024px width, contact heading is
    sticky in the left rail.

### Services and motion

12. **Service rows visible before reveal:** service question and body text
    visible before diagram artwork animation completes.
13. **Diagram rendered visibility on scroll:** for each service diagram, hero
    pipeline, and journey signal graphic, scroll the element into view and
    assert rendered visibility (non-zero opacity, non-zero bounding box) with
    geometry fully within the viewport width; class presence alone is
    insufficient.
14. **Reduced motion complete:** at 390×844 with `prefers-reduced-motion:
    reduce`, all service artwork and journey content visible without
    animation.

### Wide screen

15. **2560×1440 balance:** prose line lengths stay constrained within shell;
    no accidental empty regions in the service grid.

### Browser coverage

- Chromium: full eleven-profile matrix.
- WebKit: key phone profiles (320×568, 390×844).
- `trace: "retain-on-failure"` and `screenshot: "only-on-failure"`.

## Baseline

Measured on `origin/main` at `54ad6d4` before responsive matrix changes.

**Confirmed defect:** at 320×568, hero actions begin at y=603px and end at
y=651px — 83px below the first viewport. Likely selectors: `.hero`,
`.hero__pipeline`, `.hero__actions`.

**Measured passing profiles:**

- 360×780: hero actions y=581–629; no document overflow.
- 390×844: hero actions y=596–644; no document overflow; service rows full
  width.
- 414×896: no document overflow.
- 844×390: no document overflow; desktop navigation active.
- 768×1024: no document overflow; service rows full width.
- 1366×768: no document overflow; service rows use the shell without
  accidental empty space.
- 1536×864: no document overflow.
- 1920×1080: no document overflow; service diagram/capabilities split
  visible.
- 390×844 reduced motion: animations suppressed and content remains visible.

**Intentional behaviour:** hero pipeline extends outside its box on phone
widths but is clipped by the hero container — decorative clipping, not
document overflow. Services remain one full-width row each at every viewport.

**Playwright targets still required:** 640px contact stack, 768px service
body and team transitions, 832px journey transition, 1024px sticky contact
rail, 2560×1440 wide-screen balance.

No CSS change is specified until Playwright evidence confirms a defect,
except preserving `svh` then `dvh` hero height and the stated breakpoint
bands.

## Playwright Architecture

- Pin `@playwright/test@1.63.0` in `package.json` and `package-lock.json`.
- Add `test:responsive` script.
- `playwright.config.ts`: one named project per matrix profile.
- Chromium runs the full matrix; WebKit runs key phone profiles only.
- Install Chromium and WebKit browsers only.
- `trace: "retain-on-failure"` and `screenshot: "only-on-failure"`.
- Add `.github/workflows/responsive.yml` for pull-request and manual-dispatch
  runs; keep the existing Pages deployment workflow unchanged.

## Verification Commands

```
npm test -- --run
npm run test:responsive
npm run check
npm run build
git diff --check
```

Manual inspection after automation passes: 320×568, 390×844 WebKit, 844×390,
768×1024, 1366×768, 1920×1080, and 2560×1440.

## Out of Scope

- Device-model-specific CSS profiles.
- Pixel-perfect screenshot baselines, Percy, or Chromatic.
- Copy, branding, founder assets, service content, or pipeline redesign.
- Hiding services or diagrams on small screens.
- Merging or deploying without explicit instruction.
