import { RecentConversionItem } from "@/components/RecentConversionItem";
import { CategoryKey, CategoryType } from "@/conversions"; // Added CategoryKey
import {
  Conversion,
  getConversions,
  getDb, // Added getDb
  searchConversions,
} from "@/database/database"; // Updated imports
import { formatTimeAgo } from "@/utils/time"; // Keep formatTimeAgo for RecentConversionItem
import React, { useCallback, useEffect, useState } from "react"; // Added useCallback, useEffect, useState
import { FlatList, View } from "react-native";
import { ThemedText } from "./themed-text";

interface RecentConversionListProps {
  listType: "category" | "all";
  categoryKey?: CategoryKey;
  currentCategory?: CategoryType; // Still useful for display names
  searchTerm?: string;
  currentPage?: number;
  itemsPerPage?: number;
  refreshTrigger?: number;
  onRefreshComplete?: (totalCount: number) => void;
  onConversionPress?: (item: Conversion) => void;
}

export const RecentConversionList: React.FC<RecentConversionListProps> = ({
  listType,
  categoryKey,
  currentCategory,
  searchTerm,
  currentPage = 1,
  itemsPerPage = 10,
  refreshTrigger,
  onRefreshComplete,
  onConversionPress,
}) => {
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchConversions = useCallback(async () => {
    setLoading(true);
    try {
      let fetchedConversions: Conversion[];
      const offset = (currentPage - 1) * itemsPerPage;
      const db = await getDb();
      let countResult: { count: number } | null = null;

      if (listType === "all") {
        countResult = await db.getFirstAsync<{ count: number }>(
          `SELECT COUNT(*) as count FROM conversions;`,
        );
        if (searchTerm) {
          fetchedConversions = await searchConversions(
            searchTerm,
            itemsPerPage,
            offset,
          );
        } else {
          fetchedConversions = await getConversions(itemsPerPage, offset);
        }
      } else {
        /* listType === "category" */
        if (!categoryKey) {
          console.warn("categoryKey is required for listType 'category'");
          setConversions([]);
          setTotalCount(0);
          return;
        }
        countResult = await db.getFirstAsync<{ count: number }>(
          `SELECT COUNT(*) as count FROM conversions WHERE conversionType = ?;`,
          categoryKey,
        );
        fetchedConversions = await getConversions(
          itemsPerPage,
          offset,
          categoryKey,
        );
      }

      setConversions(fetchedConversions);
      const newTotalCount = countResult?.count || 0;
      setTotalCount(newTotalCount);
      onRefreshComplete && onRefreshComplete(newTotalCount);
    } catch (error: any) {
      console.error("Failed to fetch conversions in list", error);
      setConversions([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [
    listType,
    categoryKey,
    searchTerm,
    currentPage,
    itemsPerPage,
    refreshTrigger,
    onRefreshComplete,
  ]);

  useEffect(() => {
    fetchConversions();
  }, [fetchConversions]);

  const titleText = currentCategory
    ? `Recent ${currentCategory.name} Conversions`
    : "Recent Conversions";
  const emptyText = currentCategory
    ? `No recent conversions for this ${currentCategory.name} category yet.`
    : "No recent conversions yet.";

  return (
    <View className="mt-4 min-h-[100px]">
      {loading ? (
        <ThemedText>Loading {titleText.toLowerCase()}...</ThemedText>
      ) : conversions.length === 0 ? (
        <ThemedText>{emptyText}</ThemedText>
      ) : (
        <FlatList
          data={conversions}
          keyExtractor={(item) => item.id!.toString()}
          renderItem={({ item }) => (
            <RecentConversionItem
              fromValue={item.inputValue.toString()}
              fromUnit={item.originalUnit}
              toValue={item.outputValue.toString()}
              toUnit={item.convertedUnit}
              timeAgo={formatTimeAgo(item.timestamp)}
              onPress={() => onConversionPress && onConversionPress(item)}
            />
          )}
          ItemSeparatorComponent={() => <View className="h-2" />}
          scrollEnabled={false}
        />
      )}
    </View>
  );
};
