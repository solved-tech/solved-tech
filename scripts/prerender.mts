import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createServer, createServerModuleRunner } from "vite";

const distDir = resolve(import.meta.dirname, "../dist");

const server = await createServer({
  appType: "custom",
  logLevel: "error",
  server: { middlewareMode: true, ws: false },
});

try {
  const runner = createServerModuleRunner(server.environments.ssr, { hmr: false });
  const render = await runner.import("/src/render.ts");
  const content = await runner.import("/src/content.ts");
  const romanian = await runner.import("/src/content-ro.ts");
  const head = await runner.import("/src/head.ts");
  const baseUrl = server.config.base;
  const { siteStatus } = content;

  const shells = new Map<string, string>();
  const readShell = (file: string): string => {
    const cached = shells.get(file);

    if (cached) {
      return cached;
    }

    const shell = readFileSync(resolve(distDir, file), "utf8");
    shells.set(file, shell);
    return shell;
  };

  const pages = [
    {
      file: "index.html",
      shell: "index.html",
      page: head.homePage,
      appHtml: render.renderHomepage(content.siteContent, content.contactConfig, baseUrl, "en"),
      extraHead: head.renderOrganizationJsonLd(siteStatus, content.siteContent, content.contactConfig, baseUrl),
    },
    {
      file: "privacy/index.html",
      shell: "privacy/index.html",
      page: head.privacyPage,
      appHtml: render.renderPrivacyPage(content.privacyContent, content.contactConfig, baseUrl, "en"),
      extraHead: "",
    },
    {
      file: "services/vorbio/index.html",
      shell: "services/vorbio/index.html",
      page: head.vorbioPage,
      appHtml: render.renderVorbioPage(content.vorbioProduct, content.contactConfig, baseUrl, "en"),
      extraHead: "",
    },
    ...content.servicePages.map((servicePage) => ({
      file: `services/${servicePage.slug}/index.html`,
      shell: `services/${servicePage.slug}/index.html`,
      page: head.servicePageMeta(servicePage),
      appHtml: render.renderServicePage(servicePage, content.siteContent, content.contactConfig, baseUrl, "en"),
      extraHead: "",
    })),
    {
      file: "ro/index.html",
      shell: "index.html",
      page: head.homePageRo,
      appHtml: render.renderHomepage(romanian.siteContentRo, content.contactConfig, baseUrl, "ro"),
      extraHead: head.renderOrganizationJsonLd(siteStatus, romanian.siteContentRo, content.contactConfig, baseUrl),
    },
    {
      file: "ro/privacy/index.html",
      shell: "privacy/index.html",
      page: head.privacyPageRo,
      appHtml: render.renderPrivacyPage(romanian.privacyContentRo, content.contactConfig, baseUrl, "ro"),
      extraHead: "",
    },
    {
      file: "ro/services/vorbio/index.html",
      shell: "services/vorbio/index.html",
      page: head.vorbioPageRo,
      appHtml: render.renderVorbioPage(romanian.vorbioProductRo, content.contactConfig, baseUrl, "ro"),
      extraHead: "",
    },
    ...romanian.servicePagesRo.map((servicePage) => ({
      file: `ro/services/${servicePage.slug}/index.html`,
      shell: `services/${servicePage.slug}/index.html`,
      page: head.localizedServiceMeta(servicePage, "ro"),
      appHtml: render.renderServicePage(servicePage, romanian.siteContentRo, content.contactConfig, baseUrl, "ro"),
      extraHead: "",
    })),
  ];

  for (const { file, shell, page, appHtml, extraHead } of pages) {
    const target = resolve(distDir, file);
    const headTags = [
      head.renderSecurityMeta(),
      head.renderLanguageLinks(page, siteStatus, baseUrl),
      head.renderHeadTags(page, siteStatus, baseUrl),
      extraHead,
    ]
      .filter(Boolean)
      .join("\n    ");

    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, head.injectPrerender({ shell: readShell(shell), appHtml, headTags, page, status: siteStatus }));
    console.log(`prerendered ${file}`);
  }

  const sitemap = head.renderSitemap(siteStatus, pages.map(({ page }) => page), baseUrl);

  if (sitemap && siteStatus.launched) {
    if (sitemap.includes("/samples/")) {
      throw new Error("Sample homepages must stay out of the sitemap.");
    }

    if (sitemap.includes("/social/")) {
      throw new Error("Instagram images must stay out of the sitemap.");
    }

    const sitemapUrl = new URL(`${baseUrl}sitemap.xml`, siteStatus.productionOrigin).toString();

    writeFileSync(resolve(distDir, "sitemap.xml"), sitemap);
    writeFileSync(resolve(distDir, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${sitemapUrl}\n`);
    console.log("wrote sitemap.xml and robots.txt");
  }
} finally {
  await server.close();
}
