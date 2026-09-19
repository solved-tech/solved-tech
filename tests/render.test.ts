import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contactConfig, privacyContent, servicePages, siteContent } from "../src/content";
import { renderHomepage, renderPrivacyPage, renderServicePage } from "../src/render";

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

  it("renders every service as an animated visual box", () => {
    expect(html.match(/class="service-box service-box--/g)).toHaveLength(6);
    siteContent.products.forEach(({ id, question }) => {
      const questionId = `service-${id}-question`;

      expect(html).toContain(`data-service-art="${id}"`);
      expect(html).toContain(
        `<article id="service-${id}" class="service-box service-box--${id}" aria-labelledby="${questionId}">`,
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
      html.matchAll(/<article[^>]*class="service-box[^"]*"[^>]*>/g),
      (match) => match[0],
    );

    expect(serviceArticles).toHaveLength(6);
    serviceArticles.forEach((openingTag) => {
      expect(openingTag).not.toContain("data-reveal");
    });
    expect(
      html.match(/class="service-box__artwork" data-reveal/g),
    ).toHaveLength(6);
  });

  it("renders the service order and capability lists", () => {
    expect(html.indexOf("Something broken?")).toBeLessThan(html.indexOf("Want to use AI?"));
    expect(html.match(/class="service-box__provides"/g)).toHaveLength(6);
    expect(html.match(/class="service-box__capability"/g)).toHaveLength(26);
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
    expect(html.match(/class="service-box__header"/g)).toHaveLength(6);
    expect(html.match(/class="service-box__body"/g)).toHaveLength(6);
    expect(
      html.match(/class="service-box__cta" href="#contact"/g),
    ).toHaveLength(6);
    expect(
      html.match(
        /<div class="service-box__body">\s*<span class="service-box__artwork" data-reveal>[\s\S]*?<div class="service-box__provides">/g,
      ),
    ).toHaveLength(6);
    expect(html).not.toContain('class="service-box__link"');
  });

  it("gives every service contact link a distinct accessible name", () => {
    siteContent.products.forEach(({ cta, title }) => {
      expect(html).toContain(`aria-label="${cta}: ${title}"`);
    });
    expect(html).toContain('href="#contact" aria-label="Discuss a software issue: Bug fixes and improvements to existing software"');
  });

  it("keeps the two section labels on a single semantic line", () => {
    expect(html).toContain(
      '<h2 id="services-heading" data-reveal>What do you need?</h2>',
    );
    expect(html).toContain("<p>How we work</p>");
  });

  it("reveals each service artwork when the diagram reaches the viewport", () => {
    expect(
      html.match(/class="service-box__artwork" data-reveal/g),
    ).toHaveLength(6);
  });

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
    expect(html).toContain('<div class="service-grid">');
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

  it("offers a need selector that deep-links into every service", () => {
    const selector = html.match(/<nav class="need-selector"[\s\S]*?<\/nav>/)?.[0];

    expect(selector).toBeDefined();
    expect(html.indexOf('id="services-heading"')).toBeLessThan(html.indexOf('class="need-selector"'));
    expect(html.indexOf('class="need-selector"')).toBeLessThan(html.indexOf('class="service-grid"'));
    expect(selector).toContain('aria-label="Choose your need"');
    expect(selector!.match(/class="need-link"/g)).toHaveLength(6);
    siteContent.products.forEach(({ id }) => expect(selector).toContain(`href="#service-${id}"`));
    expect(selector).toContain('href="#service-fix"');
    expect(selector).toContain('href="#service-app"');
    expect(selector).toContain('href="#service-other"');
    expect(selector).toContain("<strong>Fix a system</strong>");
    expect(selector).toContain("<strong>Build a product</strong>");
    expect(selector).toContain("<strong>Automate a process</strong>");
    ["fix", "ai", "customers", "website", "app", "other"].forEach((id) =>
      expect(html).toContain(`<article id="service-${id}"`),
    );
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
    expect(html.match(/data-analytics="service_interest"/g)).toHaveLength(12);
    siteContent.products.forEach(({ id }) =>
      expect(html).toContain(`data-service-id="${id}" data-placement="service-box"`),
    );
    ["fix", "app", "other"].forEach((id) =>
      expect(html).toContain(`data-service-id="${id}" data-placement="need-selector"`),
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
    expect(html).toContain('Our own project');
    expect(html).toContain('href="https://github.com/solved-tech/solved-tech"');
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

  it("renders one page per service with its own heading, lists and contact block", () => {
    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toContain(`<h1 id="service-heading">${bugFixing.title}</h1>`);
    expect(html).toContain(`<p class="prose__lead">${bugFixing.intro}</p>`);
    expect(html).toContain("<h2>Typical requests</h2>");
    expect(html).toContain("<h2>What you receive</h2>");
    bugFixing.requests.forEach((request) => expect(html).toContain(`<li>${request}</li>`));
    bugFixing.deliverables.forEach((item) => expect(html).toContain(`<li>${item}</li>`));
    expect(html).toContain('<a href="/solved-tech/#approach">See how we work</a>');
    expect(html).toContain('<h2 id="service-contact-heading">Tell us what is happening</h2>');
    expect(html.match(/<a class="contact-action /g)).toHaveLength(3);
    expect(html).toContain('<a class="wordmark" href="/solved-tech/#top"');
    expect(html).not.toContain("data-reveal");
  });

  it("links every service page from its service box on the homepage", () => {
    const home = renderHomepage(siteContent, contactConfig, "/solved-tech/");

    servicePages.forEach(({ slug, productId, title }) => {
      const box = home.match(
        new RegExp(`<article id="service-${productId}" class="service-box[^"]*"[\\s\\S]*?</article>`),
      )?.[0];

      expect(box).toContain(
        `<a class="service-box__more" href="/solved-tech/services/${slug}/">Read about ${title.toLowerCase()}</a>`,
      );
    });
    expect(home.match(/class="service-box__more"/g)).toHaveLength(3);
  });

  it("gives each service page distinct content", () => {
    const pages = servicePages.map((page) =>
      renderServicePage(page, siteContent, contactConfig, "/").match(/<article[\s\S]*<\/article>/)?.[0],
    );

    expect(new Set(pages).size).toBe(3);
  });
});
