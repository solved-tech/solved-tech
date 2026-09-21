import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contactConfig, privacyContent, servicePages, siteContent } from "../src/content";
import { escapeHtml, renderHomepage, renderPrivacyPage, renderServicePage } from "../src/render";

const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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
      "We build, fix and connect business software.",
    );
    expect(html).toContain(
      "We build new applications, fix existing software and connect your systems.",
    );
  });

  it("uses the approved hero eyebrow service order", () => {
    expect(html).toContain(
      '<p class="hero__eyebrow" data-reveal>Development. Bug fixes. Automation.</p>',
    );
    expect(html).not.toContain("Websites. Apps. Growth. AI.");
  });

  it("places the seven-service pipeline above the hero actions", () => {
    const pipeline = html.indexOf('class="hero__pipeline"');
    const actions = html.indexOf('class="hero__actions"');
    const pipelineLabels = [
      ...html.matchAll(/<text y="43">([^<]+)<\/text>/g),
    ].map(([, label]) => label);

    expect(pipeline).toBeGreaterThan(html.indexOf("connect your systems."));
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
        /<g class="hero-pipeline__node hero-pipeline__node--([a-z-]+)" transform="[^"]*"[\s\S]*?<text y="43">([^<]+)<\/text>/g,
      ),
      ([, modifier, label]) => ({ modifier, label }),
    );
    const delays = new Map<string, string>(
      Array.from(
        styles.matchAll(/\.hero-pipeline__node--([a-z-]+) \{\s*--pipeline-delay: ([^;]+);/g),
        ([, modifier, delay]) => [modifier, delay] as [string, string],
      ),
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
    expect(nodes.map(({ modifier }) => modifier)).toEqual([
      "ai",
      "customers",
      "websites",
      "web-apps",
      "mobile-apps",
      "desktop-apps",
      "custom-systems",
    ]);
    expect(nodes.map(({ modifier }) => delays.get(modifier))).toEqual([
      "0s",
      "0.911s",
      "1.952s",
      "3.059s",
      "4.302s",
      "5.313s",
      "7.045s",
    ]);
    expect(html).not.toContain('style="');
  });

  it("renders semantic navigation and contact landmarks", () => {
    expect(html).toContain('<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation"');
    expect(html).toContain('<nav id="primary-navigation"');
    expect(html).toContain('<main id="main-content">');
    expect(html).toContain('<section class="contact');
    expect(html).toContain('href="#team">Team</a>');
    expect(html).toContain('href="#services">Services</a>');
    expect(html).toContain('href="#approach">How we work</a>');
    expect(html).toContain('<a href="/privacy/">Privacy notice</a>');
    expect(html).not.toContain(">Products<");
  });

  it("renders six product cards, one full link each, in the approved order", () => {
    const cards = Array.from(
      html.matchAll(/<article class="product-card product-card--([a-z]+)">/g),
      ([, id]) => id,
    );

    expect(cards).toEqual([
      "ai",
      "app",
      "customers",
      "website",
      "fix",
      "other",
    ]);
    expect(html.match(/class="product-card__link"/g)).toHaveLength(6);
    expect(html).not.toContain("need-selector");
    expect(html).not.toContain("service-box");
    expect(html).not.toContain("data-service-art");
    expect(html).not.toContain("product-card__tags");
    expect(html).not.toContain("Explore service");
  });

  it("renders the structured services header above the grid", () => {
    expect(html).toContain('<div class="services__header" data-reveal>');
    expect(html).toContain(
      '<p class="services__eyebrow">Services / 01—06</p>',
    );
    expect(html).toContain(
      '<h2 id="services-heading">What does your business need?</h2>',
    );
    expect(html).toContain(
      '<p class="services__intro">Choose the closest fit. You do not need a finished brief—we will help define the next step.</p>',
    );
    expect(html.indexOf('class="services__header"')).toBeLessThan(
      html.indexOf('class="product-grid"'),
    );
  });

  it("links each card to its service page with a top rail, title, outcome and action", () => {
    expect(html).toContain('<div class="product-grid">');

    servicePages.forEach(({ slug, productId }) => {
      const product = siteContent.products.find(
        ({ id }) => id === productId,
      )!;

      expect(product).toBeDefined();

      const card = html.match(
        new RegExp(
          `<article class="product-card product-card--${productId}">[\\s\\S]*?</article>`,
        ),
      )?.[0];

      expect(card).toBeDefined();
      expect(card).toContain(`href="/services/${slug}/"`);
      expect(card).toContain('<span class="product-card__top">');
      expect(card).toContain('<span class="product-card__meta">');
      expect(card).toContain(
        `<span class="product-card__eyebrow">${product.question}</span>`,
      );
      expect(card).toContain(
        `<h3 class="product-card__title">${escapeHtml(product.title)}</h3>`,
      );
      expect(card).toContain(
        `<p class="product-card__outcome">${escapeHtml(product.outcome)}</p>`,
      );
      expect(card).toContain("View service");
      expect(card).toContain(`product-glyph--${productId}`);
      expect(card).toContain(
        `data-service-id="${productId}" data-placement="product-card"`,
      );
    });
  });

  it("numbers the cards and keeps each card link free of nested controls", () => {
    const indexes = Array.from(
      html.matchAll(/class="product-card__index" aria-hidden="true">(\d{2})</g),
      ([, index]) => index,
    );

    expect(indexes).toEqual(["01", "02", "03", "04", "05", "06"]);
    expect(html.match(/class="product-card__action"/g)).toHaveLength(6);

    const grid = html.match(
      /<div class="product-grid">([\s\S]*?)<\/section>/,
    )?.[1];

    expect(grid).toBeDefined();
    expect(grid!.match(/<a /g)).toHaveLength(6);
    expect(grid).not.toContain("<ul");
    expect(grid).not.toContain("<button");
    expect(grid).not.toContain('href="#contact"');
    expect(grid).not.toContain("Explore service");
  });

  it("keeps the two section labels on a single semantic line", () => {
    expect(html).toContain(
      '<h2 id="services-heading">What does your business need?</h2>',
    );
    expect(html).toContain("<p>How we work</p>");
  });

  it("renders one decorative glyph per product id", () => {
    const services = html.match(
      /<section id="services"[\s\S]*?<\/section>/,
    )?.[0];

    expect(services).toBeDefined();

    (["fix", "ai", "customers", "website", "app", "other"] as const).forEach(
      (id) => expect(services).toContain(`product-glyph--${id}`),
    );

    expect(
      html.match(/<svg class="product-glyph product-glyph--[a-z]+"/g),
    ).toHaveLength(6);
    expect(services).toContain('viewBox="0 0 64 64"');
    expect(services).toContain('aria-hidden="true"');
    expect(services).toContain('focusable="false"');
    expect(services).not.toContain("<text");
    expect(services).not.toContain("data-service-art");
    expect(services).not.toContain("service-art");
    expect(services).not.toContain("<ul");
  });

  it("explains assessment, scope, build and handover", () => {
    expect(html).toContain("How we work");
    expect(html).toContain("Assess, agree, build, hand over.");
    expect(html.match(/class="journey__moment"/g)).toHaveLength(4);
    expect(html.match(/class="journey__signal"/g)).toHaveLength(4);
    expect(html).toContain("Tell us what is happening.");
    expect(html).toContain("Describe the problem or the goal. No polished brief needed.");
    expect(html).toContain("We assess and agree the scope.");
    expect(html).toContain(
      "You get a short written assessment, a proposed scope and an estimate before work starts.",
    );
    expect(html).toContain("We build and test.");
    expect(html).toContain("You see progress early and we test against the agreed scope.");
    expect(html).toContain("Handover you can rely on.");
    expect(html).toContain("We hand over with documentation and agree what happens after delivery.");
    expect(html).toContain(
      '<p class="journey__note" data-reveal>For a bug, the first step is a diagnosis. We confirm the cause before we promise a fix.</p>',
    );
    expect(html).not.toContain("One call. Then we make it simple.");
  });

  it("tells a visitor what to send in the first message", () => {
    const contact = html.match(/<section class="contact"[\s\S]*?<\/section>/)?.[0];

    expect(contact).toContain(
      "Tell us what your business needs, which system is involved and what outcome you want. For a bug, include the steps that trigger it and any deadline that matters.",
    );
    expect(contact).toContain(
      '<p class="contact-caution" data-reveal>Please do not send passwords or confidential customer data in your first message.</p>',
    );
    expect(contact).not.toContain("One click starts the conversation.");
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
      'src="/solved-tech/team/razvan_cristofor-520.webp"',
    );
    expect(pagesHtml).toContain(
      'src="/solved-tech/team/remus_baciu-340.webp"',
    );
    expect(pagesHtml).toContain('srcset="/solved-tech/team/razvan_cristofor-520.webp 520w, /solved-tech/team/razvan_cristofor-1040.webp 1040w" sizes="(min-width: 48rem) 26rem, 80vw"');
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
    expect(html).toContain('<div class="product-grid">');
    expect(html).toContain('<section id="team" class="team"');
  });

  it("renders Call, WhatsApp, and Email in both contact groups", () => {
    expect(
      html.match(new RegExp(`href="tel:${escapeRegExp(contactConfig.phone)}"`, "g")),
    ).toHaveLength(2);
    expect(
      html.match(
        new RegExp(`href="https://wa\\.me/${escapeRegExp(contactConfig.whatsapp)}"`, "g"),
      ),
    ).toHaveLength(2);
    expect(
      html.match(new RegExp(`href="mailto:${escapeRegExp(contactConfig.email)}"`, "g")),
    ).toHaveLength(2);
    expect(
      html.match(/contact-action__icon--whatsapp/g),
    ).toHaveLength(2);
    expect(html.match(/contact-action__icon--email/g)).toHaveLength(2);

    const heroGroup = html.match(
      /<div class="hero__actions">([\s\S]*?)<\/div>/,
    )?.[1];
    const contactGroup = html.match(
      /<div class="contact__actions">([\s\S]*?)<\/div>/,
    )?.[1];

    expect(heroGroup).toBeDefined();
    expect(contactGroup).toBeDefined();

    const heroLabels = Array.from(
      heroGroup!.matchAll(
        /<a class="contact-action[^"]*"(?:[^>]*aria-label="([^"]*)")?[^>]*>/g,
      ),
      ([, ariaLabel]) => ariaLabel,
    );
    expect(heroLabels).toEqual(["Call us", "WhatsApp us", "Email us"]);
    expect(heroGroup!.match(/contact-action__suffix/g)).toHaveLength(3);

    const contactLabels = Array.from(
      contactGroup!.matchAll(/<a class="contact-action[^"]*"[^>]*>([\s\S]*?)<\/a>/g),
      ([, inner]) => {
        const spanLabel = inner.match(/<span>([^<]+)<\/span>/)?.[1];
        return spanLabel ?? inner.replace(/<[^>]+>/g, "").trim();
      },
    );
    expect(contactLabels).toEqual(["Call us", "WhatsApp us", "Email us"]);
    expect(contactGroup).not.toContain("contact-action__suffix");
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
    expect(html.match(/ srcset="/g)).toHaveLength(1);
    expect(html).not.toContain("Placeholder portrait");
    expect(html).not.toContain("Photo placeholder");
  });
  it("targets back-to-top links at an in-flow anchor above the sticky header", () => {
    expect(html).toContain('<div id="top" class="page-top" tabindex="-1"></div>');
    expect(html).toContain('<header class="site-header">');
    expect(html).not.toContain('<header id="top"');
    expect(html.indexOf('id="top"')).toBeLessThan(
      html.indexOf('class="site-header"'),
    );
    expect(html.match(/href="#top"/g)).toHaveLength(2);
  });

  it("shows the phone number and email as copyable text in the contact section", () => {
    const contact = html.match(/<section class="contact"[\s\S]*?<\/section>/)?.[0];

    expect(contact).toBeDefined();
    expect(contact).toContain('<dl class="contact-details" data-reveal>');
    expect(contact).toContain(`<dt>Phone</dt><dd>${contactConfig.displayPhone}</dd>`);
    expect(contact).toContain(`<dt>Email</dt><dd>${contactConfig.email}</dd>`);
    expect(contact!.indexOf('class="contact__actions"')).toBeLessThan(
      contact!.indexOf('class="contact-details"'),
    );
  });

  it("orders the product grid directly below the services heading", () => {
    expect(html.indexOf('id="services-heading"')).toBeLessThan(
      html.indexOf('class="product-grid"'),
    );
    expect(html.match(/class="product-grid"/g)).toHaveLength(1);
  });

  it("offers a visible control to pause background motion after the hero actions", () => {
    const actions = html.indexOf('class="hero__actions"');
    const toggle = html.indexOf(
      '<button class="motion-toggle" type="button">Pause background motion</button>',
    );

    expect(toggle).toBeGreaterThan(actions);
    expect(toggle).toBeLessThan(html.indexOf('id="services"'));
  });

  it("annotates intent targets for measurement without loading any script", () => {
    expect(html.match(/data-analytics="contact_click"/g)).toHaveLength(6);
    expect(html.match(/data-channel="call"/g)).toHaveLength(2);
    expect(html.match(/data-channel="whatsapp"/g)).toHaveLength(2);
    expect(html.match(/data-channel="email"/g)).toHaveLength(2);
    expect(html.match(/data-placement="hero"/g)).toHaveLength(3);
    expect(html.match(/data-placement="contact"/g)).toHaveLength(3);
    expect(html.match(/data-analytics="service_interest"/g)).toHaveLength(6);
    siteContent.products.forEach(({ id }) =>
      expect(html).toContain(`data-service-id="${id}" data-placement="product-card"`),
    );
    expect(html).not.toContain("<script");
    expect(html).not.toMatch(/gtag|googletagmanager|plausible|umami|analytics\.js/);
  });
});

