import { Colors } from "@/constants/theme";
import { CategoryType, UnitKey } from "@/conversions";
import { cn } from "@/utils/cn";
import React, { useRef } from "react";
import { Pressable, TextInput, View } from "react-native";
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
  const textInputRef = useRef<TextInput>(null);

  const handleCardPress = () => {
    if (editable) {
      textInputRef.current?.focus();
    }
  };

  const formatWithThousandsSeparator = (numStr: string): string => {
    if (!numStr || isNaN(parseFloat(numStr))) {
      return numStr;
    }
    const [integerPart, decimalPart] = numStr.split(".");
    const formattedIntegerPart = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      " ",
    );
    return decimalPart
      ? `${formattedIntegerPart}.${decimalPart}`
      : formattedIntegerPart;
  };

  const handleValueChange = (text: string) => {
    // Remove any non-numeric characters, including thousand separators
    const cleanedText = text.replace(/[^\d.]/g, "");
    // Allow empty string, or numbers with optional decimal point
    const numericRegex = /^\d*\.?\d*$/;
    if (numericRegex.test(cleanedText) || cleanedText === "") {
      onValueChange?.(cleanedText);
    }
  };

  const formatConvertedValue = (val: string): string => {
    const num = parseFloat(val);
    if (isNaN(num)) return val;

    let formattedNumStr: string;
    if (num % 1 === 0) {
      formattedNumStr = num.toFixed(0);
    } else {
      // This removes trailing zeros, e.g., 3.100 -> 3.1
      formattedNumStr = num.toString();
    }
    return formatWithThousandsSeparator(formattedNumStr);
  };
  return (
    <Pressable onPress={handleCardPress}>
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
              direction={title === "FROM" ? "From" : "To"}
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
              ref={textInputRef}
              className="text-4xl md:text-5xl font-bold tracking-tight text-text"
              placeholder="0"
              placeholderTextColor={Colors.dark.text}
              keyboardType="numeric"
              value={formatConvertedValue(value)}
              onChangeText={handleValueChange}
              editable={editable}
              selectTextOnFocus={true}
            />
            <ThemedText className="text-xl font-medium text-muted">
              {currentCategory.units[unit]?.symbol}
            </ThemedText>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default ConversionCard;
