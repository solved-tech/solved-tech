# UX pass — Mara Ellison v3 D2 Contact Sheet

**Date:** 2026-10-30 (Europe/London)  
**Rough:** `direction-2.html`  
**Shots:** `ux-audit/shots/` (390 / 768 / 1440 fold + full, desktop & mobile reduced-motion)  
**Probe:** `ux-audit/shots/report.json`  
**Status:** Design approved by Remus (via Eleos) for publish before Wed 4 Nov 2026. Contract gaps below must land in `art-direction.md` + the build.

---

## Verdict

Concept reads as a marked contact sheet, not a gallery template. Skip link, `h1`, and 44px link targets are present. **Do not hand to Factory until `art-direction.md` exists and CRITICAL items are closed or accepted.**

---

## CRITICAL

### 1. Mobile loses the three-strip choosing story
Desktop shows rolls 07A / 07B / 07C with keeps 07A2 · 07B1 · 07C3 (07B1 confirmed by Remus 30 Oct; was 07B2 in the first rough). Mobile (`max-width: 720px`) shows **only strip B**. Keeps A and C exist only as aside text. The signature device on touch must still make choosing across three bursts visible (three pull-strips, or one continuous film with roll dividers + keeps).

### 2. Hidden desktop strip assets still decode on mobile
Probe: 33 `<img>` nodes; **25 ancestor-hidden still `complete`**. Dual DOM (`.desktop-rolls` + `.mobile-only`) costs ~1 MB strip payload on a phone. Production must not download the inactive strip set (conditional mount, `<template>`, or media-gated sources — not `display:none` alone).

### 3. Non-text / muted text contrast fails AA
Measured against `--paper` `#C2BEB0`:

| Pair | Approx ratio | Floor |
|---|---:|---|
| Hairlines `rgba(20,18,14,.15–.22)` blended | ~1.3–1.6:1 | FAIL non-text 3:1 |
| `.meta` / aside at opacity `.55` blended | ~3.4:1 | FAIL body text 4.5:1 (10–12px) |
| Nav underline `.4` blend | ~2.3:1 | FAIL |

**Fix floor:** UI rules ≥ `#757575` (or solid token `--rule` ≥ 3:1 on paper). Mute text: solid `--mute` ≥ 4.5:1 (do not fake mute with opacity on small type). Ink `#14120E` and mail `#8A1A22` on paper **pass**.

### 4. No `art-direction.md`
Handbook requires Artist contract before build. Tokens/device below are extracted from the rough for the build brief; Artist must publish matching `art-direction.md`.

---

## HIGH

### 5. No `<main>` landmark
Skip → `#hold` works; wrap sheet content in `<main id="main">` and point skip at `#main` or keep `#hold` after main opens.

### 6. Loupe is static cosplay
Always-on `aria-hidden` circle. Build needs authored behaviour: fine pointer = hover/focus on keep frames; touch = loupe tracks snapped frame (or fixed over keep when centred). Reduced motion: loupe may stay static over the keep; content never hidden behind motion.

### 7. Tablet (768) uses five-up desktop strips
Breakpoint is 720. At 768 frames are ~125px wide — readable as object, cramped for grease. Compose **768 separately** (see build brief): either raise touch layout to ≤900, or keep three strips with larger frame min-width + horizontal overflow per strip.

### 8. LCP / picture pipeline incomplete
Largest strip WebP `stripC-2.webp` ≈ 145 KB (under 200 KB). No AVIF, no `srcset`/`sizes`, no `fetchpriority` on first visible frames. Mobile LCP candidate = first `.m-frame` image. Above-fold frames eager + `fetchpriority="high"`; remainder lazy. Self-hosted fonts already `font-display: optional` — keep.

### 9. `scroll-behavior: smooth` without reduced-motion override
Under `prefers-reduced-motion: reduce` force `scroll-behavior: auto`.

### 10. Copy / keep mismatch
**Resolved 30 Oct:** Remus confirmed keep **07B1** (matches `draft-copy.md`). Rough, brief and prompt updated to `07A2 · 07B1 · 07C3`.

---

## MEDIUM / advisory

- Unused font files in `assets/fonts/` (Fraunces, Outfit, Cormorant, extra DM weights) must not ship.
- DM Sans is on distinctive-web-craft “not as identity” list; rough uses it only for Enquire ask — acceptable as secondary if `art-direction.md` justifies; else swap OFL grotesk.
- Edge print at 8px is craft texture, not UI text — OK; do not rely on it for meaning without frame `aria-label`.
- Grease `#C45C2A` is mark colour (multiply on photo), not body text.
- Mobile fold packs head + strip (~400px) + enquire in 844 — intentional; do not add a second hero CTA above the strip.
- No phone; EXAMPLE honesty; ST mark present; location-neutral — pass.
- No invented reviews/stats — pass.

---

## Passes already in rough

- Skip link present; `:focus-visible` 2px `--focus` `#8A1A22`.
- Hold / mailto / ST / nav min-height 44px.
- Single `h1`; English; `noindex`.
- Concept bans avoided (no chips, hearts, rate cards, hero+CTA, soft-shadow floating panes).

---

## Acceptance deltas for Factory

Close CRITICAL 1–3 and HIGH 5–10 in the built page; prove with `ux-audit`-style captures at 390 / 768 / 1440.
