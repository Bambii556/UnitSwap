import { useColorScheme } from "@/hooks/use-color-scheme";
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
  useState,
} from "react";

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  colorScheme: "light" | "dark"; // The actual resolved color scheme
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [resolvedColorScheme, setResolvedColorScheme] = useState<
    "light" | "dark"
  >(systemColorScheme || "light");

  useEffect(() => {
    const loadAppSettings = async () => {
      const savedSettings = await getSettings();
      setSettings(savedSettings);
    };
    loadAppSettings();
  }, []);

  useEffect(() => {
    // Determine the active color scheme based on user settings and system preference
    if (settings.theme === "system") {
      setResolvedColorScheme(systemColorScheme || "light");
    } else {
      setResolvedColorScheme(settings.theme);
    }
  }, [settings.theme, systemColorScheme]);

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    await saveSettings(updated);
  };

  const contextValue = {
    settings,
    updateSettings,
    colorScheme: resolvedColorScheme,
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
