import Constants from "expo-constants";

// EAS environment variables are only available in EAS builds, not Expo Go
// In Expo Go, this will be undefined, so we default to false for safety
const EAS_ENABLE_ADS = process.env.ENABLE_ADS;

// Check if we're in an EAS build (EAS env vars are set)
const isEASBuild = !!process.env.EAS_BUILD;

// Enable ads if:
// 1. We're in an EAS build AND ENABLE_ADS is set to "true", OR
// 2. We're in development mode (__DEV__) and you want to test (set to true manually)
export const ENABLE_REAL_ADS = isEASBuild
  ? EAS_ENABLE_ADS === "true"
  : false; // Default to false for Expo Go

console.log("[AppConfig] ENABLE_REAL_ADS:", ENABLE_REAL_ADS);
console.log("[AppConfig] Is EAS Build:", isEASBuild);
console.log("[AppConfig] EAS_ENABLE_ADS env var:", EAS_ENABLE_ADS);

export const APP_CONFIG = {
  enableRealAds: ENABLE_REAL_ADS,
  isEASBuild,
} as const;
