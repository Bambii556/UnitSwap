import { CategoryType, UnitType } from "../index";

const dataUnits: Record<string, UnitType> = {
  byte: { label: "Bytes", symbol: "B", toBase: (v) => v },
  kb: { label: "Kilobytes", symbol: "KB", toBase: (v) => v * 1024 },
  mb: { label: "Megabytes", symbol: "MB", toBase: (v) => v * 1024 ** 2 },
  gb: { label: "Gigabytes", symbol: "GB", toBase: (v) => v * 1024 ** 3 },
  tb: { label: "Terabytes", symbol: "TB", toBase: (v) => v * 1024 ** 4 },
};

export const dataCategory: CategoryType = {
  name: "Data",
  baseUnit: "byte",
  units: dataUnits,
  convert: convertData,
};

export function convertData(
  value: number,
  fromUnitKey: string,
  toUnitKey: string,
): number | null {
  if (value === null || isNaN(value)) return null;

  const fromUnit = dataUnits[fromUnitKey];
  const toUnit = dataUnits[toUnitKey];

  if (!fromUnit || !toUnit || !fromUnit.toBase || !toUnit.toBase) return null;

  if (fromUnitKey === toUnitKey) return value;

  const baseValue = fromUnit.toBase(value);
  const factorForOneTargetUnitInBase = toUnit.toBase(1);

  if (factorForOneTargetUnitInBase === 0) return null; // Avoid division by zero

  return baseValue / factorForOneTargetUnitInBase;
}
