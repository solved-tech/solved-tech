/// <reference types="vite/client" />

import { contactConfig, siteContent } from "./content";
import { renderHomepage } from "./render";
import "./styles.css";

export const CONTACT_PREVIEW_MESSAGE =
  "Contact destinations are not configured yet, so this control cannot start a call, a chat or a quote. The real details will appear here as soon as they are live.";

/**
 * Stagger each reveal target against its own siblings. The renderer owns which
 * elements carry `data-reveal`; nothing here depends on its class names.
 */
const stagger = (root: ParentNode): void => {
  const positions = new Map<ParentNode, number>();

  root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
    const group: ParentNode = element.parentElement ?? root;
    const position = positions.get(group) ?? 0;

    element.style.setProperty("--reveal-index", String(position));
    positions.set(group, position + 1);
  });
};

export const setupRevealMotion = (
  root: ParentNode,
  reducedMotion: boolean,
): void => {
  const targets = root.querySelectorAll<HTMLElement>("[data-reveal]");

  if (reducedMotion || typeof IntersectionObserver === "undefined") {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18 },
  );

  targets.forEach((target) => observer.observe(target));
};

export const setupContactPreview = (root: ParentNode): void => {
  root
    .querySelectorAll<HTMLButtonElement>("[data-contact-preview]")
    .forEach((button, index) => {
      const message = button.ownerDocument.createElement("p");

      message.className = "contact-preview-message";
      message.id = `contact-preview-${index + 1}`;
      message.textContent = CONTACT_PREVIEW_MESSAGE;
      message.hidden = true;

      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-controls", message.id);
      button.insertAdjacentElement("afterend", message);

      button.addEventListener("click", () => {
        const expanded = button.getAttribute("aria-expanded") === "true";

        button.setAttribute("aria-expanded", String(!expanded));
        message.hidden = expanded;
      });
    });
};

/**
 * Publish the measured header height so anchor scroll padding and the hero
 * height stay correct when the header wraps onto more rows.
 */
export const setupHeaderOffset = (view: Window): void => {
  const header = view.document.querySelector<HTMLElement>(".site-header");

  if (!header) {
    return;
  }

  const root = view.document.documentElement;

  const measure = (): void => {
    const { height } = header.getBoundingClientRect();

    if (height > 0) {
      root.style.setProperty("--header-height", `${Math.round(height)}px`);
    }
  };

  if (typeof ResizeObserver === "undefined") {
    view.addEventListener("resize", measure, { passive: true });
  } else {
    new ResizeObserver(measure).observe(header);
  }

  measure();
};

export const setupScrollProgress = (view: Window): void => {
  const root = view.document.documentElement;
  let queued = false;

  const update = (): void => {
    queued = false;
    const scrollable = root.scrollHeight - view.innerHeight;
    const progress = scrollable > 0 ? root.scrollTop / scrollable : 0;

    root.style.setProperty("--scroll-progress", progress.toFixed(4));
  };

  view.addEventListener(
    "scroll",
    () => {
      if (queued) {
        return;
      }

      queued = true;
      view.requestAnimationFrame(update);
    },
    { passive: true },
  );

  view.addEventListener("resize", update, { passive: true });
  update();
};

const prefersReducedMotion = (view: Window): boolean =>
  view.matchMedia("(prefers-reduced-motion: reduce)").matches;

const start = (view: Window): void => {
  const app = view.document.querySelector<HTMLDivElement>("#app");

  if (!app) {
    throw new Error(
      "Cannot render the homepage: #app mount element is missing.",
    );
  }

  view.document.documentElement.classList.add("has-enhancement");
  app.innerHTML = renderHomepage(siteContent, contactConfig);

  stagger(app);
  setupHeaderOffset(view);
  setupRevealMotion(app, prefersReducedMotion(view));
  setupContactPreview(app);
  setupScrollProgress(view);
};

if (typeof window !== "undefined") {
  start(window);
}
