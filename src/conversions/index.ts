// IMPORTANT NOTE: This module relies on a free, no-key API for currency rates.
// Check the API terms before using this in production environments.
// API used: https://open.er-api.com/v6/latest/USD

// --- 1. TYPE DEFINITIONS ---

import { areaCategory } from "./converters/area";
import { currencyCategory } from "./converters/currency";
import { dataCategory } from "./converters/data"; // New import
import { lengthCategory } from "./converters/length";
import { speedCategory } from "./converters/speed";
import { temperatureCategory } from "./converters/temp";
import { timeCategory } from "./converters/time";
import { volumeCategory } from "./converters/volume";
import { weightCategory } from "./converters/weight";

export type UnitType = {
  label: string;
  symbol: string;
  toBase?: (v: number) => number; // for linear conversions (most)
  fromBase?: (v: number) => number; // optional, default 1 / toBase
  convert?: (
    v: number,
    targetUnitKey: string,
    allUnits: Record<string, UnitType>,
  ) => number | null; // for special like temperature
};

export type CategoryType = {
  name: string;
  units: Record<string, UnitType>;
  baseUnit?: string; // for linear → base conversions
  convert: (
    value: number,
    fromUnitKey: string,
    toUnitKey: string,
    rates?: CurrencyRates,
  ) => number | null; // Add convert function to CategoryType
};

export type CurrencyRates = Record<string, number>;
export type UnitKey = string;
export type CategoryKey =
  | "length"
  | "weight"
  | "temperature"
  | "volume"
  | "speed"
  | "currency"
  | "area"
  | "time"
  | "data"; // New category key

// --- 2. CONVERSION DATA ---

export const conversionModules: Record<CategoryKey, CategoryType> = {
  length: lengthCategory,
  weight: weightCategory,
  temperature: temperatureCategory,
  volume: volumeCategory,
  area: areaCategory,
  currency: currencyCategory,
  speed: speedCategory,
  time: timeCategory,
  data: dataCategory, // New category module
};

/**
 * Converts a numeric value from one unit to another within a specified category.
 *
 * @param value The numeric value to convert.
 * @param fromUnitKey The key of the starting unit.
 * @param toUnitKey The key of the target unit.
 * @param categoryKey The key of the conversion category (e.g., 'length').
 * @param rates Optional exchange rates for currency conversion (must be present for currency).
 * @returns The converted number, or null if conversion is impossible/invalid.
 */
export function convert(
  value: number,
  fromUnitKey: string,
  toUnitKey: string,
  categoryKey: CategoryKey,
  rates?: CurrencyRates,
): number | null {
  if (value === null || isNaN(value)) return null;

  const categoryModule = conversionModules[categoryKey];
  if (!categoryModule) {
    console.error(`Unknown categoryKey: ${categoryKey}`);
    return null;
  }

  if (categoryKey === "currency") {
    if (!rates) {
      console.error("Currency rates are required for currency conversion.");
      return null;
    }
    return categoryModule.convert(value, fromUnitKey, toUnitKey, rates);
  } else {
    return categoryModule.convert(value, fromUnitKey, toUnitKey);
  }
}
