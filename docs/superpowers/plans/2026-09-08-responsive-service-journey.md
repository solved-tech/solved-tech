# Responsive Service Journey Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore immediate mobile touch scrolling, reveal each service diagram as it enters view, clarify the service-row hierarchy, and add a seven-node service pipeline to the hero.

**Architecture:** Keep motion CSS-first and use the existing `IntersectionObserver` for one-shot artwork reveals. Rebuild each service article as header, two-column body, and dedicated contact link; render the hero pipeline as one accessible decorative SVG. Restrict smooth scrolling and pointer-follow effects to fine-pointer devices so mobile scrolling remains native.

**Tech Stack:** TypeScript 7.0.2, semantic HTML, CSS Grid, inline SVG, IntersectionObserver, Vitest 4.1.11

## Global Constraints

- Work locally only; do not push or create a pull request.
- Preserve service copy, order, capabilities, and existing service SVG geometry.
- Service bodies use diagram left at 68 percent and `We provide` right at 32 percent from 48rem.
- Mobile service order is header, diagram, capabilities, contact button.
- Service diagrams animate once when their artwork enters the viewport.
- The hero pipeline order is AI, Customers, Websites, Web apps, Mobile apps, Desktop apps, Custom systems.
- `What do you need?` and `What happens next` remain on one line without horizontal overflow.
- Reduced-motion mode shows all content without movement.

## Files and Repository

- Repository: `/Users/mba42/workspace/solved-tech`
- Edit: `src/main.ts`
- Edit: `src/render.ts`
- Edit: `src/styles.css`
- Edit: `tests/motion.test.ts`
- Edit: `tests/render.test.ts`
- Add: `docs/superpowers/plans/2026-09-08-responsive-service-journey.md`

## Approach

1. Remove mobile scroll interpolation and coarse-pointer hero tracking.
2. Observe each service artwork independently for one-shot entrance motion.
3. Rebuild service rows as full-width header, 68/32 body, and CTA.
4. Keep the two requested section labels on one responsive line.
5. Add and animate the seven-node hero pipeline.
6. Run focused tests, the full local gate, and responsive browser checks.

## Tests

- Update motion tests for coarse-pointer behaviour.
- Update renderer tests for artwork reveal targets, service hierarchy, heading
  copy, and hero pipeline placement.
- Run all Vitest tests, TypeScript, Vite build, and whitespace checks.
- Verify touch scrolling and overflow at 390 by 844 pixels.
- Verify service and pipeline layout at 1920 by 1080 pixels.

## Risks and Open Questions

- Risk: seven pipeline labels have limited mobile space; use short approved
  labels and verify at 390 pixels.
- Risk: global smooth scrolling can return through selector precedence; verify
  computed mobile scroll behaviour in Chrome.
- Open questions: none.

## Out of Scope

- Service copy, order, capability lists, and existing service SVG geometry.
- Other homepage sections, contact details, deployment, pushing, and pull
  requests.

---

### Task 1: Restore Native Mobile Scrolling and Artwork Reveals

**Files:**
- Modify: `tests/motion.test.ts`
- Modify: `tests/render.test.ts`
- Modify: `src/main.ts`
- Modify: `src/render.ts`
- Modify: `src/styles.css`

**Interfaces:**
- Changes: `setupHeroInteraction(root, reducedMotion, finePointer = true): void`
- Consumes: existing `setupRevealMotion(root, reducedMotion): void`
- Produces: `.service-box__artwork.is-visible` as the one-shot diagram trigger

- [ ] **Step 1: Add failing motion and renderer tests**

Add to `tests/motion.test.ts`:

```ts
it("skips pointer tracking for coarse pointers", () => {
  const addEventListener = vi.fn();
  const root = {
    querySelector: vi.fn(() => ({ addEventListener })),
  } as unknown as ParentNode;

  setupHeroInteraction(root, false, false);

  expect(addEventListener).not.toHaveBeenCalled();
});
```

Add to `tests/render.test.ts`:

