import { expect, test, type Locator, type Page } from "@playwright/test";

type Viewport = { width: number; height: number };

const PHONE_LANDSCAPE_PROJECT = "phone-landscape";

const setupErrorCollection = (page: Page) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  return { consoleErrors, pageErrors };
};

const viewportSize = (page: Page): Viewport => page.viewportSize()!;

const assertCompleteBounds = async (
  page: Page,
  locator: Locator,
  viewport: Viewport,
) => {
  await expect(locator).toBeVisible();

  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width).toBeGreaterThan(0);
  expect(box!.height).toBeGreaterThan(0);
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width + 0.5);
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height + 0.5);
};

const assertMinHeight = async (locator: Locator, minHeight: number) => {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.height).toBeGreaterThanOrEqual(minHeight - 0.5);
};

const assertNoDocumentOverflow = async (page: Page) => {
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));

  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
};

const assertRenderedDiagram = async (
  page: Page,
  locator: Locator,
  viewport: Viewport,
) => {
  await locator.scrollIntoViewIfNeeded();

  const metrics = await locator.evaluate((element) => {
    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();

    return {
      opacity: Number.parseFloat(style.opacity),
      width: rect.width,
      height: rect.height,
      x: rect.x,
      y: rect.y,
    };
  });

  expect(metrics.opacity).toBeGreaterThan(0);
  expect(metrics.width).toBeGreaterThan(0);
  expect(metrics.height).toBeGreaterThan(0);
  expect(metrics.x).toBeGreaterThanOrEqual(0);
  expect(metrics.y).toBeGreaterThanOrEqual(0);
  expect(metrics.x + metrics.width).toBeLessThanOrEqual(viewport.width + 0.5);
  expect(metrics.y + metrics.height).toBeLessThanOrEqual(viewport.height + 0.5);
};

const gridColumnCount = (columns: string) =>
  columns.split(/\s+/).filter(Boolean).length;

