import { Picker } from "@react-native-picker/picker";
import React from "react";
import { View } from "react-native";
import { ThemedText } from "../components/themed-text";
import { UnitType } from "../utils/conversions"; // Should resolve now that TS dependency is installed

interface UnitPickerProps {
  selectedValue: string;
  onValueChange: (itemValue: string) => void;
  units: Record<string, UnitType>;
  label: string;
}

const UnitPicker: React.FC<UnitPickerProps> = ({
  selectedValue,
  onValueChange,
  units,
  label,
}) => {
  const unitKeys = Object.keys(units);

  return (
    <View className="w-full mb-4">
      <ThemedText className="text-sm text-gray-600 mb-1 font-semibold">
        {label}
      </ThemedText>
      <View className="border border-gray-300 rounded-lg bg-white overflow-hidden">
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          className="h-12 w-full text-black"
          mode="dropdown"
        >
          {unitKeys.map((key) => (
            <Picker.Item key={key} label={units[key].label} value={key} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

export default UnitPicker;
