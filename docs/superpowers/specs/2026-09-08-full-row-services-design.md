# Full-Row Services Design

## Goal

Replace the asymmetric service mosaic with five consistent full-width rows and
make every service diagram the dominant visual element.

## Content Changes

The approved order remains:

1. Want to use AI?
2. Need more customers?
3. Need a website?
4. Need an app?
5. Need something else?

AI provides:

- AI assistants
- Agentic workflows
- WhatsApp & voice agents
- Custom MCPs
- MCP integrations

Service 05 keeps the question `Need something else?` but becomes intentionally
broad:

- Title: `Whatever your business needs`
- Answer: `If it does not fit a box, bring it anyway.`
- Provides: `Bespoke solutions`, `Business automation`,
  `Connected systems`, `Unusual requests`

MCP capabilities no longer appear in Service 05.

## Row Layout

Every service occupies one complete row. No service spans a different number
of grid columns and no row alternates its content order.

At 64rem and wider, each row uses:

- Offer and contact: approximately 24 percent.
- `We provide`: approximately 22 percent.
- Diagram: approximately 54 percent.

The row always reads left to right as offer, capabilities, diagram. The
diagram uses its entire column at a consistent `520:300` aspect ratio and is
vertically centred. All rows use the same internal padding, diagram boundary,
and alignment.

Between 48rem and 64rem, offer and capabilities share the first line while the
diagram occupies the full row below. Below 48rem, offer, capabilities, and
diagram stack in that order.

## Diagram Emphasis

- The visual column is larger than either text column.
- Diagrams are not given extra decorative frames or shadows.
- Existing SVG geometry and animation remain unchanged.
- The same art scale applies to AI, Customers, Website, App, and Something
  Else.
- A thin separator distinguishes the diagram from the text columns on wide
  screens.

## Capability Lists

Capability lists use a single column in the wide middle column for consistent
alignment. Tablet and mobile use two columns, falling back to one column below
22rem. AI may contain five items; all other services contain four.

## Markup

Each service link contains three direct layout regions:

1. `.service-box__copy`
2. `.service-box__provides`
3. `.service-box__artwork`

The number, question, title, answer, and contact action move into the copy
region. This keeps grid placement independent from text length.

## Accessibility

The entire row remains one contact link. Capability lists remain semantic
unordered lists. Decorative SVGs remain hidden from assistive technology.
Visual reordering is not used, so reading order matches display order.

## Verification

- Content tests require AI to contain both `Custom MCPs` and
  `MCP integrations`.
- Content tests require Service 05 to use the broad approved copy and contain
  no MCP capability.
- Renderer tests require five copy, capability, and artwork regions.
- CSS no longer contains service-specific column-span rules.
- Browser review covers wide desktop and 390-pixel mobile widths with no
  horizontal overflow.
- Full tests, TypeScript, production build, and whitespace checks must pass.

## Out of Scope

Service order, SVG geometry, motion, all other homepage sections, contact
details, and deployment remain unchanged.
