import { AppSettings } from "@/utils/settings";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseNumberInputOptions {
  initialValue: string;
  onValueChange?: (value: string) => void;
  settings: AppSettings;
}

export const useNumberInput = ({
  initialValue,
  onValueChange,
  settings,
}: UseNumberInputOptions) => {
  const [isFocused, setIsFocused] = useState(false);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const rawValueRef = useRef(initialValue); // Stores the raw, unformatted value

  // Update rawValueRef when initialValue changes, but only if not focused
  useEffect(() => {
    // When initialValue changes externally, update rawValueRef and selection
    // Only do this if the input is not currently focused to avoid disrupting user input
    // And only if the initialValue is actually different from the current raw value
    if (!isFocused && initialValue !== rawValueRef.current) {
      const newSelectionStart = initialValue.length;
      rawValueRef.current = initialValue;
      setSelection({ start: newSelectionStart, end: newSelectionStart });
    }
  }, [initialValue, isFocused]);

  // Function to clean input text (remove non-numeric, enforce single decimal)
  const cleanInput = useCallback((text: string): string => {
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
    return cleaned;
  }, []);

  // Function to format a raw number string based on settings
  const formatNumber = useCallback(
    (numStr: string): string => {
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
      // Remove trailing zeros after decimal if decimalPlaces is not explicitly set to 0
      // and the original number didn\"t have them as significant
      if (
        settings.decimalPlaces !== 0 &&
        numStr.includes(".") &&
        parseFloat(formatted) === parseFloat(numStr)
      ) {
        formatted = formatted.replace(/(\.0*|(?<=(\.\d*?))0+)$/, "");
      }

      return formatted;
    },
    [settings.decimalPlaces, settings.thousandSeparator],
  );

  const handleTextChange = useCallback(
    (text: string) => {
      const oldFormattedValue = formatNumber(rawValueRef.current);
      const oldSelectionStart = selection.start;

      // First, clean the incoming text to get the new raw value
      const newRawValue = cleanInput(text);

      // Immediately update rawValueRef and notify parent
      rawValueRef.current = newRawValue;
      onValueChange?.(newRawValue);

      // Now, format the new raw value to get the value that will be displayed
      const newFormattedValue = formatNumber(newRawValue);

      let newSelectionStart = oldSelectionStart;

      // --- Cursor position adjustment logic ---
      // Only adjust if the formatted value actually changed (i.e., formatting was applied or removed)
      if (newFormattedValue !== oldFormattedValue) {
        // Count non-numeric characters (separators) before the old cursor position in the old formatted string
        const oldSeparatorsBeforeCursor = (
          oldFormattedValue.substring(0, oldSelectionStart).match(/[^\d.]/g) ||
          []
        ).length;
        // Count non-numeric characters (digits) before the old cursor position in the raw value
        const oldRawDigitsBeforeCursor =
          oldSelectionStart - oldSeparatorsBeforeCursor;

        // Find the new cursor position by iterating through the new formatted value
        // until we find the equivalent number of digits.
        let digitsCount = 0;
        let foundNewPosition = false;
        for (let i = 0; i < newFormattedValue.length; i++) {
          if (/\d/.test(newFormattedValue[i])) {
            digitsCount++;
          }
          if (digitsCount === oldRawDigitsBeforeCursor) {
            newSelectionStart = i + 1; // Simplified cursor adjustment
            foundNewPosition = true;
            break;
          }
        }

        if (!foundNewPosition) {
          // If for some reason the digit count doesn\"t match (e.g., all digits deleted),
          // or the cursor was at the very end, place cursor at the end of the new formatted value.
          newSelectionStart = newFormattedValue.length;
        }
      }

      // Ensure the cursor stays within the bounds of the new formatted value
      newSelectionStart = Math.max(
        0,
        Math.min(newSelectionStart, newFormattedValue.length),
      );
      setSelection({ start: newSelectionStart, end: newSelectionStart });
    },
    [cleanInput, formatNumber, onValueChange, selection.start],
  );

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    const formattedLength = formatNumber(rawValueRef.current).length;
    setSelection({ start: formattedLength, end: formattedLength });
  }, [formatNumber]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    const formattedLength = formatNumber(rawValueRef.current).length;
    setSelection({ start: formattedLength, end: formattedLength });
  }, [formatNumber]);

  const handleSelectionChange = useCallback((event: any) => {
    // This is mainly to capture manual cursor movements by the user within the formatted text
    setSelection(event.nativeEvent.selection);
  }, []);

  // The value to display in the TextInput
  const displayedValue = formatNumber(rawValueRef.current);

  return {
    displayedValue,
    handleTextChange,
    handleFocus,
    handleBlur,
    handleSelectionChange,
    selection,
  };
};
