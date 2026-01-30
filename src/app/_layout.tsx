import { ThemeProvider } from "@/providers/ThemeProvider";
import { Stack } from "expo-router";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="conversion/[type]"
            options={{ headerShown: false }}
          />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
