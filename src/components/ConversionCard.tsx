import { Colors } from "@/constants/theme";
import { CategoryType, UnitKey } from "@/conversions";
import { cn } from "@/utils/cn";
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
  primary: boolean; // For variations like border color
}

const ConversionCard: React.FC<ConversionCardProps> = ({
  title,
  value,
  onValueChange,
  unit,
  onUnitChange,
  currentCategory,
  editable = false,
  primary = false,
}) => {
  const formatConvertedValue = (val: string): string => {
    const num = parseFloat(val);
    if (isNaN(num)) return val;
    if (num % 1 === 0) {
      return num.toFixed(0);
    } else {
      // This removes trailing zeros, e.g., 3.100 -> 3.1
      return num.toString();
    }
  };
  return (
    <View
      className={cn(
        "bg-card rounded-xl p-5 h-[110px]",
        primary ? "border-2 border-primary" : "border-border",
      )}
    >
      {/* Title (FROM/TO) and Unit Picker Row */}
      <View className="flex flex-row justify-between items-center mb-1">
        <ThemedText
          className={cn(
            "text-xs font-bold uppercase tracking-wider",
            primary ? "text-primary" : "text-muted",
          )}
        >
          {title}
        </ThemedText>
        {currentCategory && currentCategory.units && (
          <UnitPicker
            selectedValue={unit}
            onValueChange={onUnitChange}
            units={currentCategory.units}
          />
        )}
      </View>

      {/* Conversion Value */}
      <View className="flex flex-row justify-start items-baseline overflow-hidden gap-1">
        <View className="flex flex-row items-baseline">
          <TextInput
            className="text-4xl md:text-5xl font-bold tracking-tight text-text"
            placeholder="0"
            placeholderTextColor={Colors.dark.text}
            keyboardType="numeric"
            value={formatConvertedValue(value)}
            onChangeText={onValueChange}
            editable={editable}
            selectTextOnFocus={true}
          />
          <ThemedText className="text-xl font-medium text-muted">
            {currentCategory.units[unit]?.symbol}
          </ThemedText>
        </View>
      </View>
    </View>
  );
};

export default ConversionCard;
