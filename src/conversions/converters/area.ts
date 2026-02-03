import { CategoryType, UnitType } from "../index";

const areaUnits: Record<string, UnitType> = {
  sqm: { label: "Square Meters", symbol: "m²", toBase: (v) => v },
  sqft: { label: "Square Feet", symbol: "ft²", toBase: (v) => v * 0.092903 },
  sqkm: {
    label: "Square Kilometers",
    symbol: "km²",
    toBase: (v) => v * 1_000_000,
  },
  sqmi: { label: "Square Miles", symbol: "mi²", toBase: (v) => v * 2_589_988 },
  acre: { label: "Acres", symbol: "acre", toBase: (v) => v * 4046.86 },
  hectare: { label: "Hectares", symbol: "ha", toBase: (v) => v * 10_000 },
};

export const areaCategory: CategoryType = {
  name: "Area",
  baseUnit: "sqm",
  units: areaUnits,
  convert: convertArea,
};

export function convertArea(
  value: number,
  fromUnitKey: string,
  toUnitKey: string,
): number | null {
  if (value === null || isNaN(value)) return null;

  const fromUnit = areaUnits[fromUnitKey];
  const toUnit = areaUnits[toUnitKey];

  if (!fromUnit || !toUnit || !fromUnit.toBase || !toUnit.toBase) return null;

  if (fromUnitKey === toUnitKey) return value;

  const baseValue = fromUnit.toBase(value);
  const factorForOneTargetUnitInBase = toUnit.toBase(1);

  if (factorForOneTargetUnitInBase === 0) return null; // Avoid division by zero

  return baseValue / factorForOneTargetUnitInBase;
}
