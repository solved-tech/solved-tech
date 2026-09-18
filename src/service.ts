/// <reference types="vite/client" />

import { contactConfig, servicePages, siteContent } from "./content";
import { mount, setupHeaderOffset, setupMobileMenu, setupScrollProgress } from "./enhance";
import { renderServicePage } from "./render";
import "./styles.css";

const app = document.querySelector<HTMLDivElement>("#app");
const slug = document.body.dataset.service;
const page = servicePages.find((candidate) => candidate.slug === slug);

if (!app) {
  throw new Error("Cannot render the service page: #app mount element is missing.");
}

if (!page) {
  throw new Error(`Cannot render the service page: unknown service "${slug ?? ""}".`);
}

mount(app, () => renderServicePage(page, siteContent, contactConfig));
setupHeaderOffset(window);
setupMobileMenu(app);
setupScrollProgress(window);
