import { Theme } from "@/constants/theme";
import {
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import React, { createContext, useContext, useMemo } from "react";
import { useColorScheme as useSystemColorScheme, View } from "react-native";
import { SettingsContext } from "./SettingsProvider";

// Navigation themes for React Navigation
export const NavigationLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Theme.light.primary,
    background: Theme.light.background,
    card: Theme.light.card,
    text: Theme.light.text,
    border: Theme.light.border || Theme.light.text + "33",
  },
};

export const NavigationDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Theme.dark.primary,
    background: Theme.dark.background,
    card: Theme.dark.card,
    text: Theme.dark.text,
    border: Theme.dark.border || Theme.dark.text + "33",
  },
};

interface ThemeContextType {
  colorScheme: "light" | "dark";
  colors: typeof Theme.light;
  isDark: boolean;
  navigationTheme: typeof NavigationLightTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const settingsContext = useContext(SettingsContext);
  const systemColorScheme = useSystemColorScheme();

  // Default to dark if settings context is not available yet
  const colorScheme = useMemo<"light" | "dark">(() => {
    if (!settingsContext) {
      console.log("[ThemeProvider] Settings context not available, defaulting to dark");
      return "dark";
    }
    const themeSetting = settingsContext.settings?.theme ?? "dark";
    if (themeSetting === "system") {
      return systemColorScheme === "dark" ? "dark" : "light";
    }
    return themeSetting;
  }, [settingsContext?.settings?.theme, systemColorScheme]);

  const colors = useMemo(() => Theme[colorScheme], [colorScheme]);
  const isDark = colorScheme === "dark";
  const navigationTheme = useMemo(
    () => (isDark ? NavigationDarkTheme : NavigationLightTheme),
    [isDark]
  );

  return (
    <ThemeContext.Provider value={{ colorScheme, colors, isDark, navigationTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useAppTheme must be used within a ThemeProvider");
  }
  return context;
};
