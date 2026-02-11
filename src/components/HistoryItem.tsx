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
  const { formatWithOptions } = useNumberFormat();
  const category = ALL_CATEGORIES.find(
    (cat: Category) =>
      cat.name.toLocaleLowerCase() === conversionType.toLocaleLowerCase(),
  );

  const iconBackgroundColor = category ? category.color + "20" : undefined;

  // Use props if provided, otherwise let the hook use settings
  const formatOptions = useScientificNotation !== undefined || thousandSeparator !== undefined
    ? {
        useScientificNotation,
        thousandSeparator,
        useFullPrecision: true,
      }
    : { useFullPrecision: true };

  const displayFromValue = formatWithOptions(fromValue, formatOptions);
  const displayToValue = formatWithOptions(toValue, formatOptions);

  return (
    <TouchableOpacity className="px-4" onPress={onPress}>
      <BlurBackground className="flex-row items-center p-4 mb-3 rounded-xl bg-cardSecond">
        <View className="flex-row items-center flex-1 min-w-0">
          <View className="items-center flex-shrink-0">
            <CategoryIcon
              categoryName={conversionType}
              containerSize={40}
              size={24}
              backgroundColor={iconBackgroundColor}
            />
          </View>
          <View className="ml-4 flex-1 min-w-0">
            <View className="flex-row items-center">
              <ThemedText 
                type="defaultSemiBold" 
                className="text-text"
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                minimumFontScale={0.5}
              >
                {displayFromValue} {fromUnit} {"→"} {toUnit}
              </ThemedText>
            </View>
            <ThemedText className="text-muted text-xs mt-1">
              {timeAgo}
            </ThemedText>
          </View>
        </View>
        <View className="justify-end items-end ml-2 flex-shrink-0 max-w-[50%]">
          <ThemedText 
            type="subtitle" 
            className="text-primary font-semibold"
            numberOfLines={1}
            adjustsFontSizeToFit={true}
            minimumFontScale={0.5}
          >
            {displayToValue} {toUnit}
          </ThemedText>
        </View>
      </BlurBackground>
    </TouchableOpacity>
  );
}

export default HistoryItem;
