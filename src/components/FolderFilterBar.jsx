import { albums } from "../utils/photos.js";
import { Search } from "./icons.jsx";
import { SORTS } from "../utils/photos.js";

export default function FolderFilterBar({
  albumId, setAlbumId, search, setSearch, sort, setSort, totalCount
}) {
  return (
    <div className="glass-dark sticky top-[68px] z-30 rounded-2xl px-4 py-4 shadow-soft">
      {/* folder chips */}
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto pb-3">
        <button
          onClick={() => setAlbumId("all")}
          className={`chip ${albumId === "all" ? "chip-active" : ""}`}
        >
          All Photos
          <span className="opacity-60">({totalCount})</span>
        </button>
        {albums.map((a) => (
          <button
            key={a.id}
            onClick={() => setAlbumId(a.id)}
            className={`chip ${albumId === a.id ? "chip-active" : ""}`}
          >
            {a.name}
            <span className="opacity-60">({a.count})</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-champagne/50" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, album, caption…"
            className="w-full rounded-full border border-champagne/20 bg-ink/40 py-2.5 pl-10 pr-4 text-sm text-cream placeholder:text-champagne/40 outline-none focus:border-gold/60"
          />
        </label>

        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-champagne/50">Sort</span>
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
            {Object.entries(SORTS).map(([key, s]) => (
              <button
                key={key}
                onClick={() => setSort(key)}
                className={`chip !px-3 !py-1.5 text-xs ${sort === key ? "chip-active" : ""}`}
              >
                {s.label}
              </button>
            ))}
            <button
              onClick={() => setSort("random")}
              className={`chip !px-3 !py-1.5 text-xs ${sort === "random" ? "chip-active" : ""}`}
            >
              Random
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
