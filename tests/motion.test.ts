import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import {
  setupHeaderOffset,
  setupHeroInteraction,
  setupMobileMenu,
  setupPipelineMotion,
  setupRevealMotion,
  setupScrollProgress,
} from "../src/main";
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
  it("toggles navigation visibility and its accessible state", () => {
    const attributes = new Map([["aria-expanded", "false"]]);
    const handlers = new Map<string, () => void>();
    const toggle = vi.fn();
    const button = {
      getAttribute: (name: string) => attributes.get(name) ?? null,
      setAttribute: (name: string, value: string) =>
        attributes.set(name, value),
      addEventListener: (type: string, handler: () => void) =>
        handlers.set(type, handler),
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
    handlers.get("click")?.();

    expect(attributes.get("aria-expanded")).toBe("true");
    expect(toggle).toHaveBeenCalledWith("is-open", true);

    handlers.get("click")?.();
    expect(attributes.get("aria-expanded")).toBe("false");
    expect(toggle).toHaveBeenLastCalledWith("is-open", false);
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

describe("stylesheet contracts", () => {
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
    const mobileHeroBlock = styles.match(
      /@media\s*\(\s*max-width:\s*40rem\s*\)\s*\{[\s\S]*?\.hero__actions[\s\S]*?\n\}/,
    )?.[0];

    expect(mobileHeroBlock).toBeDefined();

    const actionsRule = mobileHeroBlock?.match(/\.hero__actions\s*\{([^}]*)\}/)?.[1];
    const buttonRule = mobileHeroBlock?.match(/\.hero \.contact-action\s*\{([^}]*)\}/)?.[1];

    expect(actionsRule).toContain("display: grid");
    expect(actionsRule).toContain(
      "grid-template-columns: repeat(3, minmax(0, 1fr))",
    );
    expect(buttonRule).toMatch(/min-height:\s*48px/);

    const heroRule = mobileHeroBlock?.match(/\.hero\s*\{([^}]*)\}/)?.[1];

    expect(heroRule).toContain("justify-content: flex-start");
    expect(heroRule).toContain("padding-block-start: 1.5rem");
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

  it("uses dvh-aware global hero gap and padding", () => {
    const heroRule = styles.match(/\.hero\s*\{([^}]*)\}/)?.[1];

    expect(heroRule).toMatch(/gap:[^;]*dvh/);
    expect(heroRule).toMatch(/padding-block:[^;]*dvh/);
  });

  it("defines a compact threshold below 23rem", () => {
    expect(styles).toMatch(
      /@media\s*\(\s*max-width:\s*23rem\s*\)/,
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

  it("never hides hero pipeline or service diagrams", () => {
    const pipelineRules = styles.match(/\.hero__pipeline\s*\{[^}]*\}/g) ?? [];
    pipelineRules.forEach((rule) => {
      expect(rule).not.toMatch(/display:\s*none/);
    });
    expect(styles).not.toMatch(/\.service-art\s*\{[^}]*display:\s*none/);
    expect(styles).not.toMatch(
      /\.service-box__artwork\s*\{[^}]*display:\s*none/,
    );
  });

  it("widens the content shell at 96rem and above", () => {
    expect(styles).toMatch(
      /@media\s*\(\s*min-width:\s*96rem\s*\)[\s\S]*?--shell:\s*96rem/,
    );
  });
});
