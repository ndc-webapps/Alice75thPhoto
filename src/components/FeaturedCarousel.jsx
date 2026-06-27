import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Cinematic crossfading background of featured photos.
export default function FeaturedCarousel({ photos = [], interval = 5000 }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (photos.length < 2) return;
    const t = setInterval(() => setI((p) => (p + 1) % photos.length), interval);
    return () => clearInterval(t);
  }, [photos.length, interval]);

  if (!photos.length) {
    return <div className="absolute inset-0 bg-gradient-to-b from-cocoa/40 to-ink" />;
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence mode="sync">
        <motion.img
          key={photos[i].id}
          src={photos[i].src}
          alt=""
          initial={{ opacity: 0, scale: 1.12 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.6 }, scale: { duration: interval / 1000 + 1.6, ease: "linear" } }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
      {/* warm cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/35" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(227,184,95,0.18),transparent_60%)]" />
    </div>
  );
}
