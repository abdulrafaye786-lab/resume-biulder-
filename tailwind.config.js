/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          dark: '#0f172a', // midnight charcoal
          gold: '#d4af37', // gold accent
          bronze: '#cd7f32', // bronze accent
          card: 'rgba(30, 41, 59, 0.7)', // semi-transparent card for glassmorphism
        },
        modern: {
          light: '#ffffff',
          primary: '#3b82f6', // vibrant primary
          text: '#1f2937', // high contrast text
        }
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(to right bottom, #0f172a, #1e293b)',
        'modern-gradient': 'linear-gradient(to right bottom, #f8fafc, #e2e8f0)',
      }
    },
  },
  plugins: [],
}
