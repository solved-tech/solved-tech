---
name: Mara Ellison
description: Darkroom under safelight — wet prints on near-black ground, chrome quiet beside the photograph.
colors:
  ground: "#0c0a08"
  tray: "#161210"
  paper: "#ebe4d6"
  ink: "#ebe4d6"
  muted: "#c9b8a0"
  amber: "#c45a12"
  amber-soft: "rgba(196, 90, 18, 0.42)"
  paper-hover: "#fff6ea"
  rule: "#241c14"
  sheet-fill: "#2f2820"
typography:
  display:
    fontFamily: "Bricolage Grotesque, Segoe UI, sans-serif"
    fontSize: "clamp(3.25rem, 8vw, 6rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Bricolage Grotesque, Segoe UI, sans-serif"
    fontSize: "clamp(2rem, 3.4vw, 2.85rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Bricolage Grotesque, Segoe UI, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 700
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Literata, Iowan Old Style, Palatino Linotype, serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.5
  lead:
    fontFamily: "Literata, Iowan Old Style, Palatino Linotype, serif"
    fontSize: "clamp(1.1rem, 2vw, 1.3rem)"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Bricolage Grotesque, Segoe UI, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 500
  caption:
    fontFamily: "Literata, Iowan Old Style, Palatino Linotype, serif"
    fontSize: "0.98rem"
    fontWeight: 400
rounded:
  none: "0"
  pool: "50%"
spacing:
  gutter: "clamp(20px, 4.5vw, 72px)"
  paper-edge: "clamp(12px, 1.6vw, 22px)"
  tight: "12px"
  control-y: "12px"
  control-x: "22px"
  section-y: "clamp(3rem, 7vw, 5.5rem)"
  print-gap: "clamp(2rem, 5vw, 3.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ground}"
    rounded: "{rounded.none}"
    padding: "12px 22px"
    height: "48px"
    typography: "{typography.title}"
  button-primary-hover:
    backgroundColor: "{colors.paper-hover}"
    textColor: "{colors.ground}"
  skip-link:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ground}"
    padding: "12px 16px"
  nav-link:
    textColor: "{colors.muted}"
    typography: "{typography.label}"
  nav-link-hover:
    textColor: "{colors.ink}"
  tray:
    backgroundColor: "{colors.tray}"
    padding: "{spacing.paper-edge}"
    rounded: "{rounded.none}"
---

# Design System: Mara Ellison

Scope: visual world for the photographer sample at `samples/mara-ellison/`. It coexists with Solved Tech’s marketing site and does not redefine that site’s chrome.

## Overview

**Creative North Star: "The Darkroom Under Safelight"**

The site is a darkroom: near-black ground, amber light as atmosphere, photographs presented as wet prints with fibre-paper borders. Chrome stays subordinate to the print. Brand and enquire are the only bright signals that compete with the image; everything else reads as room, tray, or caption.

Personality is unhurried and material. Density is sparse — one composition in the first viewport, then a staggered run of prints, then short copy. The world refuses the category-default dark-minimal name-over-grid portfolio: no equal card grids, no eyebrow kickers, no glass marketing panels.

**Key Characteristics:**
- Near-black ground with safelight amber as atmospheric pools, never as an image tint
- Fibre-paper cream for print borders and the sole bright Enquire control
- Bricolage Grotesque for brand and UI; Literata for leads, body, and captions
- Trays and stacked prior prints as depth — not cards
- Sharp UI corners; soft drop shadows only under trays and prior sheets

## Colors

A warm darkroom palette: black room, amber light, cream paper, muted caption ink.

### Primary
- **Safelight Amber** (`amber`): Atmospheric light only — blurred circular pools with screen blend behind hero and prints, selection highlight, link underline tint, scrollbar thumb. Never washes photographs or fills large surfaces.
- **Fibre Paper** (`paper` / `ink`): Print borders (via fibre border-image), brand-weight UI text on dark ground, and the Enquire button fill. Same cream carries both paper border and primary ink on the darkroom floor.
- **Paper Hover** (`paper-hover`): Slightly brighter cream for primary-button hover only.

