import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Images, Play } from "./icons.jsx";
import { useGallery } from "../context/GalleryContext.jsx";
import { photosInAlbum } from "../utils/photos.js";

export default function AlbumCard({ album, index = 0 }) {
  const { openSlideshow } = useGallery();

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.4) }}
    >
      <Link
        to={`/album/${album.id}`}
        className="group relative block overflow-hidden rounded-3xl shadow-card"
      >
        <div className="aspect-[4/5] w-full overflow-hidden bg-cocoa/40">
          {album.cover ? (
            <img
              src={album.cover}
              alt={album.name}
              loading="lazy"
              className="h-full w-full object-cover transition duration-[1200ms] group-hover:scale-110"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-champagne/40">
              <Images size={40} />
            </div>
          )}
        </div>

        {/* gradient + ornaments */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-champagne/15 transition group-hover:ring-gold/50" />

        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="mb-1 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-gold-bright/90">
            <span className="h-px w-6 bg-gold/60" /> Album
          </div>
          <h3 className="font-display text-2xl leading-tight text-cream drop-shadow">
            {album.name}
          </h3>
          <p className="mt-1 text-sm text-champagne/70">
            {album.count} {album.count === 1 ? "photo" : "photos"} · {album.blurb}
          </p>
        </div>

        {/* quick slideshow */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            openSlideshow(photosInAlbum(album.id), 0);
          }}
          className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-ink/55 text-cream opacity-0 backdrop-blur-md transition hover:bg-gold hover:text-ink group-hover:opacity-100"
          aria-label={`Play ${album.name} slideshow`}
        >
          <Play size={18} />
        </button>
      </Link>
    </motion.div>
  );
}