describe("privacy page renderer", () => {
  const html = renderPrivacyPage(privacyContent, contactConfig, "/solved-tech/");

  it("renders the notice with every section and a contact section from config", () => {
    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toContain('<h1 id="privacy-heading">Privacy notice</h1>');
    expect(html.match(/<h2>/g)).toHaveLength(privacyContent.sections.length + 1);
    expect(html).toContain("<h2>Contact</h2>");
    expect(html).toContain(contactConfig.email);
    expect(html).toContain(contactConfig.displayPhone);
    expect(html).not.toContain("ambient-grid");
    expect(html).not.toContain("data-reveal");
  });

  it("points the shared header at the homepage sections", () => {
    expect(html).toContain('<a class="wordmark" href="/solved-tech/#top"');
    expect(html).toContain('<a href="/solved-tech/#services">Services</a>');
    expect(html).toContain('<a href="/solved-tech/#contact">Contact</a>');
    expect(html).toContain('<nav id="primary-navigation"');
    expect(html).toContain('<main id="main-content" class="page">');
  });

  it("links back to the notice and to the top from the footer", () => {
    expect(html).toContain('<a href="/solved-tech/privacy/">Privacy notice</a>');
    expect(html).toContain('<a href="#top">Back to top</a>');
  });
  it("links the email and phone for questions about the notice", () => {
    expect(html).toContain(
      `<a href="mailto:${contactConfig.email}">${contactConfig.email}</a>`,
    );
    expect(html).toContain(
      `<a href="tel:${contactConfig.phone}">${contactConfig.displayPhone}</a>`,
    );
  });
});

