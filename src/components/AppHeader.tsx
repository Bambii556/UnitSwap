import { IconSymbol } from "@/components/ui/icon-symbol";
import React from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../components/themed-text";

interface AppHeaderProps {
  title: string;
  onHistoryPress?: () => void;
  onSettingsPress?: () => void;
  onBackPress?: () => void;
}

export function AppHeader({
  title,
  onHistoryPress,
  onSettingsPress,
  onBackPress,
}: AppHeaderProps) {
  return (
    <View
      className="flex-row items-center justify-between px-4 py-3 bg-background-dark"
      style={{
        paddingTop: Platform.OS === "ios" ? 50 : 10,
      }}
    >
      <View>
        {onBackPress && (
          <TouchableOpacity onPress={onBackPress}>
            <IconSymbol name="xmark.circle.fill" color="white" size={28} />
          </TouchableOpacity>
        )}
      </View>
      <View>
        <ThemedText className="text-white text-xl font-bold">
          {title}
        </ThemedText>
      </View>
      <View>
        <TouchableOpacity onPress={onHistoryPress}>
          <IconSymbol name="arrow.counterclockwise" color="white" size={28} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
