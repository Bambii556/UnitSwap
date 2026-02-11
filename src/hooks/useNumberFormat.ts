import { useSettings } from "@/providers/SettingsProvider";
import { AppSettings } from "@/utils/settings";
import { useCallback } from "react";

interface NumberFormatOptions {
  useScientificNotation?: boolean;
  thousandSeparator?: AppSettings["thousandSeparator"];
  decimalPlaces?: number;
  useFullPrecision?: boolean;
}

/**
 * Formats a number value based on provided options
 * @param value - The number or string to format
 * @param options - Formatting options
 * @returns Formatted string
 */
export function formatNumberValue(
  value: string | number,
  options: NumberFormatOptions = {},
): string {
  const {
    useScientificNotation = false,
    thousandSeparator = "none",
    decimalPlaces = -1,
    useFullPrecision = false,
  } = options;

  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return String(value);

  // If scientific notation is enabled, use it for large/small numbers
  if (
    useScientificNotation &&
    (Math.abs(num) >= 1e9 || (Math.abs(num) < 1e-4 && num !== 0))
  ) {
    return num.toExponential(4);
  }

  // Format with thousand separator if enabled
  if (thousandSeparator !== "none") {
    const formatOptions: Intl.NumberFormatOptions = {
      useGrouping: true,
    };

    if (useFullPrecision) {
      formatOptions.maximumFractionDigits = 20;
    } else if (decimalPlaces >= 0) {
      // Only set maximum, not minimum, so trailing zeros are removed
      formatOptions.maximumFractionDigits = decimalPlaces;
    } else {
      formatOptions.maximumFractionDigits = 20;
    }

    let formatted = num.toLocaleString("en-US", formatOptions);

    // Replace with custom separator if not comma
    if (thousandSeparator !== ",") {
      // Use narrow no-break space for better typography
      const desiredSeparator =
        thousandSeparator === " " ? "\u202F" : thousandSeparator;
      formatted = formatted.replace(/,/g, desiredSeparator);
    }

    return formatted;
  }

  // No thousand separator - full precision mode
  if (useFullPrecision) {
    return num.toLocaleString("fullwide", {
      useGrouping: false,
      maximumFractionDigits: 20,
    });
  }

  // No thousand separator - standard mode with decimal places
  if (decimalPlaces >= 0) {
    const fixed = num.toFixed(decimalPlaces);
    // Remove trailing zeros and unnecessary decimal point
    return fixed.replace(/\.?0+$/, "");
  }

  // Default: return as-is without grouping
  return num.toLocaleString("fullwide", {
    useGrouping: false,
    maximumFractionDigits: 20,
  });
}

/**
 * Hook that provides number formatting functions based on user settings
 * @returns Object containing formatting functions and raw settings
 */
export function useNumberFormat() {
  const { settings } = useSettings();

  /**
   * Format a number for display in history items
   * Uses full precision and respects scientific notation setting
   */
  const formatForHistory = useCallback(
    (value: string | number) => {
      return formatNumberValue(value, {
        useScientificNotation: settings.useScientificNotation,
        thousandSeparator: settings.thousandSeparator,
        useFullPrecision: true,
      });
    },
    [settings.useScientificNotation, settings.thousandSeparator],
  );

  /**
   * Format a number for display in conversion cards
   * Uses decimal places setting and thousand separator
   */
  const formatForConversion = useCallback(
    (value: string | number) => {
      return formatNumberValue(value, {
        thousandSeparator: settings.thousandSeparator,
        decimalPlaces: settings.decimalPlaces,
      });
    },
    [settings.thousandSeparator, settings.decimalPlaces],
  );

  /**
   * Format with custom options (bypass settings)
   */
  const formatWithOptions = useCallback(
    (value: string | number, options: NumberFormatOptions) => {
      return formatNumberValue(value, options);
    },
    [],
  );

  return {
    formatForHistory,
    formatForConversion,
    formatWithOptions,
    formatNumberValue,
    settings,
  };
}

export default useNumberFormat;
