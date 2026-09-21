/// <reference types="vite/client" />

import { contactConfig, siteContent } from "./content";
import {
  mount,
  prefersReducedMotion,
  settlePrerenderedReveals,
  setupHeaderOffset,
  setupHeroProcessMotion,
  setupMobileMenu,
  setupMotionToggle,
  setupRevealMotion,
  setupScrollProgress,
  stagger,
} from "./enhance";
import { renderHomepage } from "./render";
import "./styles.css";

const start = (view: Window): void => {
  const app = view.document.querySelector<HTMLDivElement>("#app");

  if (!app) {
    throw new Error(
      "Cannot render the homepage: #app mount element is missing.",
    );
  }

  const prerendered = mount(app, () => renderHomepage(siteContent, contactConfig));

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
  setupMotionToggle(app, view);
  setupScrollProgress(view);
};

if (typeof window !== "undefined") {
  start(window);
}
