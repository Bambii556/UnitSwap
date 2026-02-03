import { AppHeader } from "@/components/AppHeader";
import { RecentConversionItem } from "@/components/RecentConversionItem";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  Conversion,
  getConversions,
  getDb,
  searchConversions,
} from "@/database/database";
import { formatTimeAgo } from "@/utils/time";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, TextInput, TouchableOpacity, View } from "react-native";

const ITEMS_PER_PAGE = 10;

export default function HistoryScreen() {
  const router = useRouter();
  const [history, setHistory] = useState<Conversion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0); // To store total count for pagination

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      let conversions: Conversion[];
      const offset = (currentPage - 1) * ITEMS_PER_PAGE;

      // For simplicity, total count is fetched by running a count query.
      // In a real app, this might be a separate API endpoint or a more efficient query.
      const db = await getDb();
      const countResult = await db.getFirstAsync<{ count: number }>(
        `SELECT COUNT(*) as count FROM conversions;`,
      );
      setTotalCount(countResult?.count || 0);

      if (searchTerm) {
        conversions = await searchConversions(
          searchTerm,
          ITEMS_PER_PAGE,
          offset,
        );
      } else {
        conversions = await getConversions(ITEMS_PER_PAGE, offset);
      }
      setHistory(conversions);
    } catch (error: any) {
      console.error("Failed to fetch history", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, currentPage]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

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
            onSubmitEditing={fetchHistory} // Trigger search on submit
          />
        </View>

        {loading ? (
          <ThemedText>Loading history...</ThemedText>
        ) : history.length === 0 ? (
          <ThemedText>No conversion history found.</ThemedText>
        ) : (
          <>
            <FlatList
              data={history}
              keyExtractor={(item) => item.id!.toString()}
              renderItem={({ item }) => (
                <RecentConversionItem
                  fromValue={item.inputValue.toString()}
                  fromUnit={item.originalUnit}
                  toValue={item.outputValue.toString()}
                  toUnit={item.convertedUnit}
                  timeAgo={formatTimeAgo(item.timestamp)}
                  onPress={() => {
                    console.log("Tapped on history item:", item);
                    // TODO: Optionally navigate back to conversion screen with pre-filled values
                  }}
                />
              )}
              ItemSeparatorComponent={() => <View className="h-2" />}
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
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
          </>
        )}
      </View>
    </ThemedView>
  );
}
