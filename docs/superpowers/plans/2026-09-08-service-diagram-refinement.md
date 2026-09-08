# Service Diagram Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Simplify the App illustration and correct alignment and connector geometry in the AI and Connected Systems illustrations.

**Architecture:** Change only three `renderServiceArt` cases and their shared SVG styles. Keep the scenes decorative, static without JavaScript, and animated by the existing CSS contract.

**Tech Stack:** TypeScript 7.0.2, inline SVG, CSS, Vitest 4.1.11

## Global Constraints

- Website and Traffic SVG markup remain unchanged.
- Keep all SVG view boxes at `520 × 300`.
- Add no dependency, JavaScript controller, or external asset.
- AI and Connected Systems labels use `text-anchor="middle"` and
  `dominant-baseline="middle"`.
- AI connectors have no arrowheads.
- Connectors terminate at node and hub edges.
- Work locally only; do not push or open a pull request.

---

### Task 1: Refine App, AI, and Connected Systems

**Files:**
- Modify: `tests/render.test.ts`
- Modify: `src/render.ts`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `renderServiceArt(id: ProductOffer["id"]): string`
- Produces: simplified App scene and edge-terminated AI/integration routes

- [ ] **Step 1: Add failing scene-specific tests**

```ts
it("keeps the app and system diagrams visually restrained", () => {
  const appScene = html.match(
    /data-service-art="app"[\s\S]*?<\/svg>/,
  )?.[0];
  const aiScene = html.match(
    /data-service-art="ai"[\s\S]*?<\/svg>/,
  )?.[0];
  const systemsScene = html.match(
    /data-service-art="other"[\s\S]*?<\/svg>/,
  )?.[0];

  expect(appScene).toBeDefined();
  expect(appScene).not.toContain("art-data-line");
  expect(aiScene).toContain(">Tools</text>");
  expect(aiScene).not.toContain("art-data-route--arrow");
  expect(systemsScene?.match(/text-anchor="middle"/g)).toHaveLength(6);
  expect(systemsScene).toContain('class="art-accent art-hub art-hub--solid"');
});
```

- [ ] **Step 2: Verify the new test fails**

```bash
npm test -- --run tests/render.test.ts
```

Expected: FAIL because App still has a chart, AI has arrowheads and separate
tool boxes, and Connected Systems labels are not centred.

- [ ] **Step 3: Simplify App**

Use these non-overlapping bounds:

- Desktop: `x=42`, `y=42`, `width=292`, `height=204`.
- Phone: `x=370`, `y=72`, `width=108`, `height=184`.
- Desktop task rows: `y=132` and `y=176`.
- Phone task panel: `x=386`, `y=116`, `width=76`, `height=62`.

Remove `.art-data-line` and the third desktop task. Keep `Tasks`, two task
lines, one active desktop status, phone `TASK`, and one completion check.

- [ ] **Step 4: Simplify AI and correct connectors**

Use:

- Request box: `x=28..112`, centred at `y=150`.
- Agent box: `x=194..306`, centred at `y=150`.
- Done box: `x=208..292`, centred at `y=258`.
- Memory box: `x=205..295`, centred at `y=46`.
- Tools container: `x=378..502`, `y=84..216`.
- Primary paths: `M112 150H194` and `M250 200V237`.
- Memory path: `M250 84V100`.
- Tools path: `M306 150H378`.

The Tools container contains centred labels `Tools`, `CRM`, `Calendar`, and
`Messages`, separated by two short horizontal rules. Remove every
`.art-data-route--arrow` element from the AI case.

- [ ] **Step 5: Correct Connected Systems**

Keep the hub centred at `(260, 150)` with radius `42`, but add
`.art-hub--solid`. Terminate left routes at `x=218`, right routes at `x=302`,
and box-side routes at the nearest box edges. Draw five independent paths; no
path endpoint is `(260, 150)`.

Centre `Shop`, `App`, `Payments`, `CRM`, `Data`, and `Connect` using:

```html
<text
  class="art-label"
  x="83"
  y="62"
  text-anchor="middle"
  dominant-baseline="middle"
>Shop</text>
```

Apply the same attributes with each node's actual centre coordinates.

- [ ] **Step 6: Add the solid-hub style**

```css
.art-hub--solid {
  fill: var(--surface-deep);
}
```

- [ ] **Step 7: Run verification and commit locally**

```bash
npm test -- --run tests/render.test.ts &&
npm test -- --run &&
npm run check &&
npm run build &&
git diff --check
```

Expected: all 31 tests pass and all checks exit zero.

```bash
git add tests/render.test.ts src/render.ts src/styles.css \
  docs/superpowers/plans/2026-09-08-service-diagram-refinement.md
git commit -m "fix(site): clarify service diagrams"
```

Verify desktop and 390-pixel mobile rendering, confirm no horizontal overflow,
and keep the local Vite server running. Do not push, open a pull request, or
merge.
