# Service Row Hierarchy Design

## Goal

Improve the homepage's mobile interaction and replace the current three-column
service layout with a clear vertical hierarchy:

1. Keep touch scrolling immediate and responsive.
2. Add a seven-node service pipeline to the hero.
3. Keep section labels on one line.
4. Give every service a full-width header.
5. Place its diagram beside `We provide`.
6. Finish with a dedicated `Talk to us` button.

Each service remains a full-width row and uses the same structure.

## Structure

Every service article contains three regions in this order:

```text
Header

Diagram | What we provide

Talk to us
```

### Header

The header spans the full row width and contains:

- Service number.
- Customer question.
- Service title.
- One-sentence description.

The number and question form the first line. The service title and description
follow beneath them. Header content never shares a grid column with the
diagram or capability list.

### Main Content

At 48rem and wider, the main content uses two columns:

- Diagram: 68 percent.
- `We provide`: 32 percent.

The diagram appears on the left and uses the full width of its column. The
capability list appears on the right in one column. A thin vertical divider
separates the two regions.

Below 48rem, the main content stacks in this order:

1. Diagram.
2. `We provide`.

The diagram continues to use its full available width.

### Contact Action

`Talk to us` becomes a dedicated anchor linking to `#contact`. It appears
after the main content, aligned to the left, and is styled as a clear button
with an arrow.

The service article itself is no longer wrapped in a link. This keeps the
heading, diagram, and capability list as content while exposing one
unambiguous contact action.

## Mobile Scrolling

The global `scroll-behavior: smooth` rule interferes with repeated
programmatic scroll steps used by Chrome's touch emulation. In a 390-pixel
mobile viewport, 30 requested 10-pixel steps reached only 182 pixels while
smooth scrolling was active. With immediate scrolling, the same sequence
reached the expected 300 pixels.

The page therefore uses:

- Immediate scrolling by default.
- Smooth anchor scrolling only when the primary pointer is fine.
- No hero pointer-follow interaction when the primary pointer is coarse.
- Passive scroll listeners and one `requestAnimationFrame` update per frame,
  preserving the existing progress indicator and background response.

No touch, pointer, or wheel handler may call `preventDefault`.

## Hero Service Pipeline

A responsive SVG service pipeline appears after the hero description and
before the Call and WhatsApp buttons.

The pipeline is a closed oval with seven connected service nodes in clockwise
order:

1. AI
2. Customers
3. Websites
4. Web apps
5. Mobile apps
6. Desktop apps
7. Custom systems

Each node uses a simple recognisable symbol. AI uses an agent-head icon rather
than text alone. Customers uses a target, Websites a browser, Web apps an
application window, Mobile apps a phone, Desktop apps a monitor, and Custom
systems connected nodes.

An orange signal travels along the closed route and activates each node in
sequence. The route and labels remain visible without motion. The animation
stops under `prefers-reduced-motion`.

The pipeline uses a wide oval on tablet and desktop so it does not make the
hero unnecessarily tall. On mobile it remains within the content width and
keeps every label legible without horizontal scrolling.

## Markup

Each service uses:

```html
<article class="service-box">
  <header class="service-box__header">
    <div class="service-box__heading">
      <span class="service-box__number">01</span>
      <strong>Want to use AI?</strong>
    </div>
    <span class="service-box__product">Useful digital assistants</span>
    <p>Take routine work, calls and messages off your team.</p>
  </header>
  <div class="service-box__body">
    <div class="service-box__artwork" aria-hidden="true"></div>
    <div class="service-box__provides"></div>
  </div>
  <a class="service-box__cta" href="#contact">
    Talk to us <span aria-hidden="true">→</span>
  </a>
</article>
```

The renderer supplies each service's real text, SVG, and capability list.
Decorative SVG markup remains hidden from assistive technology.

## Interaction and Motion

- Hovering or focusing the contact button changes its border and text to
  orange.
- Each service artwork carries its own reveal target.
- A diagram and its internal details animate once when that artwork enters the
  viewport.
- Service artwork does not replay when it leaves and re-enters.
- Hovering the article may retain its subtle background change.
- The article does not imply clickability outside the contact button.
- Touch devices do not depend on hover to see diagram motion.
- Reduced-motion behaviour exposes all content immediately and leaves every
  diagram and pipeline node static.

## Section Labels

`What do you need?` and `What happens next` remain on one line.

- `What do you need?` loses its narrow maximum width and uses a responsive
  font size that fits within a 390-pixel viewport.
- `What happens next` uses `white-space: nowrap`.
- Neither label may create horizontal overflow.

## Responsive Behaviour

- Wide and tablet: full-width header, 68/32 body, contact button below.
- Mobile: header, diagram, capabilities, contact button.
- All services use identical spacing, column proportions, and diagram scale.
- No service-specific layout rules or alternating positions are introduced.
- The layout must not overflow at a 390-pixel viewport.

## Accessibility

- Each service remains a semantic `article`.
- The service question remains visually prominent text within its header.
- Capability lists remain semantic unordered lists.
- Only the dedicated contact anchor receives link semantics and keyboard
  focus.
- Reading order matches visual order at every breakpoint.
- Existing contrast and focus-visible styles remain at least as strong.

## Verification

- Renderer tests require five service headers, bodies, artworks, capability
  regions, and contact links.
- Renderer tests verify that artwork precedes capabilities inside every body.
- Renderer tests verify that service articles are not wrapped in links.
- Renderer tests require the hero pipeline between the description and contact
  actions, with all seven labels and an AI agent icon.
- Renderer tests require service artworks to be independent reveal targets.
- Motion tests verify that coarse pointers skip hero pointer tracking.
- CSS defaults to immediate scrolling and limits smooth scrolling to fine
  pointers.
- CSS contains one shared 68/32 body grid and no three-column service row.
- Full unit tests, TypeScript checks, production build, and whitespace checks
  pass.
- Browser review covers a wide desktop and a touch-enabled 390-pixel mobile
  viewport, verifies immediate scroll progress, confirms service artwork
  activation, and checks for horizontal overflow.

## Out of Scope

Service copy, order, capabilities, existing diagram geometry, other homepage
sections, contact details, and deployment remain unchanged.
