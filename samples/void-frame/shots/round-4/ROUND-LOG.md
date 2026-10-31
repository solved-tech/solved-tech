# void / frame — round 4

UI/UX notes on the 768 fold, the 1440 quiet stamps, and the ring on 001 in the 390 pause still. The pause cap, the track’s focus-visible ring, DESIGN.md, the 1440 column, and reduced motion stay as signed off.

## Measured

| check | result |
| --- | --- |
| 768 band | The series is in flow, 768×56, background `rgb(255, 255, 255)`, blend `normal`. Its bottom, the track top, and the pause top are all 56. A row through the band (y=4) is chalk across the full width. The black pause at the right edge starts at y=56, not at the top of the viewport. Stamp colour is `rgb(0, 0, 0)`. |
| 768 pause | 246px against a 737px land plate. |
| 1440 colour | Inactive stamps compute to chalk on void, including `:hover` and `:focus-visible`. The pressed stamp computes to void on chalk, including `:hover`. See `PIXEL-SAMPLE.md`. The stamp column has no chromatic pixels. |
| 390 pause, nothing focused | `document.activeElement` is `body`. The stamp ring is hidden. `:focus-visible` is false on the stamp and on the track. y=0 is chalk across the width. The 2px void rule under 001 is y=36–37, x=17–50. The pause is 120px against a 359px land plate. Series bottom, track top, and pause top are 51.2. |
| Pointer | A click on a stamp focuses the track. The stamp does not match `:focus-visible`, and the stamp ring stays hidden. |
| Keyboard | Focusing a stamp with `:focus-visible` shows the stamp ring, sized to that stamp. |

## What changed

- Below 1440 the stamp row keeps the in-flow chalk band, including at 768. The difference overlay is gone, so a dark plate cannot show through the stamps.
- Stamp colour is the token for `:link`, `:visited`, `:hover`, `:focus`, and `:focus-visible`. `-webkit-font-smoothing` is `antialiased`. At 1440 the rotated stamp is promoted so that smoothing is grayscale rather than an LCD fringe.
- The stamp ring is drawn only when the stamp itself is the active element and matches `:focus-visible`. A pointer press hides it.

## Detector

`impeccable detect` on `samples/void-frame/index.html` exits 0. It reads `samples/void-frame/DESIGN.md`.

The same command against the live page still reports `edge-flush-cards`: the land plate is flush with the scroller at rest. That is the full-bleed snap, so the plate is not inset.

## Tests

`npx vitest run tests/samples.test.ts` — 12 passed. Shots in this folder are the 768 fold, the 1440 fold, and the 390 pause, each with nothing focused.
