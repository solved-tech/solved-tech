import { describe, expect, it } from "vitest";
import { contactConfig, siteContent, siteStatus } from "../src/content";

describe("site content", () => {
  it("uses the approved commercial service order", () => {
    expect(siteContent.products.map(({ id }) => id)).toEqual([
      "ai",
      "customers",
      "website",
      "app",
      "other",
    ]);
    expect(siteContent.products.map(({ question }) => question)).toEqual([
      "Want to use AI?",
      "Need more customers?",
      "Need a website?",
      "Need an app?",
      "Need something else?",
    ]);
  });

  it("lists concrete capabilities for every product", () => {
    expect(siteContent.products.map(({ provides }) => provides.length)).toEqual(
      [5, 4, 4, 4, 4],
    );
    expect(siteContent.products.flatMap(({ provides }) => provides)).toContain(
      "Technical SEO",
    );
    expect(siteContent.products.flatMap(({ provides }) => provides)).toContain(
      "MCP integrations",
    );
  });

  it("keeps MCP work in AI and leaves service 05 broad", () => {
    const ai = siteContent.products.find(({ id }) => id === "ai");
    const other = siteContent.products.find(({ id }) => id === "other");

    expect(ai?.provides).toEqual([
      "AI assistants",
      "Agentic workflows",
      "WhatsApp & voice agents",
      "Custom MCPs",
      "MCP integrations",
    ]);
    expect(other).toMatchObject({
      title: "Whatever your business needs",
      answer: "If it does not fit a box, bring it anyway.",
      provides: [
        "Bespoke solutions",
        "Business automation",
        "Connected systems",
        "Unusual requests",
      ],
    });
    expect(other?.provides.some((item) => item.includes("MCP"))).toBe(false);
  });

  it("keeps every contact channel derived from one phone number", () => {
    expect(contactConfig.phone).toBe(contactConfig.displayPhone.replace(/\s+/g, ""));
    expect(contactConfig.phone).toMatch(/^\+44\d{10}$/);
    expect(contactConfig.whatsapp).toBe(contactConfig.phone.slice(1));
    expect(contactConfig.email).toMatch(/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i);
  });

  it("refuses to launch with trial contact details", () => {
    const trial = ["+442000000000", "contact@solvedtech.co.uk"];
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
        image: "/team/razvan_cristofor.png",
        linkedin: "https://www.linkedin.com/in/razvan-cristofor-7ba16b105/",
      },
      {
        name: "Remus Baciu",
        role: "Co-founder — Senior Software Engineer",
        image: "/team/remus_baciu.png",
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
});
