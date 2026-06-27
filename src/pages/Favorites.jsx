import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import GalleryGrid from "../components/GalleryGrid.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { allPhotos, albums } from "../utils/photos.js";
import { useGallery } from "../context/GalleryContext.jsx";
import { Heart, Play } from "../components/icons.jsx";

export default function Favorites() {
  const { favSet, openSlideshow } = useGallery();
  const [albumId, setAlbumId] = useState("all");

  const favPhotos = useMemo(
    () => allPhotos.filter((p) => favSet.has(p.id)),
    [favSet]
  );
  const shown = albumId === "all" ? favPhotos : favPhotos.filter((p) => p.albumId === albumId);

  // only show folder chips that actually contain favorites
  const favAlbums = albums.filter((a) => favPhotos.some((p) => p.albumId === a.id));

  return (
    <div className="pt-24">
      <section className="mx-auto max-w-[1700px] px-3 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 px-1">
          <div>
            <div className="mb-1 flex items-center gap-2 text-rose-400">
              <Heart size={18} /> <span className="text-xs uppercase tracking-[0.22em]">Saved on this device</span>
            </div>
            <h1 className="font-display text-4xl text-cream sm:text-5xl">Favorite Memories</h1>
            <p className="mt-1 text-champagne/70">{favPhotos.length} loved {favPhotos.length === 1 ? "photo" : "photos"}</p>
          </div>
          {shown.length > 0 && (
            <button onClick={() => openSlideshow(shown, 0)} className="btn-gold">
              <Play size={18} /> Play favorites
            </button>
          )}
        </div>

        {favPhotos.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full glass text-rose-400">
              <Heart size={34} />
            </div>
            <h3 className="font-display text-2xl text-cream">No favorites yet</h3>
            <p className="mx-auto mt-2 max-w-sm text-champagne/70">
              Tap the heart on any photo to save it here. Favorites stay on this device.
            </p>
            <Link to="/all" className="btn-gold mt-6">Browse photos</Link>
          </div>
        ) : (
          <>
            {favAlbums.length > 1 && (
              <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto">
                <button onClick={() => setAlbumId("all")} className={`chip ${albumId === "all" ? "chip-active" : ""}`}>
                  All ({favPhotos.length})
                </button>
                {favAlbums.map((a) => (
                  <button key={a.id} onClick={() => setAlbumId(a.id)} className={`chip ${albumId === a.id ? "chip-active" : ""}`}>
                    {a.name} ({favPhotos.filter((p) => p.albumId === a.id).length})
                  </button>
                ))}
              </div>
            )}
            <div className="pb-16">
              <GalleryGrid photos={shown} showAlbumTag={albumId === "all"} />
            </div>
          </>
        )}
      </section>
    </div>
  );
}
