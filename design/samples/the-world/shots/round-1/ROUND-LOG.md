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
