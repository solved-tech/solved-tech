# VOID / FRAME — The Zoom, round 1

Released STRETCH v2.1, built at `/samples/void-frame/zoom/`. Branch `cursor/void-frame-zoom-4c5a` (the cloud run requires the `-4c5a` suffix; the brief’s name was `cursor/void-frame-zoom`).

The pinned v2.1 contract was the comp. No concept tournament and no design interview. `.impeccable/config.json` records no `buildPath`; this round is code-led against the approved rough.

Capture stand-in: Playwright with `/usr/bin/google-chrome`. `visual-review-loop/capture.mjs` is not in this environment. Viewports 390×844, 768×1024, 1440×900. States: fold, focus, pause, focus-visible (skip link), reduced motion. Extra: `1440-vault.png`. `1440-focus.png` is a 96-colour dither of the same frame so the committed PNG stays under 1MB.

## What changed from the rough

- Tokens only `--void #000000`, `--chalk #FFFFFF`, `--concrete #1A1A1A`. Tektur self-hosted, `font-display: optional`, plus the system mono stack. Oswald is not shipped and not credited. Mixkit video is not on this route.
- Plates are in the HTML. Land `b04` is an AVIF/WebP/JPEG picture, each derivative ≤200KB, `fetchpriority=high`. Other plates are graded WebP, `filter: none`, `loading=lazy`.
- `scroll-snap-type: y mandatory` stays the no-JS base. With JS, `html.is-zooming` hides overflow and steps with `go(±1)`.
- Wheel, keys, and swipe move one plate per gesture. Wheel latch is 520ms with motion and 400ms reduced. Keys use 240ms. At the first plate upward and the last plate downward, the wheel is not captured, so the colophon can scroll into view.
- `landZoom` (26s, scale ≤1.1), `diveOut`/`diveIn` (scale ≤1.22), `invFlash` (80ms), and `zoomHold` (300ms) live inside `prefers-reduced-motion: no-preference`. JS reads `matchMedia` before any dive or flash. Reduced motion is an instant plate swap, no reticle, no invert.
- Reticle is 52×52, difference, fine pointer only, hidden until the first `pointermove`, and hidden while the dialog is open.
- Stamps are buttons with `span.s` (`aria-hidden`) and `span.f`. The clipped span is visually hidden, not `display: none`, and there is no `aria-label`.
- Pause and the struck `004` stamp are chalk. No `#9A9A9A`. Disabled is strike-through.
- Vault copy is both lines from `copy.md`: “archive 04 is gone. forever.” and “drop · 004 · 0 plates”. `?vault=1` shows the banner and the struck stamp. The well stays on brutalism land.
- The exact ST mark is `media/st-logo-mark.png`. Its opaque pixels are `#2F2F2F`, so it sits on a chalk chip. Adjacent text is “solved tech sample”. Link is `https://solvedtech.co.uk`. No email, no `tel:`.
- Footer credits follow `licences.md`. No fake EXIF.

## Required build fixes

1. `.void-mark` and the disabled stamp use `--chalk`. Strike, not grey.
2. `span.s` / `span.f`, one clipped, no `aria-label`.
3. Discrete wheel, key, and swipe steps. No free scroll mid-plate.
4. Vault includes `drop · 004 · 0 plates`.
5. Reticle hidden until the first fine-pointer move, and hidden under reduced motion.
6. No `grayscale()` or `contrast()` on masters.
7. Inactive stamps are half the active size (at 1440, 10.08px against 20.16px), full chalk.

## Fixes after the first look

- The serial tab was painting through the active stamp. The well sits under the rail, and the rail has padding so the type clears the tab.
- At 768, difference-blend chalk on the mid-grey shells failed. The rail is now chalk with a 1px void stroke. At 1440 the stroke is off and the active stamp is a chalk fill.
- The focus image is created on first open, so the dialog is not an empty `img`.
- The vault bar is in the page flow. The well, the stamp column, and the brand edge shrink under it, so the bar no longer covers `depth 01` or slices `001 / brutalism`.
- The skip chip sits on the photograph: top right below 1440 (depth shifts left while it is focused) and inside the well at 1440. It no longer covers the depth mark or the active stamp.
- `#well:focus-visible` is an inset chalk ring. The old `#well { outline: none }` had been winning over the page ring.

The wheel latch stays. A review note asked to delete it and rely on native snap. The brief requires one discrete step per gesture, with a short latch, and forbids scroll-jacking outside the well.

