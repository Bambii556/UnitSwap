import { AppHeader } from "@/components/AppHeader";
import { RecentConversionItem } from "@/components/RecentConversionItem";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Conversion, getConversions } from "@/database/database"; // Import Conversion and getConversions
import { formatTimeAgo } from "@/utils/time"; // Import formatTimeAgo
import { router } from "expo-router"; // Import router
import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";

export default function SavedScreen() {
  const [history, setHistory] = useState<Conversion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const conversions = await getConversions();
      setHistory(conversions);
    } catch (error: any) {
      console.error("Failed to fetch conversion history", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <ThemedView className="flex-1">
      <AppHeader title="Saved Conversions" onBackPress={() => router.back()} />
      <View className="flex-1 p-4">
        {loading ? (
          <ThemedText>Loading history...</ThemedText>
        ) : history.length === 0 ? (
          <ThemedText>No saved conversions yet.</ThemedText>
        ) : (
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
                  console.log("Tapped on conversion history item:", item);
                  // TODO: Implement navigation to conversion screen with pre-filled values
                }}
              />
            )}
            ItemSeparatorComponent={() => <View className="h-2" />}
          />
        )}
      </View>
    </ThemedView>
  );
}
