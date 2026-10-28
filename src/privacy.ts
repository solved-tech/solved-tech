/// <reference types="vite/client" />

import { contactConfig, privacyContent } from "./content";
import { privacyContentRo } from "./content-ro";
import { mount, setupHeaderOffset, setupLanguageSwitcher, setupMobileMenu, setupScrollProgress } from "./enhance";
import { privacyPage, privacyPageRo } from "./head";
import { applyDocumentLocale, currentLocale, redirectForLocale } from "./locale-client";
import { renderPrivacyPage } from "./render";
import "./styles.css";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Cannot render the privacy page: #app mount element is missing.");
}

if (!redirectForLocale(window)) {
  const locale = currentLocale(window);
  const meta = locale === "ro" ? privacyPageRo : privacyPage;
  const content = locale === "ro" ? privacyContentRo : privacyContent;

  applyDocumentLocale(window, locale, meta.title, meta.description);
  mount(app, () => renderPrivacyPage(content, contactConfig, import.meta.env.BASE_URL, locale));
  setupHeaderOffset(window);
  setupMobileMenu(app);
  setupLanguageSwitcher(app, window);
  setupScrollProgress(window);
}
