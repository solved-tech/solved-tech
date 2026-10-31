import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { inflateSync } from "node:zlib";
import { describe, expect, it } from "vitest";

const root = new URL("..", import.meta.url);
const BRAND_MARK_SHA256 = "411429d662a276bfa462a75e75ba47846be23a84f34b4732e7e5e8a157b9e1cf";
const SCALED_MARK_WIDTH = 128;

type RgbaImage = {
  width: number;
  height: number;
  pixels: Uint8Array;
};

type PngFilter = 0 | 1 | 2 | 3 | 4;

const sha256 = (bytes: Uint8Array): string => createHash("sha256").update(bytes).digest("hex");

const readBytes = (path: string): Uint8Array => Uint8Array.from(readFileSync(new URL(path, root)));

const assertFilter = (value: number): PngFilter => {
  if (value === 0 || value === 1 || value === 2 || value === 3 || value === 4) return value;
  throw new Error(`unsupported png filter ${value}`);
};

const paeth = (left: number, up: number, upLeft: number): number => {
  const estimate = left + up - upLeft;
  const distanceLeft = Math.abs(estimate - left);
  const distanceUp = Math.abs(estimate - up);
  const distanceUpLeft = Math.abs(estimate - upLeft);
  if (distanceLeft <= distanceUp && distanceLeft <= distanceUpLeft) return left;
  if (distanceUp <= distanceUpLeft) return up;
  return upLeft;
};

const unfilterRow = (filter: PngFilter, row: Uint8Array, previous: Uint8Array, bytesPerPixel: number): void => {
  switch (filter) {
    case 0:
      return;
    case 1:
      for (let index = 0; index < row.length; index += 1) {
        const left = index >= bytesPerPixel ? row[index - bytesPerPixel] : 0;
        row[index] = (row[index] + left) & 255;
      }
      return;
    case 2:
      for (let index = 0; index < row.length; index += 1) {
        row[index] = (row[index] + previous[index]) & 255;
      }
      return;
    case 3:
      for (let index = 0; index < row.length; index += 1) {
        const left = index >= bytesPerPixel ? row[index - bytesPerPixel] : 0;
        row[index] = (row[index] + Math.floor((left + previous[index]) / 2)) & 255;
      }
      return;
    case 4:
      for (let index = 0; index < row.length; index += 1) {
        const left = index >= bytesPerPixel ? row[index - bytesPerPixel] : 0;
        const upLeft = index >= bytesPerPixel ? previous[index - bytesPerPixel] : 0;
        row[index] = (row[index] + paeth(left, previous[index], upLeft)) & 255;
      }
      return;
    default: {
      const unexpected: never = filter;
      throw new Error(`unsupported png filter ${String(unexpected)}`);
    }
  }
};

const decodeRgbaPng = (bytes: Uint8Array): RgbaImage => {
  const signature = [137, 80, 78, 71, 13, 10, 26, 10];
  if (bytes.length < 8 || signature.some((byte, index) => bytes[index] !== byte)) {
    throw new Error("mark is not a png");
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 8;
  let width = 0;
  let height = 0;
  const idat: Uint8Array[] = [];

  while (offset + 8 <= bytes.length) {
    const length = view.getUint32(offset);
    const type = String.fromCharCode(
      bytes[offset + 4],
      bytes[offset + 5],
      bytes[offset + 6],
      bytes[offset + 7],
    );
    const start = offset + 8;
    const end = start + length;
    if (end + 4 > bytes.length) throw new Error("truncated png chunk");
    const data = bytes.subarray(start, end);

    if (type === "IHDR") {
      width = view.getUint32(start);
      height = view.getUint32(start + 4);
      const bitDepth = bytes[start + 8];
      const colorType = bytes[start + 9];
      const interlace = bytes[start + 12];
      if (bitDepth !== 8 || colorType !== 6 || interlace !== 0) {
        throw new Error("mark png must be 8-bit rgba and not interlaced");
      }
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") {
      break;
    }

    offset = end + 4;
  }

  if (width === 0 || height === 0 || idat.length === 0) throw new Error("png is missing image data");

  const compressed = new Uint8Array(idat.reduce((sum, chunk) => sum + chunk.length, 0));
  let cursor = 0;
  for (const chunk of idat) {
    compressed.set(chunk, cursor);
    cursor += chunk.length;
  }

  const inflated = inflateSync(compressed);
  const bytesPerPixel = 4;
  const stride = width * bytesPerPixel;
  const expected = height * (stride + 1);
  if (inflated.length !== expected) throw new Error("png image data has the wrong length");

  const pixels = new Uint8Array(width * height * bytesPerPixel);
  let previous = new Uint8Array(stride);
  for (let y = 0; y < height; y += 1) {
    const rowStart = y * (stride + 1);
    const filter = assertFilter(inflated[rowStart]);
    const row = inflated.subarray(rowStart + 1, rowStart + 1 + stride);
    const reconstructed = new Uint8Array(row);
    unfilterRow(filter, reconstructed, previous, bytesPerPixel);
    pixels.set(reconstructed, y * stride);
    previous = reconstructed;
  }

  return { width, height, pixels };
};

type ContentBox = {
  left: number;
  top: number;
  width: number;
  height: number;
};

const contentBox = (image: RgbaImage): ContentBox => {
  let left = image.width;
  let top = image.height;
  let right = -1;
  let bottom = -1;

  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      const alpha = image.pixels[(y * image.width + x) * 4 + 3];
      if (alpha === 0) continue;
      if (x < left) left = x;
      if (y < top) top = y;
      if (x > right) right = x;
      if (y > bottom) bottom = y;
    }
  }

  if (right < left || bottom < top) throw new Error("mark has no ink");
  return { left, top, width: right - left + 1, height: bottom - top + 1 };
};

