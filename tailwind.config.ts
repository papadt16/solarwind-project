import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: "#03130f",
          900: "#052019",
          800: "#064e3b"
        },
        solar: "#fbbf24",
        wind: "#38bdf8",
        tealglow: "#2dd4bf"
      },
      boxShadow: {
        glass: "0 24px 70px rgba(0, 0, 0, 0.42)",
        depth: "0 22px 45px rgba(3, 19, 15, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.08)"
      },
      backgroundImage: {
        "panel-shine": "linear-gradient(145deg, rgba(255,255,255,0.14), rgba(255,255,255,0.04) 48%, rgba(6,78,59,0.18))"
      }
    }
  },
  plugins: []
};

export default config;
