import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const WORKFLOW_PATH = new URL(
  "../.github/workflows/responsive.yml",
  import.meta.url,
);

const CHILD_INDENT = 2;

type YamlLine = { indent: number; text: string; index: number };

const loadWorkflow = () => readFileSync(WORKFLOW_PATH, "utf8");

const parseLines = (yaml: string): YamlLine[] =>
  yaml.split("\n").map((text, index) => ({
    indent: text.match(/^(\s*)/)?.[1].length ?? 0,
    text,
    index,
  }));

const keyPattern = (key: string) => new RegExp(`^\\s*${key}:\\s*(.*)$`);

const parseKey = (line: YamlLine): { key: string; value: string } | undefined => {
  const match = line.text.match(/^\s*([\w-]+):\s*(.*)$/);
  if (!match) {
    return undefined;
  }

  return { key: match[1], value: match[2].trim() };
};

const expectedChildIndent = (parent: YamlLine): number =>
  parent.indent + CHILD_INDENT;

const isWithinBlock = (
  lines: YamlLine[],
  parent: YamlLine,
  line: YamlLine,
): boolean => {
  if (line.index <= parent.index) {
    return false;
  }

  for (let i = parent.index + 1; i < lines.length; i++) {
    const candidate = lines[i];
    if (candidate.text.trim() === "") {
      continue;
    }

    if (candidate.indent <= parent.indent) {
      return false;
    }

    if (candidate.index === line.index) {
      return true;
    }
  }

  return false;
};

const extractBlockLines = (
  lines: YamlLine[],
  startLine: YamlLine,
): YamlLine[] => {
  const startPos = lines.indexOf(startLine);
  const blockLines = [startLine];

  for (let i = startPos + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.text.trim() === "") {
      continue;
    }

    if (line.indent <= startLine.indent) {
      break;
    }

    blockLines.push(line);
  }

  return blockLines;
};

const findTopLevelKey = (
  lines: YamlLine[],
  key: string,
): YamlLine | undefined =>
  lines.find((line) => line.indent === 0 && keyPattern(key).test(line.text));

const findDirectChildKey = (
  lines: YamlLine[],
  parent: YamlLine,
  key: string,
): YamlLine | undefined => {
  const childIndent = expectedChildIndent(parent);

  return lines.find(
    (line) =>
      isWithinBlock(lines, parent, line) &&
      line.indent === childIndent &&
      keyPattern(key).test(line.text),
  );
};

const getDirectListItems = (lines: YamlLine[], parent: YamlLine): string[] => {
  const childIndent = expectedChildIndent(parent);

  return lines
    .filter(
      (line) =>
        isWithinBlock(lines, parent, line) &&
        line.indent === childIndent &&
        line.text.trimStart().startsWith("- "),
    )
    .map((line) => line.text.trimStart().slice(2).trim());
};

const getDirectSequenceItems = (
  lines: YamlLine[],
  parent: YamlLine,
): YamlLine[][] => {
  const itemIndent = expectedChildIndent(parent);
  const items: YamlLine[][] = [];
  let current: YamlLine[] = [];

  for (let i = parent.index + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.text.trim() === "") {
      continue;
    }

    if (line.indent <= parent.indent) {
      break;
    }

    if (line.indent === itemIndent && line.text.trimStart().startsWith("- ")) {
      if (current.length) {
        items.push(current);
      }

      current = [line];
      continue;
    }

    if (current.length && line.indent > itemIndent) {
      current.push(line);
    }
  }

  if (current.length) {
    items.push(current);
  }

  return items;
};

const findDirectStepKey = (
  stepLines: YamlLine[],
  key: string,
): YamlLine | undefined => {
  const root = stepLines[0];
  const keyIndent = expectedChildIndent(root);

  return stepLines.find(
    (line) =>
      line.index > root.index &&
      line.indent === keyIndent &&
      keyPattern(key).test(line.text),
  );
};

const getDirectStepChildBlock = (
  stepLines: YamlLine[],
  key: string,
): YamlLine[] | undefined => {
  const keyLine = findDirectStepKey(stepLines, key);
  if (!keyLine) {
    return undefined;
  }

  return extractBlockLines(stepLines, keyLine);
};

const getDirectChildValue = (
  lines: YamlLine[],
  parent: YamlLine,
  key: string,
): string | undefined => {
  const child = findDirectChildKey(lines, parent, key);
  if (!child) {
    return undefined;
  }

  return parseKey(child)?.value;
};

const getStepDirectValue = (
  stepLines: YamlLine[],
  key: string,
): string | undefined => {
  const keyLine = findDirectStepKey(stepLines, key);
  if (!keyLine) {
    return undefined;
  }

  return parseKey(keyLine)?.value;
};

const findStepByDirectUses = (
  steps: YamlLine[][],
  uses: string,
): YamlLine[] | undefined =>
  steps.find((step) => getStepDirectValue(step, "uses") === uses);

