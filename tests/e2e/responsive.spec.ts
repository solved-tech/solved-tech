import { expect, test } from "@playwright/test";
import {
  assertCompleteBounds,
  assertMinHeight,
  assertMotionDisabled,
  assertNoDocumentOverflow,
  assertNoRuntimeErrors,
  assertVisibleLayout,
  geometryDelta,
  gotoHome,
  gridColumnCount,
  measureHeroGeometry,
  PHONE_LANDSCAPE_PROJECT,
  preparePage,
  REDUCED_MOTION_PROJECT,
  assertPipelineLabelsRendered,
  measurePipelineLayout,
  assertProseWidth,
  scrollArtworkIntoReveal,
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

  const serviceActions = page.locator(".service-box__cta");
  await expect(serviceActions).toHaveCount(5);
  for (const action of await serviceActions.all()) {
    await action.scrollIntoViewIfNeeded();
    await assertMinHeight(action, 48);
    await assertCompleteBounds(page, action, viewport);
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
  await expect(footerLinks).toHaveCount(1);
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

  await navigation.locator('a[href="#services"]').click();
  await expect(page).toHaveURL(/#services$/);
  await expect(menuToggle).toHaveAttribute("aria-expanded", "false");
  await expect(navigation).not.toHaveClass(/is-open/);

  assertNoRuntimeErrors(collector);
});

test("hero contact actions stay in complete bounds", async ({ page }, testInfo) => {
  const collector = await preparePage(page);
  const viewport = viewportSize(page);
  const projectName = testInfo.project.name;
  const heroActions = page.locator(".hero__actions .contact-action");

  if (projectName !== PHONE_LANDSCAPE_PROJECT) {
    await page.evaluate(() => window.scrollTo(0, 0));
  }

  for (const action of await heroActions.all()) {
    if (projectName === PHONE_LANDSCAPE_PROJECT) {
      await action.scrollIntoViewIfNeeded();
    }

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

test("service body splits at 48rem", async ({ page }) => {
  const collector = await preparePage(page);
  const viewport = viewportSize(page);
  const serviceBody = page
    .locator(".service-box")
    .first()
    .locator(".service-box__body");

  await serviceBody.scrollIntoViewIfNeeded();
  const serviceColumns = await serviceBody.evaluate(
    (element) => getComputedStyle(element).gridTemplateColumns,
  );

  if (viewport.width >= 768) {
    expect(serviceColumns.split(" ").length).toBeGreaterThanOrEqual(2);
  } else {
    expect(serviceColumns.split(" ").length).toBe(1);
  }

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

test("service text stays visible before artwork reveal", async ({ page }) => {
  const collector = await preparePage(page);
  const serviceBoxes = page.locator(".service-box");

  await expect(serviceBoxes).toHaveCount(5);
  await page.evaluate(() => window.scrollTo(0, 0));

  for (const serviceBox of await serviceBoxes.all()) {
    const artwork = serviceBox.locator(".service-box__artwork");
    const question = serviceBox.locator(".service-box__question");
    const answer = serviceBox.locator(".service-box__header > p");
    const provides = serviceBox.locator(".service-box__provides");

    await expect(artwork).not.toHaveClass(/is-visible/);

    await assertVisibleLayout(question);
    await assertVisibleLayout(answer);
    await assertVisibleLayout(provides);
  }

  assertNoRuntimeErrors(collector);
});

test("service and journey diagrams render in complete bounds", async ({ page }) => {
  const collector = await preparePage(page);
  const viewport = viewportSize(page);

  await expect(page.locator(".service-box__artwork .service-art")).toHaveCount(5);
  await expect(page.locator(".journey__signal svg")).toHaveCount(4);

  await scrollArtworkIntoReveal(page, viewport);
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
    expect(height).toBeGreaterThanOrEqual(9 - 0.5);
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
    expect(height).toBeGreaterThanOrEqual(9 - 0.5);
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

test("wide desktop service grid spans viewport", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== WIDE_DESKTOP_PROJECT,
    "2560×1440 project only",
  );

  const collector = await preparePage(page);
  const viewport = viewportSize(page);
  const serviceGrid = page.locator(".service-grid");

  await serviceGrid.scrollIntoViewIfNeeded();

  const gridBox = await serviceGrid.boundingBox();
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

  await expect(heroLead).toHaveText(/Bring us the problem/);
  await assertProseWidth(heroLead);

  assertNoRuntimeErrors(collector);
});

test("wide desktop contact note stays constrained", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== WIDE_DESKTOP_PROJECT,
    "2560×1440 project only",
  );

  const collector = await preparePage(page);

  await assertProseWidth(page.locator(".contact-note"));

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

  const serviceArtworks = page.locator(".service-box__artwork .service-art");
  const journeySignals = page.locator(".journey__signal svg");
  const revealTargets = page.locator("[data-reveal]");

  await expect(serviceArtworks).toHaveCount(5);
  await expect(journeySignals).toHaveCount(4);
  await expect(page.locator(".journey__moment")).toHaveCount(4);

  for (const target of await revealTargets.all()) {
    await target.scrollIntoViewIfNeeded();
    await assertVisibleLayout(target);
  }

  for (const artwork of await serviceArtworks.all()) {
    await artwork.scrollIntoViewIfNeeded();
    await assertVisibleLayout(artwork);
    const motion = await artwork.evaluate((element) => {
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
