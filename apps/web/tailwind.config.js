/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "Avenir Next", "sans-serif"],
      },
      boxShadow: {
        panel: "0 14px 44px rgba(3, 12, 20, 0.42)",
      },
      spacing: {
        18: "4.5rem",
      },
    },
  },
  plugins: [],
};
