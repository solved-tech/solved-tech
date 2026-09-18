import { statSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { siteContent } from "../src/content";

const PORTRAIT_BUDGET_BYTES = 150 * 1024;

describe("portrait assets", () => {  it("ships every portrait as WebP under the audit budget", () => {
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

describe("brand icons", () => {
  it("ships the favicon and touch icon", () => {
    ["/favicon.svg", "/favicon-32.png", "/apple-touch-icon.png"].forEach((path) => {
      const { size } = statSync(new URL(`../public${path}`, import.meta.url));

      expect(size, path).toBeGreaterThan(0);
    });
  });
});
