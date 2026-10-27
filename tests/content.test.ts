import { describe, expect, it } from "vitest";
import { aboutRemus, contactConfig, privacyContent, servicePages, siteContent, siteStatus } from "../src/content";

describe("site content", () => {
  it("leads with websites and keeps the other services secondary", () => {
    expect(siteContent.products.map(({ id }) => id)).toEqual([
      "website",
      "customers",
      "app",
      "ai",
      "fix",
      "other",
    ]);
    expect(siteContent.products.map(({ question }) => question)).toEqual([
      "Need a simple website?",
      "Need more customers?",
      "Need an app?",
      "Want to use AI?",
      "Something broken?",
      "Need to automate a process?",
    ]);
  });

  it("gives every product one outcome sentence and no tags", () => {
    siteContent.products.forEach((product) => {
      expect(product.outcome.trim()).not.toBe("");
      expect(product.outcome.trim().split(/(?<=\.)\s+/)).toHaveLength(1);
      expect(Object.prototype.hasOwnProperty.call(product, "tags")).toBe(false);
    });
  });

  it("uses the approved short homepage titles in order", () => {
    expect(siteContent.products.map(({ title }) => title)).toEqual([
      "Websites for small businesses",
      "SEO & paid campaigns",
      "Web, mobile & desktop apps",
      "AI Assistants and Integrations",
      "Bug fixes & improvements",
      "Automation & integrations",
    ]);
  });

  it("describes bug fixing, AI and automation in business language", () => {
    const fix = siteContent.products.find(({ id }) => id === "fix");
    const ai = siteContent.products.find(({ id }) => id === "ai");
    const other = siteContent.products.find(({ id }) => id === "other");

    expect(fix).toEqual({
      id: "fix",
      question: "Something broken?",
      title: "Bug fixes & improvements",
      outcome:
        "We investigate the problem, reproduce it where possible, agree the fix and test it.",
    });
    expect(ai?.outcome).toBe(
      "Take routine work, calls and messages off your team.",
    );
    expect(other).toMatchObject({
      title: "Automation & integrations",
      outcome:
        "Reduce repetitive work and connect the tools your team relies on.",
    });
    expect(JSON.stringify(siteContent.products)).not.toContain("Custom MCPs");
  });

  it("keeps email as the only public contact channel", () => {
    expect(contactConfig).toEqual({
      email: "contact@solvedtech.co.uk",
      placeholder: false,
    });
    expect(contactConfig.email).toMatch(/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i);
  });

  it("refuses to launch with trial contact details", () => {
    const trial = ["contact@example.com"];
    const isTrial = trial.includes(contactConfig.email);

    expect(contactConfig.placeholder).toBe(isTrial);
    if (siteStatus.launched) {
      expect(contactConfig.placeholder).toBe(false);
    }
  });

  it("defines the approved founders with Razvan first", () => {
    expect(siteContent.founders).toEqual([
      {
        name: "Razvan Cristofor",
        role: "Co-founder — Apps & SEO Expert",
        image: "/team/razvan_cristofor-520.webp",
        imageSources: [
          { path: "/team/razvan_cristofor-520.webp", width: 520 },
          { path: "/team/razvan_cristofor-1040.webp", width: 1040 },
        ],
        linkedin: "https://www.linkedin.com/in/razvan-cristofor-7ba16b105/",
      },
      {
        name: "Remus Baciu",
        role: "Co-founder — Senior Software Engineer",
        image: "/team/remus_baciu-340.webp",
        imageSources: [],
        linkedin: "https://www.linkedin.com/in/remus-baciu-4a11a7105/",
      },
    ]);
  });

  it("keeps visible product copy free from unexplained jargon", () => {
    const productCopy = siteContent.products
      .flatMap(({ question, outcome }) => [question, outcome])
      .join(" ");

    expect(productCopy).not.toMatch(/\b(?:SaaS|APIs?|agentic|MCP|SEO)\b/i);
  });

  it("describes Remus from the published LinkedIn facts only", () => {
    const copy = [aboutRemus.heading, ...aboutRemus.paragraphs].join(" ");

    expect(aboutRemus).toMatchObject({
      name: "Remus Baciu",
      linkedin: "https://linkedin.com/in/remus-baciu-4a11a7105",
    });
    expect(copy).toContain("founder of Solved Tech");
    expect(copy).toContain("based in London");
    expect(copy).toContain("Senior Software Engineer at Sky");
    expect(copy).toContain("more than 11 years");
    expect(copy).toContain("Sky apprentice in 2015");
    expect(copy).toContain("November 2023");
    expect(copy).toContain("Java, Python and Go");
    expect(copy).toContain("infrastructure and CI/CD");
    expect(copy).toContain("Academy Leader at Sky");
    expect(copy).toContain("set up a new delivery team");
    expect(copy).toContain("not an agency");
    expect(copy).not.toMatch(/\+44|wa\.me|tel:/);
  });

  it("covers the privacy topics the audit requires", () => {
    expect(privacyContent.sections.map(({ heading }) => heading)).toEqual([
      "Who we are",
      "What we collect and why",
      "Legal basis",
      "Who receives your data",
      "How long we keep it",
      "Your rights",
    ]);
    expect(privacyContent.sections.every(({ paragraphs }) => paragraphs.length > 0)).toBe(true);
  });

  it("refuses to launch with unfilled privacy placeholders", () => {
    const tokens = JSON.stringify(privacyContent).match(/\[\[[A-Z_]+\]\]/g) ?? [];

    expect(tokens).toEqual([]);
  });

  it("ships no case study until one is approved for publication", () => {
    siteContent.caseStudies.forEach((study) => {
      expect(study.id).toMatch(/^[a-z0-9-]+$/);
      expect(study.technologies.length).toBeGreaterThan(0);
      Object.values(study).forEach((value) =>
        expect(JSON.stringify(value)).not.toMatch(/\[\[[A-Z_]+\]\]/),
      );
    });
    if (!siteStatus.launched) {
      expect(siteContent.caseStudies).toEqual([]);
    }
  });

  it("asks the four audit questions and refuses to launch with unfilled answers", () => {
    expect(siteContent.faq.map(({ question }) => question)).toEqual([
      "How long does a website take?",
      "Can I edit the site myself?",
      "What do I need to provide?",
      "What about hosting and the domain?",
      "What happens after the site is live?",
    ]);
    siteContent.faq.forEach(({ answer }) => {
      expect(answer).not.toMatch(/\b\d+\b/);
    });

    const unfilled = siteContent.faq.filter(({ answer }) => /\[\[[A-Z_]+\]\]/.test(answer));

    expect(unfilled).toEqual([]);
  });

  it("names the production origin only once launched", () => {
    expect(siteStatus).toEqual({
      launched: true,
      productionOrigin: "https://solvedtech.co.uk",
    });
  });

  it("defines one distinct service page per product in card order", () => {
    expect(servicePages.map(({ slug, productId }) => [slug, productId])).toEqual([
      ["websites-online-shops", "website"],
      ["seo-paid-campaigns", "customers"],
      ["software-development", "app"],
      ["ai-assistants", "ai"],
      ["bug-fixing", "fix"],
      ["automation", "other"],
    ]);
    expect(new Set(servicePages.map(({ title }) => title)).size).toBe(6);
    expect(new Set(servicePages.map(({ intro }) => intro)).size).toBe(6);
    expect(new Set(servicePages.map(({ description }) => description)).size).toBe(6);
    servicePages.forEach((page) => {
      expect(page.requests.length).toBeGreaterThanOrEqual(3);
      expect(page.deliverables.length).toBeGreaterThanOrEqual(3);
      expect(siteContent.products.map(({ id }) => id)).toContain(page.productId);
    });
    siteContent.products.forEach(({ id }) => {
      expect(servicePages.filter((page) => page.productId === id)).toHaveLength(1);
    });
  });

  it("ships the approved AI, campaign and website copy", () => {
    const pageFor = (slug: string) => {
      const page = servicePages.find((candidate) => candidate.slug === slug);
      expect(page).toBeDefined();
      return page!;
    };

    expect(pageFor("ai-assistants")).toMatchObject({
      title: "AI assistants for everyday business work",
      description:
        "Practical AI assistants that handle routine messages, calls and admin while working with the tools your team already uses.",
      requests: [
        "Customer questions are taking too much of your team's time",
        "Calls or messages need a consistent first response",
        "Staff repeatedly copy information into a CRM, calendar or back-office tool",
        "You want to test where AI could save time without replacing a whole system",
      ],
    });
    expect(pageFor("seo-paid-campaigns")).toMatchObject({
      title: "SEO and paid campaigns that drive enquiries",
      description:
        "Technical SEO and paid search campaigns focused on qualified visits, measurable actions and useful reporting.",
    });
    expect(pageFor("websites-online-shops")).toMatchObject({
      title: "Simple websites for London small businesses",
      description:
        "Clear websites and small online shops for London businesses, with a fixed quote and plain-English handover.",
    });
  });

  it("refuses to launch with unapproved service copy", () => {
    if (siteStatus.launched) {
      expect(servicePages.every(({ approved }) => approved)).toBe(true);
    }
  });
});
