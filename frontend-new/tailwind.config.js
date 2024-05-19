/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  options: {
    safelist: [
      'bg-blue-100', 'text-blue-600',
      'bg-yellow-100', 'text-yellow-600',
      'bg-red-100', 'text-red-600',
      'bg-purple-100', 'text-purple-600',
      'bg-green-100', 'text-green-600',
      'bg-orange-100', 'text-orange-600',
      'bg-gray-100', 'text-gray-600'
    ],
  },
  theme: {
    extend: {
      colors: {
        'berkeley-blue': '#0D2C54',
        'tangelo': '#F6511D',
        'selective-yellow': '#FFB400',
        'picton-blue': '#00A6ED',
        'apple-green': '#7FB800',
      },
      minHeight: {
        'screen-minus-62': 'calc(100vh - 62px)',
      },
    }
  },
  plugins: [],
}