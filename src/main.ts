/// <reference types="vite/client" />

import { contactConfig, siteContent } from "./content";
import {
  prefersReducedMotion,
  setupHeaderOffset,
  setupHeroInteraction,
  setupMobileMenu,
  setupMotionToggle,
  setupPipelineMotion,
  setupRevealMotion,
  setupScrollProgress,
  stagger,
} from "./enhance";
import { renderHomepage } from "./render";
import "./styles.css";

export {
  setupHeaderOffset,
  setupHeroInteraction,
  setupMobileMenu,
  setupMotionToggle,
  setupPipelineMotion,
  setupRevealMotion,
  setupScrollProgress,
} from "./enhance";

const start = (view: Window): void => {
  const app = view.document.querySelector<HTMLDivElement>("#app");

  if (!app) {
    throw new Error(
      "Cannot render the homepage: #app mount element is missing.",
    );
  }

  view.document.documentElement.classList.add("has-enhancement");
  app.innerHTML = renderHomepage(siteContent, contactConfig);

  const reducedMotion = prefersReducedMotion(view);

  stagger(app);
  setupHeaderOffset(view);
  setupRevealMotion(app, reducedMotion);
  setupPipelineMotion(app, reducedMotion);
  const finePointer = view.matchMedia("(pointer: fine)").matches;
  setupHeroInteraction(app, reducedMotion, finePointer);
  setupMobileMenu(app);
  setupMotionToggle(app, view);
  setupScrollProgress(view);
};

if (typeof window !== "undefined") {
  start(window);
}
