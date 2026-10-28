/// <reference types="vite/client" />

import { contactConfig, servicePages, siteContent } from "./content";
import { servicePagesRo, siteContentRo } from "./content-ro";
import { mount, setupHeaderOffset, setupLanguageSwitcher, setupMobileMenu, setupScrollProgress } from "./enhance";
import { localizedServiceMeta } from "./head";
import { applyDocumentLocale, currentLocale, redirectForLocale } from "./locale-client";
import { renderServicePage } from "./render";
import "./styles.css";

const app = document.querySelector<HTMLDivElement>("#app");
const slug = document.body.dataset.service;

if (!app) {
  throw new Error("Cannot render the service page: #app mount element is missing.");
}

if (!redirectForLocale(window)) {
  const locale = currentLocale(window);
  const pages = locale === "ro" ? servicePagesRo : servicePages;
  const content = locale === "ro" ? siteContentRo : siteContent;
  const page = pages.find((candidate) => candidate.slug === slug);

  if (!page) {
    throw new Error(`Cannot render the service page: unknown service "${slug ?? ""}".`);
  }

  const meta = localizedServiceMeta(page, locale);

  applyDocumentLocale(window, locale, meta.title, meta.description);
  mount(app, () => renderServicePage(page, content, contactConfig, import.meta.env.BASE_URL, locale));
  setupHeaderOffset(window);
  setupMobileMenu(app);
  setupLanguageSwitcher(app, window);
  setupScrollProgress(window);
}
