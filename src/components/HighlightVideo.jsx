import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "./icons.jsx";

// Small local icons — not worth adding to the shared icon set.
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
const Back10 = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={p.size || 16} height={p.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" />
  </svg>
);
const Fwd10 = (p) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={p.size || 16} height={p.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 4v5h-5" />
  </svg>
);

function fmt(t) {
  if (!Number.isFinite(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function HighlightVideo({
  src = "/video/highlight.mp4",
  poster = "/video/highlight-poster.webp"
}) {
  const videoRef = useRef(null);
  const wrapRef = useRef(null);
  const barRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [scrubbing, setScrubbing] = useState(false);

  // Only autoplay while the video is actually on screen — saves battery/data.
  useEffect(() => {
    const el = wrapRef.current;
    const v = videoRef.current;
    if (!el || !v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          v.play().then(() => setPlaying(true)).catch(() => {});
        } else if (!scrubbing) {
          v.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => { if (!scrubbing) setCurrent(v.currentTime); };
    const onMeta = () => setDuration(v.duration || 0);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("play", () => setPlaying(true));
    v.addEventListener("pause", () => setPlaying(false));
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
    };
  }, [scrubbing]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play(); else v.pause();
  };
  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };
  const skip = (secs) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.min(Math.max(v.currentTime + secs, 0), duration || v.duration || 0);
  };

  const seekToClientX = useCallback((clientX) => {
    const bar = barRef.current;
    const v = videoRef.current;
    if (!bar || !v || !duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    const t = ratio * duration;
    setCurrent(t);
    v.currentTime = t;
  }, [duration]);

  const onBarPointerDown = (e) => {
    setScrubbing(true);
    seekToClientX(e.clientX);
    e.target.setPointerCapture?.(e.pointerId);
  };
  const onBarPointerMove = (e) => {
    if (scrubbing) seekToClientX(e.clientX);
  };
  const onBarPointerUp = () => setScrubbing(false);

  const pct = duration ? (current / duration) * 100 : 0;

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
          onClick={togglePlay}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />

        {/* controls bar — always visible on touch devices, fades in on hover for desktop */}
        <div className="absolute inset-x-0 bottom-0 p-3 opacity-100 transition sm:p-4 sm:opacity-0 sm:group-hover:opacity-100">
          {/* seek bar */}
          <div
            ref={barRef}
            onPointerDown={onBarPointerDown}
            onPointerMove={onBarPointerMove}
            onPointerUp={onBarPointerUp}
            onPointerLeave={() => scrubbing && setScrubbing(false)}
            className="group/bar relative mb-3 h-4 w-full cursor-pointer touch-none select-none"
          >
            <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-cream/25" />
            <div
              className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gold-sheen"
              style={{ width: `${pct}%` }}
            />
            <div
              className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 -translate-x-1/2 rounded-full bg-cream shadow transition group-hover/bar:scale-125"
              style={{ left: `${pct}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => skip(-10)}
                className="grid h-9 w-9 place-items-center rounded-full bg-ink/55 text-cream backdrop-blur-md transition hover:bg-gold hover:text-ink sm:h-10 sm:w-10"
                aria-label="Back 10 seconds"
              >
                <Back10 />
              </button>
              <button
                onClick={togglePlay}
                className="grid h-10 w-10 place-items-center rounded-full bg-ink/55 text-cream backdrop-blur-md transition hover:bg-gold hover:text-ink sm:h-11 sm:w-11"
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button
                onClick={() => skip(10)}
                className="grid h-9 w-9 place-items-center rounded-full bg-ink/55 text-cream backdrop-blur-md transition hover:bg-gold hover:text-ink sm:h-10 sm:w-10"
                aria-label="Forward 10 seconds"
              >
                <Fwd10 />
              </button>
              <span className="ml-1 hidden text-xs tabular-nums text-cream/80 sm:inline">
                {fmt(current)} / {fmt(duration)}
              </span>
            </div>

            <button
              onClick={toggleMute}
              className="grid h-9 w-9 place-items-center rounded-full bg-ink/55 text-cream backdrop-blur-md transition hover:bg-gold hover:text-ink sm:h-10 sm:w-10"
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted ? <VolumeOff size={17} /> : <VolumeOn size={17} />}
            </button>
          </div>
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
