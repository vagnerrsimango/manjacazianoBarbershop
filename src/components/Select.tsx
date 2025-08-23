import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SelectProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  items: { label: string; value: string }[];
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  selectedValue,
  onValueChange,
  placeholder = "Selecione uma opção",
  items,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedItem = items.find((item) => item.value === selectedValue);

  return (
    <View>
      <TouchableOpacity
        className={`flex-row items-center justify-between p-4 border border-gray-300 rounded-lg bg-white ${
          disabled ? "opacity-50" : ""
        }`}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text
          className={`flex-1 ${
            selectedItem ? "text-gray-900" : "text-gray-500"
          }`}
        >
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#6B7280" />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-end">
          <View className="bg-white rounded-t-lg max-h-[70%]">
            <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
              <Text className="text-lg font-semibold">Selecione uma opção</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={items}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="p-4 border-b border-gray-100"
                  onPress={() => {
                    onValueChange(item.value);
                    setIsOpen(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-base text-gray-900">
                      {item.label}
                    </Text>
                    {selectedValue === item.value && (
                      <Ionicons name="checkmark" size={20} color="#0052A3" />
                    )}
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Select;
