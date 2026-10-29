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
] as const;

describe("sample homepages", () => {
  it("publishes exactly the seven follow-up samples", () => {
    const slugs = readdirSync(new URL("samples", root), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();

    expect(slugs).toEqual(samples.map(({ slug }) => slug).sort());
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
      expect(html).toContain("Sample by");
      expect(html).toContain(email);
      expect(html).not.toMatch(/<style[\s>]/);
      expect(html).not.toMatch(/\sstyle="/);
      expect(html).toContain('href="styles.css"');
    });
  });
});
