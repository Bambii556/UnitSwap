import { IconSymbol, IconSymbolName } from "@/components/ui/icon-symbol";
import { useTheme } from "@/providers/ThemeProvider";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface CategoryCardProps {
  title: string;
  units: string;
  icon: IconSymbolName;
  color: string;
  onPress: () => void;
}

export function CategoryCard({
  title,
  units,
  icon,
  color,
  onPress,
}: CategoryCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      className="w-[45%] mb-4 rounded-xl overflow-hidden p-4 aspect-square items-start justify-between"
      onPress={onPress}
      style={{
        backgroundColor: colors.cardBackground,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <View
        className="w-12 h-12 items-center justify-center rounded-lg"
        style={{ backgroundColor: color + "20" }}
      >
        <IconSymbol name={icon} size={24} color={color} />
      </View>
      <View>
        <Text className="text-text text-lg font-bold mt-2">{title}</Text>
        <Text className="text-text text-sm opacity-60 mt-1">{units}</Text>
      </View>
    </TouchableOpacity>
  );
}
