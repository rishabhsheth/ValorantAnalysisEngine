/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'val-red': {
          DEFAULT: '#FF4655',
          50: '#FFE5E7',
          100: '#FFCCD0',
          200: '#FF99A3',
          300: '#FF6675',
          400: '#FF4655',
          500: '#FF1F31',
          600: '#E6001A',
          700: '#B30014',
          800: '#80000E',
          900: '#4D0009',
        },
        'val-blue': {
          DEFAULT: '#0F1923',
          50: '#4A5C6E',
          100: '#3D4F61',
          200: '#2E3F50',
          300: '#1F2F3F',
          400: '#171F2A',
          500: '#0F1923',
          600: '#0A1118',
          700: '#05090D',
          800: '#000000',
          900: '#000000',
        },
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-red': '0 0 20px rgba(255, 70, 85, 0.3)',
        'glow-red-lg': '0 0 40px rgba(255, 70, 85, 0.4)',
        'glow-blue': '0 0 20px rgba(96, 165, 250, 0.3)',
        'glow-blue-lg': '0 0 40px rgba(96, 165, 250, 0.4)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 70, 85, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 70, 85, 0.5)' },
        },
      },
    },
  },
  plugins: [],
};
