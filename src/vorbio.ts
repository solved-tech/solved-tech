/// <reference types="vite/client" />

import { contactConfig, vorbioProduct } from "./content";
import { vorbioProductRo } from "./content-ro";
import { mount, setupHeaderOffset, setupLanguageSwitcher, setupMobileMenu, setupScrollProgress } from "./enhance";
import { vorbioPage, vorbioPageRo } from "./head";
import { applyDocumentLocale, currentLocale, redirectForLocale } from "./locale-client";
import { renderVorbioPage } from "./render";
import "./styles.css";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Cannot render the Vorbio page: #app mount element is missing.");
}

if (!redirectForLocale(window)) {
  const locale = currentLocale(window);
  const meta = locale === "ro" ? vorbioPageRo : vorbioPage;
  const product = locale === "ro" ? vorbioProductRo : vorbioProduct;

  applyDocumentLocale(window, locale, meta.title, meta.description);
  mount(app, () => renderVorbioPage(product, contactConfig, import.meta.env.BASE_URL, locale));
  setupHeaderOffset(window);
  setupMobileMenu(app);
  setupLanguageSwitcher(app, window);
  setupScrollProgress(window);
}
