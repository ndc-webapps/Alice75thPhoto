// Hashing helpers: exact (SHA-256) + perceptual (dHash) for duplicate detection.
import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import sharp from "sharp";

/** SHA-256 of the raw file bytes (streamed, low memory). */
export function sha256File(filePath) {
  return new Promise((resolve, reject) => {
    const hash = createHash("sha256");
    const stream = createReadStream(filePath);
    stream.on("error", reject);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
  });
}

/**
 * Perceptual difference-hash (dHash) → 64-bit string of "1"/"0".
 * Resizes to 9x8 grayscale, compares horizontally adjacent pixels.
 * Catches resized / re-encoded near-duplicates.
 */
export async function dHash(filePath) {
  const buf = await sharp(filePath)
    .grayscale()
    .resize(9, 8, { fit: "fill" })
    .raw()
    .toBuffer();
  let bits = "";
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const i = r * 9 + c;
      bits += buf[i] > buf[i + 1] ? "1" : "0";
    }
  }
  return bits;
}

/** Hamming distance between two equal-length bit strings. */
export function hamming(a, b) {
  if (!a || !b || a.length !== b.length) return Infinity;
  let d = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
  return d;
}
