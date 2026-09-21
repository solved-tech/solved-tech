import { describe, expect, it } from "vitest";
import { contactConfig, privacyContent, servicePages, siteContent, siteStatus } from "../src/content";

describe("site content", () => {
  it("uses the approved commercial service order with AI assistants first", () => {
    expect(siteContent.products.map(({ id }) => id)).toEqual([
      "ai",
      "app",
      "customers",
      "website",
      "fix",
      "other",
    ]);
    expect(siteContent.products.map(({ question }) => question)).toEqual([
      "Want to use AI?",
      "Need an app?",
      "Need more customers?",
      "Need a website?",
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
      "AI Assistants and Integrations",
      "Web, mobile & desktop apps",
      "SEO & paid campaigns",
      "Websites & online shops",
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

  it("keeps every contact channel derived from one phone number", () => {
    expect(contactConfig.phone).toBe(contactConfig.displayPhone.replace(/\s+/g, ""));
    expect(contactConfig.phone).toMatch(/^\+44\d{10}$/);
    expect(contactConfig.whatsapp).toBe(contactConfig.phone.slice(1));
    expect(contactConfig.email).toMatch(/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i);
  });

  it("refuses to launch with trial contact details", () => {
    const trial = ["+442000000000"];
    const isTrial =
      trial.includes(contactConfig.phone) || trial.includes(contactConfig.email);

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
      "Can you work on software built by another team?",
      "What do you need to investigate an issue?",
      "How do you estimate the work and agree the scope?",
      "What happens after delivery?",
    ]);

    const unfilled = siteContent.faq.filter(({ answer }) => /\[\[[A-Z_]+\]\]/.test(answer));

    expect(unfilled).toEqual([]);
  });

  it("names the production origin only once launched", () => {
    if (siteStatus.launched) {
      expect(siteStatus.productionOrigin).toMatch(/^https:\/\/[a-z0-9.-]+$/);
    } else {
      expect("productionOrigin" in siteStatus).toBe(false);
    }
  });

  it("defines one distinct service page per product in card order", () => {
    expect(servicePages.map(({ slug, productId }) => [slug, productId])).toEqual([
      ["bug-fixing", "fix"],
      ["ai-assistants", "ai"],
      ["seo-paid-campaigns", "customers"],
      ["websites-online-shops", "website"],
      ["software-development", "app"],
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
      title: "Websites and online shops built to convert",
      description:
        "Fast, clear business websites and online shops designed around the actions customers need to take.",
    });
  });

  it("refuses to launch with unapproved service copy", () => {
    if (siteStatus.launched) {
      expect(servicePages.every(({ approved }) => approved)).toBe(true);
    }
  });
});
