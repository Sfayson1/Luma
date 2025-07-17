/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        text: "#1F2937", // Slate 800
        text: "#6B7280", // Muted
        bg: "#A78BFA", // Soft Lavender
        bg: "#93C5FD", // Secondary
        bg: "#FDE68A", // Accent Mood tags
        bg: "#F9FAFB", // Background
      },
      fontFamily: {
        heading: ['"Playfair Display"', "serif"],
        body: ["Inter", "sans-serif"],
        quote: ['"Cormorant Garamond"', "serif"],
      },
    },
  },
  plugins: [],
};
