import { CategoryType, UnitType } from "./conversions";

const weightUnits: Record<string, UnitType> = {
  kg: { label: "Kilograms", toBase: (v) => v },
  g: { label: "Grams", toBase: (v) => v / 1000 },
  lb: { label: "Pounds (lbs)", toBase: (v) => v * 0.453592 },
  oz: { label: "Ounces (oz)", toBase: (v) => v * 0.0283495 },
  ton: { label: "Tons (Metric)", toBase: (v) => v * 1000 },
};

export const weightCategory: CategoryType = {
  name: "Weight",
  baseUnit: "kg",
  units: weightUnits,
};

export function convertWeight(
  value: number,
  fromUnitKey: string,
  toUnitKey: string,
): number | null {
  if (value === null || isNaN(value)) return null;

  const fromUnit = weightUnits[fromUnitKey];
  const toUnit = weightUnits[toUnitKey];

  if (!fromUnit || !toUnit || !fromUnit.toBase || !toUnit.toBase) return null;

  if (fromUnitKey === toUnitKey) return value;

  const baseValue = fromUnit.toBase(value);
  const factorForOneTargetUnitInBase = toUnit.toBase(1);

  if (factorForOneTargetUnitInBase === 0) return null; // Avoid division by zero

  return baseValue / factorForOneTargetUnitInBase;
}
