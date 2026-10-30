---
name: Mara Ellison
description: A marked contact sheet — misregistered Portra strips, grease-pencil keeps, and one loupe. The page is the sheet.
colors:
  paper: "#C2BEB0"
  paper-hi: "#CBC7B9"
  paper-lo: "#B8B3A4"
  ink: "#14120E"
  mute: "#463F38"
  rule: "#555555"
  grease: "#C45C2A"
  grease-y: "#D4A017"
  film: "#0A0908"
  edge: "#9A9588"
  focus: "#8A1A22"
  chrome: "#1E1C18"
  rebate: "#050505"
  rebate-line: "#1A1510"
  frame-line: "#1A1814"
  type-on-film: "#E8E6E0"
typography:
  mast:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.18em"
  meta:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "10px"
    fontWeight: 500
    lineHeight: 1.7
    letterSpacing: "0.1em"
  edge:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "8px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.14em"
  enquire:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.16em"
  ask:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 2.4vw, 1.375rem)"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0em"
  shorthand:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "7px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.06em"
  frame-id:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "8px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.08em"
  loupe-label:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "9px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.12em"
  mailto:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.04em"
  aside:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.65
    letterSpacing: "0.03em"
  footer:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "10px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.04em"
rounded:
  none: "0"
  loupe: "50%"
spacing:
  pad: "clamp(1rem, 2.5vw, 2.5rem)"
  target: "44px"
  loupe: "168px"
  sheet: "1440px"
components:
  skip-link:
    backgroundColor: "{colors.paper-hi}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 1rem"
    height: "{spacing.target}"
  nav-link:
    textColor: "{colors.ink}"
    typography: "{typography.meta}"
  mailto:
    textColor: "{colors.focus}"
    typography: "{typography.mailto}"
  film-strip:
    backgroundColor: "{colors.film}"
    textColor: "{colors.edge}"
    rounded: "{rounded.none}"
  loupe:
    backgroundColor: "{colors.film}"
    textColor: "{colors.mute}"
    rounded: "{rounded.loupe}"
---

# Design System: Mara Ellison

Scope: the contact-sheet sample at `samples/mara-ellison/`. It does not restyle the Solved Tech marketing site or the Adrian Nica sample.

## Overview

**Creative North Star: "The sheet is the page"**

The site is a marked Kodak Portra contact sheet. Three misregistered strips, grease-pencil keeps and rejects, a loupe on 07B1, and one ask: hold these frames. The first viewport is the mast plus the film, not a headline and a button.

The darkroom-safelight world this file used to describe is retired. Do not bring back amber pools, fibre trays, Bricolage, or Literata.

**Key characteristics:**

- Paper field (`--paper`) on body chrome `#1E1C18`, with a static 1px grain
- IBM Plex Mono for the sheet; DM Sans only for the ask
- Grease marks multiply on the frames; reject X stays normal
- Desktop strips rotate and overrun; at 900px and below each roll is its own pull-strip
- The only circle is the loupe

## Colors

Closed set from `design/photography/v3/art-direction.md`. Do not add a second palette.

- **Paper / paper-hi / paper-lo** — the sheet. Grain sits on top.
- **Ink** — mast and ask. 10.05:1 on paper.
- **Mute** — meta, aside, footer, loupe label. Solid. 5.56:1 on paper. Never an opacity trick on type 14px or smaller.
- **Rule** — hairlines. `#555555`, at least 3:1 on paper.
- **Grease / grease-y** — pencil on photographs only. The mailto underline uses focus, not grease (grease on paper is 2.30:1).
- **Film / edge** — rebate and edge print. Edge is 6.66:1 on film.
- **Focus** — `:focus-visible` and the mailto. 5.01:1 on paper.
- **Chrome** — the desk around the sheet.
- **Rebate / rebate-line / frame-line** — the rough’s film border (`#050505`, `#1A1510`, `#1A1814`).
- **Type on film** — frame shorthand and frame numbers, with a 1px black shadow so they survive a bright dress.

## Typography

Two families, self-hosted, `font-display: optional`. Preload IBM Plex Mono only.

The mast is a filing line at 12px, not a display headline. The size step that matters is the ask: DM Sans at `clamp(1.25rem, 2.4vw, 1.375rem)`, line-height 1.4. Enquire is an 11px label because the art direction names that slot; it is not a marketing kicker above a hero.

Frame shorthand may be 7px. It is decorative. The frame’s `aria-label` carries the meaning.

## Layout

- **≥ 901px** — three rotated strips. Loupe rests above strip B: 148px, `left: 18px`, `top: -128px`, clear of the 07B1 grease circle. Label at `left: 168px`, `top: -108px`, at least 16px clear of 07B2, on a paper chip so mute type does not sit naked on the photograph.
- **768–900** — three pull-strips. Frames `min(42vw, 280px)`, at least 200px.
- **≤ 767** — three pull-strips in order A, B, C. Frames `min(78vw, 300px)`. The loupe rest image is not requested.
- Hold is a two-column grid on the desktop sheet and one column below 900px. No sticky call-to-action.

## Components

### Keeps

07A2, 07B1, and 07C3 are buttons. Enter or Space pins the loupe on a fine pointer. Escape returns focus to that keep. On a coarse pointer, the same control opens a circle up to 320px; a tap or Escape dismisses it.

### Loupe

Authored still `stripB-loupe-07B1.webp` for 07B1. The other keeps scale their own frame 2.15× inside the same rim. The rim is ink, not glass. Movement is 180ms ease-out, and 0ms when motion is reduced.

### Footer

The Solved Tech mark is `st-logo-mark.png` at 20px, beside the locked credit sentence. The colophon states the Unsplash licence and that each strip is derived from one source image.

## Motion

In-page jumps may use smooth scroll. `prefers-reduced-motion: reduce` forces `scroll-behavior: auto` and a 0ms loupe. Nothing else moves.

## Do

- Keep the three rolls reachable on a phone, with the grease on the frames.
- Use the picture pipeline (AVIF, WebP, JPEG) and `fetchpriority="high"` on the first frame only.
- Leave a visible TODO rather than inventing a line, a review, or a number.

## Don't

- Don't build package cards, equal grids, filter chips, or shortlist hearts.
- Don't use a cream-and-terracotta wedding theme, a hero with a subhead and a button, or soft-shadowed photos on flat panes.
- Don't revive the darkroom safelight, print a phone number, or name a place.
- Don't download a second, hidden strip set.
- Don't ship Fraunces, Outfit, Cormorant, Google Fonts, or a third type family.
