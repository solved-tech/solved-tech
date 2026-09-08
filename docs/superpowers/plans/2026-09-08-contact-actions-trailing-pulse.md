# Contact Actions and Trailing Pulse Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Email actions, give WhatsApp a restrained branded treatment, and make each hero node-ring pulse 140 milliseconds after the signal crosses it.

**Architecture:** Extend the existing shared contact renderer so hero and footer contact groups stay identical. Keep pipeline motion CSS-only: move node activation from the whole group to the ring, then offset its existing route delay by 140 milliseconds.

**Tech Stack:** TypeScript 7.0.2, semantic HTML, inline SVG, CSS animations, Vitest 4.1.11

## Global Constraints

- Use `contact@solvedtech.co.uk` as the temporary email.
- Contact order is Call, WhatsApp, Email.
- Call remains orange; WhatsApp uses `#25d366` as a restrained accent; Email remains neutral.
- Render all three actions in both contact groups.
- The node ring remains muted while the dot approaches and overlaps it.
- The ring pulse begins 140 milliseconds after the dot crosses the node centre.
- Node icons and labels remain muted.
- Reduced-motion behaviour remains static.
- Work locally only; do not push or open a pull request.

## Files

- Edit `src/content.ts`
- Edit `src/render.ts`
- Edit `src/styles.css`
- Edit `tests/content.test.ts`
- Edit `tests/render.test.ts`
- Edit `tests/motion.test.ts`

---

### Task 1: Add Email and Branded WhatsApp Actions

**Interfaces:**
- Changes: `ContactConfig.email: string`
- Produces: `.contact-action__icon--whatsapp`
- Produces: `.contact-action__icon--email`

- [ ] **Step 1: Add failing content and renderer tests**

Update the contact assertion in `tests/content.test.ts`:

```ts
expect(contactConfig).toEqual({
  displayPhone: "+44 20 0000 0000",
  phone: "+442000000000",
  whatsapp: "442000000000",
  email: "contact@solvedtech.co.uk",
  placeholder: true,
});
```

Replace the contact renderer test in `tests/render.test.ts` with:

```ts
it("renders Call, WhatsApp, and Email in both contact groups", () => {
  expect(html.match(/href="tel:\+442000000000"/g)).toHaveLength(2);
  expect(
    html.match(/href="https:\/\/wa\.me\/442000000000"/g),
  ).toHaveLength(2);
  expect(
    html.match(/href="mailto:contact@solvedtech\.co\.uk"/g),
  ).toHaveLength(2);
  expect(
    html.match(/contact-action__icon--whatsapp/g),
  ).toHaveLength(2);
  expect(html.match(/contact-action__icon--email/g)).toHaveLength(2);

  const groups = Array.from(
    html.matchAll(
      /<div class="(?:hero__actions|contact__actions)">([\s\S]*?)<\/div>/g,
    ),
    (match) => match[1],
  );

  expect(groups).toHaveLength(2);
  groups.forEach((group) => {
    expect(group.indexOf("Call us")).toBeLessThan(group.indexOf("WhatsApp us"));
    expect(group.indexOf("WhatsApp us")).toBeLessThan(group.indexOf("Email us"));
  });
});
```

- [ ] **Step 2: Run tests and confirm the missing-email failure**

```bash
npm test -- --run tests/content.test.ts tests/render.test.ts
```

Expected: contact config lacks `email`, and no Email links or icons render.

- [ ] **Step 3: Extend contact configuration**

Add to `ContactConfig` and `contactConfig`:

```ts
email: string;
```

```ts
email: "contact@solvedtech.co.uk",
```

- [ ] **Step 4: Render the three actions**

Add these render constants in `src/render.ts`:

```ts
const whatsappIcon = `
  <svg class="contact-action__icon contact-action__icon--whatsapp" aria-hidden="true" focusable="false" viewBox="0 0 24 24">
    <path d="M20 11.6a8 8 0 0 1-11.8 7.1L4 20l1.3-4A8 8 0 1 1 20 11.6Z" />
    <path d="M8.2 7.8c.3-.7.6-.7 1-.7h.3l1 2.3c.1.3.1.5-.1.8l-.8 1c.8 1.6 1.9 2.7 3.5 3.5l1-.8c.2-.2.5-.2.8-.1l2.2 1c.3.1.4.3.4.6 0 1.1-.6 2-1.6 2.4-1 .4-2.6.2-4.7-.9-1.7-.9-3.1-2.2-4.1-3.8-1.3-2-1.5-3.7-1.1-4.7.4-.7 1-1.3 2.2-.6Z" />
  </svg>`;

const emailIcon = `
  <svg class="contact-action__icon contact-action__icon--email" aria-hidden="true" focusable="false" viewBox="0 0 24 24">
    <rect x="3" y="5" width="18" height="14" rx="1.5" />
    <path d="m4 7 8 6 8-6" />
  </svg>`;
```

Render actions in this order:

```ts
<a class="contact-action contact-action--call" href="tel:${escapeHtml(config.phone)}">Call us</a>
<a class="contact-action contact-action--whatsapp" href="https://wa.me/${escapeHtml(config.whatsapp)}" target="_blank" rel="noreferrer">${whatsappIcon}<span>WhatsApp us</span></a>
<a class="contact-action contact-action--email" href="mailto:${escapeHtml(config.email)}">${emailIcon}<span>Email us</span></a>
```

