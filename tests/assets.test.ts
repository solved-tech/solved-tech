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

const readBytes = (path: string): Uint8Array =>
  readFileSync(new URL(`../public${path}`, import.meta.url));

const ascii = (bytes: Uint8Array, start: number, end: number): string =>
  String.fromCharCode(...bytes.subarray(start, end));

const u32be = (bytes: Uint8Array, offset: number): number =>
  ((bytes[offset] << 24) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3]) >>> 0;

const pngSize = (path: string): { width: number; height: number } => {
  const bytes = readBytes(path);

  expect(ascii(bytes, 1, 4)).toBe("PNG");
  expect(ascii(bytes, 12, 16)).toBe("IHDR");

  return { width: u32be(bytes, 16), height: u32be(bytes, 20) };
};

const icoSizes = (path: string): Array<{ width: number; height: number }> => {
  const bytes = readBytes(path);
  const count = bytes[4] | (bytes[5] << 8);

  return Array.from({ length: count }, (_, index) => {
    const entry = 6 + index * 16;

    return {
      width: bytes[entry] || 256,
      height: bytes[entry + 1] || 256,
    };
  });
};

describe("brand icons", () => {
  it("ships the favicon set and the touch icon at the required sizes", () => {
    expect(pngSize("/favicon-32.png")).toEqual({ width: 32, height: 32 });
    expect(pngSize("/favicon-192.png")).toEqual({ width: 192, height: 192 });
    expect(pngSize("/favicon-512.png")).toEqual({ width: 512, height: 512 });
    expect(pngSize("/apple-touch-icon.png")).toEqual({ width: 180, height: 180 });
    expect(icoSizes("/favicon.ico")).toEqual([
      { width: 16, height: 16 },
      { width: 32, height: 32 },
      { width: 48, height: 48 },
    ]);
  });

  it("ships the monogram and the social image, and drops the old logo", () => {
    expect(pngSize("/brand/st-mark.png")).toEqual({ width: 855, height: 936 });
    expect(pngSize("/brand/st-mark-white-95.png")).toEqual({ width: 95, height: 104 });
    expect(pngSize("/brand/st-mark-white-190.png")).toEqual({ width: 190, height: 208 });
    expect(pngSize("/brand/solved-tech-social.png")).toEqual({ width: 1200, height: 630 });
    ["/brand/st-mark-white-95.webp", "/brand/st-mark-white-190.webp"].forEach((path) => {
      const bytes = readBytes(path);

      expect(ascii(bytes, 0, 4), path).toBe("RIFF");
      expect(ascii(bytes, 8, 12), path).toBe("WEBP");
    });

    [
      "/favicon.svg",
      "/brand/solved-tech-logo-dark.svg",
      "/brand/solved-tech-logo-dark.png",
      "/brand/solved-tech-logo-light.svg",
      "/brand/solved-tech-logo-light.png",
    ].forEach((path) => {
      expect(() => statSync(new URL(`../public${path}`, import.meta.url)), path).toThrow();
    });
  });
});
