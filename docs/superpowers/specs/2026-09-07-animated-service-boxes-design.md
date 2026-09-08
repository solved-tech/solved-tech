# Animated Service Boxes Design

## Goal

Make Solved Tech’s offer immediately scannable and visually memorable for
businesses of any size or sector. Replace the current selector-and-stage
presentation with five self-contained service boxes and give every box a
purpose-built animated illustration.

## Service Grid

All five services remain visible in one responsive grid:

1. “Need a website?” — Websites and online shops.
2. “Need an app?” — Web, mobile, and desktop apps.
3. “Need more traffic?” — Search and paid campaigns.
4. “Want to use AI in your business?” — Useful digital assistants.
5. “Need something else?” — Connected systems and custom builds.

Each box contains only the direct question, product name, one result-focused
sentence, and its illustration. The first and fourth boxes may span additional
space on wide screens to create an editorial composition rather than a uniform
card wall.

## Illustration and Motion

The illustrations use the existing warm white, charcoal, grey, and orange
palette. They are geometric and product-specific:

- Website: browser structure assembles and a clear action appears.
- App: desktop and phone frames slide into alignment.
- Traffic: a route pulses towards a visible target.
- AI: a three-stage workflow connects and completes.
- Custom work: separate blocks rearrange into one connected system.

Illustrations animate when their box enters the viewport and replay in a
restrained form on hover or keyboard focus. Motion uses transforms, opacity,
and stroke effects only. No animation blocks reading or interaction.
`prefers-reduced-motion` displays each final illustration state immediately.

## Founder Portraits

Replace the flat silhouette placeholders with two distinct editorial
illustrations. They remain visibly labelled as placeholders and do not pretend
to depict real people. Each portrait uses layered geometric facial forms,
subtle depth, a different composition, and a restrained orange accent.

Founder cards present the portrait first, then name, role, and a clear LinkedIn
icon. The two cards align on desktop and stack on mobile.

## Background and Hierarchy

The background code remains below three percent opacity and receives no orange
emphasis. Product illustrations hold the strongest visual contrast after the
hero. Service boxes use borders and spacing rather than shadows, glossy
effects, gradients, or excessive rounding.

## Responsive and Accessible Behaviour

- Wide screens: asymmetric two-column service grid.
- Tablet: balanced two-column grid with the fifth box spanning the row.
- Mobile: one-column boxes with illustrations below the copy.
- Boxes are readable without JavaScript.
- Focus styles remain visible.
- Decorative illustrations stay hidden from assistive technology.
- Text and interactive controls retain WCAG-compliant contrast and minimum
  44-pixel targets.

## Technical Direction

Keep the site framework-free. Render each service as semantic article markup
from the existing typed product data. Remove the product-selection state and
its `IntersectionObserver`; use the existing reveal observer only to add an
animation-ready class. CSS owns illustration choreography and responsive
layout. Founder portrait assets remain local SVG files.

## Verification

- Content tests preserve the five approved questions and plain-language copy.
- Renderer tests require five service articles, five distinct illustrations,
  and no selector/stage controls.
- Motion tests confirm the obsolete product-selection behaviour is removed and
  reduced-motion reveal behaviour remains.
- Run the complete test suite, TypeScript check, production build, and
  whitespace validation.
- Browser verification covers 1440-pixel desktop and 390-pixel mobile widths,
  keyboard focus, reduced motion, horizontal overflow, and console errors.

## Out of Scope

Real founder photography, industry stock photography, video, a carousel,
additional routes, and changes to the current contact placeholders are not
included.
