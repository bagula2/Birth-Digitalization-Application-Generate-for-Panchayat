import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#A98B76",
        secondary: "#BFA28C",
        surface: "#F3E4C9",
        accent: "#BABF94"
      },
      fontFamily: {
        sans: ["Manrope", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
