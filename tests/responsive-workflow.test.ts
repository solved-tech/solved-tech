import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const WORKFLOW_PATH = new URL(
  "../.github/workflows/responsive.yml",
  import.meta.url,
);

const loadWorkflow = () => readFileSync(WORKFLOW_PATH, "utf8");

type YamlLine = { indent: number; text: string; index: number };

const parseLines = (yaml: string): YamlLine[] =>
  yaml.split("\n").map((text, index) => ({
    indent: text.match(/^(\s*)/)?.[1].length ?? 0,
    text,
    index,
  }));

const findKeyLine = (
  lines: YamlLine[],
  key: string,
  parentIndent = -1,
): YamlLine | undefined =>
  lines.find((line) => {
    if (parentIndent >= 0 && line.indent <= parentIndent) {
      return false;
    }

    return new RegExp(`^\\s*${key}:\\s*(.*)$`).test(line.text);
  });

const extractBlockLines = (
  lines: YamlLine[],
  startLine: YamlLine,
): string[] => {
  const blockLines = [startLine.text];

  for (let i = startLine.index + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.text.trim() === "") {
      blockLines.push(line.text);
      continue;
    }

    if (line.indent <= startLine.indent) {
      break;
    }

    blockLines.push(line.text);
  }

  return blockLines;
};

const extractBlock = (lines: YamlLine[], startLine: YamlLine): string =>
  extractBlockLines(lines, startLine).join("\n");

const extractNestedBlock = (
  yaml: string,
  keys: string[],
): string | undefined => {
  const lines = parseLines(yaml);
  let parentIndent = -1;
  let block = yaml;

  for (const key of keys) {
    const scope = parseLines(block);
    const keyLine = findKeyLine(scope, key, parentIndent);
    if (!keyLine) {
      return undefined;
    }

    block = extractBlock(scope, keyLine);
    parentIndent = keyLine.indent;
  }

  return block;
};

const extractSteps = (yaml: string): string[] => {
  const lines = parseLines(yaml);
  const stepsLine = findKeyLine(lines, "steps");
  if (!stepsLine) {
    return [];
  }

  const stepIndent = stepsLine.indent + 2;
  const steps: string[] = [];
  let currentStep: string[] = [];

  for (let i = stepsLine.index + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.text.trim() === "") {
      continue;
    }

    if (line.indent <= stepsLine.indent) {
      break;
    }

    if (line.indent === stepIndent && line.text.trimStart().startsWith("- ")) {
      if (currentStep.length) {
        steps.push(currentStep.join("\n"));
      }

      currentStep = [line.text];
      continue;
    }

    if (currentStep.length && line.indent > stepIndent) {
      currentStep.push(line.text);
    }
  }

  if (currentStep.length) {
    steps.push(currentStep.join("\n"));
  }

  return steps;
};

const findStepByUses = (steps: string[], uses: string): string | undefined =>
  steps.find((step) => step.includes(`uses: ${uses}`));

const listItems = (block: string): string[] =>
  block
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim());

describe("responsive pull-request workflow", () => {
  const workflow = loadWorkflow();
  const steps = extractSteps(workflow);

  it("is named Responsive UI", () => {
    expect(workflow).toMatch(/^name:\s*Responsive UI\s*$/m);
  });

  it("runs on pull requests targeting main and manual dispatch", () => {
    const onBlock = extractNestedBlock(workflow, ["on"]);
    expect(onBlock).toBeDefined();

    const pullRequestBlock = extractNestedBlock(workflow, ["on", "pull_request"]);
    expect(pullRequestBlock).toBeDefined();

    const branchesBlock = extractNestedBlock(workflow, [
      "on",
      "pull_request",
      "branches",
    ]);
    expect(branchesBlock).toBeDefined();
    expect(listItems(branchesBlock!)).toContain("main");

    expect(onBlock).toMatch(/^\s*workflow_dispatch:\s*$/m);
  });

  it("requests read-only contents permission", () => {
    expect(workflow).toMatch(/^\s*permissions:\s*$/m);
    expect(workflow).toMatch(/^\s*contents:\s*read\s*$/m);
  });

  it("cancels in-progress runs for the same workflow and ref", () => {
    expect(workflow).toMatch(/^\s*concurrency:\s*$/m);
    expect(workflow).toMatch(
      /group:\s*\$\{\{\s*github\.workflow\s*\}\}-\$\{\{\s*github\.ref\s*\}\}/,
    );
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
    const installLines = workflow
      .split("\n")
      .filter((line) => line.includes("playwright install"));

    expect(installLines).toHaveLength(1);

    const installCommand = installLines[0].match(/run:\s*(.+)/)?.[1]?.trim();
    expect(installCommand).toBe(
      "npx playwright install --with-deps chromium webkit",
    );

    const installCommands = workflow
      .split("\n")
      .filter((line) => /run:\s*.*install/.test(line));
    for (const line of installCommands) {
      expect(line).not.toMatch(/firefox/);
    }
  });

  it("runs the responsive Playwright matrix", () => {
    expect(workflow).toMatch(/run:\s*npm run test:responsive/);
  });

  it("uploads test-results only on failure", () => {
    const uploadStep = findStepByUses(steps, "actions/upload-artifact@v4");
    expect(uploadStep).toBeDefined();
    expect(uploadStep).toMatch(/if:\s*failure\(\)/);
    expect(uploadStep).toMatch(/name:\s*playwright-responsive-results/);
    expect(uploadStep).toMatch(/path:\s*test-results/);
    expect(uploadStep).toMatch(/retention-days:\s*5/);
  });

  it("does not configure, upload, or deploy GitHub Pages", () => {
    expect(workflow).not.toMatch(/actions\/configure-pages/);
    expect(workflow).not.toMatch(/actions\/upload-pages-artifact/);
    expect(workflow).not.toMatch(/actions\/deploy-pages/);
  });
});
