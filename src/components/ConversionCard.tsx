import { CategoryType, UnitKey } from "@/conversions";
import { useAppTheme } from "@/providers/ThemeProvider";
import { cn } from "@/utils/cn";
import React, { memo, useEffect, useRef, useState } from "react";
import { ScrollView, TextInput, View } from "react-native";
import { ThemedText } from "./themed-text";
import UnitPicker from "./UnitPicker";

interface ConversionCardProps {
  title: "TO" | "FROM";
  displayedValue: string; // Formatted value for display
  inputValue: string; // Raw value for TextInput
  onChangeText?: (text: string) => void;
  unit: UnitKey;
  onUnitChange: (unitKey: UnitKey) => void;
  currentCategory: CategoryType;
  editable?: boolean;
  primary?: boolean; // For variations like border color
}

const ConversionCard: React.FC<ConversionCardProps> = memo(
  ({
    title,
    displayedValue,
    inputValue, // New prop for raw value
    onChangeText,
    unit,
    onUnitChange,
    currentCategory,
    editable = false,
    primary = false,
  }) => {
    const { colors } = useAppTheme();

    const textInputRef = useRef<TextInput>(null);
    const [isEditing, setIsEditing] = useState(false); // Reintroduce isEditing state

    // Effect to focus TextInput when editing starts
    useEffect(() => {
      if (isEditing && editable && textInputRef.current) {
        setTimeout(() => {
          textInputRef.current?.focus();
        }, 100);
      }
    }, [isEditing, editable]);

    const handleTapOnScroller = () => {
      if (editable) {
        setIsEditing(true);
      }
    };

    const handleInputBlur = () => {
      setIsEditing(false); // Set isEditing to false on input blur
    };

    return (
      <View
        className={cn(
          "bg-card rounded-xl p-5 h-[110px] border-2",
          primary ? "border-primary" : "border-border",
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
        <HorizontalScroller
          onTap={editable && !isEditing ? handleTapOnScroller : undefined}
        >
          <View className="flex-row items-baseline flex-nowrap flex-grow flex-shrink-0 min-w-0 h-full justify-start gap-1">
            {editable && isEditing ? ( // Conditionally render TextInput
              <TextInput
                ref={textInputRef}
                className="text-4xl md:text-5xl font-bold tracking-tight text-text flex-grow flex-shrink-0 min-w-0 py-0"
                placeholder="0"
                placeholderTextColor={colors.text}
                keyboardType="numeric"
                value={inputValue || "0"} // Use raw inputValue
                onChangeText={onChangeText}
                scrollEnabled={false}
                editable={editable}
                multiline={false}
                onFocus={() => setIsEditing(true)} // Set isEditing on focus
                onBlur={handleInputBlur} // Use internal blur handler
              />
            ) : (
              <ThemedText className="text-4xl md:text-5xl font-bold tracking-tight text-text flex-grow flex-shrink-0 min-w-0 py-0">
                {displayedValue || "0"}
              </ThemedText>
            )}
            <ThemedText className="text-xl font-medium text-muted">
              {currentCategory.units[unit]?.symbol}
            </ThemedText>
          </View>
        </HorizontalScroller>
      </View>
    );
  },
);

interface HorizontalScrollerProps {
  children: React.ReactNode;
  onTap?: () => void;
}

function HorizontalScroller({ children, onTap }: HorizontalScrollerProps) {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const isScrolling = useRef(false);

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      className="flex-1"
      contentContainerStyle={{
        flexDirection: "row",
        alignItems: "baseline",
      }}
      onScrollBeginDrag={() => {
        isScrolling.current = true;
      }}
      onScrollEndDrag={() => {
        // Reset scrolling flag after a delay to prevent tap detection
        setTimeout(() => {
          isScrolling.current = false;
        }, 50);
      }}
      onTouchStart={(event) => {
        touchStartX.current = event.nativeEvent.pageX;
        touchStartY.current = event.nativeEvent.pageY;
        touchStartTime.current = Date.now();
      }}
      onTouchEnd={(event) => {
        if (!onTap || isScrolling.current) return;

        const touchEndX = event.nativeEvent.pageX;
        const touchEndY = event.nativeEvent.pageY;
        const touchDuration = Date.now() - touchStartTime.current;

        const deltaX = Math.abs(touchEndX - touchStartX.current);
        const deltaY = Math.abs(touchEndY - touchStartY.current);
        const maxDelta = 10; // Maximum movement allowed for a tap

        // Only trigger tap if it's a clean tap (minimal movement and quick)
        if (deltaX < maxDelta && deltaY < maxDelta && touchDuration < 300) {
          onTap();
        }
      }}
    >
      {children}
    </ScrollView>
  );
}

export default ConversionCard;
