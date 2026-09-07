# Client Journey Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic three-step process with a four-moment visual journey that explains what happens after a client calls.

**Architecture:** `src/render.ts` keeps the section as static semantic HTML and renders an ordered list with decorative inline SVG signals. `src/styles.css` owns the horizontal-to-vertical route, one-time reveal motion, and reduced-motion final state; the existing reveal observer remains unchanged.

**Tech Stack:** TypeScript 7.0.2, semantic HTML, CSS Grid, CSS keyframes, inline SVG, Vitest 4.1.11

## Global Constraints

- Use the exact approved heading and four journey moments from `docs/superpowers/specs/2026-09-07-client-journey-design.md`.
- Add no dependency, content model, JavaScript controller, form, pricing, delivery promise, or guarantee.
- The route and signals are decorative and hidden from assistive technology.
- The ordered list remains complete without JavaScript.
- Motion lasts no more than 900 milliseconds and respects `prefers-reduced-motion`.
- The layout becomes vertical below 52rem and must not create horizontal overflow.

---

### Task 1: Replace the Process with the Client Journey

**Files:**
- Modify: `tests/render.test.ts`
- Modify: `src/render.ts`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: the existing `data-reveal` enhancement contract
- Produces: `.journey__moments` ordered list containing four `.journey__moment` elements
- Produces: four decorative `.journey__signal` inline SVGs
- Removes: the rendered copy `Three steps. No fog.`

- [ ] **Step 1: Write the failing renderer test**

Add this test inside `describe("homepage renderer")`:

```ts
it("explains what happens after a client calls", () => {
  expect(html).toContain("What happens next");
  expect(html).toContain("One call. Then we make it simple.");
  expect(html.match(/class="journey__moment"/g)).toHaveLength(4);
  expect(html.match(/class="journey__signal"/g)).toHaveLength(4);
  expect(html).toContain("Tell us what’s stuck.");
  expect(html).toContain("No polished brief needed.");
  expect(html).toContain("Get a clear next move.");
  expect(html).toContain("We explain the simplest useful route.");
  expect(html).toContain("See something real, early.");
  expect(html).toContain("React to progress, not paperwork.");
  expect(html).toContain("Move forward with confidence.");
  expect(html).toContain("We launch it with you.");
  expect(html).not.toContain("Three steps. No fog.");
});
```

- [ ] **Step 2: Run the renderer test to verify failure**

Run:

```bash
npm test -- --run tests/render.test.ts
```

Expected: FAIL because the journey classes and approved copy are absent.

- [ ] **Step 3: Replace the approach markup**

Replace the existing `approach` section in `src/render.ts` with:

```html
<section id="approach" class="journey" aria-labelledby="approach-heading">
  <div class="journey__heading" data-reveal>
    <p>What happens next</p>
    <h2 id="approach-heading">One call. Then we make it simple.</h2>
  </div>
  <ol class="journey__moments" data-reveal>
    <li class="journey__moment">
      <span class="journey__number">01</span>
      <span class="journey__signal" aria-hidden="true">
        <svg viewBox="0 0 48 48"><path d="M12 29c6-10 14-16 24-18M12 29h9M12 29v-9" /><circle cx="36" cy="11" r="3" /></svg>
      </span>
      <div><h3>Tell us what’s stuck.</h3><p>No polished brief needed.</p></div>
    </li>
    <li class="journey__moment">
      <span class="journey__number">02</span>
      <span class="journey__signal" aria-hidden="true">
        <svg viewBox="0 0 48 48"><path d="M9 24h27M29 16l8 8-8 8" /></svg>
      </span>
      <div><h3>Get a clear next move.</h3><p>We explain the simplest useful route.</p></div>
    </li>
    <li class="journey__moment">
      <span class="journey__number">03</span>
      <span class="journey__signal" aria-hidden="true">
        <svg viewBox="0 0 48 48"><rect x="8" y="10" width="32" height="24" rx="2" /><path d="M17 40h14M24 34v6M13 16h22" /></svg>
      </span>
      <div><h3>See something real, early.</h3><p>React to progress, not paperwork.</p></div>
    </li>
    <li class="journey__moment">
      <span class="journey__number">04</span>
      <span class="journey__signal" aria-hidden="true">
        <svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="16" /><path d="m16 24 6 6 11-13" /></svg>
      </span>
      <div><h3>Move forward with confidence.</h3><p>We launch it with you.</p></div>
    </li>
  </ol>
</section>
```

