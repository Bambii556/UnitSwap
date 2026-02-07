import { useColorScheme } from "@/hooks/use-color-scheme";
import { useSettings } from "@/providers/SettingsProvider";
import { cn } from "@/utils/cn";
import { AppSettings } from "@/utils/settings"; // Corrected import for AppSettings
import React from "react";
import { Pressable, View } from "react-native";
import { ThemedText } from "../themed-text";

export const ThemeSettings: React.FC = () => {
  const systemColorScheme = useColorScheme();
  const { settings, updateSettings } = useSettings();

  const handleThemeChange = (newTheme: AppSettings["theme"]) => {
    updateSettings({ theme: newTheme });
  };

  const renderThemeOption = (themeOption: AppSettings["theme"]) => (
    <Pressable
      key={themeOption}
      onPress={() => handleThemeChange(themeOption)}
      className={cn(
        "flex-1 py-2 items-center border rounded-md mx-1",
        settings.theme === themeOption
          ? "bg-primary border-primary"
          : "border-border bg-card",
      )}
    >
      <ThemedText
        className={cn(
          settings.theme === themeOption ? "text-white" : "text-text",
        )}
      >
        {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
      </ThemedText>
    </Pressable>
  );

  return (
    <View>
      <ThemedText type="subtitle" className="mb-2 mt-4">
        App Theme
      </ThemedText>
      <View className="flex-row justify-around mb-4">
        {renderThemeOption("system")}
        {renderThemeOption("light")}
        {renderThemeOption("dark")}
      </View>
    </View>
  );
};
