import { AppHeader } from "@/components/AppHeader";
import { CategoryCard } from "@/components/CategoryCard";
import { RecentConversionItem } from "@/components/RecentConversionItem";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Link } from "expo-router";
import React, { useState } from "react";
import { ScrollView, TextInput, View } from "react-native";
import { ThemedText } from "../../components/themed-text";
import { ALL_CATEGORIES } from "../../constants/categories";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");

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
      <AppHeader title="Converter" onHistoryPress={() => {}} />

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
          <Link
            key={category.name}
            href={{
              pathname: "/conversion/[type]",
              params: { type: category.name },
            }}
            asChild
            className="w-[48%] md:w-[31%] mb-4"
          >
            <CategoryCard
              title={category.name}
              units={category.units}
              icon={category.icon as any}
              color={category.color}
            />
          </Link>
        ))}
      </View>

      <View className="mt-6 px-4">
        <ThemedText className="text-text text-xl font-bold">
          Recent Conversions
        </ThemedText>
      </View>

      {/* Recent Conversions List - Placeholder for now */}
      <View className="mt-4 px-4">
        <RecentConversionItem
          fromValue="65"
          fromUnit="kg"
          toValue="143.3"
          toUnit="lbs"
          timeAgo="2 hours ago"
          onPress={() => {}}
        />
        <RecentConversionItem
          fromValue="100"
          fromUnit="USD"
          toValue="92.45"
          toUnit="EUR"
          timeAgo="Yesterday"
          onPress={() => {}}
        />
      </View>
    </ScrollView>
  );
}
