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
      "Whatever your business needs next, we build it.",
    );
    expect(html).toContain(
      "Bring us the problem. We will turn it into something useful.",
    );
  });

  it("uses the approved hero eyebrow service order", () => {
    expect(html).toContain(
      '<p class="hero__eyebrow" data-reveal>AI. Growth. Apps. Websites.</p>',
    );
    expect(html).not.toContain("Websites. Apps. Growth. AI.");
  });

  it("places the seven-service pipeline above the hero actions", () => {
    const pipeline = html.indexOf('class="hero__pipeline"');
    const actions = html.indexOf('class="hero__actions"');
    const pipelineLabels = [
      ...html.matchAll(/<text y="43">([^<]+)<\/text>/g),
    ].map(([, label]) => label);

    expect(pipeline).toBeGreaterThan(html.indexOf("Bring us the problem."));
    expect(pipeline).toBeLessThan(actions);
    expect(html.match(/class="hero-pipeline__node(?:\s|")/g)).toHaveLength(7);
    expect(html).toContain("hero-pipeline__node--ai");
    expect(pipelineLabels).toEqual([
      "AI",
      "Customers",
      "Websites",
      "Web apps",
      "Mobile apps",
      "Desktop apps",
      "Custom systems",
    ]);
  });

  it("aligns node ring delays with measured signal crossings", () => {
    const nodes = Array.from(
      html.matchAll(
        /<g class="hero-pipeline__node[^"]*"[^>]*style="--pipeline-delay:\s*([^"]+)"[\s\S]*?<text y="43">([^<]+)<\/text>/g,
      ),
      ([, delay, label]) => ({ delay, label }),
    );

    expect(nodes.map(({ label }) => label)).toEqual([
      "AI",
      "Customers",
      "Websites",
      "Web apps",
      "Mobile apps",
      "Desktop apps",
      "Custom systems",
    ]);
    expect(nodes.map(({ delay }) => delay)).toEqual([
      "0s",
      "0.911s",
      "1.952s",
      "3.059s",
      "4.302s",
      "5.313s",
      "7.045s",
    ]);
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
      const questionId = `service-${id}-question`;

      expect(html).toContain(`data-service-art="${id}"`);
      expect(html).toContain(
        `<article class="service-box service-box--${id}" aria-labelledby="${questionId}">`,
      );
      expect(html).toContain(
        `<h3 id="${questionId}" class="service-box__question">${question}</h3>`,
      );
    });
    expect(html).not.toContain("data-product-option");
    expect(html).not.toContain("data-product-stage");
    expect(html).not.toContain('<section class="trust"');
    expect(html).not.toContain('<article class="service"');
  });

  it("keeps service rows visible and reveals only artwork", () => {
    const serviceArticles = Array.from(
      html.matchAll(/<article class="service-box[^"]*"[^>]*>/g),
      (match) => match[0],
    );

    expect(serviceArticles).toHaveLength(5);
    serviceArticles.forEach((openingTag) => {
      expect(openingTag).not.toContain("data-reveal");
    });
    expect(
      html.match(/class="service-box__artwork" data-reveal/g),
    ).toHaveLength(5);
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

  it("uses a full header, diagram-first body, and dedicated CTA per service", () => {
    expect(html.match(/class="service-box__header"/g)).toHaveLength(5);
    expect(html.match(/class="service-box__body"/g)).toHaveLength(5);
    expect(
      html.match(/class="service-box__cta" href="#contact"/g),
    ).toHaveLength(5);
    expect(
      html.match(
        /<div class="service-box__body">\s*<span class="service-box__artwork" data-reveal>[\s\S]*?<div class="service-box__provides">/g,
      ),
    ).toHaveLength(5);
    expect(html).not.toContain('class="service-box__link"');
  });

  it("gives every service contact link a distinct accessible name", () => {
    siteContent.products.forEach(({ title }) => {
      expect(html).toContain(`aria-label="Talk to us about ${title}"`);
    });
  });

  it("keeps the two section labels on a single semantic line", () => {
    expect(html).toContain(
      '<h2 id="services-heading" data-reveal>What do you need?</h2>',
    );
    expect(html).toContain("<p>What happens next</p>");
  });

  it("reveals each service artwork when the diagram reaches the viewport", () => {
    expect(
      html.match(/class="service-box__artwork" data-reveal/g),
    ).toHaveLength(5);
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
      'src="/solved-tech/team/razvan_cristofor.png"',
    );
    expect(pagesHtml).toContain(
      'src="/solved-tech/team/remus_baciu.png"',
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

  it("renders Call, WhatsApp, and Email in both contact groups", () => {
    expect(html.match(/href="tel:\+442000000000"/g)).toHaveLength(2);
    expect(
      html.match(/href="https:\/\/wa\.me\/442000000000"/g),
    ).toHaveLength(2);
    expect(
      html.match(/href="mailto:contact@solvedtech\.co\.uk"/g),
    ).toHaveLength(2);
    expect(
      html.match(/contact-action__icon--whatsapp/g),
    ).toHaveLength(2);
    expect(html.match(/contact-action__icon--email/g)).toHaveLength(2);

    const groups = Array.from(
      html.matchAll(
        /<div class="(?:hero__actions|contact__actions)">([\s\S]*?)<\/div>/g,
      ),
      (match) => match[1],
    );

    expect(groups).toHaveLength(2);
    groups.forEach((group) => {
      const labels = Array.from(
        group.matchAll(/<a class="contact-action[^"]*"[^>]*>([\s\S]*?)<\/a>/g),
        ([, inner]) => {
          const spanLabel = inner.match(/<span>([^<]+)<\/span>/)?.[1];
          return spanLabel ?? inner.replace(/<[^>]+>/g, "").trim();
        },
      );

      expect(labels).toEqual(["Call us", "WhatsApp us", "Email us"]);
    });
  });

  it("renders two founder cards with portraits and LinkedIn links", () => {
    siteContent.founders.forEach(({ image, linkedin, name }) => {
      expect(html).toContain(`src="${image}"`);
      expect(html).toContain(name);
      expect(html).toContain(`alt="Portrait of ${name}"`);
      expect(html).toContain(`href="${linkedin}"`);
      expect(html).toContain(`aria-label="LinkedIn profile for ${name}"`);
    });
    expect(html.match(/class="founder__portrait-frame"/g)).toHaveLength(2);
    expect(html).not.toContain("Placeholder portrait");
    expect(html).not.toContain("Photo placeholder");
  });
});
