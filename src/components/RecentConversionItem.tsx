import { IconSymbol } from "@/components/ui/icon-symbol";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "../components/themed-text";

interface RecentConversionItemProps {
  fromValue: string;
  fromUnit: string;
  toValue: string;
  toUnit: string;
  timeAgo: string;
  onPress: () => void;
}

export function RecentConversionItem({
  fromValue,
  fromUnit,
  toValue,
  toUnit,
  timeAgo,
  onPress,
}: RecentConversionItemProps) {
  return (
    <TouchableOpacity
      className="flex-row items-center justify-between p-4 mb-3 rounded-xl bg-card"
      onPress={onPress}
    >
      <View className="flex-row items-center">
        <IconSymbol name="arrow.counterclockwise" size={20} color="text-icon" />
        <View className="ml-3">
          <ThemedText className="text-text text-base font-medium">
            {fromValue} {fromUnit} to {toUnit}
          </ThemedText>
          <ThemedText className="text-muted text-xs mt-1">{timeAgo}</ThemedText>
        </View>
      </View>
      <ThemedText className="text-active text-base font-semibold">
        {toValue} {toUnit}
      </ThemedText>
    </TouchableOpacity>
  );
}
