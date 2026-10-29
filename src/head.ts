import type { ContactConfig, ServicePage, SiteContent, SiteStatus } from "./content";
import { romanianMeta } from "./content-ro";
import type { Locale } from "./locale";
import { localizePath } from "./locale";
import { escapeHtml, publicAssetUrl } from "./render";

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  indexable: boolean;
  locale: Locale;
}

export const homePage: PageMeta = {
  path: "/",
  title: "Solved Tech — Simple websites for small businesses",
  description:
    "Solved Tech builds simple websites for small businesses. Fixed price, no jargon, and a quote before we start.",
  indexable: true,
  locale: "en",
};

export const privacyPage: PageMeta = {
  path: "/privacy/",
  title: "Privacy notice — Solved Tech",
  description: "How Solved Tech handles the personal data you send when you contact us.",
  indexable: false,
  locale: "en",
};

export const vorbioPage: PageMeta = {
  path: "/services/vorbio/",
  title: "Vorbio — AI voice and WhatsApp assistant — Solved Tech",
  description:
    "Vorbio is a Solved Tech AI assistant that answers WhatsApp voice calls and chats for your business, captures what the customer needs and hands the rest to your team.",
  indexable: false,
  locale: "en",
};

export const homePageRo: PageMeta = {
  path: "/ro/",
  title: romanianMeta.home.title,
  description: romanianMeta.home.description,
  indexable: true,
  locale: "ro",
};

export const privacyPageRo: PageMeta = {
  path: "/ro/privacy/",
  title: romanianMeta.privacy.title,
  description: romanianMeta.privacy.description,
  indexable: false,
  locale: "ro",
};

export const vorbioPageRo: PageMeta = {
  path: "/ro/services/vorbio/",
  title: romanianMeta.vorbio.title,
  description: romanianMeta.vorbio.description,
  indexable: false,
  locale: "ro",
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

  const ogLocale = page.locale === "ro" ? "ro_RO" : "en_GB";
  const ogAlternate = page.locale === "ro" ? "en_GB" : "ro_RO";

  return [
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="Solved Tech" />',
    `<meta property="og:locale" content="${ogLocale}" />`,
    `<meta property="og:locale:alternate" content="${ogAlternate}" />`,
    `<meta property="og:title" content="${escapeHtml(page.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(page.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
  ].join("\n    ");
};

export const renderLanguageLinks = (
  page: PageMeta,
  status: SiteStatus,
  baseUrl: string,
): string => {
  if (!status.launched) {
    return "";
  }

  const english = absoluteUrl(status.productionOrigin, localizePath(page.path, "en"), baseUrl);
  const romanian = absoluteUrl(status.productionOrigin, localizePath(page.path, "ro"), baseUrl);

  return [
    `<link rel="alternate" hreflang="en-GB" href="${escapeHtml(english)}" />`,
    `<link rel="alternate" hreflang="ro" href="${escapeHtml(romanian)}" />`,
    `<link rel="alternate" hreflang="x-default" href="${escapeHtml(english)}" />`,
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
    "@type": "ProfessionalService",
    name: "Solved Tech",
    url: absoluteUrl(status.productionOrigin, "/", baseUrl),
    logo: absoluteUrl(status.productionOrigin, "/brand/st-mark.png", baseUrl),
    email: config.email,
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
const CHARSET = '<meta charset="UTF-8" />';
const NOINDEX = /^[ \t]*<meta name="robots" content="noindex" \/>\r?\n/m;

export const injectPrerender = ({ shell, appHtml, headTags, page, status }: PrerenderInput): string => {
  if (!shell.includes(MOUNT)) {
    throw new Error(`Cannot prerender "${page.path}": the shell has no ${MOUNT} mount.`);
  }

  const lang = page.locale === "ro" ? "ro" : "en-GB";
  let html = shell
    .replace(/<html lang="[^"]*">/, `<html lang="${lang}">`)
    .replace(MOUNT, `<div id="app">${appHtml}</div>`)
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(page.title)}</title>`)
    .replace(
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${escapeHtml(page.description)}" />`,
    );

  if (page.locale === "ro") {
    html = html.replace(
      '<a class="skip-link" href="#main-content">Skip to content</a>',
      '<a class="skip-link" href="#main-content">Sari la conținut</a>',
    );
  }

  if (status.launched && page.indexable) {
    html = html.replace(NOINDEX, "");

    if (/name="robots"/.test(html)) {
      throw new Error(`Cannot prerender "${page.path}": noindex is still present after launch.`);
    }
  }

  if (headTags) {
    if (!html.includes(CHARSET)) {
      throw new Error(`Cannot prerender "${page.path}": the shell has no ${CHARSET} element.`);
    }

    html = html.replace(CHARSET, () => `${CHARSET}\n    ${headTags}`);
  }

  return html;
};

export const localizedServiceMeta = (page: ServicePage, locale: Locale): PageMeta => ({
  path: localizePath(`/services/${page.slug}/`, locale),
  title: `${page.title} — Solved Tech`,
  description: page.description,
  indexable: page.approved,
  locale,
});

export const servicePageMeta = (page: ServicePage): PageMeta => localizedServiceMeta(page, "en");

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

const CONTENT_SECURITY_POLICY = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self'",
  "font-src 'self'",
  "connect-src 'self' https://www.cloudflare.com",
  "base-uri 'self'",
  "form-action 'none'",
  "object-src 'none'",
].join("; ");

export const renderSecurityMeta = (): string =>
  [
    `<meta http-equiv="Content-Security-Policy" content="${CONTENT_SECURITY_POLICY}" />`,
    '<meta name="referrer" content="strict-origin-when-cross-origin" />',
  ].join("\n    ");