```ts
it("reveals each service artwork when the diagram reaches the viewport", () => {
  expect(
    html.match(/class="service-box__artwork" data-reveal/g),
  ).toHaveLength(5);
});
```

- [ ] **Step 2: Run the focused tests and verify they fail**

```bash
npm test -- --run tests/motion.test.ts tests/render.test.ts
```

Expected: the coarse-pointer assertion fails because pointer listeners are
registered, and the renderer finds no artwork-level reveal targets.

- [ ] **Step 3: Gate hero pointer motion by pointer type**

Change `setupHeroInteraction` in `src/main.ts` to:

```ts
export const setupHeroInteraction = (
  root: ParentNode,
  reducedMotion: boolean,
  finePointer = true,
): void => {
  const hero = root.querySelector<HTMLElement>(".hero");

  if (!hero || reducedMotion || !finePointer) {
    return;
  }

  const update = (event: PointerEvent): void => {
    const bounds = hero.getBoundingClientRect();

    if (bounds.width <= 0 || bounds.height <= 0) {
      return;
    }

    const x = Math.max(
      -0.5,
      Math.min(0.5, (event.clientX - bounds.left) / bounds.width - 0.5),
    );
    const y = Math.max(
      -0.5,
      Math.min(0.5, (event.clientY - bounds.top) / bounds.height - 0.5),
    );

    hero.style.setProperty("--hero-shift-x", `${(x * 36).toFixed(2)}px`);
    hero.style.setProperty("--hero-shift-y", `${(y * 36).toFixed(2)}px`);
  };

  const reset = (): void => {
    hero.style.setProperty("--hero-shift-x", "0px");
    hero.style.setProperty("--hero-shift-y", "0px");
  };

  hero.addEventListener("pointermove", update, { passive: true });
  hero.addEventListener("pointerdown", update, { passive: true });
  hero.addEventListener("pointerleave", reset);
};
```

In `start`, call it with:

```ts
const finePointer = view.matchMedia("(pointer: fine)").matches;

stagger(app);
setupHeaderOffset(view);
setupRevealMotion(app, reducedMotion);
setupHeroInteraction(app, reducedMotion, finePointer);
setupMobileMenu(app);
setupScrollProgress(view);
```

- [ ] **Step 4: Make immediate scrolling the mobile default**

Replace the `html` scroll rule in `src/styles.css` with:

```css
html {
  scroll-behavior: auto;
  scroll-padding-top: calc(var(--header-height) + 1.5rem);
  -webkit-text-size-adjust: 100%;
}

@media (pointer: fine) {
  html {
    scroll-behavior: smooth;
  }
}
```

- [ ] **Step 5: Move diagram animation triggers to the artwork**

Add `data-reveal` directly to the rendered artwork:

```html
<span class="service-box__artwork" data-reveal>
  ${renderServiceArt(id)}
</span>
```

Replace artwork entrance selectors in `src/styles.css`:

```css
.has-enhancement
  .service-box__artwork:not(.is-visible)
  .service-art {
  opacity: 0;
  transform: translateY(12px);
}

.service-box__artwork.is-visible .service-art {
  animation: art-enter 620ms var(--ease) both;
}

.service-box__artwork.is-visible .art-detail {
  animation: art-detail-enter 420ms var(--ease) both;
}

.service-box__artwork.is-visible .art-detail--two {
  animation-delay: 120ms;
}

.service-box__artwork.is-visible .art-detail--three {
  animation-delay: 240ms;
}

.service-box__artwork.is-visible .art-detail--four {
  animation-delay: 360ms;
}

.service-box__artwork.is-visible .art-data-route {
  animation: art-flow 700ms var(--ease) both 120ms;
}

.service-box__artwork.is-visible .art-data-route--arrow {
  animation: art-detail-enter 420ms var(--ease) both 400ms;
}

.service-box__artwork.is-visible .art-packet--x {
  animation: art-packet-x 480ms var(--ease) both 180ms;
}

.service-box__artwork.is-visible .art-packet--y {
  animation: art-packet-y 480ms var(--ease) both 180ms;
}

.service-box__artwork.is-visible .art-packet--late {
  animation-delay: 240ms;
}
```

