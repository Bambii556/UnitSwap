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
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, InteractionManager, View } from "react-native";
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
  const isMounted = useRef(false);

  const fetchConversions = useCallback(
    async (page: number, append: boolean = false, isRefreshing: boolean = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      if (isRefreshing) {
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
              undefined,
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
        const more = fetchedConversions.length === ITEMS_PER_PAGE;

        // Batch state updates
        setTotalCount(newTotalCount);
        setHasMore(more);

        if (append) {
          setConversions((prev) => {
            const existingIds = new Set(prev.map((item) => item.id));
            const uniqueNewConversions = fetchedConversions.filter(
              (item) => !existingIds.has(item.id),
            );
            return [...prev, ...uniqueNewConversions];
          });
        } else {
          setConversions(fetchedConversions);
        }
      } catch (error: any) {
        console.error("Failed to fetch conversions in list", error);
        if (!append) {
          setConversions([]);
          setTotalCount(0);
          setHasMore(false);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [listType, categoryKey, searchTerm],
  );

  useEffect(() => {
    isMounted.current = true;
    
    // Defer data loading until after navigation transition completes
    const interactionPromise = InteractionManager.runAfterInteractions(() => {
      if (isMounted.current) {
        setHasMore(true);
        setCurrentPage(1);
        fetchConversions(1);
      }
    });

    return () => {
      isMounted.current = false;
      interactionPromise.cancel();
    };
  }, [searchTerm, categoryKey, refreshTrigger, fetchConversions]);

  const handleRefresh = useCallback(() => {
    setCurrentPage(1);
    setHasMore(true);
    fetchConversions(1, false, true);
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
  }, [currentPage, infiniteScroll, fetchConversions]);

  const emptyText = currentCategory
    ? `No recent conversions for this ${currentCategory.name} category yet.`
    : "No recent conversions yet.";

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 88,
      offset: 88 * index,
      index,
    }),
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: Conversion }) => (
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
    ),
    [onConversionPress, settings.useScientificNotation, settings.thousandSeparator],
  );

  const renderFooter = useCallback(() => {
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
  }, [infiniteScroll, loadingMore, hasMore, conversions.length]);

  // Show loading indicator during initial load
  if (loading && conversions.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <ActivityIndicator size="large" color="rgb(var(--color-primary))" />
        <ThemedText className="text-muted mt-4">Loading history...</ThemedText>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <FlatList
        className="bg-background pt-4"
        onRefresh={handleRefresh}
        refreshing={refreshing}
        data={conversions}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
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
