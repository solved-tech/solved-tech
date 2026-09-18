import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { homePage } from "../src/head";

const indexHtml = readFileSync(
  new URL("../index.html", import.meta.url),
  "utf8",
);

const privacyHtml = readFileSync(
  new URL("../privacy/index.html", import.meta.url),
  "utf8",
);

describe("document shell", () => {
  it("keeps the GitHub Pages preview out of search indexes", () => {
    expect(indexHtml).toContain('<meta name="robots" content="noindex" />');
  });

  it("uses the descriptive title and description owned by head.ts", () => {
    expect(indexHtml).toContain(`<title>${homePage.title}</title>`);
    expect(indexHtml).toContain(`<meta name="description" content="${homePage.description}" />`);
  });

  it("declares language, viewport and description once", () => {
    expect(indexHtml).toContain('<html lang="en-GB">');
    expect(indexHtml.match(/<meta name="viewport"/g)).toHaveLength(1);
    expect(indexHtml.match(/<meta name="description"/g)).toHaveLength(1);
  });
});

describe("privacy document shell", () => {
  it("mirrors the homepage shell for the privacy page", () => {
    expect(privacyHtml).toContain('<html lang="en-GB">');
    expect(privacyHtml).toContain("<title>Privacy notice — Solved Tech</title>");
    expect(privacyHtml).toContain('<meta name="robots" content="noindex" />');
    expect(privacyHtml).toContain('<script type="module" src="/src/privacy.ts"></script>');
    expect(privacyHtml).toContain('<a class="skip-link" href="#main-content">Skip to content</a>');
  });
});
