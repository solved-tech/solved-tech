# Art direction — The World (build contract)

**Status:** Remus picked **WILD — One Place**. UX pass 2026-10-30 + QA 34/50 (need ≥37) incorporated into this contract and `wild-v2` rough.  
**Rough:** `/workspace/design/samples/the-world/wild-v2/`  
**Date:** 2026-10-30 (Europe/London)  
**Copy:** All on-page copy is **DRAFT** until Remus approves.  
**Gate:** UI/UX `ux-pass.md` criticals must be cleared before Factory; QA ≥37.

---

## Concept

**One-line:** *This site feels like four hours of hard light in one place because the hour owns the fold and the people own the frames.*

**Paragraph:** The World refuses map/passport/coverage vanity. The day log covers the light that exists in the source set: roughly **11:00–15:11**, Centro Histórico, Ciudad de México. Title: **“From 11:00, hard light.”** Place names in **captions only**. Daytime-only honesty in the **colophon**.

---

## Signature device — the time rail (behaviour contract)

- Persistent hour rail drives IA and flat page tokens (`--bg`, `--ink`, `--mute`, `--accent`, `--rule`, `--w-display`).
- **Fold:** active hour set huge as display; first **people** frame owns the rest. Brand secondary.
- **Desktop (>900px, fine pointer):** sticky **vertical** rail in a side column.
- **Touch / narrow:** sticky **horizontal** rail when `max-width: 900px` **or** `(pointer: coarse)`. Targets **min 44×44**.
- **Active hour algorithm:** scroll-spy by section top — pick the last `.fold[data-hour]` / `.hour[data-hour]` whose `getBoundingClientRect().top <= stickyOffset + 0.35 * viewportHeight`. Do **not** use intersection-ratio sorting on tall sections.
- **Rail click:** `preventDefault` → set tokens + `aria-current="true"` on that link only (omit attribute otherwise) → scroll to section start with a **railLock** that suppresses the spy until `scrollend` or 500ms. Reduced motion = **instant** jump; no dependence on smooth scroll for correctness.
- **`scroll-padding-top`:** equals `--rail-sticky-size` (measured horizontal rail height on touch; 0 on desktop side rail).
- **AT:** skip link to `#main` / fold required; fold hour is a real `<h1>` (not `aria-hidden`).
- **Reduced motion:** instant token change; instant scroll; content always visible.
- **Purposeful transition:** hour paper / ink / accent swap ~180ms ease when motion allowed; none under `prefers-reduced-motion`.

---

## Translation table

| Reference | Mechanic taken | Cosplay refused |
|---|---|---|
| DR One Place / hard-light reframe | Narrow real window as title | Fake dawn/dusk; globe flex |
| WPP / AP captions | Who / what / where / when | Lyric AI copy |
| People-first documentary | Person-as-subject frames; noon torso crops | Postcard sky; legs/asphalt crops |
| Noon density | More frames, tighter people crops at midday | Repeating wide–pair–wide |

---

## Levers

| Lever | Spec |
|---|---|
| Grid | Rail + fold (hour / people); duo → noon three-up → bleed → single plate |
| Type | **Bricolage Grotesque only** (700/800), self-hosted woff2, `font-display: optional`. No Literata. No Fraunces. Strong scale contrast: fold hour vs captions. |
| Colour | Flat hour papers; CSS vars below; hairlines ≥ 3:1 |
| Imagery | Jimmy Elizarraras people-first; noon re-cropped to face/torso; 15:00 single clock plate |
| Texture | Ruled field notes at end only |
| Motion | Hour token swap + locked rail navigation (see behaviour) |
| Structure | Time rail; `<main>`; email last field-note line |

---

## Type

| Role | Face | Licence | Notes |
|---|---|---|---|
| Display hour / UI / captions / notes | Bricolage Grotesque | OFL, self-hosted `fonts/bricolage-{700,800}.woff2` | `font-display: optional` |

**Clamp (locked):**

