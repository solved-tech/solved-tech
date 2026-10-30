import { readFileSync, readdirSync, statSync } from "node:fs";
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

const instagramPosts = [
  { name: "post1.png", sha256: "5b923b3eabf5c34a37f3c6fcf23bd9ad3549d366a1c2efef14dd8d7abc69c25a" },
  { name: "post2.png", sha256: "a598db9d9c7782fdccdef4f0bf3f9d21d4aea09d7652101dcf5b384b983938d4" },
  { name: "post3.png", sha256: "59a58339c52550c5d65396c0c3c0956f426134973ccfa70dfcc418a047a09ba1" },
  { name: "post4.png", sha256: "94d2f649cf4f69bb94b6678e3bca2025caedc3184cc0ad013b3a45b4daa8c7a3" },
  { name: "post5.png", sha256: "56bf82d6c520e0ae1cb8e4a68505600a9c34a234d7f214206e319ce64beca6e6" },
] as const;

const sha256 = async (bytes: Uint8Array): Promise<string> => {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  const digest = await crypto.subtle.digest("SHA-256", buffer);

  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
};

describe("week 1 Instagram images", () => {
  it("serves the five posts from /social/w1 without linking them or listing them in the sitemap", async () => {
    const directory = new URL("../public/social/w1/", import.meta.url);
    const names = readdirSync(directory, { withFileTypes: true })
      .filter((entry) => !entry.isDirectory())
      .map((entry) => entry.name)
      .sort();

    expect(names).toEqual(instagramPosts.map(({ name }) => name));

    for (const { name, sha256: expected } of instagramPosts) {
      const bytes = readFileSync(new URL(name, directory));

      expect(await sha256(bytes), name).toBe(expected);
    }

    const prerender = readFileSync(new URL("../scripts/prerender.mts", import.meta.url), "utf8");

    expect(prerender).toContain('sitemap.includes("/social/")');
    expect(prerender).toContain("Instagram images must stay out of the sitemap.");

    [
      "index.html",
      "privacy/index.html",
      "public/ro/services/websites-online-shops/index.html",
      "public/services/websites-online-shops/index.html",
      "services/ai-assistants/index.html",
      "services/automation/index.html",
      "services/bug-fixing/index.html",
      "services/seo-paid-campaigns/index.html",
      "services/software-development/index.html",
      "services/vorbio/index.html",
      "src/content.ts",
      "src/content-ro.ts",
      "src/head.ts",
      "src/render.ts",
      "src/ui-copy.ts",
    ].forEach((path) => {
      expect(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"), path).not.toContain("/social/");
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

    const svg = new TextDecoder().decode(readBytes("/favicon.svg"));
    const embedded = svg.match(/data:image\/png;base64,([A-Za-z0-9+/=]+)/)?.[1] ?? "";
    const png = Uint8Array.from(atob(embedded), (char) => char.charCodeAt(0));

    expect(svg).toContain('<rect width="936" height="936" fill="#ffffff"/>');
    expect(svg).not.toContain("<path");
    expect(ascii(png, 12, 16)).toBe("IHDR");
    expect(u32be(png, 16)).toBe(855);
    expect(u32be(png, 20)).toBe(936);

    [
      "/brand/solved-tech-logo-dark.svg",
      "/brand/solved-tech-logo-dark.png",
      "/brand/solved-tech-logo-light.svg",
      "/brand/solved-tech-logo-light.png",
    ].forEach((path) => {
      expect(() => statSync(new URL(`../public${path}`, import.meta.url)), path).toThrow();
    });
  });
});
