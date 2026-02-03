import { CategoryType, UnitKey } from "@/conversions";
import React from "react";
import { TextInput, View } from "react-native";
import { ThemedText } from "./themed-text";
import UnitPicker from "./UnitPicker";

interface ConversionCardProps {
  title: "TO" | "FROM";
  value: string;
  onValueChange?: (text: string) => void;
  unit: UnitKey;
  onUnitChange: (unitKey: UnitKey) => void;
  currentCategory: CategoryType;
  editable?: boolean;
  cardClassName?: string; // For variations like border color
}

const ConversionCard: React.FC<ConversionCardProps> = ({
  title,
  value,
  onValueChange,
  unit,
  onUnitChange,
  currentCategory,
  editable = false,
  cardClassName = "border-transparent", // Default for TO card
}) => {
  return (
    <View className={`bg-card rounded-xl p-5 shadow-sm ${cardClassName}`}>
      <View className="flex justify-between items-center mb-1">
        <ThemedText
          className={`text-xs font-bold uppercase tracking-wider "text-muted"`}
        >
          {title}
        </ThemedText>
        {currentCategory && currentCategory.units && (
          <UnitPicker
            selectedValue={unit}
            onValueChange={onUnitChange}
            units={currentCategory.units}
            label={`${title} Unit`}
          />
        )}
      </View>
      <View className="flex items-baseline overflow-hidden">
        <TextInput
          className="flex-1 text-4xl md:text-5xl font-bold tracking-tight text-text"
          placeholder="0"
          placeholderTextColor="#8a8a8e"
          keyboardType="numeric"
          value={value}
          onChangeText={onValueChange}
          editable={editable}
        />
        <ThemedText className="ml-2 text-xl font-medium text-muted">
          {currentCategory.units[unit]?.symbol}
        </ThemedText>
      </View>
    </View>
  );
};

export default ConversionCard;
