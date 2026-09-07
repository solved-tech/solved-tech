import { describe, expect, it } from "vitest";
import { contactConfig, siteContent } from "../src/content";
import { renderHomepage } from "../src/render";

describe("homepage renderer", () => {
  const html = renderHomepage(siteContent, contactConfig);

  it("renders one main heading and every product question", () => {
    expect(html.match(/<h1/g)).toHaveLength(1);
    siteContent.products.forEach(({ question }) =>
      expect(html).toContain(question),
    );
  });

  it("makes the hero a direct product offer", () => {
    expect(html).toContain(
      '<div class="hero__signal" aria-hidden="true">',
    );
    expect(html).toContain(
      '<p class="hero__eyebrow" data-reveal>Websites. Apps. Growth. AI.</p>',
    );
    expect(html).toContain(
      "Whatever your business needs next, we build it.",
    );
    expect(html).toContain(
      "Bring us the problem. We will turn it into something useful.",
    );
  });

  it("renders semantic navigation and contact landmarks", () => {
    expect(html).toContain('<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation"');
    expect(html).toContain('<nav id="primary-navigation"');
    expect(html).toContain('<main id="main-content">');
    expect(html).toContain('<section class="contact');
    expect(html).toContain('href="#team">Team</a>');
  });

  it("uses a question-led visual product showcase", () => {
    expect(html).toContain('class="product-showcase"');
    expect(html).toContain('data-product-option');
    expect(html).toContain('data-product-stage');
    expect(html).toContain('data-product-scene="0"');
    expect(html).not.toContain('<section class="trust"');
    expect(html).not.toContain('<article class="service"');
  });

  it("uses the professional logo lockup in the site header", () => {
    expect(html).toContain(
      '<a class="wordmark" href="#top" aria-label="Solved Tech home">',
    );
    expect(html).toContain(
      '<img src="/brand/solved-tech-logo-dark.svg" alt="Solved Tech — Your digital problems, solved."',
    );
  });

  it("prefixes public assets for a GitHub Pages project site", () => {
    const pagesHtml = renderHomepage(
      siteContent,
      contactConfig,
      "/solved-tech/",
    );

    expect(pagesHtml).toContain(
      'src="/solved-tech/brand/solved-tech-logo-dark.svg"',
    );
    expect(pagesHtml).toContain(
      'src="/solved-tech/team/founder-one-placeholder.svg"',
    );
  });

  it("renders one assistive-technology-hidden background grid", () => {
    expect(html.match(/class="ambient-grid"/g)).toHaveLength(1);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('id="ambient-grid-pattern"');
    expect(html).toContain('class="ambient-grid__accent"');
  });

  it("renders no more than eight quiet code fragments", () => {
    expect(html.match(/class="code-field"/g)).toHaveLength(1);
    expect(html).toContain('class="code-field" aria-hidden="true"');
    const languages = [
      "typescript",
      "python",
      "swift",
      "sql",
      "html",
      "css",
      "terraform",
      "shell",
    ];
    languages.forEach((language) =>
      expect(html).toContain(`data-language="${language}"`),
    );
    expect(html.match(/data-language=/g)).toHaveLength(languages.length);
  });

  it("marks every element the enhancement layer reveals", () => {
    expect(html.match(/ data-reveal(?=[ >])/g)?.length).toBeGreaterThan(8);
    expect(html).toContain('<h1 id="hero-heading" data-reveal>');
    expect(html).toContain('<div class="product-showcase" data-reveal>');
    expect(html).toContain('<section id="team" class="team"');
  });

  it("renders one-click Call and WhatsApp placeholders", () => {
    expect(html).toContain('href="tel:+442000000000"');
    expect(html).toContain('href="https://wa.me/442000000000"');
    expect(html).toContain("Trial contact details");
    expect(html).not.toContain("mailto:");
    expect(html).not.toContain("Voice note");
    expect(html).not.toContain("Request a quote");
  });

  it("renders two founder cards with portraits and LinkedIn links", () => {
    siteContent.founders.forEach(({ image, name }) => {
      expect(html).toContain(`src="${image}"`);
      expect(html).toContain(name);
    });
    expect(html.match(/aria-label="LinkedIn profile placeholder/g)).toHaveLength(
      2,
    );
  });
});
