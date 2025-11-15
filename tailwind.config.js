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
        ivory: {
          DEFAULT: '#FAF8F3',
          dark: '#F5F3ED',
        },
        navy: {
          DEFAULT: '#1B3A52',
          deep: '#0F2537',
        },
        emerald: {
          DEFAULT: '#1E5A46',
          deep: '#144032',
        },
        champagne: {
          DEFAULT: '#D4AF37',
          rich: '#B8941F',
        },
        charcoal: {
          DEFAULT: '#2B2B2B',
          light: '#3F3F3F',
        },
        pearl: '#FFFEFB',
      },
      fontFamily: {
        'serif': ['Playfair Display', 'Georgia', 'serif'],
        'body': ['Lora', 'Georgia', 'serif'],
        'decorative': ['Playfair Display', 'Georgia', 'serif'],
        'sans': ['Montserrat', 'system-ui', 'sans-serif'],
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
