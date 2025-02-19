/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],  theme: {
    extend: {
      zIndex: {
        '99': 99,
        '100': 100,
        '999': 999,
      },
      width: {
        '1/11': '11%'
      },
      screens:{
        'mb_L': '425px'
      }
    },
  },
  plugins: [],
}