## Checks

Playwright on the Vite preview, 12 sample tests passing. Confirmed: seven brutalism plates at the well height, `landZoom` only when motion is allowed, reduced motion `animation-name: none` and reticle `display: none`, dialog opens on Enter with the land alt and `b04` source, wheel `depth 01` → `void` → still `void` during the latch → `depth 02`, vault strike stays chalk and the land plate stays, reticle arms only after `pointermove`.

## Audit (technical, current tree)

| # | Dimension | Score | Key finding |
|---|-----------|-------|-------------|
| 1 | Accessibility | 3 | Skip, well ring, names, reduced motion, and 44px targets are in place. Serial tabs and the 1440 inactive stamps are under 12px by the hierarchy rule; contrast on void is about 21:1. |
| 2 | Performance | 3 | Land derivatives ≤200KB and lazy plates. No perpetual animation frame. Six Tektur files for the weights in use. |
| 3 | Theming | 4 | Only the three tokens. |
| 4 | Responsive | 3 | 390, 768, and 1440 hold the two stamp placements. Touch swipe is in the script; this capture used a mouse. |
| 5 | Implementation integrity | 3 | The page is the zoom well, not a generic layout. Detector hits are Mara Ellison `DESIGN.md` drift and the specified tracking. |
| **Total** | | **16/20** | **Good** |

Detector on `index.html` exited 2 with 5 findings: wide tracking 0.08em and 0.06em (vault line and serial tab), Tektur and the mono stack “outside DESIGN.md”, chalk “outside DESIGN.md”. Those are false positives for this brief. `DESIGN.md` is the Mara Ellison sample and was not changed. No user-visible detector overlay: CSP `script-src 'self'` blocked `detect.js`. DOM injection was tried and did not execute.

## Left for a later round

- SAFE’s `samples/void-frame/index.html` is untouched. This branch’s sample test allows the `void-frame` directory without requiring that index, so a parallel SAFE edit of `tests/samples.test.ts` can conflict.

## Round 2

UI notes on PR #34. 1440 still matches v2.1. The chalk pause and the two-row vault bar stay.

- This sample now has `samples/void-frame/zoom/DESIGN.md`. The detector loads it for this route instead of the Mara Ellison sheet. `impeccable detect` on `index.html` exits 0. Tektur, chalk, concrete, and the mono credit stack are declared. Body and tab tracking is 0.04em so the wide-tracking rule does not fire. The repo-root `DESIGN.md` is unchanged.
- At widths under 768 the stamp row is a full-width void band, 56px tall. There is no chalk rule across the photograph. The active stamp shows `001` (the `.s` span). The full name stays in `.f`, visually hidden, and is the accessible name. `002` and `003` are 12px. The active code is 24px, so the inactive codes are half of it.
- The serial and `depth 01` share one flush void tab, chalk on void. On the phone the tab sits on the plate, flush with the top of the band, not inside it. At 1440 it is flush to the bottom-left of the well.
- At 1440 inactive stamps are 12px and the active stamp is 24px. The active cell does not shrink, and the label is `white-space: nowrap`, including in the vault state, so it stays `001 / brutalism` on one line.
- `#well` already references the visually hidden key legend with `aria-describedby="well-help"`.

Shots for this round: `void-frame-zoom/round-2/` — 390 fold, 390 pause, 1440 fold, 1440 vault.

## Round 3

UI note on the 390 band: `002` and `003` grew to fill the row, so `003` sat alone at the right. Below 768 the stamps are content-sized (`flex: 0 0 auto`), packed to the left (`justify-content: flex-start`), with a 24px gap, the same left grouping as The Track. The band stays a 56px void fill, with no rule across the photograph. The active code stays 24px and the inactive codes stay 12px. The meta tab stays flush above the band. 768 and 1440 are unchanged.

Measured at 390×844: the gap between stamp boxes is 24px. `003` ends at x 205, leaving 185px of the band empty on the right. The tab’s bottom edge meets the band’s top edge. Reduced motion sets the land image `animation-name` to `none`. At 768 the full names still pack left with gap 0. At 1440 the stamps stay a column, active 24px and inactive 12px.

Shots for this round: `void-frame-zoom/round-3/` — 390 fold, 390 focus-visible, 390 reduced-motion, 768 fold, 1440 focus-visible, 1440 reduced-motion. Twelve sample tests passed.

