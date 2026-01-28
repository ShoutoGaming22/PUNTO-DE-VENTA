/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/renderer/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pos-blue': '#1e40af',
        'pos-slate': '#0f172a',
      },
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(120px, 1fr))',
      },
    },
  },
  plugins: [],
}
