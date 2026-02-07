import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AppSettings {
  theme: "light" | "dark" | "system";
  decimalPlaces: number;
  thousandSeparator: "," | "." | " " | "none";
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: "system",
  decimalPlaces: 2,
  thousandSeparator: ",",
};

const SETTINGS_KEY = "app_settings";

export const getSettings = async (): Promise<AppSettings> => {
  try {
    const jsonValue = await AsyncStorage.getItem(SETTINGS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : DEFAULT_SETTINGS;
  } catch (e) {
    console.error("Failed to load settings", e);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = async (settings: AppSettings) => {
  try {
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem(SETTINGS_KEY, jsonValue);
  } catch (e) {
    console.error("Failed to save settings", e);
  }
};
