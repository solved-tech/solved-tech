/// <reference types="vite/client" />

import { contactConfig, siteContent } from "./content";
import { renderHomepage } from "./render";
import "./styles.css";

export const CONTACT_PREVIEW_MESSAGE =
  "Contact destinations are not configured yet, so this control cannot start a call, a chat or a quote. The real details will appear here as soon as they are live.";

const REVEAL_GROUPS = [
  ".hero > *",
  ".problem > *",
  ".services > h2",
  ".service",
  ".approach > h2",
  ".approach li",
  ".trust > *",
  ".contact > h2",
  ".contact > p",
  ".contact li",
];

const markRevealTargets = (root: ParentNode): void => {
  REVEAL_GROUPS.forEach((selector) => {
    root.querySelectorAll<HTMLElement>(selector).forEach((element, index) => {
      element.dataset.reveal = "";
      element.style.setProperty("--reveal-index", String(index));
    });
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

  markRevealTargets(app);
  setupRevealMotion(app, prefersReducedMotion(view));
  setupContactPreview(app);
  setupScrollProgress(view);
};

if (typeof window !== "undefined") {
  start(window);
}
