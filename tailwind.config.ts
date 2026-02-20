import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // <--- THIS IS THE CRITICAL LINE
  ],
  theme: {
    extend: {
      colors: {
        primary: "#006837",   // UmMart Green
        secondary: "#fb5533", // Shopee/Lazada Orange
      },
    },
  },
  plugins: [],
};
export default config;