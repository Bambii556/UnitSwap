import { AppHeader } from "@/components/AppHeader";
import { ThemedView } from "@/components/themed-view";
import React from "react";
import { ScrollView } from "react-native";
import { ThemedText } from "../../components/themed-text";

export default function SettingsScreen() {
  return (
    <>
      <AppHeader title="Settings" />
      <ThemedView className="px-4 pt-4 flex-1">
        <ScrollView
          className="flex-1 bg-background"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <ThemedText type="title" className="mb-4">
            Settings Screen
          </ThemedText>
          {/* Add settings options here */}
        </ScrollView>
      </ThemedView>
    </>
  );
}
