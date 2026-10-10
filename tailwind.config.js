/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        arabic: ['"Noto Kufi Arabic"', '"Noto Naskh Arabic"', 'Tahoma', 'sans-serif'],
        naskh: ['"Noto Naskh Arabic"', 'serif'],
        cairo: ['Cairo', '"Noto Kufi Arabic"', 'Tahoma', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
};
