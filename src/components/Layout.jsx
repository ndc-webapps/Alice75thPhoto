import Navbar from "./Navbar.jsx";
import MobileNav from "./MobileNav.jsx";
import LightboxViewer from "./LightboxViewer.jsx";
import SlideshowMode from "./SlideshowMode.jsx";
import { site } from "../config/site.js";
import { Heart } from "./icons.jsx";

export default function Layout({ children }) {
  return (
    <div className="app-bg flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">{children}</main>

      <footer className="border-t border-champagne/10 px-6 py-10 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="hairline mx-auto mb-6 w-40" />
          <p className="font-serif text-lg italic text-champagne/80">“{site.tagline}”</p>
          <p className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-cream/50">
            {site.privacyNote}
          </p>
          <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-champagne/40">
            Made with <Heart size={13} className="text-rose-400" /> for {site.honoree}'s 75th
          </p>
        </div>
      </footer>

      <MobileNav />

      {/* global overlays */}
      <LightboxViewer />
      <SlideshowMode />
    </div>
  );
}
