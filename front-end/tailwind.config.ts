import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        darkBg: '#1f2937', // Background dark
        darkCard: '#374151', // Card dark
        lightBg: '#f9fafb', // Background light
        lightCard: '#ffffff', // Card light
        primary: '#2563eb', // Warna utama untuk accent
      },
    },
  },
  plugins: [],
};
export default config;
