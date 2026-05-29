/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
      colors: {
       sunnyYellow:  '#FFD54F', 
        warmOrange:   '#FF8A65',
        deepChocolate:'#4E342E',
        skyBlue:      '#4FC3F7', 
        mintGreen:    '#A5D6A7', 
        softCream:    '#FFF8E1', 
      },
    },
  },
  plugins: [],
}
