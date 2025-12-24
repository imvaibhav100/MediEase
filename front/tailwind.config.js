/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0ea5e9', // blue-500
          dark: '#0369a1', // blue-800
        },
        accent: {
          DEFAULT: '#10b981', // emerald-500
          dark: '#047857', // emerald-800
        },
        muted: {
          DEFAULT: '#f3f4f6', // gray-100
        },
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 1s ease-out',
      },
    },
  },
  plugins: [],
}