- Desktop fold hour: `clamp(4.5rem, 14vw, 10rem)`, **line-height: 1.0** (not below 1.0).
- Mobile / horizontal-rail fold hour: `clamp(4.5rem, 22vw, 5.5rem)`, line-height 1.0; hour block ≥ ~28vh.
- Section H2: `clamp(1.35rem, 3vw, 2rem)`.
- Captions ~0.72rem; rail ~0.7rem.

---

## Colour (tokens + hour table)

**CSS custom properties:** `--bg`, `--ink`, `--mute`, `--accent`, `--rule`, `--w-display`, `--draft` (pinned status), `--rail-sticky-size`.

| Hour | `--bg` | `--ink` | `--accent` | `--rule` (≥3:1) |
|---|---|---|---|---|
| 11:00 | `#E4E6E8` | `#161616` | `#2F4A5C` | `#6E7072` |
| 12:00 | `#EBE6DC` | `#141414` | `#6B3D1F` | `#6A655C` |
| 13:00 | `#E7E0D4` | `#141210` | `#5A3518` | `#686054` |
| 14:00 | `#E3D9C8` | `#12100E` | `#4A2C14` | `#655C4E` |
| 15:00 | `#DDD2BE` | `#10100E` | `#3A2410` | `#625848` |

No decorative gradients. Re-verify AA after any grade change. Non-text UI rules (rail dividers, caption rules) **≥ 3:1** vs `--bg`.

---

## Imagery

**Source:** Jimmy Elizarraras · Centro Histórico, CDMX · 3 March 2024 · Pexels License (`wild-v2/licences.md`). Opt derivatives in `images/opt/`.

**LCP recipe:** fold people `<picture>` AVIF → WebP → JPEG; `srcset` 800/1200/1600; `sizes="(max-width:900px) 100vw, min(1010px, 74vw)"`; largest candidate **≤ 200KB**; `fetchpriority="high"`; `decoding="async"`; below-fold `loading="lazy"`. Budgets: LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms.

**Rules:** people-first; captions match; noon torso/face crops; place in captions only; neutral grade.

**Noon three-up (2026-10-30 re-score):** centre panel is a people-first crop of `jimmy-20848791` (woman in green sweater on the marble floor) — not empty stairs. Right panel is a tighter `jimmy-20850269` crop (less sky). Alt text and SHORT captions must match the pixels. Production payloads from `images/opt/` only.

---

## Caption / copy (DRAFT)

- **SHORT:** AP facts; DRAFT tagged.
- Colophon = daytime-only disclosure.
- Field notes end with **Write: desk@…** (email only; mailto hit area ≥ 44px tall).

---

## Layout / mobile / motion / budgets

- **Mobile first viewport (composed separately):** sticky horizontal rail only as chrome → huge hour block (≥ ~28vh) → people plate filling the rest. **No** second full-width title bar duplicating brand (hide fold `.brand` under horizontal rail).
- Tablet ≤900px uses horizontal rail (not a squeezed vertical desktop rail) so the fold hour is never clipped by the photo column.
- Fonts: self-hosted woff2 only; ≤ 1 family in this rough (Bricolage); `font-display: optional`.
- Skip link + `<main id="main">` + sensible tab stops (skip → rail → content → mailto).

---

## Ban list

Globes, map pins, passport kitsch, Instagram grids, destination cards, country counters, soft-shadow polaroids, lyric AI captions, hero+CTA, Fraunces-on-cream, teal-orange postcard grade, building-only heroes, fake dawn/dusk, polite default grotesk fold, repeating wide–pair–wide, phone numbers, CDN Google Fonts in production path.

---

## Open questions

1. Remus: approve DRAFT copy and placeholder email.
2. Production: commission true dawn→dusk people essay, or keep hard-light window?
3. Wordmark-only vs personal name?
4. **UI/UX ux-pass 2026-10-30 must be cleared before Factory.**

## Ledger

See `ledger-row.md` (not committed).
