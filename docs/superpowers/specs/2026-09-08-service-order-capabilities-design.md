# Service Order and Capabilities Design

## Goal

Reorder the service boxes around the strongest commercial entry points, change
Traffic to Customers, and clearly state what Solved Tech provides in every
box.

## Order and Content

1. `Want to use AI?`
   - Title: `Useful digital assistants`
   - Answer: `Take routine work, calls and messages off your team.`
   - Provides: `AI assistants`, `Agentic workflows`, `WhatsApp agents`,
     `Voice agents`
2. `Need more customers?`
   - Title: `SEO and paid campaigns`
   - Answer: `Help the right people find you when they are ready to act.`
   - Provides: `Technical SEO`, `On-page SEO`, `Google Ads`,
     `Conversion tracking`
3. `Need a website?`
   - Title: `Websites and online shops`
   - Answer: `A clear, fast place built to turn attention into action.`
   - Provides: `Business websites`, `Online shops`, `Landing pages`,
     `Ongoing improvements`
4. `Need an app?`
   - Title: `Web, mobile and desktop apps`
   - Answer: `A useful product built around the job it needs to do.`
   - Provides: `Web apps`, `Mobile apps`, `Desktop apps`, `SaaS platforms`
5. `Need something else?`
   - Title: `Connected systems and custom builds`
   - Answer: `Bring us the problem. We will find the simplest useful answer.`
   - Provides: `API integrations`, `Connected systems`, `MCP integrations`,
     `Custom automation`

The internal identifier `traffic` becomes `customers` throughout content,
rendering, styling, tests, and SVG metadata.

## Capability Presentation

Each service box includes a `We provide` block between its answer and
illustration. It contains an unordered list of four items.

- Items use plain text and thin dividing rules.
- The list uses no pills, rounded chips, icons, or nested cards.
- Wide layouts show the items in two columns.
- Narrow layouts retain two columns when the text fits and fall back to one
  column below 22rem.
- The block is part of the service link, so the full box continues to lead to
  contact.

## Layout

At wide widths:

- AI spans four of six columns and Customers spans two.
- Website spans four columns and App spans two.
- Something Else spans all six columns.

Tablet remains two columns, with Something Else spanning both. Mobile remains
one column.

## Accessibility

`We provide` is visible text followed by a semantic unordered list. No list
item is independently interactive. The existing service link remains the only
focus target in each box.

## Verification

- Content tests require the exact new order, `customers` identifier, and four
  capabilities per product.
- Renderer tests require five `We provide` blocks and twenty capability items.
- Renderer output must not contain the `traffic` identifier or
  `Need more traffic?`.
- Browser review covers wide desktop and 390-pixel mobile layouts with no
  horizontal overflow.
- Full tests, TypeScript, production build, and whitespace checks must pass.

## Out of Scope

Illustration geometry, service answers other than the Customers title, all
other homepage sections, contact details, and deployment configuration remain
unchanged.
