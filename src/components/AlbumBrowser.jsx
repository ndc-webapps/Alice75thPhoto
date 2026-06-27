import AlbumCard from "./AlbumCard.jsx";
import { albums } from "../utils/photos.js";

export default function AlbumBrowser({ title = "The Albums", subtitle }) {
  if (!albums.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mb-9 text-center">
        <div className="mb-3 flex items-center justify-center gap-3 text-gold-bright">
          <span className="h-px w-10 bg-gold/50" />
          <span className="text-xs uppercase tracking-[0.28em]">Browse by folder</span>
          <span className="h-px w-10 bg-gold/50" />
        </div>
        <h2 className="font-display text-4xl text-cream sm:text-5xl">{title}</h2>
        <p className="mx-auto mt-3 max-w-xl text-champagne/70">
          {subtitle || "Every folder is its own collection. Tap one to step inside."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {albums.map((a, i) => (
          <AlbumCard key={a.id} album={a} index={i} />
        ))}
      </div>
    </section>
  );
}
