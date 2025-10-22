import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx,mdx,md}",
    "./node_modules/@astrojs/tailwind/dist/**/*.mjs"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#0f4c81",
          gold: "#f5c518"
        }
      }
    }
  },
  plugins: []
} satisfies Config;
