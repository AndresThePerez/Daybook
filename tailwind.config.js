/** @type {import('tailwindcss').Config} */
export default {
  content: ['./resources/**/*.{js,jsx,blade.php}'],
  theme: {
    extend: {
      colors: {
        paper: '#E8EBF0', surface: '#FFFFFF', sunken: '#DDE2EA',
        ink: { DEFAULT: '#191B21', soft: '#626B7D', faint: '#97A0B0' },
        hairline: '#D2D8E1',
        ember: { DEFAULT: '#E08A3C', low: '#CF5230' },
        kept: '#2F6F7E',
        cat: {
          work: '#4C6FB1', personal: '#8A6DB0', shopping: '#C77D4A',
          health: '#4F9E83', finance: '#B0894C', education: '#6E7E55',
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: { card: '0 1px 2px rgba(25,27,33,.04), 0 6px 20px rgba(25,27,33,.06)' },
      borderRadius: { card: '14px' },
    },
  },
  plugins: [],
}
