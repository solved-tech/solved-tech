import type { ContactConfig, ServicePage, SiteContent, SiteStatus } from "./content";
import { escapeHtml, publicAssetUrl } from "./render";

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  indexable: boolean;
}

export const homePage: PageMeta = {
  path: "/",
  title: "Solved Tech — Software development, bug fixes and automation",
  description:
    "Solved Tech builds new applications, fixes problems in existing software and connects the systems UK businesses rely on.",
  indexable: true,
};

export const privacyPage: PageMeta = {
  path: "/privacy/",
  title: "Privacy notice — Solved Tech",
  description: "How Solved Tech handles the personal data you send when you contact us.",
  indexable: false,
};

const absoluteUrl = (origin: string, path: string, baseUrl: string): string =>
  new URL(publicAssetUrl(path, baseUrl), origin).toString();

export const renderHeadTags = (
  page: PageMeta,
  status: SiteStatus,
  baseUrl: string,
): string => {
  if (!status.launched || !page.indexable) {
    return "";
  }

  const url = absoluteUrl(status.productionOrigin, page.path, baseUrl);
  const image = absoluteUrl(status.productionOrigin, "/brand/solved-tech-social.png", baseUrl);

  return [
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="Solved Tech" />',
    `<meta property="og:title" content="${escapeHtml(page.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(page.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
  ].join("\n    ");
};

export const renderOrganizationJsonLd = (
  status: SiteStatus,
  content: SiteContent,
  config: ContactConfig,
  baseUrl: string,
): string => {
  if (!status.launched) {
    return "";
  }

  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Solved Tech",
    url: absoluteUrl(status.productionOrigin, "/", baseUrl),
    logo: absoluteUrl(status.productionOrigin, "/brand/solved-tech-logo-dark.svg", baseUrl),
    email: config.email,
    telephone: config.phone,
    founder: content.founders.map(({ name, linkedin }) => ({
      "@type": "Person",
      name,
      sameAs: linkedin,
    })),
  };

  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
};

export interface PrerenderInput {
  shell: string;
  appHtml: string;
  headTags: string;
  page: PageMeta;
  status: SiteStatus;
}

const MOUNT = '<div id="app"></div>';
const NOINDEX = /^[ \t]*<meta name="robots" content="noindex" \/>\r?\n/m;

export const injectPrerender = ({ shell, appHtml, headTags, page, status }: PrerenderInput): string => {
  if (!shell.includes(MOUNT)) {
    throw new Error(`Cannot prerender "${page.path}": the shell has no ${MOUNT} mount.`);
  }

  let html = shell
    .replace(MOUNT, `<div id="app">${appHtml}</div>`)
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(page.title)}</title>`)
    .replace(
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${escapeHtml(page.description)}" />`,
    );

  if (status.launched && page.indexable) {
    html = html.replace(NOINDEX, "");
  }

  if (headTags) {
    html = html.replace("</head>", `  ${headTags}\n  </head>`);
  }

  return html;
};

export const servicePageMeta = (page: ServicePage): PageMeta => ({
  path: `/services/${page.slug}/`,
  title: `${page.title} — Solved Tech`,
  description: page.description,
  indexable: page.approved,
});

export const renderSitemap = (
  status: SiteStatus,
  pages: PageMeta[],
  baseUrl: string,
): string => {
  if (!status.launched) {
    return "";
  }

  const urls = pages
    .filter(({ indexable }) => indexable)
    .map(({ path }) => `  <url><loc>${escapeHtml(absoluteUrl(status.productionOrigin, path, baseUrl))}</loc></url>`);

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
};
