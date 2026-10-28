import { readFileSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { siteContent } from "../src/content";

const PORTRAIT_BUDGET_BYTES = 150 * 1024;

describe("portrait assets", () => {  it("ships every portrait as WebP or AVIF under the audit budget", () => {
    siteContent.founders.forEach(({ image, imageSources }) => {
      [image, ...imageSources.map(({ path }) => path)].forEach((path) => {
        const { size } = statSync(new URL(`../public${path}`, import.meta.url));

        expect(path).toMatch(/\.(webp|avif)$/);
        expect(size, path).toBeGreaterThan(0);
        expect(size, path).toBeLessThan(PORTRAIT_BUDGET_BYTES);
      });
    });
  });
});

describe("custom domain", () => {
  it("publishes solvedtech.co.uk for GitHub Pages", () => {
    const cname = readFileSync(new URL("../public/CNAME", import.meta.url), "utf8").trim();

    expect(cname).toBe("solvedtech.co.uk");
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
