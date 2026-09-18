import { chromium } from "@playwright/test";
import { preview } from "vite";

const server = await preview({ preview: { host: "127.0.0.1", port: 4174, strictPort: true }, logLevel: "error" });
const origin = server.resolvedUrls?.local[0];

if (!origin) {
  throw new Error("vite preview did not report a local URL.");
}

const paths = ["", "privacy/", "services/bug-fixing/", "services/software-development/", "services/automation/"];
const browser = await chromium.launch();
const problems: string[] = [];

try {
  for (const path of paths) {
    const page = await browser.newPage();
    const url = new URL(path, origin).toString();

    page.on("console", (message) => {
      if (message.type() === "error") {
        problems.push(`${url}: ${message.text()}`);
      }
    });
    page.on("pageerror", (error) => problems.push(`${url}: ${error.message}`));

    await page.exposeFunction("reportCspViolation", (detail: string) => {
      problems.push(`${url}: ${detail}`);
    });
    await page.addInitScript(() => {
      document.addEventListener("securitypolicyviolation", (event) => {
        const bridge = window as unknown as { reportCspViolation: (detail: string) => void };
        bridge.reportCspViolation(
          `CSP violation: ${event.violatedDirective} blocked ${event.blockedURI || "inline"}`,
        );
      });
    });

    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForSelector("h1");

    const csp = await page.evaluate(() =>
      document.querySelector('meta[http-equiv="Content-Security-Policy"]')?.getAttribute("content") ?? "",
    );
    const bodyBackground = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    const headerHeight = await page.evaluate(() =>
      document.documentElement.style.getPropertyValue("--header-height"),
    );

    if (!csp) {
      problems.push(`${url}: no Content-Security-Policy meta`);
    }
    if (bodyBackground === "rgba(0, 0, 0, 0)") {
      problems.push(`${url}: stylesheet did not apply (body background is transparent)`);
    }
    if (!headerHeight) {
      problems.push(`${url}: the module script did not run (--header-height is unset)`);
    }

    console.log(`checked ${url}`);
    await page.close();
  }
} finally {
  await browser.close();
  await server.close();
}

if (problems.length > 0) {
  console.error(problems.join("\n"));
  process.exit(1);
}

console.log("CSP check passed");
