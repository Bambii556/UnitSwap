import { CategoryType, UnitType } from "../index";

const lengthUnits: Record<string, UnitType> = {
  m: { label: "Meters", symbol: "m", toBase: (v) => v },
  cm: { label: "Centimeters", symbol: "cm", toBase: (v) => v / 100 },
  in: { label: "Inches", symbol: "in", toBase: (v) => v * 0.0254 },
  ft: { label: "Feet", symbol: "ft", toBase: (v) => v * 0.3048 },
  yd: { label: "Yards", symbol: "yd", toBase: (v) => v * 0.9144 },
  km: { label: "Kilometers", symbol: "km", toBase: (v) => v * 1000 },
  mi: { label: "Miles", symbol: "mi", toBase: (v) => v * 1609.34 },
};

export const lengthCategory: CategoryType = {
  name: "Length",
  baseUnit: "m",
  units: lengthUnits,
  convert: convertLength,
};

export function convertLength(
  value: number,
  fromUnitKey: string,
  toUnitKey: string,
): number | null {
  if (value === null || isNaN(value)) return null;

  const fromUnit = lengthUnits[fromUnitKey];
  const toUnit = lengthUnits[toUnitKey];

  if (!fromUnit || !toUnit || !fromUnit.toBase || !toUnit.toBase) return null;

  if (fromUnitKey === toUnitKey) return value;

  const baseValue = fromUnit.toBase(value);
  const factorForOneTargetUnitInBase = toUnit.toBase(1);

  if (factorForOneTargetUnitInBase === 0) return null; // Avoid division by zero

  return baseValue / factorForOneTargetUnitInBase;
}
