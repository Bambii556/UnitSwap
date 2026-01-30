import { Colors } from "@/constants/theme";
import { createContext, useContext } from "react";
import { useColorScheme } from "react-native";

type ThemeContextType = {
  colorScheme: "light" | "dark";
  colors: typeof Colors.light;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const colorScheme = systemColorScheme ?? "light"; // Default to light

  const colors = Colors[colorScheme];

  return (
    <ThemeContext.Provider value={{ colorScheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
