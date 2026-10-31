---
target: VOID / FRAME zoom sample
total_score: 27
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 0
target_identity: "file:/workspace/samples/void-frame/zoom/index.html"
target_fingerprint: "sha256:6ad1ad782d85f7dfbc42c2e859b1aad664672698b798330192adb9fe71249f7d"
target_path: /workspace/samples/void-frame/zoom/index.html
timestamp: 2026-10-31T11-06-30Z
slug: samples-void-frame-zoom-index-html
---
Method: dual-agent (A: bc-b56fa5b8-8c29-5ebb-b9f0-4a7190505f6d · B: bc-bfa2ae6e-a164-5507-b554-05c91269bcb5)

Assessment A scored the page before three layout fixes. Those fixes were then recaptured: the vault bar sits in flow above the well, the skip chip clears the depth mark and the 1440 stamp column, and `#well:focus-visible` draws an inset chalk ring. Scores below are the shipped page.

#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Depth, serial, and the pressed stamp stay visible, including under the vault bar and the focused skip chip. |
| 2 | Match System / Real World | 3 | `depth`, serials, and the pause word `void` are the piece’s language. |
| 3 | User Control and Freedom | 3 | Enter opens, exit and Escape close, stamps switch series. The wheel latch is the required one-plate step, and the last plate still reaches the colophon. |
| 4 | Consistency and Standards | 4 | Skip, exit, and the well share a chalk focus ring. Struck `004` stays chalk. |
| 5 | Error Prevention | 3 | `004` is struck, `aria-disabled`, and removed from the pointer. |
| 6 | Recognition Rather Than Recall | 3 | Series, depth, and serial stay on the plate. The key legend is visually hidden on `#well-help`. |
| 7 | Flexibility and Efficiency | n/a | Experience surface. Arrow keys and 1/2/3 are the viewing method. |
| 8 | Aesthetic and Minimalist Design | 4 | One plate, three tokens, no menu, card, or hero. |
| 9 | Error Recovery | 3 | `?vault=1` states that archive 04 is gone and shows `drop · 004 · 0 plates`. |
| 10 | Help and Documentation | n/a | Experience surface. |
| **Total** | | **27/32** | **Good** |

#### Design Specificity Verdict

**LLM assessment**: Authored for this sample. The fold is a plate: one photograph at `100svh`, a depth mark, series stamps, and a serial chip. At 1440 the active stamp is an inverse column on the left and `void / frame` is a vertical spine on the right. That matches the approved rough and could not be reskinned as a product homepage.

**Deterministic scan**: `impeccable detect --json samples/void-frame/zoom/index.html` exited 2 with 5 findings (4 warnings, 1 advisory), all filed at `index.html:0`. Wide tracking on `0.08em` (vault) and `0.06em` (serial tab). Font outside DESIGN.md: Tektur on the skip link, and the credits mono stack. Color outside DESIGN.md: chalk `#ffffff` on the skip link. DESIGN.md is the Mara Ellison sample. Tektur, chalk, and the stamp tracking are the pinned VOID / FRAME contract, so these five are false positives here. No broken-image finding remained after the focus image was created on open. No tiny-text finding remained after the vault drop moved to `0.75rem`. Serial tabs at 390 still compute to 10.4px and inactive 1440 stamps to 10.08px; contrast on void is about 21:1, and both sizes are the hierarchy rule (inactive at most half the active label; the serial is the manufacturing tab).

**Visual overlays**: No reliable user-visible overlay is available. CSP `script-src 'self'` blocked `http://127.0.0.1:8400/detect.js`. A script element was appended in a headless page and did not execute. `window.impeccable` was unset. CSP was not changed, and `index.html` was not given a detect tag. `live-server` was stopped with `--keep-inject`.

#### Overall Impression

The resting fold is the photograph plus the instrument, and it matches the v2.1 rough at 390, 768, and 1440. The pause plate is chalk `void` on black. The three things that were covering the instruments — the vault bar, the skip chip, and a missing well ring — are fixed in this round. The wheel latch stays because the brief requires one discrete step per gesture.

#### What's Working

- The 1440 column matches the rough: inverse `001 / brutalism`, quiet `002 / flesh` and `003 / wasteland`, brand spine on the right, `depth 01` on the sky, serial chip against the column.
- The pause word is chalk, not the rough’s `#9A9A9A`. The struck vault stamp is chalk as well.
- Reduced motion removes `landZoom`, the invert flash, and the reticle. A coarse pointer never shows the reticle. Focus still opens onto the plate with `exit`.

#### Priority Issues

**[P2] Inactive stamps at 1440 are 10.08px.**
Why it matters: half of the 20.16px active label is hard to read, even at 21:1 on void.
Fix: leave the ratio. The brief requires inactive stamps at most half the active one, in full chalk.
Suggested command: /impeccable polish

**[P2] The key legend is visually hidden.**
Why it matters: a first visit has no visible hint that arrows, Enter, and 1/2/3 exist. The stamps and the well are still discoverable.
Fix: keep `#well-help` visually hidden. This is an experience surface, not a tool with a help system.
Suggested command: /impeccable clarify

**[P3] The vault bar is taller than the rough’s single line.**
Why it matters: the required drop line adds a second row, so the land plate is slightly shorter while the vault is on. The column and the depth mark stay clear.
Fix: keep both copy lines. Do not return the bar to an overlay.
Suggested command: /impeccable layout

The review also asked to delete the wheel latch. That change is out of contract: the brief requires discrete steps and a short latch, and forbids free scroll mid-plate.

#### Persona Red Flags

**Jordan (first-timer)**: Plate 2 is a black field whose visible words are `void` and the serial. The series stamp still reads `001 / brutalism`, so the series is not lost. The black plate can still read as a picture that failed to load. That is the pause, and the copy specifies it.

**Sam (keyboard)**: After the fix, Tab shows `skip to plates` clear of the depth mark, and the well shows an inset chalk ring. Enter moves focus to `exit`. `004` stays struck and `aria-disabled`.

**Casey (phone)**: The stamp row is in the thumb zone and targets measure at least 44px. The reticle stays off. The depth mark sits at the top of the plate, under the vault bar when that bar is on, not under it.

#### Minor Observations

- At 390 the active stamp wraps `001 /` over `brutalism`, with the serial chip in the padding under the row. That matches the approved 390 fold.
- Focus uses `object-fit: contain`. At 390 the shells sit in a void band with `exit` in the top band.
- The opening focus frame inverts for 80ms only when motion is allowed.
- The ST mark is the shipped PNG on a chalk chip, because the glyph is `#2F2F2F` and would fail on void.

#### Questions to Consider

- The void plate is plate 2 of 7. Should a later round end the series on that black plate?
- Should `depth` always occupy one reserved corner, including while the skip chip is focused?
- Three wheel ticks equal one plate. The latch is the contract; is the 520ms hold the right length once someone has used it?

Questions skipped: this factory round stops for UI/UX follow-ups rather than opening a new design pass.