const responsiveJobSteps = (workflow: string): YamlLine[][] => {
  const lines = parseLines(workflow);
  const jobs = findTopLevelKey(lines, "jobs");
  const responsive = jobs && findDirectChildKey(lines, jobs, "responsive");
  const steps = responsive && findDirectChildKey(lines, responsive, "steps");

  if (!steps) {
    return [];
  }

  return getDirectSequenceItems(lines, steps);
};

describe("responsive pull-request workflow", () => {
  const workflow = loadWorkflow();
  const lines = parseLines(workflow);
  const steps = responsiveJobSteps(workflow);

  it("is named Responsive UI", () => {
    expect(workflow).toMatch(/^name:\s*Responsive UI\s*$/m);
  });

  it("runs on pull requests targeting main and manual dispatch", () => {
    const on = findTopLevelKey(lines, "on");
    expect(on).toBeDefined();

    const pullRequest = findDirectChildKey(lines, on!, "pull_request");
    expect(pullRequest).toBeDefined();

    const branches = findDirectChildKey(lines, pullRequest!, "branches");
    expect(branches).toBeDefined();
    expect(getDirectListItems(lines, branches!)).toContain("main");

    expect(findDirectChildKey(lines, on!, "workflow_dispatch")).toBeDefined();
  });

  it("requests read-only contents permission", () => {
    const permissions = findTopLevelKey(lines, "permissions");
    expect(permissions).toBeDefined();
    expect(getDirectChildValue(lines, permissions!, "contents")).toBe("read");
  });

  it("cancels in-progress runs for the same workflow and ref", () => {
    const concurrency = findTopLevelKey(lines, "concurrency");
    expect(concurrency).toBeDefined();
    expect(getDirectChildValue(lines, concurrency!, "group")).toBe(
      "${{ github.workflow }}-${{ github.ref }}",
    );
    expect(getDirectChildValue(lines, concurrency!, "cancel-in-progress")).toBe(
      "true",
    );
  });

  it("runs a responsive job on ubuntu-latest", () => {
    const jobs = findTopLevelKey(lines, "jobs");
    const responsive = findDirectChildKey(lines, jobs!, "responsive");
    expect(responsive).toBeDefined();
    expect(getDirectChildValue(lines, responsive!, "runs-on")).toBe(
      "ubuntu-latest",
    );
  });

  it("checks out the repository with actions/checkout@v6", () => {
    const checkout = findStepByDirectUses(steps, "actions/checkout@v6");
    expect(checkout).toBeDefined();
  });

  it("sets up Node from .nvmrc with npm cache", () => {
    const setup = findStepByDirectUses(steps, "actions/setup-node@v6");
    expect(setup).toBeDefined();

    const withBlock = getDirectStepChildBlock(setup!, "with");
    expect(withBlock).toBeDefined();
    expect(getStepDirectValue(withBlock!, "node-version-file")).toBe(".nvmrc");
    expect(getStepDirectValue(withBlock!, "cache")).toBe("npm");
  });

  it("installs dependencies with npm ci", () => {
    const install = steps.find(
      (step) => getStepDirectValue(step, "run") === "npm ci",
    );
    expect(install).toBeDefined();
  });

  it("installs Chromium and WebKit with OS dependencies", () => {
    const installRuns = steps
      .map((step) => getStepDirectValue(step, "run"))
      .filter((run): run is string => run !== undefined);

    const playwrightInstalls = installRuns.filter((run) =>
      run.includes("playwright install"),
    );

    expect(playwrightInstalls).toHaveLength(1);
    expect(playwrightInstalls[0]).toBe(
      "npx playwright install --with-deps chromium webkit",
    );

    for (const run of installRuns.filter((command) => command.includes("install"))) {
      expect(run).not.toMatch(/firefox/);
    }
  });

  it("runs the responsive Playwright matrix", () => {
    const testStep = steps.find(
      (step) => getStepDirectValue(step, "run") === "npm run test:responsive",
    );
    expect(testStep).toBeDefined();
  });

  it("uploads test-results only on failure", () => {
    const uploadStep = findStepByDirectUses(steps, "actions/upload-artifact@v4");
    expect(uploadStep).toBeDefined();
    expect(getStepDirectValue(uploadStep!, "if")).toBe("failure()");
    expect(getStepDirectValue(uploadStep!, "uses")).toBe(
      "actions/upload-artifact@v4",
    );

    const withBlock = getDirectStepChildBlock(uploadStep!, "with");
    expect(withBlock).toBeDefined();
    expect(getStepDirectValue(withBlock!, "name")).toBe(
      "playwright-responsive-results",
    );
    expect(getStepDirectValue(withBlock!, "path")).toBe("test-results");
    expect(getStepDirectValue(withBlock!, "retention-days")).toBe("5");
  });

  it("does not configure, upload, or deploy GitHub Pages", () => {
    expect(workflow).not.toMatch(/actions\/configure-pages/);
    expect(workflow).not.toMatch(/actions\/upload-pages-artifact/);
    expect(workflow).not.toMatch(/actions\/deploy-pages/);
  });
});
