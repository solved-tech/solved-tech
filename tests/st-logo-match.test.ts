import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { inflateSync } from "node:zlib";
import { describe, expect, it } from "vitest";

const root = new URL("..", import.meta.url);

const CANONICAL = "tests/fixtures/brand/st-logo-original-2048.png";
const SAMPLE = "samples/void-frame/zoom/media/st-logo-mark.png";
/** Brand original `ig-logo-exact-2048-transparent.png`. */
const CANONICAL_SHA256 = "411429d662a276bfa462a75e75ba47846be23a84f34b4732e7e5e8a157b9e1cf";
const SCALE_WIDTH = 128;
const ALPHA_MIN = 1;

type Raster = {
  width: number;
  height: number;
  pixels: Uint8Array;
};

type ContentBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function readPng(path: string): Raster {
  const bytes = readFileSync(new URL(path, root));
  if (bytes[0] !== 0x89 || bytes.toString("ascii", 1, 4) !== "PNG") {
    throw new Error(`${path} is not a PNG`);
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let colorType = -1;
  const idat: Buffer[] = [];

  while (offset < bytes.length) {
    const length = bytes.readUInt32BE(offset);
    const type = bytes.toString("ascii", offset + 4, offset + 8);
    const data = bytes.subarray(offset + 8, offset + 8 + length);
    offset += 12 + length;
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      colorType = data[9] ?? -1;
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") {
      break;
    }
  }

  if (colorType !== 6) {
    throw new Error(`${path} must be RGBA`);
  }

  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * 4;
  const pixels = new Uint8Array(width * height * 4);
  let cursor = 0;
  const previous = new Uint8Array(stride);

  for (let y = 0; y < height; y += 1) {
    const filter = raw[cursor] ?? 0;
    cursor += 1;
    const row = raw.subarray(cursor, cursor + stride);
    cursor += stride;
    const current = pixels.subarray(y * stride, (y + 1) * stride);

    for (let i = 0; i < stride; i += 1) {
      const left = i >= 4 ? current[i - 4] ?? 0 : 0;
      const up = previous[i] ?? 0;
      const upLeft = i >= 4 ? previous[i - 4] ?? 0 : 0;
      const value = row[i] ?? 0;
      current[i] = (value + predictor(filter, left, up, upLeft)) & 255;
    }

    previous.set(current);
  }

  return { width, height, pixels };
}

function predictor(filter: number, left: number, up: number, upLeft: number): number {
  if (filter === 0) return 0;
  if (filter === 1) return left;
  if (filter === 2) return up;
  if (filter === 3) return Math.floor((left + up) / 2);
  if (filter === 4) {
    const estimate = left + up - upLeft;
    const distanceLeft = Math.abs(estimate - left);
    const distanceUp = Math.abs(estimate - up);
    const distanceUpLeft = Math.abs(estimate - upLeft);
    if (distanceLeft <= distanceUp && distanceLeft <= distanceUpLeft) return left;
    if (distanceUp <= distanceUpLeft) return up;
    return upLeft;
  }
  throw new Error(`unsupported PNG filter ${filter}`);
}

