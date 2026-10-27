import { expect, type Locator, type Page } from "@playwright/test";

export type Viewport = { width: number; height: number };

export type ErrorCollector = {
  consoleErrors: string[];
  pageErrors: string[];
};

export const WIDE_DESKTOP_PROJECT = "wide-desktop";
export const REDUCED_MOTION_PROJECT = "uk-phone-standard";
export const HERO_PROCESS_LABEL_COUNT = 8;
export const HERO_PROCESS_LABEL_MIN_HEIGHT = 4;
export const HERO_PROCESS_LABELS =
  ".hero-process__stage-copy strong, .hero-process__stage-copy small";

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
  expect(new URL(page.url()).pathname).toBe("/");
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

export const cardColumnCount = async (page: Page): Promise<number> => {
  const grid = page.locator(".product-grid");
  await grid.scrollIntoViewIfNeeded();

  return gridColumnCount(
    await grid.evaluate((element) => getComputedStyle(element).gridTemplateColumns),
  );
};

export type Rect = { x: number; y: number; width: number; height: number };
export type RowRect = Rect & { rowStart: number };

export type CardGridMetrics = {
  grid: Rect;
  cards: Rect[];
  links: Rect[];
  ctas: Rect[];
};

export const measureCardGrid = async (page: Page): Promise<CardGridMetrics> => {
  const grid = page.locator(".product-grid");
  await grid.scrollIntoViewIfNeeded();

  return grid.evaluate((element) => {
    const rect = (node: Element): Rect => {
      const box = node.getBoundingClientRect();
      return { x: box.x, y: box.y, width: box.width, height: box.height };
    };
    const query = (selector: string) =>
      Array.from(element.querySelectorAll<HTMLElement>(selector));

    return {
      grid: rect(element),
      cards: query(".product-card").map(rect),
      links: query(".product-card__link").map(rect),
      ctas: query(".product-card__action").map(rect),
    };
  });
};

export const groupByRow = <T extends { y: number }>(items: T[]): T[][] => {
  const rows: T[][] = [];

  for (const item of [...items].sort((a, b) => a.y - b.y)) {
    const row = rows.find((candidate) => Math.abs(candidate[0].y - item.y) <= 1);

    if (row) {
      row.push(item);
    } else {
      rows.push([item]);
    }
  }

  return rows;
};

export const rectSpread = (
  items: Rect[],
  dimension: "x" | "y" | "width" | "height",
) => {
  const values = items.map((item) => item[dimension]);
  return Math.max(...values) - Math.min(...values);
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

export const assertHeroProcessLabelsRendered = async (page: Page) => {
  const labels = page.locator(HERO_PROCESS_LABELS);

  await expect(labels).toHaveCount(HERO_PROCESS_LABEL_COUNT);

  for (const label of await labels.all()) {
    const box = await label.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(
      HERO_PROCESS_LABEL_MIN_HEIGHT - 0.5,
    );
  }
};

export type HeroProcessMetrics = {
  visual: Rect;
  labelHeights: number[];
};

export const measureHeroProcess = async (
  page: Page,
): Promise<HeroProcessMetrics> => {
  const process = page.locator(".hero-process");
  const labels = page.locator(HERO_PROCESS_LABELS);

  await expect(process).toBeVisible();
  await expect(labels).toHaveCount(HERO_PROCESS_LABEL_COUNT);

  const box = await process.boundingBox();
  expect(box).not.toBeNull();

  const labelHeights = await labels.evaluateAll((elements) =>
    elements.map((element) => element.getBoundingClientRect().height),
  );

  return {
    visual: { x: box!.x, y: box!.y, width: box!.width, height: box!.height },
    labelHeights,
  };
};

export const measureHeroActions = async (page: Page) => {
  const actions = page.locator(".hero__actions .contact-action");
  await expect(actions).toHaveCount(3);

  const rects = await actions.evaluateAll((elements) =>
    elements.map((element) => {
      const box = element.getBoundingClientRect();
      return { x: box.x, y: box.y, width: box.width, height: box.height };
    }),
  );

  return { rects, rows: groupByRow(rects) };
};

export const measureHeroFold = async (page: Page, viewport: Viewport) => {
  const heroBox = await page.locator(".hero").boundingBox();
  const servicesBox = await page.locator("#services").boundingBox();

  expect(heroBox).not.toBeNull();
  expect(servicesBox).not.toBeNull();

  return {
    heroBottom: heroBox!.y + heroBox!.height,
    servicesTop: servicesBox!.y,
    viewportHeight: viewport.height,
  };
};

export type HeroGeometry = {
  heading: { width: number; height: number };
  visual: { width: number; height: number };
  labelHeights: number[];
};

export const measureHeroGeometry = async (page: Page): Promise<HeroGeometry> => {
  const heading = page.locator("#hero-heading");
  const process = page.locator(".hero-process");
  const labels = page.locator(HERO_PROCESS_LABELS);

  await expect(heading).toBeVisible();
  await expect(process).toBeVisible();
  await expect(labels).toHaveCount(HERO_PROCESS_LABEL_COUNT);

  const [headingBox, processBox, labelHeights] = await Promise.all([
    heading.boundingBox(),
    process.boundingBox(),
    labels.evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect().height),
    ),
  ]);

  expect(headingBox).not.toBeNull();
  expect(processBox).not.toBeNull();

  return {
    heading: { width: headingBox!.width, height: headingBox!.height },
    visual: { width: processBox!.width, height: processBox!.height },
    labelHeights,
  };
};

export const geometryDelta = (first: number, second: number): number =>
  Math.abs(second - first) / Math.max(first, second);

export const assertStable = (first: number, second: number, label: string) => {
  expect(
    Math.abs(second - first),
    `${label}: ${first} vs ${second}`,
  ).toBeLessThanOrEqual(Math.max(1, Math.max(first, second) * 0.005));
};

export type HeroSizing = {
  heroHeight: number;
  headingWidth: number;
  headingFontSize: number;
  visualWidth: number;
  labelFontSizes: number[];
};

export const measureHeroSizing = async (page: Page): Promise<HeroSizing> => {
  const hero = page.locator(".hero");
  const heading = page.locator("#hero-heading");
  const process = page.locator(".hero-process");
  const labels = page.locator(HERO_PROCESS_LABELS);

  await expect(heading).toBeVisible();
  await expect(process).toBeVisible();
  await expect(labels).toHaveCount(HERO_PROCESS_LABEL_COUNT);

  const [heroHeight, headingMetrics, visualWidth, labelFontSizes] =
    await Promise.all([
      hero.evaluate((element) => element.getBoundingClientRect().height),
      heading.evaluate((element) => ({
        width: element.getBoundingClientRect().width,
        fontSize: Number.parseFloat(getComputedStyle(element).fontSize),
      })),
      process.evaluate((element) => element.getBoundingClientRect().width),
      labels.evaluateAll((elements) =>
        elements.map((element) =>
          Number.parseFloat(getComputedStyle(element).fontSize),
        ),
      ),
    ]);

  return {
    heroHeight,
    headingWidth: headingMetrics.width,
    headingFontSize: headingMetrics.fontSize,
    visualWidth,
    labelFontSizes,
  };
};
