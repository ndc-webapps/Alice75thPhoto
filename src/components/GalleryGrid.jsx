import { useEffect, useMemo, useRef, useState } from "react";
import PhotoCard from "./PhotoCard.jsx";
import { useGallery } from "../context/GalleryContext.jsx";

const PAGE = 60;

export default function GalleryGrid({ photos, showAlbumTag = false }) {
  const { openLightbox } = useGallery();
  const [visible, setVisible] = useState(PAGE);
  const sentinel = useRef(null);

  // reset paging when the underlying list changes
  const key = useMemo(
    () => photos.length + ":" + (photos[0]?.id || "") + ":" + (photos[photos.length - 1]?.id || ""),
    [photos]
  );
  useEffect(() => { setVisible(PAGE); }, [key]);

  useEffect(() => {
    if (!sentinel.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible((v) => Math.min(v + PAGE, photos.length));
        }
      },
      { rootMargin: "900px 0px" }
    );
    io.observe(sentinel.current);
    return () => io.disconnect();
  }, [photos.length]);

  const shown = photos.slice(0, visible);

  return (
    <>
      <div className="masonry">
        {shown.map((p, i) => (
          <PhotoCard
            key={p.id}
            photo={p}
            showAlbumTag={showAlbumTag}
            onOpen={() => openLightbox(photos, i)}
          />
        ))}
      </div>

      {visible < photos.length && (
        <div ref={sentinel} className="h-24 grid place-items-center text-champagne/50 text-sm">
          Loading more memories…
        </div>
      )}
    </>
  );
}
