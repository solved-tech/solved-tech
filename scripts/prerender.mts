import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
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
  const head = await runner.import("/src/head.ts");
  const baseUrl = server.config.base;
  const { siteStatus } = content;

  const pages = [
    {
      file: "index.html",
      page: head.homePage,
      appHtml: render.renderHomepage(content.siteContent, content.contactConfig, baseUrl),
      extraHead: head.renderOrganizationJsonLd(siteStatus, content.siteContent, content.contactConfig, baseUrl),
    },
    {
      file: "privacy/index.html",
      page: head.privacyPage,
      appHtml: render.renderPrivacyPage(content.privacyContent, content.contactConfig, baseUrl),
      extraHead: "",
    },
    ...content.servicePages.map((servicePage) => ({
      file: `services/${servicePage.slug}/index.html`,
      page: head.servicePageMeta(servicePage),
      appHtml: render.renderServicePage(servicePage, content.siteContent, content.contactConfig, baseUrl),
      extraHead: "",
    })),
  ];

  for (const { file, page, appHtml, extraHead } of pages) {
    const target = resolve(distDir, file);
    const shell = readFileSync(target, "utf8");
  const headTags = [head.renderSecurityMeta(), head.renderHeadTags(page, siteStatus, baseUrl), extraHead]
    .filter(Boolean)
    .join("\n    ");

    writeFileSync(target, head.injectPrerender({ shell, appHtml, headTags, page, status: siteStatus }));
    console.log(`prerendered ${file}`);
  }

  const sitemap = head.renderSitemap(siteStatus, pages.map(({ page }) => page), baseUrl);

  if (sitemap) {
    const sitemapUrl = new URL(`${baseUrl}sitemap.xml`, siteStatus.productionOrigin).toString();

    writeFileSync(resolve(distDir, "sitemap.xml"), sitemap);
    writeFileSync(resolve(distDir, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${sitemapUrl}\n`);
    console.log("wrote sitemap.xml and robots.txt");
  }
} finally {
  await server.close();
}
