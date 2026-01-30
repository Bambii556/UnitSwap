import React from "react";
import { View } from "react-native";
import { ThemedText } from "../../components/themed-text";

export default function SettingsScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ThemedText className="text-text text-2xl">Settings Screen</ThemedText>
    </View>
  );
}
