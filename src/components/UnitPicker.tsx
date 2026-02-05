import { Colors } from "@/constants/theme";
import { UnitType } from "@/conversions";
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
  selectedValue: string;
  onValueChange: (itemValue: string) => void;
  units: Record<string, UnitType>;
}

const UnitPicker: React.FC<UnitPickerProps> = ({
  selectedValue,
  onValueChange,
  units,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const unitKeys = Object.keys(units);

  const selectedUnitLabel = units[selectedValue]?.label || "Select Unit";

  return (
    <View>
      <TouchableOpacity
        className="flex-row items-center justify-between"
        onPress={() => setModalVisible(true)}
      >
        <ThemedText className="text-sm font-medium mr-1 text-muted">
          {selectedUnitLabel}
        </ThemedText>
        <MaterialIcons name="expand-more" size={16} color={Colors.dark.muted} />
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
          <View className="w-3/4 rounded-xl bg-card p-4">
            <FlatList
              data={unitKeys}
              keyExtractor={(item) => item}
              renderItem={({ item: key }) => (
                <TouchableOpacity
                  className="py-2 px-3"
                  onPress={() => {
                    onValueChange(key);
                    setModalVisible(false);
                  }}
                >
                  <ThemedText className="text-base text-text">
                    {units[key].label}
                  </ThemedText>
                </TouchableOpacity>
              )}
            />
            <Pressable
              className="mt-4 py-2 px-3 bg-red-500 rounded-lg items-center"
              onPress={() => setModalVisible(false)}
            >
              <ThemedText className="text-white font-bold">Cancel</ThemedText>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default UnitPicker;
