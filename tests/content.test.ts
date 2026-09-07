import { describe, expect, it } from "vitest";
import { contactConfig, siteContent } from "../src/content";

describe("site content", () => {
  it("leads with the five approved buying questions", () => {
    expect(siteContent.products.map(({ question }) => question)).toEqual([
      "Need a website?",
      "Need an app?",
      "Need more traffic?",
      "Want to use AI in your business?",
      "Need something else?",
    ]);
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
