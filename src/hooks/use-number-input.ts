import { formatNumberValue } from "@/hooks/useNumberFormat";
import { cleanInput } from "@/utils/number-format";
import { AppSettings } from "@/utils/settings";
import { useCallback, useMemo, useRef } from "react";

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
  const rawValueRef = useRef(initialValue);

  const handleTextChange = useCallback(
    (text: string) => {
      const newRawValue = cleanInput(text);
      rawValueRef.current = newRawValue;
      onValueChange?.(newRawValue);
    },
    [onValueChange],
  );

  const displayedValue = useMemo(() => {
    return formatNumberValue(rawValueRef.current, {
      thousandSeparator: settings.thousandSeparator,
      decimalPlaces: settings.decimalPlaces,
    });
  }, [settings.thousandSeparator, settings.decimalPlaces]);

  return {
    inputValue: rawValueRef.current,
    displayedValue,
    handleTextChange,
  };
};
