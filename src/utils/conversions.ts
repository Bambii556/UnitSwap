// IMPORTANT NOTE: This module relies on a free, no-key API for currency rates.
// Check the API terms before using this in production environments.
// API used: https://open.er-api.com/v6/latest/USD

// --- 1. TYPE DEFINITIONS ---

import { areaCategory, convertArea } from "./areaConversions";
import { convertCurrency, currencyCategory } from "./currencyConversions";
import { convertLength, lengthCategory } from "./lengthConversions";
import { convertSpeed, speedCategory } from "./speedConversions";
import { convertTemperature, temperatureCategory } from "./tempConversions";
import { convertTime, timeCategory } from "./timeConversions";
import { convertVolume, volumeCategory } from "./volumeConversions";
import { convertWeight, weightCategory } from "./weightConversions";

export type UnitType = {
  label: string;
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
  | "time";

// --- 2. CONVERSION DATA ---

export const categories: Record<CategoryKey, CategoryType> = {
  length: lengthCategory,
  weight: weightCategory,
  temperature: temperatureCategory,
  volume: volumeCategory,
  area: areaCategory,
  currency: currencyCategory,
  speed: speedCategory,
  time: timeCategory,
};

// --- 3. CORE CONVERSION FUNCTION ---

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

  switch (categoryKey) {
    case "length":
      return convertLength(value, fromUnitKey, toUnitKey);
    case "weight":
      return convertWeight(value, fromUnitKey, toUnitKey);
    case "temperature":
      return convertTemperature(value, fromUnitKey, toUnitKey);
    case "volume":
      return convertVolume(value, fromUnitKey, toUnitKey);
    case "area":
      return convertArea(value, fromUnitKey, toUnitKey);
    case "currency":
      if (!rates) {
        console.error("Currency rates are required for currency conversion.");
        return null;
      }
      return convertCurrency(value, fromUnitKey, toUnitKey, rates);
    case "speed":
      return convertSpeed(value, fromUnitKey, toUnitKey);
    case "time":
      return convertTime(value, fromUnitKey, toUnitKey);
    default:
      return null;
  }
}
