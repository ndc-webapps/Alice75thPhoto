/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Warm, premium birthday palette
        cream:    { DEFAULT: "#FBF6EE", soft: "#F4EADB" },
        champagne:{ DEFAULT: "#E8D2A6", deep: "#D8B981" },
        gold:     { DEFAULT: "#C79A4B", bright: "#E3B85F", soft: "#EBD9B4" },
        cocoa:    { DEFAULT: "#5A4632", deep: "#3A2C1E" },
        ink:      { DEFAULT: "#241B12", soft: "#2E241A" }
      },
      fontFamily: {
        display: ['"Playfair Display"', "serif"],
        serif:   ['"Cormorant Garamond"', "serif"],
        sans:    ["Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft:   "0 10px 40px -12px rgba(58,44,30,0.35)",
        glow:   "0 0 60px -10px rgba(227,184,95,0.45)",
        card:   "0 18px 50px -20px rgba(36,27,18,0.55)"
      },
      backgroundImage: {
        "gold-sheen": "linear-gradient(135deg,#E3B85F 0%,#C79A4B 45%,#8C6B36 100%)",
        "cream-fade": "linear-gradient(180deg,#FBF6EE 0%,#F4EADB 100%)"
      },
      keyframes: {
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        shimmer: {
          "0%":   { backgroundPosition: "-700px 0" },
          "100%": { backgroundPosition: "700px 0" }
        },
        "slow-zoom": {
          "0%":   { transform: "scale(1)" },
          "100%": { transform: "scale(1.08)" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out both",
        shimmer: "shimmer 1.6s linear infinite",
        "slow-zoom": "slow-zoom 12s ease-out forwards"
      }
    }
  },
  plugins: []
};
