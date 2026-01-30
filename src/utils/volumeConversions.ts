import { CategoryType, UnitType } from "./conversions";

const volumeUnits: Record<string, UnitType> = {
  ml: { label: "Milliliters", toBase: (v) => v },
  L: { label: "Liters", toBase: (v) => v * 1000 },
  tsp: { label: "Teaspoons", toBase: (v) => v * 4.92892 }, // approx
  tbsp: { label: "Tablespoons", toBase: (v) => v * 14.7868 }, // approx
  cup: { label: "Cups (US)", toBase: (v) => v * 236.588 }, // approx
  fl_oz: { label: "Fluid Ounces", toBase: (v) => v * 29.5735 }, // approx
};

export const volumeCategory: CategoryType = {
  name: "Volume (Cooking)",
  baseUnit: "ml",
  units: volumeUnits,
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
