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

  it("lists four concrete capabilities for every product", () => {
    expect(siteContent.products.every(({ provides }) => provides.length === 4))
      .toBe(true);
    expect(siteContent.products.flatMap(({ provides }) => provides)).toContain(
      "Technical SEO",
    );
    expect(siteContent.products.flatMap(({ provides }) => provides)).toContain(
      "MCP integrations",
    );
  });

  it("uses explicit one-click trial contact placeholders", () => {
    expect(contactConfig).toEqual({
      displayPhone: "+44 20 0000 0000",
      phone: "+442000000000",
      whatsapp: "442000000000",
      placeholder: true,
    });
  });

  it("defines two clearly marked founder placeholders", () => {
    expect(siteContent.founders).toHaveLength(2);
    expect(siteContent.founders.every(({ placeholder }) => placeholder)).toBe(
      true,
    );
    expect(siteContent.founders.map(({ name }) => name)).toEqual([
      "Founder One",
      "Founder Two",
    ]);
  });

  it("keeps visible product copy free from unexplained jargon", () => {
    const productCopy = siteContent.products
      .flatMap(({ question, answer }) => [question, answer])
      .join(" ");

    expect(productCopy).not.toMatch(/\b(?:SaaS|APIs?|agentic|MCP|SEO)\b/i);
  });
});
