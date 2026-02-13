import Constants from "expo-constants";

// Read from app.json extra field - this works in both Expo Go and EAS builds
const extraConfig = Constants.expoConfig?.extra || {};

// Check if we're in an EAS build
const isEASBuild = !!process.env.EAS_BUILD;

// Enable ads based on app.json extra config
// This can be overridden per build profile in eas.json
export const ENABLE_REAL_ADS = extraConfig.enableRealAds === true;

console.log("[AppConfig] ENABLE_REAL_ADS:", ENABLE_REAL_ADS);
console.log("[AppConfig] Is EAS Build:", isEASBuild);
console.log("[AppConfig] Extra config:", extraConfig);

export const APP_CONFIG = {
  enableRealAds: ENABLE_REAL_ADS,
  isEASBuild,
} as const;
