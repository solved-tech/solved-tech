# Service Diagram Refinement Design

## Goal

Reduce visual weight in the App, AI, and Connected Systems illustrations while
making their structure easier to understand at a glance.

Website and Traffic remain unchanged.

## App

- Separate desktop and phone frames with visible space; neither frame overlaps
  the other.
- Remove the activity chart and third task row.
- Keep two clear desktop tasks with one completed status.
- Show one matching task and completion check on the phone.
- Reduce frame and internal-line contrast slightly so the content, not the
  device outlines, leads.

## AI

- Make `Request → Agent → Done` the primary vertical and horizontal route.
- Place `Memory` above the Agent as a quiet secondary branch.
- Replace three separate tool branches with one `Tools` group containing
  `CRM`, `Calendar`, and `Messages`.
- Remove arrowheads.
- Use orthogonal connectors that stop at node edges.
- Centre every label with SVG `text-anchor="middle"` and
  `dominant-baseline="middle"`.
- Keep one packet on the primary route and one on the tools route.

## Connected Systems

- Centre the labels inside every system box.
- Keep one small symbol per system without allowing it to compete with the
  label.
- Make the central hub opaque.
- Terminate each connector at the edge of the hub and the relevant system box.
- Remove crossing lines through the hub.
- Keep two restrained route packets.

## Motion

Existing reveal timing remains. Packets may move once along the shortened
routes. Hover and focus replay only packet movement. Reduced motion shows the
final static state.

## Verification

- Renderer tests require the simplified App labels and grouped AI `Tools`
  label.
- Renderer tests reject AI arrowhead classes.
- Browser review covers App, AI, and Connected Systems at desktop and
  390-pixel mobile widths.
- No horizontal overflow is permitted.
- Full tests, TypeScript, production build, and whitespace checks must pass.

## Out of Scope

Website, Traffic, service copy, box layout, all other homepage sections, and
deployment remain unchanged.
