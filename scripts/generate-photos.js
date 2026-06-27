// =============================================================
//  GENERATE PHOTOS  —  one command does everything
// =============================================================
//   npm run generate:photos
//
//   1. Scans each top-level folder  -> one album per folder
//   2. Detects duplicates           -> skipped, never deleted
//   3. Makes WebP thumbnails        -> public/photos/thumbnails
//   4. Makes high-res WebP (for HD viewing + download)
//   5. (optional) copies true originals for exact downloads
//   6. Writes src/data/photos.json + src/data/albums.json
//   7. Writes duplicates-report.json
//
//   Flags:  --force  (re-make every image, even if it exists)
// =============================================================
import path from "node:path";
import {
  mkdirSync, writeFileSync, existsSync, statSync, copyFileSync
} from "node:fs";
import sharp from "sharp";
import exifr from "exifr";
import config from "../gallery.config.js";
import {
  findAlbumDirs, walkImages, slugify, dateFromFilename, pool
} from "./lib/scan.js";
import { sha256File, dHash } from "./lib/hash.js";
import { dedupe } from "./detect-duplicates.js";

const FORCE = process.argv.includes("--force");
const ROOT = path.resolve(config.albumsRoot);
const OUT = path.resolve(config.outputDir);
const COPY_ORIGINALS = config.copyOriginals === true; // exact-original downloads

const webPath = (...p) => "/" + path.join("photos", ...p).split(path.sep).join("/");
const ensureDir = (d) => mkdirSync(d, { recursive: true });

function progress(done, total, label) {
  if (done % 25 === 0 || done === total) {
    const pct = ((done / total) * 100).toFixed(0);
    process.stdout.write(`\r   ${label}: ${done}/${total} (${pct}%)   `);
    if (done === total) process.stdout.write("\n");
  }
}

async function bestDate(file) {
  try {
    const ex = await exifr.parse(file, ["DateTimeOriginal", "CreateDate", "ModifyDate"]);
    const d = ex?.DateTimeOriginal || ex?.CreateDate || ex?.ModifyDate;
    if (d instanceof Date && !Number.isNaN(d.getTime())) return d.toISOString();
  } catch { /* no exif */ }
  const fromName = dateFromFilename(path.basename(file));
  if (fromName) return fromName;
  try { return statSync(file).mtime.toISOString(); } catch { return new Date().toISOString(); }
}

