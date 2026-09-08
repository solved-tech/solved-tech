# Service Order and Capabilities Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorder the five service boxes, rename Traffic to Customers, and add a clear four-item capability list to each box.

**Architecture:** Add a typed `provides` array to each `ProductOffer`. The renderer maps it into semantic list markup inside the existing service link; CSS integrates the list into the current responsive box grid.

**Tech Stack:** TypeScript 7.0.2, semantic HTML, CSS Grid, Vitest 4.1.11

## Global Constraints

- Use the exact order, copy, and twenty capability items from
  `docs/superpowers/specs/2026-09-08-service-order-capabilities-design.md`.
- Rename the internal `traffic` identifier to `customers`.
- Keep all illustration geometry unchanged.
- Add no dependency or JavaScript controller.
- Work locally only; do not push or create a pull request.

---

### Task 1: Reorder Products and Add Capability Lists

**Files:**
- Modify: `tests/content.test.ts`
- Modify: `tests/render.test.ts`
- Modify: `src/content.ts`
- Modify: `src/render.ts`
- Modify: `src/styles.css`

**Interfaces:**
- Produces: `ProductOffer.provides: [string, string, string, string]`
- Produces: `.service-box__provides` containing `.service-box__capabilities`
- Changes: `ProductOffer.id` union member `"traffic"` to `"customers"`

- [ ] **Step 1: Write failing content tests**

```ts
it("uses the approved commercial service order", () => {
  expect(siteContent.products.map(({ id }) => id)).toEqual([
    "ai",
    "customers",
    "website",
    "app",
    "other",
  ]);
  expect(siteContent.products.map(({ question }) => question)).toEqual([
    "Want to use AI?",
    "Need more customers?",
    "Need a website?",
    "Need an app?",
    "Need something else?",
  ]);
});

it("lists four concrete capabilities for every product", () => {
  expect(siteContent.products.every(({ provides }) => provides.length === 4))
    .toBe(true);
  expect(siteContent.products.flatMap(({ provides }) => provides)).toContain(
    "Technical SEO",
  );
  expect(siteContent.products.flatMap(({ provides }) => provides)).toContain(
    "MCP integrations",
  );
});
```

- [ ] **Step 2: Write failing renderer tests**

```ts
it("renders the service order and capability lists", () => {
  expect(html.match(/class="service-box__provides"/g)).toHaveLength(5);
  expect(html.match(/class="service-box__capability"/g)).toHaveLength(20);
  expect(html.indexOf("Want to use AI?")).toBeLessThan(
    html.indexOf("Need more customers?"),
  );
  expect(html.indexOf("Need more customers?")).toBeLessThan(
    html.indexOf("Need a website?"),
  );
  expect(html).not.toContain("Need more traffic?");
  expect(html).not.toContain('data-service-art="traffic"');
});
```

- [ ] **Step 3: Run tests and confirm failure**

```bash
npm test -- --run tests/content.test.ts tests/render.test.ts
```

Expected: FAIL because `provides` and `customers` do not exist.

- [ ] **Step 4: Update typed content**

```ts
export interface ProductOffer {
  id: "website" | "app" | "customers" | "ai" | "other";
  question: string;
  title: string;
  answer: string;
  provides: [string, string, string, string];
}
```

Rebuild `siteContent.products` in the exact order and with the exact capability
arrays specified in the design document.

- [ ] **Step 5: Rename the illustration case and CSS placement**

Change `case "traffic"` to `case "customers"`, use
`data-service-art="customers"` and `service-art--customers`, and change
`.service-box--traffic` to `.service-box--customers`. Preserve the current
Search, Ads, and Visit SVG geometry.

- [ ] **Step 6: Render semantic capabilities**

Inside the product map:

```ts
const capabilities = provides
  .map(
    (capability) =>
      `<li class="service-box__capability">${escapeHtml(capability)}</li>`,
  )
  .join("");
```

Render between the answer and artwork:

```html
<div class="service-box__provides">
  <span>We provide</span>
  <ul class="service-box__capabilities">${capabilities}</ul>
</div>
```

- [ ] **Step 7: Style the capability block**

```css
.service-box__provides {
  grid-column: 2;
  grid-row: 4;
  margin-block-start: 1rem;
  padding-block-start: 0.8rem;
  border-block-start: 1px solid var(--line);
}

.service-box__provides > span {
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: var(--type-small);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.service-box__capabilities {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0;
  margin: 0.7rem 0 0;
  padding: 0;
  list-style: none;
}

.service-box__capability {
  padding: 0.45rem 0.6rem 0.45rem 0;
  border-block-start: 1px solid var(--line);
  color: var(--ink-muted);
  font-size: var(--type-small);
}
```

Move artwork and CTA down one explicit grid row. In wide featured boxes,
include the capability block in the left text column and span the artwork
across every text row. Below 22rem, use one capability column.

- [ ] **Step 8: Verify and commit locally**

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
  docs/superpowers/plans/2026-09-08-service-order-capabilities.md
git commit -m "feat(site): add service capability lists"
```

Verify desktop and 390-pixel mobile layouts, confirm no horizontal overflow,
and keep the local Vite server running. Do not push, open a pull request, or
merge.
