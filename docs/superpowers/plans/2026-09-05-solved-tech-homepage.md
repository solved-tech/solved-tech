# Solved Tech Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive English-language landing page that helps UK SMEs understand Solved Tech and choose an easy way to make contact.

**Architecture:** A framework-free Vite application renders semantic HTML from typed content data. CSS owns layout and visual expression; a small TypeScript enhancement layer handles progressive scroll reveals, navigation state, and safe contact-preview behaviour.

**Tech Stack:** Node.js 25.9.0, npm 11.12.1, Vite 8.2.2, TypeScript 7.0.2, Vitest 4.1.11, HTML5, CSS, TypeScript

## Global Constraints

- The public website copy is English and written for small and medium-sized businesses in the UK.
- Use dark grey and white with orange only for primary actions and meaningful highlights.
- Copy must be terse, human, calm, specific, and understandable without technical knowledge.
- Do not invent clients, testimonials, metrics, awards, phone numbers, email addresses, or booking destinations.
- Avoid vague superlatives, “revolutionary” claims, formulaic slogans, excessive em dashes, generic gradients, rounded-card walls, ornamental icons, and filler.
- Motion must be progressive enhancement and respect `prefers-reduced-motion`.
- Contact priority is call, WhatsApp, voice note, then quote.
- Current scope is one responsive homepage with no backend or additional routes.

---

### Task 1: Toolchain and Typed Content

**Files:**
- Create: `.gitignore`
- Create: `.nvmrc`
- Create: `package.json`
- Create: `package-lock.json`
- Create: `tsconfig.json`
- Create: `src/content.ts`
- Test: `tests/content.test.ts`

**Interfaces:**
- Produces: `siteContent: SiteContent`, `contactConfig: ContactConfig`
- Produces: `getContactState(config: ContactConfig): "ready" | "preview"`

- [ ] **Step 1: Add the exact development toolchain**

Create `package.json` with ESM mode and scripts for `dev`, `build`, `preview`,
`test`, and `check`. Install exact versions with:

```bash
npm install --save-dev --save-exact vite@8.2.2 typescript@7.0.2 vitest@4.1.11
```

Use `.nvmrc` value `25.9.0`, ignore `node_modules`, `dist`, coverage output,
macOS metadata, local environment files, `.superpowers/`, and `.notes/`.
Configure TypeScript with `strict`, `noEmit`, `moduleResolution: "Bundler"`,
and DOM libraries.

- [ ] **Step 2: Write the failing content tests**

```ts
import { describe, expect, it } from "vitest";
import { contactConfig, getContactState, siteContent } from "../src/content";

describe("site content", () => {
  it("keeps the five service groups in outcome order", () => {
    expect(siteContent.services.map(({ title }) => title)).toEqual([
      "Be easier to find",
      "Turn visits into business",
      "Build what customers need",
      "Make your systems cooperate",
      "Give repetitive work away",
    ]);
  });

  it("keeps contact methods in the approved priority", () => {
    expect(siteContent.contactMethods.map(({ id }) => id)).toEqual([
      "call",
      "whatsapp",
      "voice",
      "quote",
    ]);
  });

  it("uses preview mode when production destinations are absent", () => {
    expect(getContactState(contactConfig)).toBe("preview");
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm test -- --run tests/content.test.ts`

Expected: FAIL because `src/content.ts` does not exist.

- [ ] **Step 4: Implement typed content and contact configuration**

Define these public types:

```ts
export type ContactMethodId = "call" | "whatsapp" | "voice" | "quote";
export interface ContactConfig {
  phone: string | null;
  whatsapp: string | null;
  quoteEmail: string | null;
}
export interface SiteContent {
  services: Array<{ title: string; summary: string; detail: string }>;
  contactMethods: Array<{
    id: ContactMethodId;
    label: string;
    note: string;
  }>;
}
export const getContactState = (config: ContactConfig) =>
  config.phone && config.whatsapp && config.quoteEmail ? "ready" : "preview";
```

