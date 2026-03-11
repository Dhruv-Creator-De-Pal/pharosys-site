/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Bitcount Prop Double', 'Space Grotesk', 'IBM Plex Sans', 'Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        'navy': '#0b1c3d',
        'navy-dark': '#070b1d',
        'navy-darker': '#0f1631',
        'navy-darkest': '#0b1027',
        'orange': '#ff6b1a',
        'orange-light': '#ff7a3d',
        'orange-accent': '#ffb46a',
        'cyan': '#5be1ff',
        'cyan-light': '#b8f3ff',
        'text-primary': '#e9ecff',
        'text-muted': '#9aa4c5',
        'border': 'rgba(255, 255, 255, 0.08)',
      },
      fontSize: {
        'xs': '11px',
        'sm': '13px',
        'base': '14px',
        'lg': '15px',
        'xl': '16px',
        '2xl': '18px',
        '3xl': '24px',
        '4xl': 'clamp(34px, 5vw, 48px)',
      },
      borderRadius: {
        'DEFAULT': '12px',
        'sm': '14px',
        'md': '16px',
        'lg': '18px',
        'xl': '20px',
        '2xl': '24px',
      },
      boxShadow: {
        'glow': '0 18px 80px rgba(0, 0, 0, 0.55)',
        'glow-sm': '0 10px 40px rgba(0, 0, 0, 0.35)',
        'glow-orange': '0 12px 40px rgba(255, 122, 61, 0.35)',
        'glow-accent': '0 12px 50px rgba(255, 122, 61, 0.18)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'pulse-dot': 'pulseDot 1.2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.8s ease-out',
        'slide-down': 'slideDown 0.8s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseDot: {
          '0%': { opacity: '0.35', transform: 'scale(1)' },
          '50%': { opacity: '0.7' },
          '100%': { opacity: '0.35', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.6', filter: 'blur(0px)' },
          '50%': { opacity: '1', filter: 'blur(4px)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        DEFAULT: '12px',
      },
    },
  },
  plugins: [],
}
