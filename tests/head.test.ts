import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contactConfig, servicePages, siteContent } from "../src/content";
import {
  homePage,
  injectPrerender,
  privacyPage,
  renderHeadTags,
  renderOrganizationJsonLd,
  renderSitemap,
  servicePageMeta,
} from "../src/head";

const shell = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const preview = { launched: false } as const;
const live = { launched: true, productionOrigin: "https://example.test" } as const;

describe("head metadata", () => {
  it("adds nothing to the shell before launch", () => {
    expect(renderHeadTags(homePage, preview, "/solved-tech/")).toBe("");
    expect(renderOrganizationJsonLd(preview, siteContent, contactConfig, "/solved-tech/")).toBe("");
  });

  it("emits canonical, Open Graph and Twitter tags for indexable pages after launch", () => {
    const tags = renderHeadTags(homePage, live, "/solved-tech/");

    expect(tags).toContain('<link rel="canonical" href="https://example.test/solved-tech/" />');
    expect(tags).toContain('<meta property="og:type" content="website" />');
    expect(tags).toContain('<meta property="og:site_name" content="Solved Tech" />');
    expect(tags).toContain(`<meta property="og:title" content="${homePage.title}" />`);
    expect(tags).toContain(`<meta property="og:description" content="${homePage.description}" />`);
    expect(tags).toContain('<meta property="og:url" content="https://example.test/solved-tech/" />');
    expect(tags).toContain(
      '<meta property="og:image" content="https://example.test/solved-tech/brand/solved-tech-social.png" />',
    );
    expect(tags).toContain('<meta name="twitter:card" content="summary_large_image" />');
  });

  it("keeps non-indexable pages out of the index after launch", () => {
    expect(privacyPage.indexable).toBe(false);
    expect(renderHeadTags(privacyPage, live, "/solved-tech/")).toBe("");
  });

  it("describes the organisation with visible facts only", () => {
    const script = renderOrganizationJsonLd(live, siteContent, contactConfig, "/solved-tech/");
    const json = script.replace(/^<script type="application\/ld\+json">/, "").replace(/<\/script>$/, "");
    const data = JSON.parse(json);

    expect(data).toEqual({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Solved Tech",
      url: "https://example.test/solved-tech/",
      logo: "https://example.test/solved-tech/brand/solved-tech-logo-dark.svg",
      email: contactConfig.email,
      telephone: contactConfig.phone,
      founder: siteContent.founders.map(({ name, linkedin }) => ({
        "@type": "Person",
        name,
        sameAs: linkedin,
      })),
    });
    expect(script).not.toMatch(/aggregateRating|review|award|address/);
  });

  it("escapes closing tags inside JSON-LD", () => {
    const script = renderOrganizationJsonLd(
      live,
      { ...siteContent, founders: [{ ...siteContent.founders[0], name: "</script><b>" }] },
      contactConfig,
      "/",
    );

    expect(script).not.toContain("</script><b>");
    expect(script).toContain("\\u003c/script>\\u003cb>");
  });
});

describe("prerender injection", () => {
  it("fills the mount, syncs title and description, and keeps noindex before launch", () => {
    const html = injectPrerender({
      shell,
      appHtml: "<h1>Rendered</h1>",
      headTags: "",
      page: homePage,
      status: preview,
    });

    expect(html).toContain('<div id="app"><h1>Rendered</h1></div>');
    expect(html).toContain(`<title>${homePage.title}</title>`);
    expect(html).toContain(`<meta name="description" content="${homePage.description}" />`);
    expect(html).toContain('<meta name="robots" content="noindex" />');
  });

  it("strips noindex and injects tags for indexable pages after launch", () => {
    const html = injectPrerender({
      shell,
      appHtml: "<h1>Rendered</h1>",
      headTags: '<link rel="canonical" href="https://example.test/" />',
      page: homePage,
      status: live,
    });

    expect(html).not.toContain('name="robots"');
    expect(html).toContain('<link rel="canonical" href="https://example.test/" />\n  </head>');
  });

  it("refuses a shell without the mount", () => {
    expect(() =>
      injectPrerender({
        shell: "<html><head></head><body></body></html>",
        appHtml: "",
        headTags: "",
        page: homePage,
        status: preview,
      }),
    ).toThrow('Cannot prerender "/": the shell has no <div id="app"></div> mount.');
  });
});

describe("service page metadata", () => {
  it("indexes a service page only once its copy is approved", () => {
    const [draft] = servicePages;

    expect(servicePageMeta({ ...draft, approved: false }).indexable).toBe(false);
    expect(servicePageMeta({ ...draft, approved: true })).toEqual({
      path: `/services/${draft.slug}/`,
      title: `${draft.title} — Solved Tech`,
      description: draft.description,
      indexable: true,
    });
  });

  it("lists indexable pages in the sitemap after launch", () => {
    const pages = [homePage, privacyPage, servicePageMeta({ ...servicePages[0], approved: true })];

    expect(renderSitemap(preview, pages, "/solved-tech/")).toBe("");
    expect(renderSitemap(live, pages, "/solved-tech/")).toBe(
      [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        "  <url><loc>https://example.test/solved-tech/</loc></url>",
        `  <url><loc>https://example.test/solved-tech/services/${servicePages[0].slug}/</loc></url>`,
        "</urlset>",
        "",
      ].join("\n"),
    );
  });
});
