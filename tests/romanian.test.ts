import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contactConfig, privacyContent, servicePages, siteContent, vorbioProduct } from "../src/content";
import { privacyContentRo, servicePagesRo, siteContentRo, vorbioProductRo } from "../src/content-ro";
import {
  homePage,
  homePageRo,
  injectPrerender,
  privacyPageRo,
  renderHeadTags,
  renderLanguageLinks,
  renderOrganizationJsonLd,
  localizedServiceMeta,
  renderSitemap,
  servicePageMeta,
} from "../src/head";
import { renderHomepage, renderPrivacyPage, renderServicePage, renderVorbioPage } from "../src/render";
import { uiCopy } from "../src/ui-copy";

const shell = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const live = { launched: true, productionOrigin: "https://solvedtech.co.uk" } as const;

describe("Romanian homepage", () => {
  const html = renderHomepage(siteContentRo, contactConfig, "/", "ro");

  it("translates the page and keeps names, brand and links", () => {
    expect(html).toContain("Soluții tehnice pentru orice afacere.");
    expect(html).toContain("Cereți o ofertă gratuită");
    expect(html).toContain("Razvan Cristofor · Cofondator");
    expect(html).toContain("Remus Baciu · Cofondator");
    expect(html).toContain('href="https://www.linkedin.com/in/razvan-cristofor-7ba16b105/"');
    expect(html).toContain('href="https://linkedin.com/in/remus-baciu-4a11a7105"');
    expect(html).toContain("LinkedIn");
    expect(html).toContain("construiesc site-uri");
    expect(html).toContain("sunt Senior Software Engineer");
    expect(html).not.toMatch(/\b(he|she) is\b/i);
    expect(html).not.toContain("Tech solutions for any business.");
  });

  it("points the visible switcher at both language versions and marks Romanian current", () => {
    expect(html).toContain('class="language-switcher"');
    expect(html).toContain('aria-label="Limbă"');
    expect(html).toContain('href="/" lang="en-GB" hreflang="en-GB" data-locale-switch="en"');
    expect(html).toContain('href="/ro/" lang="ro" hreflang="ro" data-locale-switch="ro" aria-current="page"');
    expect(html).toContain(">EN</a>");
    expect(html).toContain(">RO</a>");
  });

  it("keeps service, privacy and section links inside the Romanian site", () => {
    servicePagesRo.forEach(({ slug }) => {
      expect(html).toContain(`href="/ro/services/${slug}/"`);
    });
    expect(html).toContain('href="/ro/privacy/"');
    expect(html).toContain('href="#packages">Site-uri</a>');
    expect(html).not.toContain("websites-online-shops");
    expect(html).not.toContain('href="/services/');
    expect(html).not.toContain('href="/privacy/"');
  });
});

describe("Romanian interior pages", () => {
  it("translates privacy, a service page and Vorbio without dropping the switcher", () => {
    const privacy = renderPrivacyPage(privacyContentRo, contactConfig, "/", "ro");
    const service = renderServicePage(servicePagesRo[0], siteContentRo, contactConfig, "/", "ro");
    const vorbio = renderVorbioPage(vorbioProductRo, contactConfig, "/", "ro");

    expect(privacy).toContain("Notă de confidențialitate");
    expect(privacy).toContain("Solved Tech Limited");
    expect(privacy).not.toMatch(/Wembley|England|Londra|London/);
    expect(privacy).toContain("ico.org.uk");
    expect(privacy).toContain('href="/privacy/" lang="en-GB"');
    expect(privacy).toContain('href="/ro/privacy/" lang="ro" hreflang="ro" data-locale-switch="ro" aria-current="page"');

    expect(service).toContain(servicePagesRo[0].title);
    expect(service).toContain("Cereri tipice");
    expect(service).toContain('href="/ro/#services"');
    expect(service).toContain(`href="/ro/services/${servicePagesRo[0].slug}/"`);

    expect(vorbio).toContain("Recepția dumneavoastră AI pentru voce și chat pe WhatsApp.");
    expect(vorbio).toContain("Pot programa o vizită joi?");
    expect(vorbio).toContain("Vorbio");
    expect(vorbio).toContain("WhatsApp");
  });
});

