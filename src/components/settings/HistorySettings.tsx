import { clearAllConversions } from "@/database/database";
import { cn } from "@/utils/cn";
import React from "react";
import { Alert, Pressable, View } from "react-native";
import { ThemedText } from "../themed-text";

export const HistorySettings: React.FC = () => {
  const handleClearHistory = () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear all conversion history? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            await clearAllConversions();
            // TODO: Trigger a refresh of the HistoryList component if it\'s visible
            console.log("Conversion history cleared.");
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <View>
      <ThemedText type="subtitle" className="mb-2 mt-4">
        History Management
      </ThemedText>
      <Pressable
        onPress={handleClearHistory}
        className={cn(
          "py-3 px-4 bg-card rounded-md border border-border flex-row justify-between items-center",
        )}
      >
        <ThemedText className="text-text">Clear All History</ThemedText>
        <ThemedText className="text-red-500">Delete</ThemedText>
      </Pressable>
    </View>
  );
};
