import { describe, expect, it } from "vitest";
import {
  cachedCountryValue,
  COUNTRY_CACHE_KEY,
  countryFromTrace,
  detectLocale,
  isSearchBot,
  LOCALE_STORAGE_KEY,
  localeFromPath,
  localeRedirectPath,
  localizePath,
  lookupCountry,
  parseStoredLocale,
  rememberLocale,
  rewriteRomanianDevPath,
} from "../src/locale";
import { redirectForLocale } from "../src/locale-client";

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
  it("selects Romanian only for an IP country of RO", () => {
    expect(detectLocale("RO")).toBe("ro");
    expect(detectLocale("GB")).toBe("en");
    expect(detectLocale("US")).toBe("en");
    expect(detectLocale(null)).toBe("en");
    expect(detectLocale("")).toBe("en");
  });

  it("reads only the country code from a Cloudflare trace", () => {
    expect(countryFromTrace("ip=1.2.3.4\nloc=RO\ncolo=OTP\n")).toBe("RO");
    expect(countryFromTrace("loc=gb\n")).toBe("GB");
    expect(countryFromTrace("loc=T1\n")).toBeNull();
    expect(countryFromTrace("ip=1.2.3.4\n")).toBeNull();
    expect(cachedCountryValue("RO")).toBe("RO");
    expect(cachedCountryValue("GB")).toBe("OTHER");
    expect(cachedCountryValue(null)).toBe("OTHER");
  });

  it("remembers a language chosen from the menu", () => {
    const saved = new Map<string, string>();

    rememberLocale(
      {
        setItem: (key, value) => {
          saved.set(key, value);
        },
      },
      "ro",
    );

    expect(parseStoredLocale(saved.get(LOCALE_STORAGE_KEY) ?? null)).toBe("ro");
    expect(parseStoredLocale("fr")).toBeNull();
    expect(parseStoredLocale(null)).toBeNull();
  });

  it("returns no country when the lookup times out", async () => {
    const fetchImpl: typeof fetch = (_input, init) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => {
          reject(new DOMException("The operation was aborted.", "AbortError"));
        });
      });

    await expect(lookupCountry(fetchImpl, 15)).resolves.toBeNull();
  });

  it("returns the country from a successful lookup and ignores the IP", async () => {
    const fetchImpl: typeof fetch = async () =>
      new Response("ip=203.0.113.8\nloc=RO\n", { status: 200 });

    await expect(lookupCountry(fetchImpl, 200)).resolves.toBe("RO");
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

  it("does not auto-redirect after a manual language choice", () => {
    expect(
      localeRedirectPath({
        pathname: "/",
        search: "",
        hash: "",
        detected: "ro",
        isBot: false,
        manual: true,
      }),
    ).toBeNull();
    expect(
      localeRedirectPath({
        pathname: "/ro/privacy/",
        search: "",
        hash: "",
        detected: "en",
        isBot: false,
        manual: true,
      }),
    ).toBeNull();
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

const memoryStorage = (): Storage => {
  const data = new Map<string, string>();

  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => [...data.keys()][index] ?? null,
    removeItem: (key) => {
      data.delete(key);
    },
    setItem: (key, value) => {
      data.set(key, value);
    },
  };
};

const visitor = (
  pathname: string,
  options: { userAgent?: string; webdriver?: boolean; stored?: string } = {},
) => {
  let replaced: string | null = null;
  const localStorage = memoryStorage();
  const sessionStorage = memoryStorage();

  if (options.stored) {
    localStorage.setItem(LOCALE_STORAGE_KEY, options.stored);
  }

  const view = {
    localStorage,
    sessionStorage,
    navigator: {
      userAgent: options.userAgent ?? "Mozilla/5.0",
      webdriver: options.webdriver ?? false,
    },
    location: {
      pathname,
      search: "",
      hash: "",
      replace: (url: string) => {
        replaced = url;
      },
    },
  } as unknown as Window;

  return {
    view,
    sessionStorage,
    replaced: () => replaced,
  };
};

describe("visitor redirect", () => {
  it("does not redirect crawlers or look up their country", async () => {
    const { view, replaced } = visitor("/", {
      userAgent: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    });
    let calls = 0;

    await redirectForLocale(view, async () => {
      calls += 1;
      return "RO";
    });

    expect(calls).toBe(0);
    expect(replaced()).toBeNull();
  });

  it("keeps a manual language choice and skips the country lookup", async () => {
    const { view, replaced } = visitor("/", { stored: "en" });
    let calls = 0;

    await redirectForLocale(view, async () => {
      calls += 1;
      return "RO";
    });

    expect(calls).toBe(0);
    expect(replaced()).toBeNull();
  });

  it("sends a Romanian IP from English to Romanian and remembers the country for the tab", async () => {
    const { view, replaced, sessionStorage } = visitor("/");

    await redirectForLocale(view, async () => "RO");

    expect(replaced()).toBe("/ro/");
    expect(sessionStorage.getItem(COUNTRY_CACHE_KEY)).toBe("RO");
  });

  it("does not bounce back to Romanian after a failed lookup", async () => {
    const first = visitor("/ro/");

    await redirectForLocale(first.view, async () => null);

    expect(first.replaced()).toBe("/");
    expect(first.sessionStorage.getItem(COUNTRY_CACHE_KEY)).toBe("OTHER");

    const second = visitor("/");
    second.sessionStorage.setItem(COUNTRY_CACHE_KEY, "OTHER");
    let calls = 0;

    await redirectForLocale(second.view, async () => {
      calls += 1;
      return "RO";
    });

    expect(calls).toBe(0);
    expect(second.replaced()).toBeNull();
  });
});
