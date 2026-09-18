/// <reference types="vite/client" />

import { contactConfig, privacyContent } from "./content";
import { mount, setupHeaderOffset, setupMobileMenu, setupScrollProgress } from "./enhance";
import { renderPrivacyPage } from "./render";
import "./styles.css";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Cannot render the privacy page: #app mount element is missing.");
}

mount(app, () => renderPrivacyPage(privacyContent, contactConfig));
setupHeaderOffset(window);
setupMobileMenu(app);
setupScrollProgress(window);
