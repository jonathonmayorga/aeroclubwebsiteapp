/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { 500: "#F59E0B", 600:"#D97706" } // orange
      },
      boxShadow: { card: "0 2px 10px rgba(0,0,0,0.08)" }
    },
  },
  plugins: [],
};
