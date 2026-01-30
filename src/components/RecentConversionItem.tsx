import { IconSymbol } from "@/components/ui/icon-symbol";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

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
          <Text className="text-text text-base font-medium">
            {fromValue} {fromUnit} to {toUnit}
          </Text>
          <Text className="text-muted text-xs mt-1">{timeAgo}</Text>
        </View>
      </View>
      <Text className="text-active text-base font-semibold">
        {toValue} {toUnit}
      </Text>
    </TouchableOpacity>
  );
}
