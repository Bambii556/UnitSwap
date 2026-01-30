import { CategoryType, UnitType } from "./conversions";

const speedUnits: Record<string, UnitType> = {
  kph: { label: "Kilometers/Hour", toBase: (v) => v },
  mph: { label: "Miles/Hour", toBase: (v) => v * 1.60934 }, // 1 mph is 1.60934 kph
  mps: { label: "Meters/Second", toBase: (v) => v * 3.6 }, // 1 m/s is 3.6 kph
  fps: { label: "Feet/Second", toBase: (v) => v * 1.09728 }, // 1 fps is 1.09728 kph
};

export const speedCategory: CategoryType = {
  name: "Speed",
  baseUnit: "kph",
  units: speedUnits,
};

export function convertSpeed(
  value: number,
  fromUnitKey: string,
  toUnitKey: string,
): number | null {
  if (value === null || isNaN(value)) return null;

  const fromUnit = speedUnits[fromUnitKey];
  const toUnit = speedUnits[toUnitKey];

  if (!fromUnit || !toUnit || !fromUnit.toBase || !toUnit.toBase) return null;

  if (fromUnitKey === toUnitKey) return value;

  const baseValue = fromUnit.toBase(value);
  const factorForOneTargetUnitInBase = toUnit.toBase(1);

  if (factorForOneTargetUnitInBase === 0) return null; // Avoid division by zero

  return baseValue / factorForOneTargetUnitInBase;
}
