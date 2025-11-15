/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        parchment: {
          DEFAULT: '#F4ECD8',
          dark: '#EBE3D5',
        },
        burgundy: {
          DEFAULT: '#8B2E3F',
          deep: '#6B2737',
        },
        forest: {
          DEFAULT: '#2C5F2D',
          deep: '#1F4722',
        },
        gold: {
          DEFAULT: '#D4A574',
          rich: '#C9975B',
        },
        ink: {
          DEFAULT: '#3E2723',
          light: '#5D4037',
        },
        cream: '#FFFBF5',
      },
      fontFamily: {
        'serif': ['Crimson Pro', 'Georgia', 'serif'],
        'body': ['Spectral', 'Georgia', 'serif'],
        'decorative': ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'shake': 'shake 0.5s ease-in-out',
        'gentle-fade': 'gentleFadeIn 0.4s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
      },
      backgroundSize: {
        '200%': '200% 200%',
      },
    },
  },
  plugins: [],
}