describe("Romanian content parity", () => {
  it("mirrors the English structure, founders and approved service slugs", () => {
    expect(siteContentRo.products.map(({ id }) => id)).toEqual(siteContent.products.map(({ id }) => id));
    expect(siteContentRo.packages.map(({ id }) => id)).toEqual(siteContent.packages.map(({ id }) => id));
    expect(siteContentRo.founders.map(({ name, linkedin, image }) => ({ name, linkedin, image }))).toEqual(
      siteContent.founders.map(({ name, linkedin, image }) => ({ name, linkedin, image })),
    );
    expect(siteContentRo.faq).toHaveLength(siteContent.faq.length);
    expect(servicePagesRo.map(({ slug, productId, approved }) => ({ slug, productId, approved }))).toEqual(
      servicePages.map(({ slug, productId, approved }) => ({ slug, productId, approved })),
    );
    expect(vorbioProductRo.name).toBe("Vorbio");
    expect(vorbioProductRo.highlights).toHaveLength(6);
  });
});

describe("language metadata", () => {
  it("advertises both language URLs and a canonical for the page itself", () => {
    const english = renderLanguageLinks(homePage, live, "/");
    const romanian = renderLanguageLinks(homePageRo, live, "/");
    const romanianHead = renderHeadTags(homePageRo, live, "/");

    expect(english).toContain('<link rel="alternate" hreflang="en-GB" href="https://solvedtech.co.uk/" />');
    expect(english).toContain('<link rel="alternate" hreflang="ro" href="https://solvedtech.co.uk/ro/" />');
    expect(english).toContain('<link rel="alternate" hreflang="x-default" href="https://solvedtech.co.uk/" />');
    expect(romanian).toBe(english);
    expect(romanianHead).toContain('<link rel="canonical" href="https://solvedtech.co.uk/ro/" />');
    expect(romanianHead).toContain('<meta property="og:locale" content="ro_RO" />');
    expect(romanianHead).toContain('<meta property="og:locale:alternate" content="en_GB" />');
  });

  it("sets html lang and the Romanian skip link when prerendering", () => {
    const html = injectPrerender({
      shell,
      appHtml: "<h1>Salut</h1>",
      headTags: "",
      page: homePageRo,
      status: { launched: false },
    });

    expect(html).toContain('<html lang="ro">');
    expect(html).toContain("Sari la conținut");
    expect(html).toContain(`<title>${homePageRo.title}</title>`);
  });

  it("lists both language versions of indexable pages in the sitemap", () => {
    const pages = [
      homePage,
      homePageRo,
      privacyPageRo,
      ...servicePages.map((page) => servicePageMeta(page)),
      ...servicePagesRo.map((page) => localizedServiceMeta(page, "ro")),
    ];
    const sitemap = renderSitemap(live, pages, "/");

    expect(sitemap).toContain("<loc>https://solvedtech.co.uk/</loc>");
    expect(sitemap).toContain("<loc>https://solvedtech.co.uk/ro/</loc>");
    servicePages.forEach(({ slug }) => {
      expect(sitemap).toContain(`<loc>https://solvedtech.co.uk/services/${slug}/</loc>`);
      expect(sitemap).toContain(`<loc>https://solvedtech.co.uk/ro/services/${slug}/</loc>`);
    });
    expect(sitemap).not.toContain("/privacy/");
    expect(sitemap).not.toContain("websites-online-shops");
    expect(sitemap.match(/<loc>/g)).toHaveLength(12);
  });
});

const PLACE_NAME =
  /\b(?:London|Londra|Wembley|Glendale|England|Britain|British|Bucharest|București|Romania|România|United Kingdom)\b|\bUK\b|\bHA9\b/i;

describe("location-neutral copy", () => {
  it("names no city, region or country in either language", () => {
    const published = [
      renderHomepage(siteContent, contactConfig, "/", "en"),
      renderHomepage(siteContentRo, contactConfig, "/", "ro"),
      renderPrivacyPage(privacyContent, contactConfig, "/", "en"),
      renderPrivacyPage(privacyContentRo, contactConfig, "/", "ro"),
      ...servicePages.map((page) => renderServicePage(page, siteContent, contactConfig, "/", "en")),
      ...servicePagesRo.map((page) => renderServicePage(page, siteContentRo, contactConfig, "/", "ro")),
      renderVorbioPage(vorbioProduct, contactConfig, "/", "en"),
      renderVorbioPage(vorbioProductRo, contactConfig, "/", "ro"),
      renderOrganizationJsonLd(live, siteContent, contactConfig, "/"),
      renderHeadTags(homePage, live, "/"),
      renderHeadTags(homePageRo, live, "/"),
      JSON.stringify(uiCopy("en")),
      JSON.stringify(uiCopy("ro")),
    ]
      .join("\n")
      .replaceAll("solvedtech.co.uk", "")
      .replaceAll("ico.org.uk", "");

    expect(published).not.toMatch(PLACE_NAME);
  });
});
