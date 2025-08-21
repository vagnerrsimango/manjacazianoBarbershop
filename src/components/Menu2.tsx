import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Menu2Props {
  trigger: React.ReactNode;
  items: {
    label: string;
    icon?: string;
    onPress: () => void;
    disabled?: boolean;
  }[];
}

const Menu2: React.FC<Menu2Props> = ({ trigger, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View>
      <TouchableOpacity onPress={() => setIsOpen(true)} activeOpacity={0.7}>
        {trigger}
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black bg-opacity-50"
          onPress={() => setIsOpen(false)}
          activeOpacity={1}
        >
          <View className="flex-1 justify-center items-center">
            <View className="bg-white rounded-lg shadow-lg min-w-[200px]">
              {items.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className={`flex-row items-center p-4 ${
                    index < items.length - 1 ? "border-b border-gray-100" : ""
                  } ${item.disabled ? "opacity-50" : ""}`}
                  onPress={() => {
                    if (!item.disabled) {
                      item.onPress();
                      setIsOpen(false);
                    }
                  }}
                  disabled={item.disabled}
                  activeOpacity={0.7}
                >
                  {item.icon && (
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color="#6B7280"
                      className="mr-3"
                    />
                  )}
                  <Text
                    className={`flex-1 text-base ${
                      item.disabled ? "text-gray-400" : "text-gray-900"
                    }`}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Menu2;
