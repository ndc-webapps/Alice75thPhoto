// Robust photo download — forces a save dialog instead of opening the image.
import { site } from "../config/site.js";

function friendlyName(photo) {
  const safeAlbum = photo.albumName.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "");
  const ext = (photo.download || photo.src).split(".").pop().split("?")[0];
  return `Alice75_${safeAlbum}_${photo.id}.${ext}`;
}

export async function downloadPhoto(photo) {
  if (!site.allowDownload) return;
  const url = photo.download || photo.src;
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const objUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objUrl;
    a.download = friendlyName(photo);
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(objUrl), 4000);
  } catch {
    // Fallback: open in new tab if fetch is blocked
    window.open(url, "_blank", "noopener");
  }
}

/** Copy a shareable link to this exact photo. */
export async function copyPhotoLink(photo) {
  const url = `${window.location.origin}/album/${photo.albumId}?photo=${photo.id}`;
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}
