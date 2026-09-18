import { chromium } from "playwright";
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

    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForSelector("h1");

    const csp = await page.evaluate(() =>
      document.querySelector('meta[http-equiv="Content-Security-Policy"]')?.getAttribute("content") ?? "",
    );
    const bodyBackground = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    if (!csp) {
      problems.push(`${url}: no Content-Security-Policy meta`);
    }
    if (bodyBackground === "rgba(0, 0, 0, 0)") {
      problems.push(`${url}: stylesheet did not apply (body background is transparent)`);
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
