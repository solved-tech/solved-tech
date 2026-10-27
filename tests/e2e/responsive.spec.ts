import { expect, test } from "@playwright/test";
import { vorbioProduct } from "../../src/content";
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
  measureHeroActions,
  measureHeroFold,
  measureHeroGeometry,
  measureHeroSizing,
  measureHeroProcess,
  rectSpread,
  HERO_PROCESS_LABEL_MIN_HEIGHT,
  preparePage,
  REDUCED_MOTION_PROJECT,
  assertHeroProcessLabelsRendered,
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
    await expect(navLinks).toHaveCount(5);
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
  await expect(navigationLinks).toHaveCount(5);
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
  await expect(links).toHaveCount(5);

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

test("hero clips decorative system overflow", async ({ page }) => {
  const collector = await preparePage(page);

  const heroOverflow = await page.locator(".hero").evaluate((element) => {
    return getComputedStyle(element).overflow;
  });
  expect(["clip", "hidden"]).toContain(heroOverflow);

  assertNoRuntimeErrors(collector);
});

test("hero process labels stay legible when rendered", async ({ page }) => {
  const collector = await preparePage(page);
  const viewport = viewportSize(page);

  if (viewport.width < 1024) {
    await expect(page.locator(".hero-process")).toBeHidden();
    assertNoRuntimeErrors(collector);
    return;
  }

  await assertHeroProcessLabelsRendered(page);

  assertNoRuntimeErrors(collector);
});

test("hero actions stack one then two on mobile and one row on desktop", async ({
  page,
}) => {
  const collector = await preparePage(page);
  const viewport = viewportSize(page);
  const { rects, rows } = await measureHeroActions(page);

  expect(rects).toHaveLength(3);

  if (viewport.width >= 1024) {
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveLength(3);
    expect(rects[0].width).toBeGreaterThan(rects[1].width);
    expect(rects[0].y).toBeCloseTo(rects[1].y, 0);
    expect(rects[1].width).toBeCloseTo(rects[2].width, 0);
  } else {
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveLength(1);
    expect(rows[1]).toHaveLength(2);
    expect(rects[0].width).toBeGreaterThan(rects[1].width);
  }

  assertNoRuntimeErrors(collector);
});

test("hero process renders unboxed without document overflow", async ({
  page,
}) => {
  const collector = setupErrorCollection(page);

  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await gotoHome(page);

    const process = page.locator(".hero-process");

    if (width < 1024) {
      await expect(process).toBeHidden();
      await assertNoDocumentOverflow(page);
      continue;
    }

    await process.scrollIntoViewIfNeeded();
    await expect(process).toBeVisible();

    const metrics = await process.evaluate((element) => {
      const style = getComputedStyle(element);
      const interfaceElement = element.querySelector(".hero-process__interface");
      const interfaceStyle = interfaceElement
        ? getComputedStyle(interfaceElement)
        : null;
      const interfaceBox = interfaceElement?.getBoundingClientRect() ?? null;
      const signalBox = element
        .querySelector(".hero-process__signal")
        ?.getBoundingClientRect();
      const nodeCenters = Array.from(
        element.querySelectorAll(".hero-process__node"),
        (node) => {
          const box = node.getBoundingClientRect();
          return box.x + box.width / 2;
        },
      );

      return {
        background: style.backgroundColor,
        borderWidth: style.borderTopWidth,
        boxShadow: style.boxShadow,
        interfaceBackground: interfaceStyle?.backgroundColor ?? "",
        interfaceBorderWidth: interfaceStyle?.borderTopWidth ?? "",
        interfaceWidth: interfaceBox?.width ?? 0,
        interfaceHeight: interfaceBox?.height ?? 0,
        signalCenter: signalBox ? signalBox.x + signalBox.width / 2 : 0,
        nodeCenters,
      };
    });

    expect(metrics.background, `background at ${width}px`).toBe(
      "rgba(0, 0, 0, 0)",
    );
    expect(metrics.borderWidth, `border at ${width}px`).toBe("0px");
    expect(metrics.boxShadow, `shadow at ${width}px`).toBe("none");
    expect(metrics.interfaceBackground, `interface background at ${width}px`).toBe(
      "rgba(0, 0, 0, 0)",
    );
    expect(metrics.interfaceBorderWidth, `interface border at ${width}px`).toBe(
      "0px",
    );
    expect(metrics.interfaceWidth, `interface width at ${width}px`).toBeGreaterThan(0);
    expect(
      metrics.interfaceHeight,
      `interface height at ${width}px`,
    ).toBeGreaterThan(0);
    expect(metrics.nodeCenters).toHaveLength(4);
    metrics.nodeCenters.forEach((nodeCenter) => {
      expect(
        Math.abs(nodeCenter - metrics.signalCenter),
        `signal and node alignment at ${width}px`,
      ).toBeLessThanOrEqual(0.5);
    });

    await assertNoDocumentOverflow(page);
  }

  assertNoRuntimeErrors(collector);
});

