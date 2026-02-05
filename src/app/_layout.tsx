import { initDb } from "@/database/database"; // Import initDb
import { MaterialIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

const initializeDatabase = async () => {
  try {
    await initDb();
    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    // Optionally, you might want to show an alert to the user or handle this more gracefully
  }
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...MaterialIcons.font,
  });

  // Expo Router uses Error Boundary to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <RootLayoutContent />
      <React.Suspense fallback={null}>
        <DatabaseInitializer />
      </React.Suspense>
    </SafeAreaProvider>
  );
}

function RootLayoutContent() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
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

function DatabaseInitializer() {
  useEffect(() => {
    initializeDatabase();
  }, []);
  return null; // This component doesn't render anything
}
