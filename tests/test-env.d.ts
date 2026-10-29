declare module "node:fs" {
  export function readFileSync(path: URL): Uint8Array;
  export function readFileSync(path: URL, encoding: "utf8"): string;
  export function statSync(path: URL): { size: number };
  export function readdirSync(
    path: URL,
    options: { withFileTypes: true },
  ): Array<{ name: string; isDirectory(): boolean }>;
}
