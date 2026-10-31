---
name: VOID / FRAME
description: A vertical zoom through a concrete gallery. Three tokens, Tektur, and a flush void tab.
colors:
  void: "#000000"
  chalk: "#FFFFFF"
  concrete: "#1A1A1A"
typography:
  display:
    fontFamily: "Tektur, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "0.04em"
  stamp:
    fontFamily: "Tektur, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "0.08em"
  stamp-active:
    fontFamily: "Tektur, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "0.04em"
  tab:
    fontFamily: "Tektur, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "0.04em"
  body:
    fontFamily: "Tektur, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "0.02em"
  vault:
    fontFamily: "Tektur, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "0.04em"
  credits:
    fontFamily: "ui-monospace, Cascadia Mono, Segoe UI Mono, menlo, consolas, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0em"
rounded:
  none: "0"
spacing:
  band: "56px"
  tab: "8px"
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
  meta-tab:
    backgroundColor: "{colors.void}"
    textColor: "{colors.chalk}"
    typography: "{typography.tab}"
    rounded: "{rounded.none}"
    padding: "4px 8px"
---

# Design System: VOID / FRAME

## Overview

**Creative North Star: "The instrument on the plate"**

VOID / FRAME is a photography sample that is only the plate, the stamp, and the tab. The photograph fills the viewport. Type is Tektur. The palette is void, chalk, and concrete. Depth is a black band or a black tab, never a grey mute and never type blended into the picture.

This file governs `samples/void-frame/zoom/` only. The Mara Ellison sheet at the repo root is a different sample and is not this system.

**Key Characteristics:**

- Three colors: void `#000000`, chalk `#FFFFFF`, concrete `#1A1A1A`
- Tektur for the instrument, system mono for the credit block
- Square corners, no shadow, no extra face
- Inactive stamps are half the active size and at least 12px
- The serial and the depth mark share one flush void tab

## Colors

The palette is the plate, the band, and the concrete vault bar.

### Primary

- **Chalk** (`#FFFFFF`): Type, the active stamp fill at 1440, and the focus ring. On void it is 21:1.

### Neutral

- **Void** (`#000000`): The page, the phone stamp band, the meta tab, and pause.
- **Concrete** (`#1A1A1A`): The vault bar only.

### Named Rules

**The Three Token Rule.** No grey, no fourth color, and no opacity used to fake a mute. Disabled stamps are chalk with a strike.

## Typography

**Display Font:** Tektur (with system-ui, sans-serif)

**Body Font:** Tektur

**Label/Mono Font:** ui-monospace, Cascadia Mono, Segoe UI Mono, menlo, consolas, monospace

**Character:** Industrial stamps. Short labels may track out. Body and the meta tab stay at 0.04em or tighter. Everything on this page is lowercase.

### Hierarchy

- **Display** (700, 1.5rem, 1.05): Active stamp and the vault line. At 1440 the active stamp is 24px so the 12px inactive stamp is half of it.
- **Stamp** (400, 0.75rem, 1.05, 0.08em): Inactive series codes. Never under 12px.
- **Tab** (700, 0.75rem, 1.05, 0.04em): `depth 01` and the serial, chalk on void.
- **Body** (400, 1rem, 1.15, 0.02em): The page default.
- **Credits** (400, 0.75rem, mono): The colophon credit block only.

### Named Rules

**The Half Stamp Rule.** An inactive stamp is at most half the active stamp, and at least 12px. Raise the active one to keep both.

## Layout

Below 1440px the stamp row is a full-width void band, 56px tall, at the bottom of the viewport. Below 768px the active code is one line. From 768px to 1439px the stamps may use the full series name, still on that band. The meta tab sits above the band, flush to the left edge of the plate.

At 1440px the stamps are a left column and `void / frame` is a right spine. The active stamp stays on one line, including when the vault adds a fourth stamp. The meta tab is flush to the bottom-left of the well.

## Elevation & Depth

Flat. The void band and the void tab are solid fills. There is no drop shadow. The focus ring is a 2px chalk outline. Pause is a black plate with the word void, not a dimmed photograph.

## Shapes

Corners are square (`0`). The reticle is a 52px square. The stamp band is a hard rectangle. Nothing is a chip, a card, or a pill.

## Components

### Buttons

- **Shape:** Square. Minimum target 44px.
- **Active stamp:** At 1440, chalk fill and void type. Below 1440, chalk type on the void band. Below 768 the visible label is the short code.
- **Inactive stamp:** Chalk type, half the active size, at least 12px.
- **Disabled:** Chalk with a strike. Not grey. Not a pointer target.
- **Focus:** 2px chalk outline. The well uses an inset chalk ring.

### Navigation

The series is the only navigation. Keys 1, 2, and 3 switch series. The key legend stays visually hidden and is referenced with `aria-describedby` on the well.

### Meta tab

One flush void rectangle holds `depth 01` and the serial. Both are chalk. It does not use difference blending, and it does not sit inside the phone stamp band.

## Do's and Don'ts

### Do:

- **Do** keep plates full-bleed and step them one at a time.
- **Do** use chalk on void for the tab, the pause word, and disabled stamps.
- **Do** keep inactive stamps at half the active size and at least 12px.

### Don't:

- **Don't** draw a rule across the photograph under the phone stamps.
- **Don't** add a color, a radius, or a shadow.
- **Don't** grey out type, or blend the meta tab into the picture.
