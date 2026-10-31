---
name: VOID / FRAME
description: A horizontal track of unequal plates. Three tokens, Oswald, and a chalk stamp band.
colors:
  void: "#000000"
  chalk: "#FFFFFF"
  concrete: "#1A1A1A"
typography:
  display:
    fontFamily: "Oswald, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 5vw, 2rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.02em"
  stamp:
    fontFamily: "Oswald, system-ui, sans-serif"
    fontSize: "clamp(0.75rem, 2.5vw, 1rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.02em"
  stamp-active:
    fontFamily: "Oswald, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.4vw, 2rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.18em"
  stamp-inactive:
    fontFamily: "Oswald, system-ui, sans-serif"
    fontSize: "clamp(0.75rem, 0.85vw, 1rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.06em"
  stamp-tablet:
    fontFamily: "Oswald, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 2.4vw, 2rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.16em"
  stamp-tablet-quiet:
    fontFamily: "Oswald, system-ui, sans-serif"
    fontSize: "clamp(0.75rem, 1.2vw, 1rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.16em"
  edge:
    fontFamily: "Oswald, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 2.2vw, 2rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.2em"
  series-edge:
    fontFamily: "Oswald, system-ui, sans-serif"
    fontSize: "5.25rem"
    fontWeight: 700
    lineHeight: 0.85
    letterSpacing: "-0.02em"
  vault-active:
    fontFamily: "Oswald, system-ui, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.04em"
  body:
    fontFamily: "Oswald, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "0.02em"
  vault:
    fontFamily: "Oswald, system-ui, sans-serif"
    fontSize: "clamp(0.85rem, 1.4vw, 1rem)"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "0.04em"
  exif:
    fontFamily: "ui-monospace, Menlo, Consolas, monospace"
    fontSize: "clamp(0.5rem, 0.7vw, 0.65rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.04em"
  drop:
    fontFamily: "Oswald, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0.04em"
  pause:
    fontFamily: "Oswald, system-ui, sans-serif"
    fontSize: "clamp(0.95rem, 1.6vw, 1.35rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.12em"
  serial:
    fontFamily: "ui-monospace, Menlo, Consolas, monospace"
    fontSize: "clamp(0.65rem, 1.05vw, 0.8rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.06em"
  serial-plain:
    fontFamily: "ui-monospace, Menlo, Consolas, monospace"
    fontSize: "0.65rem"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0.06em"
  colophon:
    fontFamily: "Oswald, system-ui, sans-serif"
    fontSize: "0.7rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.04em"
  colophon-strong:
    fontFamily: "Oswald, system-ui, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.1em"
  exit:
    fontFamily: "Oswald, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.1em"
  skip:
    fontFamily: "Oswald, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.04em"
rounded:
  none: "0"
spacing:
  band: "51px"
  target: "44px"
  u: "8px"
components:
  stamp-active:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.void}"
    typography: "{typography.stamp-active}"
    rounded: "{rounded.none}"
    padding: "0"
  stamp-inactive:
    backgroundColor: "{colors.void}"
    textColor: "{colors.chalk}"
    typography: "{typography.stamp}"
    rounded: "{rounded.none}"
    padding: "0"
  serial-tab:
    backgroundColor: "{colors.void}"
    textColor: "{colors.chalk}"
    typography: "{typography.serial}"
    rounded: "{rounded.none}"
    padding: "4px 8px"
  vault-bar:
    backgroundColor: "{colors.concrete}"
    textColor: "{colors.chalk}"
    typography: "{typography.vault}"
    rounded: "{rounded.none}"
    padding: "0.55rem 0.9rem"
---

# Design System: VOID / FRAME

## Overview

**Creative North Star: "The plate is the page"**

VOID / FRAME is a photography sample that is only the track. Photographs sit edge to edge. The pause is a black plate one third as wide, with the word void. Type is Oswald. Serials are system mono on a void tab. The palette is void, chalk, and concrete.

This file governs `samples/void-frame/` except `samples/void-frame/zoom/`, which is a different instrument and keeps its own sheet. The Mara Ellison sheet at the repo root is a different sample and is not this system.

**Key Characteristics:**

- Three colors: void `#000000`, chalk `#FFFFFF`, concrete `#1A1A1A`
- Oswald for stamps, the series edge, and the vault line. System mono for serials
- Square corners, no shadow, no extra face
- Below 1440 the stamp row is a full-width chalk band above the track, including at 768
- At 1440 the active series name is one full-height edge, and the active stamp is a chalk plate

## Colors

The palette is the plate, the stamp band, and the concrete vault bar.

### Primary

- **Chalk** (`#FFFFFF`): Type on void, the 390 stamp band, the active stamp fill at 1440, and the focus ring. On void it is 21:1. On concrete it is 17.4:1.

