/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Poppins", "sans-serif"],
      },
      colors: {
        "royal-purple": "#8F659A",
        mandarin: "#EF8767",
        silver: "#F7F4F7",
      },
    },
  },
  plugins: [],
};
