/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        dosis: ["Dosis", "sans-serif"],
        barlow: ["Barlow Condensed", "sans-serif"],
        delius: ["Delius", "cursive"],
        sour: ["Sour Gummy", "sans-serif"],
      },
      transitionDuration: {
        2000: "2000ms",
      },
    },
  },
  plugins: [],
};
