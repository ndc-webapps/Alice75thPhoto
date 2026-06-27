import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import PasscodeScreen from "./components/PasscodeScreen.jsx";
import Home from "./pages/Home.jsx";
import Albums from "./pages/Albums.jsx";
import AlbumView from "./pages/AlbumView.jsx";
import AllPhotos from "./pages/AllPhotos.jsx";
import Favorites from "./pages/Favorites.jsx";
import { site } from "./config/site.js";

export default function App() {
  const [unlocked, setUnlocked] = useState(
    !site.passcode.enabled || sessionStorage.getItem("g75_unlocked") === "1"
  );

  if (!unlocked) return <PasscodeScreen onUnlock={() => setUnlocked(true)} />;

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/albums" element={<Albums />} />
        <Route path="/album/:id" element={<AlbumView />} />
        <Route path="/all" element={<AllPhotos />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
