import AlbumBrowser from "../components/AlbumBrowser.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { hasPhotos } from "../utils/photos.js";

export default function Albums() {
  if (!hasPhotos) return <div className="pt-28"><EmptyState /></div>;
  return (
    <div className="pt-20">
      <AlbumBrowser
        title="Every Album"
        subtitle="Each folder of photos is kept as its own collection. Pick one to step inside."
      />
    </div>
  );
}
