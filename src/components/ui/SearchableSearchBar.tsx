import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/providers/ThemeProvider";
import { ALL_SEARCHABLE_UNITS } from "@/utils/search-units";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { SearchBar } from "./SearchBar";

export function SearchableSearchBar({
  onFocusChange,
}: {
  onFocusChange?: (isFocused: boolean) => void;
}) {
  const { colors } = useAppTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    onFocusChange?.(isFocused);
  }, [isFocused, onFocusChange]);

  // Debounce search query to prevent filtering on every keystroke
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 150); // 150ms debounce

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery]);

  // Filter units based on debounced search query
  const filteredUnits = useMemo(() => {
    if (!debouncedQuery.trim()) return [];

    const lowerQuery = debouncedQuery.toLowerCase();
    return ALL_SEARCHABLE_UNITS.filter(
      (unit) =>
        unit.fullName.toLowerCase().includes(lowerQuery) ||
        unit.symbol.toLowerCase().includes(lowerQuery) ||
        unit.categoryName.toLowerCase().includes(lowerQuery),
    );
  }, [debouncedQuery]);

  const handleSelectUnit = (categoryName: string, unitSymbol?: string) => {
    setSearchQuery("");
    setIsFocused(false);
    console.log(`Selected unit: ${categoryName} - ${unitSymbol}`);
    router.push({
      pathname: "/conversion/[type]",
      params: { type: categoryName, unit: unitSymbol },
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
        <View
          className="mt-2 bg-card rounded-xl border border-border shadow-lg z-50"
          pointerEvents="auto"
          style={{ elevation: 5 }}
        >
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
                onPress={() => handleSelectUnit(item.categoryName, item.symbol)}
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
              debouncedQuery.length > 0 ? (
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
