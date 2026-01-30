import { CategoryType, UnitType } from "./conversions";

const timeUnits: Record<string, UnitType> = {
  s: { label: "Seconds", toBase: (v) => v },
  min: { label: "Minutes", toBase: (v) => v * 60 },
  hr: { label: "Hours", toBase: (v) => v * 3600 },
  day: { label: "Days", toBase: (v) => v * 86400 },
  week: { label: "Weeks", toBase: (v) => v * 604800 },
  month: { label: "Months (approx)", toBase: (v) => v * 2629746 }, // Average month
  year: { label: "Years (approx)", toBase: (v) => v * 31556952 }, // Average year
};

export const timeCategory: CategoryType = {
  name: "Time",
  baseUnit: "s",
  units: timeUnits,
};

export function convertTime(
  value: number,
  fromUnitKey: string,
  toUnitKey: string,
): number | null {
  if (value === null || isNaN(value)) return null;

  const fromUnit = timeUnits[fromUnitKey];
  const toUnit = timeUnits[toUnitKey];

  if (!fromUnit || !toUnit || !fromUnit.toBase || !toUnit.toBase) return null;

  if (fromUnitKey === toUnitKey) return value;

  const baseValue = fromUnit.toBase(value);
  const factorForOneTargetUnitInBase = toUnit.toBase(1);

  if (factorForOneTargetUnitInBase === 0) return null; // Avoid division by zero

  return baseValue / factorForOneTargetUnitInBase;
}
