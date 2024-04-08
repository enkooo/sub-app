/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'off-white': {
          DEFAULT: '#E3E3E3',
        },
        dark: {
          DEFAULT: '#1A1A1A',
        },
        primary: {
          DEFAULT: '#3856ff',
        },
      },
    },
  },
  plugins: [],
}
