import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, TextInput, View } from "react-native";

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
  return (
    <View className="flex-row items-center rounded-2xl bg-gray-800 px-4 py-3 dark:bg-gray-800">
      <Pressable onPress={() => onSearch(value)} className="pr-2">
        <Ionicons name="search" size={20} color="#9CA3AF" />
      </Pressable>
      <TextInput
        className="flex-1 text-base text-gray-200 dark:text-gray-200"
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        onSubmitEditing={() => onSearch(value)}
      />
      {onVoiceSearch && (
        <Pressable onPress={onVoiceSearch} className="pl-2">
          <Ionicons name="mic" size={20} color="#9CA3AF" />
        </Pressable>
      )}
    </View>
  );
}
