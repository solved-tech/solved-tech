import { clearStoredLocale, detectLocale, isSearchBot, localeFromPath, localeRedirectPath } from "./locale";
import type { Locale } from "./locale";
import { uiCopy } from "./ui-copy";

const forgetStoredLocale = (view: Window): void => {
  try {
    clearStoredLocale(view.localStorage);
  } catch {
    // Private mode can refuse storage. Detection still runs without a saved choice.
  }
};

export const redirectForLocale = (view: Window): boolean => {
  forgetStoredLocale(view);

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
    detected: detectLocale(timeZone),
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
