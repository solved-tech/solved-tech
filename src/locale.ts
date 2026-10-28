export type Locale = "en" | "ro";

export const LOCALE_STORAGE_KEY = "solved-tech-locale";

const SEARCH_BOT =
  /googlebot|adsbot-google|mediapartners-google|storebot-google|google-inspectiontool|googleother|bingbot|duckduckbot|baiduspider|yandexbot|slurp|facebookexternalhit|linkedinbot|twitterbot|applebot|petalbot|semrushbot|ahrefsbot|dotbot|sogou|exabot|ia_archiver|wget|curl\/|phantomjs|lighthouse|chrome-lighthouse|embedly|slackbot|telegrambot|whatsapp|discordbot|redditbot|gptbot|claudebot|amazonbot|bytespider/i;

export const parseStoredLocale = (value: string | null): Locale | null =>
  value === "en" || value === "ro" ? value : null;

export const localeFromPath = (path: string): Locale => {
  const pathname = path.split(/[?#]/)[0] ?? "/";
  return pathname === "/ro" || pathname.startsWith("/ro/") ? "ro" : "en";
};

export const stripLocalePrefix = (path: string): string => {
  const pathname = path.split(/[?#]/)[0] || "/";

  if (pathname === "/ro" || pathname === "/ro/") {
    return "/";
  }

  if (pathname.startsWith("/ro/")) {
    return pathname.slice(3);
  }

  return pathname;
};

export const localizePath = (path: string, locale: Locale): string => {
  const bare = stripLocalePrefix(path);
  const withSlash = bare.endsWith("/") ? bare : `${bare}/`;
  const normalized = withSlash.startsWith("/") ? withSlash : `/${withSlash}`;

  if (locale === "en") {
    return normalized;
  }

  return normalized === "/" ? "/ro/" : `/ro${normalized}`;
};

export const detectLocale = (languages: readonly string[], timeZone: string): Locale => {
  const romanianLanguage = languages.some((language) => language.toLowerCase().split("-")[0] === "ro");

  if (romanianLanguage || timeZone === "Europe/Bucharest") {
    return "ro";
  }

  return "en";
};

export const isSearchBot = (userAgent: string, webdriver: boolean): boolean =>
  webdriver || SEARCH_BOT.test(userAgent);

export interface LocaleRedirectInput {
  pathname: string;
  search: string;
  hash: string;
  stored: Locale | null;
  detected: Locale;
  isBot: boolean;
}

/**
 * Client-side locale choice for static hosting.
 *
 * Browser language (`ro`) and the Europe/Bucharest timezone are both treated
 * as Romania. A saved EN/RO choice overrides that. Search bots are never
 * redirected. Automatic detection only moves an English URL to its Romanian
 * counterpart, so /ro/ never bounces back and the two versions cannot loop.
 * An explicit saved choice may move either way, because the visitor asked for it.
 */
export const localeRedirectPath = ({
  pathname,
  search,
  hash,
  stored,
  detected,
  isBot,
}: LocaleRedirectInput): string | null => {
  if (isBot) {
    return null;
  }

  const current = localeFromPath(pathname);
  const desired = stored ?? detected;

  if (desired === current) {
    return null;
  }

  if (!stored && !(current === "en" && desired === "ro")) {
    return null;
  }

  const target = localizePath(pathname, desired);

  if (target === localizePath(pathname, current)) {
    return null;
  }

  return `${target}${search}${hash}`;
};

/** Dev-server rewrite so /ro/... serves the matching English shell without changing the URL. */
export const rewriteRomanianDevPath = (pathname: string): string | null => {
  if (pathname === "/ro" || pathname === "/ro/") {
    return "/index.html";
  }

  if (pathname === "/ro/privacy" || pathname === "/ro/privacy/") {
    return "/privacy/index.html";
  }

  const service = pathname.match(/^\/ro\/services\/([^/]+)\/?$/);

  if (!service || service[1] === "websites-online-shops") {
    return null;
  }

  return `/services/${service[1]}/index.html`;
};
