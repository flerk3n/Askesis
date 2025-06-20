/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0070f3",
        secondary: "#7c3aed",
        background: "#f9fafb",
        foreground: "#111827",
      },
      fontFamily: {
        'outfit': ['Outfit', 'sans-serif'],
        'coolvetica': ['Coolvetica', 'sans-serif'],
        'poppins': ['var(--font-poppins)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};