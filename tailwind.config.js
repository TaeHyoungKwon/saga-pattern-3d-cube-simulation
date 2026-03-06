/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'saga-bg': '#0F172A',
        'saga-flow': '#3B82F6',
        'saga-compensation': '#EF4444',
        'saga-event': '#8B5CF6',
        'saga-failure': '#F59E0B',
        'saga-selected': '#10B981',
        'saga-default': '#6B7280',
        'saga-edge': '#D1D5DB',
        'saga-axis': '#9CA3AF',
      },
    },
  },
  plugins: [],
}
