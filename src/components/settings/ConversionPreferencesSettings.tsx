import { useSettings } from "@/providers/SettingsProvider";
import { cn } from "@/utils/cn";
import { AppSettings, DEFAULT_SETTINGS } from "@/utils/settings";
import React from "react";
import { Pressable, TextInput, View } from "react-native";
import { ThemedText } from "../themed-text";

export const ConversionPreferencesSettings: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  return (
    <View>
      <ThemedText type="subtitle" className="mb-2 mt-4">
        Conversion Preferences
      </ThemedText>

      <View className="flex-row items-center justify-between mb-4 p-2 bg-card rounded-md">
        <ThemedText className="text-text">Decimal Places</ThemedText>
        <TextInput
          className="text-text border border-border rounded-md px-3 py-1 w-20 text-right"
          keyboardType="numeric"
          value={settings.decimalPlaces.toString()}
          onChangeText={(text: string) => {
            const num = parseInt(text, 10);
            if (!isNaN(num) && num >= 0 && num <= 10) {
              // Limit decimal places between 0 and 10
              updateSettings({ decimalPlaces: num });
            } else if (text === "") {
              // Allow empty string for temporary input clearing
              // Optionally set to a default or keep previous valid
            }
          }}
          onBlur={() => {
            // If the input is empty on blur, revert to default or a valid number
            if (settings.decimalPlaces.toString() === "") {
              updateSettings({ decimalPlaces: DEFAULT_SETTINGS.decimalPlaces });
            }
          }}
          maxLength={2} // Max 2 digits for 0-10
        />
      </View>

      <ThemedText className="mb-2 mt-4 text-text">
        Thousand Separator
      </ThemedText>
      <View className="flex-row justify-around mb-4">
        {[",", " ", "none"].map((separator) => (
          <Pressable
            key={separator}
            onPress={() =>
              updateSettings({
                thousandSeparator:
                  separator as AppSettings["thousandSeparator"],
              })
            }
            className={cn(
              "flex-1 py-2 items-center border rounded-md mx-1",
              settings.thousandSeparator === separator
                ? "bg-primary border-primary"
                : "border-border bg-card",
            )}
          >
            <ThemedText
              className={cn(
                settings.thousandSeparator === separator
                  ? "text-white"
                  : "text-text",
              )}
            >
              {separator === " "
                ? "Space"
                : separator === "none"
                  ? "None"
                  : separator}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <ThemedText className="mb-2 mt-4 text-text">
        Large Numbers Display
      </ThemedText>
      <View className="flex-row justify-around mb-4">
        {[
          { value: false, label: "Full Value" },
          { value: true, label: "Scientific (e+)" },
        ].map((option) => (
          <Pressable
            key={option.label}
            onPress={() =>
              updateSettings({
                useScientificNotation: option.value,
              })
            }
            className={cn(
              "flex-1 py-2 items-center border rounded-md mx-1",
              settings.useScientificNotation === option.value
                ? "bg-primary border-primary"
                : "border-border bg-card",
            )}
          >
            <ThemedText
              className={cn(
                settings.useScientificNotation === option.value
                  ? "text-white"
                  : "text-text",
              )}
            >
              {option.label}
            </ThemedText>
          </Pressable>
        ))}
      </View>
    </View>
  );
};
