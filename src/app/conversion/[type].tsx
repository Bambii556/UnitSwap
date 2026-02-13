import { AdBanner } from "@/components/AdBanner";
import { AppHeader } from "@/components/AppHeader";
import ConversionCard from "@/components/ConversionContainer";
import { HistoryList } from "@/components/HistoryList";
import { ThemedView } from "@/components/themed-view";
import { CategoryKey, conversionModules } from "@/conversions";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { View } from "react-native";

export default function ConversionScreen() {
  const { type, unit } = useLocalSearchParams();
  const router = useRouter();
  const [historyRefreshTrigger, setHistoryRefreshTrigger] = useState(0);

  const categoryKey =
    typeof type === "string" ? (type.toLowerCase() as CategoryKey) : "length";

  const currentCategory = useMemo(() => {
    return conversionModules[categoryKey] || conversionModules["length"];
  }, [categoryKey]);

  return (
    <ThemedView className="px-4 pt-[50px]">
      <AppHeader
        title={currentCategory.name}
        onBackPress={() => {
          router.back();
        }}
      />
      <ConversionCard
        categoryKey={categoryKey}
        initialUnit={typeof unit === "string" ? unit : undefined}
        onHistoryUpdate={() => setHistoryRefreshTrigger((prev) => prev + 1)}
      />

      <View className="flex-1 safe-area-inset-bottom">
        <HistoryList
          listType="category"
          categoryKey={categoryKey}
          currentCategory={currentCategory}
          refreshTrigger={historyRefreshTrigger}
          onConversionPress={(item) => {
            console.log("Tapped on category conversion:", item);
          }}
        />
      </View>

      {/* Banner Ad */}
      <View className="mt-2">
        <AdBanner placement="conversionBanner" />
      </View>
    </ThemedView>
  );
}
