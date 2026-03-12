/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
      extend: {
        colors: {
          "primary": {
            50: "#fff7ed",
            100: "#ffedd5",
            500: "#f97316",
            600: "#ea580c",
            700: "#c2410c",
          },
          "secondary": {
            500: "#0ea5e9",
            600: "#0284c7",
            900: "#0c4a6e",
          }
        },
        fontFamily: {
          "sans": ["Plus Jakarta Sans", "sans-serif"],
          "serif": ["Playfair Display", "serif"],
        },
        animation: {
          'float': 'float 6s ease-in-out infinite',
          'blob': 'blob 7s infinite',
        },
        keyframes: {
          float: {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-10px)' },
          },
          blob: {
            '0%': { transform: 'translate(0px, 0px) scale(1)' },
            '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
            '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
            '100%': { transform: 'translate(0px, 0px) scale(1)' },
          }
        }
      },
    },
    plugins: [],
  }