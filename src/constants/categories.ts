export interface Category {
  name: string;
  units: string;
  fullNames: string[];
  icon: string;
  color: string;
}

export const ALL_CATEGORIES: Category[] = [
  {
    name: "Length",
    units: "m, ft, in, km, mi, cm, mm, yd, nmi",
    fullNames: [
      "meter",
      "feet",
      "inch",
      "kilometer",
      "mile",
      "centimeter",
      "millimeter",
      "yard",
      "nautical mile",
    ],
    icon: "ruler.fill",
    color: "#4285F4",
  },
  {
    name: "Weight",
    units: "kg, lb, oz, g, mg, ton",
    fullNames: [
      "kilogram",
      "pound",
      "ounce",
      "gram",
      "milligram",
      "metric ton",
      "short ton",
    ],
    icon: "dumbbell.fill",
    color: "#34A853",
  },
  {
    name: "Temperature", // Changed from "Temp" to "Temperature"
    units: "°C, °F, K, °R",
    fullNames: ["celsius", "fahrenheit", "kelvin", "rankine"],
    icon: "thermometer.medium.slash.fill", // Changed icon
    color: "#EA4335",
  },
  {
    name: "Volume",
    units: "l, gal, ml, cup, fl oz, tbsp, tsp, m³, ft³, in³",
    fullNames: [
      "liter",
      "gallon",
      "milliliter",
      "cup",
      "fluid ounce",
      "tablespoon",
      "teaspoon",
      "cubic meter",
      "cubic feet",
      "cubic inch",
    ],
    icon: "drop.fill",
    color: "#4285F4",
  },
  {
    name: "Area",
    units: "m², ft², acre, km², ha, yd², mi²",
    fullNames: [
      "square meter",
      "square feet",
      "acre",
      "square kilometer",
      "hectare",
      "square yard",
      "square mile",
    ],
    icon: "square.fill.and.line.vertical.and.line.horizontal",
    color: "#9C27B0",
  },
  {
    name: "Currency",
    units: "USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY, INR, BRL, RUB, ZAR",
    fullNames: [
      "United States Dollar",
      "Euro",
      "British Pound",
      "Japanese Yen",
      "Canadian Dollar",
      "Australian Dollar",
      "Swiss Franc",
      "Chinese Yuan",
      "Indian Rupee",
      "Brazilian Real",
      "Russian Ruble",
      "South African Rand",
    ],
    icon: "coloncurrencysign.circle.fill",
    color: "#F9AB00",
  },
  {
    name: "Speed",
    units: "km/h, mph, m/s, knot, ft/s",
    fullNames: [
      "kilometer per hour",
      "mile per hour",
      "meter per second",
      "knot",
      "feet per second",
    ],
    icon: "speedometer",
    color: "#D32F2F",
  },
  {
    name: "Time",
    units: "sec, min, hr, day, week, month, year",
    fullNames: ["second", "minute", "hour", "day", "week", "month", "year"],
    icon: "hourglass.bottomhalf.fill",
    color: "#1976D2",
  },
  {
    name: "Data",
    units: "B, KB, MB, GB, TB",
    fullNames: ["Byte", "Kilobyte", "Megabyte", "Gigabyte", "Terabyte"],
    icon: "memorychip",
    color: "#8B4513", // SaddleBrown color for data
  },
];
