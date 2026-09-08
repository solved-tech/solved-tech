# Animated Service Boxes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the product selector with five animated service boxes and upgrade both founder placeholder portraits without weakening accessibility or GitHub Pages deployment.

**Architecture:** `src/render.ts` will render every product as a self-contained article with an inline decorative SVG and a link to the contact section. CSS will own the asymmetric grid, reveal choreography, hover/focus replay, and reduced-motion final states; the obsolete product-selection controller will be removed from `src/main.ts`.

**Tech Stack:** Vite 8.2.2, TypeScript 7.0.2, Vitest 4.1.11, semantic HTML, CSS keyframes, inline SVG

## Global Constraints

- Keep all five approved buying questions and their plain-language answers.
- Keep the framework-free architecture and `/solved-tech/` GitHub Pages base.
- Use no gradients, shadows, stock images, glossy effects, or decorative icon libraries.
- Code-background opacity remains below three percent.
- Motion uses transforms, opacity, and stroke effects and must respect `prefers-reduced-motion`.
- Founder images remain explicitly labelled placeholders and must not suggest real identities.
- Do not change the current Call and WhatsApp placeholders.

---

### Task 1: Replace the Product Selector with Service Boxes

**Files:**
- Modify: `tests/render.test.ts`
- Modify: `tests/motion.test.ts`
- Modify: `src/render.ts`
- Modify: `src/main.ts`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `siteContent.products: ProductOffer[]`
- Produces: five `.service-box` articles with `.service-box__link`
- Produces: one inline SVG with `data-service-art="<ProductOffer.id>"` per article
- Removes: `setupProductShowcase(root: ParentNode): void`

- [ ] **Step 1: Write failing renderer tests**

Replace the product-showcase test with:

```ts
it("renders every service as an animated visual box", () => {
  expect(html.match(/class="service-box/g)).toHaveLength(5);
  siteContent.products.forEach(({ id, question }) => {
    expect(html).toContain(`data-service-art="${id}"`);
    expect(html).toContain(`<strong>${question}</strong>`);
  });
  expect(html).not.toContain("data-product-option");
  expect(html).not.toContain("data-product-stage");
});
```

Keep the existing content, contact, founder, logo, background, and Pages-path
assertions.

- [ ] **Step 2: Remove the obsolete motion test**

Delete the `product showcase` describe block and remove
`setupProductShowcase` from the import list. Keep reveal, hero, menu, header,
and scroll-progress coverage unchanged.

- [ ] **Step 3: Run tests to verify the expected failure**

Run:

```bash
npm test -- --run tests/render.test.ts tests/motion.test.ts
```

Expected: renderer assertions fail because the selector/stage markup remains.

- [ ] **Step 4: Render the service grid**

In `src/render.ts`, replace `renderProductScenes` and the selector/stage markup
with:

```ts
const renderServiceArt = (id: ProductOffer["id"]): string => {
  switch (id) {
    case "website":
      return `<svg class="service-art service-art--website" data-service-art="website" aria-hidden="true" viewBox="0 0 520 300">
        <rect class="art-frame" x="48" y="42" width="424" height="216" rx="4" />
        <path class="art-line" d="M48 84H472M80 63H92M104 63H116M128 63H140" />
        <rect class="art-panel" x="84" y="118" width="160" height="18" rx="2" />
        <rect class="art-action" x="84" y="184" width="112" height="38" rx="2" />
      </svg>`;
    case "app":
      return `<svg class="service-art service-art--app" data-service-art="app" aria-hidden="true" viewBox="0 0 520 300">
        <rect class="art-frame art-screen" x="64" y="54" width="286" height="184" rx="5" />
        <path class="art-line" d="M64 204H350M178 268H236M207 238V268" />
        <rect class="art-action art-phone" x="326" y="96" width="126" height="174" rx="15" />
      </svg>`;
    case "traffic":
      return `<svg class="service-art service-art--traffic" data-service-art="traffic" aria-hidden="true" viewBox="0 0 520 300">
        <circle class="art-frame" cx="262" cy="146" r="104" />
        <circle class="art-line" cx="262" cy="146" r="64" />
        <path class="art-route" d="M112 240C184 166 248 130 408 66" />
        <circle class="art-action art-target" cx="408" cy="66" r="9" />
      </svg>`;
    case "ai":
      return `<svg class="service-art service-art--ai" data-service-art="ai" aria-hidden="true" viewBox="0 0 520 300">
        <rect class="art-frame art-step art-step--one" x="42" y="104" width="116" height="88" rx="6" />
        <rect class="art-frame art-step art-step--two" x="202" y="104" width="116" height="88" rx="6" />
        <rect class="art-action art-step art-step--three" x="362" y="104" width="116" height="88" rx="6" />
        <path class="art-route" d="M158 148H202M318 148H362" />
      </svg>`;
    case "other":
      return `<svg class="service-art service-art--other" data-service-art="other" aria-hidden="true" viewBox="0 0 520 300">
        <path class="art-route" d="M132 74L260 150L388 74M132 226L260 150L388 226" />
        <circle class="art-frame" cx="132" cy="74" r="30" />
        <rect class="art-frame" x="358" y="44" width="60" height="60" rx="6" />
        <rect class="art-frame" x="102" y="196" width="60" height="60" rx="30" />
        <circle class="art-frame" cx="388" cy="226" r="30" />
        <circle class="art-action" cx="260" cy="150" r="38" />
      </svg>`;
  }
};
```

Every SVG must contain its complete geometric illustration described in the
specification. Render each product as:

