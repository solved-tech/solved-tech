import {
  cachedCountryValue,
  COUNTRY_CACHE_KEY,
  detectLocale,
  isSearchBot,
  localeFromPath,
  localeRedirectPath,
  lookupCountry,
  parseCachedCountry,
  readStoredLocale,
} from "./locale";
import type { CachedCountry, Locale } from "./locale";
import { uiCopy } from "./ui-copy";

const readManualLocale = (view: Window): Locale | null => {
  try {
    return readStoredLocale(view.localStorage);
  } catch {
    return null;
  }
};

const readCachedCountry = (view: Window): CachedCountry | null => {
  try {
    return parseCachedCountry(view.sessionStorage.getItem(COUNTRY_CACHE_KEY));
  } catch {
    return null;
  }
};

const rememberCountry = (view: Window, country: CachedCountry): void => {
  try {
    view.sessionStorage.setItem(COUNTRY_CACHE_KEY, country);
  } catch {
    // The decision still applies to this page. The next page asks again.
  }
};

export const redirectForLocale = async (
  view: Window,
  lookup: () => Promise<string | null> = () => lookupCountry(fetch),
): Promise<boolean> => {
  if (isSearchBot(view.navigator.userAgent, view.navigator.webdriver)) {
    return false;
  }

  if (readManualLocale(view)) {
    return false;
  }

  const cached = readCachedCountry(view);
  const country = cached ?? cachedCountryValue(await lookup());

  if (!cached) {
    rememberCountry(view, country);
  }

  const target = localeRedirectPath({
    pathname: view.location.pathname,
    search: view.location.search,
    hash: view.location.hash,
    detected: detectLocale(country === "RO" ? "RO" : null),
    isBot: false,
    manual: false,
  });

  if (!target || target === `${view.location.pathname}${view.location.search}${view.location.hash}`) {
    return false;
  }

  view.location.replace(target);
  return true;
};

export const applyDocumentLocale = (
  view: Window,
  locale: Locale,
  title: string,
  description: string,
): void => {
  const copy = uiCopy(locale);

  view.document.documentElement.lang = copy.htmlLang;
  view.document.title = title;

  const meta = view.document.querySelector('meta[name="description"]');

  if (meta) {
    meta.setAttribute("content", description);
  }

  const skip = view.document.querySelector(".skip-link");

  if (skip) {
    skip.textContent = copy.skipToContent;
  }
};

export const currentLocale = (view: Window): Locale => localeFromPath(view.location.pathname);
