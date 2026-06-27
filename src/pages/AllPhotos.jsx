import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import GalleryGrid from "../components/GalleryGrid.jsx";
import FolderFilterBar from "../components/FolderFilterBar.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { allPhotos, queryPhotos, hasPhotos } from "../utils/photos.js";
import { useGallery } from "../context/GalleryContext.jsx";
import { Play } from "../components/icons.jsx";

export default function AllPhotos() {
  const [albumId, setAlbumId] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const { openSlideshow, openLightbox } = useGallery();
  const [params, setParams] = useSearchParams();

  const photos = useMemo(
    () => queryPhotos(allPhotos, { albumId, search, sort }),
    [albumId, search, sort]
  );

  // deep link ?photo=ID
  useEffect(() => {
    const pid = params.get("photo");
    if (pid && allPhotos.length) {
      const i = allPhotos.findIndex((p) => p.id === pid);
      if (i >= 0) openLightbox(allPhotos, i);
      params.delete("photo");
      setParams(params, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!hasPhotos) {
    return <div className="pt-28"><EmptyState /></div>;
  }

  return (
    <div className="pt-24">
      <section className="mx-auto max-w-[1700px] px-3 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 px-1">
          <div>
            <h1 className="font-display text-4xl text-cream sm:text-5xl">All Memories</h1>
            <p className="mt-1 text-champagne/70">
              {photos.length} of {allPhotos.length} photos
              {albumId !== "all" ? " · filtered" : ""}
            </p>
          </div>
          <button onClick={() => openSlideshow(photos, 0)} className="btn-gold" disabled={!photos.length}>
            <Play size={18} /> Slideshow
          </button>
        </div>

        <FolderFilterBar
          albumId={albumId} setAlbumId={setAlbumId}
          search={search} setSearch={setSearch}
          sort={sort} setSort={setSort}
          totalCount={allPhotos.length}
        />

        <div className="mt-6 pb-16">
          {photos.length ? (
            <GalleryGrid photos={photos} showAlbumTag={albumId === "all"} />
          ) : (
            <EmptyState title="No matches" message="Try a different search or filter." showCommand={false} />
          )}
        </div>
      </section>
    </div>
  );
}
