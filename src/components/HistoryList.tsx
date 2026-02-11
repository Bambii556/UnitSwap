import { HistoryItem } from "@/components/HistoryItem";
import { CategoryKey, CategoryType } from "@/conversions";
import {
  Conversion,
  getConversions,
  getDb,
  searchConversions,
} from "@/database/database";
import { useSettings } from "@/providers/SettingsProvider";
import { formatTimeAgo } from "@/utils/time";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
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
  infiniteScroll = false,
}) => {
  const { settings } = useSettings();
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchConversions = useCallback(
    async (page: number, append: boolean = false) => {
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

        const newTotalCount = countResult?.count || 0;
        setTotalCount(newTotalCount);
        const more = fetchedConversions.length === ITEMS_PER_PAGE;
        setHasMore(more);

        if (append) {
          setConversions((prev) => {
            const existingIds = new Set(prev.map((item) => item.id));
            const uniqueNewConversions = fetchedConversions.filter(
              (item) => !existingIds.has(item.id),
            );
            const newConversions = [...prev, ...uniqueNewConversions];
            return newConversions;
          });
        } else {
          setConversions(fetchedConversions);
        }
      } catch (error: any) {
        console.error("Failed to fetch conversions in list", error);
        setConversions(append ? conversions : []);
        setTotalCount(append ? totalCount : 0);
        setHasMore(false);
      } finally {
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
    setHasMore(true); // Reset hasMore when searchTerm or categoryKey changes
    setCurrentPage(1); // Always start from page 1 for new searches/categories
    // Reset conversions to empty to avoid stale data
    fetchConversions(1); // Fetch first page
  }, [searchTerm, categoryKey, refreshTrigger]);

  const handleRefresh = useCallback(() => {
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
    if (!infiniteScroll) return null;

    // Show loading indicator when loading more data
    if (loadingMore) {
      return (
        <View className="py-6 items-center justify-center">
          <ActivityIndicator size="small" color="rgb(var(--color-primary))" />
        </View>
      );
    }

    // Show "end of list" indicator when no more data
    if (!hasMore && conversions.length > 0) {
      return (
        <View className="py-4 items-center justify-center">
          <ThemedText className="text-muted text-xs">End of history</ThemedText>
        </View>
      );
    }

    // Return empty view for spacing when not loading
    return <View className="h-6" />;
  };

  return (
    <View className="flex-1">
      <FlatList
        className="bg-background pt-4"
        onRefresh={handleRefresh}
        refreshing={refreshing}
        data={conversions}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => (
          <HistoryItem
            fromValue={item.inputValue}
            fromUnit={item.originalUnit}
            toValue={item.outputValue}
            toUnit={item.convertedUnit}
            timeAgo={formatTimeAgo(item.timestamp)}
            onPress={() => onConversionPress && onConversionPress(item)}
            conversionType={item.conversionType}
            useScientificNotation={settings.useScientificNotation}
            thousandSeparator={settings.thousandSeparator}
          />
        )}
        ItemSeparatorComponent={() => <View className="h-2" />}
        onEndReached={infiniteScroll ? handleLoadMore : null}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 45 }}
        ListEmptyComponent={<ThemedText>{emptyText}</ThemedText>}
      />
    </View>
  );
};
