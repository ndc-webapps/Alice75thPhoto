import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGallery } from "../context/GalleryContext.jsx";
import { site } from "../config/site.js";
import { formatDate } from "../utils/photos.js";
import {
  Close, ChevronLeft, ChevronRight, Play, Pause, Expand, Music
} from "./icons.jsx";

export default function SlideshowMode() {
  const { slideshow, closeSlideshow } = useGallery();
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [music, setMusic] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const audioRef = useRef(null);
  const hideTimer = useRef(null);
  const stageRef = useRef(null);

  const list = slideshow?.list || [];
  const photo = list[idx];

  useEffect(() => {
    if (slideshow) { setIdx(slideshow.index || 0); setPlaying(true); }
  }, [slideshow]);

  const go = useCallback((dir) => {
    setIdx((i) => (i + dir + list.length) % list.length);
  }, [list.length]);

  // autoplay
  useEffect(() => {
    if (!slideshow || !playing || list.length < 2) return;
    const t = setTimeout(() => go(1), site.slideshowSeconds * 1000);
    return () => clearTimeout(t);
  }, [slideshow, playing, idx, go, list.length]);

  // preload next
  useEffect(() => {
    if (!list.length) return;
    const n = list[(idx + 1) % list.length];
    if (n) { const im = new Image(); im.src = n.src; }
  }, [idx, list]);

  // keyboard
  useEffect(() => {
    if (!slideshow) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeSlideshow();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === " ") { e.preventDefault(); setPlaying((p) => !p); }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [slideshow, go, closeSlideshow]);

  // music (only if a file is configured)
  useEffect(() => {
    if (!audioRef.current) return;
    if (music) audioRef.current.play().catch(() => {});
    else audioRef.current.pause();
  }, [music]);

  // auto-hide controls
  const wake = useCallback(() => {
    setShowUI(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowUI(false), 3000);
  }, []);
  useEffect(() => { if (slideshow) wake(); }, [slideshow, idx, wake]);

  const toggleFull = () => {
    const el = stageRef.current;
    if (!document.fullscreenElement) el?.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.();
  };

  if (!slideshow || !photo) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={stageRef}
        key="slideshow"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] bg-black"
        onMouseMove={wake}
        onClick={wake}
      >
        {/* blurred background from current image */}
        <div
          className="absolute inset-0 scale-110 opacity-40"
          style={{
            backgroundImage: `url(${photo.thumb})`,
            backgroundSize: "cover", backgroundPosition: "center", filter: "blur(60px)"
          }}
        />

        {/* main image with soft fade + zoom */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <AnimatePresence mode="wait">
            <motion.img
              key={photo.id}
              src={photo.src}
              alt={photo.caption || photo.albumName}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 1 }, scale: { duration: site.slideshowSeconds + 1, ease: "linear" } }}
              className="max-h-[88vh] max-w-[94vw] rounded-lg object-contain shadow-2xl"
            />
          </AnimatePresence>
        </div>

        {/* caption */}
        <AnimatePresence>
          {showUI && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="absolute inset-x-0 bottom-24 text-center"
            >
              <p className="font-display text-2xl text-cream drop-shadow">{photo.albumName}</p>
              {photo.caption ? (
                <p className="mt-1 font-serif italic text-champagne/85">{photo.caption}</p>
              ) : (
                <p className="mt-1 text-sm text-champagne/60">{formatDate(photo.dateTaken)}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* controls */}
        <AnimatePresence>
          {showUI && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute right-4 top-4 flex gap-2"
              >
                <button onClick={() => setMusic((m) => !m)} className={`ss-btn ${music ? "!text-gold-bright" : ""}`} aria-label="Toggle music"><Music size={18} /></button>
                <button onClick={toggleFull} className="ss-btn" aria-label="Fullscreen"><Expand size={18} /></button>
                <button onClick={closeSlideshow} className="ss-btn" aria-label="Close"><Close size={20} /></button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="absolute inset-x-0 bottom-7 flex items-center justify-center gap-4"
              >
                <button onClick={() => go(-1)} className="ss-btn" aria-label="Previous"><ChevronLeft size={22} /></button>
                <button onClick={() => setPlaying((p) => !p)} className="ss-btn !h-14 !w-14 bg-gold text-ink hover:!bg-gold-bright" aria-label={playing ? "Pause" : "Play"}>
                  {playing ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button onClick={() => go(1)} className="ss-btn" aria-label="Next"><ChevronRight size={22} /></button>
                <span className="ml-2 rounded-full bg-black/40 px-3 py-1 text-xs text-champagne/80">
                  {idx + 1} / {list.length}
                </span>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {site.musicSrc && <audio ref={audioRef} src={site.musicSrc} loop />}

        <style>{`
          .ss-btn{display:grid;place-items:center;height:46px;width:46px;border-radius:9999px;color:#FBF6EE;background:rgba(20,14,8,0.5);backdrop-filter:blur(8px);transition:.2s}
          .ss-btn:hover{background:rgba(199,154,75,0.85);color:#241B12}
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
}
