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
  ];

  for (const { file, page, appHtml, extraHead } of pages) {
    const target = resolve(distDir, file);
    const shell = readFileSync(target, "utf8");
    const headTags = [head.renderHeadTags(page, siteStatus, baseUrl), extraHead]
      .filter(Boolean)
      .join("\n    ");

    writeFileSync(target, head.injectPrerender({ shell, appHtml, headTags, page, status: siteStatus }));
    console.log(`prerendered ${file}`);
  }
} finally {
  await server.close();
}
