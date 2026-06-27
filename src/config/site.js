// =============================================================
//  SITE CONFIG  —  edit the words + privacy here
// =============================================================
export const site = {
  honoree: "Alice",
  title: "Alice's 75th Birthday",
  titleAccent: "Celebration",
  tagline: "A life full of love, laughter, and memories.",
  heroMessage:
    "Seventy-five years of warmth, wisdom, and a love that holds us all together. " +
    "Here are the moments we gathered to celebrate her.",
  dateLabel: "May 17, 2026",
  location: "Jazz Makati Club House — 6th Floor, Tower B",

  // Family passcode (NOT real security — just keeps strangers out).
  passcode: {
    enabled: false,                 // set true to require a code
    value: "family75",              // or set VITE_FAMILY_PASSCODE in a .env file
    hint: "Hint: ask anyone in the family 💛"
  },

  // Downloads
  allowDownload: true,              // set false to hide all download buttons

  privacyNote:
    "These are private family photos shared with love. " +
    "Please keep them within the family and don't repost publicly. 💛",

  // Slideshow
  slideshowSeconds: 4,

  // Optional ambient music: drop an .mp3 in /public/music/ and set the path.
  // Use ONLY music you own / royalty-free. Left empty by default.
  musicSrc: "" // e.g. "/music/ambient.mp3"
};

export const passcodeValue =
  import.meta.env.VITE_FAMILY_PASSCODE || site.passcode.value;
