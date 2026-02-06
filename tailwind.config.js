import { Colors } from "./src/constants/theme";
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
        primary: Colors.dark.primary,
        background: Colors.dark.background,
        border: Colors.dark.border,
        text: Colors.dark.text,
        card: Colors.dark.card,
        icon: Colors.dark.icon,
        muted: Colors.dark.muted,
        active: Colors.dark.tint,
        cardSecond: Colors.dark.cardSecond,
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
  plugins: [],
};
