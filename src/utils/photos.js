import photosData from "../data/photos.json";
import albumsData from "../data/albums.json";

export const allPhotos = photosData;
export const albums = albumsData;

export const hasPhotos = allPhotos.length > 0;

export const getAlbum = (id) => albums.find((a) => a.id === id);

export const photosInAlbum = (albumId) =>
  allPhotos.filter((p) => p.albumId === albumId);

export const getPhotoById = (id) => allPhotos.find((p) => p.id === id);

/** A handful of nice cover shots for the hero carousel. */
export function featuredPhotos(count = 8) {
  if (!allPhotos.length) return [];
  // One cover from each album first, then fill with an even spread.
  const picks = [];
  const seen = new Set();
  for (const a of albums) {
    const first = photosInAlbum(a.id)[0];
    if (first && !seen.has(first.id)) { picks.push(first); seen.add(first.id); }
  }
  const step = Math.max(1, Math.floor(allPhotos.length / count));
  for (let i = 0; i < allPhotos.length && picks.length < count; i += step) {
    const p = allPhotos[i];
    if (!seen.has(p.id)) { picks.push(p); seen.add(p.id); }
  }
  return picks.slice(0, count);
}

export const SORTS = {
  featured: { label: "Featured", fn: (a, b) => a.albumName.localeCompare(b.albumName) || a.dateTaken.localeCompare(b.dateTaken) },
  newest:   { label: "Newest",   fn: (a, b) => b.dateTaken.localeCompare(a.dateTaken) },
  oldest:   { label: "Oldest",   fn: (a, b) => a.dateTaken.localeCompare(b.dateTaken) }
};

/** Apply folder filter + search + sort. */
export function queryPhotos(list, { albumId = "all", search = "", sort = "featured" } = {}) {
  let out = list;
  if (albumId !== "all") out = out.filter((p) => p.albumId === albumId);
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    out = out.filter(
      (p) =>
        p.filename.toLowerCase().includes(q) ||
        p.albumName.toLowerCase().includes(q) ||
        (p.caption || "").toLowerCase().includes(q)
    );
  }
  if (sort === "random") {
    out = [...out];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
  } else {
    out = [...out].sort((SORTS[sort] || SORTS.featured).fn);
  }
  return out;
}

export function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric", month: "long", day: "numeric"
    });
  } catch { return ""; }
}
