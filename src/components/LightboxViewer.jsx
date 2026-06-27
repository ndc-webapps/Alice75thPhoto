import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useGallery } from "../context/GalleryContext.jsx";
import { downloadPhoto, copyPhotoLink } from "../utils/download.js";
import { site } from "../config/site.js";
import { formatDate } from "../utils/photos.js";
import {
  Close, ChevronLeft, ChevronRight, Heart, HeartFilled,
  Download, ZoomIn, ZoomOut, Link as LinkIcon
} from "./icons.jsx";

export default function LightboxViewer() {
  const { lightbox, closeLightbox, isFavorite, toggleFavorite } = useGallery();
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [copied, setCopied] = useState(false);
  const touch = useRef({ x: 0, y: 0, t: 0 });

  const list = lightbox?.list || [];
  const photo = list[idx];

  // sync index when opened
  useEffect(() => {
    if (lightbox) { setIdx(lightbox.index || 0); setZoom(1); }
  }, [lightbox]);

  const go = useCallback((dir) => {
    setZoom(1);
    setIdx((i) => (i + dir + list.length) % list.length);
  }, [list.length]);

  // keyboard
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key.toLowerCase() === "f" && photo) toggleFavorite(photo.id);
      else if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(z + 0.5, 4));
      else if (e.key === "-") setZoom((z) => Math.max(z - 0.5, 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, go, closeLightbox, toggleFavorite, photo]);

  // lock body scroll while open
  useEffect(() => {
    if (lightbox) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [lightbox]);

  // preload neighbours
  useEffect(() => {
    if (!list.length) return;
    [idx + 1, idx - 1].forEach((j) => {
      const p = list[(j + list.length) % list.length];
      if (p) { const im = new Image(); im.src = p.src; }
    });
  }, [idx, list]);

  if (!lightbox || !photo) return null;
  const fav = isFavorite(photo.id);

  const onTouchStart = (e) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY, t: Date.now() };
  };
  const onTouchEnd = (e) => {
    if (zoom !== 1) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touch.current.x;
    const dy = t.clientY - touch.current.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
    else if (dy > 90) closeLightbox();
  };

  const onCopy = async () => {
    const ok = await copyPhotoLink(photo);
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 1600); }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="lightbox"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex flex-col bg-ink/95 backdrop-blur-sm"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* blurred backdrop of current image */}
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage: `url(${photo.thumb})`,
            backgroundSize: "cover", backgroundPosition: "center", filter: "blur(40px)"
          }}
        />

        {/* top bar */}
        <div className="relative z-10 flex items-center justify-between px-4 py-3 text-cream sm:px-6">
          <div className="min-w-0">
            <p className="truncate font-display text-lg">{photo.albumName}</p>
            <p className="text-xs text-champagne/60">
              {idx + 1} of {list.length}
              {photo.dateTaken ? ` · ${formatDate(photo.dateTaken)}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setZoom((z) => Math.max(z - 0.5, 1))} className="lb-btn" aria-label="Zoom out"><ZoomOut size={18} /></button>
            <button onClick={() => setZoom((z) => Math.min(z + 0.5, 4))} className="lb-btn" aria-label="Zoom in"><ZoomIn size={18} /></button>
            <button onClick={onCopy} className="lb-btn relative" aria-label="Copy link">
              <LinkIcon size={18} />
              {copied && <span className="absolute -bottom-7 right-0 rounded bg-gold px-2 py-0.5 text-[10px] text-ink">Copied!</span>}
            </button>
            <button
              onClick={() => toggleFavorite(photo.id)}
              className={`lb-btn ${fav ? "!text-rose-400" : ""}`}
              aria-label="Favorite"
            >
              {fav ? <HeartFilled size={18} /> : <Heart size={18} />}
            </button>
            {site.allowDownload && (
              <button onClick={() => downloadPhoto(photo)} className="lb-btn" aria-label="Download"><Download size={18} /></button>
            )}
            <button onClick={closeLightbox} className="lb-btn" aria-label="Close"><Close size={20} /></button>
          </div>
        </div>

        {/* image stage */}
        <div className="relative z-0 flex flex-1 items-center justify-center overflow-hidden px-2">
          <button
            onClick={() => go(-1)}
            className="lb-arrow left-2 sm:left-5"
            aria-label="Previous"
          ><ChevronLeft size={26} /></button>

          <AnimatePresence mode="wait">
            <motion.img
              key={photo.id}
              src={photo.src}
              alt={photo.caption || photo.albumName}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: zoom }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              onDoubleClick={() => setZoom((z) => (z === 1 ? 2.2 : 1))}
              draggable={false}
              style={{ cursor: zoom > 1 ? "grab" : "zoom-in" }}
              className="max-h-[78vh] max-w-[94vw] select-none rounded-lg object-contain shadow-2xl"
            />
          </AnimatePresence>

          <button
            onClick={() => go(1)}
            className="lb-arrow right-2 sm:right-5"
            aria-label="Next"
          ><ChevronRight size={26} /></button>
        </div>

        {/* caption / filename */}
        <div className="relative z-10 px-6 pb-5 pt-2 text-center">
          {photo.caption ? (
            <p className="font-serif text-lg italic text-cream/90">{photo.caption}</p>
          ) : (
            <p className="text-xs text-champagne/50">{photo.filename}</p>
          )}
        </div>

        <style>{`
          .lb-btn{display:grid;place-items:center;height:42px;width:42px;border-radius:9999px;color:#FBF6EE;background:rgba(20,14,8,0.5);backdrop-filter:blur(8px);transition:.2s}
          .lb-btn:hover{background:rgba(199,154,75,0.85);color:#241B12}
          .lb-arrow{position:absolute;top:50%;transform:translateY(-50%);z-index:20;display:grid;place-items:center;height:52px;width:52px;border-radius:9999px;color:#FBF6EE;background:rgba(20,14,8,0.45);backdrop-filter:blur(8px);transition:.2s}
          .lb-arrow:hover{background:rgba(199,154,75,0.9);color:#241B12}
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
}
