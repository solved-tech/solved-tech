# Round 1 — The World

Preview: `samples/the-world/`. Capture stand-in: Playwright + system Chrome at 390, 768, and 1440. `visual-review-loop` / `capture.mjs` is not in this environment. Contact sheets place the build next to `wild-v2/shots/` and two refs (`name-wpp-captions.png`, `vern-field-notes.png` on desktop; `craft-webb-hot-light.png` and the caption ref on mobile).

## Checks

- Rail click at 390 and 1440 for 11:00–15:00: matching `data-hour`, one `aria-current`, section stamp or fold hour inside the first 40% of the viewport.
- Scrolling to field notes leaves the hour on 15:00.
- `prefers-reduced-motion: reduce`: body transition `0s`, click on 15:00 jumps immediately.
- Fold people picture candidates are AVIF, WebP, and JPEG at 800/1200/1600, each ≤ 200KB, with `fetchpriority="high"`.
- Rail script is under 4KB. One family, self-hosted Bricolage Grotesque, `font-display: optional`.

## Fixes this round

1. A rail click set the hour, then `scrollend` fired on the first animation frame and the spy wrote 11:00 back. The lock now stays up until the jump finishes (or 500ms).
2. The locked desktop hour (`clamp(4.5rem, 14vw, 10rem)`) overflowed a `28vw` column and sat on the photograph. The hour column sizes to the display so the people plate stays clear.
3. The noon left frame was cropped onto sky, and a two-column wrap made “Left / Centre / Right” untrue on a phone. The three-up stays one row, and the street frames sit on the photographer.

Impeccable detect also flags Bricolage, the hour papers, the time stamps, the notebook rules, and the em dashes. Those are this sample’s contract and `copy.md`, not the Mara Ellison design file. Copy on the page is `copy.md` as it stood on 30 Oct (quiet “Sample”, no DRAFT stamp). Merging still waits for Remus.

## Round 2

UI/UX passed rail sync, spy, LCP, fonts, copy, and reduced motion. Three fixes, contract tokens only. Shots: `shots/round-2/` and artifacts `the-world/round-2/`. Capture stand-in is still Playwright.

1. At 390 the hour band is 28vh and the display line was 86px, stuck to the top by `flex: 0` and `space-between` once the brand was hidden. `.big` now fills that band and the glyphs centre in it (text centre 163px, band centre 164px). The line stays at `clamp(4.5rem, 22vw, 5.5rem)`.
2. The wordmark is “The World”. “Sample” is its own line, sentence case, mute, at the rail size (0.7rem). It no longer reads as a third word of the logotype.
3. `outline-offset: 2px` still landed on the shared rail rule and on `aria-current`. The rail ring is inset, with `--bg` paper on both sides of a 2px ink stroke, including on the current hour. Notes links use `outline-offset: 2px`.

`npx vitest run`: 11 files, 204 tests passed.

## Round 3

UI/UX verified the round 2 fixes. Two changes. Shots: `shots/round-3/` and artifacts `the-world/round-3/`. Capture stand-in is still Playwright.

1. At 390 the wordmark was missing from the first screen. “The World” and the “Sample” line now sit inside the 28vh hour band, small and in `--mute`, above 11:00. There is no header bar. The hour stays centred (text centre 163px, band centre 164px) with 17px between the label and the glyphs.
2. The horizontal rail fades on the right with a `mask-image` gradient, on the scrolling row only, so the rail plate stays opaque. Focusing 12:00 keeps that fade and a solid ring. Focusing 15:00, the hour under the fade, drops the mask so its ring stays solid.

Reduced motion: body transition `0s`, click on 15:00 lands with the section top at 0. `npx vitest run`: 11 files, 204 tests passed.
