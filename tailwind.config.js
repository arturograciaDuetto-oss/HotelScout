/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sora: ['Sora', 'sans-serif'],
      },
      colors: {
        // ── Duetto Brand Colour Tokens ──────────────────────────────────
        duetto: {
          // Core navy (primary brand)
          navy:       '#1B2B4B',
          'navy-800': '#243560',
          'navy-700': '#2D4075',
          'navy-600': '#374D8A',
          'navy-500': '#435A9F',

          // Vibrant blue (CTAs & interactive)
          blue:       '#0057B8',
          'blue-600': '#0066D9',
          'blue-500': '#0078F5',
          'blue-400': '#3395FF',
          'blue-300': '#66B2FF',
          'blue-100': '#D6EAFF',
          'blue-50':  '#EBF4FF',

          // Teal accent (highlights & badges)
          teal:       '#00A3A3',
          'teal-600': '#00BABA',
          'teal-400': '#33CCCC',
          'teal-100': '#CCF5F5',
          'teal-50':  '#E6FAFA',

          // Warm amber (warnings & revenue alerts)
          amber:      '#F59E0B',
          'amber-100':'#FEF3C7',
          'amber-50': '#FFFBEB',

          // Success green
          green:      '#10B981',
          'green-100':'#D1FAE5',
          'green-50': '#ECFDF5',

          // Danger / churn risk
          red:        '#EF4444',
          'red-100':  '#FEE2E2',
          'red-50':   '#FFF5F5',

          // Neutrals
          white:      '#FFFFFF',
          'gray-50':  '#F8F9FB',
          'gray-100': '#F1F3F7',
          'gray-200': '#E2E6EE',
          'gray-300': '#C8CFDC',
          'gray-400': '#9AA3B5',
          'gray-500': '#6B7590',
          'gray-600': '#4A5268',
          'gray-700': '#333A52',
          'gray-800': '#1F2537',
          'gray-900': '#111827',
        },
      },
      boxShadow: {
        'duetto-sm':  '0 1px 3px 0 rgba(27,43,75,0.08), 0 1px 2px -1px rgba(27,43,75,0.06)',
        'duetto':     '0 4px 6px -1px rgba(27,43,75,0.10), 0 2px 4px -2px rgba(27,43,75,0.08)',
        'duetto-md':  '0 10px 15px -3px rgba(27,43,75,0.10), 0 4px 6px -4px rgba(27,43,75,0.08)',
        'duetto-lg':  '0 20px 25px -5px rgba(27,43,75,0.12), 0 8px 10px -6px rgba(27,43,75,0.08)',
        'duetto-glow':'0 0 0 3px rgba(0,87,184,0.20)',
      },
      borderRadius: {
        'duetto': '10px',
      },
    },
  },
  plugins: [],
}
