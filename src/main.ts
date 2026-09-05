/// <reference types="vite/client" />

import { contactConfig, siteContent } from "./content";
import { renderHomepage } from "./render";
import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Cannot render the homepage: #app mount element is missing.");
}

app.innerHTML = renderHomepage(siteContent, contactConfig);