Update the trial note to mention both `displayPhone` and `email`.

- [ ] **Step 5: Style icons, WhatsApp, Email, and wrapping**

Add shared icon styles:

```css
.contact-action__icon {
  flex: 0 0 auto;
  width: 1.15rem;
  height: 1.15rem;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.6;
}

.contact-action__icon--whatsapp path:last-child {
  fill: currentColor;
  stroke: none;
}
```

Add `gap: 0.55rem` to hero and final contact action controls. Change the final
contact grid to three columns and stack it below 40rem:

```css
.contact__actions {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  max-width: 52rem;
}

@media (max-width: 40rem) {
  .contact__actions {
    grid-template-columns: 1fr;
  }
}
```

Apply the branded treatment after generic hover rules so it wins:

```css
.hero .contact-action--whatsapp,
.contact__actions .contact-action--whatsapp {
  border-color: rgb(37 211 102 / 0.62);
  background-color: rgb(37 211 102 / 0.06);
  color: #78dfa0;
}

.hero .contact-action--whatsapp:hover,
.hero .contact-action--whatsapp:focus-visible,
.contact__actions .contact-action--whatsapp:hover,
.contact__actions .contact-action--whatsapp:focus-visible {
  border-color: #25d366;
  background-color: rgb(37 211 102 / 0.1);
  color: #25d366;
}

.hero .contact-action--email,
.contact__actions .contact-action--email {
  border-color: var(--line-strong);
  background-color: transparent;
  color: var(--ink);
}
```

- [ ] **Step 6: Run focused tests**

```bash
npm test -- --run tests/content.test.ts tests/render.test.ts
```

Expected: focused tests pass.

---

### Task 2: Add the Post-Crossing Ring Pulse

**Interfaces:**
- Keeps: `--pipeline-delay` as the approximate dot crossing time
- Produces: `pipeline-node-ring-active`
- Produces: `calc(var(--pipeline-delay) + 140ms)`

- [ ] **Step 1: Add a failing stylesheet contract test**

Add to `tests/motion.test.ts`:

```ts
it("pulses only the node ring after the signal crosses", () => {
  const nodeRule = styles.match(/\.hero-pipeline__node\s*\{([^}]*)\}/)?.[1];
  const ringRule = styles.match(
    /\.hero-pipeline__node-ring\s*\{([^}]*)\}/,
  )?.[1];
  const iconRule = styles.match(/\.hero-pipeline__icon\s*\{([^}]*)\}/)?.[1];
  const labelRule = styles.match(
    /\.hero-pipeline__node text\s*\{([^}]*)\}/,
  )?.[1];

  expect(nodeRule).not.toContain("animation:");
  expect(ringRule).toContain(
    "animation: pipeline-node-ring-active 9s linear infinite",
  );
  expect(ringRule).toContain(
    "animation-delay: calc(var(--pipeline-delay) + 140ms)",
  );
  expect(iconRule).not.toContain("animation:");
  expect(labelRule).not.toContain("animation:");
  expect(styles).toContain("@keyframes pipeline-node-ring-active");
});
```

- [ ] **Step 2: Run the motion test and confirm it fails**

```bash
npm test -- --run tests/motion.test.ts
```

Expected: animation still belongs to `.hero-pipeline__node`, and the ring has
no delayed animation.

- [ ] **Step 3: Move animation to the ring**

Replace the node animation rules with:

```css
.hero-pipeline__node {
  color: var(--ink-muted);
}

.hero-pipeline__node-ring {
  fill: rgb(18 17 16 / 0.92);
  stroke: var(--ink-muted);
  stroke-width: 1.25;
  animation: pipeline-node-ring-active 9s linear infinite;
  animation-delay: calc(var(--pipeline-delay) + 140ms);
  animation-play-state: paused;
}

.hero__pipeline.is-pipeline-visible .hero-pipeline__node-ring,
.hero__pipeline.is-pipeline-visible .hero-pipeline__signal {
  animation-play-state: running;
}

@keyframes pipeline-node-ring-active {
  0%,
  12% {
    stroke: var(--accent);
  }

  18%,
  100% {
    stroke: var(--ink-muted);
  }
}
```

Delete `pipeline-node-active`. Keep icons and labels on the muted group colour.
Update reduced motion to target `.hero-pipeline__node-ring` instead of
`.hero-pipeline__node`.

- [ ] **Step 4: Run focused and complete verification**

```bash
npm test -- --run tests/motion.test.ts &&
npm test -- --run &&
npm run check &&
npm run build &&
git diff --check
```

Expected: all tests, TypeScript, build, and whitespace checks pass.

- [ ] **Step 5: Verify in the browser and commit**

At 1920 by 1080 and 390 by 844:

- Contact actions appear Call, WhatsApp, Email.
- WhatsApp has its logo and restrained green accent.
- No horizontal overflow occurs.
- The orange dot crosses each node before that node's ring turns orange.
- Icons and labels remain muted.
- Reduced-motion leaves the pipeline static.

```bash
git add src/content.ts src/render.ts src/styles.css tests/content.test.ts \
  tests/render.test.ts tests/motion.test.ts \
  docs/superpowers/plans/2026-09-08-contact-actions-trailing-pulse.md
git commit -m "feat(contact): add email and whatsapp styling"
```

Do not push or create a pull request.
