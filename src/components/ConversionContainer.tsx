import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  CategoryKey,
  conversionModules,
  convert,
  CurrencyRates,
} from "@/conversions";
import { fetchCurrencyRates } from "@/conversions/converters/currency";
import { saveConversion } from "@/database/database";
import { useNumberFormat } from "@/hooks/useNumberFormat";
import { cleanInput } from "@/utils/number-format";
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { InteractionManager, TouchableOpacity, View } from "react-native";
import ConversionCard from "./ConversionCard";
import { ThemedText } from "./themed-text";

interface ConversionContainerProps {
  categoryKey: CategoryKey;
  initialUnit?: string;
  onHistoryUpdate?: () => void;
}

const ConversionContainer: React.FC<ConversionContainerProps> = memo(
  ({ categoryKey, initialUnit, onHistoryUpdate }) => {
    ConversionContainer.displayName = "ConversionContainer";
    const { formatForConversion } = useNumberFormat();

    const currentCategory = useMemo(() => {
      return conversionModules[categoryKey] || conversionModules["length"];
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

    // Display values are formatted for user-friendly display, while input values are raw for TextInput
    const [fromDisplayValue, setFromDisplayValue] = useState("0");
    const [toDisplayValue, setToDisplayValue] = useState("0");

    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [currencyRates, setCurrencyRates] = useState<CurrencyRates | null>(
      null,
    );
    const isInitialMount = useRef(true);

    // Effect to reset units and values when category changes
    useEffect(() => {
      let firstUnit = "";
      const unitKeys = Object.keys(currentCategory?.units || {});
      
      if (initialUnit) {
        const matchedUnit = unitKeys.find(
          (key) => key.toLowerCase() === initialUnit.toLowerCase(),
        );
        if (matchedUnit) {
          firstUnit = matchedUnit;
        }
      }
      
      if (!firstUnit) {
        firstUnit = currentCategory?.baseUnit || unitKeys[0] || "";
      }
      
      const secondUnit = unitKeys.find((u) => u !== firstUnit) || unitKeys[0] || "";
      
      // Batch all state updates together
      setFromUnit(firstUnit);
      setToUnit(secondUnit);
      setFromValue("0");
      setToValue("0");
      setFromDisplayValue("0");
      setToDisplayValue("0");
    }, [categoryKey, currentCategory, initialUnit]);

    // Effect to fetch currency rates - deferred until after navigation
    useEffect(() => {
      if (categoryKey === "currency") {
        let isCancelled = false;
        
        const getRates = async () => {
          try {
            const rates = await fetchCurrencyRates();
            if (!isCancelled) {
              setCurrencyRates(rates);
            }
          } catch (error) {
            console.error("Failed to fetch currency rates:", error);
          }
        };
        
        // Defer currency fetch until after navigation transition
        const interactionPromise = InteractionManager.runAfterInteractions(() => {
          if (!isCancelled) {
            getRates();
          }
        });
        
        return () => {
          isCancelled = true;
          interactionPromise.cancel();
        };
      } else {
        setCurrencyRates(null);
      }
    }, [categoryKey]);

    const convertValue = useCallback(
      (valueToConvert: string, from: string, to: string) => {
        if (from === to) return valueToConvert;
        const numericValue = parseFloat(valueToConvert);
        if (isNaN(numericValue)) return "0";

        const converted = convert(
          numericValue,
          from,
          to,
          categoryKey,
          (categoryKey === "currency" ? currencyRates : undefined) as
            | CurrencyRates
            | undefined,
        );
        return converted !== null ? String(converted) : "0";
      },
      [categoryKey, currencyRates],
    );

    const handleFromTextChange = (text: string) => {
      setFromValue(cleanInput(text));
    };

    // Effect to perform conversion when fromValue, units, or category changes
    useEffect(() => {
      // Skip conversion on initial mount
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }

      const converted = convertValue(fromValue, fromUnit, toUnit);
      
      // Batch display updates
      setToValue(converted);
      setFromDisplayValue(formatForConversion(fromValue));
      setToDisplayValue(formatForConversion(converted));

      const handler = setTimeout(() => {
        const numericFromValue = parseFloat(fromValue);
        const numericToValue = parseFloat(converted);

        if (
          !isNaN(numericFromValue) &&
          !isNaN(numericToValue) &&
          numericFromValue !== 0 &&
          numericToValue !== 0
        ) {
          saveConversion({
            inputValue: numericFromValue,
            outputValue: numericToValue,
            originalUnit: fromUnit,
            convertedUnit: toUnit,
            conversionType: categoryKey,
            timestamp: Date.now(),
          })
            .then(() => {
              setRefreshTrigger((prev) => prev + 1);
              onHistoryUpdate?.();
            })
            .catch((error: Error) =>
              console.error("Failed to save conversion", error),
            );
        }
      }, 1000); // Debounce for database save

      return () => {
        clearTimeout(handler);
      };
    }, [
      fromValue,
      fromUnit,
      toUnit,
      categoryKey,
      convertValue,
      formatForConversion,
      onHistoryUpdate,
    ]);

    const handleSwapPress = useCallback(() => {
      setFromUnit(toUnit);
      setToUnit(fromUnit);
      setFromValue(toValue);
      setToValue(fromValue);
    }, [fromUnit, toUnit, fromValue, toValue]);

    return (
      <View className="mt-4">
        <View className="flex flex-col gap-2 relative">
          <ConversionCard
            key="from-card"
            title="FROM"
            displayedValue={fromDisplayValue}
            inputValue={fromValue}
            onChangeText={handleFromTextChange}
            unit={fromUnit}
            onUnitChange={(newFromUnit) => {
              if (newFromUnit === toUnit) {
                setFromUnit(newFromUnit);
                setToUnit(fromUnit);
                setFromValue(toValue);
                setToValue(fromValue);
              } else {
                setFromUnit(newFromUnit);
              }
            }}
            currentCategory={currentCategory}
            editable={true}
            primary={true}
          />

          {/* Swap Button */}
          <TouchableOpacity
            className="flex size-16 cursor-pointer items-center justify-center rounded-full bg-primary text-icon shadow-lg shadow-primary/30 border-4 border-background active:scale-95 transition-transform -my-5 z-10 self-center"
            onPress={handleSwapPress}
          >
            <IconSymbol
              name="arrow.up.arrow.down"
              size={30}
              color="text-icon"
            />
          </TouchableOpacity>

          <ConversionCard
            key="to-card"
            title="TO"
            displayedValue={toDisplayValue}
            inputValue={toValue}
            unit={toUnit}
            onUnitChange={(newToUnit) => {
              if (newToUnit === fromUnit) {
                setToUnit(newToUnit);
                setFromUnit(toUnit);
                setFromValue(toValue);
                setToValue(fromValue);
              } else {
                setToUnit(newToUnit);
              }
            }}
            currentCategory={currentCategory}
          />
        </View>
        <View className="mt-6">
          <ThemedText className="text-text text-xl font-bold">
            Recent {currentCategory.name} Conversions
          </ThemedText>
        </View>
      </View>
    );
  },
);

export default ConversionContainer;
