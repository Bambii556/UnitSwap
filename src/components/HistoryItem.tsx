import { CategoryIcon } from "@/components/CategoryIcon";
import { ALL_CATEGORIES, Category } from "@/constants/categories";
import { useNumberFormat } from "@/hooks/useNumberFormat";
import { AppSettings } from "@/utils/settings";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { BlurBackground } from "./BlurBackground";
import { ThemedText } from "./themed-text";

interface HistoryItemProps {
  fromValue: string | number;
  fromUnit: string;
  toValue: string | number;
  toUnit: string;
  timeAgo: string;
  onPress: () => void;
  conversionType: string;
  useScientificNotation?: boolean;
  thousandSeparator?: AppSettings["thousandSeparator"];
}

export function HistoryItem({
  fromValue,
  fromUnit,
  toValue,
  toUnit,
  timeAgo,
  onPress,
  conversionType,
  useScientificNotation,
  thousandSeparator,
}: HistoryItemProps) {
  const { formatNumberValue, settings } = useNumberFormat();

  const category = ALL_CATEGORIES.find(
    (cat: Category) =>
      cat.name.toLocaleLowerCase() === conversionType.toLocaleLowerCase(),
  );

  const iconBackgroundColor = category ? category.color + "20" : undefined;

  // Format with decimal places from settings, allow prop overrides for scientific notation and separator
  const formatOptions = {
    useScientificNotation:
      useScientificNotation !== undefined
        ? useScientificNotation
        : settings.useScientificNotation,
    thousandSeparator:
      thousandSeparator !== undefined
        ? thousandSeparator
        : settings.thousandSeparator,
    decimalPlaces: settings.decimalPlaces,
  };

  const displayFromValue = formatNumberValue(fromValue, formatOptions);
  const displayToValue = formatNumberValue(toValue, formatOptions);

  return (
    <TouchableOpacity className="px-4" onPress={onPress}>
      <BlurBackground className="flex-row items-center p-3 rounded-xl bg-card">
        {/* Icon */}
        <View className="flex-shrink-0 mr-3">
          <CategoryIcon
            categoryName={conversionType}
            containerSize={36}
            size={20}
            backgroundColor={iconBackgroundColor}
          />
        </View>

        {/* Content */}
        <View className="flex-1 min-w-0">
          {/* From */}
          <View className="flex-row items-baseline">
            <ThemedText className="text-muted text-xs w-10 flex-shrink-0">
              From
            </ThemedText>
            <ThemedText
              type="defaultSemiBold"
              className="text-text flex-shrink"
              numberOfLines={1}
            >
              {displayFromValue}
            </ThemedText>
            <ThemedText className="text-muted text-xs ml-1 flex-shrink-0">
              {fromUnit}
            </ThemedText>
          </View>

          {/* To */}
          <View className="flex-row items-baseline mt-1">
            <ThemedText className="text-muted text-xs w-10 flex-shrink-0">
              To
            </ThemedText>
            <ThemedText
              className="text-primary font-semibold flex-shrink"
              numberOfLines={1}
            >
              {displayToValue}
            </ThemedText>
            <ThemedText className="text-muted text-xs ml-1 flex-shrink-0">
              {toUnit}
            </ThemedText>
          </View>

          {/* Time */}
          <ThemedText className="text-muted text-xs mt-1.5">
            {timeAgo}
          </ThemedText>
        </View>
      </BlurBackground>
    </TouchableOpacity>
  );
}

export default HistoryItem;
