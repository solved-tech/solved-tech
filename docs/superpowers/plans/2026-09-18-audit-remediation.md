# Audit Remediation Implementation Plan

> **For agentic workers (DeepSeek-V4.1-Flash):** Read Section 0 in full before touching any file. Execute exactly one task per session. Steps use checkbox (`- [ ]`) syntax; tick them in this file as you go. This file is your durable memory across context compaction.

**Goal:** Close the sixteen findings (F01–F16) of the B2B audit dated 18 September 2026 (`raport-audit-general-solved-tech.pdf`) without a redesign, without new runtime dependencies, and without publishing any invented fact.

**Architecture:** Content stays in `src/content.ts`; markup stays in `src/render.ts` (tagged template strings, `escapeHtml` on every interpolated value); interactivity stays in `src/main.ts` as exported `setupX(root, ...)` functions; styling stays in `src/styles.css`. New pages (privacy, later service pages) are added as Vite multi-page inputs that reuse the exported header/footer renderers. Build-time prerendering is a plain Node script, not a framework.

**Tech Stack:** TypeScript 7.0.2, Vite 8.2.2, Vitest 4.1.11, Playwright 1.63.0, Node 25.9.0 (`.nvmrc`), GitHub Pages at `https://solved-tech.github.io/solved-tech/`.

---

## 0. Agent Operating Protocol

### 0.1 Why this protocol is strict

This plan is written for DeepSeek-V4.1-Flash. Its published characteristics shape the rules below:

| Model trait | Consequence for this plan |
| --- | --- |
| Recommended sampling is `temperature=1.0`, so two runs of the same prompt differ. | Correctness comes from the tests written in each task, never from "looking right". Copy every test and every string in this plan **verbatim**. |
| It executes eagerly under ambiguity instead of asking. | Every task states exact files, exact strings, exact selectors and exact expected counts. If something is not specified, do the minimum and record it under "Open questions" in the task report; do not invent. |
| It tends to keep verifying after the deliverable is done (unbounded verification loops). | Each task has a **Done-when** list and a **tool-call budget**. When Done-when passes, stop. Do not run extra checks "to be safe". |
| After context compaction it can misattribute its own earlier edits. | Tick checkboxes in this file after each step and commit after each task. On resume, run `git log --oneline -5` and `git status` first, then re-read only the current task. |
| 1M-token context makes it cheap to read, expensive to write. | Read the listed files fully once at task start. Make small, targeted edits. Never rewrite a whole file. |
| Prefill is cheaper than decode. | Prefer reading an existing test file over reconstructing its shape from memory. |

### 0.2 Session start ritual (every session, no exceptions)

- [ ] `cd` into the repository root (the directory containing `package.json` with `"name": "solved-tech"`).
- [ ] Run `git status --short` and `git log --oneline -5`. If the working tree is dirty, stop and report; do not "clean up".
- [ ] Run `node --version` (must print `v25.x` or newer) and `npm ci --silent`.
- [ ] Run `npm test` and `npm run check`. Both must pass before you start. If they do not, stop and report.
- [ ] Open this file, find the first task whose checkboxes are not all ticked. That is your task. Read only that task and the files it lists.

### 0.3 Per-task rules

1. Touch only files listed under **Files** for the task. If a change seems to require another file, stop and report instead.
2. Do not add, remove or upgrade any npm dependency. Do not install global tools. Do not edit `package-lock.json`.
3. Do not refactor, rename, reformat or "improve" code you were not asked to change. Do not add comments explaining your change.
4. Write the failing test first (exact code given), run it, watch it fail, then implement, then run again.
5. Never delete an existing test. Update an existing assertion only when the task's **Downstream** list names it.
6. Keep the English-only policy: all copy, identifiers, comments and commit messages in English.
7. Never write placeholder facts that look real (phone numbers, emails, company numbers, client names, metrics, review counts). The only permitted placeholders are the `[[UPPER_SNAKE]]` tokens named in this plan, and they are guarded by tests.
8. Work on the branch named in the task. Never push. Never open a pull request. Never merge.

### 0.4 Stop conditions and budgets

- **Tool-call budget:** 30 tool calls per task (reads, edits, commands combined). At 30, stop and write the task report with what is missing.
- **Verification budget:** run `npm test` and `npm run check` as many times as needed while iterating, but run the Playwright projects named in the task **at most twice**. Never run the full 13-project matrix inside a task; that happens once in Task 15.
- **Done-when passes → stop.** Write the report (0.7), tick the boxes, commit with the given message, end the session.
- If a command fails twice for the same reason after one honest fix attempt, stop and report. Do not try a third variation.

### 0.5 Facts only humans can supply (never invent these)

| ID | Input | Needed by |
| --- | --- | --- |
| H1 | Real phone (E.164 and display form), WhatsApp number, email address; confirmation each channel is monitored | Task 4 |
| H2 | Legal entity name, registered address, retention period, email/WhatsApp provider names for the privacy notice | Task 7 |
| H3 | Portrait source files (Razvan ≥1040 px wide already exists; Remus needs a source ≥680 px wide) or approval to ship the current resolution | Task 9 |
| H4 | 2–3 approved case studies with publication rights, and 4 FAQ answers | Task 11 |
| H5 | Final domain, confirmation that GitHub Pages remains the host, and a 1200×630 social preview image saved as `public/brand/solved-tech-social.png` | Tasks 12, 14 |
| H6 | Analytics vendor decision (or "none") | Task 10 note |
| H7 | Approved copy for the three service pages | Task 13 |

Tasks depending on an H-input contain a clearly marked **HUMAN STEP**. The agent implements everything up to that step, leaves the guarded placeholder in place, and reports.

### 0.6 Verification commands (the only ones you need)

```bash
npm test                    # Vitest unit + contract tests (77 passing at baseline)
npm run check               # tsc --noEmit
npm run build               # tsc && vite build (from Task 12: && node scripts/prerender.mts)
npx playwright install --with-deps chromium webkit   # once per machine
npx playwright test --project=uk-phone-standard --project=uk-desktop   # default e2e subset
npx playwright test --project=stress-compact --project=phone-landscape # hero-geometry subset
```

Playwright starts `vite dev` on `127.0.0.1:4173` itself; do not start a server manually.

### 0.6.1 MCP tools (configured in `.augment/settings.json`, loaded automatically by `auggie`)

Two MCP servers are available. They are aids for **looking**, never substitutes for the tests in each task. Every MCP call counts against the 30-call budget.

| Server | Use it for | Do not use it for |
| --- | --- | --- |
| `playwright` (`browser_*` tools; headless Chromium, in-memory profile) | Confirming a behaviour by eye before writing the assertion: `browser_navigate` to `http://127.0.0.1:4173/…` (start `npm run dev -- --port 4173 --host 127.0.0.1` in the background first, stop it when done), `browser_snapshot` for the accessibility tree (roles, names, focus), `browser_press_key` for keyboard checks (Tasks 1, 2, 8), `browser_resize` for one viewport, `browser_console_messages` and `browser_network_requests` for CSP violations and asset sizes (Tasks 9, 14, 15). | Replacing `npx playwright test`; clicking through every viewport (the matrix does that); anything on a site other than the local dev server, the GitHub Pages preview, or the launched production origin. |
| `context7` (`resolve-library-id`, `query-docs`) | Checking an API you are about to type when this plan does not spell it out: Vite 8 `createServerModuleRunner` / `ssrLoadModule` (Task 12), Vitest 4 matchers, Playwright 1.63 assertions, Node type-stripping for `.mts`. One query, then act. | Browsing documentation for ideas; anything the plan already states verbatim. |

Rules: at most **4** MCP calls per task; screenshots go to `.playwright-mcp/` (git-ignored) and are never committed; `browser_run_code_unsafe` and `browser_file_upload` are never used; if an MCP server fails to start, continue without it and note it under OPEN QUESTIONS.

### 0.7 Task report format (paste at the end of the session, verbatim headings)

```
TASK: <number and title>
COMMIT: <sha> <message>          (or "not committed" + reason)
CHANGED FILES: <list>
VERIFICATION: npm test <pass|fail n>; npm run check <pass|fail>; npm run build <pass|fail>; playwright <projects> <pass|fail>
DONE-WHEN: <each bullet: PASS|FAIL>
OPEN QUESTIONS: <none | list>
TOOL CALLS USED: <n>/30
```

### 0.8 State ledger

Tick here when a task's commit exists. This table is the resume point after compaction.

| Task | Finding | Status |
| --- | --- | --- |
| 1 | F05 | [x] |
| 2 | F06 | [x] |
| 3 | F11 (preview) | [x] |
| 4 | F01 | [x] |
| 5 | F02, F07 | [x] |
| 6 | F04, hero copy | [ ] |
| 7 | F14 | [ ] |
| 8 | F08 | [ ] |
| 9 | F09 | [ ] |
| 10 | F16 | [ ] |
| 11 | F03, FAQ | [ ] |
| 12 | F10, F13, F11 (launch) | [ ] |
| 13 | F12 | [ ] |
| 14 | F15 | [ ] |
| 15 | Full matrix + launch gate | [ ] |

---


## 1. Baseline facts (verified against commit `2b3fc62`, 18 September 2026)

### 1.1 Repository map

| Path | Role |
| --- | --- |
| `index.html` | 683-byte shell: `<title>`, `<meta name="description">`, skip link, empty `<div id="app">`, `<script type="module" src="/src/main.ts">` |
| `src/content.ts` | `contactConfig` (placeholder `+44 20 0000 0000`, `contact@solvedtech.co.uk`, `placeholder: true`), `siteContent.products` (5, ids `ai`,`customers`,`website`,`app`,`other`), `siteContent.founders` (2) |
| `src/render.ts` | `renderHomepage(content, config, baseUrl)`, `escapeHtml`, `publicAssetUrl`, `renderContactActions`, `renderHeroPipeline`, `renderServiceArt(id)` (switch, one SVG per id), `pipelinePath` |
| `src/main.ts` | `stagger`, `setupRevealMotion`, `setupPipelineMotion`, `setupHeroInteraction`, `setupMobileMenu`, `setupHeaderOffset`, `setupScrollProgress`, `start(window)` |
| `src/styles.css` | 1779 lines. Reduced-motion block starts at `@media (prefers-reduced-motion: reduce)`; closed mobile nav uses `visibility: hidden` (already out of tab order) |
| `tests/*.test.ts` | Vitest: `content`, `render`, `motion` (includes CSS contract tests that regex the stylesheet), `responsive-workflow`, `vitest-config` — 77 tests |
| `tests/e2e/responsive.spec.ts` + `responsive.helpers.ts` | Playwright, 13 projects (11 Chromium, 2 WebKit), base URL `http://127.0.0.1:4173/solved-tech/` |
| `vite.config.ts` | `base: "/solved-tech/"` only |
| `.github/workflows/deploy-pages.yml` | on push to `main`: `npm ci`, `npm test -- --run`, `npm run check`, `npm run build`, upload `dist/` |
| `.github/workflows/responsive.yml` | on PR: Playwright matrix. Its structure is pinned by `tests/responsive-workflow.test.ts` — do not edit it |
| `public/team/razvan_cristofor.png` | 1,821,715 bytes, 1040×1222 (F09) |
| `public/team/remus_baciu.png` | 163,043 bytes, 340×400 — rendered at 520×620, i.e. upscaled |

### 1.2 Hard-coded counts that tasks change

Every count below is asserted somewhere. When a task changes one, the task's **Downstream** list names the exact assertion to update. Do not update counts that are not listed.

| What | Baseline | Where asserted |
| --- | --- | --- |
| `.service-box` articles | 5 | `tests/render.test.ts` (×6 assertions), `responsive.spec.ts` lines 80, 284, 307, 515 |
| `.service-box__capability` items | 21 | `tests/render.test.ts` "renders the service order and capability lists" |
| `provides` lengths | `[5, 4, 4, 4, 4]` | `tests/content.test.ts` |
| `#primary-navigation a` | 4 | `responsive.spec.ts` lines 44, 88, 135 |
| `.contact-action` | 6 | `responsive.spec.ts` line 72; `render.test.ts` regex counts of 2 per href |
| `footer a` | 1 | `responsive.spec.ts` line 111 |
| `.founder__details a` | 2 | `responsive.spec.ts` line 103 |
| `.journey__moment` / `.journey__signal svg` | 4 | `responsive.spec.ts` 308, 517; `render.test.ts`; `responsive.helpers.ts` `toHaveCount(4)` |
| Hero pipeline nodes | 7 | unchanged by this plan |
| Vitest total | 77 | grows with every task |

### 1.3 Strings currently pinned by tests (change only when the task says so)

- Hero: `<p class="hero__eyebrow" data-reveal>AI. Growth. Apps. Websites.</p>`, `Whatever your business needs next, we build it.`, `Bring us the problem. We will turn it into something useful.`
- Journey: `What happens next`, `One call. Then we make it simple.`, and the eight moment strings in `render.test.ts` "explains what happens after a client calls".
- Contact hrefs: `tel:+442000000000`, `https://wa.me/442000000000`, `mailto:contact@solvedtech.co.uk` (each ×2).
- Portrait srcs: `/team/razvan_cristofor.png`, `/team/remus_baciu.png`.
- `contactConfig` deep-equals the placeholder object in `tests/content.test.ts`.

---

## 2. Finding → task map

| Finding | Priority (audit) | Task | Agent can fully complete? |
| --- | --- | --- | --- |
| F01 Placeholder contacts | High | 4 | No — needs H1; agent ships copyable details + guard tests |
| F02 Bug-fixing offer not explicit | High | 5 | Yes |
| F03 No project proof | High | 11 | No — needs H4; agent ships gated section |
| F04 Process does not explain deliverables | Medium | 6 | Yes |
| F05 Back to top does not return to top | Medium | 1 | Yes |
| F06 Escape does not close mobile menu | Low | 2 | Yes |
| F07 Services hard to compare; "Products" label; jargon | Medium | 5 | Yes |
| F08 Continuous motion has no visible control | Medium | 8 | Yes |
| F09 1.8 MB portrait | Medium | 9 | Partly — asset export needs a tool/human (H3) |
| F10 Commercial content depends on JS | Medium | 12 | Yes |
| F11 Preview is public without noindex/canonical | Medium | 3 (noindex now), 12 (canonical at launch) | Yes / needs H5 |
| F12 Distinct intents share one URL | Medium | 13 | No — needs H7 |
| F13 No canonical/OG/JSON-LD | Low | 12 | Partly — gated on H5 and launch flag |
| F14 No privacy information | Medium | 7 | No — needs H2; agent ships page with guarded tokens |
| F15 Security headers | Low | 14 | No — hosting configuration, documented only |
| F16 No conversion measurement | Medium | 10 | Partly — data attributes now, vendor later (H6) |

Order of execution is Task 1 → 15. Tasks 1–7 are the audit's "before launch" set. Tasks 8–12 are the "7–30 days" set. Tasks 13–14 are gated on human inputs. Task 15 is the launch gate.

---

## 3. Tasks

Every task follows the same shape: **Branch**, **Files** (Read / Modify / Create), **Steps**, **Downstream**, **Done-when**, **Commit**. Code blocks are to be copied verbatim.


### Task 1: Back to top actually returns to the top (F05)

**Why it fails today:** `id="top"` sits on the sticky `<header>`. When the header is already pinned at the top of the viewport, the browser considers `#top` in view and does not scroll. Moving the id to an in-flow, zero-height element at the very start of the document fixes it with native anchor navigation and keeps reduced-motion behaviour untouched.

**Branch:** `fix/f05-back-to-top`

**Files:**
- Read: `src/render.ts` (lines 333–370 and 442–446), `tests/render.test.ts`, `tests/e2e/responsive.spec.ts` (lines 1–60)
- Modify: `src/render.ts`, `tests/render.test.ts`, `tests/e2e/responsive.spec.ts`

**Steps:**

- [x] **Step 1: Add the failing unit test** at the end of the `describe("homepage renderer")` block in `tests/render.test.ts`:

```ts
  it("targets back-to-top links at an in-flow anchor above the sticky header", () => {
    expect(html).toContain('<div id="top" class="page-top"></div>');
    expect(html).toContain('<header class="site-header">');
    expect(html).not.toContain('<header id="top"');
    expect(html.indexOf('id="top"')).toBeLessThan(
      html.indexOf('class="site-header"'),
    );
    expect(html.match(/href="#top"/g)).toHaveLength(2);
  });
```

- [x] **Step 2:** Run `npm test`. Expect exactly 1 failure (the new test).

- [x] **Step 3: Edit `src/render.ts`.** In the template returned by `renderHomepage`, replace the single line

```html
    <header id="top" class="site-header">
```

with

```html
    <div id="top" class="page-top"></div>
    <header class="site-header">
```

No CSS is required: an empty in-flow `div` has zero height and sits at document `y = 0` because `.ambient-grid` is `position: fixed` and `.code-field` is `position: absolute`.

- [x] **Step 4:** Run `npm test` (expect 78 passing) and `npm run check`.

- [x] **Step 5: Add the e2e test** after the test named `"header controls stay in complete bounds"` in `tests/e2e/responsive.spec.ts`:

```ts
test("back to top brings the hero into view from the footer", async ({ page }) => {
  const collector = await preparePage(page);
  const backToTop = page.locator('footer a[href="#top"]');

  await backToTop.scrollIntoViewIfNeeded();
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(1000);

  await backToTop.click();
  await expect(page).toHaveURL(/#top$/);
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeLessThanOrEqual(1);
  await expect(page.locator("#hero-heading")).toBeInViewport();

  assertNoRuntimeErrors(collector);
});
```

