import { IconSymbol, IconSymbolName } from "@/components/ui/icon-symbol";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface CategoryCardProps {
  title: string;
  units: string;
  icon: IconSymbolName;
  color: string;
  onPress?: () => void;
}

export function CategoryCard({
  title,
  units,
  icon,
  color,
  onPress,
}: CategoryCardProps) {
  return (
    <TouchableOpacity
      className="w-[120px] h-[120px] rounded-xl overflow-hidden p-3 items-center justify-center gap-y-1 bg-card shadow-md"
      onPress={onPress}
    >
      <View
        className="w-10 h-10 items-center justify-center rounded-lg"
        style={{ backgroundColor: color + "20" }}
      >
        <IconSymbol name={icon} size={24} color={color} />
      </View>
      <View>
        <Text className="text-text text-base font-bold mt-2">{title}</Text>
      </View>
      <View>
        <Text className="text-muted text-xs opacity-60 mt-1">{units}</Text>
      </View>
    </TouchableOpacity>
  );
}
