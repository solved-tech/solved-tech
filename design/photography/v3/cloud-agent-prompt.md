# Cloud-agent prompt — Mara Ellison Contact Sheet

**Model / effort:** grok-4.7, `reasoning_effort: xhigh` (per `team/company/workflow.md`).  
**Repo:** `solved-tech/solved-tech`  
**Branch:** create from `main` as `cursor/mara-contact-sheet` (PR #27 / `cursor/photographer-sample-e26d` already merged; do not reopen it).  
**Replace:** `samples/mara-ellison/` (retire darkroom Mara; ship Contact Sheet).  
**Do not run until:** `art-direction.md` exists beside this file and Remus has confirmed copy (`copy.md`).  
**Never:** publish, DNS, merge PR #24, or merge without Remus.

---

Copy everything below the line into the cloud agent task unchanged.

---

Build the Mara Ellison sample page (Contact Sheet) for Solved Tech in solved-tech/solved-tech, on branch cursor/mara-contact-sheet created from main. Use the build defaults in team/company/workflow.md of solved-tech/agentic-platform.

Read first, in order, and look at every image:
1. design/photography/v3/art-direction.md — the contract. Implement it exactly. If missing, STOP and report; do not invent a direction.
2. design/photography/v3/build-brief.md
3. design/photography/v3/direction-2.html (chosen rough), design/photography/v3/direction-2.png, design/photography/v3/direction-2-mobile.png, design/photography/v3/ux-audit/shots/, and design/photography/v3/ux-pass.md
4. design/photography/v3/copy.md (or draft-copy.md only if copy.md absent and the brief says Remus approved those strings), design/photography/v3/assets/strips/, design/photography/v3/assets/marks/, design/photography/v3/assets/st-logo-mark.png, design/photography/v3/assets/strips/SEQUENCE-NOTE.md, design/photography/v3/assets/set/CREDITS.md
5. design/photography/v3/rationale.md and design/photography/v3/critique-trail.md

Target path: samples/mara-ellison/ (replace the existing darkroom sample). Keep the sample routable the same way other samples are in this repo (tests, links, favicon as needed).

Skills: the design plugin's visual-design rule and visual-review-loop; Impeccable (shape, critique, audit, adapt, harden, optimize, polish); Taste and frontend-design if present in the repo. Run Impeccable each review round.

Rules:
- Tokens as CSS custom properties exactly as defined in art-direction.md / build-brief.md. Add no fonts, colours, radii, shadows, spacing, or motion that those files do not define. Replace any framework default theme.
- Build order: tokens and type scale → signature device at full quality (desktop, touch/tablet composed separately, keyboard, reduced motion) → first viewport, composed separately for desktop and mobile → remaining sections → states and edge cases.
- Signature device: the page IS a marked contact sheet — misregistered Kodak/Portra strips, sprockets, edge print, grease-pencil keeps/rejects, authored loupe, mobile pull-strip. All three rolls (07A/07B/07C) with keeps 07A2 · 07B1 · 07C3 must be reachable on touch, not aside-text only.
- Banned: package/rate cards as SaaS tiers, equal card grids, filter chips, shortlist hearts, cream+terracotta wedding theme, hero+subhead+CTA, soft-shadow photos on flat colour panes, mono poetic AI captions, logo-as-hero vanity, Framer coloured slabs, Through-the-Pane glass cosplay, resurrecting darkroom-safelight Mara, phone numbers, invented reviews or stats — plus the Solved Tech bans in team/skills/artistry-critique.
- Content: only from copy.md and assets/. Leave a visible TODO rather than inventing text, images, reviews, or numbers. Keep Unsplash + derived-burst honesty in the colophon.
- Brand: the exact ST logo mark from design/photography/v3/assets/st-logo-mark.png (Drive Brand original); no phone numbers; location-neutral; EXAMPLE honesty.
- Floors: WCAG 2.2 AA (text 4.5:1, non-text UI 3:1 with hairlines using the art-direction --rule token (#555555, ≥3:1)), visible designed :focus-visible, skip link, main landmark, single h1, targets ≥ 44px, reduced-motion alternative, scroll-spy by section top for strips, LCP ≤ 2.5s with hero/first-frame <picture> AVIF+WebP srcset ≤ 200KB and fetchpriority=high, CLS ≤ 0.1, INP ≤ 200ms, at most 2 font families, self-hosted woff2 with font-display: optional, display/ask line-height ≥ 1.0.
- Honour ux-pass.md CRITICAL/HIGH fixes: three-roll mobile, no download of display:none strip sets, contrast tokens, main landmark, authored loupe, tablet composition, picture/LCP pipeline, reduced-motion scroll, keep-id sync with rough.

Verify in rounds (at least 3): run visual-review-loop capture.mjs on the preview, put it on a contact sheet with the chosen rough (direction-2.png / direction-2-mobile.png) and two refs from design/photography/ research or research-lab if present, run the code scan, run Impeccable critique+audit, and fix the top three issues. Commit shots/round-N/ each round under samples/mara-ellison/ or design/photography/v3/shots/.

Finish: open a PR into main with the final screenshots (desktop, tablet, mobile, reduced motion) and the round log in the description. Do not merge. Never merge PR #24. Do not publish or change DNS.
