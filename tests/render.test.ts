import { describe, expect, it } from "vitest";
import { contactConfig, siteContent } from "../src/content";
import { renderHomepage } from "../src/render";

describe("homepage renderer", () => {
  const html = renderHomepage(siteContent, contactConfig);

  it("renders one main heading and every service", () => {
    expect(html.match(/<h1/g)).toHaveLength(1);
    siteContent.services.forEach(({ title }) => expect(html).toContain(title));
  });

  it("renders semantic navigation and contact landmarks", () => {
    expect(html).toContain("<nav");
    expect(html).toContain('<main id="main-content">');
    expect(html).toContain('<section class="contact');
  });

  it("does not emit fabricated contact links in preview mode", () => {
    expect(html).not.toContain("tel:");
    expect(html).not.toContain("wa.me");
    expect(html).not.toContain("mailto:");
    expect(html).toContain("Contact details are being connected");
  });
});
