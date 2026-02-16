/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#252533',
          raised: '#2e2e42',
          overlay: '#23232e',
          subtle: '#3a3a48',
          muted: '#45454f',
          border: '#56565e',
          hover: '#64646c',
        },
        text: {
          primary: '#fafafc',
          secondary: '#c8c8d8',
          tertiary: '#9a9aac',
          inverse: '#252533',
        },
        accent: {
          DEFAULT: '#7c6aef',
          hover: '#6d59e8',
          muted: 'rgba(124, 106, 239, 0.10)',
          text: '#b8aefc',
          border: 'rgba(124, 106, 239, 0.22)',
        },
        green: {
          DEFAULT: '#34d399',
          muted: 'rgba(52, 211, 153, 0.10)',
          text: '#6ee7b7',
        },
        amber: {
          DEFAULT: '#fbbf24',
          muted: 'rgba(251, 191, 36, 0.10)',
          text: '#fcd34d',
        },
        rose: {
          DEFAULT: '#f43f5e',
          muted: 'rgba(244, 63, 94, 0.10)',
          text: '#fda4af',
        },
        sky: {
          DEFAULT: '#38bdf8',
          muted: 'rgba(56, 189, 248, 0.10)',
          text: '#7dd3fc',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 0 0 1px rgba(255,255,255,.02), 0 2px 6px rgba(0,0,0,.3)',
        modal: '0 0 0 1px rgba(255,255,255,.04), 0 20px 50px rgba(0,0,0,.55)',
      },
    },
  },
  plugins: [],
};
