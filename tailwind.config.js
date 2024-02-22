/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./views/**/*.{ejs,html,js}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
}

