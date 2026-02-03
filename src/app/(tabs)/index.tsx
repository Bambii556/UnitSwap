import { AppHeader } from "@/components/AppHeader";
import { CategoryCard } from "@/components/CategoryCard";
import { RecentConversionList } from "@/components/RecentConversionList"; // Corrected import
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Conversion } from "@/database/database"; // Added for onConversionPress typing
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, TextInput, View } from "react-native";
import { ThemedText } from "../../components/themed-text";
import { ALL_CATEGORIES } from "../../constants/categories";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filteredCategories = ALL_CATEGORIES.filter((category) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      category.name.toLowerCase().includes(lowerCaseQuery) ||
      category.units.toLowerCase().includes(lowerCaseQuery) ||
      category.fullNames.some((fullName) =>
        fullName.toLowerCase().includes(lowerCaseQuery),
      )
    );
  });

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <AppHeader
        title="Converter"
        onHistoryPress={() => router.push("/(tabs)/history")}
      />

      {/* Search Bar */}
      <View className="mx-4 mt-4 flex-row items-center rounded-lg p-3 bg-muted/30">
        <IconSymbol name="magnifyingglass" color="text-icon" size={20} />
        <TextInput
          className="ml-2 flex-1 text-text"
          placeholder="Search units (e.g., meters to feet)"
          placeholderTextColor="#8a8a8e"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View className="mt-6 px-4">
        <ThemedText className="text-text text-xl font-bold">
          Categories
        </ThemedText>
      </View>

      {/* Categories Grid - Placeholder for now */}
      <View className="mt-4 px-4 flex-row flex-wrap justify-between gap-y-4">
        {filteredCategories.map((category) => (
          <CategoryCard
            key={category.name}
            title={category.name}
            units={category.units}
            icon={category.icon as any}
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

      <View className="mt-6 px-4">
        <ThemedText className="text-text text-xl font-bold">
          Recent Conversions
        </ThemedText>
      </View>

      {/* Recent Conversions List */}
      <RecentConversionList
        listType="all"
        itemsPerPage={10}
        onConversionPress={(item: Conversion) => {
          console.log("Tapped on recent conversion:", item);
          // TODO: Implement navigation to conversion screen with pre-filled values
        }}
      />
    </ScrollView>
  );
}
