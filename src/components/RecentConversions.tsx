import { HistoryItem } from "@/components/HistoryItem";
import { Conversion, getConversions } from "@/database/database";
import { useSettings } from "@/providers/SettingsProvider";
import { formatTimeAgo } from "@/utils/time";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useRef, useState } from "react";
import { ActivityIndicator, InteractionManager, View } from "react-native";
import { ThemedText } from "./themed-text";

interface RecentConversionsProps {
  onConversionPress?: (item: Conversion) => void;
}

export const RecentConversions: React.FC<RecentConversionsProps> = ({
  onConversionPress,
}) => {
  const { settings } = useSettings();
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(false);

  useFocusEffect(
    useCallback(() => {
      isMounted.current = true;

      // Defer data loading until after navigation transition completes
      const interactionPromise = InteractionManager.runAfterInteractions(() => {
        if (!isMounted.current) return;

        const fetchLatestConversions = async () => {
          try {
            setLoading(true);
            // Fetch top 5 latest conversions, no offset
            const fetchedConversions = await getConversions(5, 0);
            if (isMounted.current) {
              setConversions(fetchedConversions);
            }
          } catch (error) {
            console.error("Failed to fetch latest conversions:", error);
            if (isMounted.current) {
              setConversions([]);
            }
          } finally {
            if (isMounted.current) {
              setLoading(false);
            }
          }
        };

        fetchLatestConversions();
      });

      return () => {
        isMounted.current = false;
        interactionPromise.cancel();
      };
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
          {index < conversions.length - 1 && <View className="h-2" />}
        </React.Fragment>
      ))}
    </View>
  );
};
