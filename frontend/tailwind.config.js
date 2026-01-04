module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        // Brand palette (derived from primary #00778a)
        brand: '#00778a',
        'brand-dark': '#003c45',
        'brand-medium': '#005f6b',
        'brand-light': '#4fa7b3',
        'brand-secondary': '#cfeff3'
      }
    }
  },
  plugins: []
}