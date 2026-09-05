import { describe, expect, it } from "vitest";
import { contactConfig, siteContent } from "../src/content";
import { renderHomepage } from "../src/render";

describe("homepage renderer", () => {
  const html = renderHomepage(siteContent, contactConfig);

  it("renders one main heading and every service", () => {
    expect(html.match(/<h1/g)).toHaveLength(1);
    siteContent.services.forEach(({ title }) => expect(html).toContain(title));
  });

  it("keeps the hero concise and clearly aimed at UK businesses", () => {
    expect(html).toContain(
      '<div class="hero__signal" aria-hidden="true">',
    );
    expect(html).toContain(
      '<p class="hero__eyebrow" data-reveal>Practical digital partner for UK businesses</p>',
    );
    expect(html).toContain("Solve what is slowing your business down.");
    expect(html).toContain(
      "From finding more customers to removing repetitive work, we build what makes the next difference.",
    );
  });

  it("renders semantic navigation and contact landmarks", () => {
    expect(html).toContain("<nav");
    expect(html).toContain('<main id="main-content">');
    expect(html).toContain('<section class="contact');
  });

  it("renders one assistive-technology-hidden background grid", () => {
    expect(html.match(/class="ambient-grid"/g)).toHaveLength(1);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('id="ambient-grid-pattern"');
    expect(html).toContain('class="ambient-grid__accent"');
  });

  it("renders a subtle decorative code field across representative stacks", () => {
    expect(html.match(/class="code-field"/g)).toHaveLength(1);
    expect(html).toContain('class="code-field" aria-hidden="true"');
    ["typescript", "python", "go", "swift", "sql", "shell"].forEach(
      (language) => expect(html).toContain(`data-language="${language}"`),
    );
  });

  it("marks every element the enhancement layer reveals", () => {
    const expected =
      4 + 2 + 1 + siteContent.services.length + 4 + 2 + 2 +
      siteContent.contactMethods.length;

    expect(html.match(/ data-reveal(?=[ >])/g)).toHaveLength(expected);
    expect(html).toContain('<h1 id="hero-heading" data-reveal>');
    expect(html).toContain('<article class="service" data-reveal>');
    expect(html).toContain("<li data-reveal>");
    expect(html).toContain('data-contact-preview="call" data-reveal>');
  });

  it("does not emit fabricated contact links in preview mode", () => {
    expect(html).not.toContain("tel:");
    expect(html).not.toContain("wa.me");
    expect(html).not.toContain("mailto:");
    expect(html).toContain("Contact details are being connected");
  });
});
