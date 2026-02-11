import { CategoryCard } from "@/components/CategoryCard";
import { RecentConversions } from "@/components/RecentConversions";
import { ThemedView } from "@/components/themed-view";
import { SearchBar } from "@/components/ui/SearchBar"; // Import SearchBar
import { Conversion } from "@/database/database";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { ThemedText } from "../../components/themed-text";
import { ALL_CATEGORIES } from "../../constants/categories";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false); // New state for toggling categories visibility
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
    <ThemedView className="pt-[50px]">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Introduction */}
        <View className="justify-center items-center gap-2 mb-4">
          <ThemedText type="title" className="">
            What are we converting today?
          </ThemedText>
          <ThemedText type="muted">
            Type any unit to start converting
          </ThemedText>
        </View>

        {/* Search Bar */}
        <View className="mx-4 mt-4">
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSearch={() => {
              /* Filtering is handled by state change, no explicit action needed here */
            }}
            placeholder="Search units (e.g., meters to feet)"
          />
        </View>

        <View className="mt-6 px-4 flex-row justify-between items-center">
          <ThemedText className="text-text text-xl font-bold">
            Categories
          </ThemedText>
          {filteredCategories.length > 4 && (
            <Pressable onPress={() => setShowAllCategories(!showAllCategories)}>
              <ThemedText className="text-blue-500 text-lg">
                {showAllCategories ? "Show Less" : "See All"}
              </ThemedText>
            </Pressable>
          )}
        </View>

        {/* Categories Grid */}
        <View className="mt-4 px-4 flex-row flex-wrap justify-between gap-4">
          {(showAllCategories
            ? filteredCategories
            : filteredCategories.slice(0, 4)
          ).map((category) => (
            <CategoryCard
              key={category.name}
              title={category.name}
              units={category.units}
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
