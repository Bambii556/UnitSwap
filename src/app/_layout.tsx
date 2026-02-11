import { initDb } from "@/database/database";
import { MaterialIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as NavigationBar from "expo-navigation-bar";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import { SettingsProvider } from "../providers/SettingsProvider";
import { ThemeProvider, useAppTheme } from "../providers/ThemeProvider";

const initializeDatabase = async () => {
  try {
    await initDb();
    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...MaterialIcons.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
      NavigationBar.setBehaviorAsync('inset-swipe');
    }
  }, []);

  useEffect(() => {
    initializeDatabase();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <ThemeProvider>
          <RootLayoutContent />
        </ThemeProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

function RootLayoutContent() {
  const { colorScheme } = useAppTheme();

  return (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
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
    </>
  );
}
