import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import {
  mount,
  settlePrerenderedReveals,
  setupHeaderOffset,
  setupHeroInteraction,
  setupMobileMenu,
  setupMotionToggle,
  setupPipelineMotion,
  setupRevealMotion,
  setupScrollProgress,
} from "../src/enhance";
import { pipelinePath } from "../src/render";

const styles = readFileSync(
  new URL("../src/styles.css", import.meta.url),
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

describe("pipeline motion", () => {
  it("exports a dedicated pipeline visibility controller", () => {
    expect(setupPipelineMotion).toBeTypeOf("function");
  });

  it("does nothing when reduced motion is preferred", () => {
    const querySelector = vi.fn();
    const observer = vi.fn();
    vi.stubGlobal("IntersectionObserver", observer);

    setupPipelineMotion(
      { querySelector } as unknown as ParentNode,
      true,
    );

    expect(querySelector).not.toHaveBeenCalled();
    expect(observer).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it("runs the pipeline as a fallback without IntersectionObserver", () => {
    const pipeline = { classList: { add: vi.fn() } };
    const root = {
      querySelector: vi.fn(() => pipeline),
    } as unknown as ParentNode;
    vi.stubGlobal("IntersectionObserver", undefined);

    setupPipelineMotion(root, false);

    expect(pipeline.classList.add).toHaveBeenCalledWith(
      "is-pipeline-visible",
    );
    vi.unstubAllGlobals();
  });

  it("toggles pipeline motion on every visibility change without unobserving", () => {
    const toggle = vi.fn();
    const pipeline = { classList: { toggle } };
    const root = {
      querySelector: vi.fn(() => pipeline),
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
    setupPipelineMotion(root, false);

    expect(observe).toHaveBeenCalledWith(pipeline);

    notify?.([
      {
        isIntersecting: true,
        target: pipeline,
      } as unknown as IntersectionObserverEntry,
    ]);
    notify?.([
      {
        isIntersecting: false,
        target: pipeline,
      } as unknown as IntersectionObserverEntry,
    ]);
    notify?.([
      {
        isIntersecting: true,
        target: pipeline,
      } as unknown as IntersectionObserverEntry,
    ]);

    expect(toggle.mock.calls).toEqual([
      ["is-pipeline-visible", true],
      ["is-pipeline-visible", false],
      ["is-pipeline-visible", true],
    ]);
    expect(unobserve).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});

describe("hero interaction", () => {
  it("turns pointer position into restrained visual offsets", () => {
    const properties = new Map<string, string>();
    const handlers = new Map<string, (event: PointerEvent) => void>();
    const hero = {
      style: {
        setProperty: (name: string, value: string) =>
          properties.set(name, value),
      },
      getBoundingClientRect: () => ({
        left: 0,
        top: 0,
        width: 400,
        height: 800,
      }),
      addEventListener: (
        type: string,
        handler: (event: PointerEvent) => void,
      ) => handlers.set(type, handler),
    };
    const root = {
      querySelector: vi.fn(() => hero),
    } as unknown as ParentNode;

    setupHeroInteraction(root, false);
    handlers.get("pointermove")?.({
      clientX: 400,
      clientY: 800,
    } as PointerEvent);

    expect(properties.get("--hero-shift-x")).toBe("18.00px");
    expect(properties.get("--hero-shift-y")).toBe("18.00px");
  });

  it("stays static when reduced motion is preferred", () => {
    const addEventListener = vi.fn();
    const root = {
      querySelector: vi.fn(() => ({ addEventListener })),
    } as unknown as ParentNode;

    setupHeroInteraction(root, true);

    expect(addEventListener).not.toHaveBeenCalled();
  });

  it("skips pointer tracking for coarse pointers", () => {
    const addEventListener = vi.fn();
    const root = {
      querySelector: vi.fn(() => ({ addEventListener })),
    } as unknown as ParentNode;

    setupHeroInteraction(root, false, false);

    expect(addEventListener).not.toHaveBeenCalled();
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
    const button = {
      hidden: false,
      textContent: "Pause background motion",
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

    return { button, classes, handlers, query, fireChange: () => onChange?.() };
  };

  it("pauses and resumes continuous motion through the label and the html class", () => {
    const { button, classes, handlers } = createToggle(false);

    expect(button.hidden).toBe(false);

    handlers.get("click")?.();
    expect(button.textContent).toBe("Resume background motion");
    expect(classes.has("motion-paused")).toBe(true);

    handlers.get("click")?.();
    expect(button.textContent).toBe("Pause background motion");
    expect(classes.has("motion-paused")).toBe(false);
  });

  it("hides the control while the system reduces motion and follows live changes", () => {
    const { button, query, fireChange } = createToggle(true);

    expect(button.hidden).toBe(true);

    query.matches = false;
    fireChange();
    expect(button.hidden).toBe(false);
  });

  it("does nothing without a toggle in the document", () => {
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
    expect(styles).toContain("html.motion-paused .hero__pipeline .hero-pipeline__signal");
    expect(styles).toContain("html.motion-paused .hero__pipeline .hero-pipeline__node-ring");
    expect(styles.match(/\binfinite\b/g)).toHaveLength(3);
  });

  it("uses the rendered pipeline path as the exact CSS motion path", () => {
    expect(pipelinePath).toBeTypeOf("string");
    expect(styles).toContain(`offset-path: path("${pipelinePath}");`);
  });

  it("runs pipeline animations only while the pipeline is visible", () => {
    expect(styles).toMatch(
      /\.hero-pipeline__node-ring\s*\{[^}]*animation-play-state:\s*paused/s,
    );
    expect(styles).toMatch(
      /\.hero-pipeline__signal\s*\{[^}]*animation-play-state:\s*paused/s,
    );
    expect(styles).toMatch(
      /\.hero__pipeline\.is-pipeline-visible[\s\S]*?animation-play-state:\s*running/,
    );
  });

  it("fits hero contact actions on one desktop row", () => {
    const actionsRule = styles.match(/^\.hero__actions\s*\{([^}]*)\}/m)?.[1];

    expect(actionsRule).toBeDefined();
    expect(actionsRule).toContain("width: min(100%, 42rem)");
  });

  it("tracks the live mobile viewport while retaining a safe fallback", () => {
    const heroRule = styles.match(/\.hero\s*\{([^}]*)\}/)?.[1];
    const fallback = "min-height: calc(100svh - var(--header-height))";
    const dynamic = "min-height: calc(100dvh - var(--header-height))";

    expect(heroRule).toContain(fallback);
    expect(heroRule).toContain(dynamic);
    expect(heroRule?.indexOf(fallback)).toBeLessThan(
      heroRule?.indexOf(dynamic) ?? -1,
    );
  });

  it("fits hero contact actions on one mobile row", () => {
    const actionsRule = styles.match(/^\.hero__actions\s*\{([^}]*)\}/m)?.[1];
    const buttonRule = styles.match(/^\.hero \.contact-action\s*\{([^}]*)\}/m)?.[1];

    expect(actionsRule).toContain("display: grid");
    expect(actionsRule).toContain(
      "grid-template-columns: repeat(3, minmax(0, 1fr))",
    );
    expect(buttonRule).toMatch(/min-height:\s*48px/);
    expect(buttonRule).toContain("min-width: 0");
  });

  it("pulses only the node ring after the signal crosses", () => {
    const nodeRule = styles.match(/\.hero-pipeline__node\s*\{([^}]*)\}/)?.[1];
    const ringRule = styles.match(
      /\.hero-pipeline__node-ring\s*\{([^}]*)\}/,
    )?.[1];
    const iconRule = styles.match(/\.hero-pipeline__icon\s*\{([^}]*)\}/)?.[1];
    const labelRule = styles.match(
      /\.hero-pipeline__node text\s*\{([^}]*)\}/,
    )?.[1];

    expect(nodeRule).not.toContain("animation:");
    expect(ringRule).toContain(
      "animation: pipeline-node-ring-active 9s linear infinite",
    );
    expect(ringRule).toContain(
      "animation-delay: calc(var(--pipeline-delay) + 140ms)",
    );
    expect(iconRule).not.toContain("animation:");
    expect(labelRule).not.toContain("animation:");
    expect(styles).toContain("@keyframes pipeline-node-ring-active");
  });

  it("does not apply a drop shadow to the pipeline signal", () => {
    const signalRule = styles.match(
      /\.hero-pipeline__signal\s*\{([^}]*)\}/,
    )?.[1];

    expect(signalRule).toBeDefined();
    expect(signalRule).not.toContain("filter:");
    expect(signalRule).not.toContain("drop-shadow");
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

  it("uses continuous viewport-aware hero geometry in base rules", () => {
    const heroRule = styles.match(/\.hero\s*\{([^}]*)\}/)?.[1];
    const headingRule = styles.match(/\.hero h1\s*\{([^}]*)\}/)?.[1];
    const pipelineRule = styles.match(/\.hero__pipeline\s*\{([^}]*)\}/)?.[1];

    for (const rule of [heroRule, headingRule, pipelineRule]) {
      expect(rule).toMatch(/dvh/);
      expect(rule).toMatch(/(?:vw|100%)/);
      expect(rule).toMatch(/(?:clamp|min|max)\(/);
    }
    expect(heroRule).toMatch(/gap:[^;]*dvh/);
    expect(heroRule).toMatch(/padding-block:[^;]*dvh/);
  });

  it("defines a compact threshold strictly below 23rem", () => {
    expect(styles).toMatch(
      /@media\s*\(\s*max-width:\s*22\.999rem\s*\)/,
    );
    expect(styles).toMatch(
      /\.hero \.contact-action__suffix[\s\S]*?display:\s*none/,
    );
  });

  it("simplifies decorative motion on short viewports", () => {
    expect(styles).toMatch(
      /@media[\s\S]*?max-height:[\s\S]*?\.code-field code[\s\S]*?animation-play-state:\s*paused/,
    );
    expect(styles).toMatch(
      /@media[\s\S]*?max-height:[\s\S]*?\.hero__signal[\s\S]*?opacity:/,
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
    expect(shortHeightBlock).toMatch(/\.hero__signal\s*\{[^}]*opacity:/s);
    expect(shortHeightBlock?.slice(shortHeightBlock.indexOf("{") + 1)).not.toMatch(
      /(?:font-size|gap|padding|width|height|justify-content)\s*:/,
    );
    expect(styles).not.toContain("max-width: 120rem");
    expect(styles).not.toMatch(/max-height:\s*(?:54|68)rem/);
  });

  it("never hides hero pipeline or service diagrams", () => {
    const protectedSelectors = [
      ".hero__pipeline",
      ".service-box__artwork",
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

  it("gives the need-link boundary at least 3:1 contrast against the surface", () => {
    const token = (name: string): string =>
      styles.match(new RegExp(`--${name}: (#[0-9a-f]{6});`))?.[1] ?? "";
    const luminance = (hex: string): number => {
      const channel = (offset: number): number => {
        const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
    };
    const borderToken =
      styles.match(/\.need-link \{[^}]*border: 1px solid var\(--([a-z-]+)\)/)?.[1] ?? "";

    expect(borderToken).not.toBe("");
    const ratio = (luminance(token(borderToken)) + 0.05) / (luminance(token("surface")) + 0.05);
    expect(ratio).toBeGreaterThanOrEqual(3);
  });
});
