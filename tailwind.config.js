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
        malayalam: ['"Noto Sans Malayalam"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', '"Noto Sans Malayalam"', 'sans-serif'],
      },
      colors: {
        kerala: {
          green: {
            50: '#ecfdf5',
            100: '#d1fae5',
            400: '#34d399',
            500: '#10b981',
            600: '#059669',
            700: '#047857',
            900: '#064e3b',
          },
          gold: {
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
          },
          crimson: {
            500: '#f43f5e',
            600: '#e11d48',
          },
          dark: {
            900: '#0B0F19',
            800: '#111827',
            700: '#1F2937',
            600: '#374151',
          }
        }
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce 2s infinite',
        'wiggle': 'wiggle 0.5s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },
  plugins: [],
}
