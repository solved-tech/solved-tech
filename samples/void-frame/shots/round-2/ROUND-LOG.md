# void / frame — round 2

UI/UX notes on PR #33. The three layout notes are in the CSS. Stills are in this folder.

## Measured

| check | result |
| --- | --- |
| 390 chalk band | 390×51, `rgb(255, 255, 255)`, mix-blend normal, in flow. The track and the pause both start at y=51, so 003 ends on the band. |
| 390 pause | 120 / 359 (one third) |
| 390 active rule | `inset 0 -2px 0` void on the ink. The ink is 34px wide inside a 57px button, so the rule matches the 001 glyphs. |
| 1440 vault | Banner is relative, 68px (`4.25rem`), concrete. `main` runs from y=68 to y=900. All four stamp labels sit inside their buttons. The active label is the full “001 / brutalism” (121px of type inside a 208px button). |
| Drop line | 12px, `rgb(255, 255, 255)` on `rgb(26, 26, 26)`. Contrast is 17.4:1. Copy is “drop · 004 · 0 plates”. |
| 768 | The stamp rail stays absolute, transparent, and `mix-blend-mode: difference`, overlapping the track. Pause is 246 / 737. |

## What changed

- Below 768, `.series` is an in-flow chalk band the height of the stamp row, and `#track` takes the rest of the viewport. Stamps no longer sit on plates. From 768 to 1439 the overlay and the difference blend return.
- The 390 active underline is a 2px void inset under the ink.
- At 1440, `body:has(.vault.is-on)` reserves `--vault-band: 4.25rem`. The banner keeps that height in flow, and `main` is `calc(100svh - var(--vault-band))` with `min-height: 0`, so the stamp column ends at the viewport. The active name uses a container-query size so “001 / brutalism” fits the shorter cell. The drop line is `0.75rem` chalk.
- A struck 004 on the 390 chalk band is void, the same as the other stamps on that band. At 768 and 1440 it stays chalk. The track is not emptied in the vault state.

## Detector

Non-interactive `impeccable detect`, before the waivers:

- `index.html` and `styles.css`: 23 findings (design-system-font 6, design-system-font-size 14, design-system-color 1, wide-tracking 1, cramped-padding 1). Exit 2.
- `http://127.0.0.1:8765/samples/void-frame/` at 390×844: one edge-flush-cards warning on the land plate. Exit 2.
- The same URL with `?vault=1` at 1440×900: wide-tracking, three undersized-ui-text hits on the inactive stamps (10.08px, the rough’s `clamp(0.625rem, 0.7vw, 1rem)`), and edge-flush-cards. Exit 2.

Those are the SAFE contract measured against the Mara Ellison `DESIGN.md`, or the rough itself: Oswald and system mono, void / chalk / concrete, the flush land plate, the flush series edge, 0.08em on the vault banner, and the inactive stamp clamp. File-scoped `detector.ignoreValues` in `.impeccable/config.json` name `samples/void-frame` only, so Mara and Adrian stay scanned. After the waivers the same three scans exit 0 with no findings.

`buildPath` is unset. This session has no image generator, and the interview was not run. The page stays code-led from the locked SAFE brief, and that choice is not stored.

Critique for this round was done in this thread from the stills and the detector, not by isolated subagents.

## Tests

`npx vitest run tests/samples.test.ts` — 12 passed.
