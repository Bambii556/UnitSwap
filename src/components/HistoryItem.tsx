import { CategoryIcon } from "@/components/CategoryIcon"; // Import CategoryIcon
import { ALL_CATEGORIES, Category } from "@/constants/categories";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "./themed-text";

interface HistoryItemProps {
  fromValue: string;
  fromUnit: string;
  toValue: string;
  toUnit: string;
  timeAgo: string;
  onPress: () => void;
  conversionType: string; // New prop for dynamic icon
}

export function HistoryItem({
  fromValue,
  fromUnit,
  toValue,
  toUnit,
  timeAgo,
  onPress,
  conversionType,
}: HistoryItemProps) {
  const category = ALL_CATEGORIES.find(
    (cat: Category) =>
      cat.name.toLocaleLowerCase() === conversionType.toLocaleLowerCase(),
  );

  const iconBackgroundColor = category ? category.color + "20" : undefined;

  return (
    <TouchableOpacity
      className="flex-row items-center p-4 mb-3 rounded-xl bg-card"
      onPress={onPress}
    >
      <View className="flex-row items-center flex-1">
        <View className="items-center">
          <CategoryIcon
            categoryName={conversionType}
            containerSize={40}
            size={24}
            backgroundColor={iconBackgroundColor}
          />
        </View>
        <View className="ml-4 flex-1">
          <ThemedText type="defaultSemiBold" className="text-text">
            {fromValue} {fromUnit} {"->"} {toUnit}
          </ThemedText>
          <ThemedText className="text-muted text-xs mt-1">{timeAgo}</ThemedText>
        </View>
      </View>
      <View className="justify-end items-end">
        <ThemedText type="subtitle" className="text-active font-semibold">
          {toValue} {toUnit}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}