- [ ] **Step 4: Replace the approach styles**

Remove the `.approach` selectors from the sticky-section group and delete the
old `.approach ol`, `.approach li`, and `.approach h3` rules. Add:

```css
.journey {
  display: grid;
  gap: clamp(2.5rem, 6vw, 5rem);
}

.journey__heading p,
.journey__number {
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: var(--type-small);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.journey__heading h2 {
  max-width: 16ch;
  margin-block-start: 0.65rem;
  font-size: var(--type-title);
  line-height: 1.05;
}

.journey__moments {
  position: relative;
  display: grid;
  gap: 2.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.journey__moments::before,
.journey__moments::after {
  content: "";
  position: absolute;
  inset-block: 2.15rem;
  inset-inline-start: 1.5rem;
  z-index: 0;
  width: 1px;
  transform-origin: top;
}

.journey__moments::before {
  background-color: var(--line-strong);
}

.journey__moments::after {
  background-color: var(--accent);
  transform: scaleY(0);
}

.journey__moments.is-visible::after {
  animation: journey-route-vertical 820ms var(--ease) both 120ms;
}

.journey__moment {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 3rem minmax(0, 1fr);
  gap: 0.3rem 1rem;
}

.journey__number,
.journey__moment > div {
  grid-column: 2;
}

.journey__signal {
  grid-column: 1;
  grid-row: 1 / span 2;
  display: grid;
  width: 3rem;
  height: 3rem;
  place-items: center;
  background-color: var(--surface);
}

.journey__signal svg {
  width: 2.25rem;
  fill: none;
  stroke: var(--ink);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.5;
}

.journey__moment h3 {
  margin-block-end: 0.35rem;
  font-size: var(--type-heading);
}

.journey__moment p {
  color: var(--ink-muted);
}

@keyframes journey-route-vertical {
  to { transform: scaleY(1); }
}

@keyframes journey-route-horizontal {
  to { transform: scaleX(1); }
}

@media (min-width: 52rem) {
  .journey__moments {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0;
  }

  .journey__moments::before,
  .journey__moments::after {
    inset-block: 3.15rem auto;
    inset-inline: 1.5rem;
    width: auto;
    height: 1px;
    transform-origin: left;
  }

  .journey__moments::after {
    transform: scaleX(0);
  }

  .journey__moments.is-visible::after {
    animation-name: journey-route-horizontal;
  }

  .journey__moment {
    grid-template-columns: 1fr;
    grid-template-rows: auto 3rem auto;
    padding-inline-end: clamp(1rem, 3vw, 2.5rem);
  }

  .journey__number,
  .journey__signal,
  .journey__moment > div {
    grid-column: 1;
  }

  .journey__signal {
    grid-row: 2;
  }
}
```

Add the sequential text and signal entrance:

```css
.has-enhancement .journey__moments:not(.is-visible) .journey__moment {
  opacity: 0;
  transform: translateY(12px);
}

.journey__moments.is-visible .journey__moment {
  animation: journey-moment-enter 520ms var(--ease) both;
}

.journey__moments.is-visible .journey__moment:nth-child(2) {
  animation-delay: 120ms;
}

.journey__moments.is-visible .journey__moment:nth-child(3) {
  animation-delay: 240ms;
}

.journey__moments.is-visible .journey__moment:nth-child(4) {
  animation-delay: 360ms;
}

@keyframes journey-moment-enter {
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .journey__moments::after {
    animation: none;
    transform: scaleY(1);
  }

  .journey__moment {
    animation: none;
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) and (min-width: 52rem) {
  .journey__moments::after {
    transform: scaleX(1);
  }
}
```

- [ ] **Step 5: Run focused verification**

Run:

```bash
npm test -- --run tests/render.test.ts &&
npm run check &&
npm run build
```

Expected: the renderer test passes, TypeScript exits zero, and Vite produces
`dist/`.

- [ ] **Step 6: Run the full verification gate**

Run:

```bash
npm test -- --run &&
npm run check &&
npm run build &&
git diff --check
```

Expected: all tests pass with no type, build, or whitespace errors.

- [ ] **Step 7: Commit locally**

```bash
git add tests/render.test.ts src/render.ts src/styles.css \
  docs/superpowers/plans/2026-09-07-client-journey.md
git commit -m "feat(site): upgrade client journey"
```

Do not push, open a pull request, or merge.