describe("proof and FAQ sections", () => {
  const html = renderHomepage(siteContent, contactConfig, "/");
  const study = {
    id: "example",
    title: "Example title",
    client: "Example client (anonymised)",
    situation: "Example situation.",
    contribution: "Example contribution.",
    deliverable: "Example deliverable.",
    technologies: ["TypeScript", "PostgreSQL"],
    result: "Example result.",
  };

  it("renders the FAQ once its answers are approved and no proof until a case study exists", () => {
    expect(html).toContain('id="faq"');
    expect(html).not.toContain('id="work"');
    expect(html).not.toMatch(/\[\[[A-Z_]+\]\]/);
  });

  it("renders approved case studies between the team and contact sections", () => {
    const withProof = renderHomepage(
      { ...siteContent, caseStudies: [study] },
      contactConfig,
      "/",
    );
    const work = withProof.indexOf('<section id="work" class="work" aria-labelledby="work-heading">');

    expect(work).toBeGreaterThan(withProof.indexOf('id="team"'));
    expect(work).toBeLessThan(withProof.indexOf('id="contact"'));
    expect(withProof).toContain('<h2 id="work-heading" data-reveal>Problems we have solved</h2>');
    expect(withProof).toContain('<article class="case-study" id="work-example" data-reveal>');
    expect(withProof).toContain('<p class="case-study__client">Example client (anonymised)</p>');
    expect(withProof).toContain("<h3>Example title</h3>");
    expect(withProof).toContain("<dt>Situation</dt><dd>Example situation.</dd>");
    expect(withProof).toContain("<dt>What we did</dt><dd>Example contribution.</dd>");
    expect(withProof).toContain("<dt>Delivered</dt><dd>Example deliverable.</dd>");
    expect(withProof).toContain("<dt>Result</dt><dd>Example result.</dd>");
    expect(withProof).toContain(
      '<ul class="case-study__stack" aria-label="Technologies"><li>TypeScript</li><li>PostgreSQL</li></ul>',
    );
  });

  it("renders only FAQ entries whose answers are approved", () => {
    const withFaq = renderHomepage(
      {
        ...siteContent,
        faq: [
          { question: "Answered question?", answer: "Answered." },
          { question: "Pending question?", answer: "[[FAQ_ANSWER_PENDING]]" },
        ],
      },
      contactConfig,
      "/",
    );
    const faq = withFaq.indexOf('<section id="faq" class="faq" aria-labelledby="faq-heading">');

    expect(faq).toBeGreaterThan(withFaq.indexOf('id="approach"'));
    expect(faq).toBeLessThan(withFaq.indexOf('id="team"'));
    expect(withFaq).toContain('<h2 id="faq-heading" data-reveal>Questions we are often asked</h2>');
    expect(withFaq).toContain("<dt>Answered question?</dt>");
    expect(withFaq).toContain("<dd>Answered.</dd>");
    expect(withFaq).not.toContain("Pending question?");
    expect(withFaq).not.toContain("[[FAQ_ANSWER_PENDING]]");
  });
});

