import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection.jsx";
import AlbumBrowser from "../components/AlbumBrowser.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { hasPhotos, allPhotos, albums } from "../utils/photos.js";
import { site } from "../config/site.js";
import { Sparkle } from "../components/icons.jsx";

export default function Home() {
  if (!hasPhotos) {
    return (
      <div className="pt-28">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h1 className="font-display text-5xl text-cream">{site.title} <span className="gold-text">{site.titleAccent}</span></h1>
          <p className="mt-3 font-serif text-lg italic text-champagne/80">“{site.tagline}”</p>
        </div>
        <EmptyState />
      </div>
    );
  }

  return (
    <>
      <HeroSection />

      {/* little stats ribbon */}
      <section className="mx-auto -mt-10 max-w-4xl px-6">
        <div className="glass-dark grid grid-cols-3 divide-x divide-champagne/10 rounded-2xl py-6 text-center shadow-card">
          <Stat value={allPhotos.length} label="Memories" />
          <Stat value={albums.length} label="Albums" />
          <Stat value="75" label="Years of Love" />
        </div>
      </section>

      <AlbumBrowser />

      {/* closing CTA */}
      <section className="mx-auto max-w-3xl px-6 pb-20 text-center">
        <div className="hairline mx-auto mb-8 w-40" />
        <Sparkle className="mx-auto mb-3 text-gold-bright" />
        <h2 className="font-display text-3xl text-cream sm:text-4xl">Relive every moment</h2>
        <p className="mx-auto mt-3 max-w-lg text-champagne/70">
          Browse all the photos together, or sit back and let the memories play.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/all" className="btn-gold">View All Photos</Link>
          <Link to="/albums" className="btn-ghost">Browse Albums</Link>
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }) {
  return (
    <div className="px-2">
      <div className="font-display text-3xl gold-text sm:text-4xl">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-widest text-champagne/60">{label}</div>
    </div>
  );
}
