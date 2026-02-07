import { Colors } from "@/constants/theme";
import { CategoryType, UnitKey } from "@/conversions";
import { cn } from "@/utils/cn";
import React, { memo, useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { ThemedText } from "./themed-text";
import UnitPicker from "./UnitPicker";

interface ConversionCardProps {
  title: "TO" | "FROM";
  displayedValue: string;
  onChangeText: (text: string) => void;
  unit: UnitKey;
  onUnitChange: (unitKey: UnitKey) => void;
  currentCategory: CategoryType;
  editable?: boolean;
  primary: boolean; // For variations like border color
  onFocus: () => void;
  onBlur: () => void;
  selection: { start: number; end: number };
  onSelectionChange: (event: any) => void;
}

const ConversionCard: React.FC<ConversionCardProps> = memo(
  ({
    title,
    displayedValue,
    onChangeText,
    unit,
    onUnitChange,
    currentCategory,
    editable = false,
    primary = false,
    onFocus,
    onBlur,
    selection,
    onSelectionChange,
  }) => {
    const textInputRef = useRef<TextInput>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [rawInputValue, setRawInputValue] = useState(displayedValue);

    // Effect to focus TextInput when editing starts
    useEffect(() => {
      if (isEditing && textInputRef.current) {
        setTimeout(() => {
          textInputRef.current?.focus();
        }, 100);
      }
      // When entering editing mode, initialize rawInputValue with the current displayedValue
      if (isEditing) {
        setRawInputValue(displayedValue);
      }
    }, [isEditing, displayedValue]);

    const handleDisplayPress = () => {
      if (editable) {
        console.log("Card Pressed, entering edit mode");
        setIsEditing(true);
        onFocus(); // Propagate focus
      }
    };

    const handleInputBlur = () => {
      console.log("Input lost focus, exiting edit mode");
      setIsEditing(false);
      onBlur(); // Propagate original onBlur
    };

    // Effect to clean the raw input and propagate changes when rawInputValue changes
    useEffect(() => {
      const cleanedValue = rawInputValue.replace(/[^0-9.]/g, "");
      onChangeText(cleanedValue);
    }, [rawInputValue]);

    return (
      <PressableCard
        isEditing={isEditing}
        onPress={handleDisplayPress}
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
        <View className="flex flex-row justify-start items-baseline gap-1">
          <HorizontalScroller>
            <View className="flex-row items-baseline  flex-grow flex-shrink-0 min-w-0 h-full justify-start gap-1">
              {editable && isEditing ? (
                <TextInput
                  ref={textInputRef}
                  className="text-4xl md:text-5xl font-bold tracking-tight text-text flex-grow flex-shrink-0 min-w-0 py-0 leading-none"
                  placeholder="0"
                  placeholderTextColor={Colors.dark.text}
                  keyboardType="numeric"
                  value={rawInputValue || "0"}
                  onChangeText={setRawInputValue}
                  scrollEnabled={false}
                  editable={editable}
                  multiline={false}
                  onFocus={onFocus} // Propagate original onFocus
                  onBlur={handleInputBlur} // Use new blur handler
                  selection={selection}
                  onSelectionChange={onSelectionChange}
                />
              ) : (
                <ThemedText className="text-4xl md:text-5xl font-bold tracking-tight text-text flex-grow flex-shrink-0 min-w-0 py-0 leading-none">
                  {displayedValue || "0"}
                </ThemedText>
              )}
              <ThemedText className="text-xl font-medium text-muted">
                {currentCategory.units[unit]?.symbol}
              </ThemedText>
            </View>
          </HorizontalScroller>
        </View>
      </PressableCard>
    );
  },
);

function HorizontalScroller({ children }: { children: React.ReactNode }) {
  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      className="flex-1"
      contentContainerStyle={{
        flexDirection: "row",
        alignItems: "baseline",
      }}
      onStartShouldSetResponder={() => true} // Allows ScrollView to claim touches for scrolling
    >
      {children}
    </ScrollView>
  );
}

function PressableCard({
  isEditing,
  children,
  onPress,
  className,
}: {
  isEditing: boolean;
  children: React.ReactNode;
  onPress: () => void;
  className?: string;
}) {
  if (isEditing) {
    return <View className={className}>{children}</View>;
  }
  return (
    <Pressable onPress={onPress} className={className}>
      {children}
    </Pressable>
  );
}

export default ConversionCard;