- [ ] **Step 6: Run focused tests and commit**

```bash
npm test -- --run tests/motion.test.ts tests/render.test.ts
git add tests/motion.test.ts tests/render.test.ts src/main.ts src/render.ts \
  src/styles.css
git commit -m "fix(site): keep mobile scrolling responsive"
```

Expected: focused tests pass.

---

### Task 2: Rebuild the Service-Row Hierarchy

**Files:**
- Modify: `tests/render.test.ts`
- Modify: `src/render.ts`
- Modify: `src/styles.css`

**Interfaces:**
- Produces: `.service-box__header`, `.service-box__heading`, and `.service-box__body`
- Changes: `.service-box__cta` from nested text to an anchor targeting `#contact`
- Removes: `.service-box__link`

- [ ] **Step 1: Add failing structure tests**

Add to `tests/render.test.ts`:

```ts
it("uses a full header, diagram-first body, and dedicated CTA per service", () => {
  expect(html.match(/class="service-box__header"/g)).toHaveLength(5);
  expect(html.match(/class="service-box__body"/g)).toHaveLength(5);
  expect(
    html.match(/class="service-box__cta" href="#contact"/g),
  ).toHaveLength(5);
  expect(
    html.match(
      /<div class="service-box__body">\s*<span class="service-box__artwork" data-reveal>[\s\S]*?<div class="service-box__provides">/g,
    ),
  ).toHaveLength(5);
  expect(html).not.toContain('class="service-box__link"');
});

it("keeps the two section labels on a single semantic line", () => {
  expect(html).toContain(
    '<h2 id="services-heading" data-reveal>What do you need?</h2>',
  );
  expect(html).toContain("<p>What happens next</p>");
});
```

- [ ] **Step 2: Run the renderer test and verify it fails**

```bash
npm test -- --run tests/render.test.ts
```

Expected: no service header/body regions or dedicated CTA anchors exist.

- [ ] **Step 3: Render the approved service structure**

Replace each service article template in `src/render.ts` with:

```ts
<article class="service-box service-box--${escapeHtml(id)}" data-reveal>
  <header class="service-box__header">
    <div class="service-box__heading">
      <span class="service-box__number">${String(index + 1).padStart(2, "0")}</span>
      <strong>${escapeHtml(question)}</strong>
    </div>
    <span class="service-box__product">${escapeHtml(title)}</span>
    <p>${escapeHtml(answer)}</p>
  </header>
  <div class="service-box__body">
    <span class="service-box__artwork" data-reveal>${renderServiceArt(id)}</span>
    ${renderCapabilities(provides)}
  </div>
  <a class="service-box__cta" href="#contact">
    Talk to us <span aria-hidden="true">→</span>
  </a>
</article>
```

- [ ] **Step 4: Replace the service layout styles**

Use these shared rules in `src/styles.css`, retaining the existing SVG
appearance and keyframes:

