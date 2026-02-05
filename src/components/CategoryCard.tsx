import React from "react";
import { TouchableOpacity } from "react-native";
import { ThemedText } from "../components/themed-text";
import { BlurBackground } from "./BlurBackground";
import { CategoryIcon } from "./CategoryIcon"; // Import CategoryIcon

interface CategoryCardProps {
  title: string;
  units: string;
  color: string;
  onPress?: () => void;
}

export function CategoryCard({
  title,
  units,
  color,
  onPress,
}: CategoryCardProps) {
  return (
    <TouchableOpacity
      className="w-[48%] aspect-square rounded-xl"
      onPress={onPress}
    >
      <BlurBackground className="flex-1 p-3 flex flex-col items-center justify-center gap-y-2">
        <CategoryIcon
          categoryName={title}
          containerSize={45}
          size={26}
          backgroundColor={color + "20"}
        />
        <ThemedText
          className="text-text text-base font-bold text-center mt-2"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {title}
        </ThemedText>
        <ThemedText
          className="text-gray-400 text-xs text-center mt-1"
          numberOfLines={1} // Changed from 2 to 1
          ellipsizeMode="tail"
        >
          {units}
        </ThemedText>
      </BlurBackground>
    </TouchableOpacity>
  );
}
