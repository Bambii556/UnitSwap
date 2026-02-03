import { Picker } from "@react-native-picker/picker";
import React from "react";
import { View } from "react-native";
import { ThemedText } from "../components/themed-text";
import { UnitType } from "../conversions"; // Should resolve now that TS dependency is installed

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
    <View className="w-full mb-1">
      <ThemedText className="text-xs font-bold uppercase tracking-wider mb-1 text-muted">
        {label}
      </ThemedText>
      <View className="bg-card rounded-xl border-2 border-primary shadow-sm">
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          className="h-12 w-full text-text"
          style={{ color: "#ECEDEE" }} // Set text and icon color for iOS and Android
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
