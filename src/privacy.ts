/// <reference types="vite/client" />

import { contactConfig, privacyContent } from "./content";
import { setupHeaderOffset, setupMobileMenu, setupScrollProgress } from "./enhance";
import { renderPrivacyPage } from "./render";
import "./styles.css";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Cannot render the privacy page: #app mount element is missing.");
}

app.innerHTML = renderPrivacyPage(privacyContent, contactConfig);
setupHeaderOffset(window);
setupMobileMenu(app);
setupScrollProgress(window);
