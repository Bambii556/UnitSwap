import { AppHeader } from "@/components/AppHeader";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTheme } from "@/providers/ThemeProvider";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ConversionScreen() {
  const { type } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />
      <AppHeader
        title={typeof type === "string" ? type : "Conversion"}
        onMenuPress={() => router.back()}
        onHistoryPress={() => {}}
      />

      <View className="flex-1 p-4">
        <Text className="text-text text-lg font-bold mb-4">Convert {type}</Text>

        {/* Input Field */}
        <View
          className="flex-row items-center rounded-lg p-3 mb-4"
          style={{ backgroundColor: colors.cardBackground }}
        >
          <TextInput
            className="flex-1 text-text text-base"
            placeholder="Enter value"
            placeholderTextColor={colors.tabIconDefault}
            keyboardType="numeric"
          />
          <TouchableOpacity className="ml-2 p-2 rounded-md bg-tint">
            <Text className="text-white font-semibold">Unit</Text>
          </TouchableOpacity>
        </View>

        {/* Swap Button */}
        <TouchableOpacity className="items-center my-2">
          <IconSymbol
            name="arrow.up.arrow.down"
            size={24}
            color={colors.tint}
          />
        </TouchableOpacity>

        {/* Output Field */}
        <View
          className="flex-row items-center rounded-lg p-3 mb-4"
          style={{ backgroundColor: colors.cardBackground }}
        >
          <TextInput
            className="flex-1 text-text text-base"
            placeholder="Result"
            placeholderTextColor={colors.tabIconDefault}
            editable={false}
          />
          <TouchableOpacity className="ml-2 p-2 rounded-md bg-tint">
            <Text className="text-white font-semibold">Unit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
