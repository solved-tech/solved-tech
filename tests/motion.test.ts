import { describe, expect, it, vi } from "vitest";
import {
  CONTACT_PREVIEW_MESSAGE,
  setupContactPreview,
  setupRevealMotion,
} from "../src/main";

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

    handlers[0]?.();
    expect(attributes.get("aria-expanded")).toBe("true");
    expect(message.hidden).toBe(false);

    handlers[0]?.();
    expect(attributes.get("aria-expanded")).toBe("false");
    expect(message.hidden).toBe(true);
  });

  it("never implies a call, message or quote was delivered", () => {
    expect(CONTACT_PREVIEW_MESSAGE).toMatch(/not configured/i);
    expect(CONTACT_PREVIEW_MESSAGE).not.toMatch(
      /\b(sent|delivered|received|submitted|thank you|success)\b/i,
    );
  });
});
