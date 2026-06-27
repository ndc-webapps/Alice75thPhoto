// Lightweight inline SVG icons (no icon library needed).
const S = ({ children, size = 22, ...p }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"
    strokeLinejoin="round" {...p}>{children}</svg>
);

export const Heart = (p) => <S {...p}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" /></S>;
export const HeartFilled = (p) => <S fill="currentColor" {...p}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" /></S>;
export const Download = (p) => <S {...p}><path d="M12 3v12" /><path d="m7 11 5 5 5-5" /><path d="M5 21h14" /></S>;
export const Close = (p) => <S {...p}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></S>;
export const ChevronLeft = (p) => <S {...p}><path d="m15 18-6-6 6-6" /></S>;
export const ChevronRight = (p) => <S {...p}><path d="m9 18 6-6-6-6" /></S>;
export const Play = (p) => <S {...p}><path d="M6 4v16l14-8z" fill="currentColor" stroke="none" /></S>;
export const Pause = (p) => <S {...p}><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none" /><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" stroke="none" /></S>;
export const Search = (p) => <S {...p}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></S>;
export const ZoomIn = (p) => <S {...p}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3M11 8v6M8 11h6" /></S>;
export const ZoomOut = (p) => <S {...p}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3M8 11h6" /></S>;
export const Link = (p) => <S {...p}><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5" /><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5" /></S>;
export const Lock = (p) => <S {...p}><rect x="4" y="11" width="16" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></S>;
export const Sparkle = (p) => <S {...p}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /></S>;
export const Images = (p) => <S {...p}><rect x="3" y="3" width="14" height="14" rx="2" /><path d="M21 7v12a2 2 0 0 1-2 2H7" /><path d="m3 14 3.5-3.5 3 3L14 9l3 4" /></S>;
export const Home = (p) => <S {...p}><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></S>;
export const Shuffle = (p) => <S {...p}><path d="M16 3h5v5" /><path d="M4 20 21 3" /><path d="M21 16v5h-5" /><path d="m15 15 6 6M4 4l5 5" /></S>;
export const Expand = (p) => <S {...p}><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M3 16v3a2 2 0 0 0 2 2h3" /></S>;
export const Music = (p) => <S {...p}><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></S>;
export const Grid = (p) => <S {...p}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></S>;
export const Star = (p) => <S {...p}><path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z" /></S>;
export const MapPin = (p) => <S {...p}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></S>;