```html
<article class="service-box service-box--${id}" data-reveal>
  <a class="service-box__link" href="#contact">
    <span class="service-box__number">01</span>
    <strong>Need a website?</strong>
    <span class="service-box__product">Websites and online shops</span>
    <p>A clear, fast place built to turn attention into action.</p>
    ${renderServiceArt(id)}
    <span class="service-box__cta">Talk to us <span aria-hidden="true">→</span></span>
  </a>
</article>
```

Remove the product-stage live region and all selection data attributes.

- [ ] **Step 5: Remove selection JavaScript**

Delete `setupProductShowcase` and its invocation from `src/main.ts`. Retain the
single existing reveal observer so each box receives `.is-visible` when it
enters the viewport.

- [ ] **Step 6: Implement the responsive grid and animation contract**

Replace `.product-*` rules in `src/styles.css` with:

```css
.service-grid {
  display: grid;
  gap: 1px;
  border: 1px solid var(--line-strong);
  background: var(--line);
}

.service-box {
  min-width: 0;
  background: rgb(18 17 16 / 0.94);
}

.service-box__link {
  display: grid;
  min-height: 100%;
  padding: clamp(1.25rem, 3vw, 2rem);
  color: inherit;
  text-decoration: none;
}

@media (min-width: 48rem) {
  .service-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .service-box--other {
    grid-column: 1 / -1;
  }
}

@media (min-width: 70rem) {
  .service-grid {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  .service-box--website,
  .service-box--ai {
    grid-column: span 4;
  }

  .service-box--app,
  .service-box--traffic {
    grid-column: span 2;
  }

  .service-box--other {
    grid-column: span 6;
  }
}
```

Add product-specific keyframes. Trigger their final state through
`.service-box.is-visible`, and replay restrained motion through
`.service-box:hover` and `.service-box:focus-within`. Keep every transform
within 16 pixels and every animation between 420 and 900 milliseconds.

- [ ] **Step 7: Add reduced-motion final states**

Inside the existing reduced-motion query, disable service-art animations and
show every line, node, screen, and action in its final opacity and transform
state.

- [ ] **Step 8: Verify Task 1**

Run:

```bash
npm test -- --run tests/render.test.ts tests/motion.test.ts &&
npm run check &&
npm run build
```

Expected: all focused tests pass, TypeScript exits zero, and Vite builds
`dist/` successfully.

---

### Task 2: Upgrade Founder Placeholder Artwork

**Files:**
- Modify: `public/team/founder-one-placeholder.svg`
- Modify: `public/team/founder-two-placeholder.svg`
- Modify: `src/styles.css`
- Test: `tests/render.test.ts`

**Interfaces:**
- Keeps asset URLs:
  - `/team/founder-one-placeholder.svg`
  - `/team/founder-two-placeholder.svg`
- Keeps intrinsic dimensions: `520 × 620`

- [ ] **Step 1: Strengthen the portrait contract**

Extend the existing founder renderer test:

```ts
expect(html.match(/class="founder__portrait-frame"/g)).toHaveLength(2);
expect(html.match(/Photo placeholder/g)).toHaveLength(2);
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm test -- --run tests/render.test.ts
```

Expected: FAIL because `.founder__portrait-frame` does not exist.

- [ ] **Step 3: Add the presentation frame**

Wrap each portrait image in:

```html
<div class="founder__portrait-frame">
  <img
    src="${escapeHtml(publicAssetUrl(image, baseUrl))}"
    alt="Placeholder portrait for ${escapeHtml(name)}"
    width="520"
    height="620"
    loading="lazy"
  />
</div>
```

Keep the visible `Photo placeholder` label outside the frame but inside
`.founder__portrait`.

- [ ] **Step 4: Redraw both local SVG portraits**

Build each `520 × 620` SVG from layered charcoal, grey, warm-white, and orange
vector shapes. Give each portrait a distinct face angle, hairstyle, clothing
shape, and geometric background composition. Include a `<title>` and `<desc>`
that explicitly identify it as placeholder artwork. Do not use photographs,
embedded raster data, names, or realistic identity details.

- [ ] **Step 5: Improve portrait presentation**

Use a double-frame treatment, a small offset orange corner marker, and a subtle
image scale on `.founder:hover` or `.founder:focus-within`. Keep the label
legible and keep all movement disabled under reduced motion.

- [ ] **Step 6: Verify Task 2**

Run:

```bash
npm test -- --run tests/render.test.ts &&
npm run check &&
npm run build
```

Expected: renderer tests pass, TypeScript exits zero, and the production build
succeeds.

---

### Task 3: Full Verification and Handoff

**Files:**
- Modify only if verification finds a scoped defect: `src/render.ts`,
  `src/main.ts`, `src/styles.css`, portrait SVGs, or tests

- [ ] **Step 1: Run the automated gate**

Run:

```bash
npm test -- --run &&
npm run check &&
npm run build &&
git diff --check
```

Expected: all tests pass, type checking and build exit zero, and no whitespace
errors are reported.

- [ ] **Step 2: Verify in the browser**

At `1440 × 900` and `390 × 844`, verify:

- All five boxes are visible and readable.
- The asymmetric desktop grid becomes one column on mobile.
- Every box links to `#contact`.
- Illustrations animate once on reveal and remain decorative.
- Founder artwork is distinct, labelled, and not cropped awkwardly.
- Reduced motion shows complete static illustrations.
- There is no horizontal overflow or console error.

- [ ] **Step 3: Commit the implementation**

```bash
git add src/main.ts src/render.ts src/styles.css \
  tests/render.test.ts tests/motion.test.ts \
  public/team/founder-one-placeholder.svg \
  public/team/founder-two-placeholder.svg
git commit -m "feat(site): add animated service boxes"
```

- [ ] **Step 4: Prepare deployment handoff**

Push `features/yoshi_0000_animate_service_boxes` and open a PR against `main`
only after local verification passes. Do not merge without explicit approval.
