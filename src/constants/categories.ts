export interface UnitInfo {
  unit: string;
  name: string;
}

export interface Category {
  name: string;
  units: UnitInfo[];
  icon: string;
  color: string;
}

export const ALL_CATEGORIES: Category[] = [
  {
    name: "Length",
    units: [
      { unit: "m", name: "Meter" },
      { unit: "ft", name: "Feet" },
      { unit: "in", name: "Inch" },
      { unit: "km", name: "Kilometer" },
      { unit: "mi", name: "Mile" },
      { unit: "cm", name: "Centimeter" },
      { unit: "mm", name: "Millimeter" },
      { unit: "yd", name: "Yard" },
      { unit: "nmi", name: "Nautical Mile" },
    ],
    icon: "ruler.fill",
    color: "#4285F4",
  },
  {
    name: "Weight",
    units: [
      { unit: "kg", name: "Kilogram" },
      { unit: "lb", name: "Pound" },
      { unit: "oz", name: "Ounce" },
      { unit: "g", name: "Gram" },
      { unit: "mg", name: "Milligram" },
      { unit: "ton", name: "Metric Ton" },
    ],
    icon: "dumbbell.fill",
    color: "#34A853",
  },
  {
    name: "Temperature",
    units: [
      { unit: "°C", name: "Celsius" },
      { unit: "°F", name: "Fahrenheit" },
      { unit: "K", name: "Kelvin" },
      { unit: "°R", name: "Rankine" },
    ],
    icon: "thermometer.medium.slash.fill",
    color: "#EA4335",
  },
  {
    name: "Volume",
    units: [
      { unit: "L", name: "Liter" },
      { unit: "gal", name: "Gallon" },
      { unit: "ml", name: "Milliliter" },
      { unit: "cup", name: "Cup" },
      { unit: "fl_oz", name: "Fluid Ounce" },
      { unit: "tbsp", name: "Tablespoon" },
      { unit: "tsp", name: "Teaspoon" },
    ],
    icon: "drop.fill",
    color: "#4285F4",
  },
  {
    name: "Area",
    units: [
      { unit: "m²", name: "Square Meter" },
      { unit: "ft²", name: "Square Feet" },
      { unit: "acre", name: "Acre" },
      { unit: "km²", name: "Square Kilometer" },
      { unit: "ha", name: "Hectare" },
      { unit: "yd²", name: "Square Yard" },
      { unit: "mi²", name: "Square Mile" },
    ],
    icon: "square.fill.and.line.vertical.and.line.horizontal",
    color: "#9C27B0",
  },
  {
    name: "Currency",
    units: [
      { unit: "USD", name: "United States Dollar" },
      { unit: "EUR", name: "Euro" },
      { unit: "GBP", name: "British Pound" },
      { unit: "JPY", name: "Japanese Yen" },
      { unit: "CAD", name: "Canadian Dollar" },
      { unit: "AUD", name: "Australian Dollar" },
      { unit: "CHF", name: "Swiss Franc" },
      { unit: "CNY", name: "Chinese Yuan" },
      { unit: "INR", name: "Indian Rupee" },
      { unit: "BRL", name: "Brazilian Real" },
      { unit: "RUB", name: "Russian Ruble" },
      { unit: "ZAR", name: "South African Rand" },
    ],
    icon: "coloncurrencysign.circle.fill",
    color: "#F9AB00",
  },
  {
    name: "Speed",
    units: [
      { unit: "km/h", name: "Kilometer Per Hour" },
      { unit: "mph", name: "Mile Per Hour" },
      { unit: "m/s", name: "Meter Per Second" },
      { unit: "knot", name: "Knot" },
      { unit: "ft/s", name: "Feet Per Second" },
    ],
    icon: "speedometer",
    color: "#D32F2F",
  },
  {
    name: "Time",
    units: [
      { unit: "sec", name: "Second" },
      { unit: "min", name: "Minute" },
      { unit: "hr", name: "Hour" },
      { unit: "day", name: "Day" },
      { unit: "week", name: "Week" },
      { unit: "month", name: "Month" },
      { unit: "year", name: "Year" },
    ],
    icon: "hourglass.bottomhalf.fill",
    color: "#1976D2",
  },
  {
    name: "Data",
    units: [
      { unit: "B", name: "Byte" },
      { unit: "KB", name: "Kilobyte" },
      { unit: "MB", name: "Megabyte" },
      { unit: "GB", name: "Gigabyte" },
      { unit: "TB", name: "Terabyte" },
    ],
    icon: "memorychip",
    color: "#8B4513",
  },
];
