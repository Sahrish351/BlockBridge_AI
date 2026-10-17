/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bb-bg': 'var(--bb-bg)',
        'bb-surface': 'var(--bb-surface)',
        'bb-surface-soft': 'var(--bb-surface-soft)',
        'bb-surface-hover': 'var(--bb-surface-hover)',
        'bb-ink': 'var(--bb-ink)',
        'bb-ink-muted': 'var(--bb-ink-muted)',
        'bb-ink-subtle': 'var(--bb-ink-subtle)',
        'bb-brand': {
          DEFAULT: 'var(--bb-brand)',
          hover: 'var(--bb-brand-hover)',
          soft: 'var(--bb-brand-soft)',
          border: 'var(--bb-brand-border)',
        },
        'bb-coral': {
          DEFAULT: 'var(--bb-coral)',
          hover: 'var(--bb-coral-hover)',
          soft: 'var(--bb-coral-soft)',
        },
        'bb-butter': {
          DEFAULT: 'var(--bb-butter)',
          soft: 'var(--bb-butter-soft)',
        },
        'bb-line': {
          DEFAULT: 'var(--bb-line)',
          strong: 'var(--bb-line-strong)',
        },
        'bb-success': {
          DEFAULT: 'var(--bb-success)',
          soft: 'var(--bb-success-soft)',
        },
        'bb-warning': {
          DEFAULT: 'var(--bb-warning)',
          soft: 'var(--bb-warning-soft)',
        },
        'bb-danger': {
          DEFAULT: 'var(--bb-danger)',
          soft: 'var(--bb-danger-soft)',
        },
        'bb-info': {
          DEFAULT: 'var(--bb-info)',
          soft: 'var(--bb-info-soft)',
        },
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Fraunces', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '18px',
        '3xl': '24px',
      },
      boxShadow: {
        'card': '0 4px 16px -2px rgba(32, 39, 32, 0.06), 0 2px 4px -2px rgba(32, 39, 32, 0.04)',
        'card-hover': '0 12px 28px -4px rgba(32, 39, 32, 0.10), 0 4px 8px -2px rgba(32, 39, 32, 0.04)',
        'elevated': '0 20px 32px -8px rgba(32, 39, 32, 0.12)',
      },
    },
  },
  plugins: [],
};
