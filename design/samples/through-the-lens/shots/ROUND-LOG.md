# Through the Lens — round log

Preview: `samples/through-the-lens/`  
Branch: `cursor/through-the-lens-sitting-2f2c`  
Contract: `design/samples/through-the-lens/art-direction.md`  
Copy: `safe-v2/copy.md` used verbatim. UI/UX released the copy gate on 30 Oct 2026. Merge still waits for Remus.

`visual-review-loop/capture.mjs` is not in this environment. Captures are Playwright + Chromium at 390×844, 768×1024, and 1440×900. Scroll jumps use `behavior: "instant"` so the frame is the settled page, not a smooth-scroll in-between.

## Round 1

Shots: `shots/round-1/`. Contact sheet pairs the build with `safe-v2/shots/fold-1440.png`, `safe-v2/shots/fold-390.png`, `refs/craft-avedon-west.png`, and `refs/comp-platon.png`. The refs stay out of git.

### Code scan

- No Google Fonts, no `tel:`, no phone number.
- Colour literals in CSS are the four tokens (`--ground`, `--ink`, `--mute`, `--rule`). `theme-color` repeats `--ground`.
- The word “aperture” appears only in the locked colophon sentence.
- No iris, viewfinder, bokeh, shutter control, filter chips, hearts, or masonry.
- LCP candidate `media/meets-1200.avif` is 35KB. Every shipped raster is under 200KB. Meets uses `<picture>` AVIF + WebP + JPEG with `fetchpriority="high"`.

### What the round fixed

1. The take strip sat under the fold. The 100svh plate starts below the fixed bar, so the bottom of the strip was clipped. On desktop the strip now sits `bar` height higher and is fully in the first viewport.
2. Enquire on a phone could not clear the last sticky note. The book was shorter than the viewport, so max scroll left Gaze 03 stuck over the blank note. The book is now at least `100svh - bar` tall, and `#book` lands under the bar with the previous note gone.
3. Note values were breaking on a single leftover word (`key`, `smile`). Values use `text-wrap: pretty`. Small UI text that the contract allows at 0.68–0.72rem is set at 0.72rem (11.52px) so the bar, kickers, and credits clear an 11px floor.

### Checks

- Desktop spy at scroll 354 still reads Meets / 02/05. At Past it reads 05/05. At Refuses it reads 01/01.
- At 390 and 768, Past and Refuses each show their own take and gaze in the viewport. Notes are about 210px, under 28svh.
- Enquire and the mailto measure at least 44px tall. Focus is a 2px ink outline.
- Reduced motion: `scroll-behavior` is `auto`, and a jump to Refuses still updates the note. The dedicated reduced-motion artifact is for the final round. `reduced-refuses-1440.png` is the check from this round.
- Sample test passes, including noindex, the example email, skip link, main, h1, and no inline styles.

### Impeccable

Single-context pass on the rendered page and `impeccable detect`. Detector warnings that name cream paper, Hanken Grotesk, or colours “outside DESIGN.md” are the locked sitting tokens. `DESIGN.md` in the repo is the Mara Ellison sheet, not this sample. Those warnings were not “fixed” by changing the contract.

Audit, this surface: accessibility 4, performance 4, theming 4 against the sitting tokens, responsive 4, integrity 3. The open integrity note is that the desktop note keeps the last gaze while the book is on screen, because the spy only tracks `.spread`.

### Still open for UI/UX

- Desktop note stays on Refuses during the book. Say if the margin should go blank there.
- Life-size uses the rough’s `scale(1.85)` / `object-position: 50% 22%`. Not measured with a ruler on a physical 24" panel.
- Copy is on the page. Merging still waits for Remus.

## Round 2

Shots: `shots/round-2/`. Same Playwright sizes as round 1. `behavior: "instant"` on scroll jumps.

### What changed

1. On desktop, when the top of `#book` is at or above `barH + 0.35*vh`, the fixed note is cleared. Gaze, take, fields, credit, and the kicker are hidden, and the live text is emptied. No take shows. Scrolling back onto a spread restores that spread, including the lens line `85mm · f/2 (example — EXIF absent)`.
2. Life-size ruler, scale unchanged at `1.85` (`matrix(1.85, 0, 0, 1.85, 0, 0)` at 1440). The Meets face is about 726 CSS px, which is 19.2cm at 96 CSS px/in, inside the band. `art-direction.md` and `build-brief.md` now say: life-size = 18–22cm at 96 CSS px/in, measured at 1440. The 492px figure and the 24-inch note are out of those two docs. The crop comment in `styles.css` uses the same sentence. `object-position` and `transform` are unchanged.
3. The skip link still points at `#main`. `#main:focus` is a 2px ink outline. That outline is covered: an inset one sits under the plate, and an outset one sits under the bar and the note. The visible indicator is a 2px `var(--ink)` frame, inset from the bar and the note. Pixels on the top, left, and right of that frame in the focus shot are `rgb(22, 21, 18)`.

### Shots

- `fold-390.png`, `fold-768.png`, `fold-1440.png`
- `book-1440.png` — book in view, note column empty
- `focus-after-skip-1440.png` — Tab to the skip link, Enter, focus on `#main`
- `reduced-refuses-1440.png` — `prefers-reduced-motion: reduce`, Refuses, take `01/01`

### Checks

- At 1440 the book top lands at 44px. The threshold is 359px. The note’s text is empty and the take is `display: none`.
- Past still reads `05/05` before the book threshold. Returning to Meets reads `02/05` and restores the lens example markup.
- At 390 and 768 the Meets stage note is 210px, under 28svh. No horizontal overflow. The fixed note stays `display: none`.
- Reduced motion: `scroll-behavior` is `auto`. A jump to Refuses updates the note. A jump to the book still clears it.
- `npx vitest run tests/samples.test.ts` — 10 passed.

### Still open for UI/UX

- Merging still waits for Remus. Copy on the page is unchanged.
- The focus frame is viewport-fixed while `#main` is focused, so it stays on screen through the book until focus moves on. Say if it should only mark the first plate.
