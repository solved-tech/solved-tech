import { describe, expect, it } from "vitest";
import { contactConfig, siteContent } from "../src/content";

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

  it("uses explicit one-click trial contact placeholders", () => {
    expect(contactConfig).toEqual({
      displayPhone: "+44 20 0000 0000",
      phone: "+442000000000",
      whatsapp: "442000000000",
      placeholder: true,
    });
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
