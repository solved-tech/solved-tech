# void / frame — round 3

UI/UX notes on the 390 pause still. The chalk band and the 1440 vault column from round 2 stay as they were.

## Measured

| check | result |
| --- | --- |
| 390 pause seam | Series bottom, track top, and pause top are all 51.2. The pause is 120px wide against a 359px land plate. From y=51 down, black runs are the pause itself (118px) and continue without a gap. |
| Pointer | A click on a stamp focuses the track. `:focus-visible` is false, and the ring’s `::after` content is `none`. |
| Keyboard | `:focus-visible` is true. The ring is inset 4px, so the chalk outline and the void halo sit on the track edge. The pause does not stick up above that ring. |
| 1440 quiet stamps | 12.24px. “002 / flesh” and “003 / wasteland” sit inside their buttons. |
| Reduced motion | `prefers-reduced-motion: reduce` matches. The land image’s animation name is `none`. |

## What changed

- `placeTrackFocus` always passes `focusVisible`. A pointer passes false. Keyboard return, Escape, and keys 1/2/3 pass true.
- The track ring is drawn only for `:focus-visible`, on the track edge, so a focused pause plate does not leave a black cap between the chalk band and the ring.
- `samples/void-frame/DESIGN.md` records the SAFE contract: void, chalk, concrete, Oswald, and system mono. The Mara Ellison sheet at the repo root is unchanged. Nothing under `samples/void-frame/zoom/` was created or edited.
- The path waivers were removed from `.impeccable/config.json`.
- The vault line, the skip link, and the footer mark track at 0.04em. The series edge keeps 8px between the name and its chalk rule. Quiet stamps at 1440 are at least 12px.

## Detector

`impeccable detect` on `samples/void-frame/index.html` and `styles.css` exits 0 with no findings. It reads `samples/void-frame/DESIGN.md`, not the Mara sheet.

The same command against the live page still reports `edge-flush-cards`: the land plate is flush with the scroller at rest. That is the full-bleed snap, not a clipped card, so the plate is not inset.

Critique for this round was done in this thread from the stills and the detector, not by isolated subagents. The interview was not run. `buildPath` stays unset.

## Tests

`npx vitest run tests/samples.test.ts` — 12 passed.
