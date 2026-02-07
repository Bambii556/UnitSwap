import React from "react";
import { Alert, Linking, View } from "react-native";
import { ThemedText } from "../themed-text";

const APP_VERSION = "1.0.0"; // From app.json

export const AboutSettings: React.FC = () => {
  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };

  return (
    <View>
      <ThemedText type="subtitle" className="mb-2 mt-4">
        About
      </ThemedText>
      <View className="bg-card rounded-md border border-border p-4 mb-4">
        <View className="flex-row justify-between items-center mb-2">
          <ThemedText className="text-text">App Version</ThemedText>
          <ThemedText className="text-muted">{APP_VERSION}</ThemedText>
        </View>
        {/* <Pressable
          onPress={() => openLink("https://example.com/privacy")}
          className={cn("py-2 flex-row justify-between items-center")}
        >
          <ThemedText className="text-text">Privacy Policy</ThemedText>
          <ThemedText className="text-muted">&#x203A;</ThemedText>
        </Pressable>
        <Pressable
          onPress={() => openLink("https://example.com/terms")}
          className={cn("py-2 flex-row justify-between items-center")}
        >
          <ThemedText className="text-text">Terms of Service</ThemedText>
          <ThemedText className="text-muted">&#x203A;</ThemedText>
        </Pressable>
        <Pressable
          onPress={() => openLink("https://example.com/licenses")}
          className={cn("py-2 flex-row justify-between items-center")}
        >
          <ThemedText className="text-text">Open Source Licenses</ThemedText>
          <ThemedText className="text-muted">&#x203A;</ThemedText>
        </Pressable> */}
      </View>
    </View>
  );
};
