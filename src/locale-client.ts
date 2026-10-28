import type { Locale } from "./locale";
import { detectLocale, isSearchBot, LOCALE_STORAGE_KEY, localeFromPath, localeRedirectPath, parseStoredLocale } from "./locale";
import { uiCopy } from "./ui-copy";

const readStoredLocale = (view: Window): Locale | null => {
  try {
    return parseStoredLocale(view.localStorage.getItem(LOCALE_STORAGE_KEY));
  } catch {
    return null;
  }
};

export const rememberLocale = (view: Window, locale: Locale): void => {
  try {
    view.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Private mode and locked-down browsers can refuse storage. The link still navigates.
  }
};

export const redirectForLocale = (view: Window): boolean => {
  const languages = view.navigator.languages?.length
    ? view.navigator.languages
    : [view.navigator.language].filter((language) => language);
  let timeZone = "";

  try {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    timeZone = "";
  }

  const target = localeRedirectPath({
    pathname: view.location.pathname,
    search: view.location.search,
    hash: view.location.hash,
    stored: readStoredLocale(view),
    detected: detectLocale(languages, timeZone),
    isBot: isSearchBot(view.navigator.userAgent, view.navigator.webdriver),
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
