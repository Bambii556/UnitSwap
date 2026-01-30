import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTheme } from "@/providers/ThemeProvider";
import React from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";

interface AppHeaderProps {
  title: string;
  onMenuPress?: () => void;
  onHistoryPress?: () => void;
}

export function AppHeader({
  title,
  onMenuPress,
  onHistoryPress,
}: AppHeaderProps) {
  const { colors } = useTheme();

  return (
    <View
      className="flex-row items-center justify-between px-4 py-3"
      style={{
        backgroundColor: colors.background,
        paddingTop: Platform.OS === "ios" ? 50 : 10,
      }}
    >
      <TouchableOpacity onPress={onMenuPress}>
        <IconSymbol name="line.horizontal.3" color={colors.icon} size={28} />
      </TouchableOpacity>
      <Text className="text-text text-xl font-bold">{title}</Text>
      <TouchableOpacity onPress={onHistoryPress}>
        <IconSymbol
          name="arrow.counterclockwise"
          color={colors.icon}
          size={28}
        />
      </TouchableOpacity>
    </View>
  );
}
