import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, TextInput, View } from "react-native";
import { useAppTheme } from "@/providers/ThemeProvider";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onVoiceSearch?: () => void;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
}

export function SearchBar({
  onSearch,
  onVoiceSearch,
  placeholder = "Convert anything...",
  value,
  onChangeText,
}: SearchBarProps) {
  const { colors } = useAppTheme();

  return (
    <View className="flex-row items-center rounded-2xl bg-card px-4 py-3">
      <Pressable onPress={() => onSearch(value)} className="pr-2">
        <Ionicons name="search" size={20} color={colors.muted || colors.icon} />
      </Pressable>
      <TextInput
        className="flex-1 text-base text-text"
        placeholder={placeholder}
        placeholderTextColor={colors.muted || colors.icon}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        onSubmitEditing={() => onSearch(value)}
      />
      {onVoiceSearch && (
        <Pressable onPress={onVoiceSearch} className="pl-2">
          <Ionicons name="mic" size={20} color={colors.muted || colors.icon} />
        </Pressable>
      )}
    </View>
  );
}
