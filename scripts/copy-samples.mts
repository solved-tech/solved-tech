import { cpSync, existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const source = resolve(import.meta.dirname, "../samples");
const target = resolve(import.meta.dirname, "../dist/samples");

if (!existsSync(source)) {
  throw new Error("Missing samples directory.");
}

const slugs = readdirSync(source, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

if (slugs.length === 0) {
  throw new Error("No sample homepages to copy.");
}

cpSync(source, target, { recursive: true });
console.log(`copied ${slugs.length} sample homepages`);
