import {
  AppSettings,
  DEFAULT_SETTINGS,
  getSettings,
  saveSettings,
} from "@/utils/settings";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  colorScheme: "light" | "dark";
  isLoading: boolean;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useSystemColorScheme();
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAppSettings = async () => {
      try {
        const savedSettings = await getSettings();
        setSettings(savedSettings);
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAppSettings();
  }, []);

  // Calculate the resolved color scheme based on settings
  const colorScheme: "light" | "dark" = useMemo(() => {
    const activeTheme =
      settings.theme === "system" ? systemColorScheme : settings.theme;
    return activeTheme === "dark" ? "dark" : "light";
  }, [settings.theme, systemColorScheme]);

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    await saveSettings(updated);
  };

  const contextValue = {
    settings,
    updateSettings,
    colorScheme,
    isLoading,
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
