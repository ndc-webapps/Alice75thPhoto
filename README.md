# Alice's 75th Birthday Celebration

Premium family photo gallery. 500+ HD photos. Smooth. Cinematic.
May 17, 2026 · Jazz Makati Club House — 6th Floor, Tower B

---

## WHERE YOUR PHOTOS WERE FOUND

Already in this project folder:

- `May 17 Alice @75/`  → 595 photos → album "May 17 Alice @75"
- `ORIG/`              → 181 photos → album "Photo booth"
- `print/`             → 44 photos  → album "Photo booth Print"

Each folder = one ALBUM. No mixing.

Folder name on disk stays the same. The pretty album name shown on the site is set in `gallery.config.js` → `albumNames`. Want different labels? Edit that map and re-run the scan.

---

## ADD MORE PHOTOS

- Make a new folder here (next to `ORIG`, `print`...).
- Drop photos inside.
- Folder name = album name.
- Sub-folders inside an album also work.
- Run the scan again.

Supported: `.jpg .jpeg .png .webp .heic`

---

## RUN IT (3 STEPS)

```
npm install
npm run generate:photos
npm run dev
```

Open the link it prints (http://localhost:5173).

---

## WHAT generate:photos DOES

- Scans every folder.
- Folder → album.
- Makes small WebP thumbnails → `public/photos/thumbnails`
- Makes HD WebP for viewing/download → `public/photos/large`
- Skips duplicates (does NOT delete).
- Writes `src/data/photos.json` + `src/data/albums.json`
- Writes `duplicates-report.json`

Re-run anytime you add photos. Fast (skips images already made; use `npm run generate:photos -- --force` to redo all).

---

## DUPLICATES

- Same file (hash) = duplicate.
- Same name + same size = duplicate.
- One copy kept. Extra skipped from website.
- ORIGINALS NEVER DELETED.
- See what was skipped → open `duplicates-report.json`
- Want to catch resized/re-saved copies too? In `gallery.config.js` set `dedupe.perceptual: true` (aggressive — may remove a lot).

---

## DOWNLOADS

- Family can download any photo (heart icon + download icon on each photo, and in the big viewer).
- Default download = HD WebP (small, great quality).
- Want exact original JPGs for download? In `gallery.config.js` set `copyOriginals: true`, then re-run scan. (Bigger files.)
- Want NO downloads? In `src/config/site.js` set `allowDownload: false`.

---

## RENAME AN ALBUM

Two ways:

- Easy (keeps files where they are): edit `gallery.config.js` → `albumNames` map → re-run `npm run generate:photos`.
- Or just rename the folder on disk → re-run `npm run generate:photos`.

Also change the big title / date / venue in `src/config/site.js`.

---

## ADD CAPTIONS / CHANGE ORDER

- Open `src/data/photos.json`.
- Each photo has `"caption": ""`. Type words inside the quotes.
- Saved captions show in the viewer + slideshow + search.
- (Re-running the scan keeps existing thumbnails but rewrites this file — add captions after your final scan.)

---

## FAMILY PASSCODE (optional)

Keep strangers out.

1. Open `src/config/site.js`
2. Set `passcode.enabled: true`
3. Set the code in `passcode.value` (or make a `.env` file with `VITE_FAMILY_PASSCODE=yourcode`)

Turn off = set `enabled: false`. (Basic privacy only, not bank security.)

---

## DEPLOY TO CLOUDFLARE PAGES (main)

1. Run `npm run generate:photos` (so `public/photos` + data exist). Already done.
2. Push to GitHub. Already done.
3. dash.cloudflare.com → Workers & Pages → Create → Pages → Connect to Git → pick `Alice75thPhoto`.
4. Settings:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
   - (Root directory: leave blank)
5. Save and Deploy. Done. You get a `*.pages.dev` link.

Notes:
- `.nvmrc` pins Node 20. `_redirects` makes album links work. `_headers` caches photos fast.
- Family passcode on Cloudflare: Pages → Settings → Variables → add `VITE_FAMILY_PASSCODE` = your code, AND set `passcode.enabled: true` in `src/config/site.js`, then redeploy.
- Cloudflare Pages limits: 20,000 files + 25 MB per file. This project ≈ 1,645 files, biggest 0.5 MB. Fine.
- Update later: `npm run generate:photos` → `git add -A` → `git commit -m "..."` → `git push`. Cloudflare auto-rebuilds.

## DEPLOY TO VERCEL (alt)

vercel.com → New Project → import repo → Framework Vite → Build `npm run build` → Output `dist`. (`vercel.json` included.) Note: Vercel free tier has tighter size limits — Cloudflare is easier for big photo sets.

Original source folders (`ORIG`, etc.) are git-ignored on purpose. Only the optimized `public/photos` ships.

---

## FILES THAT MATTER

- `gallery.config.js` — scanner settings (sizes, duplicates, downloads)
- `src/config/site.js` — words, passcode, downloads on/off
- `scripts/generate-photos.js` — the scanner
- `duplicates-report.json` — what got skipped
- `src/data/photos.json` / `albums.json` — generated gallery data

---

A life full of love, laughter, and memories. 💛
