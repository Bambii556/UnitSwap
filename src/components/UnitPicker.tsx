import { UnitType } from "@/conversions";
import { useAppTheme } from "@/providers/ThemeProvider";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "./themed-text";

interface UnitPickerProps {
  direction: "From" | "To";
  selectedValue: string;
  onValueChange: (itemValue: string) => void;
  units: Record<string, UnitType>;
}

const UnitPicker: React.FC<UnitPickerProps> = ({
  direction,
  selectedValue,
  onValueChange,
  units,
}) => {
  const { colors } = useAppTheme();

  const [modalVisible, setModalVisible] = useState(false);
  const unitKeys = Object.keys(units);

  const selectedUnitLabel = units[selectedValue]?.label || "Select Unit";

  return (
    <View>
      <TouchableOpacity
        className="flex-row items-center justify-between"
        onPress={() => setModalVisible(true)}
      >
        <ThemedText className="text-m font-medium mr-1 text-muted">
          {selectedUnitLabel}
        </ThemedText>
        <MaterialIcons name="expand-more" size={16} color={colors.muted} />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          className="flex-1 justify-center items-center bg-black/50"
          onPress={() => setModalVisible(false)}
        >
          <View className="w-3/4 rounded-xl bg-card p-4 shadow-lg shadow-black/30">
            <View className="flex-row justify-between items-center mb-4">
              <ThemedText className="text-xl font-bold">
                Select &apos;{direction}&apos; Unit
              </ThemedText>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="p-2"
              >
                <MaterialIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={unitKeys}
              keyExtractor={(item) => item}
              renderItem={({ item: key }) => (
                <TouchableOpacity
                  className={`py-2 px-3 rounded-md active:bg-primary/20 ${selectedValue === key ? "bg-primary/10" : ""}`}
                  onPress={() => {
                    onValueChange(key);
                    setModalVisible(false);
                  }}
                >
                  <ThemedText
                    className={`text-base text-text ${selectedValue === key ? "font-bold" : ""}`}
                  >
                    {units[key].label}
                  </ThemedText>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default UnitPicker;
