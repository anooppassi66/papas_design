import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#f69a39",
          "orange-dark": "#e8880d",
          black: "#1e1e21",
          "dark-bg": "#1a1a1a",
          "darker-bg": "#010101",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      letterSpacing: {
        brand: "0.36px",
        "brand-wide": "0.84px",
        caps: "1.1094px",
      },
      transitionDuration: {
        "400": "400ms",
      },
      aspectRatio: {
        "3/4": "3 / 4",
        "4/3": "4 / 3",
        "tile-tall": "336 / 485",
        "tile-wide": "684 / 500",
      },
      maxWidth: {
        site: "1440px",
      },
    },
  },
  plugins: [],
};

export default config;
