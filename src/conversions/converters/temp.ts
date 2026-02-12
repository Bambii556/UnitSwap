import { CategoryType, UnitType } from "../index";

const temperatureUnits: Record<string, UnitType> = {
  "°C": {
    label: "Celsius (°C)",
    symbol: "°C",
    convert: (v, targetUnitKey) => {
      if (targetUnitKey === "°F") return (v * 9) / 5 + 32;
      if (targetUnitKey === "K") return v + 273.15;
      if (targetUnitKey === "°R") return ((v + 273.15) * 9) / 5;
      return v; // C to C
    },
  },
  "°F": {
    label: "Fahrenheit (°F)",
    symbol: "°F",
    convert: (v, targetUnitKey) => {
      if (targetUnitKey === "°C") return ((v - 32) * 5) / 9;
      if (targetUnitKey === "K") return ((v - 32) * 5) / 9 + 273.15;
      if (targetUnitKey === "°R") return v + 459.67;
      return v; // F to F
    },
  },
  K: {
    label: "Kelvin (K)",
    symbol: "K",
    convert: (v, targetUnitKey) => {
      if (targetUnitKey === "°C") return v - 273.15;
      if (targetUnitKey === "°F") return ((v - 273.15) * 9) / 5 + 32;
      if (targetUnitKey === "°R") return (v * 9) / 5;
      return v; // K to K
    },
  },
  "°R": {
    label: "Rankine (°R)",
    symbol: "°R",
    convert: (v, targetUnitKey) => {
      if (targetUnitKey === "°C") return ((v - 491.67) * 5) / 9;
      if (targetUnitKey === "°F") return v - 459.67;
      if (targetUnitKey === "K") return (v * 5) / 9;
      return v; // R to R
    },
  },
};

export const temperatureCategory: CategoryType = {
  name: "Temperature",
  units: temperatureUnits,
  convert: convertTemperature,
};

export function convertTemperature(
  value: number,
  fromUnitKey: string,
  toUnitKey: string,
): number | null {
  if (value === null || isNaN(value)) return null;

  const fromUnit = temperatureUnits[fromUnitKey];
  if (!fromUnit || !fromUnit.convert) return null;

  if (fromUnitKey === toUnitKey) return value;

  return fromUnit.convert(
    value,
    toUnitKey,
    temperatureUnits as Record<string, UnitType>,
  );
}
