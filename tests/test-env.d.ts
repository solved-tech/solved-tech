interface Buffer extends Uint8Array {
  toString(encoding?: "ascii", start?: number, end?: number): string;
  readUInt32BE(offset: number): number;
  subarray(start?: number, end?: number): Buffer;
}

declare const Buffer: {
  concat(list: readonly Uint8Array[]): Buffer;
};

declare module "node:crypto" {
  interface Hash {
    update(data: Uint8Array): Hash;
    digest(encoding: "hex"): string;
  }

  export function createHash(algorithm: "sha256"): Hash;
}

declare module "node:zlib" {
  export function inflateSync(data: Uint8Array): Uint8Array;
}

declare module "node:fs" {
  export function readFileSync(path: URL): Buffer;
  export function readFileSync(path: URL, encoding: "utf8"): string;
  export function statSync(path: URL): { size: number };
  export function readdirSync(
    path: URL,
    options: { withFileTypes: true },
  ): Array<{ name: string; isDirectory(): boolean }>;
}
