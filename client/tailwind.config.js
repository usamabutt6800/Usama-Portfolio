/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light-dark hybrid — soft dark like your previous portfolio
        dark: {
          DEFAULT: '#0f0f1a',
          100: '#16162a',
          200: '#1e1e35',
          300: '#252540',
          400: '#2e2e50',
        },
        // Primary purple-blue gradient accent (like your old portfolio)
        primary: '#6c63ff',
        secondary: '#a855f7',
        accent: '#06b6d4',
        // Card backgrounds — softer
        card: {
          DEFAULT: 'rgba(255,255,255,0.05)',
          hover: 'rgba(255,255,255,0.08)',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        // Purple-blue gradient used everywhere
        'gradient-primary': 'linear-gradient(135deg, #6c63ff 0%, #a855f7 50%, #06b6d4 100%)',
        'gradient-hero':    'linear-gradient(135deg, #0f0f1a 0%, #1a1040 50%, #0f1a2e 100%)',
        'gradient-card':    'linear-gradient(135deg, rgba(108,99,255,0.1) 0%, rgba(168,85,247,0.1) 100%)',
        'grid-pattern':     "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%236c63ff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'primary':    '0 0 30px rgba(108, 99, 255, 0.3)',
        'primary-lg': '0 0 60px rgba(108, 99, 255, 0.4)',
        'card':       '0 4px 24px rgba(0, 0, 0, 0.3)',
        'glass':      '0 8px 32px rgba(0, 0, 0, 0.2)',
        'glow':       '0 0 40px rgba(168, 85, 247, 0.3)',
      },
      animation: {
        'float':        'float 6s ease-in-out infinite',
        'pulse-slow':   'pulse 4s ease-in-out infinite',
        'spin-slow':    'spin 8s linear infinite',
        'marquee':      'marquee 30s linear infinite',
        'gradient':     'gradient 8s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-16px)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}