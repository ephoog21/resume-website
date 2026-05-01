/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // The aesthetic: an editorial, executive-data-leader feel. Deep ink
      // background, parchment text, and a single warm amber accent. No purple
      // gradients on white. We rely on contrast + typography, not chrome.
      colors: {
        ink: {
          DEFAULT: "#0B0D10", // page bg
          50: "#13161B",
          100: "#181C22",
          200: "#1E232B",
          300: "#272D37",
          400: "#3A4150",
          500: "#525B6D",
        },
        parchment: {
          DEFAULT: "#EDE6D6",
          dim: "#C8C2B4",
          mute: "#8E897D",
        },
        amber: {
          // Warm copper accent, not a generic Tailwind orange
          glow: "#E8B45C",
          deep: "#B07A2A",
        },
        teal: {
          accent: "#6FB7B7",
        },
      },
      fontFamily: {
        // Display: Fraunces (variable serif w/ optical size + soft contrast)
        // Body: IBM Plex Sans (warm grotesque, executive feel)
        // Mono: JetBrains Mono (data/terminal voice)
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        widest2: "0.18em",
      },
      animation: {
        "ticker-rise": "tickerRise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-up": "fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        "shimmer": "shimmer 8s linear infinite",
        // Slow vertical drift used by the hero scroll cue and the editorial
        // section bridges. Goes ~12px down → fade out → reset; reads as a
        // gentle invitation rather than a pulsing button.
        "scroll-hint": "scrollHint 2.4s ease-in-out infinite",
      },
      keyframes: {
        tickerRise: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        scrollHint: {
          "0%, 100%": { opacity: "0.2", transform: "translateY(0)" },
          "50%": { opacity: "0.9", transform: "translateY(8px)" },
        },
      },
    },
  },
  plugins: [],
};
