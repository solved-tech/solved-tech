import { describe, expect, it } from "vitest";
import {
  detectLocale,
  isSearchBot,
  localeFromPath,
  localeRedirectPath,
  localizePath,
  parseStoredLocale,
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

  it("recognises a saved choice and ignores anything else", () => {
    expect(parseStoredLocale("ro")).toBe("ro");
    expect(parseStoredLocale("en")).toBe("en");
    expect(parseStoredLocale("fr")).toBeNull();
    expect(parseStoredLocale(null)).toBeNull();
  });

  it("does not redirect search bots", () => {
    expect(isSearchBot("Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)", false)).toBe(true);
    expect(isSearchBot("Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)", false)).toBe(true);
    expect(isSearchBot("Mozilla/5.0", true)).toBe(true);

    const target = localeRedirectPath({
      pathname: "/",
      search: "",
      hash: "",
      stored: null,
      detected: "ro",
      isBot: true,
    });

    expect(target).toBeNull();
  });

  it("sends a first-time Romanian visitor from English to the matching Romanian URL", () => {
    expect(
      localeRedirectPath({
        pathname: "/services/bug-fixing/",
        search: "?from=ad",
        hash: "#approach",
        stored: null,
        detected: "ro",
        isBot: false,
      }),
    ).toBe("/ro/services/bug-fixing/?from=ad#approach");
  });

  it("does not bounce a Romanian URL back to English", () => {
    expect(
      localeRedirectPath({
        pathname: "/ro/",
        search: "",
        hash: "",
        stored: null,
        detected: "en",
        isBot: false,
      }),
    ).toBeNull();
  });

  it("lets a remembered choice override detection in either direction", () => {
    expect(
      localeRedirectPath({
        pathname: "/",
        search: "",
        hash: "",
        stored: "en",
        detected: "ro",
        isBot: false,
      }),
    ).toBeNull();

    expect(
      localeRedirectPath({
        pathname: "/privacy/",
        search: "",
        hash: "",
        stored: "ro",
        detected: "en",
        isBot: false,
      }),
    ).toBe("/ro/privacy/");

    expect(
      localeRedirectPath({
        pathname: "/ro/services/automation/",
        search: "",
        hash: "",
        stored: "en",
        detected: "ro",
        isBot: false,
      }),
    ).toBe("/services/automation/");
  });

  it("stays put when the page already matches the choice", () => {
    expect(
      localeRedirectPath({
        pathname: "/ro/",
        search: "",
        hash: "#team",
        stored: "ro",
        detected: "en",
        isBot: false,
      }),
    ).toBeNull();
  });
});
