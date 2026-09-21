import { expect, test } from "@playwright/test";
import {
  assertCompleteBounds,
  assertMinHeight,
  assertMotionDisabled,
  assertNoDocumentOverflow,
  assertNoRuntimeErrors,
  assertStable,
  assertVisibleLayout,
  cardColumnCount,
  geometryDelta,
  gotoHome,
  gridColumnCount,
  groupByRow,
  measureCardGrid,
  measureHeroGeometry,
  measureHeroSizing,
  rectSpread,
  PIPELINE_LABEL_MIN_HEIGHT,
  preparePage,
  REDUCED_MOTION_PROJECT,
  assertPipelineLabelsRendered,
  measurePipelineLayout,
  assertProseWidth,
  scrollJourneyIntoReveal,
  setupErrorCollection,
  viewportSize,
  WIDE_DESKTOP_PROJECT,
} from "./responsive.helpers";

test("document has no horizontal overflow", async ({ page }) => {
  const collector = await preparePage(page);
  await assertNoDocumentOverflow(page);
  assertNoRuntimeErrors(collector);
});

test("header controls stay in complete bounds", async ({ page }) => {
  const collector = await preparePage(page);
  const viewport = viewportSize(page);

  await assertCompleteBounds(page, page.locator(".wordmark"), viewport);

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

  assertNoRuntimeErrors(collector);
});

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
  await expect(page.locator("#top")).toBeFocused();

  assertNoRuntimeErrors(collector);
});

test("interactive targets have complete bounds and minimum touch heights", async ({
  page,
}) => {
  const collector = await preparePage(page);
  const viewport = viewportSize(page);

  const skipLink = page.locator(".skip-link");
  await expect(skipLink).toHaveCount(1);
  await skipLink.focus();
  await assertMinHeight(skipLink, 44);
  await assertCompleteBounds(page, skipLink, viewport);

  const wordmark = page.locator(".wordmark");
  await expect(wordmark).toHaveCount(1);
  await wordmark.scrollIntoViewIfNeeded();
  await assertMinHeight(wordmark, 44);
  await assertCompleteBounds(page, wordmark, viewport);

  const contactActions = page.locator(".contact-action");
  await expect(contactActions).toHaveCount(6);
  for (const action of await contactActions.all()) {
    await action.scrollIntoViewIfNeeded();
    await assertMinHeight(action, 48);
    await assertCompleteBounds(page, action, viewport);
  }

  const cardLinks = page.locator(".product-card__link");
  await expect(cardLinks).toHaveCount(6);
  for (const link of await cardLinks.all()) {
    await link.scrollIntoViewIfNeeded();
    await assertMinHeight(link, 44);

    const box = await link.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(0);
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width + 0.5);
    await expect(link).toBeInViewport();
  }

  const navigationLinks = page.locator("#primary-navigation a");
  await expect(navigationLinks).toHaveCount(4);
  if (viewport.width < 768) {
    const menuToggle = page.locator(".menu-toggle");
    await menuToggle.scrollIntoViewIfNeeded();
    await assertMinHeight(menuToggle, 44);
    await assertCompleteBounds(page, menuToggle, viewport);
    await menuToggle.click();
  }
  for (const link of await navigationLinks.all()) {
    await link.scrollIntoViewIfNeeded();
    await assertMinHeight(link, 44);
    await assertCompleteBounds(page, link, viewport);
  }

  const founderLinks = page.locator(".founder__details a");
  await expect(founderLinks).toHaveCount(2);
  for (const link of await founderLinks.all()) {
    await link.scrollIntoViewIfNeeded();
    await assertMinHeight(link, 44);
    await assertCompleteBounds(page, link, viewport);
  }

  const footerLinks = page.locator("footer a");
  await expect(footerLinks).toHaveCount(2);
  for (const link of await footerLinks.all()) {
    await link.scrollIntoViewIfNeeded();
    await assertMinHeight(link, 44);
    await assertCompleteBounds(page, link, viewport);
  }

  await assertNoDocumentOverflow(page);
  assertNoRuntimeErrors(collector);
});