- [x] **Step 6:** Run `npx playwright test --project=uk-phone-standard --project=uk-desktop`. All tests in both projects must pass.

**Downstream:** none (no counts change; `href="#top"` still appears exactly twice).

**Done-when:**
- `npm test` → 78 passed
- `npm run check` → exit 0
- Playwright `uk-phone-standard` + `uk-desktop` → all passed
- `git diff --stat` lists only the three files above

**Commit:** `fix(nav): move back-to-top anchor out of the sticky header`

---

### Task 2: Escape closes the mobile menu and returns focus (F06)

**Branch:** `fix/f06-menu-escape`

**Files:**
- Read: `src/main.ts` (`setupMobileMenu`, lines 123–144), `tests/motion.test.ts` (`describe("mobile menu")`), `tests/e2e/responsive.spec.ts` (test `"mobile menu opens, contains usable links, and closes on navigation"`)
- Modify: `src/main.ts`, `tests/motion.test.ts`, `tests/e2e/responsive.spec.ts`

**Steps:**

- [x] **Step 1: Replace the whole `describe("mobile menu", …)` block** in `tests/motion.test.ts` with the version below. It keeps the existing assertion and adds two tests. The fake button gains `focus` and `ownerDocument`.

```ts
describe("mobile menu", () => {
  const createMenu = () => {
    const attributes = new Map([["aria-expanded", "false"]]);
    const handlers = new Map<string, (event?: unknown) => void>();
    const toggle = vi.fn();
    const focus = vi.fn();
    const button = {
      focus,
      getAttribute: (name: string) => attributes.get(name) ?? null,
      setAttribute: (name: string, value: string) =>
        attributes.set(name, value),
      addEventListener: (type: string, handler: () => void) =>
        handlers.set(type, handler),
      ownerDocument: {
        addEventListener: (type: string, handler: (event?: unknown) => void) =>
          handlers.set(type, handler),
      },
    };
    const nav = {
      classList: { toggle },
      querySelectorAll: vi.fn(() => []),
    };
    const root = {
      querySelector: vi.fn((selector: string) =>
        selector === ".menu-toggle" ? button : nav,
      ),
    } as unknown as ParentNode;

    setupMobileMenu(root);

    return { attributes, focus, handlers, toggle };
  };

  it("toggles navigation visibility and its accessible state", () => {
    const { attributes, handlers, toggle } = createMenu();

    handlers.get("click")?.();
    expect(attributes.get("aria-expanded")).toBe("true");
    expect(toggle).toHaveBeenCalledWith("is-open", true);

    handlers.get("click")?.();
    expect(attributes.get("aria-expanded")).toBe("false");
    expect(toggle).toHaveBeenLastCalledWith("is-open", false);
  });

  it("closes on Escape and returns focus to the toggle", () => {
    const { attributes, focus, handlers, toggle } = createMenu();

    handlers.get("click")?.();
    handlers.get("keydown")?.({ key: "Escape" });

    expect(attributes.get("aria-expanded")).toBe("false");
    expect(attributes.get("aria-label")).toBe("Open menu");
    expect(toggle).toHaveBeenLastCalledWith("is-open", false);
    expect(focus).toHaveBeenCalledTimes(1);
  });

  it("ignores Escape and other keys while the menu is closed", () => {
    const { attributes, focus, handlers, toggle } = createMenu();

    handlers.get("keydown")?.({ key: "Escape" });
    handlers.get("keydown")?.({ key: "Enter" });

    expect(attributes.get("aria-expanded")).toBe("false");
    expect(toggle).not.toHaveBeenCalled();
    expect(focus).not.toHaveBeenCalled();
  });
});
```

- [x] **Step 2:** Run `npm test`. Expect 2 failures (the two new tests).

- [x] **Step 3: Edit `setupMobileMenu` in `src/main.ts`.** Insert the following block immediately after the existing `button.addEventListener("click", …)` statement and before `nav.querySelectorAll…`:

```ts
  button.ownerDocument.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key !== "Escape") {
      return;
    }

    if (button.getAttribute("aria-expanded") !== "true") {
      return;
    }

    setOpen(false);
    button.focus();
  });
```

- [x] **Step 4:** Run `npm test` (expect 80 passing) and `npm run check`.

- [x] **Step 5: Extend the e2e test** `"mobile menu opens, contains usable links, and closes on navigation"`. Insert the following block immediately after the line `await assertNoDocumentOverflow(page);` and before `await navigation.locator('a[href="#services"]').click();`:

```ts
  await page.keyboard.press("Escape");
  await expect(menuToggle).toHaveAttribute("aria-expanded", "false");
  await expect(navigation).not.toHaveClass(/is-open/);
  await expect(menuToggle).toBeFocused();
  await expect(links.first()).toBeHidden();

  await menuToggle.click();
  await expect(menuToggle).toHaveAttribute("aria-expanded", "true");
```

`toBeHidden()` passes because the closed nav has `visibility: hidden` (styles.css line 334), which also removes the links from the Tab order; no CSS change is needed.

- [x] **Step 6:** Run `npx playwright test --project=uk-phone-standard --project=stress-compact`.

**Downstream:** none.

**Done-when:**
- `npm test` → 80 passed
- `npm run check` → exit 0
- Playwright `uk-phone-standard` + `stress-compact` → all passed

**Commit:** `fix(menu): close the mobile menu with Escape and restore focus`

---


### Task 3: Keep the GitHub Pages preview out of search indexes (F11, preview half)

**Why now:** The preview at `solved-tech.github.io/solved-tech/` shows test contacts and has no `noindex` or canonical. Until the final domain exists (H5), the correct state is crawlable-but-noindex. Task 12 removes this tag automatically at launch.

**Branch:** `fix/f11-preview-noindex`

**Files:**
- Read: `index.html`, `tests/vitest-config.test.ts` (as a pattern for file-reading tests)
- Modify: `index.html`
- Create: `tests/document.test.ts`

**Steps:**

- [x] **Step 1: Create `tests/document.test.ts`:**

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const indexHtml = readFileSync(
  new URL("../index.html", import.meta.url),
  "utf8",
);

describe("document shell", () => {
  it("keeps the GitHub Pages preview out of search indexes", () => {
    expect(indexHtml).toContain('<meta name="robots" content="noindex" />');
  });

  it("declares language, viewport and description once", () => {
    expect(indexHtml).toContain('<html lang="en-GB">');
    expect(indexHtml.match(/<meta name="viewport"/g)).toHaveLength(1);
    expect(indexHtml.match(/<meta name="description"/g)).toHaveLength(1);
  });
});
```

- [x] **Step 2:** Run `npm test`. Expect 1 failure.

- [x] **Step 3: Edit `index.html`.** Insert this line directly after the `<meta name="description" … />` line:

```html
    <meta name="robots" content="noindex" />
```

- [x] **Step 4:** Run `npm test` (expect 82 passing), `npm run check`, `npm run build`. Confirm with `grep -c 'name="robots"' dist/index.html` → `1`.

**Downstream:** none.

**Done-when:**
- `npm test` → 82 passed
- `npm run build` → exit 0 and `dist/index.html` contains the robots meta

**Commit:** `fix(seo): mark the GitHub Pages preview noindex until launch`

---

### Task 4: Copyable contact details and a single source of truth for contact data (F01)

**Scope split:** The agent ships (a) visible, copyable phone and email text in the contact section and (b) tests that derive expected hrefs from `contactConfig` instead of hard-coding trial values, plus a guard that fails if trial values survive after launch. Replacing the values is a **HUMAN STEP** (H1).

**Branch:** `feat/f01-contact-source-of-truth`

**Files:**
- Read: `src/content.ts`, `src/render.ts` (contact section, lines 435–440), `src/styles.css` (`.contact-note` at line ~1627), `tests/content.test.ts`, `tests/render.test.ts` (test `"renders Call, WhatsApp, and Email in both contact groups"`)
- Modify: `src/content.ts`, `src/render.ts`, `src/styles.css`, `tests/content.test.ts`, `tests/render.test.ts`

**Steps:**

- [x] **Step 1: Add a launch switch to `src/content.ts`.** Append after `contactConfig`:

```ts
export interface SiteStatus {
  launched: boolean;
}

export const siteStatus: SiteStatus = {
  launched: false,
};
```

- [x] **Step 2: Replace the test `"uses explicit one-click trial contact placeholders"`** in `tests/content.test.ts` with:

```ts
  it("keeps every contact channel derived from one phone number", () => {
    expect(contactConfig.phone).toBe(contactConfig.displayPhone.replace(/\s+/g, ""));
    expect(contactConfig.phone).toMatch(/^\+44\d{10}$/);
    expect(contactConfig.whatsapp).toBe(contactConfig.phone.slice(1));
    expect(contactConfig.email).toMatch(/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i);
  });

  it("refuses to launch with trial contact details", () => {
    const trial = ["+442000000000", "contact@solvedtech.co.uk"];
    const isTrial =
      trial.includes(contactConfig.phone) || trial.includes(contactConfig.email);

    expect(contactConfig.placeholder).toBe(isTrial);
    if (siteStatus.launched) {
      expect(contactConfig.placeholder).toBe(false);
    }
  });
```

Update the import at the top of the file to `import { contactConfig, siteContent, siteStatus } from "../src/content";`.

- [x] **Step 3: In `tests/render.test.ts`**, add this helper after the imports:

```ts
const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
```

Then inside `"renders Call, WhatsApp, and Email in both contact groups"` replace the first three `expect(html.match(...)).toHaveLength(2)` assertions with:

```ts
    expect(
      html.match(new RegExp(`href="tel:${escapeRegExp(contactConfig.phone)}"`, "g")),
    ).toHaveLength(2);
    expect(
      html.match(
        new RegExp(`href="https://wa\\.me/${escapeRegExp(contactConfig.whatsapp)}"`, "g"),
      ),
    ).toHaveLength(2);
    expect(
      html.match(new RegExp(`href="mailto:${escapeRegExp(contactConfig.email)}"`, "g")),
    ).toHaveLength(2);
```

- [x] **Step 4: Add the failing renderer test** at the end of the describe block:

```ts
  it("shows the phone number and email as copyable text in the contact section", () => {
    const contact = html.match(/<section class="contact"[\s\S]*?<\/section>/)?.[0];

    expect(contact).toBeDefined();
    expect(contact).toContain('<dl class="contact-details" data-reveal>');
    expect(contact).toContain(`<dt>Phone</dt><dd>${contactConfig.displayPhone}</dd>`);
    expect(contact).toContain(`<dt>Email</dt><dd>${contactConfig.email}</dd>`);
    expect(contact!.indexOf('class="contact__actions"')).toBeLessThan(
      contact!.indexOf('class="contact-details"'),
    );
  });
```

- [x] **Step 5:** Run `npm test`. Expect exactly 1 failure (Step 4's test). If Step 2 or 3 tests fail, the helper or import was copied wrongly; fix that before continuing.

- [x] **Step 6: Edit the contact section in `src/render.ts`.** Directly after the line `<div data-reveal>${renderContactActions(config, "contact__actions")}</div>` insert:

```html
        <dl class="contact-details" data-reveal>
          <div><dt>Phone</dt><dd>${escapeHtml(config.displayPhone)}</dd></div>
          <div><dt>Email</dt><dd>${escapeHtml(config.email)}</dd></div>
        </dl>
