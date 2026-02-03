import { AppHeader } from "@/components/AppHeader";
import ConversionCard from "@/components/ConversionCard"; // New import
import { RecentConversionItem } from "@/components/RecentConversionItem"; // New import
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  CategoryKey,
  conversionModules,
  convert,
  CurrencyRates,
} from "@/conversions";
import { fetchCurrencyRates } from "@/conversions/converters/currency"; // Corrected path
import {
  Conversion,
  getConversions,
  initDb,
  saveConversion,
} from "@/database/database"; // Updated import
import { formatTimeAgo } from "@/utils/time"; // New import
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, ScrollView, TouchableOpacity, View } from "react-native"; // Add FlatList
import { ThemedText } from "../../components/themed-text"; // New import

export default function ConversionScreen() {
  const { type } = useLocalSearchParams();

  useEffect(() => {
    initDb().catch((error) =>
      console.error("Failed to initialize database", error),
    );
  }, []);
  const router = useRouter();

  const categoryKey =
    typeof type === "string" ? (type.toLowerCase() as CategoryKey) : "length";

  const currentCategory = useMemo(() => {
    // Ensure conversionModules[categoryKey] is defined before using it
    return conversionModules[categoryKey] || conversionModules["length"];
  }, [categoryKey]);

  const fetchCategoryConversions = useCallback(async () => {
    try {
      const conversions = await getConversions(10, 0, categoryKey);
      setCategoryConversions(conversions);
    } catch (error: any) {
      console.error("Failed to fetch category conversions", error);
    } finally {
      setLoadingCategoryConversions(false);
    }
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

  const [categoryConversions, setCategoryConversions] = useState<Conversion[]>(
    [],
  );
  const [loadingCategoryConversions, setLoadingCategoryConversions] =
    useState(true);

  // Effect to reset units when category changes
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
  }, [categoryKey, currentCategory]); // Re-fetch when category changes

  const [currencyRates, setCurrencyRates] = useState<CurrencyRates | null>(
    null,
  );

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
    (value: string, from: string, to: string) => {
      if (from === to) return value;
      const numericValue = parseFloat(value);
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
      return converted !== null ? converted.toFixed(3) : "0";
    },
    [categoryKey, currencyRates], // Dependencies for useCallback
  );

  useEffect(() => {
    const converted = convertValue(fromValue, fromUnit, toUnit);
    setToValue(converted);

    const handler = setTimeout(() => {
      // Save conversion to database
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
          .then(() => fetchCategoryConversions()) // Re-fetch history after saving
          .catch((error: Error) =>
            console.error("Failed to save conversion", error),
          );
      }
    }, 1000); // Debounce for 500ms

    return () => {
      clearTimeout(handler);
    };
  }, [
    fromValue,
    fromUnit,
    toUnit,
    categoryKey,
    convertValue,
    fetchCategoryConversions,
  ]);

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
    <View className="flex-1 bg-background text-text">
      <AppHeader
        title={currentCategory.name}
        onBackPress={() => {
          router.back();
        }}
        onHistoryPress={() => {
          router.push("/(tabs)/history");
        }}
        onSettingsPress={() => {
          router.push("/(tabs)/settings");
        }}
      />
      <ScrollView className="flex-1 px-4 py-4">
        <View className="flex flex-col gap-2 relative">
          <ConversionCard
            title="FROM"
            value={fromValue}
            onValueChange={setFromValue}
            unit={fromUnit}
            onUnitChange={(newFromUnit) => {
              if (newFromUnit === toUnit) {
                // If the selected 'from' unit is the same as 'to' unit, swap them
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
            cardClassName="border-2 border-primary"
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
            title="TO"
            value={toValue}
            unit={toUnit}
            onUnitChange={(newToUnit) => {
              if (newToUnit === fromUnit) {
                // If the selected 'to' unit is the same as 'from' unit, swap them
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
            cardClassName="border-2 border-border"
          />
        </View>

        <View className="mt-6">
          <ThemedText className="text-text text-xl font-bold">
            Recent {currentCategory.name} Conversions
          </ThemedText>
        </View>

        <View className="mt-4">
          {loadingCategoryConversions ? (
            <ThemedText>Loading category history...</ThemedText>
          ) : categoryConversions.length === 0 ? (
            <ThemedText>
              No recent conversions for this category yet.
            </ThemedText>
          ) : (
            <FlatList
              data={categoryConversions}
              keyExtractor={(item) => item.id!.toString()}
              renderItem={({ item }) => (
                <RecentConversionItem
                  fromValue={item.inputValue.toString()}
                  fromUnit={item.originalUnit}
                  toValue={item.outputValue.toString()}
                  toUnit={item.convertedUnit}
                  timeAgo={formatTimeAgo(item.timestamp)}
                  onPress={() => {
                    console.log("Tapped on category conversion:", item);
                    // TODO: Optionally navigate back to this screen with pre-filled values
                  }}
                />
              )}
              ItemSeparatorComponent={() => <View className="h-2" />}
              scrollEnabled={false} // Prevent FlatList from interfering with parent ScrollView
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