test("mobile menu opens, contains usable links, and closes on navigation", async ({
  page,
}) => {
  const collector = await preparePage(page);
  const viewport = viewportSize(page);
  test.skip(viewport.width >= 768, "Profiles below 48rem only");

  const menuToggle = page.locator(".menu-toggle");
  const navigation = page.locator("#primary-navigation");
  const links = navigation.locator("a");

  await expect(menuToggle).toHaveAttribute("aria-expanded", "false");
  await expect(navigation).not.toHaveClass(/is-open/);
  await expect(links).toHaveCount(4);

  await menuToggle.click();
  await expect(menuToggle).toHaveAttribute("aria-expanded", "true");
  await expect(navigation).toHaveClass(/is-open/);

  for (const link of await links.all()) {
    await assertMinHeight(link, 44);
    await assertCompleteBounds(page, link, viewport);
  }
  await assertNoDocumentOverflow(page);
  await page.keyboard.press("Escape");
  await expect(menuToggle).toHaveAttribute("aria-expanded", "false");
  await expect(navigation).not.toHaveClass(/is-open/);
  await expect(menuToggle).toBeFocused();
  await expect(links.first()).toBeHidden();

  await menuToggle.click();
  await expect(menuToggle).toHaveAttribute("aria-expanded", "true");

  await navigation.locator('a[href="#services"]').click();
  await expect(page).toHaveURL(/#services$/);
  await expect(menuToggle).toHaveAttribute("aria-expanded", "false");
  await expect(navigation).not.toHaveClass(/is-open/);

  assertNoRuntimeErrors(collector);
});

test("hero contact actions stay in complete bounds without clipped labels", async ({
  page,
}) => {
  const collector = await preparePage(page);
  const viewport = viewportSize(page);
  const heroActions = page.locator(".hero__actions .contact-action");

  for (const action of await heroActions.all()) {
    await action.scrollIntoViewIfNeeded();
    await assertCompleteBounds(page, action, viewport);

    const labelOverflow = await action.evaluate((element) => ({
      scrollWidth: element.scrollWidth,
      clientWidth: element.clientWidth,
    }));
    expect(labelOverflow.scrollWidth).toBeLessThanOrEqual(labelOverflow.clientWidth);
  }

  assertNoRuntimeErrors(collector);
});

test("contact actions stack below 40rem", async ({ page }) => {
  const collector = await preparePage(page);
  const viewport = viewportSize(page);
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

  assertNoRuntimeErrors(collector);
});

test("product grid splits into one, two and three columns", async ({ page }) => {
  const collector = await preparePage(page);
  const viewport = viewportSize(page);
  const columns = await cardColumnCount(page);

  if (viewport.width >= 1152) {
    expect(columns).toBe(3);
  } else if (viewport.width >= 768) {
    expect(columns).toBe(2);
  } else {
    expect(columns).toBe(1);
  }

  assertNoRuntimeErrors(collector);
});

test("product grid respects the 48rem and 72rem column boundaries", async ({
  page,
}) => {
  const collector = setupErrorCollection(page);

  for (const [width, expected] of [
    [767, 1],
    [768, 2],
    [1024, 2],
    [1151, 2],
    [1152, 3],
  ] as const) {
    await page.setViewportSize({ width, height: 900 });
    await gotoHome(page);
    expect(await cardColumnCount(page), `columns at ${width}px`).toBe(expected);
    await assertNoDocumentOverflow(page);
  }

  assertNoRuntimeErrors(collector);
});

test("services catalogue fits the 390px height budget", async ({ page }) => {
  const collector = await preparePage(page);
  const viewport = viewportSize(page);
  test.skip(viewport.width !== 390, "390px profiles only");

  const grid = page.locator(".product-grid");
  await grid.scrollIntoViewIfNeeded();

  const gridBox = await grid.boundingBox();
  expect(gridBox).not.toBeNull();
  expect(gridBox!.height).toBeLessThanOrEqual(1500);

  await expect(page.locator(".product-card")).toHaveCount(6);
  await expect(page.locator(".product-card .product-glyph")).toHaveCount(6);

  for (const glyph of await page.locator(".product-card .product-glyph").all()) {
    await glyph.scrollIntoViewIfNeeded();
    await assertVisibleLayout(glyph);
  }

  await assertNoDocumentOverflow(page);
  assertNoRuntimeErrors(collector);
});

test("multi-column cards share equal heights and aligned CTA rails", async ({
  page,
}) => {
  const collector = await preparePage(page);
  const viewport = viewportSize(page);
  test.skip(viewport.width < 768, "Multi-column profiles only");

  const metrics = await measureCardGrid(page);

  expect(metrics.cards).toHaveLength(6);
  expect(metrics.links).toHaveLength(6);
  expect(metrics.ctas).toHaveLength(6);

  expect(rectSpread(metrics.links, "height")).toBeLessThanOrEqual(1);
  expect(rectSpread(metrics.cards, "height")).toBeLessThanOrEqual(1);

  for (const row of groupByRow(metrics.ctas)) {
    expect(rectSpread(row, "y")).toBeLessThanOrEqual(1);
  }

  assertNoRuntimeErrors(collector);
});

test("services header aligns to the grid edges and stacks below 48rem", async ({
  page,
}) => {
  const collector = await preparePage(page);
  const viewport = viewportSize(page);
  const header = page.locator(".services__header");
  const grid = page.locator(".product-grid");

  await grid.scrollIntoViewIfNeeded();
  const [headerBox, gridBox] = await Promise.all([
    header.boundingBox(),
    grid.boundingBox(),
  ]);

  expect(headerBox).not.toBeNull();
  expect(gridBox).not.toBeNull();
  expect(Math.abs(headerBox!.x - gridBox!.x)).toBeLessThanOrEqual(1);
  expect(
    Math.abs(headerBox!.x + headerBox!.width - (gridBox!.x + gridBox!.width)),
  ).toBeLessThanOrEqual(1);

  const headerColumns = await header.evaluate(
    (element) => getComputedStyle(element).gridTemplateColumns,
  );
  expect(gridColumnCount(headerColumns)).toBe(viewport.width >= 768 ? 2 : 1);

  assertNoRuntimeErrors(collector);
});

test("services heading stays on a single line inside the header", async ({
  page,
}) => {
  const collector = await preparePage(page);
  const heading = page.locator("#services-heading");

  await heading.scrollIntoViewIfNeeded();

  const metrics = await heading.evaluate((element) => {
    const container = element.closest(".services__heading");
    const containerBox = container?.getBoundingClientRect() ?? null;
    const box = element.getBoundingClientRect();
    const lineHeight = Number.parseFloat(getComputedStyle(element).lineHeight);

    return {
      lines: Math.round(box.height / lineHeight),
      overflow: element.scrollWidth - element.clientWidth,
      outside: containerBox ? box.right - containerBox.right : 0,
    };
  });

  expect(metrics.lines).toBe(1);
  expect(metrics.overflow).toBeLessThanOrEqual(0.5);
  expect(metrics.outside).toBeLessThanOrEqual(0.5);

  assertNoRuntimeErrors(collector);
});

test("team grid splits at 48rem", async ({ page }) => {
  const collector = await preparePage(page);
  const viewport = viewportSize(page);
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

  assertNoRuntimeErrors(collector);
});

test("journey route is horizontal at 52rem", async ({ page }) => {
  const collector = await preparePage(page);
  const viewport = viewportSize(page);
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

  assertNoRuntimeErrors(collector);
});

test("contact heading is sticky at 64rem", async ({ page }) => {
  const collector = await preparePage(page);
  const viewport = viewportSize(page);
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

  assertNoRuntimeErrors(collector);
});

test("product card text stays visible before any reveal", async ({ page }) => {
  const collector = await preparePage(page);
  const cards = page.locator(".product-card");

  await expect(cards).toHaveCount(6);
  await page.evaluate(() => window.scrollTo(0, 0));

  for (const card of await cards.all()) {
    await assertVisibleLayout(card.locator(".product-card__top"));
    await assertVisibleLayout(card.locator(".product-glyph"));
    await assertVisibleLayout(card.locator(".product-card__eyebrow"));
    await assertVisibleLayout(card.locator(".product-card__title"));
    await assertVisibleLayout(card.locator(".product-card__outcome"));
    await assertVisibleLayout(card.locator(".product-card__action"));
  }

  assertNoRuntimeErrors(collector);
});

test("product card titles stay on a single line inside the card", async ({
  page,
}) => {
  const collector = await preparePage(page);
  const titles = page.locator(".product-card__title");

  await expect(titles).toHaveCount(6);

  for (const title of await titles.all()) {
    await title.scrollIntoViewIfNeeded();

    const metrics = await title.evaluate((element) => {
      const link = element.closest(".product-card__link");
      const linkBox = link?.getBoundingClientRect() ?? null;
      const box = element.getBoundingClientRect();
      const lineHeight = Number.parseFloat(getComputedStyle(element).lineHeight);

      return {
        lines: Math.round(box.height / lineHeight),
        overflow: element.scrollWidth - element.clientWidth,
        outside: linkBox ? box.right - linkBox.right : 0,
      };
    });

    expect(metrics.lines).toBe(1);
    expect(metrics.overflow).toBeLessThanOrEqual(0.5);
    expect(metrics.outside).toBeLessThanOrEqual(0.5);
  }

  assertNoRuntimeErrors(collector);
});

test("journey diagrams render in complete bounds", async ({ page }) => {
  const collector = await preparePage(page);
  const viewport = viewportSize(page);

  await expect(page.locator(".journey__signal svg")).toHaveCount(4);

  await scrollJourneyIntoReveal(page, viewport);

  assertNoRuntimeErrors(collector);
});

test("hero clips decorative pipeline overflow", async ({ page }) => {
  const collector = await preparePage(page);

  const heroOverflow = await page.locator(".hero").evaluate((element) => {
    return getComputedStyle(element).overflow;
  });
  expect(["clip", "hidden"]).toContain(heroOverflow);

  assertNoRuntimeErrors(collector);
});

test("hero pipeline labels stay legible when rendered", async ({ page }) => {
  const collector = await preparePage(page);

  await assertPipelineLabelsRendered(page);

  assertNoRuntimeErrors(collector);
});

test("40rem boundary preserves hero geometry and contact columns", async ({
  page,
}) => {
  const collector = setupErrorCollection(page);

  await page.setViewportSize({ width: 639, height: 844 });
  await gotoHome(page);
  const narrowContact = page.locator(".contact__actions");
  await narrowContact.scrollIntoViewIfNeeded();
  expect(
    gridColumnCount(
      await narrowContact.evaluate(
        (element) => getComputedStyle(element).gridTemplateColumns,
      ),
    ),
  ).toBe(1);
  const narrow = await measurePipelineLayout(page);

  await page.setViewportSize({ width: 640, height: 844 });
  await gotoHome(page);
  const wideContact = page.locator(".contact__actions");
  await wideContact.scrollIntoViewIfNeeded();
  expect(
    gridColumnCount(
      await wideContact.evaluate(
        (element) => getComputedStyle(element).gridTemplateColumns,
      ),
    ),
  ).toBe(3);
  const wide = await measurePipelineLayout(page);

  const widthDelta =
    Math.abs(wide.pipelineWidth - narrow.pipelineWidth) /
    Math.max(narrow.pipelineWidth, wide.pipelineWidth);

  expect(widthDelta).toBeLessThanOrEqual(0.05);

  for (const height of [...narrow.labelHeights, ...wide.labelHeights]) {
    expect(height).toBeGreaterThanOrEqual(PIPELINE_LABEL_MIN_HEIGHT - 0.5);
  }

  assertNoRuntimeErrors(collector);
});

const assertSmoothHeroBoundary = async (
  page: Parameters<typeof measureHeroGeometry>[0],
  first: { width: number; height: number },
  second: { width: number; height: number },
) => {
  await page.setViewportSize(first);
  await gotoHome(page);
  const before = await measureHeroGeometry(page);

  await page.setViewportSize(second);
  await gotoHome(page);
  const after = await measureHeroGeometry(page);

  for (const dimension of ["width", "height"] as const) {
    expect(
      geometryDelta(before.heading[dimension], after.heading[dimension]),
      `heading ${dimension} at ${first.width}x${first.height}/${second.width}x${second.height}`,
    ).toBeLessThanOrEqual(0.05);
    expect(
      geometryDelta(before.pipeline[dimension], after.pipeline[dimension]),
      `pipeline ${dimension} at ${first.width}x${first.height}/${second.width}x${second.height}`,
    ).toBeLessThanOrEqual(0.05);
  }

  for (const height of [...before.labelHeights, ...after.labelHeights]) {
    expect(height).toBeGreaterThanOrEqual(PIPELINE_LABEL_MIN_HEIGHT - 0.5);
  }
};

test("hero geometry is continuous across the former 120rem cutoff", async ({
  page,
}) => {
  const collector = setupErrorCollection(page);
  await assertSmoothHeroBoundary(
    page,
    { width: 1920, height: 1080 },
    { width: 1921, height: 1080 },
  );
  assertNoRuntimeErrors(collector);
});

test("hero geometry is continuous across former height thresholds", async ({
  page,
}) => {
  const collector = setupErrorCollection(page);

  for (const [height, nextHeight] of [
    [768, 769],
    [864, 865],
    [1088, 1089],
  ] as const) {
    await assertSmoothHeroBoundary(
      page,
      { width: 1366, height },
      { width: 1366, height: nextHeight },
    );
  }

  assertNoRuntimeErrors(collector);
});

test("hero geometry is continuous at the compact-width boundary", async ({
  page,
}) => {
  const collector = setupErrorCollection(page);
  await assertSmoothHeroBoundary(
    page,
    { width: 367, height: 844 },
    { width: 368, height: 844 },
  );
  assertNoRuntimeErrors(collector);
});

test("hero child geometry is stable when only the viewport height changes", async ({
  page,
}) => {
  const collector = setupErrorCollection(page);

  await page.setViewportSize({ width: 1366, height: 768 });
  await gotoHome(page);
  const short = await measureHeroSizing(page);

  await page.setViewportSize({ width: 1366, height: 1080 });
  await gotoHome(page);
  const tall = await measureHeroSizing(page);

  assertStable(short.headingWidth, tall.headingWidth, "heading width");
  assertStable(short.pipelineWidth, tall.pipelineWidth, "pipeline width");
  assertStable(short.headingFontSize, tall.headingFontSize, "heading font size");

  expect(tall.labelFontSizes).toHaveLength(short.labelFontSizes.length);
  short.labelFontSizes.forEach((size, index) =>
    assertStable(size, tall.labelFontSizes[index], `label ${index} font size`),
  );

  expect(tall.heroHeight).toBeGreaterThan(short.heroHeight);

  assertNoRuntimeErrors(collector);
});

test("wide desktop service grid spans viewport", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== WIDE_DESKTOP_PROJECT,
    "2560×1440 project only",
  );

  const collector = await preparePage(page);
  const viewport = viewportSize(page);
  const productGrid = page.locator(".product-grid");

  await productGrid.scrollIntoViewIfNeeded();

  const gridBox = await productGrid.boundingBox();
  expect(gridBox).not.toBeNull();
  expect(gridBox!.width / viewport.width).toBeGreaterThanOrEqual(0.52);

  assertNoRuntimeErrors(collector);
});

