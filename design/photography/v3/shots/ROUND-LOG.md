# Mara Ellison contact sheet — review log

Branch `cursor/mara-contact-sheet`. Preview `samples/mara-ellison/`. Capture stand-in: Playwright + Chrome. `visual-review-loop` / `capture.mjs` is not in this environment or in `solved-tech/agentic-platform` on this machine. `design/research-lab/` is not in the repo. Contact sheets use `direction-2.png`, `direction-2-mobile.png`, and the proof frames in `ux-audit/shots/`.

Build defaults: `team/company/workflow.md` is not in the checkout. Commits follow the plugin’s conventional-commit rule.

Impeccable critique (round 3) ran as two isolated passes. Earlier rounds were single-context: the detector and the screenshots were already in this session.

## Round 1

Shots: `shots/round-1/`.

What was wrong:

1. The resting label “loupe · 07B1” sat on the photograph in `--mute` with no paper behind it.
2. Strip C overran the viewport (`scrollWidth` 1512 at 1440).
3. The resting loupe file was in the HTML, so a phone downloaded it even though the loupe was `display: none`.

Fixes: paper chip on the resting label (right edge still 17.6px clear of 07B2; loupe does not meet the 07B1 circle). `overflow-x: clip` on `html` (`scrollWidth` 1440, `scrollX` max 0). Loupe still is a `<picture>` whose source applies only at `min-width: 901px`.

## Round 2

Shots: `shots/round-2/`.

What changed:

1. Confirmed the picture source: desktop `currentSrc` is `stripB-loupe-07B1.webp`; a 390px load does not request it.
2. Solved Tech mark set to 20px, matching the rough, so it stays a credit.
3. Frame names that copy.md does not prefix (`07A4`, `07A5`, `07B3`, `07B5`, `07C1`, `07C4`, `07C5`) now match that file. The sheet group is named “Contact sheet film strips”.

`DESIGN.md`, `.impeccable/design.json`, the Mara surface brief, and the Mara facts in `PRODUCT.md` now describe this sheet. Adrian Nica’s published facts were left as they were. The darkroom safelight world is retired in those files.

Detector warnings that remain on purpose: edge print and meta are 8–10px because the type scale says so. The enquire label is 11px because the art direction names that slot. The ask is the size step (`clamp(1.25rem, 2.4vw, 1.375rem)`, measured 22px at 1440).

## Round 3

Shots: `shots/round-3/`. Contact sheets: build, chosen rough, `verify-*-fold`, and a second proof frame.

Isolated critique and audit, then these fixes:

1. Keep focus ring. `--focus` on the film rebate is 2.19:1. The ring is now a red stroke with paper on both sides, inset in the frame so the strip does not clip it. Red on paper is 5.01:1. Paper on the sampled 07B1 photograph is 3.66:1. Paper on the rebate is 10.95:1.
2. The touch loupe is a dialog. Focus moves to it when it opens. Escape closes it and returns focus to the keep that opened it (`#keep-b` verified).
3. The second “Solved Tech” link in the sample line was 70×13. The sentence stays. The 44px mark link is the one that goes to solvedtech.co.uk. The page still contains “Sample by” and `href="https://solvedtech.co.uk"`.

Also this round: the three keep ids no longer split so a line can start with “· 07C3”. The resting label no longer uses a negative margin, so the paper chip does not cover the lens (overlap false, gap 17.6px).

Left as specified, after the critique asked to move them:

- The resting loupe overlaps the bottom of 07A1. Art direction §6 hangs it 128px above strip B, clear of the 07B1 circle and 16px clear of 07B2. Both gates pass. The approved proof frame shows the same overlap.
- Reject shorthand stays “soft”. That is the locked copy. The accessible name still says “out of focus miss”. The X is the reject.
- Frame numbers and shorthand stay `aria-hidden`. They are the decorative 7–10px notes in the type scale. Several fail 4.5:1 on the photograph underneath. The name of the frame is the `aria-label`.

## Checks

- `npm test`: 203 passed.
- `sheet.js` gzip: 1659 bytes (budget 8KB).
- LCP candidate `stripA-0-640.avif` is 7566 bytes. `fetchpriority="high"`. No candidate over 200KB in `media/`.
- 390px: frame 300px, page `scrollWidth` 390, three rolls, loupe file not requested.
- 768px: frame 280px, three pull-strips.
- 1440px: loupe ∩ 07B1 circle is empty. Label gap 17.6px. One `h1`. `lang="en-GB"`. `noindex`. No phone number. No Google Fonts. No `style=` in the HTML.
- Reduced motion: `scroll-behavior: auto`, loupe transition `0s`.

## UI/UX round 1

Shots for this pass are artifacts, not files in `shots/`: `mara-ux-round-2/1440.png`, `768.png`, `390.png`, `390-loupe-tab.png`, `hold.png`. Capture is Playwright + Chrome, viewport only.

1. Touch loupe focus. At 390, opening `#keep-b` and pressing Tab left the layer open and moved focus to `.skip`. Tab now stays on `#loupe-layer` (`role="dialog"`, `aria-modal="true"`). Measured after Tab: `activeElement` id `loupe-layer`, `hidden` false, scrim `rgba(30, 28, 24, 0.55)`, circle 320×320 (`min(100vw, 320px)`). Escape still closes the layer and returns focus to `#keep-b`.
2. Hold type. The ask stays DM Sans (`22px` at 1440, `20px` at 390, `--ink`). The body no longer has the `ask` class. `.ask-body` is IBM Plex Mono `12px` in `--mute` (`rgb(70, 63, 56)`).
3. Footer sample line. Replaced the invented “Sample by Solved Tech.” with the copy.md sentence: “Example site. Fictional studio for demonstration.” The locked mark credit is unchanged. This replaces the round 3 note that the page still contained “Sample by”. The sample test expects that sentence here and still requires “Sample by” on the other samples.

`sheet.js` gzip: 1675 bytes. `npm test`: 203 passed.

## UI/UX round 2

Shot: `shots/390-loupe-focus.png`. Viewport 390. `#keep-b` open, then Tab.

The global `:focus-visible` rule drew `2px solid var(--focus)` with a 3px offset on `#loupe-layer`. The layer is `inset: 0`, so that outline sat outside the viewport and was clipped. The layer outline is now `none`. When the layer matches `:focus-visible`, `.loupe--full::after` draws the ring 4px inside the circle: `2px solid var(--focus)`, with `--paper` on both sides, same as a keep. Only those tokens. The circle stays `min(100vw, 320px)` (320px at 390). Sampled pixels on the ring are `--paper` `#c2beb0`, then `--focus` `#8a1a22`, then `--paper`, inside the circle.

Tab still keeps focus on `#loupe-layer` (`:focus-visible` true, layer open). Escape still closes the layer and returns focus to `#keep-b`.

`sheet.js` gzip: 1687 bytes. `npm test`: 203 passed.
