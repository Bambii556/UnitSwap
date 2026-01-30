import { AppHeader } from "@/components/AppHeader";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { categories, CategoryKey } from "@/utils/conversions";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../../components/themed-text";

export default function ConversionScreen() {
  const { type } = useLocalSearchParams();
  const router = useRouter();

  const categoryKey =
    typeof type === "string" ? (type as CategoryKey) : "length";

  const currentCategory = useMemo(() => {
    // Ensure categories[categoryKey] is defined before using it
    return categories[categoryKey] || categories["length"];
  }, [categoryKey]);

  const [fromValue, setFromValue] = useState("0");
  const [toValue, setToValue] = useState("0");
  const [fromUnit, setFromUnit] = useState(
    currentCategory?.baseUnit ||
      Object.keys(currentCategory?.units || {})[0] ||
      "",
  );
  const [toUnit, setToUnit] = useState(
    Object.keys(currentCategory?.units || {})[1] ||
      Object.keys(currentCategory?.units || {})[0] ||
      "",
  );

  // Effect to reset units when category changes
  useEffect(() => {
    setFromUnit(
      currentCategory?.baseUnit ||
        Object.keys(currentCategory?.units || {})[0] ||
        "",
    );
    setToUnit(
      Object.keys(currentCategory?.units || {})[1] ||
        Object.keys(currentCategory?.units || {})[0] ||
        "",
    );
    setFromValue("0");
    setToValue("0");
  }, [categoryKey, currentCategory]); // Add currentCategory to dependencies

  // TODO: Implement actual conversion logic
  const convertValue = (value: string, from: string, to: string) => {
    // This is where your conversion logic from src/utils/conversions.ts would go
    // For now, it's a placeholder
    if (from === to) return value;
    // Example: Simple placeholder conversion (not actual logic)
    if (from === "Kilometers" && to === "Miles")
      return (parseFloat(value) * 0.621371).toFixed(3);
    if (from === "Miles" && to === "Kilometers")
      return (parseFloat(value) * 1.60934).toFixed(3);
    return "0";
  };

  useEffect(() => {
    const converted = convertValue(fromValue, fromUnit, toUnit);
    setToValue(converted);
  }, [fromValue, fromUnit, toUnit]);

  return (
    <View className="flex-1 bg-background text-text">
      <AppHeader
        title={currentCategory.name}
        onBackPress={() => {
          router.back();
        }}
        onHistoryPress={() => {
          router.push("/(tabs)/saved");
        }}
        onSettingsPress={() => {
          router.push("/(tabs)/settings");
        }}
      />
      <ScrollView className="flex-1 px-4 py-4">
        <View className="flex flex-col gap-2 relative">
          {/* FROM Input Field */}
          <View className="bg-card rounded-xl border-2 border-primary p-5 shadow-sm">
            <View className="flex justify-between items-center mb-1">
              <ThemedText className="text-xs font-bold text-primary uppercase tracking-wider">
                FROM
              </ThemedText>
              <View className="flex items-center text-muted">
                <ThemedText className="text-sm font-medium mr-1">
                  {currentCategory.units[fromUnit]?.label}
                </ThemedText>
                <IconSymbol name="chevron.down" size={16} color="#8a8a8e" />
              </View>
            </View>
            <View className="flex items-baseline overflow-hidden">
              <TextInput
                className="flex-1 text-4xl md:text-5xl font-bold tracking-tight text-text"
                placeholder="0"
                placeholderTextColor="#8a8a8e"
                keyboardType="numeric"
                value={fromValue}
                onChangeText={setFromValue}
              />
              <ThemedText className="ml-2 text-xl font-medium text-muted">
                {currentCategory.units[fromUnit]?.symbol}
              </ThemedText>
            </View>
            {/* The UnitPicker itself will be visually hidden or rendered as a modal later */}
            {/* {currentCategory && currentCategory.units && (
              <UnitPicker
                selectedValue={fromUnit}
                onValueChange={setFromUnit}
                units={currentCategory.units}
                label="From Unit"
              />
            )} */}
          </View>

          {/* Swap Button */}
          <TouchableOpacity
            className="flex size-12 cursor-pointer items-center justify-center rounded-full bg-primary text-icon shadow-lg shadow-primary/30 border-4 border-background active:scale-95 transition-transform -my-5 z-10 self-center"
            onPress={() => {
              setFromUnit(toUnit);
              setToUnit(fromUnit);
              setFromValue(toValue); // Swap values as well
              setToValue(fromValue); // Swap values as well
            }}
          >
            <IconSymbol
              name="arrow.up.arrow.down"
              size={24}
              color="text-icon"
            />
          </TouchableOpacity>

          {/* TO Output Field */}
          <View className="bg-card rounded-xl p-5 border border-transparent">
            <View className="flex justify-between items-center mb-1">
              <ThemedText className="text-xs font-bold text-muted uppercase tracking-wider">
                TO
              </ThemedText>
              <View className="flex items-center text-muted">
                <ThemedText className="text-sm font-medium mr-1">
                  {currentCategory.units[toUnit]?.label}
                </ThemedText>
                <IconSymbol name="chevron.down" size={16} color="#8a8a8e" />
              </View>
            </View>
            <View className="flex items-baseline overflow-hidden">
              <TextInput
                className="flex-1 text-4xl md:text-5xl font-bold tracking-tight text-text"
                placeholder="0"
                placeholderTextColor="#8a8a8e"
                editable={false}
                value={toValue}
              />
              <ThemedText className="ml-2 text-xl font-medium text-muted">
                {currentCategory.units[toUnit]?.symbol}
              </ThemedText>
            </View>
            {/* The UnitPicker itself will be visually hidden or rendered as a modal later */}
            {/* {currentCategory && currentCategory.units && (
              <UnitPicker
                selectedValue={toUnit}
                onValueChange={setToUnit}
                units={currentCategory.units}
                label="To Unit"
              />
            )} */}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