test("wide desktop hero lead stays constrained", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== WIDE_DESKTOP_PROJECT,
    "2560×1440 project only",
  );

  const collector = await preparePage(page);
  const heroLead = page.locator("#hero-heading + p");

  await expect(heroLead).toHaveText(/connect your systems\.$/);
  await assertProseWidth(heroLead);

  assertNoRuntimeErrors(collector);
});

test("reduced motion renders completed static states", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== REDUCED_MOTION_PROJECT,
    "Chromium 390×844 project only",
  );

  const collector = setupErrorCollection(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await gotoHome(page);

  await assertNoDocumentOverflow(page);

  const productCards = page.locator(".product-card");
  const journeySignals = page.locator(".journey__signal svg");
  const revealTargets = page.locator("[data-reveal]");

  await expect(productCards).toHaveCount(6);
  await expect(journeySignals).toHaveCount(4);
  await expect(page.locator(".journey__moment")).toHaveCount(4);

  for (const target of await revealTargets.all()) {
    await target.scrollIntoViewIfNeeded();
    await assertVisibleLayout(target);
  }

  for (const card of await productCards.all()) {
    await card.scrollIntoViewIfNeeded();
    await assertVisibleLayout(card);
    const motion = await card.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        animationName: style.animationName,
        animationDuration: style.animationDuration,
      };
    });
    assertMotionDisabled(motion.animationName, motion.animationDuration);
  }

  for (const moment of await page.locator(".journey__moment").all()) {
    await moment.scrollIntoViewIfNeeded();
    await assertVisibleLayout(moment);
    const motion = await moment.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        animationName: style.animationName,
        animationDuration: style.animationDuration,
      };
    });
    assertMotionDisabled(motion.animationName, motion.animationDuration);
  }

  const journeyRoute = await page.locator(".journey__moments").evaluate((element) => {
    const after = getComputedStyle(element, "::after");
    const horizontal = window.matchMedia("(min-width: 52rem)").matches;

    return {
      animationName: after.animationName,
      animationDuration: after.animationDuration,
      transform: after.transform,
      horizontal,
    };
  });

  assertMotionDisabled(journeyRoute.animationName, journeyRoute.animationDuration);
  if (journeyRoute.horizontal) {
    expect(journeyRoute.transform).toMatch(/matrix\(1, 0, 0, 1|scaleX\(1\)/);
  } else {
    expect(journeyRoute.transform).toMatch(/matrix\(1, 0, 0, 1|scaleY\(1\)|scale\(1, 1\)/);
  }

  const pipeline = page.locator(".hero__pipeline");
  await expect(pipeline).toBeVisible();
  await expect(pipeline).not.toHaveClass(/is-pipeline-visible/);

  const pipelineMotion = await pipeline.evaluate((element) => {
    const signal = element.querySelector(".hero-pipeline__signal");
    const ring = element.querySelector(".hero-pipeline__node-ring");

    return {
      signalDisplay: signal ? getComputedStyle(signal).display : "",
      ringAnimation: ring ? getComputedStyle(ring).animationName : "",
      signalAnimation: signal ? getComputedStyle(signal).animationName : "",
    };
  });

  expect(pipelineMotion.signalDisplay).toBe("none");
  expect(
    pipelineMotion.ringAnimation === "none" || pipelineMotion.ringAnimation === "",
  ).toBeTruthy();
  expect(
    pipelineMotion.signalAnimation === "none" || pipelineMotion.signalAnimation === "",
  ).toBeTruthy();

  assertNoRuntimeErrors(collector);
});

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

