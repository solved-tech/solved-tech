import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";

const root = new URL("..", import.meta.url);
const read = (path: string): string => readFileSync(new URL(path, root), "utf8");

const samples = [
  { slug: "gossip-nails", lang: "en-GB", email: "gossipnails@hotmail.co.uk" },
  { slug: "vyas-gardening", lang: "en-GB", email: "vyasgardeningservice@hotmail.com" },
  { slug: "nz-cleaning", lang: "en-GB", email: "polishshine1@gmail.com" },
  { slug: "nish", lang: "ro", email: "nishcafea@gmail.com" },
  { slug: "barberoka", lang: "ro", email: "barberokabarbershop@gmail.com" },
  { slug: "mara-ellison", lang: "en-GB", email: "hello@maraellison.example" },
  { slug: "adriannica", lang: "ro", email: "contact@adriannica.ro" },
  { slug: "the-world", lang: "en-GB", email: "desk@theworld.example" },
  { slug: "through-the-lens", lang: "en-GB", email: "hello@through-the-lens.example" },
] as const;

describe("sample homepages", () => {
  it("publishes the follow-up samples and the void / frame route", () => {
    const slugs = readdirSync(new URL("samples", root), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();

    expect(slugs).toEqual([...samples.map(({ slug }) => slug), "void-frame"].sort());
  });

  it("copies them into the Pages build without listing them in navigation", () => {
    const packageJson = JSON.parse(read("package.json")) as { scripts: { build: string } };
    const render = read("src/render.ts");
    const copy = read("src/ui-copy.ts");
    const head = read("src/head.ts");

    expect(packageJson.scripts.build).toContain("node scripts/copy-samples.mts");
    expect(render).not.toContain("/samples/");
    expect(copy).not.toContain("/samples/");
    expect(head).not.toContain("/samples/");
    expect(read("scripts/prerender.mts")).toContain("Sample homepages must stay out of the sitemap.");
  });

  samples.forEach(({ slug, lang, email }) => {
    it(`keeps ${slug} out of search and on the business’s own facts`, () => {
      const html = read(`samples/${slug}/index.html`);

      expect(html).toContain(`<html lang="${lang}">`);
      expect(html).toContain('<meta name="robots" content="noindex, nofollow" />');
      expect(html).toContain('href="https://solvedtech.co.uk"');
      if (slug === "mara-ellison") {
        expect(html).toContain("Example site. Fictional studio for demonstration.");
        expect(html).not.toContain("Sample by");
      } else if (slug === "through-the-lens") {
        expect(html).toContain("Sample page by");
        expect(html).toContain("Fictional studio for demonstration.");
      } else {
        expect(html).toContain("Sample by");
      }
      if (slug === "through-the-lens") {
        expect(html).toContain("Skip to sitting");
        expect(html).toContain('id="main"');
        expect(html).toContain("<h1");
        expect(html).toContain("Look up, past the light.");
        expect(html).toContain("meets-1200.avif");
        expect(html).toContain('fetchpriority="high"');
        expect(html).toContain('src="sitting.js"');
        expect(html).not.toContain("fonts.googleapis.com");
        expect(html).not.toContain("fonts.gstatic.com");
        expect(html).not.toContain("tel:");
        expect(read(`samples/${slug}/styles.css`)).toContain("--rule: #757575");
        expect(read(`samples/${slug}/styles.css`)).toContain("font-display: optional");
      }
      expect(html).toContain(email);
      if (slug === "the-world") {
        expect(html).toContain("From 11:00, hard light");
        expect(html).toContain('aria-label="Hour of day"');
        expect(html).toContain("bricolage-800.woff2");
        expect(html).not.toContain("fonts.googleapis.com");
        expect(html).not.toContain("fonts.gstatic.com");
        expect(html).not.toContain("DRAFT");
      }
      expect(html).not.toMatch(/<style[\s>]/);
      expect(html).not.toMatch(/\sstyle="/);
      expect(html).toContain('href="styles.css"');
    });
  });

  it("keeps the void / frame zoom sample on its own route", () => {
    const html = read("samples/void-frame/zoom/index.html");
    const css = read("samples/void-frame/zoom/styles.css");
    const js = read("samples/void-frame/zoom/zoom.js");

    expect(html).toContain('<html lang="en-GB">');
    expect(html).toContain('<meta name="robots" content="noindex, nofollow" />');
    expect(html).toContain('href="https://solvedtech.co.uk"');
    expect(html).toContain("solved tech sample");
    expect(html).toContain("fictional photography sample. not a client site.");
    expect(html).toContain("drop · 004 · 0 plates");
    expect(html).toContain('aria-roledescription="zoom well"');
    expect(html).toContain("001 / brutalism, 7 plates, 6 photos");
    expect(html).toContain('class="s"');
    expect(html).toContain('class="f"');
    expect(html).toContain("media/st-logo-mark.png");
    expect(html).toContain('fetchpriority="high"');
    expect(html).toContain("b04-lcp.avif");
    expect(html).toContain('src="zoom.js"');
    expect(html).not.toContain("fonts.googleapis.com");
    expect(html).not.toContain("tel:");
    expect(html).not.toContain("<audio");
    expect(html).not.toMatch(/<style[\s>]/);
    expect(html).not.toMatch(/\sstyle="/);
    expect(css).toContain("--void: #000000");
    expect(css).toContain("--chalk: #ffffff");
    expect(css).toContain("--concrete: #1a1a1a");
    expect(css).toContain("font-display: optional");
    expect(css).toContain("scroll-snap-type: y mandatory");
    expect(css).toContain("landZoom");
    expect(css).toContain("@media (prefers-reduced-motion: no-preference)");
    expect(css).not.toContain("#9A9A9A");
    expect(css).not.toContain("grayscale");
    expect(css).not.toContain("brightness");
    expect(js).toContain("matchMedia");
    expect(js).toContain("prefers-reduced-motion");
    expect(js).not.toContain("audio");
  });
});
