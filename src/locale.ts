export type Locale = "en" | "ro";

export const LOCALE_STORAGE_KEY = "solved-tech-locale";

const SEARCH_BOT =
  /googlebot|adsbot-google|mediapartners-google|storebot-google|google-inspectiontool|googleother|bingbot|duckduckbot|baiduspider|yandexbot|slurp|facebookexternalhit|linkedinbot|twitterbot|applebot|petalbot|semrushbot|ahrefsbot|dotbot|sogou|exabot|ia_archiver|wget|curl\/|phantomjs|lighthouse|chrome-lighthouse|embedly|slackbot|telegrambot|whatsapp|discordbot|redditbot|gptbot|claudebot|amazonbot|bytespider/i;

export const clearStoredLocale = (storage: Pick<Storage, "removeItem">): void => {
  storage.removeItem(LOCALE_STORAGE_KEY);
};

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

/** Romanian only for a device set to Europe/Bucharest. Browser language is not a signal. */
export const detectLocale = (timeZone: string): Locale =>
  timeZone === "Europe/Bucharest" ? "ro" : "en";

export const isSearchBot = (userAgent: string, webdriver: boolean): boolean =>
  webdriver || SEARCH_BOT.test(userAgent);

export interface LocaleRedirectInput {
  pathname: string;
  search: string;
  hash: string;
  detected: Locale;
  isBot: boolean;
}

/**
 * Client-side locale choice for static hosting.
 *
 * Europe/Bucharest selects Romanian. Every other timezone gets English.
 * Browser language is not used. A choice saved by the removed switcher is
 * cleared and ignored. Search bots are never redirected, so both URL sets
 * stay crawlable. A redirect happens only when the current URL's language
 * differs from the detected one, so the two versions cannot loop.
 */
export const localeRedirectPath = ({
  pathname,
  search,
  hash,
  detected,
  isBot,
}: LocaleRedirectInput): string | null => {
  if (isBot) {
    return null;
  }

  const current = localeFromPath(pathname);

  if (detected === current) {
    return null;
  }

  const target = localizePath(pathname, detected);

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
