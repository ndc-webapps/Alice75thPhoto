import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "./icons.jsx";

// Volume icons (small, local — not worth adding to the shared icon set).
const VolumeOff = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={p.size || 18} height={p.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="4 9 8 9 12 5 12 19 8 15 4 15 4 9" /><line x1="17" y1="9" x2="22" y2="14" /><line x1="22" y1="9" x2="17" y2="14" />
  </svg>
);
const VolumeOn = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={p.size || 18} height={p.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="4 9 8 9 12 5 12 19 8 15 4 15 4 9" /><path d="M16 8a5 5 0 0 1 0 8" /><path d="M19 5a9 9 0 0 1 0 14" />
  </svg>
);

export default function HighlightVideo({
  src = "/video/highlight.mp4",
  poster = "/video/highlight-poster.webp"
}) {
  const videoRef = useRef(null);
  const wrapRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  // Only play while the video is actually on screen — saves battery/data.
  useEffect(() => {
    const el = wrapRef.current;
    const v = videoRef.current;
    if (!el || !v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          v.play().then(() => setPlaying(true)).catch(() => {});
        } else {
          v.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
  };
  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mb-8 text-center"
      >
        <div className="mb-3 flex items-center justify-center gap-3 text-gold-bright">
          <span className="h-px w-10 bg-gold/50" />
          <span className="text-xs uppercase tracking-[0.28em]">The Highlight Film</span>
          <span className="h-px w-10 bg-gold/50" />
        </div>
        <h2 className="font-display text-4xl text-cream sm:text-5xl">Relive the Celebration</h2>
      </motion.div>

      <motion.div
        ref={wrapRef}
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="group relative overflow-hidden rounded-3xl shadow-card ring-1 ring-champagne/15"
      >
        <video
          ref={videoRef}
          className="aspect-video w-full bg-ink object-cover"
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />

        {/* controls */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4 opacity-0 transition group-hover:opacity-100 sm:p-5">
          <button
            onClick={togglePlay}
            className="grid h-11 w-11 place-items-center rounded-full bg-ink/55 text-cream backdrop-blur-md transition hover:bg-gold hover:text-ink"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            onClick={toggleMute}
            className="grid h-11 w-11 place-items-center rounded-full bg-ink/55 text-cream backdrop-blur-md transition hover:bg-gold hover:text-ink"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeOff size={18} /> : <VolumeOn size={18} />}
          </button>
        </div>

        {/* tap-to-unmute hint (mobile) */}
        {muted && (
          <button
            onClick={toggleMute}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink/60 px-5 py-2.5 text-sm text-cream backdrop-blur-md transition hover:bg-gold hover:text-ink sm:hidden"
          >
            Tap for sound
          </button>
        )}
      </motion.div>
    </section>
  );
}
