# Art direction — Mara Ellison v3 D2 Contact Sheet

**Status:** Artist contract for Factory. Aligns with `build-brief.md`. Closes `ux-pass.md` CRITICAL 1–4 and HIGH tablet / loupe / contrast / main.  
**Date:** 2026-10-30 (Europe/London)  
**Rough:** `direction-2.html` · shots `direction-2.png` / `direction-2-mobile.png` · proof `ux-audit/shots/`  
**Gate:** Copy remains **DRAFT** until Remus approves (`draft-copy.md` → `copy.md`). Factory stays on hold for copy; this file unblocks the art-direction gate.

---

## 1. Concept (one sentence)

The site **is** a marked contact sheet: three film strips of near-identical bursts, grease-pencil keeps and rejects, a loupe on the keep, and “Hold these frames” as the only ask — the story is the choosing.

## 2. Signature device

| Element | Spec |
|---|---|
| **Grease-pencil keeps** | Procedural wax (noise-masked strokes). Multiply on photo. Colour `--grease` / `--grease-y`. Wobbly double-stroke circles, uneven star, crop-mark L, reject X. **No** clean UI rects or perfect SVG circles. |
| **Keep / reject lock** | **07A2** keep (heavy circle + star); **07A3** reject (X). **07B1** keep (med circle + crop L) — **Remus confirmed 30 Oct 2026, not 07B2**; **07B4** reject. **07C3** keep (light circle); **07C2** reject. |
| **Wax / paper noise** | Sheet ground: `--paper` field + subtle static grain (`radial-gradient` 1px noise or SVG feTurbulence). `pointer-events: none`. Not animated. Outer body chrome `#1e1c18`. |
| **`print 8×10` note** | Handwritten grease note in the paper gap after strip A (`assets/marks/print-note.png`). Rotate ~−7deg. Multiply. Not editable UI text. |
| **Loupe** | Authored tool, not cosplay. Default show on **07B1**. Asset: `assets/strips/stripB-loupe-07B1.webp`. Size `--loupe-size` 168px desktop / ~120px touch chrome; **desktop resting position is above the strip** (see §6) so it does **not** cover the 07B1 grease circle. |
| **Physical film** | Kodak edge print, sprocket bars, black border, strip misregistration, last frames cut by sheet edge. Strip C may overrun the sheet. |

---

## 3. Type and colour tokens

Builder **must** use exactly these. Values tighten the rough / brief where contrast failed AA.

```css
:root {
  --paper: #C2BEB0;
  --paper-hi: #CBC7B9;
  --paper-lo: #B8B3A4;
  --ink: #14120E;       /* 10.05:1 on --paper */
  --mute: #463F38;      /* SOLID. 5.56:1 on --paper; 4.94:1 on --paper-lo. NEVER opacity-faked mute on ≤14px type */
  --rule: #555555;      /* 4.01:1 on --paper (≥ 3:1 non-text). Tightened from UX floor #757575 which measures 2.48:1 on --paper */
  --grease: #C45C2A;    /* mark colour on photos (multiply); not body text */
  --grease-y: #D4A017;  /* star / crop accent on photos */
  --film: #0A0908;
  --edge: #9A9588;      /* 6.66:1 on --film */
  --focus: #8A1A22;     /* 5.01:1 on --paper; focus ring + mailto */
  --sheet-max: 1440px;
  --pad: clamp(1rem, 2.5vw, 2.5rem);
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;
  --font-ask: "DM Sans", system-ui, sans-serif; /* Enquire ask only — secondary, not identity */
  --loupe-size: 168px;  /* desktop resting; mobile overlay ~120px; full-width loupe on touch open = 100vw capped 320px */
  --target: 44px;
}
```

### Contrast ratios computed (WCAG relative luminance)