### Neutral

- **Void** (`#000000`): The page, the plates, the pause, and the serial tab.
- **Concrete** (`#1A1A1A`): The vault bar only.

### Named Rules

**The Three Token Rule.** No grey, no fourth color, and no opacity used to fake a mute. A struck stamp is the same chalk or void as the stamps beside it, with a line through the word. Stamp glyphs use that token in every state — link, visited, hover, and focus-visible — and they are smoothed with `-webkit-font-smoothing: antialiased`, so a quiet stamp does not pick up a colour fringe.

## Typography

**Display Font:** Oswald (with system-ui, sans-serif)

**Body Font:** Oswald

**Label/Mono Font:** ui-monospace, Menlo, Consolas, monospace

**Character:** Industrial stamps. The series edge and the 390 header track tight, at -0.02em. The vault line, the skip link, and the footer mark track at 0.04em. Everything on this page is lowercase.

### Hierarchy

- **Display** (700, clamp(1.5rem, 5vw, 2rem)): The pressed stamp on the chalk band.
- **Stamp** (400, clamp(0.75rem, 2.5vw, 1rem)): The quiet stamps on the chalk band.
- **Stamp, desktop** (700, clamp(1.25rem, 1.4vw, 2rem), 0.18em): The pressed stamp at 1440. The quiet stamps are clamp(0.75rem, 0.85vw, 1rem), at least 12px.
- **Series edge** (700, up to 5.25rem, -0.02em): The active series name, once, beside the track.
- **Vault** (700, clamp(0.85rem, 1.4vw, 1rem), 0.04em): “archive 04 is gone. forever.”
- **Drop** (400, 0.75rem): “drop · 004 · 0 plates”, chalk on concrete, at least 12px.
- **Pause** (700, clamp(0.95rem, 1.6vw, 1.35rem), 0.12em): The word void, or the mono serial from 768 up.
- **Serial** (700, clamp(0.65rem, 1.05vw, 0.8rem), mono): The plate tab, chalk on void.

### Named Rules

**The Band Rule.** Below 1440 the stamps sit on a chalk band the height of the stamp row, above the plates. At 768 the band is the same chalk backing as at 390. They do not sit on the photograph.

**The Third Rule.** The pause is one third of the land plate.

## Layout

Below 1440 the stamp row is an in-flow chalk band. The track fills the rest of the viewport. Plates are full-bleed. The land plate snaps to the start below 768. The pause is one third of that plate.

From 768 to 1439 the stamps keep that chalk band. They use the full series name, and the pause shows its serial. The track is the viewport under the band, not a full-viewport overlay.

At 1440 the page is brand, an empty rail, the track, the series edge, and a stamp column. The vault bar reserves 4.25rem and the column fits in the viewport under it. The active stamp reads in full, including “001 / brutalism”.

## Elevation & Depth

Flat. The chalk band, the void tab, and the concrete vault bar are solid fills. There is no drop shadow. The focus ring is a 2px chalk outline with a 4px void halo, and only on `:focus-visible`. It sits on the track edge. Pause is a black plate with the word void, not a dimmed photograph.

## Shapes

Corners are square (`0`). The reticle is a 52px square. The stamp band is a hard rectangle. Nothing is a chip, a card, or a pill.

## Components

### Buttons

- **Shape:** Square. Minimum target 44px.
- **Active stamp, 390:** Void type on the chalk band, with a 2px void rule under the ink, the width of the glyphs.
- **Active stamp, 1440:** Chalk fill and void type.
- **Inactive stamp:** Quieter type. On the chalk band it is void. On the void column it is chalk.
- **Disabled:** A strike. Not grey. Not a pointer target. On the chalk band the struck stamp is void. On void it is chalk.
- **Focus:** 2px chalk outline, 2px outside, with a 4px void halo. The track draws that ring on its own edge, and only for `:focus-visible`. The stamp ring is the same: it is drawn only while the stamp itself matches `:focus-visible`. A pointer click does not draw either ring.

### Navigation

The series is the only navigation. Keys 1, 2, and 3 switch series. Arrows move the track. Enter opens the plate. Escape closes it.

### Serial tab

One flush void rectangle in the corner of a plate. Chalk mono. It does not use a radius.

## Do's and Don'ts

### Do:

- **Do** keep the stamps on a chalk band above the plates below 1440, including at 768.
- **Do** keep the pause at one third of the land plate.
- **Do** use chalk on concrete for the vault drop line, at 12px or larger.

### Don't:

- **Don't** let a stamp sit on a plate below 1440.
- **Don't** draw the track ring after a pointer click.
- **Don't** add a color, a radius, or a shadow.
