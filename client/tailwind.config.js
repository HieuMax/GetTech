/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
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

