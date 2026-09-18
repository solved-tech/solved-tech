# Audit Remediation — Follow-up Plan (post-review)

> **For agentic workers (DeepSeek-V4.1-Flash):** Section 0 of `docs/superpowers/plans/2026-09-18-audit-remediation.md` (the "main plan") applies to this file in full — session ritual, per-task rules, budgets, MCP rules, report format. Read it first. Then execute exactly one task from this file per session, in order. Tick checkboxes here as you go.

**Goal:** Close the findings of the 18 September 2026 engineering, security and accessibility review of commits `2b3fc62..5fd0072` (Tasks 1–14 of the main plan). Nothing here adds features; every task either repairs a defect the review found or makes an existing guarantee verifiable.

**Baseline for this plan:** commit `2db9c1a` on `main`; `npm test` → 132 passed; `npm run check` → exit 0; `npm run build` → five pages prerendered; `npx playwright test --project=wide-desktop` → **1 failed** (Task 16 fixes it).

---

## 0. Protocol deltas

Everything in main-plan Section 0 stands. Differences for this file:

1. **Baseline test count is 132**, not 77. Each task below states the count it expects afterwards.
2. **`.nvmrc` moves to `26`** in Task 18. Until then `node --version` must print `v25.x` or newer; afterwards `v26.x` or newer.
3. **Task 15 of the main plan (launch gate) runs only after Tasks 16–21 here are committed.** Do not flip `siteStatus.launched` in this plan.
4. Commit messages, branch names and copy stay in English. Never push, never open a pull request.

### 0.1 State ledger

| Task | Fixes | Status |
| --- | --- | --- |
| 16 | Red `wide-desktop` e2e project; assertion-less test | [x] |
| 17 | CSP `<meta>` placed after the script/stylesheet; silent `noindex` on launch; `img-src data:` | [x] |
| 18 | CSP verifier not wired into CI, undeclared import, weak signal; workflow permissions; `.nvmrc` | [x] |
| 19 | Client re-render discards prerendered markup (paint → blank → fade) | [x] |
| 20 | Motion toggle announces two conflicting states | [x] |
| 21 | Need-selector border 1.96:1; back-to-top does not move focus; privacy page has no actionable contact | [x] |

### 0.2 Facts only humans can supply (in addition to main-plan H1–H7)

| ID | Input | Needed by |
| --- | --- | --- |
| H3 | Remus portrait source ≥ 832 px wide (`imageSources` is empty; the 340 px file is upscaled on every viewport ≥ 340 px), or written approval to ship the current resolution | Deferred item D1 |
| H8 | Privacy notice recipients: the notice says "Calls and WhatsApp messages are carried by EE". WhatsApp traffic is processed by WhatsApp/Meta (WhatsApp Ireland Ltd for UK users), which is also a transfer outside the UK; the email processor is unnamed. Data-protection owner must supply the corrected sentence(s). Do **not** rewrite this copy without H8. | Deferred item D2 |

---

## 1. Review findings → task map

