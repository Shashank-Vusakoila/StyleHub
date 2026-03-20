/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx,mdx}',
    './components/**/*.{js,jsx,ts,tsx,mdx}',
    './hooks/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F4F1EA',
          50:  '#FDFCFA',
          100: '#F9F7F2',
          200: '#F4F1EA',
          300: '#EDE9E0',
          400: '#E3DDD1',
          500: '#D5CCBD',
        },
        green: {
          deep:    '#1E3D2C',
          DEFAULT: '#2A4A38',
          medium:  '#345B46',
          light:   '#4A7C5A',
          muted:   '#5E8F6E',
          pale:    '#A8C9B4',
        },
        gold: {
          DEFAULT: '#C8A96A',
          light:   '#DFC28D',
          dark:    '#A8863E',
          pale:    '#EDD9A3',
        },
        stone: {
          DEFAULT: '#8C7E6E',
          light:   '#B5A898',
        },
        ink: {
          DEFAULT: '#1A1A1A',
          soft:    '#2C2C2C',
          muted:   '#5C5C5C',
          faint:   '#8A8A8A',
        },
      },
      fontFamily: {
        serif:   ['var(--font-cormorant)', '"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['var(--font-cormorant)', '"Cormorant"', 'Georgia', 'serif'],
        sans:    ['var(--font-jakarta)', '"Plus Jakarta Sans"', '"DM Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['clamp(3.5rem,9vw,8rem)', { lineHeight: '0.9', letterSpacing: '-0.02em' }],
        'display-xl':  ['clamp(2.8rem,7vw,6rem)',  { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'display-lg':  ['clamp(2.2rem,5vw,4.5rem)', { lineHeight: '1.0',  letterSpacing: '-0.015em' }],
        'display-md':  ['clamp(1.8rem,4vw,3rem)',   { lineHeight: '1.05', letterSpacing: '-0.01em' }],
      },
      borderRadius: {
        pill: '999px',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft':     '0 2px 20px rgba(42,74,56,0.06)',
        'soft-md':  '0 4px 32px rgba(42,74,56,0.08)',
        'soft-lg':  '0 8px 48px rgba(42,74,56,0.12)',
        'soft-xl':  '0 16px 64px rgba(42,74,56,0.16)',
        'lift':     '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
        'lift-md':  '0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.08)',
        'lift-lg':  '0 4px 16px rgba(0,0,0,0.06), 0 16px 48px rgba(0,0,0,0.12)',
        'green-sm': '0 2px 12px rgba(42,74,56,0.20)',
        'green-md': '0 4px 24px rgba(42,74,56,0.28)',
        'green-lg': '0 8px 40px rgba(42,74,56,0.36)',
        'gold':     '0 4px 20px rgba(200,169,106,0.30)',
      },
      backgroundImage: {
        'ripple': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800'%3E%3Cdefs%3E%3CradialGradient id='r' cx='20%25' cy='80%25' r='80%25'%3E%3Cstop offset='0%25' stop-color='%232A4A38' stop-opacity='0.04'/%3E%3Cstop offset='100%25' stop-color='%232A4A38' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx='160' cy='640' r='80'  fill='none' stroke='%232A4A38' stroke-opacity='0.04' stroke-width='1'/%3E%3Ccircle cx='160' cy='640' r='160' fill='none' stroke='%232A4A38' stroke-opacity='0.035' stroke-width='1'/%3E%3Ccircle cx='160' cy='640' r='240' fill='none' stroke='%232A4A38' stroke-opacity='0.03' stroke-width='1'/%3E%3Ccircle cx='160' cy='640' r='320' fill='none' stroke='%232A4A38' stroke-opacity='0.025' stroke-width='1'/%3E%3Ccircle cx='160' cy='640' r='400' fill='none' stroke='%232A4A38' stroke-opacity='0.02' stroke-width='1'/%3E%3Ccircle cx='160' cy='640' r='480' fill='none' stroke='%232A4A38' stroke-opacity='0.015' stroke-width='1'/%3E%3Ccircle cx='160' cy='640' r='560' fill='none' stroke='%232A4A38' stroke-opacity='0.01' stroke-width='1'/%3E%3Ccircle cx='160' cy='640' r='640' fill='none' stroke='%232A4A38' stroke-opacity='0.008' stroke-width='1'/%3E%3Ccircle cx='160' cy='640' r='720' fill='none' stroke='%232A4A38' stroke-opacity='0.006' stroke-width='1'/%3E%3C/svg%3E\")",
        'ripple-center': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1000' height='600'%3E%3Ccircle cx='500' cy='300' r='80'  fill='none' stroke='%232A4A38' stroke-opacity='0.04' stroke-width='1'/%3E%3Ccircle cx='500' cy='300' r='160' fill='none' stroke='%232A4A38' stroke-opacity='0.035' stroke-width='1'/%3E%3Ccircle cx='500' cy='300' r='240' fill='none' stroke='%232A4A38' stroke-opacity='0.03' stroke-width='1'/%3E%3Ccircle cx='500' cy='300' r='320' fill='none' stroke='%232A4A38' stroke-opacity='0.02' stroke-width='1'/%3E%3Ccircle cx='500' cy='300' r='400' fill='none' stroke='%232A4A38' stroke-opacity='0.015' stroke-width='1'/%3E%3Ccircle cx='500' cy='300' r='480' fill='none' stroke='%232A4A38' stroke-opacity='0.01' stroke-width='1'/%3E%3C/svg%3E\")",
        'hero-gradient': 'linear-gradient(135deg, #F4F1EA 0%, #EDE9E0 50%, #E3DDD1 100%)',
        'green-gradient': 'linear-gradient(135deg, #1E3D2C 0%, #2A4A38 50%, #345B46 100%)',
        'gold-gradient':  'linear-gradient(135deg, #C8A96A 0%, #DFC28D 50%, #A8863E 100%)',
      },
      keyframes: {
        'fade-up':    { '0%': { opacity: 0, transform: 'translateY(24px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        'fade-in':    { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        'slide-left': { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        'float':      { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-12px)' } },
        'scale-in':   { '0%': { opacity: 0, transform: 'scale(0.95)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
      },
      animation: {
        'fade-up':    'fade-up 0.7s ease-out forwards',
        'fade-in':    'fade-in 0.5s ease-out forwards',
        'marquee':    'slide-left 28s linear infinite',
        'float':      'float 6s ease-in-out infinite',
        'scale-in':   'scale-in 0.4s ease-out forwards',
      },
      transitionTimingFunction: {
        'bounce-out': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
};