const sample = (image: RgbaImage, x: number, y: number, channel: number): number => {
  const clampedX = Math.min(image.width - 1, Math.max(0, x));
  const clampedY = Math.min(image.height - 1, Math.max(0, y));
  return image.pixels[(clampedY * image.width + clampedX) * 4 + channel];
};

const bilinear = (image: RgbaImage, x: number, y: number): [number, number, number, number] => {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = x0 + 1;
  const y1 = y0 + 1;
  const tx = x - x0;
  const ty = y - y0;
  const pixel = [0, 0, 0, 0] as [number, number, number, number];

  for (let channel = 0; channel < 4; channel += 1) {
    const top = sample(image, x0, y0, channel) * (1 - tx) + sample(image, x1, y0, channel) * tx;
    const bottom = sample(image, x0, y1, channel) * (1 - tx) + sample(image, x1, y1, channel) * tx;
    pixel[channel] = Math.round(top * (1 - ty) + bottom * ty);
  }

  return pixel;
};

const crop = (image: RgbaImage, box: ContentBox): RgbaImage => {
  const pixels = new Uint8Array(box.width * box.height * 4);
  for (let y = 0; y < box.height; y += 1) {
    const source = ((box.top + y) * image.width + box.left) * 4;
    pixels.set(image.pixels.subarray(source, source + box.width * 4), y * box.width * 4);
  }
  return { width: box.width, height: box.height, pixels };
};

const scaleContentToWidth = (image: RgbaImage, width: number): RgbaImage => {
  const cropped = crop(image, contentBox(image));
  const height = Math.max(1, Math.round((cropped.height * width) / cropped.width));
  const pixels = new Uint8Array(width * height * 4);

  for (let y = 0; y < height; y += 1) {
    const sourceY = ((y + 0.5) * cropped.height) / height - 0.5;
    for (let x = 0; x < width; x += 1) {
      const sourceX = ((x + 0.5) * cropped.width) / width - 0.5;
      const pixel = bilinear(cropped, sourceX, sourceY);
      const offset = (y * width + x) * 4;
      pixels[offset] = pixel[0];
      pixels[offset + 1] = pixel[1];
      pixels[offset + 2] = pixel[2];
      pixels[offset + 3] = pixel[3];
    }
  }

  return { width, height, pixels };
};

const compareMarks = (original: RgbaImage, shipped: RgbaImage): { maxChannelDelta: number; iou: number } => {
  if (original.width !== shipped.width || original.height !== shipped.height) {
    throw new Error(
      `scaled marks differ in size ${original.width}x${original.height} vs ${shipped.width}x${shipped.height}`,
    );
  }

  let maxChannelDelta = 0;
  let intersection = 0;
  let union = 0;

  for (let index = 0; index < original.pixels.length; index += 4) {
    for (let channel = 0; channel < 4; channel += 1) {
      const delta = Math.abs(original.pixels[index + channel] - shipped.pixels[index + channel]);
      if (delta > maxChannelDelta) maxChannelDelta = delta;
    }
    const originalInk = original.pixels[index + 3] > 0;
    const shippedInk = shipped.pixels[index + 3] > 0;
    if (originalInk && shippedInk) intersection += 1;
    if (originalInk || shippedInk) union += 1;
  }

  return { maxChannelDelta, iou: union === 0 ? 1 : intersection / union };
};

const stampText = (ink: string): string => ink.replace(/<[^>]*>/g, "");

describe("SAFE ST mark", () => {
  it("matches the brand original inside the content box at 128px wide", () => {
    const originalBytes = readBytes("tests/fixtures/brand/st-logo-original-2048.png");
    const shippedBytes = readBytes("samples/void-frame/assets/st-logo-mark.png");
    const originalHash = sha256(originalBytes);
    const shippedHash = sha256(shippedBytes);

    expect(originalHash).toBe(BRAND_MARK_SHA256);
    expect(shippedHash).not.toBe(originalHash);

    const original = scaleContentToWidth(decodeRgbaPng(originalBytes), SCALED_MARK_WIDTH);
    const shipped = scaleContentToWidth(decodeRgbaPng(shippedBytes), SCALED_MARK_WIDTH);
    const { maxChannelDelta, iou } = compareMarks(original, shipped);

    expect(original.width).toBe(SCALED_MARK_WIDTH);
    expect({ maxChannelDelta, iou }).toEqual({ maxChannelDelta: 0, iou: 1 });
  });
});

describe("void / frame stamps", () => {
  it("separates the short code from the full name for screen readers", () => {
    const html = readFileSync(new URL("../samples/void-frame/index.html", import.meta.url), "utf8");
    const css = readFileSync(new URL("../samples/void-frame/styles.css", import.meta.url), "utf8");
    expect(css).toContain(".ink > .visually-hidden");
    const inks = [...html.matchAll(/<span class="ink">(.*?)<\/span>\s*<\/button>/g)].map((match) => match[1] ?? "");

    expect(inks).toEqual([
      '<span class="s" aria-hidden="true">001</span><span class="visually-hidden"> </span><span class="f">001 / brutalism</span>',
      '<span class="s" aria-hidden="true">002</span><span class="visually-hidden"> </span><span class="f">002 / flesh</span>',
      '<span class="s" aria-hidden="true">003</span><span class="visually-hidden"> </span><span class="f">003 / wasteland</span>',
      '<span class="s" aria-hidden="true">004</span><span class="visually-hidden"> </span><span class="f">004 / archive</span>',
    ]);

    for (const ink of inks) {
      const text = stampText(ink);
      expect(text).not.toMatch(/\d{3}\d{3}/);
      expect(text).toMatch(/^\d{3} \d{3} \//);
    }
  });
});