test("hero geometry does not react to pointer movement", async ({ page }) => {
  const collector = await preparePage(page);
  const viewport = viewportSize(page);

  test.skip(viewport.width < 1024, "Hero process is hidden below 64rem");

  await page.mouse.move(viewport.width * 0.2, viewport.height * 0.2);
  const first = await measureHeroProcess(page);
  await page.mouse.move(viewport.width * 0.8, viewport.height * 0.6);
  const second = await measureHeroProcess(page);

  assertStable(first.visual.width, second.visual.width, "visual width");
  assertStable(first.visual.height, second.visual.height, "visual height");

  assertNoRuntimeErrors(collector);
});

test("hero folds within the first viewport on desktop sizes", async ({
  page,
}) => {
  const collector = setupErrorCollection(page);

  for (const [width, height] of [
    [1024, 768],
    [1366, 768],
    [1440, 900],
    [1920, 1080],
  ] as const) {
    await page.setViewportSize({ width, height });
    await gotoHome(page);
    const { heroBottom, servicesTop } = await measureHeroFold(page, {
      width,
      height,
    });

    expect(
      servicesTop,
      `services top at ${width}x${height}`,
    ).toBeGreaterThanOrEqual(heroBottom - 1);
    expect(
      heroBottom,
      `hero bottom at ${width}x${height}`,
    ).toBeLessThanOrEqual(height + 1);
  }

  assertNoRuntimeErrors(collector);
});

