# Service Row Hierarchy Design

## Goal

Replace the current three-column service layout with a clear vertical
hierarchy:

1. Full-width service header.
2. Diagram beside `We provide`.
3. Dedicated `Talk to us` button.

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
- Diagram entrance and internal animations remain unchanged.
- Hovering the article may retain its subtle background change.
- The article does not imply clickability outside the contact button.
- Reduced-motion behaviour remains unchanged.

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
- CSS contains one shared 68/32 body grid and no three-column service row.
- Full unit tests, TypeScript checks, production build, and whitespace checks
  pass.
- Browser review covers a wide desktop and a 390-pixel mobile viewport with
  no horizontal overflow.

## Out of Scope

Service copy, order, capabilities, diagrams, diagram motion, other homepage
sections, contact details, and deployment remain unchanged.
