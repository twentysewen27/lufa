/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper:           '#f4ede1',
        'paper-2':       '#ebe2d2',
        'paper-3':       '#e1d6c2',
        ink:             '#1a1714',
        'ink-2':         '#3a342d',
        mute:            '#7a7064',
        'mute-2':        '#a39989',
        hairline:        '#d6cbb4',
        'hairline-soft': '#e3d9c5',
        fab:             '#D97757',
        luca:            '#2A6FDB',
        done:            '#3a7d5e',
        warn:            '#b25a3c',
        'cat-date-night': '#b25a3c',
        'cat-trip':       '#2A6FDB',
        'cat-restaurant': '#c08a3e',
        'cat-hike':       '#3a7d5e',
        'cat-event':      '#8b3a8b',
        'cat-routine':    '#6b6359',
        'cat-other':      '#7a7064',
        // dark mode overrides via CSS variables
        'dark-paper':   '#15120e',
        'dark-paper-2': '#1d1914',
        'dark-paper-3': '#28231b',
      },
      fontFamily: {
        serif: ['"Instrument Serif"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:  ['Geist', '-apple-system', 'system-ui', 'sans-serif'],
        mono:  ['"JetBrains Mono"', '"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        pill:  '999px',
        sheet: '28px',
        card:  '10px',
      },
      boxShadow: {
        fab:   '0 12px 30px rgba(26,23,20,0.35), 0 4px 8px rgba(26,23,20,0.2)',
        sheet: '0 -20px 60px rgba(0,0,0,0.18)',
        ghost: '0 14px 40px rgba(0,0,0,0.25)',
      },
    },
  },
  plugins: [],
}