```css
.service-box {
  min-width: 0;
  overflow: hidden;
  padding: clamp(1.25rem, 3vw, 2rem);
  background-color: rgb(18 17 16 / 0.94);
  transition: background-color 300ms var(--ease);
}

.service-box__header {
  display: grid;
  gap: 0.35rem;
}

.service-box__heading {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 1rem;
  align-items: baseline;
}

.service-box__number {
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: var(--type-small);
  font-variant-numeric: tabular-nums;
}

.service-box strong {
  font-size: clamp(1.3rem, 1.05rem + 1.1vw, 2rem);
  font-weight: 600;
  line-height: 1.12;
}

.service-box__product,
.service-box__header > p {
  margin-inline-start: calc(1rem + 2ch);
}

.service-box__product {
  color: var(--ink);
  font-family: var(--font-display);
  font-size: var(--type-heading);
  line-height: 1.25;
}

.service-box__header > p {
  max-width: 52ch;
  color: var(--ink-muted);
  font-size: var(--type-small);
  line-height: 1.5;
}

.service-box__body {
  display: grid;
  gap: 1.5rem;
  margin-block-start: clamp(1.5rem, 3vw, 2.5rem);
  padding-block: clamp(1.25rem, 2.5vw, 2rem);
  border-block: 1px solid var(--line);
}

.service-box__artwork {
  display: block;
  align-self: center;
  width: 100%;
}

.service-box__provides {
  padding-block-start: 1rem;
  border-block-start: 1px solid var(--line);
}

.service-box__cta {
  display: inline-flex;
  gap: 1.5rem;
  align-items: center;
  justify-content: space-between;
  width: fit-content;
  min-width: min(100%, 12rem);
  min-height: 48px;
  margin-block-start: 1.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--line-strong);
  color: var(--ink);
  font-family: var(--font-mono);
  font-size: var(--type-small);
  letter-spacing: 0.04em;
  text-decoration: none;
  transition:
    border-color 240ms var(--ease),
    color 240ms var(--ease);
}

.service-box__cta:hover,
.service-box__cta:focus-visible {
  border-color: var(--accent);
  color: var(--accent);
}

@media (min-width: 48rem) {
  .service-box__body {
    grid-template-columns: minmax(0, 2.125fr) minmax(13rem, 1fr);
    gap: clamp(1.5rem, 3vw, 3rem);
  }

  .service-box__provides {
    padding-block-start: 0;
    padding-inline-start: clamp(1.25rem, 2vw, 2rem);
    border-block-start: 0;
    border-inline-start: 1px solid var(--line);
  }

  .service-box__capabilities {
    grid-template-columns: 1fr;
  }
}
```

Remove `.service-box__link`, `.service-box__copy`, and their responsive
three-column grid rules.

- [ ] **Step 5: Keep section labels on one line**

Add:

```css
.services > h2 {
  max-width: none;
  font-size: clamp(1.65rem, 8vw, 3.5rem);
  white-space: nowrap;
}

.journey__heading > p {
  white-space: nowrap;
}
```

- [ ] **Step 6: Run the renderer test and commit**

```bash
npm test -- --run tests/render.test.ts
git add tests/render.test.ts src/render.ts src/styles.css
git commit -m "refactor(site): clarify service row hierarchy"
```

Expected: renderer tests pass.

---

### Task 3: Add the Hero Service Pipeline

**Files:**
- Modify: `tests/render.test.ts`
- Modify: `src/render.ts`
- Modify: `src/styles.css`

**Interfaces:**
- Produces: `renderHeroPipeline(): string`
- Produces: `.hero__pipeline` between the hero description and actions
- Produces: seven `.hero-pipeline__node` groups and one moving signal

- [ ] **Step 1: Add the failing pipeline renderer test**

Add to `tests/render.test.ts`:

```ts
it("places the seven-service pipeline above the hero actions", () => {
  const pipeline = html.indexOf('class="hero__pipeline"');
  const actions = html.indexOf('class="hero__actions"');

  expect(pipeline).toBeGreaterThan(html.indexOf("Bring us the problem."));
  expect(pipeline).toBeLessThan(actions);
  expect(html.match(/class="hero-pipeline__node/g)).toHaveLength(7);
  expect(html).toContain("hero-pipeline__node--ai");
  [
    "AI",
    "Customers",
    "Websites",
    "Web apps",
    "Mobile apps",
    "Desktop apps",
    "Custom systems",
  ].forEach((label) => expect(html).toContain(`>${label}</text>`));
});
```

- [ ] **Step 2: Run the renderer test and verify it fails**

```bash
npm test -- --run tests/render.test.ts
```

Expected: `hero__pipeline` is absent.

- [ ] **Step 3: Add the complete pipeline renderer**

Add before `renderHomepage` in `src/render.ts`:

