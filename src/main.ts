/// <reference types="vite/client" />

import { contactConfig, siteContent } from "./content";
import { renderHomepage } from "./render";
import "./styles.css";

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

export const setupHeroInteraction = (
  root: ParentNode,
  reducedMotion: boolean,
  finePointer = true,
): void => {
  const hero = root.querySelector<HTMLElement>(".hero");

  if (!hero || reducedMotion || !finePointer) {
    return;
  }

  const update = (event: PointerEvent): void => {
    const bounds = hero.getBoundingClientRect();

    if (bounds.width <= 0 || bounds.height <= 0) {
      return;
    }

    const x = Math.max(
      -0.5,
      Math.min(0.5, (event.clientX - bounds.left) / bounds.width - 0.5),
    );
    const y = Math.max(
      -0.5,
      Math.min(0.5, (event.clientY - bounds.top) / bounds.height - 0.5),
    );

    hero.style.setProperty("--hero-shift-x", `${(x * 36).toFixed(2)}px`);
    hero.style.setProperty("--hero-shift-y", `${(y * 36).toFixed(2)}px`);
  };

  const reset = (): void => {
    hero.style.setProperty("--hero-shift-x", "0px");
    hero.style.setProperty("--hero-shift-y", "0px");
  };

  hero.addEventListener("pointermove", update, { passive: true });
  hero.addEventListener("pointerdown", update, { passive: true });
  hero.addEventListener("pointerleave", reset);
};

export const setupMobileMenu = (root: ParentNode): void => {
  const button = root.querySelector<HTMLButtonElement>(".menu-toggle");
  const nav = root.querySelector<HTMLElement>("#primary-navigation");

  if (!button || !nav) {
    return;
  }

  const setOpen = (open: boolean): void => {
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
  };

  button.addEventListener("click", () => {
    setOpen(button.getAttribute("aria-expanded") !== "true");
  });

  nav.querySelectorAll<HTMLAnchorElement>("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
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

  const reducedMotion = prefersReducedMotion(view);

  stagger(app);
  setupHeaderOffset(view);
  setupRevealMotion(app, reducedMotion);
  const finePointer = view.matchMedia("(pointer: fine)").matches;
  setupHeroInteraction(app, reducedMotion, finePointer);
  setupMobileMenu(app);
  setupScrollProgress(view);
};

if (typeof window !== "undefined") {
  start(window);
}
