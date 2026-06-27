// =============================================================
//  GALLERY CONFIG  —  edit this to control the photo scanner
// =============================================================
// Caveman notes:
//  - Each top-level folder inside `albumsRoot` becomes one ALBUM.
//  - Folders in `ignoreDirs` are skipped (app code, build output...).
//  - Originals are NEVER touched or deleted. We only READ them.
//  - We generate small WebP thumbnails + a high-res WebP for viewing.
// =============================================================

export default {
  // Where your album folders live. "." = this project root.
  albumsRoot: ".",

  // Folders to ignore while scanning for albums.
  ignoreDirs: [
    "public", "src", "scripts", "node_modules",
    "dist", ".git", ".vercel", ".vscode",
    "thumbnails", "large"
  ],

  // Pretty display names for albums.  "folder name" -> "name shown on site".
  // The folder on disk keeps its real name; only the website label changes.
  albumNames: {
    "ORIG": "Photo booth",
    "print": "Photo booth Print"
  },

  // Generated web images go here (served by Vite from /public).
  outputDir: "public/photos",

  // Grid preview image (tiny, fast to load).
  thumbnail: { width: 640, quality: 72 },

  // High-resolution image shown in the lightbox + used for download.
  // Originals stay safe on disk; this is the optimized "HD" web copy.
  large: { width: 2000, quality: 82 },

  // DOWNLOADS:
  //  false = family downloads the optimized HD WebP (small, fast, great quality).
  //  true  = also copy the TRUE original JPGs so downloads are exact originals
  //          (uses more disk + bigger deploy). Originals are copied, never moved.
  copyOriginals: false,

  // Duplicate detection. Duplicates are SKIPPED from the website,
  // never deleted from disk.
  dedupe: {
    exactHash: true,        // byte-identical files (SHA-256)
    nameAndSize: true,      // same filename + same byte size
    perceptual: false,      // near-duplicates (resized / re-saved) — AGGRESSIVE
    perceptualThreshold: 6  // lower = stricter (used only when perceptual: true)
  },

  // How many images to process at once.
  concurrency: 6,

  // Supported image types.
  supportedExt: [".jpg", ".jpeg", ".png", ".webp", ".heic"]
};
