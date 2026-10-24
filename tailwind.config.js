/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-bg)',
        foreground: 'var(--color-text-main)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          elevated: 'var(--color-surface-elevated)',
          hover: 'var(--color-surface-hover)',
        },
        border: 'var(--color-border)',
        'brand-red': {
          DEFAULT: 'var(--color-brand-red)',
          hover: 'var(--color-brand-red-hover)',
          soft: 'var(--color-brand-red-soft)',
        },
        accent: {
          DEFAULT: 'var(--color-accent-amber)',
          gold: 'var(--color-accent-gold)',
          soft: 'var(--color-accent-soft)',
        },
        muted: 'var(--color-text-muted)',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
