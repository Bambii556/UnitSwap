import { AdBanner } from "@/components/AdBanner";
import { AppHeader } from "@/components/AppHeader";
import { HistoryList } from "@/components/HistoryList";
import { ThemedView } from "@/components/themed-view";
import { SearchBar } from "@/components/ui/SearchBar";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

export default function HistoryScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <ThemedView className="flex-1">
      <AppHeader title="Conversion History" />

      {/* Search Bar */}
      <View className="mx-4 mt-4">
        <SearchBar
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search history..."
        />
      </View>

      <View className="border-t-2 border-border mt-4 flex-1">
        <HistoryList
          listType="all"
          searchTerm={debouncedSearchTerm}
          infiniteScroll={true}
          onConversionPress={(item) => {
            console.log("Tapped on history item:", item);
          }}
        />
      </View>

      {/* Banner Ad */}
      <View className="px-4 py-2">
        <AdBanner placement="historyBanner" />
      </View>
    </ThemedView>
  );
}
