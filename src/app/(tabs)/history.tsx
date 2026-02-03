import { AppHeader } from "@/components/AppHeader";
import { RecentConversionList } from "@/components/RecentConversionList"; // Updated import
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native"; // Removed FlatList from here

const ITEMS_PER_PAGE = 10;

export default function HistoryScreen() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0); // To store total count for pagination

  const handleRefreshComplete = useCallback((count: number) => {
    setTotalCount(count);
  }, []);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <ThemedView className="flex-1">
      <AppHeader title="Conversion History" onBackPress={() => router.back()} />
      <View className="flex-1 p-4">
        {/* Search Bar */}
        <View className="flex-row items-center rounded-lg p-3 bg-muted/30 mb-4">
          <IconSymbol name="magnifyingglass" color="text-icon" size={20} />
          <TextInput
            className="ml-2 flex-1 text-text"
            placeholder="Search history..."
            placeholderTextColor="#8a8a8e"
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={() => setCurrentPage(1)} // Trigger search on submit, reset to page 1
          />
        </View>

        <RecentConversionList
          listType="all"
          searchTerm={searchTerm}
          currentPage={currentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          onRefreshComplete={handleRefreshComplete}
          onConversionPress={(item) => {
            console.log("Tapped on history item:", item);
            // TODO: Optionally navigate back to conversion screen with pre-filled values
          }}
        />

        {/* Pagination Controls */}
        {totalCount > 0 && totalPages > 1 && (
          <View className="flex-row justify-between items-center mt-4">
            <TouchableOpacity
              onPress={handlePrevPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg ${currentPage === 1 ? "bg-muted/30" : "bg-primary"}`}
            >
              <ThemedText className="text-white">Previous</ThemedText>
            </TouchableOpacity>
            <ThemedText className="text-text">
              Page {currentPage} of {totalPages}
            </ThemedText>
            <TouchableOpacity
              onPress={handleNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg ${currentPage === totalPages ? "bg-muted/30" : "bg-primary"}`}
            >
              <ThemedText className="text-white">Next</ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ThemedView>
  );
}
