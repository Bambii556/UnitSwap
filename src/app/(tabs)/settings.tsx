import { AppHeader } from "@/components/AppHeader";
import { AboutSettings } from "@/components/settings/AboutSettings";
import { ConversionPreferencesSettings } from "@/components/settings/ConversionPreferencesSettings";
import { HistorySettings } from "@/components/settings/HistorySettings";
// import { PremiumSettings } from "@/components/settings/PremiumSettings";
import { ThemeSettings } from "@/components/settings/ThemeSettings";
import { ThemedView } from "@/components/themed-view";
import React from "react";
import { ScrollView } from "react-native";

export default function SettingsScreen() {
  return (
    <ThemedView className="px-4 pt-4 flex-1">
      <AppHeader title="Settings" />
      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <ThemeSettings />
        <ConversionPreferencesSettings />
        <HistorySettings />
        {/* <PremiumSettings /> */}
        <AboutSettings />

        {/* Banner Ad */}
        {/* <View className="mt-4">
          <AdBanner placement="settingsBanner" />
        </View> */}
      </ScrollView>
    </ThemedView>
  );
}
