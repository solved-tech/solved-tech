# Build brief — Through the Lens (SAFE v2 The Sitting)

**Status:** Contract + rough UX criticals cleared (Artist safe-v2 + `fix-pass-report.md`). **Copy still DRAFT** (`safe-v2/copy.md`) — do not hand to Factory until Remus approves.  
**Date:** 2026-10-30 (Europe/Vienna)  
**Slug:** `samples/through-the-lens`  
**Chosen direction:** SAFE v2 — The Sitting  
**Contract:** `design/samples/through-the-lens/art-direction.md`  
**Rough:** `design/samples/through-the-lens/safe-v2/`  
**Copy:** `design/samples/through-the-lens/safe-v2/copy.md` (DRAFT)  
**UX pass:** `design/samples/through-the-lens/ux-pass.md`

---

## Pages and sequence

Single long page — four moments:

1. **Meets** — Life-size frontal plate; take strip on plate; note Gaze 01 · Meets · **02/05**.
2. **Past** — Plate biased left; void on gaze side (right); note **05/05**; Asked locked *Look up, past the light.*
3. **Refuses** — Hard crop / bleed withhold; Sitting B; note **01/01**.
4. **Book / blank note + colophon** — Blank sitting fields + **email only**; EXIF/licence honesty; no phone.

No chips, mosaic, iris chrome, hero+CTA, or rate cards.

---

## Tokens (CSS custom properties)

```css
:root {
  --ground: #EFEEE9;
  --ink: #161512;
  --mute: #6E6A62;
  --rule: #757575; /* ≥ 3:1 vs --ground (~3.97:1) */
  --note-w: 17.5rem;
  --bar-h: 2.75rem; /* ≥ 44px touch */
  --font-ui: "Hanken Grotesk", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;
}
```

Self-host subset woff2 only (Hanken 400+600, IBM Plex Mono 400+500); `font-display: optional`; no Google Fonts CDN. ≤ 2 families / ≤ 4 files.

**Type:** take `clamp(3.2rem, 7vw, 5.5rem)` lh **1.0**; note H1 ~1.15rem; note body ~0.88rem lh ≥ 1.45; kicker/credit ~0.68–0.72rem; bar ~0.68rem.

**Motion:** note text replace on spy; reduced-motion = instant; `scroll-behavior: auto` under reduce. No fade-up / hover-lift.

---

## Signature device — life-size plate + huge take

| Mode | Behaviour |
|---|---|
| **Desktop (≥821px, fine pointer)** | Fixed note column right; plates `margin-right: var(--note-w)`; each gaze `100svh`; `scale(1.85)`. Life-size = 18–22cm at 96 CSS px/in, measured at 1440. |
| **Touch / narrow (`max-width: 820px`)** | **Per-stage sticky note** (take + gaze + key fields, ≤~28svh) + **100svh** plate. Do not use a single top note that scrolls away. |
| **Keyboard** | Skip → `#main`; visually hidden `<h1>` + per-stage `<h2>`; `:focus-visible` 2px ink on Enquire, mailto, and `#main` (2px ink frame inset from the bar and the note). |
| **Screen reader** | `<main id="main">`; note `aria-live="polite"` on desktop spy; omit `aria-current="false"`. |
| **Reduced motion** | Instant note text; instant scroll; all gaze content always in DOM. |
| **Perf** | Spy JS ≤ ~3KB; no scroll libraries. |
| **Fallback** | Each stage still shows its own static note if JS fails. |

**Spy (desktop fixed note):** active = last `.spread` whose top ≤ `barHeight + 0.35 * vh`. When `#book` top ≤ that same line, clear the fixed note and show no take.

---

## Per section

### Meets
- Life-size meet; take strip (small 240w derivatives, not masters).
- Mobile: Meets sticky note + plate; strip may sit on plate.
- Must not: soft-shadow frame, smile retouch, iris overlay, second hero competing with take.

### Past
- Void on gaze side (right-of-plate); Asked locked until Remus changes it.
- Must not: black void panel; zig-zag note column.

### Refuses
- Withhold by hard crop; Sitting B, same light.
- Must not: dark theme; beauty smile; other photographers.

### Book / blank note
- `Sitter: ___` / `Asked: ___` + mailto ≥ 44×44; colophon licence + EXIF honesty.
- Must not: phone, form suite, newsletter, fake reviews, invented stats.

---

## Interaction notes

- Skip link first (≥ 44px, ≥ 4.5:1, visible on `:focus-visible`).
- Sticky CTA: none beyond fixed bar Enquire → `#book`.
- Targets ≥ 44px (Enquire, mailto).
- `html { scroll-padding-top: var(--bar-h); }` on touch.
- No smooth-scroll dependence when reduced-motion.

---

## Imagery / perf floors

- Licences: `safe-v2/LICENCES.md`, `assets/final/LICENCES.json`. Production from `assets/opt/`.
- LCP = Meets plate `<picture>` AVIF→WebP→JPEG; `srcset` ~800/1200/1600; `sizes="(max-width:820px) 100vw, calc(100vw - 17.5rem)"`; **largest ≤ 200KB**; `fetchpriority="high"` `decoding="async"`.
- Floors: LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms; self-hosted woff2.

---

## Acceptance

1. Shots at 390 / 768 / 1440 match safe-v2 after Artist fixes (incl. reduced-motion).
2. Mobile Past/Refuses show take + gaze in-viewport.
3. LCP asset ≤ 200KB with picture/srcset.
4. Code scan clean of Google Fonts CDN and ban-list patterns.
5. WCAG 2.2 AA; skip; focus-visible; 44px; real `h1`/`main`.
6. Content only from approved `copy.md` + assets.
7. ≥ 3 visual-review-loop rounds with UI/UX before QA.

---

## Out of scope

- Publish / DNS / go-live; merging PR #24; any merge without Remus.
- Phone numbers; inventing EXIF as fact; replacing sitting/gaze with chips/cards/hero+CTA.

---

## Done when

- Remus has approved copy.
- Prompt has no unfilled angle brackets; Artist contract already matches this brief.
