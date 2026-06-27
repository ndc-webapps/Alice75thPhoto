// Folder scanning helpers.
import { readdirSync, statSync } from "node:fs";
import path from "node:path";

/** Turn a folder name into a URL-safe slug. */
export function slugify(name) {
  return String(name)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "album";
}

/** List the top-level album folders inside `albumsRoot`. */
export function findAlbumDirs(albumsRoot, ignoreDirs) {
  const ignore = new Set(ignoreDirs.map((d) => d.toLowerCase()));
  return readdirSync(albumsRoot, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .filter((name) => !name.startsWith(".") && !ignore.has(name.toLowerCase()))
    .sort((a, b) => a.localeCompare(b));
}

/** Recursively collect image files under a directory. */
export function walkImages(dir, supportedExt) {
  const exts = new Set(supportedExt.map((e) => e.toLowerCase()));
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const cur = stack.pop();
    let entries = [];
    try {
      entries = readdirSync(cur, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      const full = path.join(cur, e.name);
      if (e.isDirectory()) {
        if (!e.name.startsWith(".")) stack.push(full);
      } else if (exts.has(path.extname(e.name).toLowerCase())) {
        out.push(full);
      }
    }
  }
  // Stable order by path.
  return out.sort((a, b) => a.localeCompare(b));
}

/** Best-effort "date taken" from a filename like 20260516_222840 or 2026-05-16. */
export function dateFromFilename(filename) {
  const m =
    filename.match(/(20\d{2})[-_]?(\d{2})[-_]?(\d{2})[-_ ]?(\d{2})?(\d{2})?(\d{2})?/);
  if (!m) return null;
  const [, y, mo, d, h = "00", mi = "00", s = "00"] = m;
  const iso = `${y}-${mo}-${d}T${h}:${mi}:${s}`;
  const t = Date.parse(iso);
  return Number.isNaN(t) ? null : new Date(t).toISOString();
}

/** Simple promise pool to limit concurrency. */
export async function pool(items, limit, worker) {
  const results = new Array(items.length);
  let i = 0;
  const runners = new Array(Math.min(limit, items.length)).fill(0).map(async () => {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await worker(items[idx], idx);
    }
  });
  await Promise.all(runners);
  return results;
}
