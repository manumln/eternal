const {nextui} = require('@nextui-org/theme');
import * as tailwindAnimate from "tailwindcss-animate"

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Spotify', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        nimbus: ['Nimbus', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      backgroundSize: {
        '2900': '2900%',
        '3000': '3000%',
      },
      animation: {
        animate: 'animate 1s steps(29) 1',
      },
      keyframes: {
        animate: {
          '0%': { backgroundPosition: 'left' },
          '100%': { backgroundPosition: 'right' },
        },
      },
    },
  },
  plugins: [tailwindAnimate,require("@tailwindcss/aspect-ratio"),nextui()],
  
};
