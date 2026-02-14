/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        soul: {
          dark: '#0a0a0a',
          light: '#f5f0eb',
          accent: '#ffffff',
        }
      },
      backgroundImage: {
        'halftone-dark': 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
        'halftone-light': 'radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)',
      },
      backgroundSize: {
        'halftone': '6px 6px',
      }
    },
  },
  plugins: [],
}