test("hero actions reach the first fold without the process on portrait phones", async ({
  page,
}) => {
  const collector = await preparePage(page);
  const viewport = viewportSize(page);

  test.skip(viewport.width > 480, "Portrait phone targets only");

  for (const action of await page.locator(".hero__actions .contact-action").all()) {
    await expect(action).toBeInViewport();
  }

  const process = page.locator(".hero-process");
  await expect(process).toBeHidden();

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
      geometryDelta(before.visual[dimension], after.visual[dimension]),
      `visual ${dimension} at ${first.width}x${first.height}/${second.width}x${second.height}`,
    ).toBeLessThanOrEqual(0.05);
  }

  for (const height of [...before.labelHeights, ...after.labelHeights]) {
    expect(height).toBeGreaterThanOrEqual(HERO_PROCESS_LABEL_MIN_HEIGHT - 0.5);
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

test("hero process appears only when the viewport can support it", async ({
  page,
}) => {
  const collector = setupErrorCollection(page);

  await page.setViewportSize({ width: 1023, height: 900 });
  await gotoHome(page);
  await expect(page.locator(".hero-process")).toBeHidden();

  await page.setViewportSize({ width: 1024, height: 900 });
  await gotoHome(page);
  await expect(page.locator(".hero-process")).toBeVisible();

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
  assertStable(short.visualWidth, tall.visualWidth, "visual width");
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
  const heroLead = page.locator(".hero__lead");

  await expect(heroLead).toHaveText(/before we start\.$/);
  await assertProseWidth(heroLead);

  assertNoRuntimeErrors(collector);
});

test("wide desktop hero fills the width without wasting vertical space", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== WIDE_DESKTOP_PROJECT,
    "2560×1440 project only",
  );

  const collector = await preparePage(page);
  const viewport = viewportSize(page);
  const heroBox = await page.locator(".hero").boundingBox();
  const layoutBox = await page.locator(".hero__layout").boundingBox();
  const processBox = await page.locator(".hero-process").boundingBox();
  const packagesBox = await page.locator("#packages").boundingBox();
  const headingBox = await page.locator("#hero-heading").boundingBox();

  expect(heroBox).not.toBeNull();
  expect(layoutBox).not.toBeNull();
  expect(processBox).not.toBeNull();
  expect(packagesBox).not.toBeNull();
  expect(headingBox).not.toBeNull();
  expect(heroBox!.width / viewport.width).toBeGreaterThanOrEqual(0.68);
  expect(heroBox!.height).toBeLessThanOrEqual(58 * 16 + 1);
  expect(processBox!.width).toBeGreaterThanOrEqual(34 * 16 - 1);
  const heroMid = heroBox!.y + heroBox!.height / 2;
  const layoutMid = layoutBox!.y + layoutBox!.height / 2;
  const layoutCenter = layoutBox!.x + layoutBox!.width / 2;
  expect(Math.abs(layoutMid - heroMid)).toBeLessThanOrEqual(48);
  expect(Math.abs(layoutCenter - viewport.width / 2)).toBeLessThanOrEqual(8);
  expect(headingBox!.y).toBeGreaterThan(heroBox!.y);
  expect(headingBox!.y).toBeLessThan(heroMid);
  expect(packagesBox!.y).toBeLessThan(viewport.height);

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
  const visibleRevealTargets = page.locator("[data-reveal]:visible");

  await expect(productCards).toHaveCount(6);
  await expect(journeySignals).toHaveCount(4);
  await expect(page.locator(".journey__moment")).toHaveCount(4);

  for (const target of await visibleRevealTargets.all()) {
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

  const process = page.locator(".hero-process");
  await expect(process).toBeHidden();
  await expect(process).not.toHaveClass(/is-process-visible/);

  const processMotion = await process.evaluate((element) => {
    const display = (selector: string): string => {
      const node = element.querySelector(selector);
      return node ? getComputedStyle(node).display : "";
    };
    const animation = (selector: string): string => {
      const node = element.querySelector(selector);
      return node ? getComputedStyle(node).animationName : "";
    };

    return {
      signalDisplay: display(".hero-process__signal"),
      signalAnimation: animation(".hero-process__signal"),
      liveAnimation: animation(".hero-process__live"),
      stageAnimation: animation(".hero-process__stage"),
      railDisplay: display(".hero-process__rail"),
      stagesDisplay: display(".hero-process__stages"),
      inputDisplay: display(".hero-process__input"),
      outputDisplay: display(".hero-process__output"),
    };
  });

  expect(processMotion.signalDisplay).toBe("none");
  [
    processMotion.signalAnimation,
    processMotion.liveAnimation,
    processMotion.stageAnimation,
  ].forEach((name) => {
    expect(name === "none" || name === "").toBeTruthy();
  });
  expect(processMotion.railDisplay).not.toBe("none");
  expect(processMotion.stagesDisplay).not.toBe("none");
  expect(processMotion.inputDisplay).not.toBe("none");
  expect(processMotion.outputDisplay).not.toBe("none");

  assertNoRuntimeErrors(collector);
});

test("privacy notice page shares the header and footer", async ({ page }) => {
  const collector = setupErrorCollection(page);

  await page.goto("privacy/");
  await page.waitForLoadState("domcontentloaded");
  expect(new URL(page.url()).pathname).toBe("/privacy/");

  await expect(page.locator("h1")).toHaveText("Privacy notice");
  await expect(page.locator("#primary-navigation a")).toHaveCount(5);
  await expect(page.locator('a[href="/services/vorbio/"]')).toHaveCount(0);
  await expect(
    page.locator('#primary-navigation a[href="/#services"]'),
  ).toHaveCount(1);
  await expect(page.locator('footer a[href="/privacy/"]')).toHaveCount(1);
  await assertNoDocumentOverflow(page);
  assertNoRuntimeErrors(collector);
});

