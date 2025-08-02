/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#111827', // Your dark background
        'brand-surface': '#1F2937', // A slightly lighter surface color (like cards)
        'accent-red': '#DC2626',   // Your strong red accent
        'accent-green': '#10B981', // A vibrant green for success/highlights
        'accent-blue': '#3B82F6',  // A vibrant blue for links/buttons
      },
      fontFamily: {
        sans: ['"Inter"', ...defaultTheme.fontFamily.sans],
        display: ['"Orbitron"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}
