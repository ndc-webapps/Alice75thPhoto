import { useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import GalleryGrid from "../components/GalleryGrid.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { getAlbum, photosInAlbum } from "../utils/photos.js";
import { useGallery } from "../context/GalleryContext.jsx";
import { ChevronLeft, Play, Images } from "../components/icons.jsx";

export default function AlbumView() {
  const { id } = useParams();
  const album = getAlbum(id);
  const photos = album ? photosInAlbum(id) : [];
  const { openSlideshow, openLightbox } = useGallery();
  const [params, setParams] = useSearchParams();

  // deep link ?photo=ID opens the lightbox
  useEffect(() => {
    const pid = params.get("photo");
    if (pid && photos.length) {
      const i = photos.findIndex((p) => p.id === pid);
      if (i >= 0) openLightbox(photos, i);
      params.delete("photo");
      setParams(params, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!album) {
    return (
      <div className="pt-28">
        <EmptyState title="Album not found" message="This folder doesn't exist (yet)." showCommand={false} />
        <div className="text-center"><Link to="/albums" className="btn-ghost">Back to albums</Link></div>
      </div>
    );
  }

  return (
    <div className="pt-24">
      {/* album hero */}
      <section className="relative mb-8 overflow-hidden">
        {album.coverSrc && (
          <div className="absolute inset-0 -z-10">
            <img src={album.coverSrc} alt="" className="h-full w-full object-cover opacity-25" />
            <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/85 to-[#160f08]" />
          </div>
        )}
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <Link to="/albums" className="mb-5 inline-flex items-center gap-1.5 text-sm text-champagne/70 hover:text-cream">
            <ChevronLeft size={18} /> All albums
          </Link>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-gold-bright">
              <Images size={14} /> Album · {album.count} photos
            </div>
            <h1 className="font-display text-4xl text-cream sm:text-6xl">{album.name}</h1>
            <p className="mt-2 max-w-xl text-champagne/70">{album.blurb}</p>
            <button
              onClick={() => openSlideshow(photos, 0)}
              className="btn-gold mt-6"
              disabled={!photos.length}
            >
              <Play size={18} /> Play this album
            </button>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-[1700px] px-3 pb-16 sm:px-6">
        {photos.length ? (
          <GalleryGrid photos={photos} />
        ) : (
          <EmptyState title="No photos in this album" message="Add images to this folder and re-run the scanner." />
        )}
      </section>
    </div>
  );
}
