import { AdBanner } from "@/components/AdBanner";
import { AppHeader } from "@/components/AppHeader";
import ConversionCard from "@/components/ConversionContainer";
import { HistoryList } from "@/components/HistoryList";
import { ThemedView } from "@/components/themed-view";
import { CategoryKey, conversionModules } from "@/conversions";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { View } from "react-native";

export default function ConversionScreen() {
  const { type, unit } = useLocalSearchParams();
  const router = useRouter();

  const categoryKey =
    typeof type === "string" ? (type.toLowerCase() as CategoryKey) : "length";

  const currentCategory = useMemo(() => {
    return conversionModules[categoryKey] || conversionModules["length"];
  }, [categoryKey]);

  return (
    <ThemedView className="px-4 pt-8 flex-1">
      <AppHeader
        title={currentCategory.name}
        onBackPress={() => {
          router.back();
        }}
      />
      <ConversionCard
        categoryKey={categoryKey}
        initialUnit={typeof unit === "string" ? unit : undefined}
      />

      <View className="flex-1 safe-area-inset-bottom">
        <HistoryList
          listType="category"
          categoryKey={categoryKey}
          currentCategory={currentCategory}
          onConversionPress={(item) => {
            console.log("Tapped on category conversion:", item);
          }}
        />
      </View>

      <View className="mt-2">
        <AdBanner placement="conversionBanner" />
      </View>
    </ThemedView>
  );
}