describe("service page renderer", () => {
  const [bugFixing] = servicePages;
  const html = renderServicePage(bugFixing, siteContent, contactConfig, "/solved-tech/");

  it("renders the detail hero, body, navigation and contact block", () => {
    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toContain(
      '<article class="service-detail" aria-labelledby="service-heading">',
    );
    expect(html).toContain('<div class="service-hero__copy">');
    expect(html).toContain('<div class="service-hero__visual">');
    expect(html).toContain(`data-service-art="${bugFixing.productId}"`);
    expect(html).toContain(`<h1 id="service-heading">${bugFixing.title}</h1>`);
    expect(html).toContain(`<p class="prose__lead">${bugFixing.intro}</p>`);
    expect(html).toContain('<div class="service-detail__body">');
    expect(html).toContain("<h2>Typical requests</h2>");
    expect(html).toContain("<h2>What you receive</h2>");
    bugFixing.requests.forEach((request) => expect(html).toContain(`<li>${request}</li>`));
    bugFixing.deliverables.forEach((item) => expect(html).toContain(`<li>${item}</li>`));
    expect(html).toContain(
      '<nav class="service-detail__navigation" aria-label="Service navigation">',
    );
    expect(html).toContain('<a href="/solved-tech/#approach">See how we work</a>');
    expect(html).toContain(
      '<a href="/solved-tech/#services">Back to all services</a>',
    );
    expect(html).toContain('<h2 id="service-contact-heading">Tell us what is happening</h2>');
    expect(html.match(/<a class="contact-action /g)).toHaveLength(3);
    expect(html).toContain('<a class="wordmark" href="/solved-tech/#top"');
    expect(html).not.toContain("data-reveal");
  });

  it("links every product card to its service page", () => {
    const home = renderHomepage(siteContent, contactConfig, "/solved-tech/");

    servicePages.forEach(({ slug, productId }) => {
      const card = home.match(
        new RegExp(
          `<article class="product-card product-card--${productId}">[\\s\\S]*?</article>`,
        ),
      )?.[0];

      expect(card).toBeDefined();
      expect(card).toContain(`href="/solved-tech/services/${slug}/"`);
      expect(card).toContain("View service");
    });
  });

  it("gives each service page distinct content and matching artwork", () => {
    const pages = servicePages.map((page) =>
      renderServicePage(page, siteContent, contactConfig, "/"),
    );

    expect(new Set(pages).size).toBe(6);
    pages.forEach((pageHtml, index) => {
      expect(pageHtml).toContain(
        `data-service-art="${servicePages[index].productId}"`,
      );
    });
  });

  it("marks every detail artwork as decorative", () => {
    servicePages.forEach((page) => {
      const pageHtml = renderServicePage(page, siteContent, contactConfig, "/");

      expect(pageHtml).toMatch(
        new RegExp(
          `<svg class="service-art service-art--${page.productId}" data-service-art="${page.productId}" aria-hidden="true"`,
        ),
      );
    });
  });
});

describe("service detail artwork", () => {
  const detailHtml = servicePages
    .map((page) => renderServicePage(page, siteContent, contactConfig, "/"))
    .join("");

  it("fills every service visual with meaningful interface detail", () => {
    [
      "Log",
      "Reproduce",
      "Fixed",
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
    ].forEach((label) => expect(detailHtml).toContain(`>${label}</text>`));

    expect(detailHtml.match(/class="art-detail/g)?.length).toBeGreaterThanOrEqual(15);
    expect(detailHtml.match(/class="art-packet/g)?.length).toBeGreaterThanOrEqual(5);
  });

  it("keeps the app and system diagrams visually restrained", () => {
    const appScene = detailHtml.match(
      /data-service-art="app"[\s\S]*?<\/svg>/,
    )?.[0];
    const aiScene = detailHtml.match(
      /data-service-art="ai"[\s\S]*?<\/svg>/,
    )?.[0];
    const systemsScene = detailHtml.match(
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
});
