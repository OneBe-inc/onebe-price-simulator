/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0D1737',
        ink: '#14213D',
        canvas: '#F6F8FB',
        accent: '#1667F8',
      },
      boxShadow: {
        panel: '0 1px 3px rgba(13, 23, 55, 0.08)',
      },
    },
  },
  plugins: [],
}
