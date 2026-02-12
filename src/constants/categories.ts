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
      { unit: "m", name: "meter" },
      { unit: "ft", name: "feet" },
      { unit: "in", name: "inch" },
      { unit: "km", name: "kilometer" },
      { unit: "mi", name: "mile" },
      { unit: "cm", name: "centimeter" },
      { unit: "mm", name: "millimeter" },
      { unit: "yd", name: "yard" },
      { unit: "nmi", name: "nautical mile" },
    ],
    icon: "ruler.fill",
    color: "#4285F4",
  },
  {
    name: "Weight",
    units: [
      { unit: "kg", name: "kilogram" },
      { unit: "lb", name: "pound" },
      { unit: "oz", name: "ounce" },
      { unit: "g", name: "gram" },
      { unit: "mg", name: "milligram" },
      { unit: "ton", name: "metric ton" },
    ],
    icon: "dumbbell.fill",
    color: "#34A853",
  },
  {
    name: "Temperature",
    units: [
      { unit: "°C", name: "celsius" },
      { unit: "°F", name: "fahrenheit" },
      { unit: "K", name: "kelvin" },
      { unit: "°R", name: "rankine" },
    ],
    icon: "thermometer.medium.slash.fill",
    color: "#EA4335",
  },
  {
    name: "Volume",
    units: [
      { unit: "L", name: "liter" },
      { unit: "gal", name: "gallon" },
      { unit: "ml", name: "milliliter" },
      { unit: "cup", name: "cup" },
      { unit: "fl_oz", name: "fluid ounce" },
      { unit: "tbsp", name: "tablespoon" },
      { unit: "tsp", name: "teaspoon" },
    ],
    icon: "drop.fill",
    color: "#4285F4",
  },
  {
    name: "Area",
    units: [
      { unit: "m²", name: "square meter" },
      { unit: "ft²", name: "square feet" },
      { unit: "acre", name: "acre" },
      { unit: "km²", name: "square kilometer" },
      { unit: "ha", name: "hectare" },
      { unit: "yd²", name: "square yard" },
      { unit: "mi²", name: "square mile" },
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
      { unit: "km/h", name: "kilometer per hour" },
      { unit: "mph", name: "mile per hour" },
      { unit: "m/s", name: "meter per second" },
      { unit: "knot", name: "knot" },
      { unit: "ft/s", name: "feet per second" },
    ],
    icon: "speedometer",
    color: "#D32F2F",
  },
  {
    name: "Time",
    units: [
      { unit: "sec", name: "second" },
      { unit: "min", name: "minute" },
      { unit: "hr", name: "hour" },
      { unit: "day", name: "day" },
      { unit: "week", name: "week" },
      { unit: "month", name: "month" },
      { unit: "year", name: "year" },
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
