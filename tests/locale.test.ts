import { describe, expect, it } from "vitest";
import {
  clearStoredLocale,
  detectLocale,
  isSearchBot,
  LOCALE_STORAGE_KEY,
  localeFromPath,
  localeRedirectPath,
  localizePath,
  rewriteRomanianDevPath,
} from "../src/locale";

describe("locale paths", () => {
  it("keeps English at the existing URLs and Romanian under /ro/", () => {
    expect(localizePath("/", "en")).toBe("/");
    expect(localizePath("/", "ro")).toBe("/ro/");
    expect(localizePath("/privacy/", "ro")).toBe("/ro/privacy/");
    expect(localizePath("/services/bug-fixing/", "ro")).toBe("/ro/services/bug-fixing/");
    expect(localizePath("/ro/services/bug-fixing/", "en")).toBe("/services/bug-fixing/");
    expect(localizePath("/ro/", "ro")).toBe("/ro/");
    expect(localeFromPath("/ro/privacy/")).toBe("ro");
    expect(localeFromPath("/privacy/")).toBe("en");
    expect(localeFromPath("/ro")).toBe("ro");
  });

  it("rewrites Romanian dev URLs onto the existing shells", () => {
    expect(rewriteRomanianDevPath("/ro/")).toBe("/index.html");
    expect(rewriteRomanianDevPath("/ro")).toBe("/index.html");
    expect(rewriteRomanianDevPath("/ro/privacy/")).toBe("/privacy/index.html");
    expect(rewriteRomanianDevPath("/ro/services/vorbio")).toBe("/services/vorbio/index.html");
    expect(rewriteRomanianDevPath("/ro/services/websites-online-shops/")).toBeNull();
    expect(rewriteRomanianDevPath("/services/vorbio/")).toBeNull();
  });
});

describe("locale detection", () => {
  it("treats Romanian browser language or the Bucharest timezone as Romania", () => {
    expect(detectLocale(["ro-RO", "en-GB"], "Europe/London")).toBe("ro");
    expect(detectLocale(["en-GB"], "Europe/Bucharest")).toBe("ro");
    expect(detectLocale(["ro"], "America/New_York")).toBe("ro");
    expect(detectLocale(["en-GB", "en"], "Europe/London")).toBe("en");
    expect(detectLocale(["en-GB"], "Europe/Chisinau")).toBe("en");
  });

  it("clears a previously saved language choice", () => {
    const removed: string[] = [];

    clearStoredLocale({
      removeItem: (key) => {
        removed.push(key);
      },
    });

    expect(removed).toEqual([LOCALE_STORAGE_KEY]);
  });

  it("does not redirect search bots", () => {
    expect(isSearchBot("Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)", false)).toBe(true);
    expect(isSearchBot("Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)", false)).toBe(true);
    expect(isSearchBot("Mozilla/5.0", true)).toBe(true);

    expect(
      localeRedirectPath({
        pathname: "/",
        search: "",
        hash: "",
        detected: "ro",
        isBot: true,
      }),
    ).toBeNull();
    expect(
      localeRedirectPath({
        pathname: "/ro/",
        search: "",
        hash: "",
        detected: "en",
        isBot: true,
      }),
    ).toBeNull();
  });

  it("sends a Romanian visitor from English to the matching Romanian URL", () => {
    expect(
      localeRedirectPath({
        pathname: "/services/bug-fixing/",
        search: "?from=ad",
        hash: "#approach",
        detected: "ro",
        isBot: false,
      }),
    ).toBe("/ro/services/bug-fixing/?from=ad#approach");
  });

  it("sends everyone else from a Romanian URL to the matching English URL", () => {
    expect(
      localeRedirectPath({
        pathname: "/ro/privacy/",
        search: "",
        hash: "",
        detected: "en",
        isBot: false,
      }),
    ).toBe("/privacy/");
  });

  it("stays put when the page already matches the detected language", () => {
    expect(
      localeRedirectPath({
        pathname: "/ro/",
        search: "",
        hash: "#team",
        detected: "ro",
        isBot: false,
      }),
    ).toBeNull();
    expect(
      localeRedirectPath({
        pathname: "/",
        search: "",
        hash: "",
        detected: "en",
        isBot: false,
      }),
    ).toBeNull();
  });
});
