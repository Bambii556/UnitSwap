import { Stack, useRouter } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

export default function RootLayout() {
  const router = useRouter();

  return (
    <SafeAreaProvider>
      <RootLayoutContent />
    </SafeAreaProvider>
  );
}

function RootLayoutContent() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background-dark dark">
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="conversion/[type]"
          options={{
            presentation:
              Platform.OS === "android" ? "containedModal" : "modal",
            headerShown: false,
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}
