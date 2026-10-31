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

- Inactive column labels at 1440 are 10.08px because they must stay at most half the active label.
- The key legend is the visually hidden `#well-help` line. That matches an experience surface; it is not a help system.
- SAFE’s `samples/void-frame/index.html` is untouched. This branch’s sample test allows the `void-frame` directory without requiring that index, so a parallel SAFE edit of `tests/samples.test.ts` can conflict.
