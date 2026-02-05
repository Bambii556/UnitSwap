import { HistoryItem } from "@/components/HistoryItem";
import { Conversion, getConversions } from "@/database/database";
import { formatTimeAgo } from "@/utils/time";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { ThemedText } from "./themed-text";

interface RecentConversionsProps {
  onConversionPress?: (item: Conversion) => void;
}

export const RecentConversions: React.FC<RecentConversionsProps> = ({
  onConversionPress,
}) => {
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchLatestConversions = async () => {
        try {
          console.log("Fetching latest conversions...");
          setLoading(true);
          // Fetch top 5 latest conversions, no offset
          const fetchedConversions = await getConversions(5, 0);
          setConversions(fetchedConversions);
        } catch (error) {
          console.error("Failed to fetch latest conversions:", error);
          setConversions([]);
        } finally {
          setLoading(false);
        }
      };

      fetchLatestConversions();
    }, []),
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center py-4">
        <ActivityIndicator size="small" color="#007bff" />
      </View>
    );
  }

  if (conversions.length === 0) {
    return (
      <View className="py-4">
        <ThemedText className="text-center">
          No recent conversions yet.
        </ThemedText>
      </View>
    );
  }

  return (
    <View className="mt-4">
      <ThemedText className="text-text text-xl font-bold mb-4">
        Recent Conversions
      </ThemedText>
      {conversions.map((item, index) => (
        <React.Fragment key={item.id}>
          <HistoryItem
            fromValue={item.inputValue.toString()}
            fromUnit={item.originalUnit}
            toValue={item.outputValue.toString()}
            toUnit={item.convertedUnit}
            timeAgo={formatTimeAgo(item.timestamp)}
            onPress={() => onConversionPress && onConversionPress(item)}
            conversionType={item.conversionType}
          />
          {index < conversions.length - 1 && <View className="h-2" />}
        </React.Fragment>
      ))}
    </View>
  );
};
