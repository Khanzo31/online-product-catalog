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
    // REMOVED: The entire extend block with the custom 'brand' color is gone.
    // We will use standard Tailwind colors like 'red-600'.
    extend: {},
  },
  plugins: [typography],
};

export default config;
