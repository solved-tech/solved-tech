import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import {
  mount,
  settlePrerenderedReveals,
  setupHeaderOffset,
  setupHeroProcessMotion,
  setupMobileMenu,
  setupMotionToggle,
  setupRevealMotion,
  setupScrollProgress,
} from "../src/enhance";

const styles = readFileSync(
  new URL("../src/styles.css", import.meta.url),
  "utf8",
);

const enhanceSource = readFileSync(
  new URL("../src/enhance.ts", import.meta.url),
  "utf8",
);

const mainSource = readFileSync(
  new URL("../src/main.ts", import.meta.url),
  "utf8",
);
const reducedMotionBlock = styles.slice(
  styles.indexOf("@media (prefers-reduced-motion: reduce)"),
  styles.indexOf("@media (prefers-reduced-motion: reduce) and (min-width: 52rem)"),
);

const topLevelHtmlRule = (css: string): string | undefined =>
  css.match(/^html\s*\{([^}]*)\}/m)?.[1];

const finePointerHtmlRule = (css: string): string | undefined => {
  const block = css.match(
    /@media\s*\(\s*pointer:\s*fine\s*\)\s*\{([\s\S]*?)\n\}/,
  )?.[1];

  return block?.match(/html\s*\{([^}]*)\}/)?.[1];
};

const scrollBehavior = (rule: string | undefined): string | undefined =>
  rule?.match(/scroll-behavior:\s*(\w+)/)?.[1];

type CssRule = { prelude: string; body: string };

