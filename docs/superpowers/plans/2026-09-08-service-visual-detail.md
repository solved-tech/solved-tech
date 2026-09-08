# Service Visual Detail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fill all five service illustrations with recognisable product interfaces, plain-language labels, and meaningful workflow data.

**Architecture:** Keep the five scenes inside `renderServiceArt` as decorative inline SVG. Shared SVG classes style labels, panels, routes, and packets; CSS controls one-time reveal choreography without adding JavaScript.

**Tech Stack:** TypeScript 7.0.2, inline SVG, CSS keyframes, Vitest 4.1.11

## Global Constraints

- Keep every SVG at `viewBox="0 0 520 300"` and `aria-hidden="true"`.
- Use no external assets, dependency, JavaScript controller, invented metric,
  performance claim, gradient, or shadow.
- Keep animation below 900 milliseconds with no continuous loop.
- Reduced motion displays the complete final scene.
- Do not change service copy, layout, contact behaviour, or other sections.
- Work locally only; do not push or create a pull request.

---

### Task 1: Enrich All Five Service Scenes

**Files:**
- Modify: `tests/render.test.ts`
- Modify: `src/render.ts`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `renderServiceArt(id: ProductOffer["id"]): string`
- Produces: five `data-service-art` SVGs
- Produces: `.art-detail`, `.art-panel`, `.art-label`, `.art-data-route`, and
  `.art-packet` scene primitives

- [ ] **Step 1: Add the failing visual-content test**

```ts
it("fills every service visual with meaningful interface detail", () => {
  [
    "Home",
    "Shop",
    "Contact",
    "Tasks",
    "Search",
    "Ads",
    "Visit",
    "Request",
    "Agent",
    "Memory",
    "Calendar",
    "Messages",
    "Done",
    "Payments",
    "CRM",
    "Data",
  ].forEach((label) => expect(html).toContain(`>${label}</text>`));

  expect(html.match(/class="art-detail/g)?.length).toBeGreaterThanOrEqual(15);
  expect(html.match(/class="art-packet/g)?.length).toBeGreaterThanOrEqual(5);
});
```

- [ ] **Step 2: Verify the test fails**

Run:

```bash
npm test -- --run tests/render.test.ts
```

Expected: FAIL because the current SVGs contain no text labels or data packets.

- [ ] **Step 3: Replace the five SVG interiors**

Use the following complete scene contract:

- `website`: browser chrome; `Home`, `Shop`, `Contact`; basket symbol; hero
  content; orange action; two populated product tiles.
- `app`: desktop navigation rail; `Tasks`; activity line; three task rows with
  statuses; phone task and completion check.
- `traffic`: panels labelled `Search`, `Ads`, and `Visit`; one directed orange
  route; two orange packets on the route.
- `ai`: nodes labelled `Request`, `Agent`, `Memory`, `CRM`, `Calendar`,
  `Messages`, and `Done`; directed connections; three packets.
- `other`: central integration hub connected to `Shop`, `App`, `Payments`,
  `CRM`, and `Data`; distinct node symbols; two packets.

Every populated group uses one of these exact classes:

```html
<g class="art-detail art-detail--one">
  <rect class="art-panel" x="20" y="20" width="100" height="50" />
  <text class="art-label" x="32" y="49">Plain label</text>
</g>
<g class="art-detail art-detail--two">
  <path class="art-data-route" d="M120 45H220" />
  <circle class="art-packet art-packet--x" cx="170" cy="45" r="4" />
</g>
<g class="art-detail art-detail--three">
  <circle class="art-packet art-packet--y" cx="220" cy="95" r="4" />
</g>
```

Route arrowheads are hand-drawn path segments rather than SVG marker IDs so
multiple homepage renders cannot create duplicate IDs.

- [ ] **Step 4: Replace sparse scene choreography**

Add these shared final styles:

```css
.art-panel {
  fill: rgb(255 255 255 / 0.025);
  stroke: rgb(255 255 255 / 0.28);
  stroke-width: 1;
}

.art-label {
  fill: var(--ink-muted);
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.8px;
}

.art-label--strong {
  fill: var(--ink);
}

.art-label--accent {
  fill: var(--accent);
}

.art-data-route {
  fill: none;
  stroke: var(--accent);
  stroke-dasharray: 420;
  stroke-width: 1.5;
}

.art-packet {
  fill: var(--accent);
  stroke: var(--surface);
  stroke-width: 2;
  transform-box: fill-box;
  transform-origin: center;
}
```

Reveal `.art-detail--one`, `--two`, and `--three` at 120-millisecond intervals.
Draw `.art-data-route` with the existing `art-flow` keyframe. Move
`.art-packet--x` by 12 pixels horizontally and `.art-packet--y` by 12 pixels
vertically with one 640-millisecond animation. Hover or focus replays only the
route and packet movement.

- [ ] **Step 5: Preserve reduced motion and mobile clarity**

Inside `prefers-reduced-motion`, set all `.art-detail`, `.art-data-route`, and
`.art-packet` elements to their final opacity, transform, and stroke position
with no animation. Below 26rem, hide only `.art-detail--secondary`; named nodes
and primary routes remain visible.

- [ ] **Step 6: Run focused and full verification**

```bash
npm test -- --run tests/render.test.ts &&
npm test -- --run &&
npm run check &&
npm run build &&
git diff --check
```

Expected: all 30 tests pass, TypeScript exits zero, Vite builds `dist/`, and
the whitespace check is clean.

- [ ] **Step 7: Commit locally**

```bash
git add tests/render.test.ts src/render.ts src/styles.css \
  docs/superpowers/plans/2026-09-08-service-visual-detail.md
git commit -m "feat(site): enrich service illustrations"
```

Confirm `http://127.0.0.1:5178/solved-tech/` returns HTTP 200. Do not push,
open a pull request, or merge.
