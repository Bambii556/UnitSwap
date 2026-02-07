import { HistoryList } from "@/components/HistoryList"; // Import HistoryList
import { IconSymbol } from "@/components/ui/icon-symbol"; // Import IconSymbol for the swap button
import {
  CategoryKey,
  conversionModules,
  convert,
  CurrencyRates,
} from "@/conversions";
import { fetchCurrencyRates } from "@/conversions/converters/currency";
import { saveConversion } from "@/database/database";
import { useNumberInput } from "@/hooks/use-number-input";
import { useSettings } from "@/providers/SettingsProvider";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import ConversionCard from "./ConversionCard"; // Import the new UI component
import { ThemedText } from "./themed-text";

interface ConversionContainerProps {
  categoryKey: CategoryKey;
}

const ConversionContainer: React.FC<ConversionContainerProps> = memo(
  ({ categoryKey }) => {
    const { settings } = useSettings();

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

    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [currencyRates, setCurrencyRates] = useState<CurrencyRates | null>(
      null,
    );

    // Effect to reset units and values when category changes
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
    }, [categoryKey, currentCategory]);

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
        return converted !== null
          ? converted.toFixed(settings.decimalPlaces || 2)
          : "0"; // Use settings.decimalPlaces
      },
      [categoryKey, currencyRates, settings.decimalPlaces], // Add settings.decimalPlaces dependency
    );

    // Use useNumberInput for the FROM card
    const {
      displayedValue: fromDisplayedValue,
      handleTextChange: handleFromTextChange,
      handleFocus: handleFromFocus,
      handleBlur: handleFromBlur,
      handleSelectionChange: handleFromSelectionChange,
      selection: fromSelection,
    } = useNumberInput({
      initialValue: fromValue,
      onValueChange: setFromValue,
      settings: settings,
    });

    // Use useNumberInput for the TO card (display only)
    const { displayedValue: toDisplayedValue, selection: toSelection } =
      useNumberInput({
        initialValue: toValue,
        settings: settings,
      });

    // Effect to perform conversion when fromValue, units, or category changes
    useEffect(() => {
      const converted = convertValue(fromValue, fromUnit, toUnit);
      setToValue(converted);

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
    }, [fromValue, fromUnit, toUnit, categoryKey, convertValue]);

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
            displayedValue={fromDisplayedValue}
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
            onFocus={handleFromFocus}
            onBlur={handleFromBlur}
            selection={fromSelection}
            onSelectionChange={handleFromSelectionChange}
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
            displayedValue={toDisplayedValue}
            onChangeText={() => {}} // TO card is not editable
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
            editable={false}
            primary={false}
            onFocus={() => {}}
            onBlur={() => {}}
            selection={toSelection}
            onSelectionChange={() => {}}
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
