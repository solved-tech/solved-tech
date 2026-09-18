import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { homePage } from "../src/head";
import { servicePages } from "../src/content";

const indexHtml = readFileSync(
  new URL("../index.html", import.meta.url),
  "utf8",
);

const privacyHtml = readFileSync(
  new URL("../privacy/index.html", import.meta.url),
  "utf8",
);

describe("document shell", () => {
  it("keeps the GitHub Pages preview out of search indexes", () => {
    expect(indexHtml).toContain('<meta name="robots" content="noindex" />');
  });

  it("uses the descriptive title and description owned by head.ts", () => {
    expect(indexHtml).toContain(`<title>${homePage.title}</title>`);
    expect(indexHtml).toContain(`<meta name="description" content="${homePage.description}" />`);
  });

  it("declares language, viewport and description once", () => {
    expect(indexHtml).toContain('<html lang="en-GB">');
    expect(indexHtml.match(/<meta name="viewport"/g)).toHaveLength(1);
    expect(indexHtml.match(/<meta name="description"/g)).toHaveLength(1);
  });
});

describe("privacy document shell", () => {
  it("mirrors the homepage shell for the privacy page", () => {
    expect(privacyHtml).toContain('<html lang="en-GB">');
    expect(privacyHtml).toContain("<title>Privacy notice — Solved Tech</title>");
    expect(privacyHtml).toContain('<meta name="robots" content="noindex" />');
    expect(privacyHtml).toContain('<script type="module" src="/src/privacy.ts"></script>');
    expect(privacyHtml).toContain('<a class="skip-link" href="#main-content">Skip to content</a>');
  });
});

describe("document icons", () => {
  const shells: Array<[string, string]> = [
    ["the homepage", indexHtml],
    ["the privacy notice", privacyHtml],
    ...servicePages.map(
      ({ slug }): [string, string] => [
        `the ${slug} service page`,
        readFileSync(new URL(`../services/${slug}/index.html`, import.meta.url), "utf8"),
      ],
    ),
  ];

  shells.forEach(([name, html]) => {
    it(`links the favicon and touch icon from ${name}`, () => {
      expect(html).toContain('<link rel="icon" href="/favicon.svg" type="image/svg+xml" />');
      expect(html).toContain('<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png" />');
      expect(html).toContain('<link rel="apple-touch-icon" href="/apple-touch-icon.png" />');
    });
  });
});

describe("service document shells", () => {
  servicePages.forEach(({ slug, title, description }) => {
    it(`mirrors the shell for /services/${slug}/`, () => {
      const html = readFileSync(new URL(`../services/${slug}/index.html`, import.meta.url), "utf8");

      expect(html).toContain('<html lang="en-GB">');
      expect(html).toContain(`<title>${title} — Solved Tech</title>`);
      expect(html).toContain(`<meta name="description" content="${description}" />`);
      expect(html).toContain('<meta name="robots" content="noindex" />');
      expect(html).toContain(`<body data-service="${slug}">`);
      expect(html).toContain('<script type="module" src="/src/service.ts"></script>');
    });
  });
});