### Neutral
- **Darkroom Ground** (`ground`): Page background, focus-ring contrast partner, button text on paper.
- **Developer Tray** (`tray`): Recessed tray panel behind each print.
- **Caption Ink** (`muted`): Leads, body copy, nav links, figcaptions — warm, never cool gray.
- **Shelf Rule** (`rule`): 1px section dividers (about, footer).
- **Prior Sheet Fill** (`sheet-fill`): Placeholder tone under stacked prior prints in the hero room.
- **Amber Soft** (`amber-soft`): Soft amber alpha reserved for subdued safelight mixes.

### Named Rules
**The Safelight Rule.** Amber is light in the room, not a brand wash. Use it for pools, selection, and thin accents; never tint photographs or flood backgrounds.

**The Fibre Paper Rule.** Cream is the print edge and the Enquire signal. It is scarce on purpose — if cream appears as a large page field, the darkroom has failed.

**The Quiet Chrome Rule.** On any screen, the photograph outranks navigation, labels, and supporting copy. If chrome competes with the print, remove chrome.

## Typography

**Display Font:** Bricolage Grotesque (with Segoe UI, sans-serif)
**Body Font:** Literata (with Iowan Old Style, Palatino Linotype, serif)

**Character:** Industrial grotesque for the name and controls; literary serif for the quiet voice under the prints. Weight contrast does the hierarchy — 700 for brand and section titles, 400/500 for reading and nav.

### Hierarchy
- **Display** (700, `clamp(3.25rem, 8vw, 6rem)`, line-height 1.08, tracking −0.035em): Hero brand name only — the first-viewport headline *is* the photographer’s name.
- **Headline** (700, `clamp(2rem, 3.4vw, 2.85rem)`, line-height 1.08, tracking −0.035em): Section titles (Recent prints, In the room, Ready to talk dates?).
- **Title** (700, 1.2rem, tracking −0.03em): Sticky mark and button labels.
- **Body** (400, 1.125rem, line-height 1.5, Literata in `muted`): About paragraphs and long reading; keep measure near 36–42ch in editorial columns, footer credits up to ~75ch.
- **Lead** (400, `clamp(1.1rem, 2vw, 1.3rem)`, Literata): Hero supporting sentence; max-width ~28ch.
- **Label** (500, 0.95rem, Bricolage): Sticky nav links.
- **Caption** (400, 0.98rem, Literata in `muted`): Figcaptions under trays.

### Named Rules
**The Brand-Is-Display Rule.** The photographer’s name is the display size. Do not place a larger marketing headline above or beside it.

**The Serif-For-Voice Rule.** Literata carries sentences and captions; Bricolage carries names, section titles, nav, and buttons. Do not invert the pairing.

## Layout

Spatial model is a darkroom bench, not a marketing grid. Fluid gutter `clamp(20px, 4.5vw, 72px)`; content wrap max 1120px; print run max 1200px. Hero fills `min(100svh, 980px)` and ends content at the bottom edge. From 960px the hero becomes a two-column composition: tray dominant left, intro bottom-right. Work prints stagger — odd trays left-anchored, even trays right-anchored — single column, width capped at 720px, gap `clamp(2rem, 5vw, 3.5rem)`. About splits 1.4fr / 0.8fr from 720px. Sticky header min-height 4.75rem with blurred ground mix; scroll-padding 5.5rem.

### Named Rules
**The One Composition Rule.** The first viewport holds brand, one lead, one CTA group, one dominant tray print, and atmospheric room (safelight + prior stack). No stats, schedules, or secondary marketing in that frame.

**The Staggered Print Rule.** Portfolio prints alternate left/right on a single track. Never a same-size card grid of photographs.

## Elevation & Depth

Depth comes from trays, soft black drop shadows, overlapping prior sheets, and safelight pools — not from lifted cards or hard offset shadows. UI controls are flat. Sticky chrome uses a translucent ground mix plus blur so the room continues underneath.

