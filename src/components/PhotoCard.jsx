import { memo, useState } from "react";
import { useGallery } from "../context/GalleryContext.jsx";
import { downloadPhoto } from "../utils/download.js";
import { site } from "../config/site.js";
import { Heart, HeartFilled, Download } from "./icons.jsx";

function PhotoCard({ photo, onOpen, showAlbumTag = false }) {
  const { isFavorite, toggleFavorite } = useGallery();
  const [loaded, setLoaded] = useState(false);
  const fav = isFavorite(photo.id);
  const ratio = photo.width && photo.height ? photo.width / photo.height : 0.75;

  return (
    <figure className="group relative overflow-hidden rounded-2xl bg-cocoa/30 shadow-card cursor-zoom-in">
      <button
        type="button"
        onClick={onOpen}
        className="block w-full"
        aria-label={`Open ${photo.filename}`}
      >
        <div style={{ aspectRatio: ratio }} className="relative w-full">
          {!loaded && (
            <div className="absolute inset-0 skeleton animate-shimmer" aria-hidden />
          )}
          <img
            src={photo.thumb}
            alt={photo.caption || photo.albumName}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            className={`h-full w-full object-cover transition duration-700 will-change-transform
              group-hover:scale-[1.04] ${loaded ? "opacity-100" : "opacity-0"}`}
          />
        </div>
      </button>

      {/* hover gradient + meta */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

      {showAlbumTag && (
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-ink/55 px-3 py-1 text-[11px] font-medium tracking-wide text-gold-soft backdrop-blur-sm">
          {photo.albumName}
        </span>
      )}

      {/* action buttons */}
      <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition group-hover:opacity-100">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); toggleFavorite(photo.id); }}
          className={`grid h-9 w-9 place-items-center rounded-full backdrop-blur-md transition
            ${fav ? "bg-rose-500/90 text-white" : "bg-ink/55 text-cream hover:bg-ink/75"}`}
          aria-label={fav ? "Remove favorite" : "Add favorite"}
        >
          {fav ? <HeartFilled size={17} /> : <Heart size={17} />}
        </button>
        {site.allowDownload && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); downloadPhoto(photo); }}
            className="grid h-9 w-9 place-items-center rounded-full bg-ink/55 text-cream backdrop-blur-md transition hover:bg-ink/75"
            aria-label="Download photo"
          >
            <Download size={17} />
          </button>
        )}
      </div>

      {/* persistent favorite heart (when favorited, even without hover) */}
      {fav && (
        <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-rose-500/90 text-white opacity-100 transition group-hover:opacity-0">
          <HeartFilled size={17} />
        </span>
      )}
    </figure>
  );
}

export default memo(PhotoCard);
