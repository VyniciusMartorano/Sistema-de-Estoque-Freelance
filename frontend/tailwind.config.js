/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/primereact/**/*.{js,ts,jsx,tsx}',
    './node_modules/primeflex/primeflex.css',
  ],
  theme: {
    extend: {
      colors: {
        'simas-red-primary': '#DE2721',
        'simas-blue-primary': '#027abc',
        'simas-yellow-primary': '#ffd657',
        'simas-blue-primary-light': '#2196f3',
        'simas-blue-icons-primary': '#0289d1',
        'simas-blue-icons-secondary': '#6ba7c9',
        'simas-blue-background': '#182445',
        'simas-blue-background-light': '#60a5fa',
        'simas-gray-title': '#f3f3f5',
        'simas-gray-label': '#6c757d',
        'simas-gray-primary': '#4b5563',
        'simas-gray-light': '#ededed',
        'simas-green-primary': '#689f38',
        'simas-background-white': '#f1f1f1',
        'simas-background-yellow': '#ffd657',
        'simas-background-orange': '#ffa751',
        'simas-purple-primary': '#a855f7',
      },
    },
  },
  plugins: [],
}