test("responsive smoke matrix", async ({ page }, testInfo) => {
  const projectName = testInfo.project.name;
  const viewport = viewportSize(page);
  const { consoleErrors, pageErrors } = setupErrorCollection(page);

  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");

  // 1. No horizontal document overflow
  await assertNoDocumentOverflow(page);

  // 2. No console or page errors
  expect(consoleErrors, "console errors").toEqual([]);
  expect(pageErrors, "page errors").toEqual([]);

  // 3. Header controls in complete bounds
  const wordmark = page.locator(".wordmark");
  await assertCompleteBounds(page, wordmark, viewport);

  if (viewport.width < 768) {
    const menuToggle = page.locator(".menu-toggle");
    await expect(menuToggle).toBeVisible();
    await assertCompleteBounds(page, menuToggle, viewport);
  } else {
    const navLinks = page.locator("#primary-navigation a");
    await expect(navLinks).toHaveCount(4);
    for (const link of await navLinks.all()) {
      await assertCompleteBounds(page, link, viewport);
    }
  }

  // 4. Minimum target sizes
  const heroActions = page.locator(".hero__actions .contact-action");
  await expect(heroActions).toHaveCount(3);
  for (const action of await heroActions.all()) {
    await assertMinHeight(action, 48);
  }

  if (viewport.width < 768) {
    await assertMinHeight(page.locator(".menu-toggle"), 44);
  } else {
    for (const link of await page.locator("#primary-navigation a").all()) {
      await assertMinHeight(link, 44);
    }
  }

  // 5–6. Hero actions geometry
  if (projectName !== PHONE_LANDSCAPE_PROJECT) {
    await page.evaluate(() => window.scrollTo(0, 0));
  }

  for (const action of await heroActions.all()) {
    if (projectName === PHONE_LANDSCAPE_PROJECT) {
      await action.scrollIntoViewIfNeeded();
    }

    await assertCompleteBounds(page, action, viewport);
  }

  // 7. 40rem contact stack
  const contactActions = page.locator(".contact__actions");
  await contactActions.scrollIntoViewIfNeeded();
  const contactColumns = await contactActions.evaluate(
    (element) => getComputedStyle(element).gridTemplateColumns,
  );

  if (viewport.width < 640) {
    expect(gridColumnCount(contactColumns)).toBe(1);
  } else {
    expect(gridColumnCount(contactColumns)).toBe(3);
  }

  // 8. 48rem service split
  const serviceBody = page.locator(".service-box").first().locator(".service-box__body");
  await serviceBody.scrollIntoViewIfNeeded();
  const serviceColumns = await serviceBody.evaluate(
    (element) => getComputedStyle(element).gridTemplateColumns,
  );

  if (viewport.width >= 768) {
    expect(serviceColumns.split(" ").length).toBeGreaterThanOrEqual(2);
  } else {
    expect(serviceColumns.split(" ").length).toBe(1);
  }

  // 9. 48rem team grid
  const teamGrid = page.locator(".team__grid");
  await teamGrid.scrollIntoViewIfNeeded();
  const teamColumns = await teamGrid.evaluate(
    (element) => getComputedStyle(element).gridTemplateColumns,
  );

  if (viewport.width >= 768) {
    expect(gridColumnCount(teamColumns)).toBe(2);
  } else {
    expect(gridColumnCount(teamColumns)).toBe(1);
  }

  // 10. 52rem journey horizontal
  const journeyMoments = page.locator(".journey__moments");
  await journeyMoments.scrollIntoViewIfNeeded();
  const journeyColumns = await journeyMoments.evaluate(
    (element) => getComputedStyle(element).gridTemplateColumns,
  );

  if (viewport.width >= 832) {
    expect(gridColumnCount(journeyColumns)).toBe(4);
  } else {
    expect(gridColumnCount(journeyColumns)).toBe(1);
  }

  // 11. 64rem contact rail
  const contactHeading = page.locator(".contact > h2");
  await contactHeading.scrollIntoViewIfNeeded();
  const headingPosition = await contactHeading.evaluate(
    (element) => getComputedStyle(element).position,
  );

  if (viewport.width >= 1024) {
    expect(headingPosition).toBe("sticky");
  } else {
    expect(headingPosition).not.toBe("sticky");
  }

  // 12. Service rows visible before reveal
  const serviceBoxes = page.locator(".service-box");
  await expect(serviceBoxes).toHaveCount(5);

  for (const serviceBox of await serviceBoxes.all()) {
    const header = serviceBox.locator(".service-box__header");
    await header.scrollIntoViewIfNeeded();

    const question = serviceBox.locator(".service-box__question");
    const answer = serviceBox.locator(".service-box__header > p");
    const provides = serviceBox.locator(".service-box__provides");

    await assertCompleteBounds(page, question, viewport);
    await assertCompleteBounds(page, answer, viewport);
    await provides.scrollIntoViewIfNeeded();
    await assertCompleteBounds(page, provides, viewport);
  }

  // 13. Service and journey diagram geometry; hero clip
  const heroOverflow = await page.locator(".hero").evaluate((element) => {
    const style = getComputedStyle(element);
    return style.overflow;
  });
  expect(["clip", "hidden"]).toContain(heroOverflow);

  for (const artwork of await page.locator(".service-box__artwork .service-art").all()) {
    await assertRenderedDiagram(page, artwork, viewport);
  }

  for (const signal of await page.locator(".journey__signal svg").all()) {
    await assertRenderedDiagram(page, signal, viewport);
  }

  // 15. Wide-screen balance (2560×1440 only)
  if (projectName === "wide-desktop") {
    const serviceGrid = page.locator(".service-grid");
    await serviceGrid.scrollIntoViewIfNeeded();

    const gridBox = await serviceGrid.boundingBox();
    expect(gridBox).not.toBeNull();
    expect(gridBox!.width / viewport.width).toBeGreaterThanOrEqual(0.52);

    const contactNote = page.locator(".contact-note");
    await contactNote.scrollIntoViewIfNeeded();
    const noteWidth = (await contactNote.boundingBox())?.width ?? 0;
    expect(noteWidth).toBeGreaterThan(0);
    expect(noteWidth).toBeLessThanOrEqual(920);

    const heroLead = page.locator(".hero p").first();
    const leadWidth = (await heroLead.boundingBox())?.width ?? 0;
    expect(leadWidth).toBeGreaterThan(0);
    expect(leadWidth).toBeLessThanOrEqual(920);
  }
});

test("reduced motion exposes complete static content", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== "uk-phone-standard",
    "Chromium 390×844 project only",
  );

  const viewport = viewportSize(page);
  const { consoleErrors, pageErrors } = setupErrorCollection(page);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");

  expect(consoleErrors, "console errors").toEqual([]);
  expect(pageErrors, "page errors").toEqual([]);
  await assertNoDocumentOverflow(page);

  for (const artwork of await page.locator(".service-box__artwork .service-art").all()) {
    await assertRenderedDiagram(page, artwork, viewport);
  }

  for (const moment of await page.locator(".journey__moment").all()) {
    await moment.scrollIntoViewIfNeeded();
    await assertCompleteBounds(page, moment, viewport);
  }

  for (const signal of await page.locator(".journey__signal svg").all()) {
    await assertRenderedDiagram(page, signal, viewport);
  }
});
