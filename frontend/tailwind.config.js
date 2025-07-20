// frontend/tailwind.config.js
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 1. Add a new font family for headings
      fontFamily: {
        // We will use the 'sans' variable for our body font (Inter)
        // and 'serif' for our heading font (Lora)
        serif: ["var(--font-lora)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      // 2. Add a new color for background depth
      colors: {
        "warm-bg": "#F9F6F2", // A subtle, warm off-white/beige
      },
      // 3. Define keyframes and animation utilities for micro-interactions
      keyframes: {
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
      },
    },
  },
  plugins: [typography],
};

export default config;
