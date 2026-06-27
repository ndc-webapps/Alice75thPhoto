import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { site } from "../config/site.js";
import { useGallery } from "../context/GalleryContext.jsx";
import { Heart } from "./icons.jsx";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/albums", label: "Albums" },
  { to: "/all", label: "All Photos" },
  { to: "/favorites", label: "Favorites" }
];

export default function Navbar() {
  const { favIds } = useGallery();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled || pathname !== "/" ? "glass-dark shadow-soft" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-sheen font-display text-lg text-ink shadow-glow">
            75
          </span>
          <span className="hidden font-display text-lg text-cream sm:block">
            {site.honoree}'s Memories
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm transition ${
                  isActive ? "bg-gold/15 text-gold-bright" : "text-cream/80 hover:text-cream"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <Link
          to="/favorites"
          className="flex items-center gap-1.5 rounded-full glass px-3.5 py-1.5 text-sm text-cream"
        >
          <Heart size={16} className="text-rose-400" />
          <span>{favIds.length}</span>
        </Link>
      </div>
    </nav>
  );
}
