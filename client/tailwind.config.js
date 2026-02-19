/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Segoe UI', 'Arial Hebrew', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
