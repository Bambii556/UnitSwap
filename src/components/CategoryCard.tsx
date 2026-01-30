import { IconSymbol, IconSymbolName } from "@/components/ui/icon-symbol";
import { useTheme } from "@/providers/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
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
      className="w-[48%] mb-4 rounded-xl overflow-hidden"
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
      <LinearGradient
        colors={[color, colors.cardGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="p-4 aspect-square items-start justify-between"
      >
        <View
          className="p-3 rounded-full"
          style={{ backgroundColor: colors.background + "50" }}
        >
          <IconSymbol name={icon} size={28} color={colors.text} />
        </View>
        <View>
          <Text className="text-white text-lg font-bold mt-2">{title}</Text>
          <Text className="text-white text-sm opacity-80 mt-1">{units}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}
