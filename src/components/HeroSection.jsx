import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import FeaturedCarousel from "./FeaturedCarousel.jsx";
import { site } from "../config/site.js";
import { featuredPhotos, allPhotos } from "../utils/photos.js";
import { useGallery } from "../context/GalleryContext.jsx";
import { Play, Images, Sparkle, MapPin } from "./icons.jsx";

export default function HeroSection() {
  const { openSlideshow } = useGallery();
  const featured = featuredPhotos(8);

  return (
    <header className="relative flex min-h-[92vh] items-center justify-center overflow-hidden">
      <FeaturedCarousel photos={featured} />

      <motion.div
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative z-10 mx-auto max-w-3xl px-6 text-center"
      >
        <div className="mb-5 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-gold-soft">
          <Sparkle size={14} /> {site.dateLabel}
        </div>

        <h1 className="font-display text-5xl leading-[1.05] text-cream drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)] sm:text-7xl">
          {site.title}
          <span className="mt-2 block gold-text">{site.titleAccent}</span>
        </h1>

        <p className="mx-auto mt-4 max-w-xl font-serif text-lg italic text-champagne/90 sm:text-xl">
          “{site.tagline}”
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-cream/75 sm:text-base">
          {site.heroMessage}
        </p>

        {site.location && (
          <p className="mt-5 inline-flex items-center justify-center gap-2 text-sm font-medium tracking-wide text-gold-soft">
            <MapPin size={16} /> {site.location}
          </p>
        )}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/all" className="btn-gold w-full sm:w-auto">
            <Images size={18} /> View Memories
          </Link>
          <button
            onClick={() => openSlideshow(allPhotos, 0)}
            className="btn-ghost w-full sm:w-auto"
            disabled={!allPhotos.length}
          >
            <Play size={18} /> Start Slideshow
          </button>
        </div>
      </motion.div>

      {/* scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-champagne/60">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="text-xs tracking-widest"
        >
          SCROLL
        </motion.div>
      </div>
    </header>
  );
}
