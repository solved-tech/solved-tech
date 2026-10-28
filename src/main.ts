/// <reference types="vite/client" />

import { contactConfig, siteContent } from "./content";
import { siteContentRo } from "./content-ro";
import {
  mount,
  prefersReducedMotion,
  settlePrerenderedReveals,
  setupHeaderOffset,
  setupHeroProcessMotion,
  setupLanguageSwitcher,
  setupMobileMenu,
  setupMotionToggle,
  setupRevealMotion,
  setupScrollProgress,
  stagger,
} from "./enhance";
import { homePage, homePageRo } from "./head";
import { applyDocumentLocale, currentLocale, redirectForLocale } from "./locale-client";
import { renderHomepage } from "./render";
import "./styles.css";

const start = async (view: Window): Promise<void> => {
  if (await redirectForLocale(view)) {
    return;
  }

  const locale = currentLocale(view);
  const meta = locale === "ro" ? homePageRo : homePage;
  const content = locale === "ro" ? siteContentRo : siteContent;

  applyDocumentLocale(view, locale, meta.title, meta.description);

  const app = view.document.querySelector<HTMLDivElement>("#app");

  if (!app) {
    throw new Error(
      "Cannot render the homepage: #app mount element is missing.",
    );
  }

  const prerendered = mount(app, () => renderHomepage(content, contactConfig, import.meta.env.BASE_URL, locale));

  if (prerendered) {
    settlePrerenderedReveals(app, view);
  }

  view.document.documentElement.classList.add("has-enhancement");

  const reducedMotion = prefersReducedMotion(view);

  stagger(app);
  setupHeaderOffset(view);
  setupRevealMotion(app, reducedMotion);
  setupHeroProcessMotion(app, reducedMotion);
  setupMobileMenu(app);
  setupLanguageSwitcher(app, view);
  setupMotionToggle(app, view);
  setupScrollProgress(view);
};

if (typeof window !== "undefined") {
  void start(window);
}
