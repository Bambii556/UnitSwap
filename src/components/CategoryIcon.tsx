import { IconSymbol, IconSymbolName } from "@/components/ui/icon-symbol";
import { ALL_CATEGORIES } from "@/constants/categories";
import React from "react";
import { View } from "react-native";

interface CategoryIconProps {
  categoryName: string;
  size?: number; // Size of the icon
  containerSize?: number; // Size of the circular container
  backgroundColor?: string; // Background color of the container
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  categoryName,
  size = 24,
  containerSize = 48,
  backgroundColor = "bg-blue-600/20", // Default from image analysis
}) => {
  const category = ALL_CATEGORIES.find(
    (cat) => cat.name.toLocaleLowerCase() === categoryName.toLocaleLowerCase(),
  );
  // console.log(`CategoryIcon - ${categoryName}:`, category);
  const iconName: IconSymbolName = category
    ? (category.icon as IconSymbolName)
    : "questionmark.circle.fill"; // Default icon if not found
  const iconColor = category ? category.color : "#8a8a8e"; // Default color

  const containerStyle = backgroundColor.startsWith("bg-")
    ? { width: containerSize, height: containerSize }
    : { width: containerSize, height: containerSize, backgroundColor };
  const containerClassName = backgroundColor.startsWith("bg-")
    ? `rounded-full justify-center items-center ${backgroundColor}`
    : "rounded-full justify-center items-center";

  return (
    <View className={containerClassName} style={containerStyle}>
      <IconSymbol name={iconName} size={size} color={iconColor} />
    </View>
  );
};