| Pair | Ratio | Floor | Result |
|---|---:|---|---|
| `--ink` `#14120E` on `--paper` | **10.05:1** | text 4.5:1 | PASS |
| `--mute` `#463F38` on `--paper` | **5.56:1** | text 4.5:1 | PASS |
| `--mute` `#463F38` on `--paper-lo` | **4.94:1** | text 4.5:1 | PASS |
| `--focus` `#8A1A22` on `--paper` | **5.01:1** | text 4.5:1 | PASS |
| `--rule` `#555555` on `--paper` | **4.01:1** | non-text 3:1 | PASS |
| `--rule` `#555555` on `--paper-hi` | **4.41:1** | non-text 3:1 | PASS |
| `--edge` `#9A9588` on `--film` | **6.66:1** | non-text 3:1 | PASS |
| ~~`#757575` on `--paper`~~ (UX suggestion) | **2.48:1** | non-text 3:1 | **FAIL — do not use** |
| ~~`#5C584E` on `--paper`~~ (brief draft mute) | **3.81:1** | text 4.5:1 | **FAIL — do not use** |
| Meta at `opacity: .55` blended | **~3.43:1** | text 4.5:1 | **FAIL — ban opacity mute** |

Hairlines, head/hold/footer borders, and nav underlines use solid `var(--rule)`. Meta, aside, footer, enquire label use solid `var(--mute)` — **no opacity on meta text**.

### Type scale (closed)

| Role | Spec |
|---|---|
| Mast `h1` | ~12px / tracking ~0.18em / uppercase / weight 500 / **line-height ≥ 1.0** / `text-wrap: balance` / `--ink` |
| Meta / edge / footer | 8–10px mono; meta uses `--mute` solid |
| Enquire label `h2` | ~11px uppercase tracked / `--mute` |
| Ask display | `clamp(1.25rem, 2.4vw, 1.375rem)` DM Sans; **line-height ≥ 1.0** (1.4 OK multi-line); `text-wrap: pretty` / `--ink` |
| Frame shorthand / fn | 7–10px on film; decorative; meaning also in `aria-label` |
| Mailto | ~13px; `--focus`; underline `--grease` or `--focus` |
| Loupe label | 9px uppercase tracked / `--mute`; mono |

### Fonts (OFL, self-hosted)

Ship **only**:
- `assets/fonts/ibm-plex-mono-latin-500-normal.woff2`
- `assets/fonts/dm-sans-latin-400-normal.woff2`

`font-display: optional`. Preload mono. **Do not ship** Fraunces / Outfit / Cormorant / extra DM weights. No Google Fonts CDN.

DM Sans is ask-only (secondary). Acceptable; if Remus wants a swap, OFL grotesk only — note in Marketing hand-off.

---

## 4. Layout per breakpoint

| Breakpoint | Width | Layout |
|---|---|---|
| **Desktop** | `≥ 901px` | Three misregistered physical strips on the paper sheet (transforms per rough). Grease on keep/reject. Loupe resting above strip B / 07B1 (see §6). Strip C may overrun. Hold = two-column grid. |
| **Tablet** | `768px – 900px` | **Composed separately — not squeezed desktop.** Three stacked horizontal `scroll-snap` pull-strips (A, then B, then C). Frame **min-width ≥ 200px** (prefer `min(42vw, 280px)`). Grease + edge print retained. Keeps inline on each strip. No five-up unreadably tiny frames (~125px ban). |
| **Mobile** | `≤ 767px` (touch layout also acceptable through 900 — if so, use tablet composition for all `≤ 900`) | **All three rolls in story order (A → B → C).** Each roll = own pull-strip with edge print + horizontal snap. **Keeps sit inline on each strip** (grease marks on 07A2 / 07B1 / 07C3). **No aside-only keeps.** First viewport: mast + strip A start (≥ ~300px frame). No marketing hero above the strip. |
| **Hold / footer** | all | In-flow. No sticky CTA chip. Mailto + ST ≥ 44×44. |

### Breakpoint CSS hooks

```css
/* Desktop sheet */
@media (min-width: 901px) { /* .desktop-rolls visible; .pull-rolls hidden */ }

/* Tablet + mobile pull composition */
@media (max-width: 900px) { /* .pull-rolls visible; .desktop-rolls not in DOM or not downloaded */ }
```

Rough may use `max-width: 720px` historically; **production raises touch layout to `max-width: 900px`** so 768 is never five-up desktop.

---

## 5. Imagery rules

- Production frames: `assets/strips/strip{A,B,C}-0…4.webp` (+ loupe `stripB-loupe-07B1.webp`).
- Marks: `assets/marks/` grease PNGs + `print-note.png`.
- Exact ST mark: `assets/st-logo-mark.png` — never recreate.
- **Do not ship:** `assets/raw/`, `assets/previews/`, `assets/set/` plate variants, `assets/overlays/`, unused fonts, `_killed/`.
- Broken image → film well + frame label still readable. Loading → reserved `aspect-ratio` (no CLS).

