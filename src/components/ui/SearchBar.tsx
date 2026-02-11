import { useAppTheme } from "@/providers/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  BlurEvent,
  FocusEvent,
  Pressable,
  TextInput,
  View,
} from "react-native";

interface SearchBarProps {
  onVoiceSearch?: () => void;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: (e: FocusEvent) => void;
  onBlur?: (e: BlurEvent) => void;
}

export function SearchBar({
  placeholder = "Convert anything...",
  value,
  onChangeText,
  onFocus,
  onBlur,
}: SearchBarProps) {
  const { colors } = useAppTheme();

  return (
    <View className="flex-row items-center rounded-2xl bg-card px-4 py-3 border border-border">
      <Pressable onPress={() => {}} className="pr-2">
        <Ionicons name="search" size={20} color={colors.muted || colors.icon} />
      </Pressable>
      <TextInput
        className="flex-1 text-base text-text"
        placeholder={placeholder}
        placeholderTextColor={colors.muted || colors.icon}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText("")} className="pl-2">
          <Ionicons name="close-circle" size={20} color={colors.muted} />
        </Pressable>
      )}
      {/* {onVoiceSearch && (
        <Pressable onPress={onVoiceSearch} className="pl-2">
          <Ionicons name="mic" size={20} color={colors.muted || colors.icon} />
        </Pressable>
      )} */}
    </View>
  );
}
