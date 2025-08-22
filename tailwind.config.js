/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#E6F3FF",
          300: "#4DA6FF",
          400: "#0052A3",
          500: "#0052A3",
        },
      },
    },
  },
  plugins: [],
};
