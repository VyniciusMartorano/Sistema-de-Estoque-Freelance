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
        'sgc-red-primary': '#DE2721',
        'sgc-blue-primary': '#027abc',
        'sgc-yellow-primary': '#ffd657',
        'sgc-blue-primary-light': '#2196f3',
        'sgc-blue-icons-primary': '#0289d1',
        'sgc-blue-icons-secondary': '#6ba7c9',
        'sgc-blue-background': '#182445',
        'sgc-blue-background-light': '#60a5fa',
        'sgc-gray-title': '#f3f3f5',
        'sgc-gray-label': '#6c757d',
        'sgc-gray-primary': '#4b5563',
        'sgc-gray-light': '#ededed',
        'sgc-green-primary': '#689f38',
        'sgc-background-white': '#f1f1f1',
        'sgc-background-yellow': '#ffd657',
        'sgc-background-orange': '#ffa751',
        'sgc-purple-primary': '#a855f7',
      },
    },
  },
  plugins: [],
}
