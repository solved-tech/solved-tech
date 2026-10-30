# Build brief — Mara Ellison v3 D2 Contact Sheet

> **Status (30 Oct 2026, Remus via Eleos):** hero keep frame is **07B1** (not 07B2). Remus confirmed this page **replaces `samples/mara-ellison/`**. Copy **approved by Remus (30 Oct 2026)**: `copy.md` is final, with placeholder email hello@maraellison.example kept. `art-direction.md` landed 30 Oct; build is go; must pass QA before Wed 4 Nov; merge is Remus's only.

**Status:** **READY FOR FACTORY AFTER GATES BELOW** — Remus approved publishing this design (via Eleos) before **Wed 4 Nov 2026** (Europe/London).  
**Gates before cloud agent starts:**
1. Artist publishes `art-direction.md` matching this brief (currently **missing** — tokens below extracted from `direction-2.html` + `rationale.md`).
2. Remus confirms copy: lock `draft-copy.md` → `copy.md`, with keeps **07A2 · 07B1 · 07C3** (Remus confirmed 07B1, 30 Oct 2026).
3. Do **not** publish/DNS/go-live from the agent; Remus ships.

**Date:** 2026-10-30 (Europe/London)  
**Slug:** `photography` / site path `samples/mara-ellison/`  
**Chosen direction:** D2 — Contact Sheet (Angle 2)  
**Rough:** `design/photography/v3/direction-2.html` + `direction-2.png` / `direction-2-mobile.png`  
**UX pass:** `design/photography/v3/ux-pass.md`  
**Audit shots:** `design/photography/v3/ux-audit/shots/`  
**Prior live sample:** PR #27 merged (darkroom Mara). This build **replaces** `samples/mara-ellison/` with Contact Sheet on a **new branch from `main`**.

---

## Pages and sequence (storyboard)

Single long page — five moments:

1. **Mast / sheet head** — `Mara Ellison — contact · roll 07`; meta `Weddings · portraits · EXAMPLE`; nav `Hold these frames` → enquire.
2. **Strip A (backlight bouquet burst)** — Kodak edge print + sprockets; five near-dupe frames; keep **07A2** (heavy grease circle + star); reject **07A3** (X); last frame cut by sheet edge; hand note `print 8×10` in the paper gap.
3. **Strip B (hands)** — keep **07B1** (med circle + crop L); loupe authored over the keep; reject **07B4**.
4. **Strip C (kiss)** — keep **07C3** (light circle); reject **07C2**; strip runs farther off the sheet; last frames clipped.
5. **Hold + colophon** — “Hold these frames.” / write with date + who; mailto only; “Not a shortlist” aside; ST mark + Unsplash + derived-burst honesty.

No separate services page, no map, no rate card, no shortlist dock.

---

## Tokens (CSS custom properties)

Builder **must** create exactly these (from the rough; `art-direction.md` may only tighten, not invent a second palette):

```css
:root {
  --paper: #C2BEB0;
  --paper-hi: #CBC7B9;
  --paper-lo: #B8B3A4;
  --ink: #14120E;
  --mute: #463F38;      /* solid 5.56:1 on --paper (per art-direction §3); NEVER opacity-faked mute on ≤14px type */
  --rule: #555555;      /* 4.01:1 on --paper (per art-direction; #757575 measured too light); replaces rgba(20,18,14,.15–.22) hairlines */
  --grease: #C45C2A;    /* mark colour on photos (multiply); not body text */
  --grease-y: #D4A017;  /* star / crop accent on photos */
  --film: #0A0908;
  --edge: #9A9588;      /* edge print on film; verify ≥ 3:1 on --film */
  --focus: #8A1A22;     /* focus ring + mailto */
  --sheet-max: 1440px;
  --pad: clamp(1rem, 2.5vw, 2.5rem);
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;
  --font-ask: "DM Sans", system-ui, sans-serif; /* secondary only; see type note */
  --loupe-size: 168px;  /* desktop; mobile ~120px */
  --target: 44px;
}
```

Sheet ground: paper field with subtle static grain (`radial-gradient` 1px noise or SVG feTurbulence overlay, `pointer-events: none`, not animated). Outer body chrome `#1e1c18` as in rough. No teal/orange SaaS chrome. No cream `#F4F1EA` + terracotta kit. No framework default theme.

**Type scale (closed):**