## Round 4

UI notes: the 390 grouping and the skip link stay. Two fixes.

- Inactive stamps were subpixel-striped, so `002` and `003` read light blue and the 1440 names carried a colour fringe. Links and stamp buttons now set `color: var(--chalk)` on `:link`, `:visited`, `:hover`, and `:focus-visible`, with `-webkit-font-smoothing: antialiased`. The label spans sit on a flat layer so the edges rasterize as equal-channel gray instead of RGB stripes. The 1440 active stamp stays void on chalk, including hover and focus.
- From 768 to 1439 the stamp row uses the same 56px void band as the phone. The chalk rule on the active name sits on that band. The meta tab sits flush above it. Full series names stay on one line. Below 768 is unchanged, including the 24px gap.

Pixel sample of the visible label boxes, device scale 1. Background pixels are excluded. Chalk is every channel at least 250. Void is every channel at most 8. A neutral edge has equal channels (delta at most 2) between those. Chromatic means the channels differ by more than 2. Tokens are void `#000000`, chalk `#FFFFFF`, concrete `#1A1A1A`.

| shot | stamp | role | css color | core rgb | core token | chromatic | max channel delta |
|---|---|---|---|---|---|---:|---:|
| 390 fold | 001 | active | 255,255,255 | 255,255,255 | chalk | 0 | 0 |
| 390 fold | 002 | inactive | 255,255,255 | 255,255,255 | chalk | 0 | 0 |
| 390 fold | 003 | inactive | 255,255,255 | 255,255,255 | chalk | 0 | 0 |
| 768 fold | 001 / brutalism | active | 255,255,255 | 255,255,255 | chalk | 0 | 0 |
| 768 fold | 002 / flesh | inactive | 255,255,255 | 255,255,255 | chalk | 0 | 0 |
| 768 fold | 003 / wasteland | inactive | 255,255,255 | 255,255,255 | chalk | 0 | 0 |
| 1440 fold | 001 / brutalism | active | 0,0,0 | 0,0,0 | void | 0 | 0 |
| 1440 fold | 002 / flesh | inactive | 255,255,255 | 255,255,255 | chalk | 0 | 0 |
| 1440 fold | 003 / wasteland | inactive | 255,255,255 | 253,253,253 | chalk | 0 | 0 |

Every sampled ink pixel has equal red, green, and blue. No stamp pixel is outside the chalk–void line. The full count is in `void-frame-zoom/round-4/PIXEL-SAMPLE.md`.

Shots: `void-frame-zoom/round-4/` — 390 fold, 768 fold, 1440 fold.

## QA advisories

Branched from `main` at `ff6358a` (the squash of pull request #34).

### Meta tab

The tab’s text content was `depth 01001·01 / 007`, one run, and `aria-hidden` kept that string out of the accessibility tree. Each tab now carries a visually hidden comma between the depth mark and the serial, and the tab is exposed. Chrome’s accessibility tree lists separate strings — `depth 01`, `,`, `001·01 / 007` — instead of one joined run. The comma is clipped (`1×1`), so it adds no gap: the tab’s painted width is still the depth mark plus the serial.

Before and after frames, animations held at 0, pixel diff 0:

| frame | different pixels |
|---|---:|
| 390 | 0 |
| 768 | 0 |
| 1440 | 0 |
| 1440 reduced motion | 0 |

### ST mark

The brand original is the read-only fixture `tests/fixtures/brand/st-logo-original-2048.png` (`ig-logo-exact-2048-transparent.png`, sha256 `411429d662a276bfa462a75e75ba47846be23a84f34b4732e7e5e8a157b9e1cf`). The shipped mark is `samples/void-frame/zoom/media/st-logo-mark.png` (sha256 `02fc797c7598ae54e42becd3822fc8d80b68b19eb43c2fd306fa98339432dd72`). They are different files. The brand canvas is 2048×2048 with ink at `x 597, y 557, 855×936`. The shipped canvas is 975×1056 with the same ink size at `x 60, y 60`. `tests/st-logo-match.test.ts` crops those content boxes, scales both to 128px wide, and compares them. Maximum channel delta is 0. IoU of the ink masks is 1. The shipped file is unchanged.

Shots: `void-frame-zoom/qa-advisories/before/` and `qa-advisories/after/` — 390, 768, 1440, and reduced motion.