function contentBox(raster: Raster): ContentBox {
  let minX = raster.width;
  let minY = raster.height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < raster.height; y += 1) {
    for (let x = 0; x < raster.width; x += 1) {
      const alpha = raster.pixels[(y * raster.width + x) * 4 + 3] ?? 0;
      if (alpha < ALPHA_MIN) continue;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }

  if (maxX < minX || maxY < minY) {
    throw new Error("logo has no opaque pixels");
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

function crop(raster: Raster, box: ContentBox): Raster {
  const pixels = new Uint8Array(box.width * box.height * 4);
  for (let y = 0; y < box.height; y += 1) {
    const sourceStart = ((box.y + y) * raster.width + box.x) * 4;
    pixels.set(raster.pixels.subarray(sourceStart, sourceStart + box.width * 4), y * box.width * 4);
  }
  return { width: box.width, height: box.height, pixels };
}

/** Area-average the content crop. The target is the content size, never the full canvas. */
function scaleContent(source: Raster, targetWidth: number, targetHeight: number): Raster {
  const pixels = new Uint8Array(targetWidth * targetHeight * 4);

  for (let y = 0; y < targetHeight; y += 1) {
    const startY = Math.floor((y * source.height) / targetHeight);
    const endY = Math.max(startY + 1, Math.floor(((y + 1) * source.height) / targetHeight));
    for (let x = 0; x < targetWidth; x += 1) {
      const startX = Math.floor((x * source.width) / targetWidth);
      const endX = Math.max(startX + 1, Math.floor(((x + 1) * source.width) / targetWidth));
      let red = 0;
      let green = 0;
      let blue = 0;
      let alpha = 0;
      let count = 0;
      for (let sy = startY; sy < endY; sy += 1) {
        for (let sx = startX; sx < endX; sx += 1) {
          const index = (sy * source.width + sx) * 4;
          red += source.pixels[index] ?? 0;
          green += source.pixels[index + 1] ?? 0;
          blue += source.pixels[index + 2] ?? 0;
          alpha += source.pixels[index + 3] ?? 0;
          count += 1;
        }
      }
      const out = (y * targetWidth + x) * 4;
      pixels[out] = Math.round(red / count);
      pixels[out + 1] = Math.round(green / count);
      pixels[out + 2] = Math.round(blue / count);
      pixels[out + 3] = Math.round(alpha / count);
    }
  }

  return { width: targetWidth, height: targetHeight, pixels };
}

function maxChannelDelta(left: Raster, right: Raster): number {
  if (left.width !== right.width || left.height !== right.height) {
    throw new Error("scaled content boxes differ in size");
  }
  let max = 0;
  for (let i = 0; i < left.pixels.length; i += 1) {
    const delta = Math.abs((left.pixels[i] ?? 0) - (right.pixels[i] ?? 0));
    if (delta > max) max = delta;
  }
  return max;
}

/** Ink is any pixel whose alpha survives the content-box threshold. */
function maskIoU(left: Raster, right: Raster): number {
  if (left.width !== right.width || left.height !== right.height) {
    throw new Error("scaled content boxes differ in size");
  }
  let intersection = 0;
  let union = 0;
  const count = left.width * left.height;
  for (let pixel = 0; pixel < count; pixel += 1) {
    const leftInk = (left.pixels[pixel * 4 + 3] ?? 0) >= ALPHA_MIN;
    const rightInk = (right.pixels[pixel * 4 + 3] ?? 0) >= ALPHA_MIN;
    if (leftInk && rightInk) intersection += 1;
    if (leftInk || rightInk) union += 1;
  }
  if (union === 0) {
    throw new Error("scaled marks have no ink");
  }
  return intersection / union;
}

function sha256(bytes: Buffer): string {
  return createHash("sha256").update(bytes).digest("hex");
}

describe("ST logo match", () => {
  it("matches the shipped mark to the brand original by content-box scale", () => {
    const canonicalBytes = readFileSync(new URL(CANONICAL, root));
    const sampleBytes = readFileSync(new URL(SAMPLE, root));
    const canonicalSha = sha256(canonicalBytes);
    const sampleSha = sha256(sampleBytes);

    expect(canonicalSha).toBe(CANONICAL_SHA256);
    expect(sampleSha).not.toBe(canonicalSha);
    expect(CANONICAL).not.toBe(SAMPLE);

    const canonical = readPng(CANONICAL);
    const sample = readPng(SAMPLE);
    const canonicalBox = contentBox(canonical);
    const sampleBox = contentBox(sample);

    expect(canonical).toMatchObject({ width: 2048, height: 2048 });
    expect(sample).toMatchObject({ width: 975, height: 1056 });
    expect(canonicalBox).toEqual({ x: 597, y: 557, width: 855, height: 936 });
    expect(sampleBox).toEqual({ x: 60, y: 60, width: 855, height: 936 });
    expect(canonicalBox.width).toBeLessThan(canonical.width);
    expect(sampleBox.width).toBeLessThan(sample.width);

    const targetHeight = Math.round((canonicalBox.height * SCALE_WIDTH) / canonicalBox.width);
    const sampleHeight = Math.round((sampleBox.height * SCALE_WIDTH) / sampleBox.width);
    expect(sampleHeight).toBe(targetHeight);

    const canonicalScaled = scaleContent(crop(canonical, canonicalBox), SCALE_WIDTH, targetHeight);
    const sampleScaled = scaleContent(crop(sample, sampleBox), SCALE_WIDTH, sampleHeight);
    const delta = maxChannelDelta(canonicalScaled, sampleScaled);
    const iou = maskIoU(canonicalScaled, sampleScaled);

    expect(canonicalScaled.width).toBe(SCALE_WIDTH);
    expect(canonicalScaled.width).not.toBe(canonical.width);
    expect(sampleScaled.width).not.toBe(sample.width);
    expect(delta).toBe(0);
    expect(iou).toBe(1);
  });
});
