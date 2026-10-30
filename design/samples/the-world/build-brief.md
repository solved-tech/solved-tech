# Build brief — The World (WILD One Place)

**Status:** Contract + rough UX criticals cleared (Artist wild-v2 + `shots/verify-report.json`). **Copy still DRAFT** (`wild-v2/copy.md`) — do not hand to Factory until Remus approves.  
**Date:** 2026-10-30 (Europe/Vienna)  
**Slug:** `samples/the-world`  
**Chosen direction:** WILD — One Place  
**Contract:** `design/samples/the-world/art-direction.md`  
**Rough:** `design/samples/the-world/wild-v2/`  
**Copy:** `design/samples/the-world/wild-v2/copy.md` (DRAFT)  
**UX pass:** `design/samples/the-world/ux-pass.md`

---

## Pages and sequence

Single long page — seven moments:

1. **Fold / 11:00** — Huge hour owns the display; first people plate owns the remaining fold; brand secondary.
2. **11:00 continued** — Sparse duo; AP-short captions; place names in captions only.
3. **12:00 noon** — Dense three-up + bleed; tighter people crops.
4. **13:00** — Taper: indoor / duo.
5. **14:00** — Single bleed.
6. **15:00** — Single clock plate.
7. **Field notes + colophon** — Ruled notes; **Write: email** last; daytime-only honesty.

No map, service cards, or hero+CTA.

---

## Tokens (CSS custom properties)

Create exactly these (values from `art-direction.md` hour table):

```css
:root {
  --bg: #E4E6E8;
  --ink: #161616;
  --mute: #5C5C5C;
  --accent: #2F4A5C;
  --rule: #6E7072; /* ≥ 3:1 vs --bg; per-hour overrides in art-direction */
  --w-display: 800;
  --rail-sticky-size: 0px;
  --draft: /* pinned sample/status colour — not hour-wandering */;
  --pad: clamp(0.75rem, 2vw, 1.5rem);
  --font-ui: "Bricolage Grotesque", system-ui, sans-serif;
}
```

Hour scopes override `--bg` `--ink` `--mute` `--accent` `--rule` `--w-display` per art-direction table. **One family only:** Bricolage Grotesque 700/800, self-hosted woff2, `font-display: optional`. No Literata. No Google Fonts CDN.

**Type:** fold hour desktop `clamp(4.5rem, 14vw, 10rem)` lh **1.0**; mobile fold hour `clamp(4.5rem, 22vw, 5.5rem)` lh 1.0, block ≥ ~28vh; section H2 `clamp(1.35rem, 3vw, 2rem)`; captions ~0.72rem; rail ~0.7rem.

**Motion:** hour token swap ≤180ms ease when motion allowed; **0ms** under `prefers-reduced-motion`.

---

## Signature device — time rail

| Mode | Behaviour |
|---|---|
| **Desktop (>900px, fine pointer)** | Sticky vertical rail, side column. |
| **Touch / narrow (≤900px or coarse pointer)** | Sticky **horizontal** rail; links **min 44×44**; `--rail-sticky-size` = measured rail height. |
| **Keyboard** | Skip → `#main`; real hash anchors; designed `:focus-visible` (2px ink); tab: skip → rail → mailto. |
| **Screen reader** | `nav aria-label="Hour of day"`; `aria-current="true"` only on active; fold hour is real `<h1>` (not aria-hidden). |
| **Reduced motion** | Instant token change; instant scroll; all content always in DOM. |
| **Perf** | Rail JS ≤ ~4KB; no scroll libraries; one spy. |
| **Fallback** | Anchors still scroll; section-local hour tokens; body may stay on 11:00 paper. |

**Spy (required):** active = last `.fold[data-hour], .hour[data-hour]` whose top ≤ `stickyOffset + 0.35 * vh`. Rail click: `preventDefault` → set tokens + `aria-current` → scroll with **railLock** until scrollend/500ms. `html { scroll-padding-top: var(--rail-sticky-size); }`.

---

## Per section

### Fold (11:00)
- Purpose: hard-light thesis; people-first.
- Content: verbatim from approved `copy.md` when Remus signs; until then leave visible TODO rather than invent.
- Desktop: hour column + people plate ~`100svh`.
- Mobile (composed separately): sticky rail → huge hour (≥ ~28vh, brand once) → people plate; **no duplicate title bar**.
- Must not: map, globe, CTA row, soft polaroid, building-only hero.

### Hours 11–15
- Rhythm: sparse → noon density → taper → single plate per rough.
- Lazy images except fold; broken-image: ink rule + caption readable.
- Must not: Instagram grid, equal cards, lyric AI captions, phone, invented reviews/stats.

### Field notes + colophon
- Notes + `Write: <mailto>` (≥ 44px) + licence / daytime-only honesty.
- Must not: form suite, newsletter, social row, phone.

---

## Interaction notes

- Skip link first in DOM (≥ 44px, ≥ 4.5:1, visible on `:focus-visible`).
- No sticky Book/Chat chip — email is last field-note line.
- Targets ≥ 44px (rail, mailto).
- No smooth-scroll dependence when reduced-motion.

---

## Imagery / perf floors

- Source + licences: `wild-v2/licences.md`, `credits.json`. Production from `images/opt/` only.
- LCP = fold people `<picture>` AVIF→WebP→JPEG; `srcset` 800/1200/1600; `sizes="(max-width:900px) 100vw, min(1010px, 74vw)"`; **largest ≤ 200KB**; `fetchpriority="high"`; below-fold `loading="lazy"`.
- Floors: LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms; ≤ 1 font family here; self-hosted woff2.

---

## Acceptance

1. Shots at 390 / 768 / 1440 match wild-v2 composition (incl. reduced-motion).
2. Rail sync: every rail hour at 390 and 1440 → matching `data-hour`, sole `aria-current`, stamp/fold in first 40% of viewport.
3. Code scan clean of framework default theme and ban-list patterns.
4. WCAG 2.2 AA (text 4.5:1, non-text UI 3:1); skip; focus-visible; 44px.
5. Content only from approved `copy.md` + assets; visible TODO otherwise.
6. ≥ 3 visual-review-loop rounds with UI/UX before QA.

---

## Out of scope

- Publish / DNS / go-live; merging PR #24; any merge without Remus.
- Phone numbers; inventing dawn/dusk hours; replacing the time rail with chips/cards/hero+CTA.

---

## Done when

- Remus has approved copy.
- Prompt has no unfilled angle brackets; Artist contract already matches this brief.
