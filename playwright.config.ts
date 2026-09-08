import { defineConfig } from "@playwright/test";

const BASE_URL = "http://127.0.0.1:4173/solved-tech/";

type Profile = {
  name: string;
  width: number;
  height: number;
  isPhone?: boolean;
};

const CHROMIUM_PROFILES: Profile[] = [
  { name: "stress-compact", width: 320, height: 568, isPhone: true },
  { name: "uk-phone-compact", width: 360, height: 780, isPhone: true },
  { name: "uk-phone-standard", width: 390, height: 844, isPhone: true },
  { name: "uk-phone-large", width: 414, height: 896, isPhone: true },
  { name: "phone-landscape", width: 844, height: 390, isPhone: true },
  { name: "tablet-portrait", width: 768, height: 1024 },
  { name: "tablet-landscape", width: 1024, height: 768 },
  { name: "compact-laptop", width: 1366, height: 768 },
  { name: "uk-desktop", width: 1536, height: 864 },
  { name: "full-hd", width: 1920, height: 1080 },
  { name: "wide-desktop", width: 2560, height: 1440 },
];

const WEBKIT_PROFILES: Profile[] = [
  { name: "webkit-stress-compact", width: 320, height: 568, isPhone: true },
  { name: "webkit-uk-phone-standard", width: 390, height: 844, isPhone: true },
];

const profileUse = (profile: Profile) => {
  const viewport = { width: profile.width, height: profile.height };

  if (!profile.isPhone) {
    return { viewport };
  }

  return {
    viewport,
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  };
};

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: "line",
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 4173",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    ...CHROMIUM_PROFILES.map((profile) => ({
      name: profile.name,
      use: {
        browserName: "chromium" as const,
        ...profileUse(profile),
      },
    })),
    ...WEBKIT_PROFILES.map((profile) => ({
      name: profile.name,
      use: {
        browserName: "webkit" as const,
        ...profileUse(profile),
      },
    })),
  ],
});
