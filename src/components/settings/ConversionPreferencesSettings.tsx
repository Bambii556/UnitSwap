import { useSettings } from "@/providers/SettingsProvider";
import { cn } from "@/utils/cn";
import { AppSettings } from "@/utils/settings";
import React from "react";
import { Pressable, View } from "react-native";
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
        <View className="flex-row items-center">
          <Pressable
            onPress={() => {
              if (settings.decimalPlaces > 0) {
                updateSettings({ decimalPlaces: settings.decimalPlaces - 1 });
              }
            }}
            disabled={settings.decimalPlaces <= 0}
            className={`w-10 h-10 rounded-l-md items-center justify-center ${
              settings.decimalPlaces <= 0 ? "bg-muted/20" : "bg-primary/20"
            }`}
          >
            <ThemedText className={settings.decimalPlaces <= 0 ? "text-muted" : "text-primary font-bold"}>
              −
            </ThemedText>
          </Pressable>
          <View className="w-14 h-10 items-center justify-center bg-card border-y border-border">
            <ThemedText className="text-text font-semibold text-lg">
              {settings.decimalPlaces}
            </ThemedText>
          </View>
          <Pressable
            onPress={() => {
              if (settings.decimalPlaces < 10) {
                updateSettings({ decimalPlaces: settings.decimalPlaces + 1 });
              }
            }}
            disabled={settings.decimalPlaces >= 10}
            className={`w-10 h-10 rounded-r-md items-center justify-center ${
              settings.decimalPlaces >= 10 ? "bg-muted/20" : "bg-primary/20"
            }`}
          >
            <ThemedText className={settings.decimalPlaces >= 10 ? "text-muted" : "text-primary font-bold"}>
              +
            </ThemedText>
          </Pressable>
        </View>
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
