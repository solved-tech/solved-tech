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

  it("renders every service as an animated visual box", () => {
    expect(html.match(/class="service-box service-box--/g)).toHaveLength(5);
    siteContent.products.forEach(({ id, question }) => {
      expect(html).toContain(`data-service-art="${id}"`);
      expect(html).toContain(`<strong>${question}</strong>`);
    });
    expect(html).not.toContain("data-product-option");
    expect(html).not.toContain("data-product-stage");
    expect(html).not.toContain('<section class="trust"');
    expect(html).not.toContain('<article class="service"');
  });

  it("renders the service order and capability lists", () => {
    expect(html.match(/class="service-box__provides"/g)).toHaveLength(5);
    expect(html.match(/class="service-box__capability"/g)).toHaveLength(21);
    expect(html.indexOf("Want to use AI?")).toBeLessThan(
      html.indexOf("Need more customers?"),
    );
    expect(html.indexOf("Need more customers?")).toBeLessThan(
      html.indexOf("Need a website?"),
    );
    expect(html).not.toContain("Need more traffic?");
    expect(html).not.toContain('data-service-art="traffic"');
  });

  it("renders every service as the same three-region row", () => {
    expect(html.match(/class="service-box__copy"/g)).toHaveLength(5);
    expect(html.match(/class="service-box__provides"/g)).toHaveLength(5);
    expect(html.match(/class="service-box__artwork"/g)).toHaveLength(5);
  });

  it("fills every service visual with meaningful interface detail", () => {
    [
      "Home",
      "Shop",
      "Contact",
      "Tasks",
      "Search",
      "Ads",
      "Visit",
      "Request",
      "Agent",
      "Memory",
      "Calendar",
      "Messages",
      "Done",
      "Payments",
      "CRM",
      "Data",
    ].forEach((label) => expect(html).toContain(`>${label}</text>`));

    expect(html.match(/class="art-detail/g)?.length).toBeGreaterThanOrEqual(15);
    expect(html.match(/class="art-packet/g)?.length).toBeGreaterThanOrEqual(5);
  });

  it("keeps the app and system diagrams visually restrained", () => {
    const appScene = html.match(
      /data-service-art="app"[\s\S]*?<\/svg>/,
    )?.[0];
    const aiScene = html.match(
      /data-service-art="ai"[\s\S]*?<\/svg>/,
    )?.[0];
    const systemsScene = html.match(
      /data-service-art="other"[\s\S]*?<\/svg>/,
    )?.[0];

    expect(appScene).toBeDefined();
    expect(appScene).not.toContain("art-data-line");
    expect(aiScene).toContain(">Tools</text>");
    expect(aiScene).not.toContain("art-data-route--arrow");
    expect(systemsScene?.match(/text-anchor="middle"/g)).toHaveLength(6);
    expect(systemsScene).toContain(
      'class="art-accent art-hub art-hub--solid"',
    );
  });

  it("explains what happens after a client calls", () => {
    expect(html).toContain("What happens next");
    expect(html).toContain("One call. Then we make it simple.");
    expect(html.match(/class="journey__moment"/g)).toHaveLength(4);
    expect(html.match(/class="journey__signal"/g)).toHaveLength(4);
    expect(html).toContain("Tell us what’s stuck.");
    expect(html).toContain("No polished brief needed.");
    expect(html).toContain("Get a clear next move.");
    expect(html).toContain("We explain the simplest useful route.");
    expect(html).toContain("See something real, early.");
    expect(html).toContain("React to progress, not paperwork.");
    expect(html).toContain("Move forward with confidence.");
    expect(html).toContain("We launch it with you.");
    expect(html).not.toContain("Three steps. No fog.");
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
    expect(html).toContain('<div class="service-grid">');
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
    expect(html.match(/class="founder__portrait-frame"/g)).toHaveLength(2);
    expect(html.match(/Photo placeholder/g)).toHaveLength(2);
  });
});
