import { CategoryType, UnitType } from "../index";

const volumeUnits: Record<string, UnitType> = {
  ml: { label: "Milliliters", symbol: "ml", toBase: (v) => v },
  L: { label: "Liters", symbol: "L", toBase: (v) => v * 1000 },
  tsp: { label: "Teaspoons", symbol: "tsp", toBase: (v) => v * 4.92892 }, // approx
  tbsp: { label: "Tablespoons", symbol: "tbsp", toBase: (v) => v * 14.7868 }, // approx
  cup: { label: "Cups (US)", symbol: "cup", toBase: (v) => v * 236.588 }, // approx
  fl_oz: { label: "Fluid Ounces", symbol: "fl oz", toBase: (v) => v * 29.5735 }, // approx
};

export const volumeCategory: CategoryType = {
  name: "Volume (Cooking)",
  baseUnit: "ml",
  units: volumeUnits,
  convert: convertVolume,
};

export function convertVolume(
  value: number,
  fromUnitKey: string,
  toUnitKey: string,
): number | null {
  if (value === null || isNaN(value)) return null;

  const fromUnit = volumeUnits[fromUnitKey];
  const toUnit = volumeUnits[toUnitKey];

  if (!fromUnit || !toUnit || !fromUnit.toBase || !toUnit.toBase) return null;

  if (fromUnitKey === toUnitKey) return value;

  const baseValue = fromUnit.toBase(value);
  const factorForOneTargetUnitInBase = toUnit.toBase(1);

  if (factorForOneTargetUnitInBase === 0) return null; // Avoid division by zero

  return baseValue / factorForOneTargetUnitInBase;
}