test("every service page renders its own hero, lists and navigation", async ({
  page,
}) => {
  const serviceRoutes = [
    { slug: "bug-fixing", productId: "fix", title: "Bug fixing for business software" },
    { slug: "ai-assistants", productId: "ai", title: "AI assistants for everyday business work" },
    { slug: "seo-paid-campaigns", productId: "customers", title: "SEO and paid campaigns that drive enquiries" },
    { slug: "websites-online-shops", productId: "website", title: "Websites and online shops built to convert" },
    { slug: "software-development", productId: "app", title: "Software development for your business" },
    { slug: "automation", productId: "other", title: "Business automation and integrations" },
  ];

  for (const { slug, productId, title } of serviceRoutes) {
    const collector = setupErrorCollection(page);

    await page.goto(`services/${slug}/`);
    await page.waitForLoadState("domcontentloaded");
    expect(new URL(page.url()).pathname).toBe(`/solved-tech/services/${slug}/`);

    await expect(page.locator("h1")).toHaveText(title);
    await expect(page.locator(".service-hero__visual .service-art")).toHaveAttribute(
      "data-service-art",
      productId,
    );
    await expect(page.locator(".service-detail__body section")).toHaveCount(2);
    await expect(page.locator(".service-detail__body section").first().locator("li")).not.toHaveCount(0);
    await expect(
      page.locator('.service-detail__navigation a[href="/solved-tech/#approach"]'),
    ).toHaveCount(1);
    await expect(
      page.locator('.service-detail__navigation a[href="/solved-tech/#services"]'),
    ).toHaveCount(1);
    await expect(page.locator(".contact-action")).toHaveCount(3);
    await expect(
      page.locator('#primary-navigation a[href="/solved-tech/#services"]'),
    ).toHaveCount(1);
    await assertNoDocumentOverflow(page);
    assertNoRuntimeErrors(collector);
  }
});

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
  await expect(toggle).toHaveText("Pause background motion");
  await expect(toggle).not.toHaveAttribute("aria-pressed");
  await expect.poll(playState).toBe("running");

  await toggle.click();
  await expect(toggle).toHaveText("Resume background motion");
  await expect(page.locator("html")).toHaveClass(/motion-paused/);
  await expect.poll(playState).toBe("paused");

  await toggle.click();
  await expect(toggle).toHaveText("Pause background motion");
  await expect.poll(playState).toBe("running");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(toggle).toBeHidden();

  assertNoRuntimeErrors(collector);
});