Add the complete approved service groups and contact order. Keep all production
destinations `null` so no false contact details ship.

- [ ] **Step 5: Run focused tests and type checks**

Run: `npm test -- --run tests/content.test.ts && npm run check`

Expected: 3 tests pass and TypeScript exits with code 0.

- [ ] **Step 6: Commit**

```bash
git add .gitignore .nvmrc package.json package-lock.json tsconfig.json src/content.ts tests/content.test.ts
git commit -m "feat(content): define homepage messaging"
```

---

### Task 2: Semantic Page Rendering

**Files:**
- Create: `index.html`
- Create: `src/render.ts`
- Create: `src/main.ts`
- Test: `tests/render.test.ts`

**Interfaces:**
- Consumes: `siteContent`, `contactConfig`, and `getContactState`
- Produces: `renderHomepage(content: SiteContent, config: ContactConfig): string`
- Produces: DOM landmarks with IDs `top`, `services`, `approach`, and `contact`

- [ ] **Step 1: Write failing renderer tests**

```ts
import { describe, expect, it } from "vitest";
import { contactConfig, siteContent } from "../src/content";
import { renderHomepage } from "../src/render";

describe("homepage renderer", () => {
  const html = renderHomepage(siteContent, contactConfig);

  it("renders one main heading and every service", () => {
    expect(html.match(/<h1/g)).toHaveLength(1);
    siteContent.services.forEach(({ title }) => expect(html).toContain(title));
  });

  it("renders semantic navigation and contact landmarks", () => {
    expect(html).toContain("<nav");
    expect(html).toContain('<main id="main-content">');
    expect(html).toContain('<section class="contact');
  });

  it("does not emit fabricated contact links in preview mode", () => {
    expect(html).not.toContain("tel:");
    expect(html).not.toContain("wa.me");
    expect(html).not.toContain("mailto:");
    expect(html).toContain("Contact details are being connected");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- --run tests/render.test.ts`

Expected: FAIL because `src/render.ts` does not exist.

- [ ] **Step 3: Build the semantic HTML shell**

Create `index.html` with:

```html
<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Solved Tech helps UK businesses attract customers, build useful digital products and remove repetitive work." />
    <title>Solved Tech — Technology that solves the real problem</title>
  </head>
  <body>
    <a class="skip-link" href="#main-content">Skip to content</a>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- [ ] **Step 4: Implement the homepage renderer**

Render:

- A compact header with wordmark, Services, Approach, and Contact links.
- Hero headline: “Technology should solve the next business problem. Not create another one.”
- Supporting copy for UK businesses and primary “Book a call” action.
- Problem statement: “Your business does not need more digital noise.”
- Five sequential service rows with plain-language descriptions.
- A three-step approach: find the blockage, build what changes it, show what improved.
- A trust statement that promises clarity without inventing proof.
- Contact options in the approved order.
- A minimal footer with the current year.

Escape interpolated text with a local `escapeHtml(value: string): string`
function. In preview mode, render contact controls as buttons with
`data-contact-preview` and an honest configuration note. When configured,
produce `tel:`, `https://wa.me/`, and `mailto:` destinations.

- [ ] **Step 5: Mount the page**

In `src/main.ts`, import the stylesheet and render into `#app`. Throw a clear
error if the mount element is missing.

- [ ] **Step 6: Run focused tests and type checks**

Run: `npm test -- --run tests/render.test.ts && npm run check`

Expected: 3 renderer tests pass and TypeScript exits with code 0.

- [ ] **Step 7: Commit**

```bash
git add index.html src/render.ts src/main.ts tests/render.test.ts
git commit -m "feat(page): render semantic landing page"
```

---

### Task 3: Immersive Visual System and Motion

**Files:**
- Create: `src/styles.css`
- Modify: `src/main.ts`
- Test: `tests/motion.test.ts`

**Interfaces:**
- Consumes: elements marked with `[data-reveal]` and `[data-contact-preview]`
- Produces: `setupRevealMotion(root: ParentNode, reducedMotion: boolean): void`
- Produces: `setupContactPreview(root: ParentNode): void`

