import { AppSettings } from "@/utils/settings";

// Maximum safe number to prevent precision issues (15 digits)
export const MAX_INPUT_VALUE = 999999999999999;

// Function to clean input text (remove non-numeric, enforce single decimal)
export const cleanInput = (text: string): string => {
  // Remove any non-numeric characters (including thousand separators) for internal logic
  // Allow only one decimal point
  let cleaned = text.replace(/[^\d.]/g, "");

  // Handle leading zeros: remove if not followed by a decimal point
  if (
    cleaned.length > 1 &&
    cleaned.startsWith("0") &&
    cleaned.charAt(1) !== "."
  ) {
    cleaned = cleaned.substring(1);
  }

  const parts = cleaned.split(".");
  if (parts.length > 2) {
    return `${parts[0]}.${parts.slice(1).join("")}`;
  }

  // Enforce maximum value to prevent precision issues
  const numValue = parseFloat(cleaned);
  if (!isNaN(numValue) && numValue > MAX_INPUT_VALUE) {
    return String(MAX_INPUT_VALUE);
  }

  return cleaned;
};

// Function to format a raw number string based on settings
export const formatNumber = (numStr: string, settings: AppSettings): string => {
  // If the input string is empty or results in NaN, return it as is.
  // This handles cases where the user clears the input or types an invalid character.
  if (!numStr || isNaN(parseFloat(numStr))) {
    return numStr;
  }

  const num = parseFloat(numStr);

  // If the number is 0 and decimalPlaces is not explicitly set to 0, return "0"
  // to avoid displaying "0.00" when no significant value is present.
  if (num === 0 && settings.decimalPlaces !== 0) {
    return "0";
  }
  const options: Intl.NumberFormatOptions = {};

  if (settings.thousandSeparator !== "none") {
    options.useGrouping = true;
  }

  // Only set minimumFractionDigits if the number already has a decimal or decimalPlaces is 0.
  // This prevents adding ".00" prematurely when typing whole numbers.
  if (settings.decimalPlaces >= 0) {
    options.maximumFractionDigits = settings.decimalPlaces;
    if (numStr.includes(".") || settings.decimalPlaces === 0) {
      options.minimumFractionDigits = settings.decimalPlaces;
    }
  } else {
    // If decimalPlaces is negative, allow flexible decimals but still control max
    options.maximumFractionDigits = 20; // A reasonable max for precision
  }

  // Determine locale from environment or use a default (e.g., "en-US")
  // For thousand separators, Intl.NumberFormat handles this based on locale
  // We manually override the separator if user explicitly chose one.
  let formatted = new Intl.NumberFormat("en-US", options).format(num);

  // Custom thousand separator override if not "none"
  if (settings.thousandSeparator !== "none") {
    const localeSeparator = new Intl.NumberFormat("en-US")
      .format(1000)
      .charAt(1); // Usually ","
    const desiredSeparator =
      settings.thousandSeparator === " " ? " " : settings.thousandSeparator;
    if (desiredSeparator !== localeSeparator) {
      // Replace the locale-default thousands separator with the user-defined one
      formatted = formatted.replace(
        new RegExp(`\\${localeSeparator}`, "g"),
        desiredSeparator,
      );
    }
  }
  // Remove trailing zeros and unnecessary decimal point
  // This handles cases where toFixed() added .00 to whole numbers
  if (settings.decimalPlaces !== 0 && formatted.includes(".")) {
    formatted = formatted.replace(/\.?0+$/, "");
  }

  return formatted;
};
