import { expect, test } from "@playwright/test";
import {
  assertCompleteBounds,
  assertMinHeight,
  assertMotionDisabled,
  assertNoDocumentOverflow,
  assertNoRuntimeErrors,
  assertVisibleLayout,
  gotoHome,
  gridColumnCount,
  PHONE_LANDSCAPE_PROJECT,
  preparePage,
  REDUCED_MOTION_PROJECT,
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

test("primary controls meet minimum touch heights", async ({ page }) => {
  const collector = await preparePage(page);
  const viewport = viewportSize(page);

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
