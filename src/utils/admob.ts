import { Platform } from "react-native";

// Test Ad Unit IDs - Use these for development
// Replace with your actual Ad Unit IDs when publishing
export const AdUnits = {
  // Banner ads
  homeBanner: Platform.select({
    ios: "ca-app-pub-3940256099942544/2934735716", // Test ID
    android: "ca-app-pub-8857346417878191/1143156583",
  }),
  conversionBanner: Platform.select({
    ios: "ca-app-pub-3940256099942544/2934735716",
    android: "ca-app-pub-8857346417878191/1143156583",
  }),
  historyBanner: Platform.select({
    ios: "ca-app-pub-3940256099942544/2934735716",
    android: "ca-app-pub-8857346417878191/1143156583",
  }),
  settingsBanner: Platform.select({
    ios: "ca-app-pub-3940256099942544/2934735716",
    android: "ca-app-pub-8857346417878191/1143156583",
  }),
};

// Ad placement locations
export type AdPlacement =
  | "homeBanner"
  | "conversionBanner"
  | "historyBanner"
  | "settingsBanner";
