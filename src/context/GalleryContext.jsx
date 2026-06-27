import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

const GalleryContext = createContext(null);

export function GalleryProvider({ children }) {
  // Favorites — array of photo ids, stored on this device.
  const [favIds, setFavIds] = useLocalStorage("g75_favorites", []);
  const favSet = useMemo(() => new Set(favIds), [favIds]);

  const isFavorite = useCallback((id) => favSet.has(id), [favSet]);
  const toggleFavorite = useCallback((id) => {
    setFavIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, [setFavIds]);

  // Lightbox: { list, index } or null
  const [lightbox, setLightbox] = useState(null);
  const openLightbox = useCallback((list, index = 0) => setLightbox({ list, index }), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  // Slideshow: { list, index } or null
  const [slideshow, setSlideshow] = useState(null);
  const openSlideshow = useCallback((list, index = 0) => setSlideshow({ list, index }), []);
  const closeSlideshow = useCallback(() => setSlideshow(null), []);

  const value = useMemo(() => ({
    favIds, favSet, isFavorite, toggleFavorite,
    lightbox, openLightbox, closeLightbox, setLightbox,
    slideshow, openSlideshow, closeSlideshow
  }), [favIds, favSet, isFavorite, toggleFavorite, lightbox, openLightbox,
       closeLightbox, slideshow, openSlideshow, closeSlideshow]);

  return <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>;
}

export function useGallery() {
  const ctx = useContext(GalleryContext);
  if (!ctx) throw new Error("useGallery must be used inside GalleryProvider");
  return ctx;
}
