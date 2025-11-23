/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5dade2',
          dark: '#4da8d8',
        },
        background: {
          DEFAULT: '#1a0d2e',
          light: '#4a2c7a',
        }
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

