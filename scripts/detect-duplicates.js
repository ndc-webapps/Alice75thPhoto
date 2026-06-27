// =============================================================
//  DUPLICATE DETECTION
// =============================================================
// Decides which photos are unique (kept) and which are duplicates
// (skipped from the website). Originals are NEVER deleted here.
//
// Used by generate-photos.js. Can also run standalone:
//    npm run detect:duplicates
// =============================================================
import { fileURLToPath } from "node:url";
import path from "node:path";
import { writeFileSync } from "node:fs";
import config from "../gallery.config.js";
import { findAlbumDirs, walkImages, pool } from "./lib/scan.js";
import { sha256File, dHash, hamming } from "./lib/hash.js";
import { statSync } from "node:fs";

/**
 * @param {Array} records  - [{ path, album, size, sha256, dhash? }]
 * @param {object} d        - dedupe config
 * @returns {{ kept: Array, skipped: Array }}
 */
export function dedupe(records, d) {
  const byHash = new Map();        // sha256 -> kept record
  const byNameSize = new Map();    // name:size -> kept record
  const keptWithDhash = [];        // for perceptual compare
  const kept = [];
  const skipped = [];

  for (const rec of records) {
    let dup = null;
    let reason = null;

    if (!dup && d.exactHash && rec.sha256 && byHash.has(rec.sha256)) {
      dup = byHash.get(rec.sha256);
      reason = "Identical file (same SHA-256 hash)";
    }

    if (!dup && d.nameAndSize) {
      const key = `${path.basename(rec.path).toLowerCase()}:${rec.size}`;
      if (byNameSize.has(key)) {
        dup = byNameSize.get(key);
        reason = "Same filename and same file size";
      }
    }

    if (!dup && d.perceptual && rec.dhash) {
      for (const k of keptWithDhash) {
        const dist = hamming(rec.dhash, k.dhash);
        if (dist <= d.perceptualThreshold) {
          dup = k;
          reason = `Visually near-identical (perceptual distance ${dist})`;
          break;
        }
      }
    }

    if (dup) {
      skipped.push({
        skipped: rec.path,
        keptInstead: dup.path,
        keptAlbum: dup.album,
        skippedAlbum: rec.album,
        reason
      });
    } else {
      kept.push(rec);
      if (rec.sha256) byHash.set(rec.sha256, rec);
      byNameSize.set(`${path.basename(rec.path).toLowerCase()}:${rec.size}`, rec);
      if (rec.dhash) keptWithDhash.push(rec);
    }
  }

  return { kept, skipped };
}

// ---- Standalone CLI -----------------------------------------
async function main() {
  const root = path.resolve(config.albumsRoot);
  const albums = findAlbumDirs(root, config.ignoreDirs);
  console.log(`Scanning ${albums.length} album folder(s) for duplicates...`);

  const records = [];
  for (const album of albums) {
    const files = walkImages(path.join(root, album), config.supportedExt);
    for (const f of files) records.push({ path: f, album });
  }

  await pool(records, config.concurrency, async (rec) => {
    try {
      rec.size = statSync(rec.path).size;
      if (config.dedupe.exactHash || config.dedupe.nameAndSize)
        rec.sha256 = await sha256File(rec.path);
      if (config.dedupe.perceptual) rec.dhash = await dHash(rec.path);
    } catch (e) {
      console.warn(`  ! skipped (read error): ${rec.path}`);
    }
  });

  const { kept, skipped } = dedupe(records, config.dedupe);
  const report = {
    generatedAt: new Date().toISOString(),
    totalScanned: records.length,
    kept: kept.length,
    duplicatesSkipped: skipped.length,
    note: "Duplicates are only SKIPPED from the website. No original file was deleted.",
    duplicates: skipped
  };
  writeFileSync("duplicates-report.json", JSON.stringify(report, null, 2));
  console.log(
    `Done. Kept ${kept.length}, skipped ${skipped.length} duplicate(s). See duplicates-report.json`
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
