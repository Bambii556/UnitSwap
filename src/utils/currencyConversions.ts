import { CategoryType, CurrencyRates, UnitType } from "./conversions";

const currencyUnits: Record<string, UnitType> = {
  USD: { label: "USD ($)" },
  EUR: { label: "EUR (€)" },
  GBP: { label: "GBP (£)" },
  ZAR: { label: "ZAR (R)" },
};

export const currencyCategory: CategoryType = {
  name: "Currency",
  units: currencyUnits,
};

export function convertCurrency(
  value: number,
  fromUnitKey: string,
  toUnitKey: string,
  rates: CurrencyRates,
): number | null {
  if (value === null || isNaN(value)) return null;

  const fromRate = rates[fromUnitKey];
  const toRate = rates[toUnitKey];

  if (!fromRate || !toRate) {
    return null;
  }

  // Assumption: rates[X] = amount of currency X per 1 USD (Base)
  // 1. Convert input 'value' from 'fromUnit' to Base USD: value / rates[fromUnitKey]
  // 2. Convert Base USD to 'toUnit': Value_in_USD * rates[toUnitKey]

  const valueInBaseUSD = value / fromRate;
  return valueInBaseUSD * toRate;
}

// Placeholder for fetching currency rates
export async function fetchCurrencyRates(): Promise<CurrencyRates | null> {
  // In a real application, you would fetch this from an API.
  // For now, we'll return mock data or an empty object.
  console.warn("Currency rates are mocked. Implement actual API call.");
  return {
    USD: 1,
    EUR: 0.92, // Example rate
    GBP: 0.79, // Example rate
    ZAR: 18.5, // Example rate
  };
}