```

- [x] **Step 7: Add CSS** in `src/styles.css` immediately before the `.contact-note {` rule:

```css
.contact-details {
  display: grid;
  gap: 0.5rem 2rem;
  margin: 1.5rem 0 0;
  font-family: var(--font-mono);
  font-size: var(--type-small);
}

.contact-details div {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 0.75rem;
}

.contact-details dt {
  color: var(--ink-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.contact-details dd {
  margin: 0;
  color: var(--ink);
  user-select: all;
  -webkit-user-select: all;
}

@media (min-width: 40rem) {
  .contact-details {
    grid-template-columns: repeat(2, max-content);
  }
}
```

- [x] **Step 8:** Run `npm test` (expect 84 passing), `npm run check`, then `npx playwright test --project=uk-phone-standard --project=uk-desktop`.

**Downstream:** none for the agent. The `.contact-note` paragraph remains until H1.

**HUMAN STEP (H1) — do not perform without the real values.** When founders provide them:
1. In `src/content.ts` set `displayPhone`, `phone`, `whatsapp`, `email` to the real values and `placeholder: false`.
2. In `tests/e2e/responsive.spec.ts`, the line `await assertProseWidth(page.locator(".contact-note"));` (≈ line 494) must be deleted, because the note no longer renders.
3. Run `npm test` — the derived tests pass without edits. Run the default Playwright subset.
4. Founders confirm receipt on each channel (call, WhatsApp message, email) before `siteStatus.launched` is set to `true` in Task 15.

**Done-when:**
- `npm test` → 84 passed
- Playwright default subset → all passed
- No hard-coded `+442000000000`, `442000000000` or `contact@solvedtech.co.uk` remains in `tests/render.test.ts` (`grep -c` returns 0)

**Commit:** `feat(contact): show copyable details and derive contact tests from one source`

---


### Task 5: Make bug fixing an explicit service, add a need selector, rename "Products" (F02, F07)

**What changes:** a sixth service (`fix`) placed first; service `other` becomes the automation/integration entry; the two MCP capability labels are rewritten in business language; every service article gets a stable `id`; a compact three-link "Choose your need" selector sits under the services heading; the nav label becomes "Services". Every service gets its own CTA label.

**Branch:** `feat/f02-f07-bug-fixing-service`

**Files:**
- Read: `src/content.ts`, `src/render.ts` (lines 136–312, 363–368, 388–391), `src/styles.css` (search `.service-grid {` ≈ line 780 and `.services` heading rules just above it), `tests/content.test.ts`, `tests/render.test.ts`, `tests/e2e/responsive.spec.ts` (lines 79–85, 280–310, 510–520)
- Modify: all six files above

**Steps:**

- [x] **Step 1: Update `tests/content.test.ts`.** Replace the three tests `"uses the approved commercial service order"`, `"lists concrete capabilities for every product"`, `"keeps MCP work in AI and leaves service 05 broad"` with:

```ts
  it("uses the approved commercial service order with bug fixing first", () => {
    expect(siteContent.products.map(({ id }) => id)).toEqual([
      "fix",
      "ai",
      "customers",
      "website",
      "app",
      "other",
    ]);
    expect(siteContent.products.map(({ question }) => question)).toEqual([
      "Something broken?",
      "Want to use AI?",
      "Need more customers?",
      "Need a website?",
      "Need an app?",
      "Need to automate a process?",
    ]);
  });

  it("lists concrete capabilities and a CTA for every product", () => {
    expect(siteContent.products.map(({ provides }) => provides.length)).toEqual(
      [5, 5, 4, 4, 4, 4],
    );
    expect(siteContent.products.every(({ cta }) => cta.length > 0)).toBe(true);
    expect(siteContent.products.flatMap(({ provides }) => provides)).toContain(
      "Technical SEO",
    );
  });

  it("describes bug fixing, AI and automation in business language", () => {
    const fix = siteContent.products.find(({ id }) => id === "fix");
    const ai = siteContent.products.find(({ id }) => id === "ai");
    const other = siteContent.products.find(({ id }) => id === "other");

    expect(fix).toEqual({
      id: "fix",
      question: "Something broken?",
      title: "Bug fixes and improvements to existing software",
      answer:
        "We investigate the problem, reproduce it where possible, agree the fix and test it.",
      provides: [
        "Bug diagnosis and fixes",
        "Failed integrations",
        "Software built by another team",
        "Regression testing",
        "Documented handover",
      ],
      cta: "Discuss a software issue",
    });
    expect(ai?.provides).toEqual([
      "AI assistants",
      "Agentic workflows",
      "WhatsApp & voice agents",
      "AI connected to your tools (MCP)",
      "AI that reads and updates your systems",
    ]);
    expect(other).toMatchObject({
      title: "Business automation and integrations",
      answer: "Reduce repetitive work and connect the tools your team relies on.",
      provides: [
        "Business automation",
        "Connected systems",
        "Data moving between your tools",
        "Bespoke solutions",
      ],
      cta: "Talk to us",
    });
    expect(siteContent.products.flatMap(({ provides }) => provides)).not.toContain(
      "Custom MCPs",
    );
  });
```

- [x] **Step 2: Update `src/content.ts`.**
  - Change the `id` union to `"fix" | "website" | "app" | "customers" | "ai" | "other"`.
  - Add `cta: string;` to `ProductOffer` after `provides`.
  - Insert the `fix` product object from Step 1 as the **first** element of `products`.
  - Add `cta: "Talk to us",` to `ai`, `customers`, `website`, `app`, `other`.
  - In `ai.provides` replace `"Custom MCPs"` with `"AI connected to your tools (MCP)"` and `"MCP integrations"` with `"AI that reads and updates your systems"`.
  - Replace the `other` object's `question`, `title`, `answer`, `provides` with the values in Step 1 (keep `id: "other"`).

- [x] **Step 3:** Run `npm test`. Content tests pass; several render tests now fail (expected). `npm run check` fails until Step 5 (renderer does not yet use `cta`) — that is expected.

- [x] **Step 4: Update `tests/render.test.ts`** (existing assertions; each bullet names one test):
  - `"renders every service as an animated visual box"`: `toHaveLength(5)` → `toHaveLength(6)`; the article string becomes `` `<article id="service-${id}" class="service-box service-box--${id}" aria-labelledby="${questionId}">` ``.
  - `"keeps service rows visible and reveals only artwork"`: both `5` → `6`.
  - `"renders the service order and capability lists"`: `provides` `5` → `6`, `capability` `21` → `26`; add as first assertion `expect(html.indexOf("Something broken?")).toBeLessThan(html.indexOf("Want to use AI?"));`.
  - `"uses a full header, diagram-first body, and dedicated CTA per service"`: all four `5` → `6`.
  - `"reveals each service artwork when the diagram reaches the viewport"`: `5` → `6`.
  - `"gives every service contact link a distinct accessible name"`: body becomes
    ```ts
    siteContent.products.forEach(({ cta, title }) => {
      expect(html).toContain(`aria-label="${cta}: ${title}"`);
    });
    expect(html).toContain('href="#contact" aria-label="Discuss a software issue: Bug fixes and improvements to existing software"');
    ```
  - `"renders semantic navigation and contact landmarks"`: add `expect(html).toContain('href="#services">Services</a>');` and `expect(html).not.toContain(">Products<");`.
  - `"fills every service visual with meaningful interface detail"`: add `"Log"`, `"Reproduce"`, `"Fixed"` to the label array.

  Then add this new test at the end of the describe block:

```ts
  it("offers a three-way need selector that deep-links into services", () => {
    const selector = html.match(/<nav class="need-selector"[\s\S]*?<\/nav>/)?.[0];

    expect(selector).toBeDefined();
    expect(html.indexOf('id="services-heading"')).toBeLessThan(html.indexOf('class="need-selector"'));
    expect(html.indexOf('class="need-selector"')).toBeLessThan(html.indexOf('class="service-grid"'));
    expect(selector).toContain('aria-label="Choose your need"');
    expect(selector!.match(/class="need-link"/g)).toHaveLength(3);
    expect(selector).toContain('href="#service-fix"');
    expect(selector).toContain('href="#service-app"');
    expect(selector).toContain('href="#service-other"');
    expect(selector).toContain("<strong>Fix a system</strong>");
    expect(selector).toContain("<strong>Build a product</strong>");
    expect(selector).toContain("<strong>Automate a process</strong>");
    ["fix", "ai", "customers", "website", "app", "other"].forEach((id) =>
      expect(html).toContain(`<article id="service-${id}"`),
    );
  });
```

- [x] **Step 5: Edit `src/render.ts`.**

  5a. In the `services` map, destructure `cta` too: `({ id, question, title, answer, provides, cta }, index)`. Change the article opening tag to:
  ```html
        <article id="service-${escapeHtml(id)}" class="service-box service-box--${escapeHtml(id)}" aria-labelledby="${questionId}">
  ```
  and the CTA to:
  ```html
          <a class="service-box__cta" href="#contact" aria-label="${escapeHtml(cta)}: ${escapeHtml(title)}">
            ${escapeHtml(cta)} <span aria-hidden="true">→</span>
          </a>
  ```

  5b. Add a new `case "fix":` as the **first** case in `renderServiceArt`:
  ```ts
    case "fix":
      return `
        <svg class="service-art service-art--fix" data-service-art="fix" aria-hidden="true" viewBox="0 0 520 300">
          <rect class="art-stroke art-browser" x="38" y="28" width="284" height="244" rx="4" />
          <path class="art-stroke art-browser-bar" d="M38 62H322M58 45H66M74 45H82M90 45H98" />
          <g class="art-detail art-detail--one">
            <text class="art-label art-label--strong" x="62" y="88">Log</text>
            <path class="art-ui-line" d="M62 110h180M62 126h132M62 142h204" />
            <rect class="art-accent" x="62" y="156" width="196" height="18" rx="1" />
            <text class="art-label art-label--strong" x="70" y="169">Error</text>
            <path class="art-ui-line" d="M62 194h150M62 210h96M62 226h170" />
          </g>
          <g class="art-detail art-detail--two">
            <rect class="art-panel" x="362" y="42" width="124" height="96" rx="4" />
            <text class="art-label art-label--strong" x="424" y="66" text-anchor="middle" dominant-baseline="middle">Reproduce</text>
            <circle class="art-icon" cx="418" cy="100" r="11" />
            <path class="art-icon" d="m426 108 12 12M412 100h12M418 94v12" />
          </g>
          <g class="art-detail art-detail--three">
            <rect class="art-panel" x="362" y="166" width="124" height="96" rx="4" />
            <text class="art-label art-label--strong" x="424" y="190" text-anchor="middle" dominant-baseline="middle">Fixed</text>
            <circle class="art-status art-status--active" cx="424" cy="226" r="12" />
            <path class="art-check-small" d="m417 226 5 5 10-11" />
          </g>
          <path class="art-data-route" d="M322 90H362M322 214H362" />
        </svg>`;
  ```

  5c. Change `<a href="#services">Products</a>` to `<a href="#services">Services</a>`.

  5d. Between `<h2 id="services-heading" data-reveal>What do you need?</h2>` and `<div class="service-grid">${services}</div>` insert:
  ```html
        <nav class="need-selector" aria-label="Choose your need" data-reveal>
          <a class="need-link" href="#service-fix"><strong>Fix a system</strong><span>Bugs, failed integrations and code built by someone else.</span></a>
          <a class="need-link" href="#service-app"><strong>Build a product</strong><span>Web, mobile and desktop applications.</span></a>
          <a class="need-link" href="#service-other"><strong>Automate a process</strong><span>Repetitive work and tools that should talk to each other.</span></a>
        </nav>
  ```

- [x] **Step 6: Add CSS** in `src/styles.css` immediately before the `.service-grid {` rule:

```css
.need-selector {
  display: grid;
  gap: 0.75rem;
  margin-block: 1.5rem 3rem;
}

.need-link {
  display: grid;
  gap: 0.25rem;
  min-height: 44px;
  padding: 1rem 1.25rem;
  border: 1px solid var(--line-strong);
  color: var(--ink);
  text-decoration: none;
  transition: border-color 240ms var(--ease);
}

.need-link:hover,
.need-link:focus-visible {
  border-color: var(--accent);
}

.need-link strong {
  font-family: var(--font-display);
  font-size: var(--type-body);
  font-weight: 600;
}

.need-link span {
  color: var(--ink-muted);
  font-size: var(--type-small);
}

@media (min-width: 48rem) {
  .need-selector {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
```

- [x] **Step 7:** Run `npm test` (expect 85 passing: 84 − 3 + 3 + 1) and `npm run check`.

- [x] **Step 8: Update e2e counts** in `tests/e2e/responsive.spec.ts`: change `toHaveCount(5)` to `toHaveCount(6)` on the four lines that count `.service-box__cta` (≈80), `.service-box` (≈284), `.service-box__artwork .service-art` (≈307) and `serviceArtworks` (≈515). Do not change the `4` counts.

- [x] **Step 9:** Run `npx playwright test --project=uk-phone-standard --project=uk-desktop --project=stress-compact`.

**Downstream:** all covered in Steps 4 and 8. `hero__eyebrow` and hero copy are intentionally untouched here (Task 6).

**Done-when:**
- `npm test` → 85 passed
- `npm run check` → exit 0
- Playwright `uk-phone-standard`, `uk-desktop`, `stress-compact` → all passed
- `npm run build` → exit 0

**Commit:** `feat(services): add bug-fixing category, need selector and Services label`

---


### Task 6: State the B2B offer in the hero and explain the delivery process (F04, audit §16 copy)

**Copy source:** audit §16 "Texte propuse pentru oferta B2B", shortened where hero geometry requires. The H1 is deliberately kept to seven words so the hero still fits at 320×568 and 844×390 (both asserted by e2e).

**Branch:** `feat/f04-offer-and-process-copy`

**Files:**
- Read: `src/render.ts` (lines 382–384, 392–427, 435–440), `src/styles.css` (`.journey {` ≈ line 1228, `.contact-details` from Task 4), `tests/render.test.ts`
- Modify: `src/render.ts`, `src/styles.css`, `tests/render.test.ts`

**Steps:**

- [ ] **Step 1: Update pinned strings in `tests/render.test.ts`:**
  - `"makes the hero a direct product offer"`: replace `"Whatever your business needs next, we build it."` with `"We build, fix and connect business software."` and `"Bring us the problem. We will turn it into something useful."` with `"We build new applications, fix problems in existing software and connect the systems your team relies on."`.
  - `"uses the approved hero eyebrow service order"`: the expected eyebrow becomes `'<p class="hero__eyebrow" data-reveal>Development. Bug fixes. Automation.</p>'`; keep the `not.toContain` line.
  - `"places the seven-service pipeline above the hero actions"`: replace `html.indexOf("Bring us the problem.")` with `html.indexOf("connect the systems your team relies on.")`.
  - `"keeps the two section labels on a single semantic line"`: `"<p>What happens next</p>"` → `"<p>How we work</p>"`.
  - `"renders semantic navigation and contact landmarks"`: add `expect(html).toContain('href="#approach">How we work</a>');`.
  - Replace the whole test `"explains what happens after a client calls"` with:

```ts
  it("explains assessment, scope, build and handover", () => {
    expect(html).toContain("How we work");
    expect(html).toContain("Assess, agree, build, hand over.");
    expect(html.match(/class="journey__moment"/g)).toHaveLength(4);
    expect(html.match(/class="journey__signal"/g)).toHaveLength(4);
    expect(html).toContain("Tell us what is happening.");
    expect(html).toContain("Describe the problem or the goal. No polished brief needed.");
    expect(html).toContain("We assess and agree the scope.");
    expect(html).toContain(
      "You get a short written assessment, a proposed scope and an estimate before work starts.",
    );
    expect(html).toContain("We build and test.");
    expect(html).toContain("You see progress early and we test against the agreed scope.");
    expect(html).toContain("Handover you can rely on.");
    expect(html).toContain("We hand over with documentation and agree what happens after delivery.");
    expect(html).toContain(
      '<p class="journey__note" data-reveal>For a bug, the first step is a diagnosis. We confirm the cause before we promise a fix.</p>',
    );
    expect(html).not.toContain("One call. Then we make it simple.");
  });

  it("tells a visitor what to send in the first message", () => {
    const contact = html.match(/<section class="contact"[\s\S]*?<\/section>/)?.[0];

    expect(contact).toContain(
      "Tell us what your business needs, which system is involved and what outcome you want. For a bug, include the steps that trigger it and any deadline that matters.",
    );
    expect(contact).toContain(
      '<p class="contact-caution" data-reveal>Please do not send passwords or confidential customer data in your first message.</p>',
    );
    expect(contact).not.toContain("One click starts the conversation.");
  });
```

- [ ] **Step 2:** Run `npm test`. Expect failures only in the tests edited above.

- [ ] **Step 3: Edit `src/render.ts`.**
  - Eyebrow: `<p class="hero__eyebrow" data-reveal>Development. Bug fixes. Automation.</p>`
  - H1: `<h1 id="hero-heading" data-reveal>We build, fix and connect business software.</h1>`
  - Lead: `<p data-reveal>We build new applications, fix problems in existing software and connect the systems your team relies on.</p>`
  - Nav: `<a href="#approach">Process</a>` → `<a href="#approach">How we work</a>`
  - Journey heading: `<p>What happens next</p>` → `<p>How we work</p>`; `<h2 id="approach-heading">One call. Then we make it simple.</h2>` → `<h2 id="approach-heading">Assess, agree, build, hand over.</h2>`
  - The four `<div><h3>…</h3><p>…</p></div>` pairs become, in order:
    1. `<div><h3>Tell us what is happening.</h3><p>Describe the problem or the goal. No polished brief needed.</p></div>`
    2. `<div><h3>We assess and agree the scope.</h3><p>You get a short written assessment, a proposed scope and an estimate before work starts.</p></div>`
    3. `<div><h3>We build and test.</h3><p>You see progress early and we test against the agreed scope.</p></div>`
    4. `<div><h3>Handover you can rely on.</h3><p>We hand over with documentation and agree what happens after delivery.</p></div>`
  - Directly after the closing `</ol>` of `.journey__moments` insert:
    `<p class="journey__note" data-reveal>For a bug, the first step is a diagnosis. We confirm the cause before we promise a fix.</p>`
  - Contact: replace `<p data-reveal>One click starts the conversation.</p>` with
    ```html
        <p data-reveal>Tell us what your business needs, which system is involved and what outcome you want. For a bug, include the steps that trigger it and any deadline that matters.</p>
        <p class="contact-caution" data-reveal>Please do not send passwords or confidential customer data in your first message.</p>
    ```

- [ ] **Step 4: Add CSS** in `src/styles.css`. Immediately after the `.journey {` rule's closing brace:

```css
.journey__note {
  max-width: 62ch;
  color: var(--ink-muted);
  font-size: var(--type-small);
}
```

Immediately before `.contact-details {` (added in Task 4):

```css
.contact-caution {
  color: var(--ink-muted);
  font-size: var(--type-small);
}
```

- [ ] **Step 5:** Run `npm test` (expect 86 passing) and `npm run check`.

- [ ] **Step 6:** Run `npx playwright test --project=stress-compact --project=phone-landscape --project=uk-desktop`. The hero tests (`"hero contact actions stay in complete bounds"` and the three `"hero geometry is continuous …"` tests) are the ones at risk. If `stress-compact` fails **only** on hero action bounds, shorten the lead paragraph to `We build new applications, fix existing software and connect your systems.` in both `src/render.ts` and the two test strings that pin it, then rerun once. Do not change CSS.

**Downstream:** covered in Step 1. The e2e `#hero-heading + p` prose-width check still applies to the new lead.

**Done-when:**
- `npm test` → 86 passed
- `npm run check` → exit 0
- Playwright `stress-compact`, `phone-landscape`, `uk-desktop` → all passed

**Commit:** `feat(copy): state the build-fix-connect offer and explain the delivery process`

---

### Task 7: Privacy notice page with shared header and footer (F14)

**Design:** A second Vite page at `/solved-tech/privacy/`. Header and footer are extracted from `renderHomepage` into exported `renderSiteHeader(baseUrl, homeHref)` and `renderSiteFooter(baseUrl)`; the homepage passes `homeHref = ""` so its markup (and every existing test string) is unchanged. Enhancement functions move from `src/main.ts` to `src/enhance.ts` so the privacy entry can import them without triggering the homepage `start()`. The notice text carries `[[UPPER_SNAKE]]` tokens for facts only the founders know (H2); a test forbids tokens once `siteStatus.launched` is `true`.

**Branch:** `feat/f14-privacy-notice`

**Files:**
- Read: `src/main.ts` (whole), `src/render.ts` (lines 333–370, 442–446), `src/content.ts`, `vite.config.ts`, `index.html`, `tests/render.test.ts`, `tests/content.test.ts`, `tests/document.test.ts`, `tests/e2e/responsive.spec.ts` (lines 108–118)
- Create: `src/enhance.ts`, `src/privacy.ts`, `privacy/index.html`
- Modify: `src/main.ts`, `src/render.ts`, `src/content.ts`, `src/styles.css`, `vite.config.ts`, `tests/render.test.ts`, `tests/content.test.ts`, `tests/document.test.ts`, `tests/e2e/responsive.spec.ts`

**Steps:**

- [ ] **Step 1: Move enhancement code.** Create `src/enhance.ts` containing, verbatim, everything from `src/main.ts` between the line `import "./styles.css";` and the line `const start = (view: Window): void => {` — that is `stagger`, `setupRevealMotion`, `setupPipelineMotion`, `setupHeroInteraction`, `setupMobileMenu`, `setupHeaderOffset`, `setupScrollProgress`, `prefersReducedMotion`. Add `export` to `stagger` and `prefersReducedMotion`. Then reduce `src/main.ts` to:

```ts
/// <reference types="vite/client" />

import { contactConfig, siteContent } from "./content";
import {
  prefersReducedMotion,
  setupHeaderOffset,
  setupHeroInteraction,
  setupMobileMenu,
  setupPipelineMotion,
  setupRevealMotion,
  setupScrollProgress,
  stagger,
} from "./enhance";
import { renderHomepage } from "./render";
import "./styles.css";

export {
  setupHeaderOffset,
  setupHeroInteraction,
  setupMobileMenu,
  setupPipelineMotion,
  setupRevealMotion,
  setupScrollProgress,
} from "./enhance";

const start = (view: Window): void => {
  const app = view.document.querySelector<HTMLDivElement>("#app");

  if (!app) {
    throw new Error(
      "Cannot render the homepage: #app mount element is missing.",
    );
  }

  view.document.documentElement.classList.add("has-enhancement");
  app.innerHTML = renderHomepage(siteContent, contactConfig);

  const reducedMotion = prefersReducedMotion(view);

  stagger(app);
  setupHeaderOffset(view);
  setupRevealMotion(app, reducedMotion);
  setupPipelineMotion(app, reducedMotion);
  const finePointer = view.matchMedia("(pointer: fine)").matches;
  setupHeroInteraction(app, reducedMotion, finePointer);
  setupMobileMenu(app);
  setupScrollProgress(view);
};

if (typeof window !== "undefined") {
  start(window);
}
```

The `start` body above is today's body, unchanged. Run `npm test` and `npm run check` — both must still pass (the re-exports keep `tests/motion.test.ts` working).

- [ ] **Step 2: Add privacy content to `src/content.ts`** (append at the end):

```ts
export interface PrivacySection {
  heading: string;
  paragraphs: string[];
}

export interface PrivacyContent {
  title: string;
  updated: string;
  sections: PrivacySection[];
}

export const privacyContent: PrivacyContent = {
  title: "Privacy notice",
  updated: "[[PRIVACY_UPDATED_DATE]]",
  sections: [
    {
      heading: "Who we are",
      paragraphs: [
        "Solved Tech is operated by [[COMPANY_LEGAL_NAME]], [[COMPANY_REGISTERED_ADDRESS]]. We are the data controller for the personal data described in this notice.",
      ],
    },
    {
      heading: "What we collect and why",
      paragraphs: [
        "When you call us, message us on WhatsApp or email us, we receive the contact details you use and the content of your message. We use this information to answer your enquiry, to assess the work you ask about and to prepare a proposal.",
        "This website does not use cookies, analytics scripts or contact forms.",
      ],
    },
    {
      heading: "Legal basis",
      paragraphs: [
        "We rely on our legitimate interest in responding to business enquiries and, where we agree to work together, on taking steps to enter into a contract with you.",
      ],
    },
    {
      heading: "Who receives your data",
      paragraphs: [
        "Calls and WhatsApp messages are carried by [[PHONE_AND_WHATSAPP_PROVIDER]]. Email is processed by [[EMAIL_PROVIDER]]. We do not sell or share your details for marketing.",
      ],
    },
    {
      heading: "How long we keep it",
      paragraphs: [
        "We keep enquiry correspondence for [[RETENTION_PERIOD]] after our last contact, or for the duration of a contract and the period required afterwards for accounting and legal purposes.",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        "You can ask for access to, correction of or deletion of your personal data, object to or restrict our processing, and ask for a copy of the data you gave us. You can also complain to the Information Commissioner's Office at ico.org.uk.",
      ],
    },
  ],
};
```

- [ ] **Step 3: Add tests to `tests/content.test.ts`** (import `privacyContent` alongside the others):

```ts
  it("covers the privacy topics the audit requires", () => {
    expect(privacyContent.sections.map(({ heading }) => heading)).toEqual([
      "Who we are",
      "What we collect and why",
      "Legal basis",
      "Who receives your data",
      "How long we keep it",
      "Your rights",
    ]);
    expect(privacyContent.sections.every(({ paragraphs }) => paragraphs.length > 0)).toBe(true);
  });

  it("refuses to launch with unfilled privacy placeholders", () => {
    const tokens = JSON.stringify(privacyContent).match(/\[\[[A-Z_]+\]\]/g) ?? [];

    if (siteStatus.launched) {
      expect(tokens).toEqual([]);
    } else {
      expect(new Set(tokens)).toEqual(
        new Set([
          "[[PRIVACY_UPDATED_DATE]]",
          "[[COMPANY_LEGAL_NAME]]",
          "[[COMPANY_REGISTERED_ADDRESS]]",
          "[[PHONE_AND_WHATSAPP_PROVIDER]]",
          "[[EMAIL_PROVIDER]]",
          "[[RETENTION_PERIOD]]",
        ]),
      );
    }
  });
```

- [ ] **Step 4: Add renderer tests.** In `tests/render.test.ts` import `privacyContent` and `renderPrivacyPage`, update `"renders semantic navigation and contact landmarks"` to also expect `'<a href="/privacy/">Privacy notice</a>'`, and append a new describe block:

```ts
describe("privacy page renderer", () => {
  const html = renderPrivacyPage(privacyContent, contactConfig, "/solved-tech/");

  it("renders the notice with every section and a contact section from config", () => {
    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toContain('<h1 id="privacy-heading">Privacy notice</h1>');
    expect(html.match(/<h2>/g)).toHaveLength(privacyContent.sections.length + 1);
    expect(html).toContain("<h2>Contact</h2>");
    expect(html).toContain(contactConfig.email);
    expect(html).toContain(contactConfig.displayPhone);
    expect(html).not.toContain("ambient-grid");
    expect(html).not.toContain("data-reveal");
  });

  it("points the shared header at the homepage sections", () => {
    expect(html).toContain('<a class="wordmark" href="/solved-tech/#top"');
    expect(html).toContain('<a href="/solved-tech/#services">Services</a>');
    expect(html).toContain('<a href="/solved-tech/#contact">Contact</a>');
    expect(html).toContain('<nav id="primary-navigation"');
    expect(html).toContain('<main id="main-content" class="page">');
  });

  it("links back to the notice and to the top from the footer", () => {
    expect(html).toContain('<a href="/solved-tech/privacy/">Privacy notice</a>');
    expect(html).toContain('<a href="#top">Back to top</a>');
  });
});
```

- [ ] **Step 5: Add to `tests/document.test.ts`:**

```ts
const privacyHtml = readFileSync(
  new URL("../privacy/index.html", import.meta.url),
  "utf8",
);

describe("privacy document shell", () => {
  it("mirrors the homepage shell for the privacy page", () => {
    expect(privacyHtml).toContain('<html lang="en-GB">');
    expect(privacyHtml).toContain("<title>Privacy notice — Solved Tech</title>");
    expect(privacyHtml).toContain('<meta name="robots" content="noindex" />');
    expect(privacyHtml).toContain('<script type="module" src="/src/privacy.ts"></script>');
    expect(privacyHtml).toContain('<a class="skip-link" href="#main-content">Skip to content</a>');
  });
});
```

- [ ] **Step 6:** Run `npm test`; expect failures only in the new tests. `npm run check` fails until Step 7.

- [ ] **Step 7: Edit `src/render.ts`.**

  7a. Add two exported renderers above `renderHomepage`. Move the current header markup (from `<div id="top" class="page-top"></div>` through `</header>`) and footer markup (`<footer>…</footer>`) into them; the only edits inside the moved markup are the `${homeHref}` prefixes and the new footer link:

```ts
export const renderSiteHeader = (baseUrl: string, homeHref: string): string => `
    <div id="top" class="page-top"></div>
    <header class="site-header">
      <a class="wordmark" href="${escapeHtml(homeHref)}#top" aria-label="Solved Tech home">
        <img src="${escapeHtml(publicAssetUrl("/brand/solved-tech-logo-dark.svg", baseUrl))}" alt="Solved Tech — Your digital problems, solved." width="180" height="40" decoding="sync" />
      </a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" aria-label="Open menu">
        <span></span><span></span><span></span>
      </button>
      <nav id="primary-navigation" aria-label="Primary navigation">
        <a href="${escapeHtml(homeHref)}#services">Services</a>
        <a href="${escapeHtml(homeHref)}#approach">How we work</a>
        <a href="${escapeHtml(homeHref)}#team">Team</a>
        <a href="${escapeHtml(homeHref)}#contact">Contact</a>
      </nav>
    </header>`;

export const renderSiteFooter = (baseUrl: string): string => `
    <footer>
      <p>&copy; ${new Date().getFullYear()} Solved Tech</p>
      <a href="${escapeHtml(publicAssetUrl("/privacy/", baseUrl))}">Privacy notice</a>
      <a href="#top">Back to top</a>
    </footer>`;
```

  7b. In `renderHomepage`, replace the header block with `${renderSiteHeader(baseUrl, "")}` and the footer block with `${renderSiteFooter(baseUrl)}`.

  7c. In the contact section, after the `</dl>` of `.contact-details`, insert:
  ```html
        <p class="contact-privacy" data-reveal><a href="${escapeHtml(publicAssetUrl("/privacy/", baseUrl))}">How we handle the details you send us</a></p>
  ```

  7d. Add the page renderer after `renderHomepage`:

```ts
export const renderPrivacyPage = (
  content: PrivacyContent,
  config: ContactConfig,
  baseUrl: string = import.meta.env.BASE_URL,
): string => {
  const sections = content.sections
    .map(
      ({ heading, paragraphs }) => `
        <section>
          <h2>${escapeHtml(heading)}</h2>
          ${paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
        </section>`,
    )
    .join("");

  return `
    ${renderSiteHeader(baseUrl, baseUrl)}
    <main id="main-content" class="page">
      <article class="prose" aria-labelledby="privacy-heading">
        <p class="page__eyebrow">Last updated ${escapeHtml(content.updated)}</p>
        <h1 id="privacy-heading">${escapeHtml(content.title)}</h1>
        ${sections}
        <section>
          <h2>Contact</h2>
          <p>Email ${escapeHtml(config.email)} or call ${escapeHtml(config.displayPhone)} with any question about this notice or to exercise your rights.</p>
        </section>
      </article>
    </main>
    ${renderSiteFooter(baseUrl)}
  `;
};
```

  Add `PrivacyContent` to the type import at the top of the file.

- [ ] **Step 8: Create `privacy/index.html`:**

```html
<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="How Solved Tech handles the personal data you send when you contact us." />
    <meta name="robots" content="noindex" />
    <title>Privacy notice — Solved Tech</title>
  </head>
  <body>
    <a class="skip-link" href="#main-content">Skip to content</a>
    <div id="app"></div>
    <script type="module" src="/src/privacy.ts"></script>
  </body>
</html>
```

- [ ] **Step 9: Create `src/privacy.ts`:**

```ts
/// <reference types="vite/client" />

import { contactConfig, privacyContent } from "./content";
import { setupHeaderOffset, setupMobileMenu, setupScrollProgress } from "./enhance";
import { renderPrivacyPage } from "./render";
import "./styles.css";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Cannot render the privacy page: #app mount element is missing.");
}

app.innerHTML = renderPrivacyPage(privacyContent, contactConfig);
setupHeaderOffset(window);
setupMobileMenu(app);
setupScrollProgress(window);
```

- [ ] **Step 10: Replace `vite.config.ts` with:**

```ts
import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/solved-tech/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        privacy: resolve(import.meta.dirname, "privacy/index.html"),
      },
    },
  },
});
```

- [ ] **Step 11: Add CSS** at the end of `src/styles.css`, before the `/* Preferences` comment block:

```css
/* Secondary pages ------------------------------------------------------ */

.page {
  max-width: var(--shell);
  margin-inline: auto;
  padding: clamp(3rem, 8vh, 6rem) var(--gutter) var(--section-space);
}

.prose {
  display: grid;
  gap: 1rem;
  max-width: 68ch;
}

.prose h1 {
  font-size: var(--type-title);
}

.prose section {
  display: grid;
  gap: 0.75rem;
  margin-block-start: 1.5rem;
}

.prose h2 {
  font-size: var(--type-heading);
}

.page__eyebrow {
  color: var(--ink-muted);
  font-family: var(--font-mono);
  font-size: var(--type-small);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.contact-privacy a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  color: var(--ink-muted);
  text-underline-offset: 0.3em;
}
```

- [ ] **Step 12:** Run `npm test` (expect 92 passing), `npm run check`, `npm run build`. Confirm `ls dist/privacy/index.html` exists.

- [ ] **Step 13: E2E.** In `tests/e2e/responsive.spec.ts` change `await expect(footerLinks).toHaveCount(1);` to `toHaveCount(2)`. Append:

```ts
test("privacy notice page shares the header and footer", async ({ page }) => {
  const collector = setupErrorCollection(page);

  await page.goto("privacy/");
  await page.waitForLoadState("domcontentloaded");
  expect(new URL(page.url()).pathname).toBe("/solved-tech/privacy/");

  await expect(page.locator("h1")).toHaveText("Privacy notice");
  await expect(page.locator("#primary-navigation a")).toHaveCount(4);
  await expect(
    page.locator('#primary-navigation a[href="/solved-tech/#services"]'),
  ).toHaveCount(1);
  await expect(page.locator('footer a[href="/solved-tech/privacy/"]')).toHaveCount(1);
  await assertNoDocumentOverflow(page);
  assertNoRuntimeErrors(collector);
});
```

Then run `npx playwright test --project=uk-phone-standard --project=uk-desktop`.

**Downstream:** footer link count (Step 13); `tests/motion.test.ts` unchanged thanks to the re-exports.

**HUMAN STEP (H2):** replace the six `[[…]]` tokens in `privacyContent` with the confirmed facts and have the data-protection owner approve the text. The unlaunched branch of the token test must then be updated to `expect(tokens).toEqual([])` in both branches.

**Done-when:**
- `npm test` → 92 passed
- `npm run check` → exit 0
- `npm run build` → exit 0 and `dist/privacy/index.html` exists
- Playwright default subset → all passed

**Commit:** `feat(privacy): add a privacy notice page linked from contact and footer`

---

### Task 8: Visible pause control for continuous motion (F08)

**Facts:** exactly three animations in `src/styles.css` are `infinite`: `.code-field code` (`code-drift`, 18 s), `.hero-pipeline__node-ring` and `.hero-pipeline__signal` (9 s, running only while `.hero__pipeline.is-pipeline-visible`). WCAG 2.2.2 needs a pause mechanism for anything auto-playing longer than five seconds. The control is a text button placed directly after the hero actions. When the system already prefers reduced motion the CSS disables these loops, so the button is hidden and follows live preference changes.

**Branch:** `feat/f08-motion-pause-control`

**Files:**
- Read: `src/enhance.ts`, `src/main.ts`, `src/render.ts` (hero section), `src/styles.css` (lines 120–135, 540–600, and the `/* Secondary pages` block), `tests/motion.test.ts`, `tests/render.test.ts`
- Modify: `src/enhance.ts`, `src/main.ts`, `src/render.ts`, `src/styles.css`, `tests/motion.test.ts`, `tests/render.test.ts`, `tests/e2e/responsive.spec.ts`

**Steps:**

- [ ] **Step 1: Unit tests.** In `tests/motion.test.ts` add `setupMotionToggle` to the import from `../src/main`, then append this describe block before `describe("stylesheet contracts")`:

```ts
describe("motion toggle", () => {
  const createToggle = (reduceMotion: boolean) => {
    const attributes = new Map([["aria-pressed", "false"]]);
    const handlers = new Map<string, () => void>();
    const classes = new Set<string>();
    const button = {
      hidden: false,
      textContent: "Pause background motion",
      getAttribute: (name: string) => attributes.get(name) ?? null,
      setAttribute: (name: string, value: string) => attributes.set(name, value),
      addEventListener: (type: string, handler: () => void) =>
        handlers.set(type, handler),
    };
    let onChange: (() => void) | undefined;
    const query = {
      matches: reduceMotion,
      addEventListener: (_type: string, handler: () => void) => {
        onChange = handler;
      },
    };
    const view = {
      matchMedia: vi.fn(() => query),
      document: {
        documentElement: {
          classList: {
            toggle: (name: string, force: boolean) => {
              if (force) {
                classes.add(name);
              } else {
                classes.delete(name);
              }
              return force;
            },
          },
        },
      },
    };
    const root = { querySelector: vi.fn(() => button) } as unknown as ParentNode;

    setupMotionToggle(root, view as unknown as Window);

    return { attributes, button, classes, handlers, query, fireChange: () => onChange?.() };
  };

  it("pauses and resumes continuous motion through a pressed state", () => {
    const { attributes, button, classes, handlers } = createToggle(false);

    expect(button.hidden).toBe(false);

    handlers.get("click")?.();
    expect(attributes.get("aria-pressed")).toBe("true");
    expect(button.textContent).toBe("Resume background motion");
    expect(classes.has("motion-paused")).toBe(true);

    handlers.get("click")?.();
    expect(attributes.get("aria-pressed")).toBe("false");
    expect(button.textContent).toBe("Pause background motion");
    expect(classes.has("motion-paused")).toBe(false);
  });

  it("hides the control while the system reduces motion and follows live changes", () => {
    const { button, query, fireChange } = createToggle(true);

    expect(button.hidden).toBe(true);

    query.matches = false;
    fireChange();
    expect(button.hidden).toBe(false);
  });

  it("does nothing without a toggle in the document", () => {
    const matchMedia = vi.fn();

    setupMotionToggle(
      { querySelector: vi.fn(() => null) } as unknown as ParentNode,
      { matchMedia } as unknown as Window,
    );

    expect(matchMedia).not.toHaveBeenCalled();
  });
});
```

Inside `describe("stylesheet contracts")` append:

```ts
  it("pauses every infinite animation when motion is paused", () => {
    expect(styles).toMatch(
      /html\.motion-paused \.code-field code[\s\S]*?animation-play-state:\s*paused/,
    );
    expect(styles).toContain("html.motion-paused .hero__pipeline .hero-pipeline__signal");
    expect(styles).toContain("html.motion-paused .hero__pipeline .hero-pipeline__node-ring");
    expect(styles.match(/\binfinite\b/g)).toHaveLength(3);
  });
```

In `tests/render.test.ts` append:

```ts
  it("offers a visible control to pause background motion after the hero actions", () => {
    const actions = html.indexOf('class="hero__actions"');
    const toggle = html.indexOf(
      '<button class="motion-toggle" type="button" aria-pressed="false">Pause background motion</button>',
    );

    expect(toggle).toBeGreaterThan(actions);
    expect(toggle).toBeLessThan(html.indexOf('id="services"'));
  });
```

- [ ] **Step 2:** Run `npm test`; expect 5 failures. `npm run check` fails (missing export) — expected.

- [ ] **Step 3: Add to `src/enhance.ts`** (after `setupMobileMenu`):

```ts
export const setupMotionToggle = (root: ParentNode, view: Window): void => {
  const button = root.querySelector<HTMLButtonElement>(".motion-toggle");

  if (!button) {
    return;
  }

  const query = view.matchMedia("(prefers-reduced-motion: reduce)");
  const html = view.document.documentElement;

  const setPaused = (paused: boolean): void => {
    html.classList.toggle("motion-paused", paused);
    button.setAttribute("aria-pressed", String(paused));
    button.textContent = paused
      ? "Resume background motion"
      : "Pause background motion";
  };

  const syncPreference = (): void => {
    button.hidden = query.matches;
  };

  button.addEventListener("click", () => {
    setPaused(button.getAttribute("aria-pressed") !== "true");
  });
  query.addEventListener("change", syncPreference);
  syncPreference();
};
```

- [ ] **Step 4: Wire it in `src/main.ts`.** Add `setupMotionToggle` to both the import list and the `export { … } from "./enhance"` list, and call `setupMotionToggle(app, view);` directly after `setupMobileMenu(app);` in `start`.

- [ ] **Step 5: Render the button.** In `src/render.ts`, directly after `${renderContactActions(config, "hero__actions")}` insert:

```html
        <button class="motion-toggle" type="button" aria-pressed="false">Pause background motion</button>
```

- [ ] **Step 6: CSS.** Add to `src/styles.css` immediately before the `/* Secondary pages` comment:

```css
.motion-toggle {
  justify-self: start;
  align-self: start;
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 0.25rem;
  border: 0;
  border-block-end: 1px solid var(--line-strong);
  background: transparent;
  color: var(--ink-muted);
  font: inherit;
  font-size: var(--type-small);
  cursor: pointer;
}

.motion-toggle[hidden] {
  display: none;
}

html.motion-paused .code-field code,
html.motion-paused .hero__pipeline .hero-pipeline__signal,
html.motion-paused .hero__pipeline .hero-pipeline__node-ring {
  animation-play-state: paused;
}
```

The three-class selector for the pipeline is required: `.hero__pipeline.is-pipeline-visible .hero-pipeline__signal { animation-play-state: running }` already has three class selectors, and the `html` type selector makes the paused rule win without `!important`.

- [ ] **Step 7:** Run `npm test` (expect 97 passing) and `npm run check`.

- [ ] **Step 8: E2E.** Append to `tests/e2e/responsive.spec.ts`:

```ts
test("background motion can be paused from a visible control", async ({ page }) => {
  const collector = setupErrorCollection(page);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await gotoHome(page);

  const toggle = page.locator(".motion-toggle");
  const signal = page.locator(".hero-pipeline__signal");
  const playState = () =>
    signal.evaluate((element) => getComputedStyle(element).animationPlayState);

  await page.locator(".hero__pipeline").scrollIntoViewIfNeeded();
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await expect.poll(playState).toBe("running");

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(toggle).toHaveText("Resume background motion");
  await expect(page.locator("html")).toHaveClass(/motion-paused/);
  await expect.poll(playState).toBe("paused");

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await expect.poll(playState).toBe("running");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(toggle).toBeHidden();

  assertNoRuntimeErrors(collector);
});
```

Run `npx playwright test --project=uk-phone-standard --project=uk-desktop --project=phone-landscape`.

**Downstream:** none. The button carries no `data-reveal`, so the reduced-motion e2e loop is unaffected.

**Done-when:**
- `npm test` → 97 passed
- `npm run check` → exit 0
- Playwright `uk-phone-standard`, `uk-desktop`, `phone-landscape` → all passed

**Commit:** `feat(motion): add a visible pause control for continuous background animation`

---

### Task 9: Responsive WebP portraits under 150 KB (F09)

**Facts:** `razvan_cristofor.png` is 1,821,715 bytes at 1040×1222; `remus_baciu.png` is 163,043 bytes at 340×400 and is upscaled to 520×620 on screen. Target: every portrait file under 150 KB, WebP, with a `srcset` where a larger source exists. The `width="520" height="620"` attributes stay unchanged; they only reserve aspect ratio.

**Branch:** `perf/f09-portraits`

**Files:**
- Read: `src/content.ts` (founders), `src/render.ts` (founders map), `tests/content.test.ts`, `tests/render.test.ts`
- Create: `tests/assets.test.ts`, `public/team/razvan_cristofor-520.webp`, `public/team/razvan_cristofor-1040.webp`, `public/team/remus_baciu-340.webp`
- Delete (via `git rm`): `public/team/razvan_cristofor.png`, `public/team/remus_baciu.png`
- Modify: `src/content.ts`, `src/render.ts`, `tests/content.test.ts`, `tests/render.test.ts`

**Steps:**

- [ ] **Step 1: Check for an encoder.** Run `command -v cwebp; command -v magick; command -v convert`. Use the first one found:
  - `cwebp`:
    ```bash
    cwebp -q 82 -resize 520 0 public/team/razvan_cristofor.png -o public/team/razvan_cristofor-520.webp
    cwebp -q 82 public/team/razvan_cristofor.png -o public/team/razvan_cristofor-1040.webp
    cwebp -q 82 public/team/remus_baciu.png -o public/team/remus_baciu-340.webp
    ```
  - `magick` (or `convert`): same three outputs with `magick <in> -resize 520x -quality 82 <out>` for the first and `-quality 82` only for the other two.
  - **None found → HUMAN STEP (H3).** Stop, write the report with `OPEN QUESTIONS: no WebP encoder on this machine; assets needed at the three paths above`. Do not commit anything.

  Verify sizes with `ls -l public/team/*.webp`; each must be under 153,600 bytes. If the 1040 variant is larger, re-encode it with `-q 74` once. If still larger, report and stop.

- [ ] **Step 2: Create `tests/assets.test.ts`:**

```ts
import { statSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { siteContent } from "../src/content";

const PORTRAIT_BUDGET_BYTES = 150 * 1024;

describe("portrait assets", () => {
  it("ships every portrait as WebP under the audit budget", () => {
    siteContent.founders.forEach(({ image, imageSources }) => {
      [image, ...imageSources.map(({ path }) => path)].forEach((path) => {
        const { size } = statSync(new URL(`../public${path}`, import.meta.url));

        expect(path).toMatch(/\.webp$/);
        expect(size, path).toBeGreaterThan(0);
        expect(size, path).toBeLessThan(PORTRAIT_BUDGET_BYTES);
      });
    });
  });
});
```

- [ ] **Step 3: Update `src/content.ts`.** Change `FounderProfile` to:

```ts
export interface FounderImageSource {
  path: string;
  width: number;
}

export interface FounderProfile {
  name: string;
  role: string;
  image: string;
  imageSources: FounderImageSource[];
  linkedin: string;
}
```

and the founders to:

```ts
    {
      name: "Razvan Cristofor",
      role: "Co-founder — Apps & SEO Expert",
      image: "/team/razvan_cristofor-520.webp",
      imageSources: [
        { path: "/team/razvan_cristofor-520.webp", width: 520 },
        { path: "/team/razvan_cristofor-1040.webp", width: 1040 },
      ],
      linkedin: "https://www.linkedin.com/in/razvan-cristofor-7ba16b105/",
    },
    {
      name: "Remus Baciu",
      role: "Co-founder — Senior Software Engineer",
      image: "/team/remus_baciu-340.webp",
      imageSources: [],
      linkedin: "https://www.linkedin.com/in/remus-baciu-4a11a7105/",
    },
```

- [ ] **Step 4: Update tests.** In `tests/content.test.ts` `"defines the approved founders with Razvan first"` expect the two objects from Step 3. In `tests/render.test.ts` `"prefixes public assets for a GitHub Pages project site"` replace the two `.png` expectations with `src="/solved-tech/team/razvan_cristofor-520.webp"` and `src="/solved-tech/team/remus_baciu-340.webp"`, and add `expect(pagesHtml).toContain('srcset="/solved-tech/team/razvan_cristofor-520.webp 520w, /solved-tech/team/razvan_cristofor-1040.webp 1040w" sizes="(min-width: 48rem) 26rem, 80vw"');`. In `"renders two founder cards with portraits and LinkedIn links"` add `expect(html.match(/ srcset="/g)).toHaveLength(1);`.

- [ ] **Step 5: Update the renderer.** In `renderHomepage`'s founders map, destructure `imageSources` and build the image tag as:

```ts
        const srcset = imageSources.length
          ? ` srcset="${imageSources
              .map(({ path, width }) => `${escapeHtml(publicAssetUrl(path, baseUrl))} ${width}w`)
              .join(", ")}" sizes="(min-width: 48rem) 26rem, 80vw"`
          : "";
```

and `<img src="${escapeHtml(publicAssetUrl(image, baseUrl))}"${srcset} alt="Portrait of ${escapeHtml(name)}" width="520" height="620" loading="lazy" />`. (Convert the arrow body to a block with a `return` to hold the `srcset` constant.)

- [ ] **Step 6:** `git rm public/team/razvan_cristofor.png public/team/remus_baciu.png`. Run `npm test` (expect 98 passing), `npm run check`, `npm run build`, then `npx playwright test --project=uk-phone-standard --project=uk-desktop`.

**Downstream:** covered in Step 4.

**HUMAN STEP (H3):** Remus's source is 340×400; ask for an original at least 680 px wide, then add `remus_baciu-680.webp` to `imageSources` the same way.

**Done-when:**
- `npm test` → 98 passed
- `ls -l public/team/` shows only `.svg` placeholders and the three `.webp` files, each < 153,600 bytes
- Playwright default subset → all passed

**Commit:** `perf(team): serve responsive WebP portraits under 150 KB`

---

### Task 10: Annotate intent targets for measurement, without a vendor (F16)

**Scope:** No analytics script is added (vendor choice is H6). Every intent target gets stable `data-*` attributes so that any later, privacy-respecting integration can bind the audit's proposed events (`service_interest`, `contact_click`) without touching markup again.

**Branch:** `feat/f16-measurement-attributes`

**Files:**
- Read: `src/render.ts` (`renderContactActions`, services map, need selector), `tests/render.test.ts`
- Modify: `src/render.ts`, `tests/render.test.ts`

**Steps:**

- [ ] **Step 1: Failing test** appended to `tests/render.test.ts`:

```ts
  it("annotates intent targets for measurement without loading any script", () => {
    expect(html.match(/data-analytics="contact_click"/g)).toHaveLength(6);
    expect(html.match(/data-channel="call"/g)).toHaveLength(2);
    expect(html.match(/data-channel="whatsapp"/g)).toHaveLength(2);
    expect(html.match(/data-channel="email"/g)).toHaveLength(2);
    expect(html.match(/data-placement="hero"/g)).toHaveLength(3);
    expect(html.match(/data-placement="contact"/g)).toHaveLength(3);
    expect(html.match(/data-analytics="service_interest"/g)).toHaveLength(9);
    siteContent.products.forEach(({ id }) =>
      expect(html).toContain(`data-service-id="${id}" data-placement="service-box"`),
    );
    ["fix", "app", "other"].forEach((id) =>
      expect(html).toContain(`data-service-id="${id}" data-placement="need-selector"`),
    );
    expect(html).not.toContain("<script");
    expect(html).not.toMatch(/gtag|googletagmanager|plausible|umami|analytics\.js/);
  });
```

- [ ] **Step 2:** Run `npm test`; expect 1 failure.

- [ ] **Step 3: Edit `src/render.ts`.**
  - In `renderContactActions` add `const placement = isHero ? "hero" : "contact";` after `isHero`, and append ` data-analytics="contact_click" data-channel="call" data-placement="${placement}"` to the call link, `data-channel="whatsapp"` to the WhatsApp link and `data-channel="email"` to the email link, in **both** branches, placing the attributes immediately before the closing `>` of each `<a …>` opening tag.
  - Service CTA opening tag becomes `<a class="service-box__cta" href="#contact" aria-label="…" data-analytics="service_interest" data-service-id="${escapeHtml(id)}" data-placement="service-box">`.
  - Each need link gains ` data-analytics="service_interest" data-service-id="fix|app|other" data-placement="need-selector"` after its `href`.

- [ ] **Step 4:** Run `npm test` (expect 99 passing), `npm run check`, and `npx playwright test --project=uk-phone-standard`.

**Downstream:** none (the contact-group regexes in `render.test.ts` tolerate extra attributes).

**Note for H6:** when a vendor is chosen, load it from `scripts/prerender.mts` (Task 12) only when `siteStatus.launched` is `true`, bind to `[data-analytics]` via event delegation, never send URL fragments, message text or personal data, and add the vendor to the privacy notice before enabling it.

**Done-when:**
- `npm test` → 99 passed
- Playwright `uk-phone-standard` → all passed

**Commit:** `feat(analytics): annotate intent targets with data attributes`

---

### Task 11: Gated proof section and FAQ (F03, audit §16 questions)

**Scope split:** No case study, client name, metric or logo exists that the agent may publish. The agent ships (a) typed content slots for case studies and FAQ answers, (b) renderers that emit **nothing** until approved content exists, and (c) tests that keep the slots honest. The founders fill the slots in **HUMAN STEP (H4)**; the sections appear automatically once they do. The four FAQ questions are the audit's own list (§16 "Întrebări la care site-ul ar trebui să răspundă"); the answers are `[[…]]` tokens.

**Branch:** `feat/f03-proof-and-faq-slots`

**Files:**
- Read: `src/content.ts`, `src/render.ts` (journey → team → contact sequence, ≈ lines 420–445 after Task 6), `src/styles.css` (`.team {` block ≈ line 1434), `tests/content.test.ts`, `tests/render.test.ts`
- Modify: `src/content.ts`, `src/render.ts`, `src/styles.css`, `tests/content.test.ts`, `tests/render.test.ts`

**Steps:**

- [ ] **Step 1: Content tests.** Append inside `describe("site content")` in `tests/content.test.ts`:

```ts
  it("ships no case study until one is approved for publication", () => {
    siteContent.caseStudies.forEach((study) => {
      expect(study.id).toMatch(/^[a-z0-9-]+$/);
      expect(study.technologies.length).toBeGreaterThan(0);
      Object.values(study).forEach((value) =>
        expect(JSON.stringify(value)).not.toMatch(/\[\[[A-Z_]+\]\]/),
      );
    });
    if (!siteStatus.launched) {
      expect(siteContent.caseStudies).toEqual([]);
    }
  });

  it("asks the four audit questions and refuses to launch with unfilled answers", () => {
    expect(siteContent.faq.map(({ question }) => question)).toEqual([
      "Can you work on software built by another team?",
      "What do you need to investigate an issue?",
      "How do you estimate the work and agree the scope?",
      "What happens after delivery?",
    ]);

    const unfilled = siteContent.faq.filter(({ answer }) => /\[\[[A-Z_]+\]\]/.test(answer));

    if (siteStatus.launched) {
      expect(unfilled).toEqual([]);
    } else {
      expect(unfilled.map(({ answer }) => answer)).toEqual([
        "[[FAQ_ANSWER_EXISTING_SOFTWARE]]",
        "[[FAQ_ANSWER_INVESTIGATION]]",
        "[[FAQ_ANSWER_ESTIMATE]]",
        "[[FAQ_ANSWER_AFTER_DELIVERY]]",
      ]);
    }
  });
```

- [ ] **Step 2: Renderer tests.** Append a new describe block at the end of `tests/render.test.ts` (outside `describe("homepage renderer")`):

```ts
describe("proof and FAQ sections", () => {
  const html = renderHomepage(siteContent, contactConfig, "/");
  const study = {
    id: "example",
    title: "Example title",
    client: "Example client (anonymised)",
    situation: "Example situation.",
    contribution: "Example contribution.",
    deliverable: "Example deliverable.",
    technologies: ["TypeScript", "PostgreSQL"],
    result: "Example result.",
  };

  it("renders neither section until approved content exists", () => {
    expect(html).not.toContain('id="work"');
    expect(html).not.toContain('id="faq"');
    expect(html).not.toMatch(/\[\[[A-Z_]+\]\]/);
  });

  it("renders approved case studies between the team and contact sections", () => {
    const withProof = renderHomepage(
      { ...siteContent, caseStudies: [study] },
      contactConfig,
      "/",
    );
    const work = withProof.indexOf('<section id="work" class="work" aria-labelledby="work-heading">');

    expect(work).toBeGreaterThan(withProof.indexOf('id="team"'));
    expect(work).toBeLessThan(withProof.indexOf('id="contact"'));
    expect(withProof).toContain('<h2 id="work-heading" data-reveal>Problems we have solved</h2>');
    expect(withProof).toContain('<article class="case-study" id="work-example" data-reveal>');
    expect(withProof).toContain('<p class="case-study__client">Example client (anonymised)</p>');
    expect(withProof).toContain("<h3>Example title</h3>");
    expect(withProof).toContain("<dt>Situation</dt><dd>Example situation.</dd>");
    expect(withProof).toContain("<dt>What we did</dt><dd>Example contribution.</dd>");
    expect(withProof).toContain("<dt>Delivered</dt><dd>Example deliverable.</dd>");
    expect(withProof).toContain("<dt>Result</dt><dd>Example result.</dd>");
    expect(withProof).toContain(
      '<ul class="case-study__stack" aria-label="Technologies"><li>TypeScript</li><li>PostgreSQL</li></ul>',
    );
  });

  it("renders only FAQ entries whose answers are approved", () => {
    const withFaq = renderHomepage(
      {
        ...siteContent,
        faq: [
          { question: "Answered question?", answer: "Answered." },
          { question: "Pending question?", answer: "[[FAQ_ANSWER_PENDING]]" },
        ],
      },
      contactConfig,
      "/",
    );
    const faq = withFaq.indexOf('<section id="faq" class="faq" aria-labelledby="faq-heading">');

    expect(faq).toBeGreaterThan(withFaq.indexOf('id="approach"'));
    expect(faq).toBeLessThan(withFaq.indexOf('id="team"'));
    expect(withFaq).toContain('<h2 id="faq-heading" data-reveal>Questions we are often asked</h2>');
    expect(withFaq).toContain("<dt>Answered question?</dt>");
    expect(withFaq).toContain("<dd>Answered.</dd>");
    expect(withFaq).not.toContain("Pending question?");
    expect(withFaq).not.toContain("[[FAQ_ANSWER_PENDING]]");
  });
});
```

- [ ] **Step 3:** Run `npm test`. Expect the 2 content tests and 3 render tests to fail; `npm run check` fails on the missing properties — expected.

- [ ] **Step 4: Edit `src/content.ts`.** Add the two interfaces directly above `export interface SiteContent`:

```ts
export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  situation: string;
  contribution: string;
  deliverable: string;
  technologies: string[];
  result: string;
}

export interface FaqEntry {
  question: string;
  answer: string;
}
```

Extend `SiteContent` with two properties after `founders: FounderProfile[];`:

```ts
  caseStudies: CaseStudy[];
  faq: FaqEntry[];
```

Append to the `siteContent` object literal after the `founders: [ … ],` entry:

```ts
  caseStudies: [],
  faq: [
    {
      question: "Can you work on software built by another team?",
      answer: "[[FAQ_ANSWER_EXISTING_SOFTWARE]]",
    },
    {
      question: "What do you need to investigate an issue?",
      answer: "[[FAQ_ANSWER_INVESTIGATION]]",
    },
    {
      question: "How do you estimate the work and agree the scope?",
      answer: "[[FAQ_ANSWER_ESTIMATE]]",
    },
    {
      question: "What happens after delivery?",
      answer: "[[FAQ_ANSWER_AFTER_DELIVERY]]",
    },
  ],
```

- [ ] **Step 5: Edit `src/render.ts`.** Add `CaseStudy` and `FaqEntry` to the type import. Add these three constants above `renderHomepage`:

```ts
const hasPlaceholder = (value: string): boolean => /\[\[[A-Z_]+\]\]/.test(value);

const renderCaseStudies = (studies: CaseStudy[]): string => {
  if (studies.length === 0) {
    return "";
  }

  const cards = studies
    .map(
      ({ id, title, client, situation, contribution, deliverable, technologies, result }) => `
          <article class="case-study" id="work-${escapeHtml(id)}" data-reveal>
            <p class="case-study__client">${escapeHtml(client)}</p>
            <h3>${escapeHtml(title)}</h3>
            <dl class="case-study__facts">
              <div><dt>Situation</dt><dd>${escapeHtml(situation)}</dd></div>
              <div><dt>What we did</dt><dd>${escapeHtml(contribution)}</dd></div>
              <div><dt>Delivered</dt><dd>${escapeHtml(deliverable)}</dd></div>
              <div><dt>Result</dt><dd>${escapeHtml(result)}</dd></div>
            </dl>
            <ul class="case-study__stack" aria-label="Technologies">${technologies.map((technology) => `<li>${escapeHtml(technology)}</li>`).join("")}</ul>
          </article>`,
    )
    .join("");

  return `
      <section id="work" class="work" aria-labelledby="work-heading">
        <div class="work__heading">
          <p data-reveal>Recent work</p>
          <h2 id="work-heading" data-reveal>Problems we have solved</h2>
        </div>
        <div class="work__grid">${cards}</div>
      </section>`;
};

const renderFaq = (entries: FaqEntry[]): string => {
  const answered = entries.filter(({ answer }) => !hasPlaceholder(answer));

  if (answered.length === 0) {
    return "";
  }

  const items = answered
    .map(
      ({ question, answer }) => `
          <div class="faq__item" data-reveal>
            <dt>${escapeHtml(question)}</dt>
            <dd>${escapeHtml(answer)}</dd>
          </div>`,
    )
    .join("");

  return `
      <section id="faq" class="faq" aria-labelledby="faq-heading">
        <div class="faq__heading">
          <p data-reveal>Before you get in touch</p>
          <h2 id="faq-heading" data-reveal>Questions we are often asked</h2>
        </div>
        <dl class="faq__list">${items}</dl>
      </section>`;
};
```

In `renderHomepage`'s returned template, insert `${renderFaq(content.faq)}` on its own line between the closing `</section>` of the journey (`id="approach"`) section and `<section id="team"`, and insert `${renderCaseStudies(content.caseStudies)}` between the closing `</section>` of the team section and `<section class="contact"`.

- [ ] **Step 6: CSS.** Add to `src/styles.css` immediately after the `.founder__details a` rules end (search for the last rule whose selector starts with `.founder` and insert after its closing brace):

```css
/* Proof and FAQ ------------------------------------------------------- */

.work,
.faq {
  display: grid;
  gap: clamp(2rem, 5vw, 4rem);
}

.work__heading,
.faq__heading {
  display: grid;
  gap: 0.75rem;
}

.work__heading > p,
.faq__heading > p {
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: var(--type-small);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.work__heading h2,
.faq__heading h2 {
  max-width: 16ch;
  font-size: var(--type-title);
  line-height: 1.08;
}

.work__grid {
  display: grid;
  gap: clamp(2rem, 4vw, 3rem);
}

.case-study {
  display: grid;
  gap: 1rem;
  border-block-start: 1px solid var(--line-strong);
  padding-block-start: 1rem;
}

.case-study__client {
  color: var(--ink-muted);
  font-size: var(--type-small);
}

.case-study h3 {
  font-size: var(--type-heading);
}

.case-study__facts {
  display: grid;
  gap: 0.75rem;
}

.case-study__facts dt {
  color: var(--ink-muted);
  font-size: var(--type-small);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.case-study__facts dd {
  max-width: 62ch;
}

.case-study__stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0;
  list-style: none;
}

.case-study__stack li {
  border: 1px solid var(--line);
  padding: 0.25rem 0.6rem;
  font-family: var(--font-mono);
  font-size: var(--type-small);
}

.faq__list {
  display: grid;
  gap: 1.5rem;
}

.faq__item {
  display: grid;
  gap: 0.5rem;
  border-block-start: 1px solid var(--line);
  padding-block-start: 1rem;
}

.faq__item dt {
  font-family: var(--font-display);
  font-size: var(--type-heading);
}

.faq__item dd {
  max-width: 62ch;
  color: var(--ink-muted);
}

@media (min-width: 48rem) {
  .work__grid {
    grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  }

  .faq__item {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
    gap: 2rem;
  }
}
```

- [ ] **Step 7:** Run `npm test` (expect 104 passing), `npm run check`, `npm run build`, then `npx playwright test --project=uk-phone-standard --project=uk-desktop`. Because both sections are empty at baseline, the rendered homepage is byte-identical to Task 10's output; the e2e run only confirms nothing regressed.

**Downstream:** none. No nav link is added (the `#primary-navigation a` count of 4 stays pinned).

**HUMAN STEP (H4):** For each approved example, add a `CaseStudy` object to `siteContent.caseStudies` with a real anonymised client description, no unconfirmed figures and written publication rights on file. Replace the four `[[FAQ_ANSWER_…]]` tokens with answers that reflect actual practice; per the audit, do not state free work, 24/7 availability, guaranteed deadlines, NDA or included maintenance unless confirmed. Once filled, the unlaunched branch of the FAQ test must expect `[]`.

**Done-when:**
- `npm test` → 104 passed
- `npm run check` → exit 0
- Playwright `uk-phone-standard`, `uk-desktop` → all passed

**Commit:** `feat(proof): add gated case-study and FAQ sections driven by content`

---

### Task 12: Prerender the commercial content and add launch-gated metadata (F10, F13, F11 launch half)

**Design:** `npm run build` becomes `tsc && vite build && node scripts/prerender.mts`. The script loads `src/render.ts`, `src/content.ts` and a new `src/head.ts` through Vite's module runner (so extensionless imports and `import.meta.env.BASE_URL` resolve exactly as in the browser), renders each page, and writes the markup into the `<div id="app">` of the corresponding `dist/**/index.html`. Runtime `start()` keeps re-rendering into `#app`, so behaviour with JavaScript is unchanged; without JavaScript the H1, services, team and contact links are already in the HTML (audit F10 acceptance). `src/head.ts` holds pure, unit-tested functions for the `<head>`: nothing changes before launch (the shell's `noindex` stays); after launch (`siteStatus.launched === true` with a `productionOrigin`) the `noindex` is stripped from indexable pages and canonical, Open Graph, Twitter and an Organization JSON-LD built only from visible facts are injected. The homepage `<title>`/description become descriptive (F13) and are owned by `head.ts`.

**Branch:** `feat/f10-f13-prerender-and-metadata`

**Files:**
- Read: `src/content.ts` (`SiteStatus`, `siteStatus`, `contactConfig`, founders), `src/render.ts` (`escapeHtml`, `publicAssetUrl`, `renderHomepage`, `renderPrivacyPage`), `src/main.ts`, `index.html`, `privacy/index.html`, `package.json`, `tests/document.test.ts`, `tests/content.test.ts`
- Create: `src/head.ts`, `scripts/prerender.mts`, `tests/head.test.ts`
- Modify: `src/content.ts`, `src/render.ts`, `index.html`, `package.json` (the `build` script line only), `tests/document.test.ts`, `tests/content.test.ts`

**Steps:**

- [ ] **Step 1: Make the launch state carry its origin.** In `src/content.ts` replace the `SiteStatus` interface from Task 4 with:

```ts
export type SiteStatus =
  | { launched: false }
  | { launched: true; productionOrigin: string };
```

`siteStatus` stays `{ launched: false }`. Append to `tests/content.test.ts` inside `describe("site content")`:

```ts
  it("names the production origin only once launched", () => {
    if (siteStatus.launched) {
      expect(siteStatus.productionOrigin).toMatch(/^https:\/\/[a-z0-9.-]+$/);
    } else {
      expect("productionOrigin" in siteStatus).toBe(false);
    }
  });
```

- [ ] **Step 2: Export the two helpers.** In `src/render.ts` add `export` in front of `const escapeHtml` and `const publicAssetUrl`. Nothing else changes in this file.

- [ ] **Step 3: Create `tests/head.test.ts`:**

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contactConfig, siteContent } from "../src/content";
import {
  homePage,
  injectPrerender,
  privacyPage,
  renderHeadTags,
  renderOrganizationJsonLd,
} from "../src/head";

const shell = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const preview = { launched: false } as const;
const live = { launched: true, productionOrigin: "https://example.test" } as const;

describe("head metadata", () => {
  it("adds nothing to the shell before launch", () => {
    expect(renderHeadTags(homePage, preview, "/solved-tech/")).toBe("");
    expect(renderOrganizationJsonLd(preview, siteContent, contactConfig, "/solved-tech/")).toBe("");
  });

  it("emits canonical, Open Graph and Twitter tags for indexable pages after launch", () => {
    const tags = renderHeadTags(homePage, live, "/solved-tech/");

    expect(tags).toContain('<link rel="canonical" href="https://example.test/solved-tech/" />');
    expect(tags).toContain('<meta property="og:type" content="website" />');
    expect(tags).toContain('<meta property="og:site_name" content="Solved Tech" />');
    expect(tags).toContain(`<meta property="og:title" content="${homePage.title}" />`);
    expect(tags).toContain(`<meta property="og:description" content="${homePage.description}" />`);
    expect(tags).toContain('<meta property="og:url" content="https://example.test/solved-tech/" />');
    expect(tags).toContain(
      '<meta property="og:image" content="https://example.test/solved-tech/brand/solved-tech-social.png" />',
    );
    expect(tags).toContain('<meta name="twitter:card" content="summary_large_image" />');
  });

  it("keeps non-indexable pages out of the index after launch", () => {
    expect(privacyPage.indexable).toBe(false);
    expect(renderHeadTags(privacyPage, live, "/solved-tech/")).toBe("");
  });

  it("describes the organisation with visible facts only", () => {
    const script = renderOrganizationJsonLd(live, siteContent, contactConfig, "/solved-tech/");
    const json = script.replace(/^<script type="application\/ld\+json">/, "").replace(/<\/script>$/, "");
    const data = JSON.parse(json);

    expect(data).toEqual({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Solved Tech",
      url: "https://example.test/solved-tech/",
      logo: "https://example.test/solved-tech/brand/solved-tech-logo-dark.svg",
      email: contactConfig.email,
      telephone: contactConfig.phone,
      founder: siteContent.founders.map(({ name, linkedin }) => ({
        "@type": "Person",
        name,
        sameAs: linkedin,
      })),
    });
    expect(script).not.toMatch(/aggregateRating|review|award|address/);
  });

  it("escapes closing tags inside JSON-LD", () => {
    const script = renderOrganizationJsonLd(
      live,
      { ...siteContent, founders: [{ ...siteContent.founders[0], name: "</script><b>" }] },
      contactConfig,
      "/",
    );

    expect(script).not.toContain("</script><b>");
    expect(script).toContain("\\u003c/script>\\u003cb>");
  });
});

describe("prerender injection", () => {
  it("fills the mount, syncs title and description, and keeps noindex before launch", () => {
    const html = injectPrerender({
      shell,
      appHtml: "<h1>Rendered</h1>",
      headTags: "",
      page: homePage,
      status: preview,
    });

    expect(html).toContain('<div id="app"><h1>Rendered</h1></div>');
    expect(html).toContain(`<title>${homePage.title}</title>`);
    expect(html).toContain(`<meta name="description" content="${homePage.description}" />`);
    expect(html).toContain('<meta name="robots" content="noindex" />');
  });

  it("strips noindex and injects tags for indexable pages after launch", () => {
    const html = injectPrerender({
      shell,
      appHtml: "<h1>Rendered</h1>",
      headTags: '<link rel="canonical" href="https://example.test/" />',
      page: homePage,
      status: live,
    });

    expect(html).not.toContain('name="robots"');
    expect(html).toContain('<link rel="canonical" href="https://example.test/" />\n  </head>');
  });

  it("refuses a shell without the mount", () => {
    expect(() =>
      injectPrerender({
        shell: "<html><head></head><body></body></html>",
        appHtml: "",
        headTags: "",
        page: homePage,
        status: preview,
      }),
    ).toThrow('Cannot prerender "/": the shell has no <div id="app"></div> mount.');
  });
});
```

- [ ] **Step 4: Document shell tests.** In `tests/document.test.ts` import `homePage` from `../src/head` and append inside `describe("document shell")`:

```ts
  it("uses the descriptive title and description owned by head.ts", () => {
    expect(indexHtml).toContain(`<title>${homePage.title}</title>`);
    expect(indexHtml).toContain(`<meta name="description" content="${homePage.description}" />`);
  });
```

- [ ] **Step 5:** Run `npm test`; expect the 1 content, 8 head and 1 document tests to fail (`head.ts` missing). `npm run check` fails — expected.

- [ ] **Step 6: Create `src/head.ts`:**

```ts
import type { ContactConfig, SiteContent, SiteStatus } from "./content";
import { escapeHtml, publicAssetUrl } from "./render";

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  indexable: boolean;
}

export const homePage: PageMeta = {
  path: "/",
  title: "Solved Tech — Software development, bug fixes and automation",
  description:
    "Solved Tech builds new applications, fixes problems in existing software and connects the systems UK businesses rely on.",
  indexable: true,
};

export const privacyPage: PageMeta = {
  path: "/privacy/",
  title: "Privacy notice — Solved Tech",
  description: "How Solved Tech handles the personal data you send when you contact us.",
  indexable: false,
};

const absoluteUrl = (origin: string, path: string, baseUrl: string): string =>
  new URL(publicAssetUrl(path, baseUrl), origin).toString();

export const renderHeadTags = (
  page: PageMeta,
  status: SiteStatus,
  baseUrl: string,
): string => {
  if (!status.launched || !page.indexable) {
    return "";
  }

  const url = absoluteUrl(status.productionOrigin, page.path, baseUrl);
  const image = absoluteUrl(status.productionOrigin, "/brand/solved-tech-social.png", baseUrl);

  return [
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="Solved Tech" />',
    `<meta property="og:title" content="${escapeHtml(page.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(page.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
  ].join("\n    ");
};

export const renderOrganizationJsonLd = (
  status: SiteStatus,
  content: SiteContent,
  config: ContactConfig,
  baseUrl: string,
): string => {
  if (!status.launched) {
    return "";
  }

  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Solved Tech",
    url: absoluteUrl(status.productionOrigin, "/", baseUrl),
    logo: absoluteUrl(status.productionOrigin, "/brand/solved-tech-logo-dark.svg", baseUrl),
    email: config.email,
    telephone: config.phone,
    founder: content.founders.map(({ name, linkedin }) => ({
      "@type": "Person",
      name,
      sameAs: linkedin,
    })),
  };

  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
};

export interface PrerenderInput {
  shell: string;
  appHtml: string;
  headTags: string;
  page: PageMeta;
  status: SiteStatus;
}

const MOUNT = '<div id="app"></div>';
const NOINDEX = /^[ \t]*<meta name="robots" content="noindex" \/>\r?\n/m;

export const injectPrerender = ({ shell, appHtml, headTags, page, status }: PrerenderInput): string => {
  if (!shell.includes(MOUNT)) {
    throw new Error(`Cannot prerender "${page.path}": the shell has no ${MOUNT} mount.`);
  }

  let html = shell
    .replace(MOUNT, `<div id="app">${appHtml}</div>`)
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(page.title)}</title>`)
    .replace(
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${escapeHtml(page.description)}" />`,
    );

  if (status.launched && page.indexable) {
    html = html.replace(NOINDEX, "");
  }

  if (headTags) {
    html = html.replace("</head>", `  ${headTags}\n  </head>`);
  }

  return html;
};
```

- [ ] **Step 7: Update `index.html`.** Replace the `<title>` line with `<title>Solved Tech — Software development, bug fixes and automation</title>` and the description line with `<meta name="description" content="Solved Tech builds new applications, fixes problems in existing software and connects the systems UK businesses rely on." />`. Keep the robots line from Task 3.

- [ ] **Step 8: Create `scripts/prerender.mts`:**

```ts
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createServer, createServerModuleRunner } from "vite";

const distDir = resolve(import.meta.dirname, "../dist");

const server = await createServer({
  appType: "custom",
  logLevel: "error",
  server: { middlewareMode: true, ws: false },
});

try {
  const runner = createServerModuleRunner(server.environments.ssr, { hmr: false });
  const render = await runner.import("/src/render.ts");
  const content = await runner.import("/src/content.ts");
  const head = await runner.import("/src/head.ts");
  const baseUrl = server.config.base;
  const { siteStatus } = content;

  const pages = [
    {
      file: "index.html",
      page: head.homePage,
      appHtml: render.renderHomepage(content.siteContent, content.contactConfig, baseUrl),
      extraHead: head.renderOrganizationJsonLd(siteStatus, content.siteContent, content.contactConfig, baseUrl),
    },
    {
      file: "privacy/index.html",
      page: head.privacyPage,
      appHtml: render.renderPrivacyPage(content.privacyContent, content.contactConfig, baseUrl),
      extraHead: "",
    },
  ];

  for (const { file, page, appHtml, extraHead } of pages) {
    const target = resolve(distDir, file);
    const shell = readFileSync(target, "utf8");
    const headTags = [head.renderHeadTags(page, siteStatus, baseUrl), extraHead]
      .filter(Boolean)
      .join("\n    ");

    writeFileSync(target, head.injectPrerender({ shell, appHtml, headTags, page, status: siteStatus }));
    console.log(`prerendered ${file}`);
  }
} finally {
  await server.close();
}
```

`scripts/` is outside `tsconfig.json`'s `include`, so `tsc` does not check it; Node ≥ 23.6 runs `.mts` directly by stripping types. If `node scripts/prerender.mts` fails with `createServerModuleRunner is not a function`, replace the three `runner.import(...)` calls with `server.ssrLoadModule(...)` and delete the `runner` line; do not try any other variation.

- [ ] **Step 9: Update `package.json`.** Change the `build` script to `"build": "tsc && vite build && node scripts/prerender.mts"`. Touch nothing else in the file.

- [ ] **Step 10:** Run `npm test` (expect 109 passing), `npm run check`, then `npm run build`. Verify the output:

```bash
grep -c '<h1' dist/index.html                       # 1
grep -c 'class="service-box"' dist/index.html       # 6
grep -c 'class="founder' dist/index.html            # ≥ 2
grep -c 'href="tel:' dist/index.html                # 2
grep -c 'name="robots"' dist/index.html             # 1 (not launched)
grep -c 'application/ld+json' dist/index.html       # 0 (not launched)
grep -c '<h1' dist/privacy/index.html               # 1
```

- [ ] **Step 11:** Run `npx playwright test --project=uk-phone-standard --project=uk-desktop`. Playwright uses `vite dev`, which does not prerender, so this only confirms the runtime path still works.

**Downstream:** `tests/document.test.ts` (Step 4). The deploy workflow already runs `npm run build`, so GitHub Pages receives the prerendered HTML without workflow edits.

**HUMAN STEP (H5):** Provide the production origin and save the 1200×630 social preview at `public/brand/solved-tech-social.png`. The flip to `{ launched: true, productionOrigin: "https://…" }` happens in Task 15, not here.

**Done-when:**
- `npm test` → 109 passed
- `npm run check` → exit 0
- `npm run build` → exit 0 and the seven `grep` counts above match
- Playwright default subset → all passed

**Commit:** `feat(seo): prerender pages at build time and gate launch metadata on siteStatus`

---

### Task 13: Three service pages with distinct content (F12)

**Design:** Pages at `/services/bug-fixing/`, `/services/software-development/` and `/services/automation/`, mapped to products `fix`, `app` and `other` (the same three needs as the Task 5 selector). Each has its own H1, intro, "Typical requests" and "What you receive" lists and a contact block, so no two pages are near-identical (audit F12 acceptance). Copy is drafted from the audit's §16 proposals and product data already approved on the homepage; each page carries `approved: false` until **HUMAN STEP (H7)**. Unapproved pages are built and linked (so they can be reviewed on the preview) but keep `noindex` even after launch. One entry file, `src/service.ts`, selects the page from `<body data-service="…">`. When launched, the prerender also writes `dist/sitemap.xml` and `dist/robots.txt`.

**Branch:** `feat/f12-service-pages`

**Files:**
- Read: `src/content.ts`, `src/render.ts` (`renderPrivacyPage`, `renderSiteHeader`, `renderContactActions`, services map), `src/head.ts`, `src/privacy.ts`, `privacy/index.html`, `scripts/prerender.mts`, `vite.config.ts`, `src/styles.css` (`/* Secondary pages` block), `tests/content.test.ts`, `tests/render.test.ts`, `tests/document.test.ts`, `tests/head.test.ts`, `tests/e2e/responsive.spec.ts`
- Create: `src/service.ts`, `services/bug-fixing/index.html`, `services/software-development/index.html`, `services/automation/index.html`
- Modify: `src/content.ts`, `src/render.ts`, `src/head.ts`, `src/styles.css`, `scripts/prerender.mts`, `vite.config.ts`, `tests/content.test.ts`, `tests/render.test.ts`, `tests/document.test.ts`, `tests/head.test.ts`, `tests/e2e/responsive.spec.ts`

**Steps:**

- [ ] **Step 1: Content tests.** Append inside `describe("site content")` in `tests/content.test.ts` (import `servicePages` from `../src/content`):

```ts
  it("defines three distinct service pages mapped to fix, app and other", () => {
    expect(servicePages.map(({ slug, productId }) => [slug, productId])).toEqual([
      ["bug-fixing", "fix"],
      ["software-development", "app"],
      ["automation", "other"],
    ]);
    expect(new Set(servicePages.map(({ title }) => title)).size).toBe(3);
    expect(new Set(servicePages.map(({ intro }) => intro)).size).toBe(3);
    expect(new Set(servicePages.map(({ description }) => description)).size).toBe(3);
    servicePages.forEach((page) => {
      expect(page.requests.length).toBeGreaterThanOrEqual(3);
      expect(page.deliverables.length).toBeGreaterThanOrEqual(3);
      expect(siteContent.products.map(({ id }) => id)).toContain(page.productId);
    });
  });

  it("refuses to launch with unapproved service copy", () => {
    if (siteStatus.launched) {
      expect(servicePages.every(({ approved }) => approved)).toBe(true);
    }
  });
```

- [ ] **Step 2: Renderer tests.** In `tests/render.test.ts` import `servicePages` and `renderServicePage`, then append a describe block:

```ts
describe("service page renderer", () => {
  const [bugFixing] = servicePages;
  const html = renderServicePage(bugFixing, siteContent, contactConfig, "/solved-tech/");

  it("renders one page per service with its own heading, lists and contact block", () => {
    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toContain(`<h1 id="service-heading">${bugFixing.title}</h1>`);
    expect(html).toContain(`<p class="prose__lead">${bugFixing.intro}</p>`);
    expect(html).toContain("<h2>Typical requests</h2>");
    expect(html).toContain("<h2>What you receive</h2>");
    bugFixing.requests.forEach((request) => expect(html).toContain(`<li>${request}</li>`));
    bugFixing.deliverables.forEach((item) => expect(html).toContain(`<li>${item}</li>`));
    expect(html).toContain('<a href="/solved-tech/#approach">See how we work</a>');
    expect(html).toContain('<h2 id="service-contact-heading">Tell us what is happening</h2>');
    expect(html.match(/class="contact-action/g)).toHaveLength(3);
    expect(html).toContain('<a class="wordmark" href="/solved-tech/#top"');
    expect(html).not.toContain("data-reveal");
  });

  it("links every service page from its service box on the homepage", () => {
    const home = renderHomepage(siteContent, contactConfig, "/solved-tech/");

    servicePages.forEach(({ slug, productId, title }) => {
      const box = home.match(
        new RegExp(`<article class="service-box" id="service-${productId}"[\\s\\S]*?</article>`),
      )?.[0];

      expect(box).toContain(
        `<a class="service-box__more" href="/solved-tech/services/${slug}/">Read about ${title.toLowerCase()}</a>`,
      );
    });
    expect(home.match(/class="service-box__more"/g)).toHaveLength(3);
  });

  it("gives each service page distinct content", () => {
    const pages = servicePages.map((page) =>
      renderServicePage(page, siteContent, contactConfig, "/").match(/<article[\s\S]*<\/article>/)?.[0],
    );

    expect(new Set(pages).size).toBe(3);
  });
});
```

If `id="service-${productId}"` does not match the attribute order produced in Task 5 (open `src/render.ts` and copy the exact opening tag of the service article), adjust only the regex in this test to the real attribute order.

- [ ] **Step 3: Shell and head tests.** Append to `tests/document.test.ts`:

```ts
describe("service document shells", () => {
  servicePages.forEach(({ slug, title, description }) => {
    it(`mirrors the shell for /services/${slug}/`, () => {
      const html = readFileSync(new URL(`../services/${slug}/index.html`, import.meta.url), "utf8");

      expect(html).toContain('<html lang="en-GB">');
      expect(html).toContain(`<title>${title} — Solved Tech</title>`);
      expect(html).toContain(`<meta name="description" content="${description}" />`);
      expect(html).toContain('<meta name="robots" content="noindex" />');
      expect(html).toContain(`<body data-service="${slug}">`);
      expect(html).toContain('<script type="module" src="/src/service.ts"></script>');
    });
  });
});
```

(import `servicePages` from `../src/content`). Append to `tests/head.test.ts` (import `servicePageMeta` and `renderSitemap` from `../src/head`, `servicePages` from `../src/content`):

```ts
describe("service page metadata", () => {
  it("indexes a service page only once its copy is approved", () => {
    const [draft] = servicePages;

    expect(servicePageMeta({ ...draft, approved: false }).indexable).toBe(false);
    expect(servicePageMeta({ ...draft, approved: true })).toEqual({
      path: `/services/${draft.slug}/`,
      title: `${draft.title} — Solved Tech`,
      description: draft.description,
      indexable: true,
    });
  });

  it("lists indexable pages in the sitemap after launch", () => {
    const pages = [homePage, privacyPage, servicePageMeta({ ...servicePages[0], approved: true })];

    expect(renderSitemap(preview, pages, "/solved-tech/")).toBe("");
    expect(renderSitemap(live, pages, "/solved-tech/")).toBe(
      [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        "  <url><loc>https://example.test/solved-tech/</loc></url>",
        `  <url><loc>https://example.test/solved-tech/services/${servicePages[0].slug}/</loc></url>`,
        "</urlset>",
        "",
      ].join("\n"),
    );
  });
});
```

- [ ] **Step 4:** Run `npm test`; expect 2 content, 3 render, 3 document and 2 head failures. `npm run check` fails — expected.

- [ ] **Step 5: Content.** Append to `src/content.ts`:

```ts
export interface ServicePage {
  slug: string;
  productId: string;
  title: string;
  description: string;
  intro: string;
  requests: string[];
  deliverables: string[];
  approved: boolean;
}

export const servicePages: ServicePage[] = [
  {
    slug: "bug-fixing",
    productId: "fix",
    title: "Bug fixing for business software",
    description:
      "Help with bugs, failed integrations and problems in existing applications, with a diagnosis before any fix is promised.",
    intro:
      "Get help with bugs, failed integrations and problems in existing applications. We start by understanding the issue and reproducing it where possible, then agree the scope of the fix and how it will be tested.",
    requests: [
      "An error your customers or staff keep running into",
      "An integration that stopped working after a change",
      "Software built by a team that is no longer available",
      "Slow or unreliable behaviour nobody has pinned down",
    ],
    deliverables: [
      "A written diagnosis with the confirmed cause",
      "An agreed scope and estimate before the fix starts",
      "The fix, tested against the steps that triggered the problem",
      "A short handover note describing what changed",
    ],
    approved: false,
  },
  {
    slug: "software-development",
    productId: "app",
    title: "Software development for your business",
    description:
      "Web, mobile and desktop applications built around the way your business already works, from first scope to handover.",
    intro:
      "We build web, mobile and desktop applications around the way your business already works. Tell us what you want to improve, and we will help define the next step.",
    requests: [
      "A manual process that has outgrown spreadsheets",
      "A customer-facing portal or booking flow",
      "An internal tool your team needs every day",
      "A product idea that needs a first working version",
    ],
    deliverables: [
      "A proposed scope and estimate before work starts",
      "Working software you can review early and often",
      "Testing against the agreed scope",
      "Documentation and a handover you can rely on",
    ],
    approved: false,
  },
  {
    slug: "automation",
    productId: "other",
    title: "Business automation and integrations",
    description:
      "Reduce repetitive work and connect the tools your team relies on, with AI used only where it fits the job.",
    intro:
      "Reduce repetitive work and connect your business tools. We help map the process, identify what can be automated and build the connections your team needs. AI is an option when it fits the job.",
    requests: [
      "Data copied by hand between two systems",
      "Reports assembled manually every week",
      "Tools that should talk to each other but do not",
      "Approvals and notifications that depend on someone remembering",
    ],
    deliverables: [
      "A map of the current process and what can be automated",
      "An agreed scope and estimate before work starts",
      "The integration or automation, tested with your real data flows",
      "Documentation of what runs where and how to change it",
    ],
    approved: false,
  },
];
```

- [ ] **Step 6: Renderer.** In `src/render.ts`:

  6a. Add `ServicePage` to the type import and `servicePages` to the value import from `./content`.

  6b. In the services map inside `renderHomepage`, after the existing `service-box__cta` anchor, add:

```ts
${servicePages
  .filter((page) => page.productId === id)
  .map(
    ({ slug, title: pageTitle }) =>
      `<a class="service-box__more" href="${escapeHtml(publicAssetUrl(`/services/${slug}/`, baseUrl))}">Read about ${escapeHtml(pageTitle.toLowerCase())}</a>`,
  )
  .join("")}
```

  (Place it inside the same template literal, on the line directly after the CTA anchor, with no surrounding whitespace changes to other lines.)

  6c. Add the page renderer after `renderPrivacyPage`:

```ts
export const renderServicePage = (
  page: ServicePage,
  content: SiteContent,
  config: ContactConfig,
  baseUrl: string = import.meta.env.BASE_URL,
): string => {
  const product = content.products.find(({ id }) => id === page.productId);
  const list = (items: string[]): string => items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

  return `
    ${renderSiteHeader(baseUrl, baseUrl)}
    <main id="main-content" class="page">
      <article class="prose prose--service" aria-labelledby="service-heading">
        <p class="page__eyebrow">${escapeHtml(product?.question ?? "Services")}</p>
        <h1 id="service-heading">${escapeHtml(page.title)}</h1>
        <p class="prose__lead">${escapeHtml(page.intro)}</p>
        <section>
          <h2>Typical requests</h2>
          <ul>${list(page.requests)}</ul>
        </section>
        <section>
          <h2>What you receive</h2>
          <ul>${list(page.deliverables)}</ul>
          <p><a href="${escapeHtml(baseUrl)}#approach">See how we work</a></p>
        </section>
        <section class="service-contact" aria-labelledby="service-contact-heading">
          <h2 id="service-contact-heading">Tell us what is happening</h2>
          <p>Describe the problem or the goal, which system is involved and what outcome you want. Please do not send passwords or confidential customer data in your first message.</p>
          ${renderContactActions(config, "contact__actions")}
        </section>
      </article>
    </main>
    ${renderSiteFooter(baseUrl)}
  `;
};
```

- [ ] **Step 7: Head.** Append to `src/head.ts` (add `ServicePage` to the type import):

```ts
export const servicePageMeta = (page: ServicePage): PageMeta => ({
  path: `/services/${page.slug}/`,
  title: `${page.title} — Solved Tech`,
  description: page.description,
  indexable: page.approved,
});

export const renderSitemap = (
  status: SiteStatus,
  pages: PageMeta[],
  baseUrl: string,
): string => {
  if (!status.launched) {
    return "";
  }

  const urls = pages
    .filter(({ indexable }) => indexable)
    .map(({ path }) => `  <url><loc>${escapeHtml(absoluteUrl(status.productionOrigin, path, baseUrl))}</loc></url>`);

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
};
```

- [ ] **Step 8: Shells.** Create the three files below. Only `data-service`, `<title>` and description differ; copy the values from `servicePages` exactly.

`services/bug-fixing/index.html`:

```html
<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Help with bugs, failed integrations and problems in existing applications, with a diagnosis before any fix is promised." />
    <meta name="robots" content="noindex" />
    <title>Bug fixing for business software — Solved Tech</title>
  </head>
  <body data-service="bug-fixing">
    <a class="skip-link" href="#main-content">Skip to content</a>
    <div id="app"></div>
    <script type="module" src="/src/service.ts"></script>
  </body>
</html>
```

`services/software-development/index.html`: same file with `data-service="software-development"`, `<title>Software development for your business — Solved Tech</title>` and the `software-development` description string.

`services/automation/index.html`: same file with `data-service="automation"`, `<title>Business automation and integrations — Solved Tech</title>` and the `automation` description string.

- [ ] **Step 9: Entry.** Create `src/service.ts`:

```ts
/// <reference types="vite/client" />

import { contactConfig, servicePages, siteContent } from "./content";
import { setupHeaderOffset, setupMobileMenu, setupScrollProgress } from "./enhance";
import { renderServicePage } from "./render";
import "./styles.css";

const app = document.querySelector<HTMLDivElement>("#app");
const slug = document.body.dataset.service;
const page = servicePages.find((candidate) => candidate.slug === slug);

if (!app) {
  throw new Error("Cannot render the service page: #app mount element is missing.");
}

if (!page) {
  throw new Error(`Cannot render the service page: unknown service "${slug ?? ""}".`);
}

app.innerHTML = renderServicePage(page, siteContent, contactConfig);
setupHeaderOffset(window);
setupMobileMenu(app);
setupScrollProgress(window);
```

- [ ] **Step 10: Vite inputs.** In `vite.config.ts` add three entries to `rollupOptions.input` after `privacy`:

```ts
        "services/bug-fixing": resolve(import.meta.dirname, "services/bug-fixing/index.html"),
        "services/software-development": resolve(import.meta.dirname, "services/software-development/index.html"),
        "services/automation": resolve(import.meta.dirname, "services/automation/index.html"),
```

- [ ] **Step 11: Prerender.** In `scripts/prerender.mts` replace the `const pages = [ … ];` literal with:

```ts
  const pages = [
    {
      file: "index.html",
      page: head.homePage,
      appHtml: render.renderHomepage(content.siteContent, content.contactConfig, baseUrl),
      extraHead: head.renderOrganizationJsonLd(siteStatus, content.siteContent, content.contactConfig, baseUrl),
    },
    {
      file: "privacy/index.html",
      page: head.privacyPage,
      appHtml: render.renderPrivacyPage(content.privacyContent, content.contactConfig, baseUrl),
      extraHead: "",
    },
    ...content.servicePages.map((servicePage) => ({
      file: `services/${servicePage.slug}/index.html`,
      page: head.servicePageMeta(servicePage),
      appHtml: render.renderServicePage(servicePage, content.siteContent, content.contactConfig, baseUrl),
      extraHead: "",
    })),
  ];
```

and, after the `for` loop, add:

```ts
  const sitemap = head.renderSitemap(siteStatus, pages.map(({ page }) => page), baseUrl);

  if (sitemap) {
    const sitemapUrl = new URL(`${baseUrl}sitemap.xml`, siteStatus.productionOrigin).toString();

    writeFileSync(resolve(distDir, "sitemap.xml"), sitemap);
    writeFileSync(resolve(distDir, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${sitemapUrl}\n`);
    console.log("wrote sitemap.xml and robots.txt");
  }
```

- [ ] **Step 12: CSS.** Add to `src/styles.css` directly after the `.contact-privacy a` rule (end of the `/* Secondary pages` block):

```css
.prose__lead {
  font-size: var(--type-lead);
  line-height: 1.4;
}

.prose ul {
  display: grid;
  gap: 0.5rem;
  padding-inline-start: 1.25rem;
}

.prose a {
  color: var(--ink);
  text-underline-offset: 0.3em;
}

.service-contact {
  border-block-start: 1px solid var(--line);
  padding-block-start: 2rem;
}

.service-contact .contact__actions {
  margin-block-start: 1rem;
}
```

If `.contact__actions` already declares a `margin-block-start` in the contact section rules, omit the last rule.

- [ ] **Step 13:** Run `npm test` (expect 119 passing), `npm run check`, `npm run build`. Confirm `ls dist/services/*/index.html` lists three files and `grep -c '<h1' dist/services/bug-fixing/index.html` → `1`. `dist/sitemap.xml` must **not** exist (not launched).

- [ ] **Step 14: E2E.** Append to `tests/e2e/responsive.spec.ts`:

```ts
test("service pages render their own heading and link back home", async ({ page }) => {
  const collector = setupErrorCollection(page);

  await page.goto("services/bug-fixing/");
  await page.waitForLoadState("domcontentloaded");
  expect(new URL(page.url()).pathname).toBe("/solved-tech/services/bug-fixing/");

  await expect(page.locator("h1")).toHaveText("Bug fixing for business software");
  await expect(page.locator(".prose section h2")).toHaveCount(3);
  await expect(page.locator(".contact-action")).toHaveCount(3);
  await expect(page.locator('#primary-navigation a[href="/solved-tech/#services"]')).toHaveCount(1);
  await assertNoDocumentOverflow(page);
  assertNoRuntimeErrors(collector);
});
```

Also add, inside the existing homepage test that counts `.service-box__cta` (≈ line 80), one line after that count: `await expect(page.locator(".service-box__more")).toHaveCount(3);`. Then run `npx playwright test --project=uk-phone-standard --project=uk-desktop --project=stress-compact`.

**Downstream:** the `.service-box__more` count (Step 14). `.service-box__cta` counts stay at 6.

**HUMAN STEP (H7):** review each page's `title`, `intro`, `requests` and `deliverables` in `servicePages`, edit as needed, then set `approved: true`. Only approved pages lose `noindex` and enter the sitemap after launch.

**Done-when:**
- `npm test` → 119 passed
- `npm run check` → exit 0
- `npm run build` → exit 0, three `dist/services/*/index.html` files, no `dist/sitemap.xml`
- Playwright `uk-phone-standard`, `uk-desktop`, `stress-compact` → all passed

**Commit:** `feat(services): add bug-fixing, development and automation pages with launch-gated indexing`

---

### Task 14: Declare the security policy the host cannot, and document the rest (F15)

**Facts:** GitHub Pages sends no custom response headers, so `X-Frame-Options`, `frame-ancestors`, `X-Content-Type-Options` and `Referrer-Policy` headers cannot be set from this repository. What can be shipped is (a) a Content-Security-Policy `<meta>` and a referrer `<meta>` injected into every prerendered page, (b) an executable check that loads the built pages under that policy and fails on any console error, and (c) the header set the final host must apply, in a document the founders hand to whoever configures hosting (H5). `script-src` is `'self'` with no `'unsafe-inline'`. `style-src` needs `'unsafe-inline'` because the hero pipeline emits seven `style="--pipeline-delay: …"` attributes pinned by `tests/render.test.ts`; this is recorded as a follow-up, not silently accepted. The meta CSP is **not** added to the source shells: in `vite dev`, CSS is injected through inline `<style>` elements and would be blocked, which would make the Playwright runs meaningless.

**Branch:** `feat/f15-security-policy`

**Files:**
- Read: `src/head.ts`, `scripts/prerender.mts`, `tests/head.test.ts`, `src/render.ts` (the seven `style="--pipeline-delay` lines)
- Create: `scripts/check-csp.mts`, `docs/hosting/security-headers.md`
- Modify: `src/head.ts`, `scripts/prerender.mts`, `tests/head.test.ts`

**Steps:**

- [ ] **Step 1: Tests.** Append to `tests/head.test.ts` (import `renderSecurityMeta` from `../src/head`):

```ts
describe("security metadata", () => {
  const meta = renderSecurityMeta();

  it("declares a policy that forbids inline and third-party scripts", () => {
    const policy = meta.match(/Content-Security-Policy" content="([^"]+)"/)?.[1] ?? "";
    const directives = Object.fromEntries(
      policy.split(";").map((directive) => {
        const [name, ...values] = directive.trim().split(/\s+/);
        return [name, values];
      }),
    );

    expect(directives["default-src"]).toEqual(["'none'"]);
    expect(directives["script-src"]).toEqual(["'self'"]);
    expect(directives["style-src"]).toEqual(["'self'", "'unsafe-inline'"]);
    expect(directives["img-src"]).toEqual(["'self'", "data:"]);
    expect(directives["connect-src"]).toEqual(["'self'"]);
    expect(directives["font-src"]).toEqual(["'self'"]);
    expect(directives["base-uri"]).toEqual(["'self'"]);
    expect(directives["form-action"]).toEqual(["'none'"]);
    expect(directives["object-src"]).toEqual(["'none'"]);
    expect(policy).not.toMatch(/unsafe-eval|https?:/);
  });

  it("sets a referrer policy and is injected on every page regardless of launch", () => {
    expect(meta).toContain('<meta name="referrer" content="strict-origin-when-cross-origin" />');
    expect(
      injectPrerender({ shell, appHtml: "", headTags: meta, page: privacyPage, status: preview }),
    ).toContain('http-equiv="Content-Security-Policy"');
  });
});
```

- [ ] **Step 2:** Run `npm test`; expect 2 failures.

- [ ] **Step 3: Implement.** Append to `src/head.ts`:

```ts
const CONTENT_SECURITY_POLICY = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "base-uri 'self'",
  "form-action 'none'",
  "object-src 'none'",
].join("; ");

export const renderSecurityMeta = (): string =>
  [
    `<meta http-equiv="Content-Security-Policy" content="${CONTENT_SECURITY_POLICY}" />`,
    '<meta name="referrer" content="strict-origin-when-cross-origin" />',
  ].join("\n    ");
```

In `scripts/prerender.mts` change the `headTags` expression inside the loop to:

```ts
    const headTags = [head.renderSecurityMeta(), head.renderHeadTags(page, siteStatus, baseUrl), extraHead]
      .filter(Boolean)
      .join("\n    ");
```

- [ ] **Step 4: Create `scripts/check-csp.mts`** — loads every built page under the meta CSP in headless Chromium and fails on any console error or page error:

```ts
import { chromium } from "playwright";
import { preview } from "vite";

const server = await preview({ preview: { host: "127.0.0.1", port: 4174, strictPort: true }, logLevel: "error" });
const origin = server.resolvedUrls?.local[0];

if (!origin) {
  throw new Error("vite preview did not report a local URL.");
}

const paths = ["", "privacy/", "services/bug-fixing/", "services/software-development/", "services/automation/"];
const browser = await chromium.launch();
const problems: string[] = [];

try {
  for (const path of paths) {
    const page = await browser.newPage();
    const url = new URL(path, origin).toString();

    page.on("console", (message) => {
      if (message.type() === "error") {
        problems.push(`${url}: ${message.text()}`);
      }
    });
    page.on("pageerror", (error) => problems.push(`${url}: ${error.message}`));

    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForSelector("h1");

    const csp = await page.evaluate(() =>
      document.querySelector('meta[http-equiv="Content-Security-Policy"]')?.getAttribute("content") ?? "",
    );
    const bodyBackground = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    if (!csp) {
      problems.push(`${url}: no Content-Security-Policy meta`);
    }
    if (bodyBackground === "rgba(0, 0, 0, 0)") {
      problems.push(`${url}: stylesheet did not apply (body background is transparent)`);
    }

    console.log(`checked ${url}`);
    await page.close();
  }
} finally {
  await browser.close();
  await server.close();
}

if (problems.length > 0) {
  console.error(problems.join("\n"));
  process.exit(1);
}

console.log("CSP check passed");
```

`playwright` is already installed as a dependency of `@playwright/test`; do not add anything to `package.json`.

- [ ] **Step 5: Create `docs/hosting/security-headers.md`** (the file content is the block below, without the outer four-backtick fence):

````markdown
# Response headers for the production host

GitHub Pages cannot send custom response headers. The repository ships a Content-Security-Policy
and a referrer policy as `<meta>` elements in every prerendered page (`src/head.ts`,
`renderSecurityMeta`). The headers below must be configured on the final host (H5) because they
cannot be expressed in `<meta>` at all, or because a header is the authoritative form.

| Header | Value | Why |
| --- | --- | --- |
| `Content-Security-Policy` | same value as the `<meta>` in `src/head.ts`, plus `; frame-ancestors 'none'` | `frame-ancestors` is ignored in `<meta>`; the header form is authoritative |
| `X-Frame-Options` | `DENY` | Fallback for clients without CSP 2 support |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME sniffing of assets |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Mirrors the `<meta>` value |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Only after HTTPS is confirmed on the final domain and all subdomains |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | The site uses none of these |

## Verify after deployment

```bash
curl -sI https://<production-host>/ | grep -i -E 'content-security-policy|x-frame-options|x-content-type-options|referrer-policy|strict-transport-security|permissions-policy'
npm run build && node scripts/check-csp.mts
```

The second command loads every built page under the meta policy in headless Chromium and fails on
any console error, so run it before tightening the policy further.

## Known follow-up

`style-src` includes `'unsafe-inline'` because the hero pipeline renders seven
`style="--pipeline-delay: …"` attributes (`src/render.ts`, pinned by `tests/render.test.ts`).
Moving those delays into `src/styles.css` would allow `style-src 'self'`. Do this in its own
change with the render test updated alongside it.
````

- [ ] **Step 6:** Run `npm test` (expect 121 passing), `npm run check`, `npm run build`, then `node scripts/check-csp.mts` (expect `CSP check passed`, exit 0). Confirm `grep -c 'Content-Security-Policy' dist/index.html` → `1`.

If `check-csp.mts` reports a CSP violation, read the violated directive from the message, record it under OPEN QUESTIONS with the exact console text, and stop. Do not loosen the policy to make the check pass.

**Downstream:** none.

**Done-when:**
- `npm test` → 121 passed
- `npm run build` → exit 0
- `node scripts/check-csp.mts` → `CSP check passed`, exit 0

**Commit:** `feat(security): ship a meta CSP and referrer policy and document host headers`

---

### Task 15: Launch gate — flip the switch, run the full matrix, verify live

**Precondition:** Tasks 1–14 committed **and** H1, H2, H4 (FAQ at minimum), H5 and H7 delivered by the founders and already committed by them into `src/content.ts` / `public/brand/`. If any is missing, this task's Step 1 stops. This task has a **tool-call budget of 40**.

**Branch:** `release/launch`

**Files:**
- Read: `src/content.ts`, `vite.config.ts`, `docs/hosting/security-headers.md`, this plan's Section 0.5
- Modify: `src/content.ts` (the `siteStatus` object only), `vite.config.ts` (only if H5 says the site moves to a custom domain at the root), `public/CNAME` (create only in that same case)

**Steps:**

- [ ] **Step 1: Verify the human inputs are in the tree.** Run:

```bash
grep -c '\[\[' src/content.ts                       # must print 0
grep -n 'placeholder:' src/content.ts               # must show placeholder: false
grep -n 'approved:' src/content.ts                  # every line must show approved: true
ls -l public/brand/solved-tech-social.png           # must exist
```

If any check fails, stop and write the report with `OPEN QUESTIONS: launch blocked by <H-id>`.

- [ ] **Step 2: Flip the switch.** In `src/content.ts` set:

```ts
export const siteStatus: SiteStatus = {
  launched: true,
  productionOrigin: "<origin from H5, e.g. https://solved-tech.github.io>",
};
```

Use the exact origin from H5 — scheme and host only, no path, no trailing slash.

- [ ] **Step 3: Base path.** If H5 confirms GitHub Pages at `/solved-tech/`, change nothing. If H5 names a custom domain served from the root, set `base: "/"` in `vite.config.ts` and create `public/CNAME` containing the bare hostname on one line. Then search `tests/e2e/responsive.spec.ts` and `playwright.config.ts` for `/solved-tech/` and report every occurrence under OPEN QUESTIONS — do **not** edit them in this task.

- [ ] **Step 4: Gates.** Run `npm test` — every `if (siteStatus.launched)` branch is now active, so this proves there are no trial contacts, no tokens, no unapproved pages and a valid origin. Then `npm run check`, `npm run build`, `node scripts/check-csp.mts`. Verify the launch output:

```bash
grep -c 'name="robots"' dist/index.html                     # 0
grep -c 'rel="canonical"' dist/index.html                    # 1
grep -c 'application/ld+json' dist/index.html                # 1
grep -c 'name="robots"' dist/privacy/index.html              # 1
grep -c 'name="robots"' dist/services/bug-fixing/index.html  # 0
test -f dist/sitemap.xml && test -f dist/robots.txt && echo ok
grep -c '\[\[' dist/index.html                               # 0
```

- [ ] **Step 5: Full matrix, once.** Run `npx playwright test` (all 13 projects). If a project fails, record the project name and the failing test title verbatim under OPEN QUESTIONS; do not retry more than once.

- [ ] **Step 6:** Commit with the message below and stop. Do not push.

**HUMAN STEPS after merge and deploy (from the audit's acceptance criteria):**
1. Open the live URL; confirm the H1, services, team and contact links are present with JavaScript disabled.
2. Call, WhatsApp and email the live site's details and confirm each is received.
3. `curl -sI` the live URL and compare against `docs/hosting/security-headers.md`; configure missing headers on the host.
4. In Search Console: add the property, submit `sitemap.xml`, run URL inspection on the homepage and confirm the chosen canonical.
5. If the old `github.io` preview stays reachable alongside a custom domain, keep it `noindex` (build it with `launched: false`) or redirect it.

**Done-when:**
- `npm test`, `npm run check`, `npm run build`, `node scripts/check-csp.mts` → all exit 0
- The seven `grep`/`test` checks in Step 4 match
- `npx playwright test` → 13 projects passed (or failures listed verbatim in the report)

**Commit:** `chore(release): launch — enable production metadata and indexing`

---

## 4. Test-count ledger

| After task | `npm test` passing |
| --- | --- |
| baseline | 77 |
| 1 | 78 |
| 2 | 80 |
| 3 | 82 |
| 4 | 84 |
| 5 | 85 |
| 6 | 86 |
| 7 | 92 |
| 8 | 97 |
| 9 | 98 |
| 10 | 99 |
| 11 | 104 |
| 12 | 109 |
| 13 | 119 |
| 14 | 121 |
| 15 | 121 |

If a count differs by exactly the number of tests you added or replaced in the current task, the plan's arithmetic is off, not your work: record the actual number in the task report and continue. If it differs by any other amount, a test was lost or duplicated — stop and report.