```ts
const pipelinePath =
  "M80 140C80 58 178 25 320 28C478 31 560 76 560 140C560 218 470 250 320 252C164 254 80 218 80 140Z";

const renderHeroPipeline = (): string => `
  <div class="hero__pipeline" data-reveal aria-hidden="true">
    <svg viewBox="0 0 640 300" focusable="false">
      <path class="hero-pipeline__route" d="${pipelinePath}" />
      <circle class="hero-pipeline__signal" r="5" />

      <g class="hero-pipeline__node hero-pipeline__node--ai" transform="translate(80 140)" style="--pipeline-delay: 0s">
        <circle class="hero-pipeline__node-ring" r="25" />
        <path class="hero-pipeline__icon" d="M-9-7H9V8H-9ZM-5-12V-7M5-12V-7M-4-1h1M3-1h1M-4 4h8" />
        <text y="43">AI</text>
      </g>

      <g class="hero-pipeline__node" transform="translate(150 58)" style="--pipeline-delay: 1.28s">
        <circle class="hero-pipeline__node-ring" r="25" />
        <circle class="hero-pipeline__icon" r="10" />
        <circle class="hero-pipeline__icon" r="5" />
        <path class="hero-pipeline__icon" d="M0-14V-9M0 9V14M-14 0H-9M9 0H14" />
        <text y="43">Customers</text>
      </g>

      <g class="hero-pipeline__node" transform="translate(280 36)" style="--pipeline-delay: 2.56s">
        <circle class="hero-pipeline__node-ring" r="25" />
        <rect class="hero-pipeline__icon" x="-13" y="-10" width="26" height="20" rx="1" />
        <path class="hero-pipeline__icon" d="M-13-4H13M-9-7h1M-5-7h1" />
        <text y="43">Websites</text>
      </g>

      <g class="hero-pipeline__node" transform="translate(420 54)" style="--pipeline-delay: 3.84s">
        <circle class="hero-pipeline__node-ring" r="25" />
        <rect class="hero-pipeline__icon" x="-13" y="-11" width="26" height="22" rx="1" />
        <path class="hero-pipeline__icon" d="M-13-5H13M-8 0h6v6h-6M2 0h6M2 5h6" />
        <text y="43">Web apps</text>
      </g>

      <g class="hero-pipeline__node" transform="translate(552 118)" style="--pipeline-delay: 5.12s">
        <circle class="hero-pipeline__node-ring" r="25" />
        <rect class="hero-pipeline__icon" x="-8" y="-14" width="16" height="28" rx="2" />
        <path class="hero-pipeline__icon" d="M-3-10H3M-2 10H2" />
        <text y="43">Mobile apps</text>
      </g>

      <g class="hero-pipeline__node" transform="translate(500 220)" style="--pipeline-delay: 6.4s">
        <circle class="hero-pipeline__node-ring" r="25" />
        <rect class="hero-pipeline__icon" x="-14" y="-11" width="28" height="19" rx="1" />
        <path class="hero-pipeline__icon" d="M0 8V13M-7 13H7" />
        <text y="43">Desktop apps</text>
      </g>

      <g class="hero-pipeline__node" transform="translate(280 246)" style="--pipeline-delay: 7.68s">
        <circle class="hero-pipeline__node-ring" r="25" />
        <path class="hero-pipeline__icon" d="M-9-6L8-10M-9-6L-2 10M8-10L10 7M-2 10L10 7" />
        <circle class="hero-pipeline__icon hero-pipeline__icon-dot" cx="-9" cy="-6" r="3" />
        <circle class="hero-pipeline__icon hero-pipeline__icon-dot" cx="8" cy="-10" r="3" />
        <circle class="hero-pipeline__icon hero-pipeline__icon-dot" cx="-2" cy="10" r="3" />
        <circle class="hero-pipeline__icon hero-pipeline__icon-dot" cx="10" cy="7" r="3" />
        <text y="43">Custom systems</text>
      </g>
    </svg>
  </div>`;
```

Insert it after the hero description:

```ts
<p data-reveal>Bring us the problem. We will turn it into something useful.</p>
${renderHeroPipeline()}
${renderContactActions(config, "hero__actions")}
```

- [ ] **Step 4: Style and animate the pipeline**

Add to the hero section of `src/styles.css`:

