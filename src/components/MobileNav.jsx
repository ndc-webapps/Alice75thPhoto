import { NavLink } from "react-router-dom";
import { Home, Grid, Images, Heart } from "./icons.jsx";
import { useGallery } from "../context/GalleryContext.jsx";

const items = [
  { to: "/", label: "Home", end: true, Icon: Home },
  { to: "/albums", label: "Albums", Icon: Grid },
  { to: "/all", label: "Photos", Icon: Images },
  { to: "/favorites", label: "Loves", Icon: Heart }
];

export default function MobileNav() {
  const { favIds } = useGallery();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="glass-dark mx-auto mb-3 flex max-w-md items-center justify-around rounded-2xl px-2 py-2 shadow-card">
        {items.map(({ to, label, end, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `relative flex min-w-[64px] flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[11px] transition ${
                isActive ? "text-gold-bright" : "text-cream/70"
              }`
            }
          >
            <Icon size={22} />
            {label}
            {to === "/favorites" && favIds.length > 0 && (
              <span className="absolute right-2 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] text-white">
                {favIds.length}
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
