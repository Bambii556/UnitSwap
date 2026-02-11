import { Theme } from "@/constants/theme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import React, { createContext, useContext, useMemo } from "react";
import { useColorScheme as useSystemColorScheme, View } from "react-native";
import { useSettings } from "./SettingsProvider";

// Navigation themes for React Navigation
const NavigationLightTheme = {
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

const NavigationDarkTheme = {
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
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const systemColorScheme = useSystemColorScheme();

  // Determine active theme based on settings
  const colorScheme = useMemo<"light" | "dark">(() => {
    if (settings.theme === "system") {
      return systemColorScheme === "dark" ? "dark" : "light";
    }
    return settings.theme;
  }, [settings.theme, systemColorScheme]);

  const colors = useMemo(() => Theme[colorScheme], [colorScheme]);
  const isDark = colorScheme === "dark";
  const navigationTheme = isDark ? NavigationDarkTheme : NavigationLightTheme;

  return (
    <ThemeContext.Provider value={{ colorScheme, colors, isDark }}>
      <NavigationThemeProvider value={navigationTheme}>
        <View className={`flex-1 bg-background ${colorScheme}`}>
          {children}
        </View>
      </NavigationThemeProvider>
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
