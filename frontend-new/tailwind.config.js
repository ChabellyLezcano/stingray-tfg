/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'berkeley-blue': '#0D2C54',
        'tangelo': '#F6511D',
        'selective-yellow': '#FFB400',
        'picton-blue': '#00A6ED',
        'apple-green': '#7FB800',
      }
    }
  },
  plugins: [],
}