const stripCssComments = (css: string): string =>
  css.replace(/\/\*[\s\S]*?\*\//g, "");

const flattenCssRules = (css: string): CssRule[] => {
  const rules: CssRule[] = [];
  const input = stripCssComments(css);

  const walk = (block: string) => {
    let index = 0;

    while (index < block.length) {
      const braceOpen = block.indexOf("{", index);
      if (braceOpen === -1) {
        break;
      }

      const prelude = block.slice(index, braceOpen).trim();
      let depth = 1;
      let cursor = braceOpen + 1;

      while (cursor < block.length && depth > 0) {
        if (block[cursor] === "{") {
          depth += 1;
        }
        if (block[cursor] === "}") {
          depth -= 1;
        }
        cursor += 1;
      }

      const body = block.slice(braceOpen + 1, cursor - 1);

      if (prelude.startsWith("@")) {
        walk(body);
      } else {
        rules.push({ prelude, body: body.trim() });
      }

      index = cursor;
    }
  };

  walk(input);
  return rules;
};

const rulesContainingSelector = (css: string, selectorFragment: string): CssRule[] =>
  flattenCssRules(css).filter(({ prelude }) => prelude.includes(selectorFragment));

const mediaBlock = (css: string, queryPattern: RegExp): string | undefined =>
  css.match(queryPattern)?.[0];

interface FakeListener {
  type: string;
  handler: () => void;
  options?: AddEventListenerOptions;
}

const createFakeView = (options: {
  headerHeight?: number | null;
  innerHeight?: number;
  scrollHeight?: number;
  scrollTop?: number;
}) => {
  const listeners: FakeListener[] = [];
  const properties = new Map<string, string>();
  const frames: Array<() => void> = [];
  const header =
    options.headerHeight === null
      ? null
      : {
          getBoundingClientRect: vi.fn(() => ({
            height: options.headerHeight ?? 0,
          })),
        };
  const view = {
    innerHeight: options.innerHeight ?? 0,
    document: {
      documentElement: {
        scrollHeight: options.scrollHeight ?? 0,
        scrollTop: options.scrollTop ?? 0,
        style: {
          setProperty: (name: string, value: string) => {
            properties.set(name, value);
          },
        },
      },
      querySelector: vi.fn(() => header),
    },
    addEventListener: (
      type: string,
      handler: () => void,
      listenerOptions?: AddEventListenerOptions,
    ) => {
      listeners.push({ type, handler, options: listenerOptions });
    },
    requestAnimationFrame: vi.fn((callback: () => void) => {
      frames.push(callback);
      return frames.length;
    }),
  };

  const fire = (type: string) =>
    listeners.filter((listener) => listener.type === type).forEach(({ handler }) => handler());

  return { fire, frames, header, listeners, properties, view };
};

describe("prerendered mount", () => {
  it("renders into an empty mount and reports that nothing was prerendered", () => {
    const render = vi.fn(() => "<h1>Rendered</h1>");
    const app = { firstElementChild: null, innerHTML: "" };

    expect(mount(app as unknown as HTMLElement, render)).toBe(false);
    expect(render).toHaveBeenCalledTimes(1);
    expect(app.innerHTML).toBe("<h1>Rendered</h1>");
  });

  it("keeps prerendered markup and does not render again", () => {
    const render = vi.fn(() => "<h1>Rendered</h1>");
    const app = { firstElementChild: {}, innerHTML: "<h1>Prerendered</h1>" };

    expect(mount(app as unknown as HTMLElement, render)).toBe(true);
    expect(render).not.toHaveBeenCalled();
    expect(app.innerHTML).toBe("<h1>Prerendered</h1>");
  });

  it("marks prerendered reveal targets already inside the viewport as visible", () => {
    const makeTarget = (top: number) => {
      const classes = new Set<string>();
      return {
        classes,
        getBoundingClientRect: () => ({ top }),
        classList: { add: (name: string) => classes.add(name) },
      };
    };
    const onScreen = makeTarget(200);
    const belowFold = makeTarget(1400);
    const root = {
      querySelectorAll: vi.fn(() => [onScreen, belowFold]),
    } as unknown as ParentNode;

    settlePrerenderedReveals(root, { innerHeight: 900 } as unknown as Window);

    expect(onScreen.classes.has("is-visible")).toBe(true);
    expect(belowFold.classes.has("is-visible")).toBe(false);
  });
});

describe("reveal motion", () => {
  it("reveals immediately when reduced motion is preferred", () => {
    const item = { classList: { add: vi.fn() } };
    const root = {
      querySelectorAll: vi.fn(() => [item]),
    } as unknown as ParentNode;

    setupRevealMotion(root, true);

    expect(item.classList.add).toHaveBeenCalledWith("is-visible");
  });

  it("observes with a 0.18 threshold and releases revealed elements", () => {
    const item = { classList: { add: vi.fn() } };
    const root = {
      querySelectorAll: vi.fn(() => [item]),
    } as unknown as ParentNode;
    const observe = vi.fn();
    const unobserve = vi.fn();
    let notify: ((entries: unknown[]) => void) | undefined;
    let threshold: number | undefined;

    class FakeObserver {
      observe = observe;
      unobserve = unobserve;
      disconnect = vi.fn();

      constructor(
        callback: (entries: unknown[]) => void,
        options: { threshold?: number },
      ) {
        notify = callback;
        threshold = options.threshold;
      }
    }

    vi.stubGlobal("IntersectionObserver", FakeObserver);
    setupRevealMotion(root, false);

    expect(item.classList.add).not.toHaveBeenCalled();
    expect(threshold).toBe(0.18);
    expect(observe).toHaveBeenCalledWith(item);

    notify?.([{ isIntersecting: false, target: item }]);
    expect(item.classList.add).not.toHaveBeenCalled();

    notify?.([{ isIntersecting: true, target: item }]);
    expect(item.classList.add).toHaveBeenCalledWith("is-visible");
    expect(unobserve).toHaveBeenCalledWith(item);

    vi.unstubAllGlobals();
  });
});

describe("hero process motion", () => {
  it("exports a dedicated hero process visibility controller", () => {
    expect(setupHeroProcessMotion).toBeTypeOf("function");
  });

  it("queries .hero-process and does nothing when reduced motion is preferred", () => {
    const querySelector = vi.fn();
    const observer = vi.fn();
    vi.stubGlobal("IntersectionObserver", observer);

    setupHeroProcessMotion({ querySelector } as unknown as ParentNode, true);

    expect(querySelector).not.toHaveBeenCalled();
    expect(observer).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it("observes the hero process element", () => {
    const querySelector = vi.fn();
    const observe = vi.fn();

    class FakeObserver {
      observe = observe;
      unobserve = vi.fn();
      disconnect = vi.fn();
    }

    vi.stubGlobal("IntersectionObserver", FakeObserver);
    setupHeroProcessMotion({ querySelector } as unknown as ParentNode, false);

    expect(querySelector).toHaveBeenCalledWith(".hero-process");
    vi.unstubAllGlobals();
  });

  it("runs the process as a fallback without IntersectionObserver", () => {
    const process = { classList: { add: vi.fn() } };
    const root = {
      querySelector: vi.fn(() => process),
    } as unknown as ParentNode;
    vi.stubGlobal("IntersectionObserver", undefined);

    setupHeroProcessMotion(root, false);

    expect(process.classList.add).toHaveBeenCalledWith("is-process-visible");
    vi.unstubAllGlobals();
  });

  it("toggles process motion on every visibility change without unobserving", () => {
    const toggle = vi.fn();
    const process = { classList: { toggle } };
    const root = {
      querySelector: vi.fn(() => process),
    } as unknown as ParentNode;
    const observe = vi.fn();
    const unobserve = vi.fn();
    let notify: ((entries: IntersectionObserverEntry[]) => void) | undefined;

    class FakeObserver {
      observe = observe;
      unobserve = unobserve;
      disconnect = vi.fn();

      constructor(callback: (entries: IntersectionObserverEntry[]) => void) {
        notify = callback;
      }
    }

    vi.stubGlobal("IntersectionObserver", FakeObserver);
    setupHeroProcessMotion(root, false);

    expect(observe).toHaveBeenCalledWith(process);

    notify?.([
      { isIntersecting: true, target: process } as unknown as IntersectionObserverEntry,
    ]);
    notify?.([
      { isIntersecting: false, target: process } as unknown as IntersectionObserverEntry,
    ]);
    notify?.([
      { isIntersecting: true, target: process } as unknown as IntersectionObserverEntry,
    ]);

    expect(toggle.mock.calls).toEqual([
      ["is-process-visible", true],
      ["is-process-visible", false],
      ["is-process-visible", true],
    ]);
    expect(unobserve).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it("ships no pointer-driven hero listener", () => {
    for (const source of [enhanceSource, mainSource]) {
      expect(source).not.toContain("pointermove");
      expect(source).not.toContain("pointerdown");
      expect(source).not.toContain("setupHeroInteraction");
      expect(source).not.toContain("--hero-shift");
    }
  });
});

describe("mobile menu", () => {
  const createMenu = () => {
    const attributes = new Map([["aria-expanded", "false"]]);
    const handlers = new Map<string, (event?: unknown) => void>();
    const toggle = vi.fn();
    const focus = vi.fn();
    const button = {
      focus,
      getAttribute: (name: string) => attributes.get(name) ?? null,
      setAttribute: (name: string, value: string) =>
        attributes.set(name, value),
      addEventListener: (type: string, handler: () => void) =>
        handlers.set(type, handler),
      ownerDocument: {
        addEventListener: (type: string, handler: (event?: unknown) => void) =>
          handlers.set(type, handler),
      },
    };
    const nav = {
      classList: { toggle },
      querySelectorAll: vi.fn(() => []),
    };
    const root = {
      querySelector: vi.fn((selector: string) =>
        selector === ".menu-toggle" ? button : nav,
      ),
    } as unknown as ParentNode;

    setupMobileMenu(root);

    return { attributes, focus, handlers, toggle };
  };

  it("toggles navigation visibility and its accessible state", () => {
    const { attributes, handlers, toggle } = createMenu();

    handlers.get("click")?.();
    expect(attributes.get("aria-expanded")).toBe("true");
    expect(toggle).toHaveBeenCalledWith("is-open", true);

    handlers.get("click")?.();
    expect(attributes.get("aria-expanded")).toBe("false");
    expect(toggle).toHaveBeenLastCalledWith("is-open", false);
  });

  it("closes on Escape and returns focus to the toggle", () => {
    const { attributes, focus, handlers, toggle } = createMenu();

    handlers.get("click")?.();
    handlers.get("keydown")?.({ key: "Escape" });

    expect(attributes.get("aria-expanded")).toBe("false");
    expect(attributes.get("aria-label")).toBe("Open menu");
    expect(toggle).toHaveBeenLastCalledWith("is-open", false);
    expect(focus).toHaveBeenCalledTimes(1);
  });

  it("ignores Escape and other keys while the menu is closed", () => {
    const { attributes, focus, handlers, toggle } = createMenu();

    handlers.get("keydown")?.({ key: "Escape" });
    handlers.get("keydown")?.({ key: "Enter" });

    expect(attributes.get("aria-expanded")).toBe("false");
    expect(toggle).not.toHaveBeenCalled();
    expect(focus).not.toHaveBeenCalled();
  });
});

describe("header offset", () => {
  it("publishes the measured header height", () => {
    const { properties, view } = createFakeView({ headerHeight: 122.4 });

    setupHeaderOffset(view as unknown as Window);

    expect(properties.get("--header-height")).toBe("122px");
  });

  it("remeasures when the header resizes", () => {
    const observe = vi.fn();
    let react: (() => void) | undefined;

    class FakeResizeObserver {
      observe = observe;
      disconnect = vi.fn();
      unobserve = vi.fn();

      constructor(callback: () => void) {
        react = callback;
      }
    }

    vi.stubGlobal("ResizeObserver", FakeResizeObserver);

    const { header, properties, view } = createFakeView({ headerHeight: 68 });

    setupHeaderOffset(view as unknown as Window);
    expect(observe).toHaveBeenCalledWith(header);
    expect(properties.get("--header-height")).toBe("68px");

    header?.getBoundingClientRect.mockReturnValue({ height: 124 });
    react?.();
    expect(properties.get("--header-height")).toBe("124px");

    vi.unstubAllGlobals();
  });

  it("falls back to resize events without ResizeObserver", () => {
    vi.stubGlobal("ResizeObserver", undefined);

    const { fire, header, listeners, properties, view } = createFakeView({
      headerHeight: 68,
    });

    setupHeaderOffset(view as unknown as Window);
    expect(listeners.map(({ type }) => type)).toEqual(["resize"]);

    header?.getBoundingClientRect.mockReturnValue({ height: 124 });
    fire("resize");
    expect(properties.get("--header-height")).toBe("124px");

    vi.unstubAllGlobals();
  });

  it("does nothing when no header is present", () => {
    const { listeners, properties, view } = createFakeView({
      headerHeight: null,
    });

    expect(() => setupHeaderOffset(view as unknown as Window)).not.toThrow();
    expect(listeners).toHaveLength(0);
    expect(properties.has("--header-height")).toBe(false);
  });

  it("keeps the last known height when the header cannot be measured", () => {
    vi.stubGlobal("ResizeObserver", undefined);

    const { fire, header, properties, view } = createFakeView({
      headerHeight: 68,
    });

    setupHeaderOffset(view as unknown as Window);
    header?.getBoundingClientRect.mockReturnValue({ height: 0 });
    fire("resize");

    expect(properties.get("--header-height")).toBe("68px");

    vi.unstubAllGlobals();
  });
});

describe("scroll progress", () => {
  it("reports zero when the page cannot scroll", () => {
    const { properties, view } = createFakeView({
      innerHeight: 900,
      scrollHeight: 900,
      scrollTop: 0,
    });

    setupScrollProgress(view as unknown as Window);

    expect(properties.get("--scroll-progress")).toBe("0.0000");
  });

  it("coalesces scroll events into a single animation frame", () => {
    const { fire, frames, properties, view } = createFakeView({
      innerHeight: 1000,
      scrollHeight: 5000,
      scrollTop: 1000,
    });

    setupScrollProgress(view as unknown as Window);
    expect(properties.get("--scroll-progress")).toBe("0.2500");

    view.document.documentElement.scrollTop = 2000;
    fire("scroll");
    fire("scroll");
    expect(view.requestAnimationFrame).toHaveBeenCalledTimes(1);
    expect(properties.get("--scroll-progress")).toBe("0.2500");

    frames[0]?.();
    expect(properties.get("--scroll-progress")).toBe("0.5000");

    view.document.documentElement.scrollTop = 4000;
    fire("scroll");
    expect(view.requestAnimationFrame).toHaveBeenCalledTimes(2);
    frames[1]?.();
    expect(properties.get("--scroll-progress")).toBe("1.0000");
  });

  it("listens passively for scroll and resize", () => {
    const { listeners, properties, view } = createFakeView({
      innerHeight: 1000,
      scrollHeight: 3000,
      scrollTop: 0,
    });

    setupScrollProgress(view as unknown as Window);

    expect(listeners.map(({ type }) => type).sort()).toEqual([
      "resize",
      "scroll",
    ]);
    listeners.forEach(({ options }) => expect(options).toEqual({ passive: true }));

    view.document.documentElement.scrollHeight = 2000;
    view.innerHeight = 2000;
    listeners.find(({ type }) => type === "resize")?.handler();
    expect(properties.get("--scroll-progress")).toBe("0.0000");
  });
});

describe("motion toggle", () => {
  const createToggle = (reduceMotion: boolean) => {
    const handlers = new Map<string, () => void>();
    const classes = new Set<string>();
    const attributes = new Map<string, string>();
    const button = {
      disabled: false,
      setAttribute: (name: string, value: string) =>
        attributes.set(name, value),
      addEventListener: (type: string, handler: () => void) =>
        handlers.set(type, handler),
    };
    let onChange: (() => void) | undefined;
    const query = {
      matches: reduceMotion,
      addEventListener: (_type: string, handler: () => void) => {
        onChange = handler;
      },
    };
    const view = {
      matchMedia: vi.fn(() => query),
      document: {
        documentElement: {
          classList: {
            contains: (name: string) => classes.has(name),
            toggle: (name: string, force: boolean) => {
              if (force) {
                classes.add(name);
              } else {
                classes.delete(name);
              }
              return force;
            },
          },
        },
      },
    };
    const root = { querySelector: vi.fn(() => button) } as unknown as ParentNode;

    setupMotionToggle(root, view as unknown as Window);

    return {
      attributes,
      button,
      classes,
      handlers,
      query,
      fireChange: () => onChange?.(),
    };
  };

  it("pauses and resumes motion through the diagram's pressed state", () => {
    const { attributes, button, classes, handlers } = createToggle(false);

    expect(button.disabled).toBe(false);

    handlers.get("click")?.();
    expect(attributes.get("aria-label")).toBe("Resume diagram motion");
    expect(attributes.get("aria-pressed")).toBe("true");
    expect(classes.has("motion-paused")).toBe(true);

    handlers.get("click")?.();
    expect(attributes.get("aria-label")).toBe("Pause diagram motion");
    expect(attributes.get("aria-pressed")).toBe("false");
    expect(classes.has("motion-paused")).toBe(false);
  });

  it("disables the control while reduced motion is preferred and follows live changes", () => {
    const { button, query, fireChange } = createToggle(true);

    expect(button.disabled).toBe(true);

    query.matches = false;
    fireChange();
    expect(button.disabled).toBe(false);
  });

  it("does nothing without a process control in the document", () => {
    const matchMedia = vi.fn();

    setupMotionToggle(
      { querySelector: vi.fn(() => null) } as unknown as ParentNode,
      { matchMedia } as unknown as Window,
    );

    expect(matchMedia).not.toHaveBeenCalled();
  });
});

describe("stylesheet contracts", () => {
  it("pauses every infinite animation when motion is paused", () => {
    expect(styles).toMatch(
      /html\.motion-paused \.code-field code[\s\S]*?animation-play-state:\s*paused/,
    );
    expect(styles).toMatch(
      /html\.motion-paused \.code-field code,\s*html\.motion-paused \.hero-process \.hero-process__animated\s*\{[^}]*animation-play-state:\s*paused/s,
    );
  });

  it("coordinates one shared process cycle across the signal and stages", () => {
    expect(styles).toMatch(/\.hero-process\s*\{[^}]*--process-cycle:\s*16s/s);
    expect(styles).toMatch(
      /\.hero-process__signal\s*\{[^}]*animation:\s*hero-process-travel var\(--process-cycle\) linear infinite/s,
    );
    expect(styles).toMatch(
      /\.hero-process__stage\s*\{[^}]*--process-stage-animation:\s*hero-process-stage[^}]*animation:\s*var\(--process-stage-animation\) var\(--process-cycle\) linear infinite/s,
    );
    expect(styles).toMatch(
      /\.hero-process__live\s*\{[^}]*animation:\s*hero-process-live 2s ease-in-out infinite/s,
    );

    ["hero-process-live", "hero-process-travel", "hero-process-stage"].forEach(
      (name) => expect(styles).toContain(`@keyframes ${name}`),
    );
  });

  it("starts process animations paused and runs only while visible", () => {
    expect(styles).toMatch(
      /\.hero-process__animated\s*\{[^}]*animation-play-state:\s*paused/s,
    );
    expect(styles).toMatch(
      /\.hero-process\.is-process-visible \.hero-process__animated\s*\{[^}]*animation-play-state:\s*running/s,
    );
  });

  it("highlights each stage exactly when the signal reaches its node", () => {
    expect(styles).toMatch(
      /@keyframes hero-process-travel[\s\S]*?0%\s*\{[^}]*inset-block-start:\s*2\.1rem/,
    );
    expect(styles).toMatch(
      /@keyframes hero-process-travel[\s\S]*?25%\s*\{[^}]*inset-block-start:\s*6\.1rem/,
    );
    expect(styles).toMatch(
      /@keyframes hero-process-travel[\s\S]*?50%\s*\{[^}]*inset-block-start:\s*10\.1rem/,
    );
    expect(styles).toMatch(
      /@keyframes hero-process-travel[\s\S]*?75%\s*\{[^}]*inset-block-start:\s*14\.1rem/,
    );
    expect(styles).toMatch(/\.hero-process__stage:nth-child\(2\)[^}]*animation-delay:\s*-12s/s);
    expect(styles).toMatch(/\.hero-process__stage:nth-child\(3\)[^}]*animation-delay:\s*-8s/s);
    expect(styles).toMatch(/\.hero-process__stage:nth-child\(4\)[^}]*animation-delay:\s*-4s/s);
    expect(styles).toMatch(
      /@keyframes hero-process-stage[\s\S]*?0%,\s*14%\s*\{[^}]*color:\s*var\(--accent\)/,
    );
  });

  it("returns the signal directly to the active top node", () => {
    expect(styles).toMatch(
      /@keyframes hero-process-travel[\s\S]*?75%\s*\{[^}]*14\.1rem[^}]*\}[\s\S]*?75\.01%,\s*100%\s*\{[^}]*2\.1rem/,
    );
    expect(styles).toMatch(
      /\.hero-process__stage:first-child\s*\{[^}]*--process-stage-animation:\s*hero-process-stage-first/s,
    );
    expect(styles).toMatch(
      /@keyframes hero-process-stage-first[\s\S]*?75\.01%,\s*100%\s*\{[^}]*color:\s*var\(--accent\)/,
    );
  });

  it("aligns the rail and moving signal to the stage-node track", () => {
    expect(styles).toMatch(
      /\.hero-process\s*\{[^}]*--process-track:\s*3rem/s,
    );
    expect(styles).toMatch(
      /\.hero-process__rail\s*\{[^}]*inset-inline-start:\s*var\(--process-track\)/s,
    );
    expect(styles).toMatch(
      /\.hero-process__signal\s*\{[^}]*inset-inline-start:\s*calc\(var\(--process-track\) - 0\.25rem\)/s,
    );
  });

  it("keeps the process free of gradients, filters and glow", () => {
    expect(styles).not.toMatch(/gradient|drop-shadow|filter:|blur\(/i);
  });

  it("lays out one, two, then three weighted hero action columns", () => {
    const actionsRule = styles.match(/^\.hero__actions\s*\{([^}]*)\}/m)?.[1] ?? "";
    const buttonRule =
      styles.match(/^\.hero \.contact-action\s*\{([^}]*)\}/m)?.[1] ?? "";

    expect(actionsRule).toContain("display: grid");
    expect(actionsRule).toContain(
      "grid-template-columns: repeat(2, minmax(0, 1fr))",
    );
    expect(buttonRule).toMatch(/min-height:\s*48px/);
    expect(buttonRule).toContain("min-width: 0");

    expect(styles).toMatch(
      /\.hero__actions \.contact-action--call \{\s*grid-column: 1 \/ -1;/,
    );
    expect(styles).toMatch(
      /@media\s*\(min-width:\s*64rem\)[\s\S]*?\.hero__actions\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1\.35fr\) repeat\(2, minmax\(0, 1fr\)\)/,
    );
  });

  it("leaves the shared contact rail WhatsApp styling untouched", () => {
    expect(styles).toMatch(/\.contact__actions \.contact-action--whatsapp/);
    expect(styles).not.toMatch(
      /\.hero \.contact-action--whatsapp \{[^}]*(?:#25d366|37 211 102)/,
    );
  });

  it("defaults to immediate scrolling and restores smooth scrolling for fine pointers", () => {
    expect(scrollBehavior(topLevelHtmlRule(styles))).toBe("auto");
    expect(scrollBehavior(finePointerHtmlRule(styles))).toBe("smooth");
  });

  it("anchors scroll contract to the top-level html rule, not reduced-motion overrides", () => {
    const deceptiveStyles = `
html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}

@media (pointer: fine) {
  html {
    scroll-behavior: smooth;
  }
}
`;

    expect(deceptiveStyles).toMatch(/html\s*\{[^}]*scroll-behavior:\s*auto/s);
    expect(scrollBehavior(topLevelHtmlRule(deceptiveStyles))).toBe("smooth");
    expect(scrollBehavior(topLevelHtmlRule(deceptiveStyles))).not.toBe("auto");
  });

  it("disables service artwork motion under reduced motion", () => {
    expect(reducedMotionBlock).toContain(".service-art");
    expect(reducedMotionBlock).toMatch(
      /\.service-art[\s\S]*?animation:\s*none/,
    );
    expect(reducedMotionBlock).toMatch(/\.service-art[\s\S]*?opacity:\s*1/);
    expect(reducedMotionBlock).toMatch(/\.service-art[\s\S]*?transform:\s*none/);
  });

  it("uses an automatic base height and a desktop-only viewport minimum", () => {
    expect([...styles.matchAll(/[sd]vh/g)].map(([unit]) => unit)).toEqual([
      "svh",
      "svh",
    ]);

    const baseRule = styles.match(/^\.hero\s*\{([^}]*)\}/m)?.[1] ?? "";
    expect(baseRule).toContain("min-height: auto");

    expect(styles).toMatch(
      /@media\s*\(min-width:\s*64rem\)[\s\S]*?min-height:\s*calc\(100svh - var\(--header-height\)\)/,
    );

    const childRules: Record<string, string> = {
      heading: styles.match(/\.hero h1\s*\{([^}]*)\}/)?.[1] ?? "",
      layout: styles.match(/\.hero__layout\s*\{([^}]*)\}/)?.[1] ?? "",
      labels: styles.match(/\.hero-process__stage-copy strong\s*\{([^}]*)\}/)?.[1] ?? "",
    };

    Object.entries(childRules).forEach(([name, rule]) => {
      expect(rule, name).not.toBe("");
      expect(rule, name).not.toMatch(/[sd]vh/);
    });

    expect(styles).toMatch(/--type-display:\s*clamp\([^;]*vw/);
    expect(childRules.heading).toContain("font-size: var(--type-display)");
    expect(childRules.layout).toMatch(/gap:\s*clamp\(/);
    expect(childRules.labels).toMatch(/font-size:\s*clamp\(/);
  });

  it("defines a compact threshold strictly below 23rem", () => {
    expect(styles).toMatch(
      /@media\s*\(\s*max-width:\s*22\.999rem\s*\)/,
    );
    expect(styles).toMatch(
      /\.hero \.contact-action__suffix[\s\S]*?display:\s*none/,
    );
  });

  it("hides the hero process when the viewport cannot support it", () => {
    expect(styles).toMatch(
      /@media\s*\(max-width:\s*63\.999rem\)[\s\S]*?\.hero__visual\s*\{[^}]*display:\s*none/s,
    );
  });

  it("simplifies decorative motion on short viewports", () => {
    expect(styles).toMatch(
      /@media[\s\S]*?max-height:[\s\S]*?\.code-field code[\s\S]*?animation-play-state:\s*paused/,
    );
  });

  it("keeps short-height media rules decorative rather than geometric", () => {
    const shortHeightBlock = mediaBlock(
      styles,
      /@media\s*\(\s*max-height:\s*48rem\s*\)\s*\{[\s\S]*?\n\}/,
    );

    expect(shortHeightBlock).toBeDefined();
    expect(shortHeightBlock).toMatch(
      /\.code-field code\s*\{[^}]*animation-play-state:\s*paused/s,
    );
    expect(shortHeightBlock?.slice(shortHeightBlock.indexOf("{") + 1)).not.toMatch(
      /(?:font-size|gap|padding|width|height|justify-content)\s*:/,
    );
    expect(styles).not.toContain("max-width: 120rem");
    expect(styles).not.toMatch(/max-height:\s*(?:54|68)rem/);
  });

  it("strengthens process structure under increased contrast", () => {
    const contrastBlock =
      styles.match(
        /@media\s*\(prefers-contrast:\s*more\)\s*\{([\s\S]*?)\n\}/,
      )?.[1] ?? "";

    expect(contrastBlock).toMatch(
      /\.hero-process__rail\s*\{[^}]*background-color:\s*var\(--ink-muted\)/s,
    );
    expect(contrastBlock).toMatch(
      /\.hero-process__stage\s*\{[^}]*border-color:\s*var\(--ink-muted\)/s,
    );
  });

  it("hides the signal and keeps static process structure under reduced motion", () => {
    expect(reducedMotionBlock).toMatch(
      /\.hero-process__animated\s*\{[^}]*animation:\s*none/s,
    );
    expect(reducedMotionBlock).toMatch(
      /\.hero-process__signal\s*\{[^}]*display:\s*none/s,
    );
    expect(reducedMotionBlock).toMatch(
      /\.hero-process__stage\s*\{[^}]*color:\s*var\(--line-strong\)[^}]*opacity:\s*1/s,
    );
  });

  it("never hides the process interface or service diagrams", () => {
    const protectedSelectors = [
      ".hero-process__interface",
      ".service-hero__visual",
      ".service-art",
    ] as const;

    protectedSelectors.forEach((selector) => {
      const matchingRules = rulesContainingSelector(styles, selector);
      expect(
        matchingRules.length,
        `expected rules containing ${selector}`,
      ).toBeGreaterThan(0);

      matchingRules.forEach(({ prelude, body }) => {
        expect(body, `display:none in ${prelude.trim()}`).not.toMatch(
          /display:\s*none\b/,
        );
      });
    });
  });

  it("widens the content shell at 96rem and above", () => {
    expect(styles).toMatch(
      /@media\s*\(\s*min-width:\s*96rem\s*\)[\s\S]*?--shell:\s*96rem/,
    );
  });

  it("uses a wider, shorter hero composition on large displays", () => {
    expect(styles).toMatch(
      /@media\s*\(\s*min-width:\s*120rem\s*\)[\s\S]*?--shell:\s*112rem/,
    );
    expect(styles).toMatch(
      /@media\s*\(\s*min-width:\s*120rem\s*\)[\s\S]*?\.hero\s*\{[^}]*min-height:\s*min\(calc\(100svh - var\(--header-height\)\), 58rem\)/s,
    );
    expect(styles).toMatch(
      /@media\s*\(\s*min-width:\s*120rem\s*\)[\s\S]*?\.hero-process\s*\{[^}]*width:\s*min\(100%, 34rem\)/s,
    );
  });

  it("gives the product card focus boundary at least 3:1 contrast against the surface", () => {
    const token = (name: string): string =>
      styles.match(new RegExp(`--${name}: (#[0-9a-f]{6});`))?.[1] ?? "";
    const luminance = (hex: string): number => {
      const channel = (offset: number): number => {
        const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
    };
    const focusToken =
      styles.match(
        /\.product-card__link:focus-visible \{[^}]*outline: 2px solid var\(--([a-z-]+)\)/,
      )?.[1] ?? "";

    expect(focusToken).not.toBe("");
    const ratio =
      (luminance(token(focusToken)) + 0.05) /
      (luminance(token("surface")) + 0.05);
    expect(ratio).toBeGreaterThanOrEqual(3);
  });

  it("gates product card hover transforms behind hover and fine-pointer media", () => {
    const hoverBlock =
      styles.match(
        /@media\s*\(hover:\s*hover\)\s*and\s*\(pointer:\s*fine\)\s*\{([\s\S]*?)\n\}/,
      )?.[1] ?? "";

    expect(hoverBlock).toContain(".product-card__link:hover");
    expect(hoverBlock).toMatch(/translateY\(-2px\)/);
    expect(hoverBlock).toMatch(/translateX\(0\.25rem\)/);

    expect(styles).not.toMatch(/^\.product-card__link:hover/m);
    expect(styles).not.toMatch(/^\.product-card__link:hover .*arrow/m);
  });

  it("keeps product card focus geometric and removes active lift", () => {
    expect(styles).toMatch(
      /\.product-card__link:focus-visible \{[^}]*outline: 2px solid var\(--accent\)/,
    );
    expect(styles).not.toMatch(
      /\.product-card__link:focus-visible \{[^}]*outline:\s*none/,
    );
    expect(styles).toMatch(
      /\.product-card__link:active\s*\{[^}]*transform:\s*none/,
    );
  });

  it("neutralises product card and arrow transforms under reduced motion", () => {
    expect(reducedMotionBlock).toMatch(
      /\.product-card__link[\s\S]*?transform:\s*none/,
    );
    expect(reducedMotionBlock).toMatch(
      /\.product-card__action span[\s\S]*?transform:\s*none/,
    );
  });

  it("renders product glyphs without any animation", () => {
    expect(styles).not.toMatch(/@keyframes[^{]*\bglyph/i);
    expect(styles).not.toMatch(/\.product-glyph[^{]*\{[^}]*animation/);
  });
});
