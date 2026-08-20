import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#1A3A2A",
          50: "#F0F5F2",
          100: "#D4E5DA",
          200: "#A8CCBA",
          300: "#7BB299",
          400: "#4F9879",
          500: "#2D5A3D",
          600: "#244932",
          700: "#1A3A2A",
          800: "#122820",
          900: "#091514",
        },
        leaf: {
          DEFAULT: "#2D5A3D",
          light: "#5A8A6A",
        },
        sage: "#5A8A6A",
        earth: {
          DEFAULT: "#8B6914",
          light: "#C4A052",
        },
        cream: "#F7F4EF",
        parchment: "#EDE8DF",
        charcoal: "#1C1C1E",
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        serif: ["var(--font-jakarta)", "Georgia", "serif"],
        devanagari: ["var(--font-noto-devanagari)", "serif"],
        "devanagari-sans": ["var(--font-noto-devanagari-sans)", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 8vw, 7rem)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2.5rem, 6vw, 5rem)", { lineHeight: "1.08", letterSpacing: "-0.025em" }],
        "display-md": ["clamp(2rem, 4vw, 3.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "heading-xl": ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
        "heading-lg": ["clamp(1.5rem, 2.5vw, 2rem)", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "heading-md": ["clamp(1.25rem, 2vw, 1.5rem)", { lineHeight: "1.25" }],
        "body-lg": ["clamp(1rem, 1.5vw, 1.125rem)", { lineHeight: "1.7" }],
        "body-md": ["1rem", { lineHeight: "1.65" }],
        "body-sm": ["0.875rem", { lineHeight: "1.6" }],
        "label": ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.08em" }],
      },
      spacing: {
        "section": "clamp(5rem, 10vw, 8rem)",
        "section-sm": "clamp(3rem, 6vw, 5rem)",
      },
      borderRadius: {
        "brand": "0.375rem",
        "card": "0.75rem",
      },
      boxShadow: {
        "card": "0 2px 12px rgba(26, 58, 42, 0.08), 0 1px 3px rgba(26, 58, 42, 0.06)",
        "card-hover": "0 8px 32px rgba(26, 58, 42, 0.14), 0 2px 8px rgba(26, 58, 42, 0.08)",
        "nav": "0 1px 0 rgba(26, 58, 42, 0.08), 0 4px 16px rgba(26, 58, 42, 0.04)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(to bottom, rgba(26,58,42,0.35) 0%, rgba(26,58,42,0.15) 40%, rgba(26,58,42,0.5) 100%)",
        "section-gradient": "linear-gradient(180deg, #F7F4EF 0%, #FFFFFF 100%)",
      },
      transitionTimingFunction: {
        "premium": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
    },
  },
  plugins: [],
};

export default config;
