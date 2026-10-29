import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { homePage, vorbioPage } from "../src/head";
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

describe("vorbio product shell", () => {
  const vorbioHtml = readFileSync(
    new URL("../services/vorbio/index.html", import.meta.url),
    "utf8",
  );

  it("mirrors the shell for /services/vorbio/", () => {
    expect(vorbioHtml).toContain('<html lang="en-GB">');
    expect(vorbioHtml).toContain(`<title>${vorbioPage.title}</title>`);
    expect(vorbioHtml).toContain(
      `<meta name="description" content="${vorbioPage.description}" />`,
    );
    expect(vorbioHtml).toContain('<meta name="robots" content="noindex" />');
    expect(vorbioHtml).toContain('<body data-service="vorbio">');
    expect(vorbioHtml).toContain('<a class="skip-link" href="#main-content">Skip to content</a>');
    expect(vorbioHtml).toContain('<div id="app"></div>');
    expect(vorbioHtml).toContain('<script type="module" src="/src/vorbio.ts"></script>');
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
      expect(html).toContain('<link rel="icon" href="/favicon.ico" sizes="any" />');
      expect(html).toContain('<link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32" />');
      expect(html).toContain('<link rel="icon" href="/favicon-192.png" type="image/png" sizes="192x192" />');
      expect(html).toContain('<link rel="icon" href="/favicon-512.png" type="image/png" sizes="512x512" />');
      expect(html).toContain('<link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />');
    });
  });
});

describe("website service redirect", () => {
  it("sends the old website service URLs to the main website packages", () => {
    const english = readFileSync(
      new URL("../public/services/websites-online-shops/index.html", import.meta.url),
      "utf8",
    );
    const romanian = readFileSync(
      new URL("../public/ro/services/websites-online-shops/index.html", import.meta.url),
      "utf8",
    );

    expect(english).toContain('http-equiv="refresh" content="0; url=/#packages"');
    expect(english).toContain('href="/#packages"');
    expect(english).toContain('content="noindex"');
    expect(romanian).toContain('http-equiv="refresh" content="0; url=/ro/#packages"');
    expect(romanian).toContain('href="/ro/#packages"');
    expect(romanian).toContain('<html lang="ro">');
    expect(english).not.toContain("London");
    expect(romanian).not.toContain("Londra");
  });
});

describe("service document shells", () => {
  it("ships exactly one shell per service record with unique paths", () => {
    expect(servicePages).toHaveLength(5);
    expect(new Set(servicePages.map(({ slug }) => slug)).size).toBe(5);
    expect(new Set(servicePages.map(({ productId }) => productId)).size).toBe(5);
  });

  servicePages.forEach(({ slug, title, description }) => {
    it(`mirrors the shell for /services/${slug}/`, () => {
      const html = readFileSync(new URL(`../services/${slug}/index.html`, import.meta.url), "utf8");

      expect(html).toContain('<html lang="en-GB">');
      expect(html).toContain(`<title>${title} — Solved Tech</title>`);
      expect(html).toContain(`<meta name="description" content="${description}" />`);
      expect(html).toContain('<meta name="robots" content="noindex" />');
      expect(html).toContain(`<body data-service="${slug}">`);
      expect(html).toContain('<a class="skip-link" href="#main-content">Skip to content</a>');
      expect(html).toContain('<div id="app"></div>');
      expect(html).toContain('<script type="module" src="/src/service.ts"></script>');
    });
  });
});