```css
.hero__pipeline {
  width: min(100%, 42rem);
  padding-block: 0.75rem;
  border-block: 1px solid var(--line);
}

.hero__pipeline svg {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}

.hero-pipeline__route,
.hero-pipeline__node-ring,
.hero-pipeline__icon {
  fill: none;
  vector-effect: non-scaling-stroke;
}

.hero-pipeline__route {
  stroke: var(--line-strong);
  stroke-width: 1.25;
  stroke-dasharray: 3 7;
}

.hero-pipeline__node {
  color: var(--ink-muted);
  animation: pipeline-node-active 9s linear infinite;
  animation-delay: var(--pipeline-delay);
}

.hero-pipeline__node-ring {
  fill: rgb(18 17 16 / 0.92);
  stroke: currentColor;
  stroke-width: 1.25;
}

.hero-pipeline__icon {
  stroke: currentColor;
  stroke-width: 1.35;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.hero-pipeline__icon-dot {
  fill: var(--surface-deep);
}

.hero-pipeline__node text {
  fill: currentColor;
  font-family: var(--font-mono);
  font-size: 13px;
  text-anchor: middle;
}

.hero-pipeline__signal {
  offset-path: path("M80 140C80 58 178 25 320 28C478 31 560 76 560 140C560 218 470 250 320 252C164 254 80 218 80 140Z");
  offset-distance: 0%;
  fill: var(--accent);
  filter: drop-shadow(0 0 5px rgb(232 98 42 / 0.5));
  animation: pipeline-signal-travel 9s linear infinite;
}

@keyframes pipeline-signal-travel {
  to {
    offset-distance: 100%;
  }
}

@keyframes pipeline-node-active {
  0%,
  12% {
    color: var(--accent);
  }

  18%,
  100% {
    color: var(--ink-muted);
  }
}

@media (max-width: 30rem) {
  .hero__pipeline {
    width: calc(100% + 0.75rem);
    margin-inline-end: -0.75rem;
  }

  .hero-pipeline__node text {
    font-size: 17px;
  }
}
```

Inside the existing reduced-motion query, add:

```css
.hero-pipeline__signal,
.hero-pipeline__node {
  animation: none;
}

.hero-pipeline__signal {
  display: none;
}
```

- [ ] **Step 5: Run focused tests and commit**

```bash
npm test -- --run tests/render.test.ts tests/motion.test.ts
git add tests/render.test.ts src/render.ts src/styles.css
git commit -m "feat(site): add hero service pipeline"
```

Expected: focused tests pass.

---

### Task 4: Verify Responsive Behaviour

**Files:**
- Verify: `src/main.ts`
- Verify: `src/render.ts`
- Verify: `src/styles.css`
- Verify: `tests/motion.test.ts`
- Verify: `tests/render.test.ts`

**Interfaces:**
- Consumes: completed touch, service-row, heading, and pipeline changes
- Produces: verified local build and responsive browser evidence

- [ ] **Step 1: Run the complete local gate**

```bash
npm test -- --run &&
npm run check &&
npm run build &&
git diff --check
```

Expected: all test files pass, TypeScript reports no errors, Vite builds, and
the whitespace check prints nothing.

- [ ] **Step 2: Verify mobile behaviour**

At `http://127.0.0.1:5178/solved-tech/`, emulate a touch-enabled viewport of
390 by 844 pixels and verify:

- Repeated 10-pixel scroll steps total 300 pixels.
- `document.documentElement.scrollWidth === window.innerWidth`.
- `What do you need?` and `What happens next` each remain on one line.
- Each `.service-box__artwork` gains `is-visible` only when its diagram enters
  the viewport.
- The service body stacks diagram before capabilities.
- The hero pipeline and contact buttons fit without horizontal overflow.

- [ ] **Step 3: Verify desktop behaviour**

At 1920 by 1080 pixels, verify:

- The service header spans the article.
- The body places the diagram left and `We provide` right at 68/32.
- The contact action sits below the body.
- The pipeline appears between hero description and actions.
- All seven pipeline labels are legible.

- [ ] **Step 4: Confirm repository state**

```bash
git status --short
git log -4 --oneline
```

Expected: no uncommitted changes and the three implementation commits appear
above the design and plan history. Do not push or open a pull request.