### Honest footer note (required)

Each strip’s frames are **derived from one Unsplash source image** (crop / tilt / exposure / blur variants), **not a real motor-drive burst**. Colophon must say so, e.g.:

> Photographs: Unsplash Licence. Each strip’s frames are derived from one source image (not a real burst).

See `assets/strips/SEQUENCE-NOTE.md` + `assets/set/CREDITS.md`.

---

## 6. Loupe behaviour (settled)

### Desktop resting geometry (default on 07B1)

Measured against `.roll-b` at 1440. Goal: **grease circle on 07B1 fully visible; label does not enter 07B2.**

| Element | CSS (relative to `.roll-b`) | Intent |
|---|---|---|
| `.loupe` | `left: 18px; top: -128px; width: 148px; height: 148px; transform: none;` | Sits **above** the strip in the paper gap, aligned to 07B1. Bottom edge may kiss the sprocket / frame top by ≤ 12px — must **not** overlap `#keep-b .grease-circle` bounds. |
| `.loupe-label` | `left: 168px; top: -108px; transform: none; white-space: nowrap;` | Right of loupe, still above the strip. Right edge must stay **left of 07B2’s left edge** (≥ 16px clearance). Text: `loupe · 07B1`. |
| Asset | `assets/strips/stripB-loupe-07B1.webp` | Magnification of keep 07B1. |

**Verify:** at 1440, bounding boxes must satisfy `loupe ∩ grease-circle = ∅` and `label.right < frame-07B2.left`.

### Interaction matrix

| Mode | Behaviour |
|---|---|
| **Hover** (`hover: hover` and `pointer: fine`) | Loupe appears / moves to the hovered `.keep` within ≤ 180ms ease-out. Leaving all keeps returns to 07B1 resting position (or hides if product prefers — default = rest on 07B1). |
| **Keyboard** | Each `.keep` is a focusable control (`button` or `a` with `aria-label`). **Enter / Space** opens / pins the loupe on that keep. **Escape** closes the pinned state and **returns focus** to the keep that opened it. Tab moves loupe with focus. `:focus-visible`: 2px solid `var(--focus)`, offset 3px. |
| **Touch** | Tap a keep → opens a **full-width loupe** overlay (max 320px circle, centred on viewport or over the keep). Tap outside, tap the loupe, or **swipe down/away** dismisses. Horizontal strip scroll remains native. |
| **Reduced motion** | Loupe appear/move = **0ms**. Loupe may sit static on the active keep. No chase animation. `html { scroll-behavior: auto }`. Content never hidden behind motion. |
| **Screen reader** | Loupe `aria-hidden="true"` when it only magnifies an already-labelled keep. Frame `aria-label` carries keep / soft / reject. |
| **JS fail** | Strips + grease visible; loupe optional/absent; mailto works. |

Device JS ≤ ~8KB gzipped. No scroll libraries. No WebGL.

---

## 7. Accessibility

- Skip link first in DOM → `#main` (preferred) or `#hold` inside main; visible on focus.
- `<main id="main">` wraps sheet content.
- Single `h1` (mast).
- Targets ≥ **44×44** for skip, nav, keep controls, mailto, ST.
- `:focus-visible` 2px `var(--focus)` / offset 3px.
- Text ≥ 4.5:1; non-text UI / hairlines ≥ 3:1 via `--rule`.
- `lang="en"`; `noindex` on example.
- No phone. Location-neutral. EXAMPLE honesty.

---

## 8. LCP recipe

- LCP element = first visible strip frame(s) in the first viewport (desktop: strip A frames in view; mobile: first `.m-frame` of strip A).
- Markup:

```html
<picture>
  <source type="image/avif" srcset="…-640.avif 640w, …-960.avif 960w" sizes="…" />
  <source type="image/webp" srcset="…-640.webp 640w, …-960.webp 960w" sizes="…" />
  <img src="….jpg" width="720" height="720"
       alt="…"
       fetchpriority="high"
       decoding="async" />
</picture>
```

- **Each candidate ≤ 200KB.** Hero / LCP frame(s) **≤ 200KB**.
- Above-fold: `fetchpriority="high"` + eager. Below-fold / off-strip: `loading="lazy"`.
- Floors: LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms; ≤ 2 font families.
- Generate AVIF in build if missing.

