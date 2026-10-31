# void / frame — round 1

The Track, SAFE v9.2, at `samples/void-frame/`. Stills are in this folder. Reduced-motion stills match the settled plate because the flash, slam, and land drift are animations; the screenshots freeze them. Under `prefers-reduced-motion: reduce` the land image’s animation name is `none`, and the open dialog’s class is `focus-dlg` with no `is-flash`.

## Measured

| width | pause / land | serial tab | series edge | active stamp |
| --- | --- | --- | --- | --- |
| 390 | 120 / 359 (0.333) | void fill, chalk mono, 0 radius | hidden | 57×51 |
| 768 | 246 / 737 (0.333) | same | hidden | 239×56 |
| 1440 | 352 / 1057 (0.333) | same | flex, Oswald | 68×300 |

Track labels: `001 / brutalism, 7 plates, 6 photos`, `002 / flesh, 5 plates, 4 photos`, `003 / wasteland, 5 plates, 4 photos`. Vault (`?vault=1`) shows “archive 04 is gone. forever.” and “drop · 004 · 0 plates”, strikes 004, and leaves the current series photos in the track (7 plates). Tab order: skip, three stamps, track, colophon. The scroller is not a tab stop.

## What changed in this round

- Series type uses `mix-blend-mode: difference` on the stamp group, so chalk reads on the white sky. At 1440 the blend is off and the active stamp is a chalk plate with void type.
- The track focus ring is drawn inside the plate (2px chalk, 2px void) so `main` overflow does not clip it. Escape returns focus with `focusVisible`, and the ring is in the focus-visible stills.
- The stamp ring is a separate element outside the blend group, so it stays chalk and void instead of inverting with the type.
- Pause copy is the word “void” below 768 and the mono serial from 768 up.

## Detector

`impeccable detect` on the sample reported wide tracking, an empty 8px rail, a flush series edge, and Oswald / void / chalk outside DESIGN.md. Those are the SAFE contract. DESIGN.md in this repo is the Mara Ellison sheet, not this page. No broken-image finding after the closed dialog image points at the preloaded land AVIF.

Critique for this round was done in this thread from the stills and the detector, not by two isolated subagents. The Impeccable interview was not run: the SAFE v9.2 brief is the locked direction.

## Tests

`npx vitest run tests/samples.test.ts` — 12 passed.

The two 1440 focus stills were palette-reduced (128 colours) so each file stays under 1MB. They are the same settled dialog; the motion difference is not in the still.
