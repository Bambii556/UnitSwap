const { Theme } = require("./src/constants/theme");

function hexToRgbString(hex) {
  // Remove # if present
  hex = hex.replace("#", "");

  // Handle 3-digit hex
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  // Handle 8-digit hex (with alpha)
  if (hex.length === 8) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const a = parseInt(hex.slice(6, 8), 16) / 255;
    return `${r} ${g} ${b} / ${a.toFixed(2)}`;
  }

  // Handle 6-digit hex
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  return `${r} ${g} ${b}`;
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ...Object.keys(Theme.dark).reduce((acc, key) => {
          acc[key] = `rgb(var(--color-${key}))`;
          return acc;
        }, {}),
      },
      fontFamily: {
        display: ["Inter"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
    },
  },
  plugins: [
    ({ addBase }) => {
      addBase({
        ":root": Object.entries(Theme.light).reduce((acc, [key, value]) => {
          acc[`--color-${key}`] = hexToRgbString(value);
          return acc;
        }, {}),
        ".dark": Object.entries(Theme.dark).reduce((acc, [key, value]) => {
          acc[`--color-${key}`] = hexToRgbString(value);
          return acc;
        }, {}),
      });
    },
  ],
};