| Role | Spec |
|---|---|
| Mast `h1` | ~12px / tracking ~0.18em / uppercase / weight 500 / **line-height ≥ 1.0** / `text-wrap: balance` |
| Meta / edge / footer | 8–10px mono; meta uses `--mute` solid (not opacity) |
| Enquire label `h2` | ~11px uppercase tracked |
| Ask display | `clamp(1.25rem, 2.4vw, 1.375rem)` DM Sans; **line-height ≥ 1.0** (rough 1.4 OK for multi-line ask); `text-wrap: pretty` |
| Frame shorthand / fn | 7–10px on film; decorative; meaning also in `aria-label` |
| Mailto | ~13px; colour `--focus`; underline `--grease` or `--focus` |

Ship **only** `ibm-plex-mono-latin-500-normal.woff2` + `dm-sans-latin-400-normal.woff2` (or Artist-approved OFL swap for ask). `font-display: optional`. Preload mono. Do not ship Fraunces / Outfit / Cormorant leftovers.

**Motion tokens:**

- Loupe appear/move: ≤ 180ms ease-out on fine pointer; **0ms** under `prefers-reduced-motion: reduce`.
- Strip scroll: native; no Lenis / scroll-jack.
- `html { scroll-behavior: auto }` when reduced-motion; otherwise smooth optional for in-page `#hold` only.

---

## Signature device — marked contact sheet (grease + loupe + pull-strip)

| Mode | Behaviour |
|---|---|
| **Desktop (≥901px, fine pointer)** | Three physical film strips on the paper sheet, misregistered (rotate/translate per rough). Grease marks on keep/reject frames. **Loupe** appears on hover **or** keyboard focus of a `.keep` frame (default show on 07B1 when none focused; loupe asset `assets/strips/stripB-loupe-07B1.webp`, 32KB). Strip C may overrun the sheet edge. |
| **Tablet (768–900)** | **Composed separately — not a squeezed desktop.** Prefer: each strip is a horizontal scroll row (snap) with frame min-width ≥ 160px, still showing grease + edge print; OR raise the touch layout breakpoint to `max-width: 900px` and use the mobile pull pattern for all three rolls. Do not present five unreadably tiny frames. |
| **Touch / narrow (≤720px as rough, prefer ≤900)** | **Pull film through a loupe:** horizontal `scroll-snap` strip(s). **CRITICAL:** all three rolls (A/B/C) remain reachable — three stacked pull-strips **or** one continuous film with roll edge-print dividers, keeps marked. First viewport: mast + primary pull-strip (≥ ~300px frame) + start of Hold if it fits; do not insert a marketing hero above the strip. |
| **Keyboard** | Skip link first → `#main` / `#hold` → strip keep frames as focusable controls (`button` or `a` with `aria-label`) → mailto → ST. Designed `:focus-visible`: 2px solid `var(--focus)`, offset 3px. Tabbing a keep moves/shows the loupe. |
| **Screen reader** | `<main id="main">`; each strip `<section aria-label="Strip A — …">`; each frame `aria-label` includes frame id + soft/keep/reject; loupe `aria-hidden` if purely visual magnification of already-labelled keep; aside states keeps in text. |
| **Reduced motion** | No loupe chase animation; loupe may sit static on the active keep; native scroll; all frames always in DOM (no hide-for-animation). |
| **Performance budget** | Device JS ≤ ~8KB gzipped; no scroll libraries; no WebGL. Inactive strip set **must not download** (see Imagery). Motion JS total ≪ 60KB. |
| **Fallback** | If JS fails: all three strips visible (desktop stack or three static pull rows); grease images still on keeps; mailto works; loupe optional/absent. |

**Scroll-spy (required where strips scroll vertically on desktop):** active strip = last `section.roll` whose top ≤ `0.35 * vh` (offset for any sticky chrome = 0 in this concept). Set `aria-current="true"` on the active strip for AT. On horizontal mobile strips, spy = snapped frame under the loupe centre; update a polite live region only if the visible frame id changes and is not already on-screen as text.

---

## Per section

### Mast

- **Purpose:** Name the object; EXAMPLE honesty; jump to Hold.
- **Content:** from approved `copy.md` slots Mast, Meta, Nav.
- **Desktop:** flex space-between; bottom rule `--rule`.
- **Mobile:** stack; meta left-aligned.
- **Must not:** Big display serif wordmark, hero tagline, phone, location.

### Strips A / B / C

- **Purpose:** The story is the choosing across one burst each.
- **Content:** `assets/strips/strip{A,B,C}-*.webp` + marks; shorthand from copy table; edge print strings locked.
- **Keeps / rejects (locked):** A2 keep, A3 reject; B1 keep, B4 reject; C3 keep, C2 reject.
- **Desktop:** misregistration transforms per rough; last frame negative margin cut; sprocket bars.
- **Mobile:** pull-strip composition (see device); do not stack as Instagram cards.
- **States:** broken image → film well + frame label still readable; loading → film black well with reserved aspect-ratio (no CLS).
- **Must not:** Equal masonry, hearts, filter chips, soft-shadow polaroids, lyric captions, package tiers.

