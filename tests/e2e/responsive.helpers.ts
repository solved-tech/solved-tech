import { expect, type Locator, type Page } from "@playwright/test";

export type Viewport = { width: number; height: number };

export type ErrorCollector = {
  consoleErrors: string[];
  pageErrors: string[];
};

export const PHONE_LANDSCAPE_PROJECT = "phone-landscape";
export const WIDE_DESKTOP_PROJECT = "wide-desktop";
export const REDUCED_MOTION_PROJECT = "uk-phone-standard";
export const PIPELINE_WIDTH_SMOOTH_PROJECT = "tablet-landscape";
export const PIPELINE_LABEL_COUNT = 7;
export const PIPELINE_LABEL_MIN_HEIGHT = 9;

export const setupErrorCollection = (page: Page): ErrorCollector => {
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

export const assertNoRuntimeErrors = (collector: ErrorCollector) => {
  expect(collector.consoleErrors, "console errors").toEqual([]);
  expect(collector.pageErrors, "page errors").toEqual([]);
};

export const viewportSize = (page: Page): Viewport => page.viewportSize()!;

export const gotoHome = async (page: Page) => {
  await page.goto(".");
  await page.waitForLoadState("domcontentloaded");
  expect(new URL(page.url()).pathname).toBe("/solved-tech/");
};

export const assertCompleteBounds = async (
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

export const assertMinHeight = async (locator: Locator, minHeight: number) => {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.height).toBeGreaterThanOrEqual(minHeight - 0.5);
};

export const assertNoDocumentOverflow = async (page: Page) => {
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));

  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
};

export const assertVisibleLayout = async (locator: Locator) => {
  const metrics = await locator.evaluate((element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();

    return {
      visibility: style.visibility,
      opacity: Number.parseFloat(style.opacity),
      display: style.display,
      width: rect.width,
      height: rect.height,
    };
  });

  expect(metrics.visibility).not.toBe("hidden");
  expect(metrics.display).not.toBe("none");
  expect(metrics.opacity).toBeGreaterThan(0);
  expect(metrics.width).toBeGreaterThan(0);
  expect(metrics.height).toBeGreaterThan(0);
};

export const assertRenderedDiagram = async (
  page: Page,
  locator: Locator,
  viewport: Viewport,
) => {
  await locator.scrollIntoViewIfNeeded();

  const metrics = await locator.evaluate((element) => {
    const style = getComputedStyle(element);
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

export const gridColumnCount = (columns: string) =>
  columns.split(/\s+/).filter(Boolean).length;

export const preparePage = async (page: Page) => {
  const collector = setupErrorCollection(page);
  await gotoHome(page);
  return collector;
};

export const assertMotionDisabled = (
  animationName: string,
  animationDuration: string,
) => {
  const durationMs = Number.parseFloat(animationDuration) * (
    animationDuration.endsWith("ms") ? 1 : 1000
  );

  expect(
    animationName === "none" ||
      animationName === "" ||
      durationMs <= 1,
  ).toBeTruthy();
};

export const scrollArtworkIntoReveal = async (page: Page, viewport: Viewport) => {
  const artworkWrappers = page.locator(".service-box__artwork");

  for (const wrapper of await artworkWrappers.all()) {
    await wrapper.scrollIntoViewIfNeeded();
    await expect(wrapper).toHaveClass(/is-visible/);

    const art = wrapper.locator(".service-art");
    await expect
      .poll(async () =>
        art.evaluate((element) => Number.parseFloat(getComputedStyle(element).opacity)),
      )
      .toBeGreaterThan(0);

    await assertRenderedDiagram(page, art, viewport);
  }
};

export const scrollJourneyIntoReveal = async (page: Page, viewport: Viewport) => {
  const journeyMoments = page.locator(".journey__moments");
  const moments = page.locator(".journey__moment");

  await journeyMoments.scrollIntoViewIfNeeded();
  await expect(journeyMoments).toHaveClass(/is-visible/);
  await expect(moments).toHaveCount(4);

  for (const moment of await moments.all()) {
    await moment.scrollIntoViewIfNeeded();
    await expect
      .poll(async () =>
        moment.evaluate((element) => Number.parseFloat(getComputedStyle(element).opacity)),
      )
      .toBeGreaterThan(0);

    const signal = moment.locator(".journey__signal svg");
    await assertRenderedDiagram(page, signal, viewport);
  }
};

export const assertProseWidth = async (locator: Locator, maxWidth = 920) => {
  await locator.scrollIntoViewIfNeeded();
  const width = (await locator.boundingBox())?.width ?? 0;
  expect(width).toBeGreaterThan(0);
  expect(width).toBeLessThanOrEqual(maxWidth);
};

export const assertPipelineLabelsRendered = async (page: Page) => {
  const labels = page.locator(".hero-pipeline__node text");

  await expect(labels).toHaveCount(PIPELINE_LABEL_COUNT);

  for (const label of await labels.all()) {
    const box = await label.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(PIPELINE_LABEL_MIN_HEIGHT - 0.5);
  }
};

export const measurePipelineLayout = async (page: Page) => {
  const pipeline = page.locator(".hero__pipeline");
  const labels = page.locator(".hero-pipeline__node text");

  await expect(labels).toHaveCount(PIPELINE_LABEL_COUNT);

  const pipelineWidth = await pipeline.evaluate(
    (element) => element.getBoundingClientRect().width,
  );
  const labelHeights = await labels.evaluateAll((elements) =>
    elements.map((element) => element.getBoundingClientRect().height),
  );

  return { pipelineWidth, labelHeights };
};
