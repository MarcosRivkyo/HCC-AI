/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'), // ✅ Añadido correctamente aquí
    function ({ addBase, theme }) {
      const colors = theme('colors');
      const newVars = Object.fromEntries(
        Object.entries(colors).map(([key, value]) => {
          return [`--${key}`, value];
        })
      );

      addBase({
        ":root": newVars,
      });
    },
  ],
};
