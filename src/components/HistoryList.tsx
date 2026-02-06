import { HistoryItem } from "@/components/HistoryItem";
import { CategoryKey, CategoryType } from "@/conversions";
import {
  Conversion,
  getConversions,
  getDb,
  searchConversions,
} from "@/database/database"; // Added searchConversions
import { formatTimeAgo } from "@/utils/time";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native"; // Removed TouchableOpacity
import { ThemedText } from "./themed-text";

interface HistoryListProps {
  listType: "category" | "all";
  categoryKey?: CategoryKey;
  currentCategory?: CategoryType;
  searchTerm?: string;
  refreshTrigger?: number;
  onConversionPress?: (item: Conversion) => void;
  infiniteScroll?: boolean; // New prop for infinite scroll
}

const ITEMS_PER_PAGE = 10;

export const HistoryList: React.FC<HistoryListProps> = ({
  listType,
  categoryKey,
  currentCategory,
  searchTerm,
  refreshTrigger,
  onConversionPress,
  infiniteScroll = false, // Default to false
}) => {
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false); // New state for pull-to-refresh
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchConversions = useCallback(
    async (page: number, append: boolean = false) => {
      console.log(
        `fetchConversions called: page=${page}, append=${append}, loading=${loading}, loadingMore=${loadingMore}`,
      );

      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      if (refreshing) {
        setRefreshing(true);
      }

      try {
        let fetchedConversions: Conversion[];
        const offset = (page - 1) * ITEMS_PER_PAGE;
        console.log(
          `Fetching with offset=${offset}, ITEMS_PER_PAGE=${ITEMS_PER_PAGE}`,
        );
        const db = await getDb();
        let countResult: { count: number } | null = null;

        if (listType === "all") {
          if (searchTerm) {
            countResult = await db.getFirstAsync<{ count: number }>(
              `SELECT COUNT(*) as count FROM conversions WHERE originalUnit LIKE ? OR convertedUnit LIKE ?;`,
              `%${searchTerm}%`,
              `%${searchTerm}%`,
            );
            fetchedConversions = await searchConversions(
              searchTerm,
              ITEMS_PER_PAGE,
              offset,
              undefined, // categoryKey
            );
          } else {
            countResult = await db.getFirstAsync<{ count: number }>(
              `SELECT COUNT(*) as count FROM conversions;`,
            );
            fetchedConversions = await getConversions(ITEMS_PER_PAGE, offset);
          }
        } else {
          /* listType === "category" */
          if (!categoryKey) {
            console.warn("categoryKey is required for listType 'category'");
            setConversions([]);
            setTotalCount(0);
            setHasMore(false);
            return;
          }
          countResult = await db.getFirstAsync<{ count: number }>(
            `SELECT COUNT(*) as count FROM conversions WHERE conversionType = ?;`,
            categoryKey,
          );
          fetchedConversions = await getConversions(
            ITEMS_PER_PAGE,
            offset,
            categoryKey,
          );
        }

        console.log(`Fetched ${fetchedConversions.length} conversions`);
        const newTotalCount = countResult?.count || 0;
        setTotalCount(newTotalCount);
        const more = fetchedConversions.length === ITEMS_PER_PAGE;
        setHasMore(more);
        console.log(`hasMore set to ${more}, totalCount=${newTotalCount}`);

        if (append) {
          setConversions((prev) => {
            const existingIds = new Set(prev.map((item) => item.id));
            const uniqueNewConversions = fetchedConversions.filter(
              (item) => !existingIds.has(item.id),
            );
            const newConversions = [...prev, ...uniqueNewConversions];
            console.log(
              `Appending: prev=${prev.length}, newUnique=${uniqueNewConversions.length}, total=${newConversions.length}`,
            );
            return newConversions;
          });
        } else {
          console.log(
            `Setting conversions to ${fetchedConversions.length} items`,
          );
          setConversions(fetchedConversions);
        }
      } catch (error: any) {
        console.error("Failed to fetch conversions in list", error);
        setConversions(append ? conversions : []);
        setTotalCount(append ? totalCount : 0);
        setHasMore(false);
      } finally {
        console.log("Setting loading and loadingMore to false");
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [
      listType,
      categoryKey,
      searchTerm,
      ITEMS_PER_PAGE,
      infiniteScroll,
      refreshing, // Add refreshing to dependencies
    ],
  );

  useEffect(() => {
    console.log(
      "useEffect triggered for searchTerm/categoryKey/refreshTrigger",
    );
    setHasMore(true); // Reset hasMore when searchTerm or categoryKey changes
    setCurrentPage(1); // Always start from page 1 for new searches/categories
    // Reset conversions to empty to avoid stale data
    fetchConversions(1); // Fetch first page
  }, [searchTerm, categoryKey, refreshTrigger]);

  const handleRefresh = useCallback(() => {
    console.log("handleRefresh triggered");
    setRefreshing(true);
    // Do not clear conversions immediately; let new data replace old once fetched
    setCurrentPage(1); // Reset to first page
    setHasMore(true); // Assume there's more data to fetch on refresh
    fetchConversions(1); // Fetch first page again
  }, [fetchConversions]);

  const handleLoadMore = () => {
    if (infiniteScroll && hasMore && !loadingMore && !loading) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  // Fetch more data when currentPage changes due to infinite scroll
  useEffect(() => {
    if (currentPage > 1 && infiniteScroll) {
      fetchConversions(currentPage, true);
    }
  }, [currentPage, infiniteScroll]);

  const emptyText = currentCategory
    ? `No recent conversions for this ${currentCategory.name} category yet.`
    : "No recent conversions yet.";

  const renderFooter = () => {
    if (!infiniteScroll || (!loadingMore && !loading)) return null;
    return (
      <View className="mb-[16px]">
        <ActivityIndicator size="small" color="#007bff" />
      </View>
    );
  };

  return (
    <FlatList
      className="bg-background pt-4"
      onRefresh={handleRefresh}
      refreshing={refreshing}
      data={conversions}
      keyExtractor={(item) => item.id!.toString()}
      renderItem={({ item }) => (
        <HistoryItem
          fromValue={item.inputValue.toString()}
          fromUnit={item.originalUnit}
          toValue={item.outputValue.toString()}
          toUnit={item.convertedUnit}
          timeAgo={formatTimeAgo(item.timestamp)}
          onPress={() => onConversionPress && onConversionPress(item)}
          conversionType={item.conversionType}
        />
      )}
      ItemSeparatorComponent={() => <View className="h-2" />}
      onEndReached={infiniteScroll ? handleLoadMore : null} // Only enable onEndReached for infinite scroll
      onEndReachedThreshold={0.5}
      ListFooterComponentStyle={{ marginBottom: 16 }} // Add some spacing at the bottom for the loading indicator
      ListFooterComponent={renderFooter}
      scrollEnabled={true} // Enable scrolling for FlatList
      ListEmptyComponent={<ThemedText>{emptyText}</ThemedText>}
    />
  );
};
