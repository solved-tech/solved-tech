import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const indexHtml = readFileSync(
  new URL("../index.html", import.meta.url),
  "utf8",
);

describe("document shell", () => {
  it("keeps the GitHub Pages preview out of search indexes", () => {
    expect(indexHtml).toContain('<meta name="robots" content="noindex" />');
  });

  it("declares language, viewport and description once", () => {
    expect(indexHtml).toContain('<html lang="en-GB">');
    expect(indexHtml.match(/<meta name="viewport"/g)).toHaveLength(1);
    expect(indexHtml.match(/<meta name="description"/g)).toHaveLength(1);
  });
});