### Shadow Vocabulary
- **Tray depth** (`box-shadow: 0 22px 48px rgba(0, 0, 0, 0.55)`): Under active print trays.
- **Prior sheet** (`box-shadow: 0 18px 40px rgba(0, 0, 0, 0.5)`): Under stacked hero prior prints.
- **Safelight pool** (blurred amber disc, `mix-blend-mode: screen`, opacity ~0.22–0.55): Atmospheric light, not a cast shadow.

### Named Rules
**The Tray-Not-Card Rule.** Photographs sit in recessed trays with fibre borders. Do not wrap images in bordered, radius, or equal-height cards.

**The Soft Depth Rule.** Shadows are soft black drops under material objects (trays, sheets). No hard offset neobrutalist shadows; no decorative multi-layer glows on chrome.

## Shapes

Form language is square and material. Buttons, trays, mark, and links use `0` radius. The only circular geometry is the safelight pool (`border-radius: 50%`) — light, not a UI chip. Fibre borders are rectangular paper edges via border-image, not rounded frames. Prior sheets rotate slightly (−3.2° / 2.4° / −1°) to read as a physical stack.

### Named Rules
**The Square Bench Rule.** Interactive chrome is sharp-cornered. Roundness belongs only to light pools.

## Components

### Buttons
- **Shape:** Sharp rectangle (`0` radius), min-height 48px, padding 12px 22px (16px inline on very small screens).
- **Primary:** Fibre paper fill, darkroom ground text, Bricolage 700, slight positive tracking (0.02em). Sole bright conversion control.
- **Hover / Focus:** Hover lifts cream to `paper-hover` and translates −1px; active returns to 0. Focus-visible is a 3px paper outline with 3px offset on all interactive elements.
- **Secondary / Ghost:** Not used. Text links in About carry ink with amber-tinted underline; they are not button variants.

### Cards / Containers
- **Not used as a pattern.** Depth containers are trays (`tray` background, `paper-edge` padding, soft shadow) and the atmospheric `room`. Do not introduce card shells for content blocks.

### Inputs / Fields
- No form fields in the shipped artifact. Enquire is `mailto:`. If fields appear later, match sharp corners, tray/ground surfaces, paper focus ring, and Literata for typed text / Bricolage for labels.

### Navigation
- Sticky top bar: mark left (Bricolage 700, ink), in-page links center-right (muted → ink on hover; hidden below 720px), Enquire button far right. Background is ground at 88% with 10px backdrop blur. Skip link uses paper on ground and drops in on focus.

### Tray (signature)
- Recessed `tray` panel, fibre border-image on the photograph, optional safelight pool behind print images, Literata figcaption in muted ink below. Hero tray up to 920px; work trays up to 720px. Prior stack in the hero room is three overlapping sheets with fibre borders — atmospheric, not interactive.

### Motion
- Prefer-reduced-motion respected: animations only under `prefers-reduced-motion: no-preference`.
- Hero safelight breathes (~7s alternate). Print safelights follow scroll via view timeline. Hero tray settles and intro rises (~900ms, cubic-bezier(0.16, 1, 0.3, 1)) by transform only, so the photograph stays visible from the first frame.

## Do's and Don'ts

### Do:
- **Do** keep the photographer’s name as the hero display signal and the dominant brand mark.
- **Do** present photographs as fibre-bordered trays on near-black ground with soft tray shadows.
- **Do** reserve safelight amber for atmospheric pools, selection, and thin accents.
- **Do** use fibre-paper cream for print borders and Enquire — scarcity is the signal.
- **Do** pair Bricolage for brand/UI with Literata for captions and body voice.
- **Do** stagger prints left/right on a single track with generous vertical gap.

### Don't:
- **Don't** build a dark-minimal name-over-equal-image-grid portfolio.
- **Don't** introduce cards, eyebrow kickers, pill clusters, or stat strips.
- **Don't** tint photographs with amber or flood the page with cream.
- **Don't** use hard offset shadows, multi-layer chrome glows, or rounded-full controls.
- **Don't** let supporting copy or nav outrank the print in the first viewport.
- **Don't** invent review scores, prices, or booking calendars — the sample stays honest and quiet.
