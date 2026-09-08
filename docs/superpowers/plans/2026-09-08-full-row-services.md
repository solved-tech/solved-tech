# Full-Row Services Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert all five service boxes into consistent full-width rows with a dominant diagram column.

**Architecture:** Wrap each service's offer content in a dedicated copy region, then use the existing capability and artwork regions as the other two row columns. Remove every product-specific spanning rule so all rows share one responsive layout.

**Tech Stack:** TypeScript 7.0.2, semantic HTML, CSS Grid, Vitest 4.1.11

## Global Constraints

- Preserve the approved service order and all SVG geometry.
- AI has five capability items; other services have four.
- AI includes `Custom MCPs` and `MCP integrations`.
- Service 05 uses the broad copy from
  `docs/superpowers/specs/2026-09-08-full-row-services-design.md`.
- Diagrams use approximately 54 percent of wide rows.
- Work locally only; do not push or create a pull request.

---

### Task 1: Build Consistent Full-Width Service Rows

**Files:**
- Modify: `tests/content.test.ts`
- Modify: `tests/render.test.ts`
- Modify: `src/content.ts`
- Modify: `src/render.ts`
- Modify: `src/styles.css`

**Interfaces:**
- Changes: `ProductOffer.provides` from a fixed tuple to `string[]`
- Produces: five `.service-box__copy` regions
- Keeps: five `.service-box__provides` and `.service-box__artwork` regions

- [ ] **Step 1: Add failing content tests**

```ts
it("keeps MCP work in AI and leaves service 05 broad", () => {
  const ai = siteContent.products.find(({ id }) => id === "ai");
  const other = siteContent.products.find(({ id }) => id === "other");

  expect(ai?.provides).toEqual([
    "AI assistants",
    "Agentic workflows",
    "WhatsApp & voice agents",
    "Custom MCPs",
    "MCP integrations",
  ]);
  expect(other).toMatchObject({
    title: "Whatever your business needs",
    answer: "If it does not fit a box, bring it anyway.",
    provides: [
      "Bespoke solutions",
      "Business automation",
      "Connected systems",
      "Unusual requests",
    ],
  });
  expect(other?.provides.some((item) => item.includes("MCP"))).toBe(false);
});
```

Update the capability-count assertion to require lengths `[5, 4, 4, 4, 4]`.

- [ ] **Step 2: Add failing renderer tests**

```ts
it("renders every service as the same three-region row", () => {
  expect(html.match(/class="service-box__copy"/g)).toHaveLength(5);
  expect(html.match(/class="service-box__provides"/g)).toHaveLength(5);
  expect(html.match(/class="service-box__artwork"/g)).toHaveLength(5);
});
```

- [ ] **Step 3: Verify the new tests fail**

```bash
npm test -- --run tests/content.test.ts tests/render.test.ts
```

Expected: FAIL because AI has four items, Service 05 contains MCP integrations,
and no copy wrappers render.

- [ ] **Step 4: Update content**

Change:

```ts
provides: [string, string, string, string];
```

to:

```ts
provides: string[];
```

Replace AI and Service 05 content with the exact arrays and copy from Step 1.

- [ ] **Step 5: Create the copy region**

Render each link as:

```html
<a class="service-box__link" href="#contact">
  <div class="service-box__copy">
    <span class="service-box__number">${String(index + 1).padStart(2, "0")}</span>
    <strong>${escapeHtml(question)}</strong>
    <span class="service-box__product">${escapeHtml(title)}</span>
    <p>${escapeHtml(answer)}</p>
    <span class="service-box__cta">
      Talk to us <span aria-hidden="true">→</span>
    </span>
  </div>
  ${renderCapabilities(provides)}
  <span class="service-box__artwork">${renderServiceArt(id)}</span>
</a>
```

The renderer continues to generate actual copy, capabilities, and artwork from
each product; the shown AI values establish element order.

- [ ] **Step 6: Replace the mosaic layout**

Use one service-grid column at every width. On mobile, `.service-box__link`
stacks copy, capabilities, and artwork. At 48rem, use two columns with artwork
spanning both below. At 64rem, use:

```css
.service-box__link {
  grid-template-columns:
    minmax(14rem, 0.72fr)
    minmax(13rem, 0.66fr)
    minmax(28rem, 1.62fr);
  grid-template-areas: "copy provides artwork";
  gap: clamp(1.5rem, 3vw, 3rem);
  min-height: 28rem;
}
```

Assign the three regions to those named areas, add a left separator to the
artwork, and use a single capability column on wide rows. Remove
`.service-box--website`, `.service-box--ai`, `.service-box--customers`,
`.service-box--app`, and `.service-box--other` grid-placement rules.

- [ ] **Step 7: Verify and commit locally**

```bash
npm test -- --run tests/content.test.ts tests/render.test.ts &&
npm test -- --run &&
npm run check &&
npm run build &&
git diff --check
```

Expected: all tests and checks pass.

```bash
git add tests/content.test.ts tests/render.test.ts src/content.ts \
  src/render.ts src/styles.css \
  docs/superpowers/plans/2026-09-08-full-row-services.md
git commit -m "feat(site): use consistent full-row services"
```

Verify wide desktop and 390-pixel mobile layouts, confirm no horizontal
overflow, and keep the local Vite server running. Do not push, open a pull
request, or merge.
