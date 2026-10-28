export type Locale = "en" | "ro";

export const LOCALE_STORAGE_KEY = "solved-tech-locale";

const SEARCH_BOT =
  /googlebot|adsbot-google|mediapartners-google|storebot-google|google-inspectiontool|googleother|bingbot|duckduckbot|baiduspider|yandexbot|slurp|facebookexternalhit|linkedinbot|twitterbot|applebot|petalbot|semrushbot|ahrefsbot|dotbot|sogou|exabot|ia_archiver|wget|curl\/|phantomjs|lighthouse|chrome-lighthouse|embedly|slackbot|telegrambot|whatsapp|discordbot|redditbot|gptbot|claudebot|amazonbot|bytespider/i;

export const parseStoredLocale = (value: string | null): Locale | null =>
  value === "en" || value === "ro" ? value : null;

export const readStoredLocale = (storage: Pick<Storage, "getItem">): Locale | null =>
  parseStoredLocale(storage.getItem(LOCALE_STORAGE_KEY));

export const rememberLocale = (storage: Pick<Storage, "setItem">, locale: Locale): void => {
  storage.setItem(LOCALE_STORAGE_KEY, locale);
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

export const COUNTRY_LOOKUP_URL = "https://www.cloudflare.com/cdn-cgi/trace";
export const COUNTRY_LOOKUP_TIMEOUT_MS = 1200;
export const COUNTRY_CACHE_KEY = "solved-tech-country";

export type CachedCountry = "RO" | "OTHER";

/** Romanian only when the visitor's IP country is Romania. Anything else, including a failed lookup, is English. */
export const detectLocale = (country: string | null): Locale => (country === "RO" ? "ro" : "en");

/** Read `loc=` from a Cloudflare trace body and ignore every other field, including the IP address. */
export const countryFromTrace = (body: string): string | null => {
  const match = /^loc=([A-Za-z]{2})$/m.exec(body);

  return match ? match[1].toUpperCase() : null;
};

export const parseCachedCountry = (value: string | null): CachedCountry | null =>
  value === "RO" || value === "OTHER" ? value : null;

export const cachedCountryValue = (country: string | null): CachedCountry =>
  country === "RO" ? "RO" : "OTHER";

/**
 * Ask Cloudflare which country the connection comes from.
 * Credentials are omitted so the browser does not store Cloudflare's cookie,
 * and a slow or failed response becomes "unknown" rather than waiting.
 */
export const lookupCountry = async (
  fetchImpl: typeof fetch,
  timeoutMs = COUNTRY_LOOKUP_TIMEOUT_MS,
): Promise<string | null> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(COUNTRY_LOOKUP_URL, {
      signal: controller.signal,
      credentials: "omit",
      cache: "no-store",
      referrerPolicy: "no-referrer",
    });

    if (!response.ok) {
      return null;
    }

    return countryFromTrace(await response.text());
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
};

export const isSearchBot = (userAgent: string, webdriver: boolean): boolean =>
  webdriver || SEARCH_BOT.test(userAgent);

export interface LocaleRedirectInput {
  pathname: string;
  search: string;
  hash: string;
  detected: Locale;
  isBot: boolean;
  /** A language chosen from the menu. It suppresses IP redirects. */
  manual?: boolean;
}

/**
 * Client-side locale choice for static hosting.
 *
 * Romania (IP country RO) selects Romanian. Every other country, and a lookup
 * that times out or fails, gets English. Browser language and timezone are
 * not used. A language chosen from the menu is remembered and is not
 * overridden by a later IP lookup. The country result is remembered for the
 * browser tab so a later page cannot bounce. Search bots are never redirected,
 * so both URL sets stay crawlable. A redirect happens only when the current
 * URL's language differs from the detected one, so the two versions cannot loop.
 */
export const localeRedirectPath = ({
  pathname,
  search,
  hash,
  detected,
  isBot,
  manual = false,
}: LocaleRedirectInput): string | null => {
  if (isBot || manual) {
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
