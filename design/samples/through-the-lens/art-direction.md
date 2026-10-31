# Art direction — Through the Lens (build contract)

**Status:** Remus approved **SAFE v2 — The Sitting** (Design Researcher **38/50** after life-size / gaze-layout revise; prior 35).  
**Rough:** `/workspace/design/samples/through-the-lens/safe-v2/`  
**Date:** 2026-10-30 (Europe/London)  
**Copy:** All on-page copy is **DRAFT** until Remus approves.  
**UX floor:** Bake in the same accessibility and performance contract changes applied to The World (LCP recipe, self-hosted fonts, 44px targets, skip link, hairlines ≥ 3:1) before Factory.

---

## Concept

**One-line:** *This site feels like a portrait sitting because the plate is life-size and the take number owns the margin.*

**Paragraph:** Through the Lens is a working portrait photographer’s sample. It refuses lens/iris/viewfinder chrome, filter chips, and mosaic grids. The page is a **record of looking**: one coherent studio sitting (grey seamless, soft key), sequenced by **gaze** — meets, past, refuses — with sitting notes that stay honest about light and EXIF. Optics appear only as **layout behaviour** (scale, crop, offset), never as hardware UI.

**Signature device — life-size plate + huge take number**

- Each gaze state is a **100svh plate**. Meets crop uses `scale(1.85)` / `object-position: 50% 22%`. Life-size = 18–22cm at 96 CSS px/in, measured at 1440.
- The **only** display moment in the margin is the take index set huge (e.g. `02/05`). No second hero headline competing with it.
- **Desktop:** plate fills the width left of a fixed note column. **Touch (≤820px):** each stage owns a **compact sticky note** (take + gaze + key fields, ≤~28svh) above its own **100svh** plate — the take numeral never leaves the viewport for that stage.
- **Keyboard:** skip link → `#meets`; document `<h1>` (visually hidden) + per-stage `<h2>` on touch notes; `:focus-visible` 2px ink on Enquire, mailto, and `#meets` (inset frame on the Meets plate only; it scrolls away with that plate). **Reduced motion:** note text swaps instantly; no scroll-jacking; content always visible.

---

## Gaze layout rules (no zig-zag)

The **note column is always fixed on the right** (desktop). Spreads do not alternate left/right.

| State | Layout behaviour |
|---|---|
| **Meets** | Plate centred and frontal; face fills the life-size crop; take strip may sit on the plate (same sitting). |
| **Past** | Plate biased **left**; **void on the right** (gaze side). Sitting A looks up and toward frame-right — void opens that way. Do **not** flip the photo. Asked line must match the picture (*Look up, past the light.*). |
| **Refuses** | Plate cropped hard off the page edge and partly withheld (bleed off-canvas). No black “void panel” cosplay — the withhold is the crop. |

Scroll updates the fixed desktop note by **section top** (not intersection ratio): active = last `.spread` whose `getBoundingClientRect().top <= stickyOffset + 0.35 * vh` (stickyOffset = bar height ≈ 44px). When the top of `#book` is at or above that same line, the fixed note is cleared and no take shows. Touch uses per-stage notes (no spy dependency for the take). Active section owns `aria-current` logic only if any in-page nav is added later; omit `aria-current="false"`.

---

## Fixed note column

- Width ~`17.5rem` desktop; full-width stack on small screens.
- Contents (reading-size **IBM Plex Mono**): kicker · gaze label · **huge take** · Sitter / Gaze / Kept / Light / Lens / Asked · credit line.
- Lens line: print true EXIF when present; otherwise **`85mm · f/2 (example — EXIF absent)`** (or whatever example Remus locks) — never invent as fact.
- Enquire block below the stages: the mailto and the hint “Email only. Tell us who sits and what you asked them.” No book labels. No phone. No CRM form theatre.

---

## Translation table

| Reference | Mechanic taken | Cosplay refused |
|---|---|---|
| DR SAFE — The Sitting | Sitting notes, white/neutral ground, scale of the face | Avedon costume; cream SaaS shell |
| DR gaze sequence | Meets / past / refuses as IA | Filter chips; equal mosaic |
| Life-size plate | 100svh crop; life-size = 18–22cm at 96 CSS px/in, measured at 1440 | Floating soft-shadow cards |
| Take index as display | One huge margin numeral | Hero line + subhead + CTA |
| Optics as behaviour | Offset, crop, withhold | Iris, viewfinder HUD, bokeh wallpaper |

---

## Levers

| Lever | Spec |
|---|---|
| Grid | Fixed note column + full-bleed plate; no zig-zag |
| Type | **Hanken Grotesk** (UI / brand bar) + **IBM Plex Mono** (notes, take, blank form). One display moment = take number. |
| Colour | Paper ground `#EFEEE9` · ink `#161512` · mute `#6E6A62`. No terracotta CTA; no charcoal+acid shell. |
| Imagery | One coherent Pexels studio set (Gustavo Fring / EXIF Artist taras_chaban); grey seamless; no beauty smiles |
| Texture | None beyond paper ground and hairlines |
| Motion | Note copy swap on scroll; reduced-motion = instant |
| Structure | Gaze stages → blank note / email last |

---

## Type

