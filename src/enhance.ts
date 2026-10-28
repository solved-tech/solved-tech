import { rememberLocale } from "./locale";
import type { Locale } from "./locale";

export const mount = (app: HTMLElement, render: () => string): boolean => {
  if (app.firstElementChild) {
    return true;
  }

  app.innerHTML = render();
  return false;
};

export const settlePrerenderedReveals = (root: ParentNode, view: Window): void => {
  root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
    if (element.getBoundingClientRect().top < view.innerHeight) {
      element.classList.add("is-visible");
    }
  });
};

/**
 * Stagger each reveal target against its own siblings. The renderer owns which
 * elements carry `data-reveal`; nothing here depends on its class names.
 */
export const stagger = (root: ParentNode): void => {
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

export const setupHeroProcessMotion = (
  root: ParentNode,
  reducedMotion: boolean,
): void => {
  if (reducedMotion) {
    return;
  }

  const process = root.querySelector<HTMLElement>(".hero-process");

  if (!process) {
    return;
  }

  if (typeof IntersectionObserver === "undefined") {
    process.classList.add("is-process-visible");
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle(
        "is-process-visible",
        entry.isIntersecting,
      );
    });
  });

  observer.observe(process);
};

const labelled = (element: Element, name: string, fallback: string): string =>
  element.getAttribute(name) ?? fallback;

export const setupMobileMenu = (root: ParentNode): void => {
  const button = root.querySelector<HTMLButtonElement>(".menu-toggle");
  const nav = root.querySelector<HTMLElement>("#primary-navigation");

  if (!button || !nav) {
    return;
  }

  const setOpen = (open: boolean): void => {
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute(
      "aria-label",
      open ? labelled(button, "data-label-close", "Close menu") : labelled(button, "data-label-open", "Open menu"),
    );
    nav.classList.toggle("is-open", open);
  };

  button.addEventListener("click", () => {
    setOpen(button.getAttribute("aria-expanded") !== "true");
  });

  button.ownerDocument.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key !== "Escape") {
      return;
    }

    if (button.getAttribute("aria-expanded") !== "true") {
      return;
    }

    setOpen(false);
    button.focus();
  });

  nav.querySelectorAll<HTMLAnchorElement>("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });
};

const isLocale = (value: string | null): value is Locale => value === "en" || value === "ro";

export const setupLanguageSwitcher = (root: ParentNode, view: Window): void => {
  const widget = root.querySelector<HTMLElement>(".lang-switch");
  const button = widget?.querySelector<HTMLButtonElement>(".lang-switch__button");
  const menu = widget?.querySelector<HTMLElement>(".lang-switch__menu");

  if (!widget || !button || !menu) {
    return;
  }

  const options = [...menu.querySelectorAll<HTMLAnchorElement>("[data-locale-choice]")];

  const setOpen = (open: boolean): void => {
    button.setAttribute("aria-expanded", String(open));
    menu.hidden = !open;
  };

  const focusOption = (index: number): void => {
    options[(index + options.length) % options.length]?.focus();
  };

  button.addEventListener("click", () => {
    const open = button.getAttribute("aria-expanded") !== "true";

    if (open) {
      const navToggle = root.querySelector<HTMLButtonElement>(".menu-toggle");

      if (navToggle?.getAttribute("aria-expanded") === "true") {
        navToggle.click();
      }
    }

    setOpen(open);

    if (open) {
      const selected = options.findIndex((option) => option.getAttribute("aria-selected") === "true");

      focusOption(selected >= 0 ? selected : 0);
    }
  });

  root.querySelector<HTMLButtonElement>(".menu-toggle")?.addEventListener("click", () => {
    const navToggle = root.querySelector<HTMLButtonElement>(".menu-toggle");

    if (navToggle?.getAttribute("aria-expanded") === "true") {
      setOpen(false);
    }
  });

  options.forEach((option) => {
    option.addEventListener("click", (event) => {
      const value = option.getAttribute("data-locale-choice");

      if (isLocale(value)) {
        try {
          rememberLocale(view.localStorage, value);
        } catch {
          // The link still navigates. The next visit can ask for the country again.
        }
      }

      if (option.getAttribute("aria-current") === "page") {
        event.preventDefault();
        setOpen(false);
        button.focus();
      }
    });
  });

  view.document.addEventListener("keydown", (event) => {
    const open = button.getAttribute("aria-expanded") === "true";

    if (!open) {
      if (event.key === "ArrowDown" && view.document.activeElement === button) {
        event.preventDefault();
        setOpen(true);
        focusOption(0);
      }

      return;
    }

    const index = options.indexOf(view.document.activeElement as HTMLAnchorElement);

    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      button.focus();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusOption(index < 0 ? 0 : index + 1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      focusOption(index < 0 ? options.length - 1 : index - 1);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusOption(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      focusOption(options.length - 1);
    }
  });

  view.document.addEventListener("click", (event) => {
    if (event.target instanceof Node && !widget.contains(event.target)) {
      setOpen(false);
    }
  });
};

export const setupMotionToggle = (root: ParentNode, view: Window): void => {
  const button = root.querySelector<HTMLButtonElement>(
    ".hero-process__control",
  );

  if (!button) {
    return;
  }

  const query = view.matchMedia("(prefers-reduced-motion: reduce)");
  const html = view.document.documentElement;

  const setPaused = (paused: boolean): void => {
    html.classList.toggle("motion-paused", paused);
    button.setAttribute("aria-pressed", String(paused));
    button.setAttribute(
      "aria-label",
      paused
        ? labelled(button, "data-label-resume", "Resume diagram motion")
        : labelled(button, "data-label-pause", "Pause diagram motion"),
    );
  };

  const syncPreference = (): void => {
    if (query.matches) {
      setPaused(false);
      button.disabled = true;
      return;
    }

    button.disabled = false;
  };

  button.addEventListener("click", () => {
    setPaused(!html.classList.contains("motion-paused"));
  });
  query.addEventListener("change", syncPreference);
  syncPreference();
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

export const prefersReducedMotion = (view: Window): boolean =>
  view.matchMedia("(prefers-reduced-motion: reduce)").matches;
