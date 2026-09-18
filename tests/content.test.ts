import { describe, expect, it } from "vitest";
import { contactConfig, privacyContent, servicePages, siteContent, siteStatus } from "../src/content";

describe("site content", () => {
  it("uses the approved commercial service order with bug fixing first", () => {
    expect(siteContent.products.map(({ id }) => id)).toEqual([
      "fix",
      "ai",
      "customers",
      "website",
      "app",
      "other",
    ]);
    expect(siteContent.products.map(({ question }) => question)).toEqual([
      "Something broken?",
      "Want to use AI?",
      "Need more customers?",
      "Need a website?",
      "Need an app?",
      "Need to automate a process?",
    ]);
  });

  it("lists concrete capabilities and a CTA for every product", () => {
    expect(siteContent.products.map(({ provides }) => provides.length)).toEqual(
      [5, 5, 4, 4, 4, 4],
    );
    expect(siteContent.products.every(({ cta }) => cta.length > 0)).toBe(true);
    expect(siteContent.products.flatMap(({ provides }) => provides)).toContain(
      "Technical SEO",
    );
  });

  it("describes bug fixing, AI and automation in business language", () => {
    const fix = siteContent.products.find(({ id }) => id === "fix");
    const ai = siteContent.products.find(({ id }) => id === "ai");
    const other = siteContent.products.find(({ id }) => id === "other");

    expect(fix).toEqual({
      id: "fix",
      question: "Something broken?",
      title: "Bug fixes and improvements to existing software",
      answer:
        "We investigate the problem, reproduce it where possible, agree the fix and test it.",
      provides: [
        "Bug diagnosis and fixes",
        "Failed integrations",
        "Software built by another team",
        "Regression testing",
        "Documented handover",
      ],
      cta: "Discuss a software issue",
    });
    expect(ai?.provides).toEqual([
      "AI assistants",
      "Agentic workflows",
      "WhatsApp & voice agents",
      "AI connected to your tools (MCP)",
      "AI that reads and updates your systems",
    ]);
    expect(other).toMatchObject({
      title: "Business automation and integrations",
      answer: "Reduce repetitive work and connect the tools your team relies on.",
      provides: [
        "Business automation",
        "Connected systems",
        "Data moving between your tools",
        "Bespoke solutions",
      ],
      cta: "Talk to us",
    });
    expect(siteContent.products.flatMap(({ provides }) => provides)).not.toContain(
      "Custom MCPs",
    );
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
      .flatMap(({ question, answer }) => [question, answer])
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

  it("defines three distinct service pages mapped to fix, app and other", () => {
    expect(servicePages.map(({ slug, productId }) => [slug, productId])).toEqual([
      ["bug-fixing", "fix"],
      ["software-development", "app"],
      ["automation", "other"],
    ]);
    expect(new Set(servicePages.map(({ title }) => title)).size).toBe(3);
    expect(new Set(servicePages.map(({ intro }) => intro)).size).toBe(3);
    expect(new Set(servicePages.map(({ description }) => description)).size).toBe(3);
    servicePages.forEach((page) => {
      expect(page.requests.length).toBeGreaterThanOrEqual(3);
      expect(page.deliverables.length).toBeGreaterThanOrEqual(3);
      expect(siteContent.products.map(({ id }) => id)).toContain(page.productId);
    });
  });

  it("refuses to launch with unapproved service copy", () => {
    if (siteStatus.launched) {
      expect(servicePages.every(({ approved }) => approved)).toBe(true);
    }
  });
});