test("the Vorbio product page renders its hero, capabilities and contact rail", async ({
  page,
}) => {
  const collector = setupErrorCollection(page);

  await page.goto("services/vorbio/");
  await page.waitForLoadState("domcontentloaded");
  expect(new URL(page.url()).pathname).toBe("/services/vorbio/");

  await expect(page.locator("h1")).toHaveText(vorbioProduct.tagline);
  await expect(page.locator(".vorbio-card")).toHaveCount(
    vorbioProduct.highlights.length,
  );
  await expect(page.locator(".vorbio-step")).toHaveCount(
    vorbioProduct.steps.length,
  );
  await expect(page.locator(".vorbio-voice__bar")).toHaveCount(9);
  await expect(page.locator(".vorbio-flow__item")).toHaveCount(
    vorbioProduct.workflow.length,
  );
  await expect(page.locator(".vorbio-control__list li")).toHaveCount(
    vorbioProduct.controls.length,
  );
  await expect(page.locator(".vorbio-button")).toHaveCount(2);
  await expect(page.locator(".contact-action")).toHaveCount(3);
  await assertNoDocumentOverflow(page);
  assertNoRuntimeErrors(collector);
});

test("the homepage does not link to the Vorbio page", async ({ page }) => {
  const collector = await preparePage(page);

  await expect(page.locator('a[href="/services/vorbio/"]')).toHaveCount(0);
  await expect(page.locator('a[data-placement="vorbio-promo"]')).toHaveCount(0);
  await expect(page.locator("#packages")).toBeVisible();
  assertNoRuntimeErrors(collector);
});

test("every service page renders its own hero, lists and navigation", async ({
  page,
}) => {
  const serviceRoutes = [
    { slug: "bug-fixing", productId: "fix", title: "Bug fixing for business software" },
    { slug: "ai-assistants", productId: "ai", title: "AI assistants for everyday business work" },
    { slug: "seo-paid-campaigns", productId: "customers", title: "SEO and paid campaigns that drive enquiries" },
    { slug: "websites-online-shops", productId: "website", title: "Simple websites for London small businesses" },
    { slug: "software-development", productId: "app", title: "Software development for your business" },
    { slug: "automation", productId: "other", title: "Business automation and integrations" },
  ];

  for (const { slug, productId, title } of serviceRoutes) {
    const collector = setupErrorCollection(page);

    await page.goto(`services/${slug}/`);
    await page.waitForLoadState("domcontentloaded");
    expect(new URL(page.url()).pathname).toBe(`/services/${slug}/`);

    await expect(page.locator("h1")).toHaveText(title);
    await expect(page.locator(".service-hero__visual .service-art")).toHaveAttribute(
      "data-service-art",
      productId,
    );
    await expect(page.locator(".service-detail__body section")).toHaveCount(2);
    await expect(page.locator(".service-detail__body section").first().locator("li")).not.toHaveCount(0);
    await expect(
      page.locator('.service-detail__navigation a[href="/#approach"]'),
    ).toHaveCount(1);
    await expect(
      page.locator('.service-detail__navigation a[href="/#services"]'),
    ).toHaveCount(1);
    await expect(page.locator(".contact-action")).toHaveCount(3);
    await expect(
      page.locator('#primary-navigation a[href="/#services"]'),
    ).toHaveCount(1);
    await assertNoDocumentOverflow(page);
    assertNoRuntimeErrors(collector);
  }
});

test("the diagram can be pressed to pause and resume its motion", async ({
  page,
}) => {
  const collector = setupErrorCollection(page);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await gotoHome(page);

  test.skip(viewportSize(page).width < 1024, "Hero process is hidden below 64rem");

  const control = page.locator("button.hero-process__control");
  const signal = page.locator(".hero-process__signal");
  const playState = () =>
    signal.evaluate((element) => getComputedStyle(element).animationPlayState);

  await control.scrollIntoViewIfNeeded();
  await expect(control).toBeVisible();
  await expect(control).toHaveAttribute("aria-label", "Pause diagram motion");
  await expect(control).toHaveAttribute("aria-pressed", "false");
  await expect.poll(playState).toBe("running");

  await control.click();
  await expect(control).toHaveAttribute("aria-label", "Resume diagram motion");
  await expect(control).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("html")).toHaveClass(/motion-paused/);
  await expect.poll(playState).toBe("paused");

  await control.click();
  await expect(control).toHaveAttribute("aria-label", "Pause diagram motion");
  await expect.poll(playState).toBe("running");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(control).toBeDisabled();

  assertNoRuntimeErrors(collector);
});
