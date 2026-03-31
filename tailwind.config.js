/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",   // blue
        accent: "#22c55e",    // green
        darkbg: "#0f172a"     // dark background
      }
    }
  },

  plugins: [], 
 
}; 