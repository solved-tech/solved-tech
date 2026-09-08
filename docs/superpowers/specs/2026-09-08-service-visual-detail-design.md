# Service Visual Detail Design

## Goal

Turn the five service-box illustrations from sparse wireframes into meaningful
product stories. Each visual should quickly show what Solved Tech can build
without requiring technical knowledge.

## Visual Direction

Use a hybrid system:

- Tangible products use recognisable mini interfaces.
- AI and integration work use connected workflow diagrams.
- Every scene uses concise English labels and familiar symbols.
- Visual detail supports the service copy instead of competing with it.

The existing charcoal, warm white, grey, and orange palette remains. Orange
shows actions, active routes, and completed work. No invented business metrics,
performance claims, gradients, shadows, or icon library are introduced.

## Website Scene

The browser contains:

- A compact navigation row labelled `Home`, `Shop`, and `Contact`.
- A clear hero area with a heading block and orange action.
- Two product tiles with image shapes and short content lines.
- A small basket symbol.

The browser frame draws first, then the page content settles into place. The
orange action receives the final emphasis.

## App Scene

The desktop interface contains:

- A narrow navigation rail.
- A task list with status markers.
- A simple activity chart without numeric claims.
- A highlighted completed task.

The phone contains the same active task and a completion check, showing that
the workflow continues between devices. Desktop and phone align on reveal;
their internal content appears immediately afterward.

## Traffic Scene

Replace the empty target with a small acquisition path:

- A search-result panel labelled `Search`.
- A paid-placement panel labelled `Ads`.
- A website destination labelled `Visit`.
- One orange route connecting discovery to the destination.

Small signals move along the route once. The visual contains no percentages,
rankings, revenue, or conversion claims.

## AI Scene

Use a readable agentic workflow:

- A `Request` node sends work to a central `Agent` node.
- The agent consults `Memory`.
- The agent can use three tools: `CRM`, `Calendar`, and `Messages`.
- A `Done` node closes the workflow.

Connections show direction. Small orange packets move from the request to the
agent, from the agent to its tools, and finally to the completed result. The
diagram communicates orchestration without exposing implementation jargon.

## Connected Systems Scene

Use one integration hub connected to:

- `Shop`
- `App`
- `Payments`
- `CRM`
- `Data`

Each system uses a distinct simple geometric symbol. The hub and connection
routes activate in sequence, showing separate business systems working
together.

## Motion

- Existing service-box reveal timing remains under 900 milliseconds.
- Internal interface detail uses opacity and transforms of 12 pixels or less.
- Data packets and routes animate once when the box enters view.
- Hover and focus may replay a short route pulse, not the whole reveal.
- No animation loops continuously.
- Reduced motion displays every scene in its complete final state.

## Responsive Behaviour

- All scene labels remain readable on desktop and tablet.
- On mobile, secondary decorative marks may hide, but the named workflow nodes
  and primary route remain.
- SVG view boxes remain `520 × 300` so the existing service layout does not
  shift.
- Detail must not overflow its service box.

## Accessibility

All five inline SVG scenes remain `aria-hidden="true"` because the surrounding
service copy communicates the same meaning. No SVG element becomes interactive
or keyboard-focusable. Text contrast and service-box contact links remain
unchanged.

## Technical Direction

Update `renderServiceArt` in `src/render.ts` with richer SVG groups and
purpose-specific class names. Extend the service-art CSS in `src/styles.css`
for internal styling and choreography. No JavaScript controller, dependency,
external image, or content-model change is needed.

## Verification

- Renderer tests require the key plain-language labels in all five scenes.
- Renderer tests continue to require exactly five service artworks.
- The full Vitest suite, TypeScript check, Vite build, and whitespace check
  must pass.
- The local Vite server must return HTTP 200 after implementation.

## Out of Scope

Service copy, service-box layout, founder artwork, client journey, contact
details, navigation, hero, and deployment configuration are unchanged.
