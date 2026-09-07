# Client Journey Section Design

## Goal

Replace the generic three-step process with a clear answer to the concern a
potential client has before making contact: “What happens after I call?”

The section should make working with Solved Tech feel straightforward,
collaborative, and low-friction.

## Content

The section uses this fixed copy:

- Eyebrow: “What happens next”
- Heading: “One call. Then we make it simple.”
- Moment 01: “Tell us what’s stuck.” / “No polished brief needed.”
- Moment 02: “Get a clear next move.” / “We explain the simplest useful route.”
- Moment 03: “See something real, early.” / “React to progress, not paperwork.”
- Moment 04: “Move forward with confidence.” / “We launch it with you.”

The short supporting lines remove common barriers to contact: needing a formal
brief, understanding technical options, waiting too long to see progress, and
being left alone at launch.

## Layout

The section follows the service grid and precedes the founder section.

On wide screens, four moments sit along one horizontal route. The heading stays
above the route so the journey can use the full content width. Each moment has a
two-digit number, its statement, its supporting line, and one small geometric
signal. The moments are not cards and do not use separate filled backgrounds.

The route is one thin neutral line with an orange completed segment. It starts
with a call signal and resolves into a check at the final moment. Borders,
spacing, and typography establish hierarchy; there are no shadows, gradients,
rounded containers, or ornamental icons.

## Motion

When the section enters the viewport, the orange route draws from the first
moment to the fourth. Each signal and text group settles into place in sequence.
The complete movement lasts no more than 900 milliseconds and uses only
opacity, stroke position, and transforms of 12 pixels or less.

The animation plays once. Hover and keyboard focus apply only a small orange
emphasis to the relevant moment; they do not replay the whole route.

Without JavaScript, the complete route and all content remain visible.
`prefers-reduced-motion` displays the final state immediately.

## Responsive Behaviour

- At 52rem and wider, the route is horizontal with four equal moments.
- Below 52rem, the route becomes vertical and the moments stack.
- Mobile spacing keeps each moment visually connected without making the
  section excessively tall.
- No fixed width may create horizontal overflow.

## Accessibility

- The journey is an ordered list so its sequence is available to assistive
  technology.
- The route and geometric signals are decorative and hidden from assistive
  technology.
- Text retains the existing contrast and type scale.
- The section contains no fake controls or focus targets. Any hover treatment
  is supplementary rather than required to understand the content.

## Technical Direction

Update the existing `approach` section in `src/render.ts`; no new content model
or dependency is required. Replace its current CSS rules in `src/styles.css`
with journey-specific layout and motion. The existing reveal observer adds the
animation-ready class, so no new JavaScript controller is needed.

## Verification

- Renderer tests require the approved heading and all four moments.
- Renderer tests require an ordered list and one decorative journey graphic.
- The old “Three steps. No fog.” copy must no longer render.
- Run the full Vitest suite, TypeScript check, production build, and whitespace
  validation.
- Review the section at 1440-pixel and 390-pixel widths when browser tooling is
  available.

## Out of Scope

The service boxes, founder section, contact methods, hero, navigation, and
background code are unchanged. The journey does not include a form, pricing,
delivery-time promises, or invented guarantees.