async function main() {
  console.log("\n  Grandma's 75th Birthday — generating gallery\n  " + "-".repeat(44));
  const albums = findAlbumDirs(ROOT, config.ignoreDirs);
  if (albums.length === 0) {
    console.error("  No album folders found in: " + ROOT);
    console.error("  Put your photo folders here, then run again.");
    process.exit(1);
  }
  console.log("  Albums detected: " + albums.map((a) => `"${a}"`).join(", ") + "\n");

  // ---- 1. Collect every image ----
  const displayName = (folder) => (config.albumNames && config.albumNames[folder]) || folder;

  const records = [];
  for (const album of albums) {
    const files = walkImages(path.join(ROOT, album), config.supportedExt);
    // slug stays based on the real FOLDER name (stable thumbnail paths);
    // albumName uses the pretty display name from config.albumNames.
    for (const f of files) records.push({ path: f, album: displayName(album), folder: album, slug: slugify(album) });
  }
  console.log(`  Found ${records.length} image file(s). Reading + hashing...`);

  // ---- 2. Hash + size (for duplicate detection) ----
  let n = 0;
  await pool(records, config.concurrency, async (rec) => {
    try {
      rec.size = statSync(rec.path).size;
      if (config.dedupe.exactHash || config.dedupe.nameAndSize)
        rec.sha256 = await sha256File(rec.path);
      if (config.dedupe.perceptual) rec.dhash = await dHash(rec.path);
    } catch {
      rec.bad = true;
    }
    progress(++n, records.length, "Hashing");
  });
  const good = records.filter((r) => !r.bad);

  // ---- 3. Duplicate detection ----
  const { kept, skipped } = dedupe(good, config.dedupe);
  console.log(`  Unique photos: ${kept.length}   Duplicates skipped: ${skipped.length}`);

  // ---- 4. Build thumbnails + HD images + metadata ----
  ensureDir(OUT);
  const usedIds = new Set();
  const photos = [];
  n = 0;
  await pool(kept, config.concurrency, async (rec) => {
    try {
      // stable id from content hash (falls back to path hash)
      let base = (rec.sha256 || Buffer.from(rec.path).toString("hex")).slice(0, 12);
      let id = base; let k = 2;
      while (usedIds.has(id)) id = `${base}-${k++}`;
      usedIds.add(id);

      const slug = rec.slug;
      const thumbDir = path.join(OUT, "thumbnails", slug);
      const largeDir = path.join(OUT, "large", slug);
      ensureDir(thumbDir); ensureDir(largeDir);
      const thumbFile = path.join(thumbDir, `${id}.webp`);
      const largeFile = path.join(largeDir, `${id}.webp`);

      const meta = await sharp(rec.path).metadata();
      const oriented = meta.orientation && meta.orientation >= 5;
      const width = oriented ? meta.height : meta.width;
      const height = oriented ? meta.width : meta.height;

      const needThumb = FORCE || !existsSync(thumbFile);
      const needLarge = FORCE || !existsSync(largeFile);

      if (needThumb) {
        await sharp(rec.path).rotate()
          .resize({ width: config.thumbnail.width, withoutEnlargement: true })
          .webp({ quality: config.thumbnail.quality })
          .toFile(thumbFile);
      }
      if (needLarge) {
        await sharp(rec.path).rotate()
          .resize({ width: config.large.width, withoutEnlargement: true })
          .webp({ quality: config.large.quality })
          .toFile(largeFile);
      }

      // optional: copy true original for exact downloads
      let downloadPath = webPath("large", slug, `${id}.webp`);
      if (COPY_ORIGINALS) {
        const ext = path.extname(rec.path).toLowerCase();
        const origDir = path.join(OUT, "originals", slug);
        ensureDir(origDir);
        const origFile = path.join(origDir, `${id}${ext}`);
        if (FORCE || !existsSync(origFile)) copyFileSync(rec.path, origFile);
        downloadPath = webPath("originals", slug, `${id}${ext}`);
      }

      photos.push({
        id,
        albumId: slug,
        albumName: rec.album,
        filename: path.basename(rec.path),
        thumb: webPath("thumbnails", slug, `${id}.webp`),
        src: webPath("large", slug, `${id}.webp`),
        download: downloadPath,
        originalPath: path.relative(ROOT, rec.path).split(path.sep).join("/"),
        width,
        height,
        dateTaken: await bestDate(rec.path),
        caption: ""
      });
    } catch (e) {
      console.warn(`\n   ! could not process ${rec.path}: ${e.message}`);
    }
    progress(++n, kept.length, "Building");
  });

  // ---- 5. Sort + build albums ----
  photos.sort((a, b) =>
    a.albumName.localeCompare(b.albumName) || a.dateTaken.localeCompare(b.dateTaken)
  );

  const albumData = albums.map((folder) => {
    const slug = slugify(folder);
    const name = displayName(folder);
    const inAlbum = photos.filter((p) => p.albumId === slug);
    return {
      id: slug,
      name,
      folderPath: folder,
      cover: inAlbum[0]?.thumb || null,
      coverSrc: inAlbum[0]?.src || null,
      count: inAlbum.length,
      blurb: `Memories from ${name}`
    };
  }).filter((a) => a.count > 0);

  // ---- 6. Write data files ----
  ensureDir(path.resolve("src/data"));
  writeFileSync("src/data/photos.json", JSON.stringify(photos, null, 0));
  writeFileSync("src/data/albums.json", JSON.stringify(albumData, null, 2));

  writeFileSync("duplicates-report.json", JSON.stringify({
    generatedAt: new Date().toISOString(),
    totalScanned: records.length,
    unreadable: records.length - good.length,
    kept: kept.length,
    duplicatesSkipped: skipped.length,
    note: "Duplicates are only SKIPPED from the website. No original file was deleted.",
    rules: config.dedupe,
    duplicates: skipped
  }, null, 2));

  // ---- Done ----
  console.log("  " + "-".repeat(44));
  console.log(`  DONE.`);
  console.log(`  Albums:     ${albumData.length}`);
  albumData.forEach((a) => console.log(`     - ${a.name.padEnd(22)} ${a.count} photos`));
  console.log(`  Photos:     ${photos.length}`);
  console.log(`  Duplicates: ${skipped.length} skipped (see duplicates-report.json)`);
  console.log(`  Data:       src/data/photos.json , src/data/albums.json`);
  console.log(`\n  Next:  npm run dev\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