| Sev | Finding (evidence at `5fd0072`) | Task |
| --- | --- | --- |
| High | `tests/e2e/responsive.spec.ts:508` asserts `/Bring us the problem/`; `src/render.ts:507` renders "…connect your systems." → `wide-desktop` fails, `responsive.yml` is red on every PR | 16 |
| Medium | `tests/e2e/responsive.spec.ts:514-523` "wide desktop contact note stays constrained" has no assertion left | 16 |
| Medium | `src/head.ts:110` inserts the CSP `<meta>` before `</head>`, i.e. **after** Vite's `<script type="module">` and `<link rel="stylesheet">` (`dist/index.html:13-16`); a meta policy does not govern fetches started before it is parsed | 17 |
| Medium | `src/head.ts:90,106` strips `noindex` with a whitespace-exact regex and no post-check; a serialisation change would ship `noindex` on the launched site silently | 17 |
| Low | `img-src 'self' data:` — no `data:` URI exists anywhere in `src/`, `dist/` or the built CSS | 17 |
| Low | `scripts/prerender.mts:56` reads `siteStatus.productionOrigin` without narrowing on `launched` | 17 |
| Low | `docs/hosting/security-headers.md:10` calls the header form "authoritative"; browsers enforce header **and** meta, both must pass | 17 |
| Medium | `scripts/check-csp.mts` is not referenced by any npm script or workflow; imports `playwright` (undeclared — only `@playwright/test` is in `package.json`); has no `securitypolicyviolation` listener; its `h1`/background checks are satisfied by prerendered HTML even when `script-src` blocks the bundle | 18 |
| Low | `.github/workflows/deploy-pages.yml` grants `pages: write` + `id-token: write` to the build job; `checkout`/`setup-node` pinned by tag while `responsive.yml` pins by SHA; `npm test -- --run` appends `--run` to a script that already is `vitest run` | 18 |
| Low | `.nvmrc` pins `25.9.0` (odd line, EOL June 2026); local development runs 26.x | 18 |
| Medium | `src/main.ts:37-38`, `src/service.ts:20`, `src/privacy.ts:14` do `app.innerHTML = render…()` unconditionally, replacing the prerendered nodes with fresh `[data-reveal]` nodes at `opacity: 0` (`styles.css:1876`) → content paints, blanks, fades back in | 19 |
| Low | `src/main.ts:18-26` re-exports `enhance.ts` only so `tests/motion.test.ts` can import from `main` (which also pulls in `styles.css`) | 19 |
| Medium | `src/enhance.ts:165-168` sets `aria-pressed` **and** swaps the label → screen readers hear "Resume background motion, toggle button, pressed" | 20 |
| Medium | `src/styles.css:791` `.need-link` border `--line-strong` (#4d4842) on `--surface` (#191817) = 1.96:1; below the 3:1 non-text minimum (WCAG 1.4.11) and it is the control's only boundary | 21 |
| Low | `src/render.ts:319` `#top` has no `tabindex`, so Back to top scrolls but leaves focus on the off-screen footer link | 21 |
| Low | `src/render.ts:608` privacy page prints email and phone as plain text — no actionable channel on that page | 21 |

## 2. Deferred (recorded, not scheduled)

| ID | Item | Why deferred |
| --- | --- | --- |
| D1 | Remus portrait resolution (F09) | Needs H3 |
| D2 | Privacy notice recipients (WhatsApp/Meta, email provider, transfers) | Needs H8; legal accuracy, not code |
| D3 | `style-src 'unsafe-inline'` → `'self'` by moving the seven `--pipeline-delay` values into CSS | **Done in `8138c2c`** (ahead of this plan): the delays are now `--pipeline-delay` declarations in `src/styles.css` keyed by node modifier, `style-src` is `'self'`, and `tests/render.test.ts` pins them |
| D4 | Mobile menu: close on outside pointer-down / focus leaving the nav | Not in F06 acceptance; behaviour addition |
| D5 | "(opens in new tab)" hint on WhatsApp and LinkedIn links; `noopener` alongside `noreferrer` | Cosmetic for AT users; no acceptance criterion |
| D6 | Persist the motion-pause preference in `sessionStorage` | Not in F08 acceptance |
| D7 | `privacyPage.indexable: false` keeps the notice `noindex` after launch | **Open — blocks Task 15.** Asked on 18 September 2026 and held pending a founder decision, so `siteStatus.launched` stays `false` |
| D8 | `tsc` does not cover `scripts/*.mts` (needs `@types/node`, a new dev dependency) | Dependency change requires approval |

---

## 3. Tasks

### Task 16: Make the `wide-desktop` e2e project green again

**Why it fails today:** Task 6 shortened the hero lead to "We build new applications, fix existing software and connect your systems." but the 2560×1440-only test still expects the old copy. A second wide-desktop test lost its only assertion when the trial `.contact-note` was removed at `12b3bcb`, so it now passes vacuously.

**Branch:** `fix/e2e-wide-desktop`

**Files:**
- Read: `tests/e2e/responsive.spec.ts` (lines 495–525), `src/render.ts` (line 507)
- Modify: `tests/e2e/responsive.spec.ts`

**Steps:**

- [x] **Step 1:** Run `npx playwright test --project=wide-desktop`. Expect exactly 1 failure: `wide desktop hero lead stays constrained` at line 508.

- [x] **Step 2: Edit `tests/e2e/responsive.spec.ts`.** Replace the line

```ts
  await expect(heroLead).toHaveText(/Bring us the problem/);
```

with

```ts
  await expect(heroLead).toHaveText(/connect your systems\.$/);
```

- [x] **Step 3: Delete the vacuous test.** Remove this whole block (it follows the hero-lead test):

```ts
test("wide desktop contact note stays constrained", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== WIDE_DESKTOP_PROJECT,
    "2560×1440 project only",
  );

  const collector = await preparePage(page);

  assertNoRuntimeErrors(collector);
});
```

Leave exactly one blank line between the hero-lead test and the `reduced motion renders completed static states` test that followed it.

- [x] **Step 4:** Run `npx playwright test --project=wide-desktop`. All tests pass (one fewer than before).

- [x] **Step 5:** Run `npm test` (132 passed) and `npm run check`.

**Downstream:** none. Unit tests are untouched.

**Done-when:**
- Playwright `wide-desktop` → all passed
- `npm test` → 132 passed; `npm run check` → exit 0
- `git diff --stat` lists only `tests/e2e/responsive.spec.ts`

**Commit:** `test(e2e): track the shortened hero lead and drop the assertion-less contact-note test`

---

### Task 17: The CSP `<meta>` precedes every fetch, and a launched page can never keep `noindex` silently

**Why it fails today:** `injectPrerender` appends `headTags` immediately before `</head>`. In `dist/*.html` Vite has already placed `<script type="module" crossorigin>`, `<link rel="modulepreload">` and `<link rel="stylesheet">` earlier in `<head>`, so the entry bundle and stylesheet load before the policy exists. Moving the injection point to right after `<meta charset="UTF-8" />` puts the policy ahead of every fetch. Separately, the `noindex` strip is a regex with no post-check; adding a throw makes a broken strip fail the build instead of shipping. `img-src` also allows `data:` although no `data:` URI exists.

**Branch:** `fix/f15-csp-placement`

**Files:**
- Read: `src/head.ts` (lines 84–120 and 140–165), `tests/head.test.ts` (lines 1–20, 80–121, 152–185), `scripts/prerender.mts`, `docs/hosting/security-headers.md`
- Modify: `src/head.ts`, `tests/head.test.ts`, `scripts/prerender.mts`, `docs/hosting/security-headers.md`

**Steps:**

- [x] **Step 1: Add three failing tests** at the end of the `describe("prerender injection")` block in `tests/head.test.ts` (after the `refuses a shell without the mount` test):

```ts
  it("places injected head tags right after the charset, ahead of every link and script", () => {
    const html = injectPrerender({
      shell,
      appHtml: "",
      headTags: renderSecurityMeta(),
      page: homePage,
      status: preview,
    });
    const cspIndex = html.indexOf('http-equiv="Content-Security-Policy"');

    expect(cspIndex).toBeGreaterThan(html.indexOf('<meta charset="UTF-8" />'));
    expect(cspIndex).toBeLessThan(html.indexOf("<link"));
    expect(cspIndex).toBeLessThan(html.indexOf("<script"));
    expect(cspIndex).toBeLessThan(html.indexOf("<title>"));
  });

  it("fails the build when a launched indexable page still carries noindex", () => {
    const stubborn = shell.replace(
      '<meta name="robots" content="noindex" />',
      '<meta name="robots" content="noindex"/>',
    );

    expect(() =>
      injectPrerender({ shell: stubborn, appHtml: "", headTags: "", page: homePage, status: live }),
    ).toThrow('Cannot prerender "/": noindex is still present after launch.');
  });

  it("refuses a shell without the charset when head tags must be injected", () => {
    expect(() =>
      injectPrerender({
        shell: '<html><head></head><body><div id="app"></div></body></html>',
        appHtml: "",
        headTags: renderSecurityMeta(),
        page: homePage,
        status: preview,
      }),
    ).toThrow('Cannot prerender "/": the shell has no <meta charset="UTF-8" /> element.');
  });
```

- [x] **Step 2: Update two existing assertions** in `tests/head.test.ts`:

In `strips noindex and injects tags for indexable pages after launch`, replace

```ts
    expect(html).toContain('<link rel="canonical" href="https://example.test/" />\n  </head>');
```

with

```ts
    expect(html).toContain(
      '<meta charset="UTF-8" />\n    <link rel="canonical" href="https://example.test/" />',
    );
```

In `declares a policy that forbids inline and third-party scripts`, replace

```ts
    expect(directives["img-src"]).toEqual(["'self'", "data:"]);
```

with

```ts
    expect(directives["img-src"]).toEqual(["'self'"]);
```

- [x] **Step 3:** Run `npm test`. Expect exactly 5 failures: the three new tests, `strips noindex and injects tags for indexable pages after launch`, and `declares a policy that forbids inline and third-party scripts`.

- [x] **Step 4: Edit `src/head.ts`.** Directly under the line

```ts
const MOUNT = '<div id="app"></div>';
```

add

```ts
const CHARSET = '<meta charset="UTF-8" />';
```

Then replace the block

```ts
  if (status.launched && page.indexable) {
    html = html.replace(NOINDEX, "");
  }

  if (headTags) {
    html = html.replace("</head>", `  ${headTags}\n  </head>`);
  }
```

with

```ts
  if (status.launched && page.indexable) {
    html = html.replace(NOINDEX, "");

    if (/name="robots"/.test(html)) {
      throw new Error(`Cannot prerender "${page.path}": noindex is still present after launch.`);
    }
  }

  if (headTags) {
    if (!html.includes(CHARSET)) {
      throw new Error(`Cannot prerender "${page.path}": the shell has no ${CHARSET} element.`);
    }

    html = html.replace(CHARSET, () => `${CHARSET}\n    ${headTags}`);
  }
```

Finally, in `CONTENT_SECURITY_POLICY`, replace `"img-src 'self' data:",` with `"img-src 'self'",`.

- [x] **Step 5: Edit `scripts/prerender.mts`.** Replace

```ts
  if (sitemap) {
```

with

```ts
  if (sitemap && siteStatus.launched) {
```

- [x] **Step 6: Edit `docs/hosting/security-headers.md`.** Replace the paragraph sentence

```
cannot be expressed in `<meta>` at all, or because a header is the authoritative form.
```

with

```
cannot be expressed in `<meta>` at all. When both a header and a `<meta>` policy are present the
browser enforces both; a request must satisfy every policy.
```

and in the table replace the `Content-Security-Policy` row's last cell

```
`frame-ancestors` is ignored in `<meta>`; the header form is authoritative
```

with

```
`frame-ancestors`, `report-to`/`report-uri` and `sandbox` are ignored in `<meta>`; the header adds them
```

- [x] **Step 7:** Run `npm test` (135 passed), `npm run check`, `npm run build`. Then confirm placement in the built output:

```bash
grep -n 'Content-Security-Policy\|<script type="module"\|rel="stylesheet"' dist/index.html dist/privacy/index.html dist/services/bug-fixing/index.html
```

In every file the `Content-Security-Policy` line number must be lower than both the `<script type="module"` and `rel="stylesheet"` line numbers.

**Downstream:** `tests/head.test.ts` lines 106 and 167 (Step 2). `docs/hosting/security-headers.md` is documentation only.

**Done-when:**
- `npm test` → 135 passed; `npm run check` → exit 0; `npm run build` → exit 0
- The `grep` in Step 7 shows the CSP line first in all three files
- `git diff --stat` lists only the four files above

**Commit:** `fix(security): inject the CSP meta before Vite's script and stylesheet and verify the launch noindex strip`

---

### Task 18: The CSP verifier runs in CI and proves the bundle executed

**Why it fails today:** `scripts/check-csp.mts` exists but nothing calls it, so a policy that blocks the bundle would deploy unnoticed. It also imports `playwright` (not declared; only `@playwright/test` is), relies on Chromium happening to log CSP violations as console errors, and its two page checks (`h1` present, body background applied) are satisfied by the prerendered HTML and stylesheet even when `script-src` blocks the JavaScript. The deploy workflow additionally grants Pages/OIDC write permissions to the build job, pins two actions by tag where `responsive.yml` pins by SHA, passes a redundant `--run`, and `.nvmrc` pins an end-of-life Node line.

**Branch:** `ci/csp-check`

**Files:**
- Read: `scripts/check-csp.mts`, `package.json`, `.github/workflows/deploy-pages.yml`, `.github/workflows/responsive.yml` (lines 18–30), `.nvmrc`, `src/enhance.ts` (`setupHeaderOffset`)
- Modify: `scripts/check-csp.mts`, `package.json` (the `scripts` object only), `.github/workflows/deploy-pages.yml`, `.nvmrc`

**Steps:**

- [x] **Step 1: Edit `scripts/check-csp.mts`.** Replace the first line

```ts
import { chromium } from "playwright";
```

with

```ts
import { chromium } from "@playwright/test";
```

- [x] **Step 2:** In the same file, directly after the line `page.on("pageerror", (error) => problems.push(\`${url}: ${error.message}\`));` and before `await page.goto(...)`, insert:

```ts
    await page.exposeFunction("reportCspViolation", (detail: string) => {
      problems.push(`${url}: ${detail}`);
    });
    await page.addInitScript(() => {
      document.addEventListener("securitypolicyviolation", (event) => {
        const bridge = window as unknown as { reportCspViolation: (detail: string) => void };
        bridge.reportCspViolation(
          `CSP violation: ${event.violatedDirective} blocked ${event.blockedURI || "inline"}`,
        );
      });
    });
```

- [x] **Step 3:** In the same file, directly after the `bodyBackground` declaration and before the `if (!csp)` check, insert:

```ts
    const headerHeight = await page.evaluate(() =>
      document.documentElement.style.getPropertyValue("--header-height"),
    );
```

and directly after the `if (bodyBackground === "rgba(0, 0, 0, 0)") { … }` block, insert:

```ts
    if (!headerHeight) {
      problems.push(`${url}: the module script did not run (--header-height is unset)`);
    }
```

`setupHeaderOffset` in `src/enhance.ts` writes `--header-height` on `<html>` synchronously on every page, so an empty value means the bundle was blocked or threw.

- [x] **Step 4: Edit `package.json`.** In `"scripts"`, directly after the `"check": "tsc"` line, add:

```json
    "check:csp": "node scripts/check-csp.mts"
```

Put a comma after `"check": "tsc"` so the JSON stays valid. Do not touch any other key.

- [x] **Step 5:** Run `npm run build && npm run check:csp`. Expect five `checked http://127.0.0.1:4174/solved-tech/…` lines and `CSP check passed`, exit 0.

- [x] **Step 6: Prove the verifier can fail.** Temporarily edit `dist/index.html` (a build artefact, not source):

```bash
sed -i.bak 's/script-src '"'"'self'"'"'/script-src '"'"'none'"'"'/' dist/index.html && npm run check:csp; echo "exit=$?"; mv dist/index.html.bak dist/index.html
```

Expect `exit=1` and a problems list containing both a `CSP violation: script-src-elem` line and `the module script did not run` for `/solved-tech/`. Run `npm run check:csp` once more; expect exit 0 again.

- [x] **Step 7: Edit `.nvmrc`.** Replace its content with the single line

```
26
```

- [x] **Step 8: Replace `.github/workflows/deploy-pages.yml`** with the following file. Copy it exactly; the two SHAs are the ones already used in `.github/workflows/responsive.yml`. Do not invent SHAs for the three Pages actions — they stay on tags.

```yaml
name: Deploy GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@d23441a48e516b6c34aea4fa41551a30e30af803 # actions/checkout v6

      - name: Set up Node.js
        uses: actions/setup-node@249970729cb0ef3589644e2896645e5dc5ba9c38 # actions/setup-node v6
        with:
          node-version-file: .nvmrc
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Check types
        run: npm run check

      - name: Build site
        run: npm run build

      - name: Install Chromium for the CSP check
        run: npx playwright install --with-deps chromium

      - name: Check the Content-Security-Policy against the built pages
        run: npm run check:csp

      - name: Configure Pages
        uses: actions/configure-pages@v5

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v4
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [x] **Step 9:** Run `npm test` (135 passed; `tests/responsive-workflow.test.ts` covers only `responsive.yml` and is unaffected) and `npm run check`.

**Downstream:** `docs/hosting/security-headers.md` already tells operators to run `node scripts/check-csp.mts`; that command still works, no edit needed. The main plan's Section 0.2 ritual says `v25.x or newer`; `26` satisfies it.

**Done-when:**
- `npm run build && npm run check:csp` → `CSP check passed`, exit 0
- Step 6 shows exit 1 with a `script-src-elem` violation, and exit 0 after the restore
- `npm test` → 135 passed; `npm run check` → exit 0
- `git diff --stat` lists only `scripts/check-csp.mts`, `package.json`, `.github/workflows/deploy-pages.yml`, `.nvmrc`; `git status --short` shows no `dist/` changes (it is ignored)

**Commit:** `ci(security): run the CSP check against the built pages before deploying`

---

### Task 19: Keep the prerendered markup instead of re-rendering it on load

**Why it fails today:** Every entry module (`main.ts`, `service.ts`, `privacy.ts`) runs `app.innerHTML = render…()` even though `scripts/prerender.mts` already filled `#app` at build time. On the homepage the replacement nodes carry `[data-reveal]`, which under `.has-enhancement` start at `opacity: 0` until the `IntersectionObserver` fires — so a slow-network visitor sees the prerendered page paint, go blank, then fade back in. The fix is a `mount` helper that renders only when the mount is empty (the `vite dev` case, where there is no prerender), plus marking already-visible reveal targets as visible **before** `has-enhancement` is added, so nothing that is on screen ever drops to `opacity: 0`. The client and prerender renderers produce identical markup (same `baseUrl`), so keeping the prerendered DOM changes nothing visible.

**Branch:** `fix/f10-hydrate-prerender`

**Files:**
- Read: `src/enhance.ts` (lines 1–45), `src/main.ts`, `src/service.ts`, `src/privacy.ts`, `tests/motion.test.ts` (lines 1–20 and 147–200)
- Modify: `src/enhance.ts`, `src/main.ts`, `src/service.ts`, `src/privacy.ts`, `tests/motion.test.ts`

**Steps:**

- [x] **Step 1: Point the test at `enhance.ts` and add the failing tests.** In `tests/motion.test.ts` replace the import block

```ts
import {
  setupHeaderOffset,
  setupHeroInteraction,
  setupMobileMenu,
  setupMotionToggle,
  setupPipelineMotion,
  setupRevealMotion,
  setupScrollProgress,
} from "../src/main";
```

with

```ts
import {
  mount,
  settlePrerenderedReveals,
  setupHeaderOffset,
  setupHeroInteraction,
  setupMobileMenu,
  setupMotionToggle,
  setupPipelineMotion,
  setupRevealMotion,
  setupScrollProgress,
} from "../src/enhance";
```

Then add this block directly before `describe("reveal motion", () => {`:

```ts
describe("prerendered mount", () => {
  it("renders into an empty mount and reports that nothing was prerendered", () => {
    const render = vi.fn(() => "<h1>Rendered</h1>");
    const app = { firstElementChild: null, innerHTML: "" };

    expect(mount(app as unknown as HTMLElement, render)).toBe(false);
    expect(render).toHaveBeenCalledTimes(1);
    expect(app.innerHTML).toBe("<h1>Rendered</h1>");
  });

  it("keeps prerendered markup and does not render again", () => {
    const render = vi.fn(() => "<h1>Rendered</h1>");
    const app = { firstElementChild: {}, innerHTML: "<h1>Prerendered</h1>" };

    expect(mount(app as unknown as HTMLElement, render)).toBe(true);
    expect(render).not.toHaveBeenCalled();
    expect(app.innerHTML).toBe("<h1>Prerendered</h1>");
  });

  it("marks prerendered reveal targets already inside the viewport as visible", () => {
    const makeTarget = (top: number) => {
      const classes = new Set<string>();
      return {
        classes,
        getBoundingClientRect: () => ({ top }),
        classList: { add: (name: string) => classes.add(name) },
      };
    };
    const onScreen = makeTarget(200);
    const belowFold = makeTarget(1400);
    const root = {
      querySelectorAll: vi.fn(() => [onScreen, belowFold]),
    } as unknown as ParentNode;

    settlePrerenderedReveals(root, { innerHeight: 900 } as unknown as Window);

    expect(onScreen.classes.has("is-visible")).toBe(true);
    expect(belowFold.classes.has("is-visible")).toBe(false);
  });
});
```

- [x] **Step 2:** Run `npm run check`. Expect errors: `mount` and `settlePrerenderedReveals` are not exported from `../src/enhance`.

- [x] **Step 3: Edit `src/enhance.ts`.** Directly before `export const stagger = (root: ParentNode): void => {` insert:

```ts
export const mount = (app: HTMLElement, render: () => string): boolean => {
  if (app.firstElementChild) {
    return true;
  }

  app.innerHTML = render();
  return false;
};

export const settlePrerenderedReveals = (root: ParentNode, view: Window): void => {
  root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
    if (element.getBoundingClientRect().top < view.innerHeight) {
      element.classList.add("is-visible");
    }
  });
};

```

- [x] **Step 4: Edit `src/main.ts`.** Delete the whole re-export block:

```ts
export {
  setupHeaderOffset,
  setupHeroInteraction,
  setupMobileMenu,
  setupMotionToggle,
  setupPipelineMotion,
  setupRevealMotion,
  setupScrollProgress,
} from "./enhance";

```

In the import from `"./enhance"` add `mount,` before `prefersReducedMotion,` and `settlePrerenderedReveals,` before `setupHeaderOffset,` (keep alphabetical order). Then replace

```ts
  view.document.documentElement.classList.add("has-enhancement");
  app.innerHTML = renderHomepage(siteContent, contactConfig);
```

with

```ts
  const prerendered = mount(app, () => renderHomepage(siteContent, contactConfig));

  if (prerendered) {
    settlePrerenderedReveals(app, view);
  }

  view.document.documentElement.classList.add("has-enhancement");
```

- [x] **Step 5: Edit `src/service.ts`.** Add `mount,` to the front of the `./enhance` import list and replace

```ts
app.innerHTML = renderServicePage(page, siteContent, contactConfig);
```

with

```ts
mount(app, () => renderServicePage(page, siteContent, contactConfig));
```

`page` is narrowed by the `if (!page)` guard above it, so the closure is type-safe.

- [x] **Step 6: Edit `src/privacy.ts`.** Add `mount,` to the front of the `./enhance` import list and replace

```ts
app.innerHTML = renderPrivacyPage(privacyContent, contactConfig);
```

with

```ts
mount(app, () => renderPrivacyPage(privacyContent, contactConfig));
```

- [x] **Step 7:** Run `npm test` (135 → now 138 passed) and `npm run check`. Run `npm run build && npm run check:csp` — the verifier from Task 18 proves the bundle still executes on all five prerendered pages.

- [x] **Step 8:** Run `npx playwright test --project=uk-phone-standard --project=uk-desktop`. Under `vite dev` the mount is empty, so `mount` renders as before and every existing behaviour test must still pass.

- [x] **Step 9 (look, do not assert):** Optional, at most 2 MCP calls. Start `npm run preview -- --port 4175 --host 127.0.0.1` in the background, `browser_navigate` to `http://127.0.0.1:4175/solved-tech/`, then `browser_snapshot`. The hero heading and lead must be present. Stop the preview server.

**Downstream:** `tests/motion.test.ts` import path (Step 1). No test counts in `tests/e2e/responsive.spec.ts` change.

**Done-when:**
- `npm test` → 138 passed; `npm run check` → exit 0
- `npm run build && npm run check:csp` → `CSP check passed`
- Playwright `uk-phone-standard` + `uk-desktop` → all passed
- `grep -n 'innerHTML' src/main.ts src/service.ts src/privacy.ts` prints nothing
- `git diff --stat` lists only the five files above

**Commit:** `fix(prerender): hydrate the prerendered mount instead of re-rendering it`

---

### Task 20: The motion toggle announces one state, not two

**Why it fails today:** `setupMotionToggle` both sets `aria-pressed` and swaps the label between "Pause background motion" and "Resume background motion". Assistive technology reads "Resume background motion, toggle button, pressed" — the name says one thing, the state says the opposite. A button whose label describes the *next* action must not also carry `aria-pressed`. Keep the label swap (it is what sighted users rely on) and drop `aria-pressed`; the `motion-paused` class on `<html>` is the single source of truth.

**Branch:** `fix/f08-toggle-state`

**Files:**
- Read: `src/enhance.ts` (`setupMotionToggle`), `src/render.ts` (line 510), `tests/motion.test.ts` (lines 559–630), `tests/render.test.ts` (line 427), `tests/e2e/responsive.spec.ts` (lines 653–681)
- Modify: `src/enhance.ts`, `src/render.ts`, `tests/motion.test.ts`, `tests/render.test.ts`, `tests/e2e/responsive.spec.ts`

**Steps:**

- [x] **Step 1: Update the unit test fake and assertions** in `tests/motion.test.ts`, `describe("motion toggle")`:

Replace

```ts
    const attributes = new Map([["aria-pressed", "false"]]);
    const handlers = new Map<string, () => void>();
```

with

```ts
    const handlers = new Map<string, () => void>();
```

Replace

```ts
      textContent: "Pause background motion",
      getAttribute: (name: string) => attributes.get(name) ?? null,
      setAttribute: (name: string, value: string) => attributes.set(name, value),
      addEventListener: (type: string, handler: () => void) =>
```

with

```ts
      textContent: "Pause background motion",
      addEventListener: (type: string, handler: () => void) =>
```

The fake deliberately has no `getAttribute`/`setAttribute`: if the implementation touches `aria-pressed` again, the click handler throws and the test fails.

Replace the `classList` fake

```ts
          classList: {
            toggle: (name: string, force: boolean) => {
```

with

```ts
          classList: {
            contains: (name: string) => classes.has(name),
            toggle: (name: string, force: boolean) => {
```

Replace

```ts
    return { attributes, button, classes, handlers, query, fireChange: () => onChange?.() };
```

with

```ts
    return { button, classes, handlers, query, fireChange: () => onChange?.() };
```

Replace the first `it` block's body so it reads:

```ts
  it("pauses and resumes continuous motion through the label and the html class", () => {
    const { button, classes, handlers } = createToggle(false);

    expect(button.hidden).toBe(false);

    handlers.get("click")?.();
    expect(button.textContent).toBe("Resume background motion");
    expect(classes.has("motion-paused")).toBe(true);

    handlers.get("click")?.();
    expect(button.textContent).toBe("Pause background motion");
    expect(classes.has("motion-paused")).toBe(false);
  });
```

- [x] **Step 2: Update `tests/render.test.ts` line 427.** Replace

```ts
      '<button class="motion-toggle" type="button" aria-pressed="false">Pause background motion</button>',
```

with

```ts
      '<button class="motion-toggle" type="button">Pause background motion</button>',
```

- [x] **Step 3:** Run `npm test`. Expect exactly 2 failures: the render assertion and `pauses and resumes…` (the click handler calls `getAttribute`, which the fake no longer has).

- [x] **Step 4: Edit `src/enhance.ts`.** In `setupMotionToggle` replace

```ts
  const setPaused = (paused: boolean): void => {
    html.classList.toggle("motion-paused", paused);
    button.setAttribute("aria-pressed", String(paused));
    button.textContent = paused
      ? "Resume background motion"
      : "Pause background motion";
  };
```

with

```ts
  const setPaused = (paused: boolean): void => {
    html.classList.toggle("motion-paused", paused);
    button.textContent = paused
      ? "Resume background motion"
      : "Pause background motion";
  };
```

and replace

```ts
  button.addEventListener("click", () => {
    setPaused(button.getAttribute("aria-pressed") !== "true");
  });
```

with

```ts
  button.addEventListener("click", () => {
    setPaused(!html.classList.contains("motion-paused"));
  });
```

- [x] **Step 5: Edit `src/render.ts` line 510.** Replace `<button class="motion-toggle" type="button" aria-pressed="false">Pause background motion</button>` with `<button class="motion-toggle" type="button">Pause background motion</button>`.

- [x] **Step 6: Edit the e2e test** `background motion can be paused from a visible control` in `tests/e2e/responsive.spec.ts`. Replace the three `aria-pressed` assertions:

```ts
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
```
→
```ts
  await expect(toggle).toHaveText("Pause background motion");
  await expect(toggle).not.toHaveAttribute("aria-pressed");
```

```ts
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(toggle).toHaveText("Resume background motion");
```
→
```ts
  await expect(toggle).toHaveText("Resume background motion");
```

```ts
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await expect.poll(playState).toBe("running");
```
→
```ts
  await expect(toggle).toHaveText("Pause background motion");
  await expect.poll(playState).toBe("running");
```

- [x] **Step 7:** Run `npm test` (138 passed), `npm run check`, then `npx playwright test --project=uk-phone-standard --project=uk-desktop`.

- [x] **Step 8:** Confirm nothing else references the attribute: `grep -rn 'aria-pressed' src tests` must print exactly one line — the `not.toHaveAttribute` assertion from Step 6.

**Downstream:** `tests/render.test.ts:427` (Step 2), `tests/e2e/responsive.spec.ts` (Step 6). `src/styles.css` has no `[aria-pressed]` selector, so no CSS change.

**Done-when:**
- `npm test` → 138 passed; `npm run check` → exit 0
- Playwright `uk-phone-standard` + `uk-desktop` → all passed
- Step 8 grep is clean
- `git diff --stat` lists only the five files above

**Commit:** `fix(a11y): let the motion toggle label carry its state instead of aria-pressed`

---

### Task 21: Need-selector boundary contrast, Back-to-top focus, and actionable contact on the privacy page

**Why it fails today:** Three small accessibility gaps, each a one-line source change:
1. `.need-link` is identified only by a `1px` border in `--line-strong` (#4d4842) on `--surface` (#191817), a 1.96:1 ratio; WCAG 1.4.11 requires 3:1 for a control boundary that is the sole affordance. `--ink-faint` (#6f6a63) gives ≈3.3:1.
2. `<div id="top">` is not focusable, so activating "Back to top" scrolls but leaves keyboard focus on the footer link that is now off-screen. Per the HTML fragment-navigation algorithm, a focusable target (`tabindex="-1"`) receives focus.
3. The privacy page prints the email and phone as plain text; the audit's F14 acceptance expects a route to exercise rights, which means links.

**Branch:** `fix/a11y-followups`

**Files:**
- Read: `src/styles.css` (lines 786–800), `src/render.ts` (lines 319 and 608), `tests/motion.test.ts` (`describe("stylesheet contracts")`), `tests/render.test.ts` (lines 380–392 and 453–480), `tests/e2e/responsive.spec.ts` (lines 53–69)
- Modify: `src/styles.css`, `src/render.ts`, `tests/motion.test.ts`, `tests/render.test.ts`, `tests/e2e/responsive.spec.ts`

**Steps:**

- [x] **Step 1: Add the contrast test** at the end of `describe("stylesheet contracts")` in `tests/motion.test.ts`:

```ts
  it("gives the need-link boundary at least 3:1 contrast against the surface", () => {
    const token = (name: string): string =>
      styles.match(new RegExp(`--${name}: (#[0-9a-f]{6});`))?.[1] ?? "";
    const luminance = (hex: string): number => {
      const channel = (offset: number): number => {
        const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
    };
    const borderToken =
      styles.match(/\.need-link \{[^}]*border: 1px solid var\(--([a-z-]+)\)/)?.[1] ?? "";

    expect(borderToken).not.toBe("");
    const ratio = (luminance(token(borderToken)) + 0.05) / (luminance(token("surface")) + 0.05);
    expect(ratio).toBeGreaterThanOrEqual(3);
  });
```

- [x] **Step 2: Update the back-to-top render assertion** in `tests/render.test.ts`. Replace

```ts
    expect(html).toContain('<div id="top" class="page-top"></div>');
```

with

```ts
    expect(html).toContain('<div id="top" class="page-top" tabindex="-1"></div>');
```

- [x] **Step 3: Add the privacy-link test** at the end of `describe("privacy page renderer")` in `tests/render.test.ts`:

```ts
  it("links the email and phone for questions about the notice", () => {
    expect(html).toContain(
      `<a href="mailto:${contactConfig.email}">${contactConfig.email}</a>`,
    );
    expect(html).toContain(
      `<a href="tel:${contactConfig.phone}">${contactConfig.displayPhone}</a>`,
    );
  });
```

- [x] **Step 4:** Run `npm test`. Expect exactly 3 failures (Steps 1–3).

- [x] **Step 5: Edit `src/styles.css`.** In the `.need-link {` rule replace

```css
  border: 1px solid var(--line-strong);
```

with

```css
  border: 1px solid var(--ink-faint);
```

Then, directly after the closing `}` of the `.need-link:hover, .need-link:focus-visible` rule, add:

```css
.page-top:focus {
  outline: none;
}
```

(`#top` is a zero-height programmatic target, never reachable by Tab; the outline would otherwise draw a stray 8 px-tall box at the top of the page after "Back to top".)

- [x] **Step 6: Edit `src/render.ts`.** Replace line 319

```html
    <div id="top" class="page-top"></div>
```

with

```html
    <div id="top" class="page-top" tabindex="-1"></div>
```

and replace the privacy paragraph at line 608

```ts
          <p>Email ${escapeHtml(config.email)} or call ${escapeHtml(config.displayPhone)} with any question about this notice or to exercise your rights.</p>
```

with

```ts
          <p>Email <a href="mailto:${escapeHtml(config.email)}">${escapeHtml(config.email)}</a> or call <a href="tel:${escapeHtml(config.phone)}">${escapeHtml(config.displayPhone)}</a> with any question about this notice or to exercise your rights.</p>
```

- [x] **Step 7: Extend the e2e back-to-top test.** In `tests/e2e/responsive.spec.ts`, inside `back to top brings the hero into view from the footer`, directly after

```ts
  await expect(page.locator("#hero-heading")).toBeInViewport();
```

add

```ts
  await expect(page.locator("#top")).toBeFocused();
```

- [x] **Step 8:** Run `npm test` (140 passed), `npm run check`, then `npx playwright test --project=uk-phone-standard --project=uk-desktop`. If `toBeFocused` fails on **one** engine only, stop and report it under OPEN QUESTIONS with the project name — do not weaken the assertion.

**Downstream:** `tests/render.test.ts` back-to-top string (Step 2). The homepage `data-channel` counts are unaffected because the new links are on the privacy page and carry no `data-analytics` attributes. `prefers-contrast: more` override for `.need-link` (`styles.css` ≈ line 2058) stays as is.

**Done-when:**
- `npm test` → 140 passed; `npm run check` → exit 0
- Playwright `uk-phone-standard` + `uk-desktop` → all passed
- `git diff --stat` lists only the five files above

**Commit:** `fix(a11y): raise need-link boundary contrast, focus the back-to-top target and link privacy contacts`

---

## 4. After these tasks

Run main-plan **Task 15** (launch gate) next. Before flipping `siteStatus.launched`, obtain a decision on deferred item **D7** (`privacyPage.indexable`) and confirm whether **H8** (privacy recipients) is ready; if H8 arrives, apply it as a content-only commit before Task 15 (`src/content.ts` and `tests/content.test.ts` only).

**Status, 18 September 2026:** Tasks 16–21 are done and committed. Every one of Task 15's Step 1 checks now passes — no `[[` tokens, `placeholder: false`, all service pages `approved: true`, and `public/brand/solved-tech-social.png` exists at 1200×630 — so the launch is **held only at D7**. The founders have not yet decided whether the privacy notice becomes indexable, so `siteStatus` stays `{ launched: false }` and nothing is flipped. H8 is not ready either; because the notice must not be rewritten without it, H8 stays a recorded gap rather than a launch blocker.

## 5. Test-count ledger

| After task | `npm test` | Notes |
| --- | --- | --- |
| baseline (`2db9c1a`) | 132 | `wide-desktop` e2e red |
| 16 | 132 | one e2e test removed |
| 17 | 135 | +3 in `tests/head.test.ts` |
| 18 | 135 | no unit tests added; `check:csp` script added |
| 19 | 138 | +3 in `tests/motion.test.ts` |
| 20 | 138 | assertions changed, none added |
| 21 | 140 | +1 `tests/motion.test.ts`, +1 `tests/render.test.ts` |

If an actual count differs by one from this table, record it in the task report and continue; the ledger is a guide, not a gate.

