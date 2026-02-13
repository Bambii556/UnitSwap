import Constants from "expo-constants";

export const ENABLE_REAL_ADS =
  Constants.expoConfig?.extra?.enableRealAds === true;

export const APP_CONFIG = {
  enableRealAds: ENABLE_REAL_ADS,
} as const;
