import { readFileSync } from "node:fs";
import { expect, it } from "vitest";

const packageJson = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
) as { scripts?: Record<string, string> };
const configUrl = new URL("../vitest.config.ts", import.meta.url);
const loadConfig = (): string | undefined => {
  try {
    return readFileSync(configUrl, "utf8");
  } catch {
    return undefined;
  }
};

it("uses normal Vitest discovery", () => {
  expect(packageJson.scripts?.test).toBe("vitest run");
});

it("excludes only Playwright tests in addition to Vitest defaults", () => {
  const config = loadConfig();
  expect(config).toBeDefined();
  if (!config) {
    return;
  }

  expect(config).toContain(
    'import { configDefaults, defineConfig } from "vitest/config";',
  );
  expect(config).toMatch(
    /exclude:\s*\[\s*\.\.\.configDefaults\.exclude,\s*"tests\/e2e\/\*\*"\s*\]/,
  );
});
