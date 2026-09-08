import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const WORKFLOW_PATH = new URL(
  "../.github/workflows/responsive.yml",
  import.meta.url,
);

const loadWorkflow = () => readFileSync(WORKFLOW_PATH, "utf8");

describe("responsive pull-request workflow", () => {
  const workflow = loadWorkflow();

  it("is named Responsive UI", () => {
    expect(workflow).toMatch(/^name:\s*Responsive UI\s*$/m);
  });

  it("runs on pull requests targeting main and manual dispatch", () => {
    expect(workflow).toMatch(/^\s*pull_request:\s*$/m);
    expect(workflow).toMatch(/^\s*branches:\s*$/m);
    expect(workflow).toMatch(/^\s*-\s*main\s*$/m);
    expect(workflow).toMatch(/^\s*workflow_dispatch:\s*$/m);
  });

  it("requests read-only contents permission", () => {
    expect(workflow).toMatch(/^\s*permissions:\s*$/m);
    expect(workflow).toMatch(/^\s*contents:\s*read\s*$/m);
  });

  it("cancels in-progress runs for the same workflow and ref", () => {
    expect(workflow).toMatch(/^\s*concurrency:\s*$/m);
    expect(workflow).toMatch(/group:\s*\$\{\{\s*github\.workflow\s*\}\}-\$\{\{\s*github\.ref\s*\}\}/);
    expect(workflow).toMatch(/^\s*cancel-in-progress:\s*true\s*$/m);
  });

  it("runs a responsive job on ubuntu-latest", () => {
    expect(workflow).toMatch(/^\s*responsive:\s*$/m);
    expect(workflow).toMatch(/^\s*runs-on:\s*ubuntu-latest\s*$/m);
  });

  it("checks out the repository with actions/checkout@v6", () => {
    expect(workflow).toMatch(/uses:\s*actions\/checkout@v6/);
  });

  it("sets up Node from .nvmrc with npm cache", () => {
    expect(workflow).toMatch(/uses:\s*actions\/setup-node@v6/);
    expect(workflow).toMatch(/node-version-file:\s*\.nvmrc/);
    expect(workflow).toMatch(/cache:\s*npm/);
  });

  it("installs dependencies with npm ci", () => {
    expect(workflow).toMatch(/run:\s*npm ci/);
  });

  it("installs Chromium and WebKit with OS dependencies", () => {
    expect(workflow).toMatch(
      /run:\s*npx playwright install --with-deps chromium webkit/,
    );
  });

  it("runs the responsive Playwright matrix", () => {
    expect(workflow).toMatch(/run:\s*npm run test:responsive/);
  });

  it("uploads test-results only on failure", () => {
    expect(workflow).toMatch(/if:\s*failure\(\)/);
    expect(workflow).toMatch(/uses:\s*actions\/upload-artifact@v4/);
    expect(workflow).toMatch(/name:\s*playwright-responsive-results/);
    expect(workflow).toMatch(/path:\s*test-results/);
    expect(workflow).toMatch(/retention-days:\s*5/);
  });

  it("does not configure, upload, or deploy GitHub Pages", () => {
    expect(workflow).not.toMatch(/actions\/configure-pages/);
    expect(workflow).not.toMatch(/actions\/upload-pages-artifact/);
    expect(workflow).not.toMatch(/actions\/deploy-pages/);
  });
});