### Hold + footer

- **Purpose:** Enquire without CRM theatre; credit + licence honesty.
- **Content:** Ask / sub / mail / aside / ST line from copy; footer discloses Unsplash + derived (not real) bursts.
- **Targets:** mailto and ST link ≥ 44×44.
- **Must not:** Phone, form suite, newsletter, fake reviews, invented stats, booking pills.

---

## Interaction notes

- Skip link first in DOM; becomes visible on focus.
- Sticky CTA: **none** — Hold is in-flow (concept). Do not add a floating chip.
- Targets ≥ 44px for every actionable control.
- Focus order and visible focus as above.
- No smooth-scroll dependence when reduced-motion.
- `@media (hover: hover) and (pointer: fine)` for loupe-hover only.

---

## Imagery / licences / perf floors

**Ship to production:**

- `assets/strips/` (frame + loupe webps, sprocket bar)
- `assets/marks/` (grease PNGs + print-note)
- `assets/st-logo-mark.png` (exact ST mark — never recreate)
- Two woff2 files above

**Do not ship:** `assets/raw/`, `assets/previews/`, `assets/set/` plate variants, `assets/overlays/`, unused fonts, `_killed/`.

**Licences:** Unsplash Licence per `assets/set/CREDITS.md` + `assets/strips/SEQUENCE-NOTE.md`. Colophon must keep derived-burst honesty. Grease = procedural wax (no third-party crayon scan).

**LCP:**

- Element = first visible strip frame(s) in the first viewport (desktop: strip A frames in view; mobile: first `.m-frame`).
- `<picture>`: AVIF → WebP → JPEG fallback; `srcset` + `sizes`; **each candidate ≤ 200KB**; `width`/`height`; `fetchpriority="high"` + `decoding="async"` on LCP frame(s); below-fold / off-strip `loading="lazy"`.
- Floors: LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms; ≤ 2 font families.
- Generate AVIF derivatives in the build if missing; do not leave WebP-only without attempting AVIF.

---

## Acceptance

1. Screenshots at **390 / 768 / 1440** (fold + full) plus reduced-motion desktop & mobile match the Contact Sheet rough’s objecthood (misregistered strips, grease, loupe, pull-strip on touch) — not the old darkroom Mara.
2. Mobile (or ≤900 touch layout) exposes **all three** rolls’ keeps without relying on aside-only text (`ux-pass` CRITICAL #1).
3. Inactive strip images do not download (`ux-pass` CRITICAL #2) — prove in network panel on a 390 load.
4. WCAG 2.2 AA: text ≥ 4.5:1; non-text UI / hairlines ≥ 3:1 with `--rule: #555555` (art-direction token); skip link; `:focus-visible`; targets ≥ 44px; `<main>` + `h1`.
5. LCP picture pipeline ≤ 200KB / ≤ 2.5s; self-hosted woff2 `font-display: optional`; display/ask line-height ≥ 1.0.
6. Code scan clean of Google Fonts CDN, banned template patterns, framework default theme, unused font files.
7. Content only from approved `copy.md` + assets; no invented reviews/stats; no phone; no client personal photos beyond the licensed Unsplash set; leave visible TODO rather than fabricate.
8. ≥ **3** visual-review-loop rounds with Factory before QA; QA independent ≥ 36/50, no critical tell.
9. PR opened with screenshots + round log; **never merge PR #24**; client/sample merge only with Remus’s yes.

---

## Out of scope

- Publishing / DNS / GitHub Pages go-live (Remus).
- Merging PR #24 or any merge without Remus.
- Phone numbers; public use of unapproved personal data.
- Replacing Contact Sheet with chips, cards, hero+CTA, or resurrecting Through the Pane / darkroom Mara.
- Commissioning real motor-drive bursts (open Remus question — do not fake EXIF as fact; keep derived honesty).
- Solved Tech main-site homepage / IT pricing (different project).
- Buffer / Instagram / WhatsApp.

---

## Remus decisions still needed

1. Confirm `draft-copy.md` → `copy.md` (keeps **07B1** confirmed by Remus).
2. Confirm replace live `samples/mara-ellison/` darkroom with Contact Sheet (Eleos publish approval implies yes — state on PR).
3. Optional later: real burst commission vs keep derived variants.

---

## Done when (handoff)

- Artist confirms this brief ↔ `art-direction.md`.
- Copy approved / renamed.
- CRITICAL ux-pass items closed in contract.
- `cloud-agent-prompt.md` has **no unfilled angle brackets**.
- Factory launched by UI/UX or Eleos process — **this file alone does not launch**.
