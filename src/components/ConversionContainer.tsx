import { HistoryList } from "@/components/HistoryList";
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
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import ConversionCard from "./ConversionCard";
import { ThemedText } from "./themed-text";

interface ConversionContainerProps {
  categoryKey: CategoryKey;
  initialUnit?: string;
}

const ConversionContainer: React.FC<ConversionContainerProps> = memo(
  ({ categoryKey, initialUnit }) => {
    ConversionContainer.displayName = 'ConversionContainer';
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

    // Effect to reset units and values when category changes
    useEffect(() => {
      console.log("ConversionContainer Effect:", { categoryKey, initialUnit, availableUnits: Object.keys(currentCategory?.units || {}) });
      let firstUnit = "";
      if (initialUnit) {
        const matchedUnit = Object.keys(currentCategory?.units || {}).find(
          (key) => key.toLowerCase() === initialUnit.toLowerCase()
        );
        if (matchedUnit) {
          firstUnit = matchedUnit;
        }
      }
      if (!firstUnit) {
        firstUnit = currentCategory?.baseUnit || Object.keys(currentCategory?.units || {})[0] || "";
      }
      console.log("Setting fromUnit to:", firstUnit);
      setFromUnit(firstUnit);
      setToUnit(
        Object.keys(currentCategory?.units || {}).find(u => u !== firstUnit) ||
        Object.keys(currentCategory?.units || {})[0] ||
        "",
      );
      setFromValue("0");
      setToValue("0");
    }, [categoryKey, currentCategory, initialUnit]);

    // Effect to fetch currency rates
    useEffect(() => {
      if (categoryKey === "currency") {
        const getRates = async () => {
          const rates = await fetchCurrencyRates();
          setCurrencyRates(rates);
        };
        getRates();
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
      const converted = convertValue(fromValue, fromUnit, toUnit);
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
            .then(() => setRefreshTrigger((prev) => prev + 1))
            .catch((error: Error) =>
              console.error("Failed to save conversion", error),
            );
        }
      }, 1000); // Debounce for database save

      return () => {
        clearTimeout(handler);
      };
    }, [fromValue, fromUnit, toUnit, categoryKey, convertValue, formatForConversion]);

    const handleSwapPress = useCallback(() => {
      const currentFromUnit = fromUnit;
      const currentToUnit = toUnit;
      const currentFromValue = fromValue;
      const currentToValue = toValue;

      setFromUnit(currentToUnit);
      setToUnit(currentFromUnit);
      setFromValue(currentToValue);
      setToValue(currentFromValue);
    }, [
      fromUnit,
      toUnit,
      fromValue,
      toValue,
      setFromUnit,
      setToUnit,
      setFromValue,
      setToValue,
    ]);

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

        <HistoryList
          listType="category"
          categoryKey={categoryKey}
          currentCategory={currentCategory}
          refreshTrigger={refreshTrigger}
          onConversionPress={(item) => {
            console.log("Tapped on category conversion:", item);
            // TODO: Optionally navigate back to this screen with pre-filled values
          }}
        />
      </View>
    );
  },
);

export default ConversionContainer;
