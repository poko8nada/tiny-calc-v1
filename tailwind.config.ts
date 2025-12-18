import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/_components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#0a0a0a',
          'surface': '#1a1a1a',
          'surface-highlight': '#2a2a2a',
          'gold': '#ffd700',
          'amber': '#ffb347',
          'muted': '#888888',
          'cyan': '#00d4ff',
          'mint': '#00ff88',
          'red': '#ff4444',
          'border-dim': '#444444',
        },
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255, 215, 0, 0.5)',
        'glow-sm': '0 0 10px rgba(255, 215, 0, 0.3)',
      },
      animation: {
        'cursor-blink': 'blink 1s infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
