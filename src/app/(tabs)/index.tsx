import { AdBanner } from "@/components/AdBanner";
import { CategoryCard } from "@/components/CategoryCard";
import { RecentConversions } from "@/components/RecentConversions";
import { ThemedView } from "@/components/themed-view";
import { SearchableSearchBar } from "@/components/ui/SearchableSearchBar";
import { Conversion } from "@/database/database";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { ThemedText } from "../../components/themed-text";
import { ALL_CATEGORIES } from "../../constants/categories";

export default function HomeScreen() {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const router = useRouter();

  const filteredCategories = useMemo(() => {
    return showAllCategories
      ? ALL_CATEGORIES
      : ALL_CATEGORIES.slice(0, 4);
  }, [showAllCategories]);

  // Pre-compute category data to avoid mapping on every render
  const categoryData = useMemo(() => {
    return filteredCategories.map((category) => ({
      ...category,
      unitsString: category.units.map((u) => u.unit).join(", "),
    }));
  }, [filteredCategories]);

  return (
    <ThemedView className="pt-[70px]">
      {/* Introduction */}
      <View className="justify-center items-center gap-2 mb-4">
        <ThemedText type="title" className="">
          What are we converting today?
        </ThemedText>
        <ThemedText type="muted">Type any unit to start converting</ThemedText>
      </View>

      {/* Search Bar */}
      <View className="mx-4 mt-4 z-50" style={{ elevation: 5 }}>
        <SearchableSearchBar />
      </View>

      <ScrollView
        className="mt-4 z-0"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <View className="mt-6 px-4 flex-row justify-between items-center">
          <ThemedText className="text-text text-xl font-bold">
            Categories
          </ThemedText>
          {ALL_CATEGORIES.length > 4 && (
            <Pressable onPress={() => setShowAllCategories(!showAllCategories)}>
              <ThemedText className="text-blue-500 text-lg">
                {showAllCategories ? "Show Less" : "See All"}
              </ThemedText>
            </Pressable>
          )}
        </View>

        {/* Categories Grid */}
        <View className="mt-4 px-4 flex-row flex-wrap justify-between gap-4">
          {categoryData.map((category) => (
            <CategoryCard
              key={category.name}
              title={category.name}
              units={category.unitsString}
              color={category.color}
              onPress={() =>
                router.push({
                  pathname: "/conversion/[type]",
                  params: { type: category.name },
                })
              }
            />
          ))}
        </View>

        {/* Banner Ad */}
        <View className="px-4 mt-4">
          <AdBanner placement="homeBanner" />
        </View>

        {/* Latest Conversions */}
        <View className="mt-4 px-4">
          <RecentConversions
            onConversionPress={(item: Conversion) => {
              console.log("Tapped on latest conversion:", item);
              // TODO: Implement navigation to conversion screen with pre-filled values
            }}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}
