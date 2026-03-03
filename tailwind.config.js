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
        // ── Duetto Brand 2024 Colour Tokens ─────────────────────────────────
        duetto: {
          // PRIMARY: Midnight Green (main dark bg / primary text)
          navy:       '#0E2124',
          'navy-900': '#0A181B',
          'navy-800': '#0F2225',
          'navy-700': '#173035',
          'navy-600': '#1E3F45',
          'navy-500': '#274F56',

          // INTERACTIVE / LINK: Pine Green (readable on light bg)
          blue:       '#004948',
          'blue-600': '#003C3B',
          'blue-500': '#005E5D',
          'blue-400': '#007E7D',
          'blue-300': '#009D9C',
          'blue-100': '#EAFFBE',  // Pale Lime — light accent bg
          'blue-50':  '#D7F7ED',  // Mint — lightest active bg

          // ACCENT: uses Pine Green for text, Lucent Green for highlights on dark
          teal:       '#004948',  // Pine Green — secondary readable teal
          'teal-600': '#003C3B',
          'teal-400': '#C4FF45',  // Lucent Green — brand mark accent on dark bg
          'teal-100': '#D7F7ED',  // Mint
          'teal-50':  '#EBFDF9',

          // WARNINGS: Bright Orange
          amber:      '#FF5900',
          'amber-100':'#FFD9A0',  // Light Tangerine
          'amber-50': '#FFF0DC',

          // SUCCESS: Moss green (text), Pale Lime (bg)
          green:      '#2B4000',  // Moss — readable success text
          'green-100':'#EAFFBE',  // Pale Lime — success bg
          'green-50': '#F4FFE6',

          // ERROR: Red (unchanged)
          red:        '#EF4444',
          'red-100':  '#FEE2E2',
          'red-50':   '#FFF5F5',

          // BRAND PRIMARIES — explicit tokens
          lucent:         '#C4FF45',  // Lucent Green — CTA bg, brand highlight
          'lucent-600':   '#AEED2B',  // Lucent Green hover
          midnight:       '#0E2124',  // Midnight Green alias
          moss:           '#2B4000',  // Moss
          pine:           '#004948',  // Pine Green
          aqua:           '#68FFF2',  // Neon Aqua
          orange:         '#FF5900',  // Bright Orange
          purple:         '#7459EE',  // Electric Purple
          lavender:       '#E0D1FF',  // Lavender
          sand:           '#BDB36E',  // Sand
          mint:           '#D7F7ED',  // Mint
          tangerine:      '#FFD9A0',  // Light Tangerine

          // NEUTRALS: Steel / Pebble / Mist
          white:      '#FFFFFF',
          'gray-50':  '#F5F6F7',
          'gray-100': '#EAECEE',
          'gray-200': '#DDE1E2',  // Mist
          'gray-300': '#C5CBCF',
          'gray-400': '#AEB4BA',  // Pebble
          'gray-500': '#63696F',  // Steel
          'gray-600': '#4A4F53',
          'gray-700': '#343839',
          'gray-800': '#1F2425',
          'gray-900': '#0E1516',
        },
      },
      boxShadow: {
        'duetto-sm':  '0 1px 3px 0 rgba(14,33,36,0.10), 0 1px 2px -1px rgba(14,33,36,0.08)',
        'duetto':     '0 4px 6px -1px rgba(14,33,36,0.12), 0 2px 4px -2px rgba(14,33,36,0.08)',
        'duetto-md':  '0 10px 15px -3px rgba(14,33,36,0.12), 0 4px 6px -4px rgba(14,33,36,0.08)',
        'duetto-lg':  '0 20px 25px -5px rgba(14,33,36,0.15), 0 8px 10px -6px rgba(14,33,36,0.10)',
        'duetto-glow':'0 0 0 3px rgba(196,255,69,0.35)',  // Lucent Green glow
      },
      borderRadius: {
        'duetto': '10px',
      },
    },
  },
  plugins: [],
}
