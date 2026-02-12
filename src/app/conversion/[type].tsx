import { AppHeader } from "@/components/AppHeader";
import ConversionCard from "@/components/ConversionContainer"; // Import the new smart ConversionCard
import { HistoryList } from "@/components/HistoryList";
import { ThemedView } from "@/components/themed-view";
import { CategoryKey, conversionModules } from "@/conversions";
import { initDb } from "@/database/database";
import { useLocalSearchParams, useRouter } from "expo-router"; // Removed useRouter as it's not directly used here now
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { ThemedText } from "../../components/themed-text";

export default function ConversionScreen() {
  const { type, unit } = useLocalSearchParams();
  const router = useRouter();
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await initDb();
        setDbInitialized(true);
      } catch (error) {
        console.error("Failed to initialize database", error);
      }
    };
    initializeDatabase();
  }, []);

  const categoryKey =
    typeof type === "string" ? (type.toLowerCase() as CategoryKey) : "length";

  const currentCategory = useMemo(() => {
    return conversionModules[categoryKey] || conversionModules["length"];
  }, [categoryKey]);

  return (
    <ThemedView className="px-4 pt-8 flex-1">
      <AppHeader
        title={currentCategory.name}
        onBackPress={() => {
          router.back(); // is now handled by ConversionCard if needed
        }}
      />
      {/* Render the new smart ConversionCard component */}
      <ConversionCard categoryKey={categoryKey} initialUnit={typeof unit === 'string' ? unit : undefined} />

      {dbInitialized ? (
        <View className="flex-1 safe-area-inset-bottom">
          {/* HistoryList remains here, receiving refreshTrigger from ConversionCard if needed */}
          <HistoryList
            listType="category"
            categoryKey={categoryKey}
            currentCategory={currentCategory}
            // refreshTrigger={refreshTrigger} // refreshTrigger will now come from ConversionCard itself if needed
            onConversionPress={(item) => {
              console.log("Tapped on category conversion:", item);
              // TODO: Optionally navigate back to this screen with pre-filled values
            }}
          />
        </View>
      ) : (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#007bff" />
          <ThemedText className="mt-4">Loading conversions...</ThemedText>
        </View>
      )}
    </ThemedView>
  );
}