- [ ] **Step 1: Write failing enhancement tests**

```ts
import { describe, expect, it, vi } from "vitest";
import { setupRevealMotion } from "../src/main";

describe("reveal motion", () => {
  it("reveals immediately when reduced motion is preferred", () => {
    const item = { classList: { add: vi.fn() } };
    const root = {
      querySelectorAll: vi.fn(() => [item]),
    } as unknown as ParentNode;

    setupRevealMotion(root, true);

    expect(item.classList.add).toHaveBeenCalledWith("is-visible");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- --run tests/motion.test.ts`

Expected: FAIL because `setupRevealMotion` is not exported.

- [ ] **Step 3: Build the visual system**

Create CSS custom properties for charcoal surfaces, warm white text, muted
greys, and one restrained orange accent. Implement:

- Fluid typography with `clamp()`.
- A full-height hero with a quiet orange progress line.
- Alternating open layouts rather than a wall of cards.
- Sticky section labels on wide screens.
- Large numbered service rows with subtle border transitions.
- A contact rail that makes the four choices easy to scan.
- Visible focus states, 44px minimum targets, and responsive breakpoints.
- `prefers-reduced-motion` and `prefers-contrast` adjustments.

Do not use gradients, shadows, stock imagery, decorative icon sets, or
excessive border radii.

- [ ] **Step 4: Add progressive enhancement**

Export `setupRevealMotion`. When reduced motion is active, reveal everything
immediately. Otherwise use one `IntersectionObserver` with a `0.18` threshold,
add `is-visible`, and unobserve completed elements.

Add a scroll-progress custom property and contact-preview disclosure. Preview
buttons must explain that production contact destinations are not configured;
they must not imitate a successful call, message, or quote submission.

- [ ] **Step 5: Run tests, checks, and build**

Run: `npm test -- --run tests/motion.test.ts && npm run check && npm run build`

Expected: motion test passes, TypeScript exits with code 0, and Vite emits a
successful production build in `dist/`.

- [ ] **Step 6: Commit**

```bash
git add src/styles.css src/main.ts tests/motion.test.ts
git commit -m "feat(ui): add immersive scroll experience"
```

---

### Task 4: Quality and Browser Verification

**Files:**
- Create: `README.md`
- Modify only if verification finds defects: `index.html`, `src/content.ts`,
  `src/render.ts`, `src/main.ts`, `src/styles.css`, or tests

**Interfaces:**
- Consumes: production site served by `npm run dev -- --host 127.0.0.1`
- Produces: a documented, reproducible local workflow

- [ ] **Step 1: Run the full automated gate**

Run: `npm test -- --run && npm run check && npm run build`

Expected: all tests pass, TypeScript exits with code 0, and Vite reports a
successful production build.

- [ ] **Step 2: Run dependency and secret checks**

Run the available Snyk software-composition and secret scans against the
repository. Resolve critical or high findings before continuing; record lower
severity findings accurately.

- [ ] **Step 3: Verify in a real browser**

Start the local Vite server and check:

- 1440px desktop and 390px mobile layouts.
- English copy and service completeness.
- Navigation, keyboard focus, and skip link.
- Scroll reveals and reduced-motion behaviour.
- Contact order and honest preview behaviour.
- No browser console errors or horizontal overflow.
- No visual AI conventions prohibited by the design.

- [ ] **Step 4: Add concise project documentation**

Document requirements, `npm install`, `npm run dev`, `npm test`, `npm run
check`, `npm run build`, the contact configuration location, and the fact that
production contact destinations must be supplied before deployment.

- [ ] **Step 5: Re-run the full gate**

Run: `npm test -- --run && npm run check && npm run build && git diff --check`

Expected: all tests pass, build succeeds, and Git reports no whitespace errors.

- [ ] **Step 6: Commit**

```bash
git add README.md index.html src tests package.json package-lock.json tsconfig.json .gitignore .nvmrc
git commit -m "docs(site): document local workflow"
```
