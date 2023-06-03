module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['./public/**/*.html', './src/**/*.ts'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      screens: {
        'sm': '640px', // Example: Change the 'sm' breakpoint value
      },
    },
  },
  variants: {
    extend: {
      // Add any custom variant extensions here
    },
  },
  plugins: [],
};
