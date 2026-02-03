import { AppHeader } from "@/components/AppHeader";
import { CategoryCard } from "@/components/CategoryCard";
import { RecentConversionItem } from "@/components/RecentConversionItem";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Conversion, getConversions } from "@/database/database"; // New import
import { formatTimeAgo } from "@/utils/time"; // New import
import { Link, useRouter } from "expo-router"; // Import useRouter
import React, { useEffect, useState } from "react"; // Add useEffect
import { FlatList, ScrollView, TextInput, View } from "react-native"; // Add FlatList
import { ThemedText } from "../../components/themed-text";
import { ALL_CATEGORIES } from "../../constants/categories";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentConversions, setRecentConversions] = useState<Conversion[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const fetchRecentConversions = async () => {
      try {
        // Fetch the latest 10 conversions
        const conversions = await getConversions(10);
        setRecentConversions(conversions);
      } catch (error: any) {
        console.error("Failed to fetch recent conversions", error);
      } finally {
        setLoadingRecent(false);
      }
    };
    fetchRecentConversions();
  }, []);

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

      {/* Recent Conversions List */}
      <View className="mt-4 px-4">
        {loadingRecent ? (
          <ThemedText>Loading recent conversions...</ThemedText>
        ) : recentConversions.length === 0 ? (
          <ThemedText>No recent conversions yet.</ThemedText>
        ) : (
          <FlatList
            data={recentConversions}
            keyExtractor={(item) => item.id!.toString()}
            renderItem={({ item }) => (
              <RecentConversionItem
                fromValue={item.inputValue.toString()}
                fromUnit={item.originalUnit}
                toValue={item.outputValue.toString()}
                toUnit={item.convertedUnit}
                timeAgo={formatTimeAgo(item.timestamp)}
                onPress={() => {
                  console.log("Tapped on recent conversion:", item);
                  // TODO: Implement navigation to conversion screen with pre-filled values
                }}
              />
            )}
            ItemSeparatorComponent={() => <View className="h-2" />}
            scrollEnabled={false} // Prevent FlatList from interfering with parent ScrollView
          />
        )}
      </View>
    </ScrollView>
  );
}
