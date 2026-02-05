import { AppHeader } from "@/components/AppHeader";
import { HistoryList } from "@/components/HistoryList"; // Updated import
import { SearchBar } from "@/components/SearchBar"; // Import SearchBar
import { ThemedView } from "@/components/themed-view";
import { initDb } from "@/database/database"; // Import initDb
import React, { useEffect, useState } from "react"; // Removed useCallback and unnecessary imports, added useEffect
import { View } from "react-native";

export default function HistoryScreen() {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    initDb().catch((error) =>
      console.error("Failed to initialize database", error),
    );
  }, []);

  return (
    <ThemedView className="flex-1">
      <AppHeader title="Conversion History" />

      {/* Search Bar */}
      <SearchBar
        value={searchTerm}
        onChangeText={setSearchTerm}
        onSearch={() => {}}
        placeholder="Search history..."
      />

      <View className="border-t-2 border-border mt-4">
        <HistoryList
          listType="all"
          searchTerm={searchTerm}
          infiniteScroll={true} // Enable infinite scroll for history page
          onConversionPress={(item) => {
            console.log("Tapped on history item:", item);
            // TODO: Optionally navigate back to conversion screen with pre-filled values
          }}
        />
      </View>
    </ThemedView>
  );
}