| Role | Face | Licence | Notes |
|---|---|---|---|
| Brand bar / quiet UI | Hanken Grotesk | OFL (self-host woff2) | 400–600; small caps tracking on bar |
| Notes / take / blank form | IBM Plex Mono | OFL (self-host woff2) | Tabular nums; take `clamp(3.2rem, 7vw, 5.5rem)` with **line-height: 1.0** (Impeccable floor; was 0.9); note body ~0.88rem; body lh ≥ 1.45 |

**Closed scale:** take display · note H1 ~1.15rem · note body ~0.88rem · kicker/credit ~0.68–0.72rem · bar ~0.68rem.

**Fonts (UX floor):** self-host subset **woff2** only; `font-display: optional`; ≤ 2 families / ≤ 4 files (Hanken 400+600, IBM Plex Mono 400+500). No render-blocking Google Fonts CSS.

---

## Colour

| Token | Hex | Role |
|---|---|---|
| `--ground` | `#EFEEE9` | Page / note paper |
| `--ink` | `#161512` | Text, take, rules (structural) |
| `--mute` | `#6E6A62` | Kickers, credits, example labels |
| `--rule` | `#757575` (locked) | Hairlines **≥ 3:1** vs `--ground` (measured ≈ 3.97:1) |

Verify WCAG AA for ink/mute on ground (≥ 4.5:1 body; ≥ 3:1 large). No gradients, no accent-as-only-CTA colour.

---

## Imagery

**Source:** Gustavo Fring on Pexels · EXIF Artist `taras_chaban` · Pexels License · grey seamless soft-key studio sequence (`safe-v2/LICENCES.md`, `assets/final/LICENCES.json`).

**Rules**

1. One coherent light and distance; do not mix other photographers into the sitting.
2. No beauty retouching; no toothy smiles.
3. Credit photographer + licence in the note / colophon.
4. **Honest EXIF:** if focal length / aperture / body absent, label the line as example data.
5. Sitting A = multi-take strip + meets/past; Sitting B = refuses (same shoot light).

**Production recipe (UX floor)**

- Life-size plate = LCP candidate: `<picture>` with **AVIF + WebP + JPEG**, `srcset` widths ~800 / 1200 / 1600, `sizes` matching the plate column.
- Largest candidate **≤ 200KB**; target ~120–160KB AVIF for the 1200w slot.
- Fold/first plate: `fetchpriority="high"` `decoding="async"`; below-fold `loading="lazy"`.
- Preload only the matching fold AVIF/WebP. LCP ≤ 2.5s; CLS ≤ 0.1; INP ≤ 200ms on mid mobile.

---

## Caption / copy (DRAFT)

All strings **DRAFT** until Remus signs off, including:

- Gaze labels (`Gaze 01 · Meets`, etc.)
- Asked lines (Past must stay: **Look up, past the light.**)
- Blank note placeholders and `hello@through-the-lens.example`
- Credits / colophon

Ban lyric AI captions and marketing filler.

---

## Layout / mobile / motion / budgets

**Desktop**

- Top bar fixed (brand + Enquire).
- Note column fixed right; plates `margin-right: var(--note-w)`.
- Each gaze section `100svh`.

**Mobile / touch (compose separately)**

- **Breakpoint locked: `max-width: 820px`** (not `(pointer: coarse)`).
- Storyboard: each gaze section = **compact sticky note** (kicker + gaze `h2` + take + Sitter/Gaze/Kept/Asked; credit deferred to colophon) + **100svh plate**. Sticky `top: var(--bar-h)`. Note must stay in-viewport for Past and Refuses.
- Take strip sits on the Meets plate (240w thumbs). Enquire / mailto **≥ 44×44**.
- Do not use a single in-flow note at page top that scrolls away.

**A11y**

- Skip link first in DOM → `#meets` (≥ 44px, ≥ 4.5:1, visible on `:focus-visible`). The inset frame is on `#meets:focus-visible` and scrolls away with that plate.
- `<main id="main">` wrapping plates + book.
- `:focus-visible` on Enquire and mailto (2px ink outline).
- Hairlines `--rule` ≥ 3:1 vs ground.
- Reduced motion: `scroll-behavior: auto`; no dependence on smooth scroll for note sync.

**Motion**

- Note fields update on scroll-spy; reduced-motion = instant text replace.
- No fade-up on every section; no hover-lift cards.

---

## Ban list

- Aperture / iris graphics, bokeh wallpaper, viewfinder overlays, shutter CTAs, lens-flare motifs, camera-body heroes  
- Hero line + subhead + CTA formula; filter chips; equal masonry; shortlist hearts  
- Soft-shadow floating frames; cream + terracotta “quiet luxury” kit; charcoal + acid green  
- Three SaaS rate tiers; lyric mono poetry; logo-as-hero vanity  
- Travel/documentary vernacular (maps, passports — reserved for The World)  
- Phone numbers; invented EXIF stated as fact; fake reviews  

---

## Open questions

1. Remus: approve **DRAFT** copy and placeholder email domain.  
2. Wordmark-only **Through the Lens** vs a personal photographer name?  
3. Lock the example lens string (`85mm · f/2`) or drop lens lines until real EXIF exists?  
4. Commission / supply a true multi-sitter set (3–4 people, same light) for production, or keep Sitting A + B as the sample honesty?  
5. UX pass findings folded into rough + this contract (2026-10-30); re-verify shots at 1440 / 768 / 390 before Factory.

## Ledger

See `ledger-row.md` (not committed).
