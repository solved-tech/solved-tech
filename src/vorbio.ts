/// <reference types="vite/client" />

import { contactConfig, vorbioProduct } from "./content";
import { mount, setupHeaderOffset, setupMobileMenu, setupScrollProgress } from "./enhance";
import { renderVorbioPage } from "./render";
import "./styles.css";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Cannot render the Vorbio page: #app mount element is missing.");
}

mount(app, () => renderVorbioPage(vorbioProduct, contactConfig));
setupHeaderOffset(window);
setupMobileMenu(app);
setupScrollProgress(window);
