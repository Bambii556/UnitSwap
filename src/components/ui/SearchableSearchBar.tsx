import { ThemedText } from "@/components/themed-text";
import { ALL_CATEGORIES } from "@/constants/categories";
import { useAppTheme } from "@/providers/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { SearchBar } from "./SearchBar";

interface SearchResult {
  unitKey: string;
  fullName: string;
  symbol: string;
  categoryName: string;
  categoryColor: string;
}

export function SearchableSearchBar({
  placeholder = "Convert anything...",
  onFocusChange,
}: {
  placeholder?: string;
  onFocusChange?: (isFocused: boolean) => void;
}) {
  const { colors } = useAppTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    onFocusChange?.(isFocused);
  }, [isFocused, onFocusChange]);

  // Build searchable units list from all categories
  const allUnits = useMemo(() => {
    const units: {
      unitKey: string;
      fullName: string;
      symbol: string;
      categoryName: string;
      categoryColor: string;
    }[] = [];
    ALL_CATEGORIES.forEach((category) => {
      const unitSymbols = category.units.split(", ");
      const fullNames = category.fullNames;

      unitSymbols.forEach((symbol, index) => {
        units.push({
          unitKey: `${category.name}-${symbol}`,
          fullName: fullNames[index] || symbol,
          symbol: symbol,
          categoryName: category.name,
          categoryColor: category.color,
        });
      });
    });
    return units;
  }, []);

  // Filter units based on search query
  const filteredUnits = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const lowerQuery = searchQuery.toLowerCase();
    return allUnits.filter(
      (unit) =>
        unit.fullName.toLowerCase().includes(lowerQuery) ||
        unit.symbol.toLowerCase().includes(lowerQuery) ||
        unit.categoryName.toLowerCase().includes(lowerQuery),
    );
  }, [searchQuery, allUnits]);

  const handleSelectUnit = (categoryName: string) => {
    setSearchQuery("");
    setIsFocused(false);
    router.push({
      pathname: "/conversion/[type]",
      params: { type: categoryName },
    });
  };

  const showDropdown = isFocused && filteredUnits.length > 0;

  return (
    <View className="relative z-50" pointerEvents="box-none">
      {/* Search Input */}
      <SearchBar
        placeholder="Search units (e.g., meters to feet)"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          // Delay to allow press events to fire first
          setTimeout(() => setIsFocused(false), 200);
        }}
      />

      {/* Dropdown Results */}
      {showDropdown && (
        <View className="mt-2 bg-card rounded-xl border border-border shadow-lg z-50" pointerEvents="auto" style={{ elevation: 5 }}>
          <FlatList
            data={filteredUnits}
            keyExtractor={(item) => item.unitKey}
            keyboardShouldPersistTaps="always"
            scrollEnabled={true}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
            className="max-h-[50vh]"
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => handleSelectUnit(item.categoryName)}
                activeOpacity={0.7}
                className={`flex-row items-center px-4 py-3 active:bg-muted/10 ${
                  index !== filteredUnits.length - 1
                    ? "border-b border-border"
                    : ""
                }`}
              >
                {/* Color indicator */}
                <View
                  className="w-3 h-3 rounded-full mr-3"
                  style={{ backgroundColor: item.categoryColor }}
                />

                {/* Unit info */}
                <View className="flex-1">
                  <ThemedText className="text-text font-medium">
                    {item.fullName}
                  </ThemedText>
                  <ThemedText className="text-muted text-xs">
                    {item.symbol} • {item.categoryName}
                  </ThemedText>
                </View>

                {/* Arrow */}
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.muted}
                />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              searchQuery.length > 0 ? (
                <View className="px-4 py-4 items-center">
                  <ThemedText className="text-muted">No units found</ThemedText>
                </View>
              ) : null
            }
          />
        </View>
      )}
    </View>
  );
}