---

## 9. Performance — no dual strip download (CRITICAL)

**Ban:** shipping both `.desktop-rolls` and `.mobile-only` image trees and hiding one with `display: none` (probe showed ~25 ancestor-hidden imgs still `complete`, ~1MB waste).

**Required (pick one):**
1. **Render per breakpoint** — mount desktop strip tree only when `matchMedia('(min-width: 901px)')`, mount pull-strip tree only when `max-width: 900px` (`<template>` + small boot script); or
2. **Single DOM** that reflows (no duplicated `<img src>`); or
3. **Media-scoped sources** that do not resolve a URL on the inactive breakpoint.

### Mobile weight budget

| Budget | Cap |
|---|---|
| LCP frame (strip A keep or first A frame) | ≤ **200KB** |
| Initial viewport strip images (strip A, 5 frames @ ≤640w) | ≤ **450KB** |
| All three pull-strips on mobile (decoded transfer, lazy OK for B/C) | ≤ **900KB** total |
| Device JS | ≤ **8KB** gzipped |

Prove on a 390 network panel: inactive desktop strip URLs **do not** appear.

---

## 10. Licences

- Photos: **Unsplash Licence** — `assets/set/CREDITS.md`.
- Strip derivation honesty: `assets/strips/SEQUENCE-NOTE.md` + footer sentence in §5.
- Grease: procedural wax — no third-party crayon scan.
- Fonts: OFL (IBM Plex Mono, DM Sans).
- ST mark: Solved Tech property — exact file only.

Photographer credit in UI: prefer `Photo: [Name] / Unsplash` when names are verified. Unsplash returned 401 in-session for name lookup — until names are verified, colophon “Photographs: Unsplash Licence” + CREDITS.md URLs is acceptable. **Do not invent names.**

---

## 11. Copy — DRAFT

All user-facing strings from `draft-copy.md` until Remus locks `copy.md`.

**Keeps string (locked by Remus):** `07A2 · 07B1 · 07C3`.

Aside / Hold / mast / mail remain DRAFT. Visible `DRAFT` marker optional in rough; production waits on approval. Do not invent reviews, stats, phone, or city.

---

## 12. Decisions log (settles ux-pass)

| # | Decision | Value |
|---|---|---|
| **(1) Mobile rolls** | Show **all three** rolls A → B → C in story order; keeps **inline** on each strip; no aside-only keeps. | Three stacked pull-strips ≤900px |
| **(2) Contrast** | `--rule: #555555` (4.01:1 on paper); `--mute: #463F38` solid (5.56:1); **no opacity** on meta. `#757575` / `#5C584E` rejected by measurement. | See §3 table |
| **(3) Loupe** | Hover / keyboard (Enter·Space open, Esc close + focus return) / touch full-width + dismiss / reduced-motion 0ms. Desktop rest **above** strip B so circle stays clear. | See §6 |
| **(4) Tablet 768** | Composed as pull-strips; frame **≥ 200px** wide. Breakpoints: ≤767 mobile, 768–900 tablet, ≥901 desktop. | See §4 |
| **(5) Downloads** | No `display:none` dual trees. Mount per breakpoint or single DOM. Mobile budgets in §9. | See §9 |
| **Keep B** | **07B1** (Remus 30 Oct 2026). Loupe asset `stripB-loupe-07B1.webp`. | Not 07B2 |

---

## 13. Out of scope

Publishing / DNS / go-live (Remus). Phone. Buffer / Instagram. Resurrecting Through the Pane / darkroom Mara. Faking real-burst EXIF. Editing `ux-pass.md` or `build-brief.md` from this pass.

---

## 14. Done when

- [x] This file exists and matches `build-brief.md` (tokens tightened only where AA required).
- [x] Rough patched: loupe geometry, three mobile rolls, contrast solids, `<main>`, breakpoint download strategy.
- [x] Fresh shots 1440 / 768 / 390 prove no loupe∩circle and label clear of 07B2; mobile shows A+B+C. (verify-*-fold.png; direction-2.png / direction-2-mobile.png)
- [ ] Remus copy approval → `copy.md`.
- [ ] Factory launch by UI/UX or Eleos process.
