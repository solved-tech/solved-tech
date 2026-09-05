import { describe, expect, it, vi } from "vitest";
import {
  CONTACT_PREVIEW_MESSAGE,
  setupContactPreview,
  setupHeaderOffset,
  setupRevealMotion,
  setupScrollProgress,
} from "../src/main";

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

const createFakeButton = () => {
  const attributes = new Map<string, string>();
  const message = { hidden: false, id: "", className: "", textContent: "" };
  const handlers: Array<() => void> = [];
  const button = {
    ownerDocument: { createElement: vi.fn(() => message) },
    setAttribute: (name: string, value: string) => {
      attributes.set(name, value);
    },
    getAttribute: (name: string) => attributes.get(name) ?? null,
    insertAdjacentElement: vi.fn(),
    addEventListener: (_type: string, handler: () => void) => {
      handlers.push(handler);
    },
  };

  return { attributes, button, handlers, message };
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

describe("contact preview", () => {
  it("discloses the preview message on request", () => {
    const { attributes, button, handlers, message } = createFakeButton();
    const root = {
      querySelectorAll: vi.fn(() => [button]),
    } as unknown as ParentNode;

    setupContactPreview(root);

    expect(message.hidden).toBe(true);
    expect(message.textContent).toBe(CONTACT_PREVIEW_MESSAGE);
    expect(attributes.get("aria-expanded")).toBe("false");
    expect(attributes.get("aria-controls")).toBe(message.id);
    expect(button.insertAdjacentElement).toHaveBeenCalledWith(
      "afterend",
      message,
    );

    handlers[0]?.();
    expect(attributes.get("aria-expanded")).toBe("true");
    expect(message.hidden).toBe(false);

    handlers[0]?.();
    expect(attributes.get("aria-expanded")).toBe("false");
    expect(message.hidden).toBe(true);
  });

  it("gives every preview control its own message target", () => {
    const first = createFakeButton();
    const second = createFakeButton();
    const root = {
      querySelectorAll: vi.fn(() => [first.button, second.button]),
    } as unknown as ParentNode;

    setupContactPreview(root);

    expect(first.message.id).not.toBe(second.message.id);
    expect(first.attributes.get("aria-controls")).toBe(first.message.id);
    expect(second.attributes.get("aria-controls")).toBe(second.message.id);
  });

  it("never implies a call, message or quote was delivered", () => {
    expect(CONTACT_PREVIEW_MESSAGE).toMatch(/not configured/i);
    expect(CONTACT_PREVIEW_MESSAGE).not.toMatch(
      /\b(sent|delivered|received|submitted|thank you|success)\b/i,
    );
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
