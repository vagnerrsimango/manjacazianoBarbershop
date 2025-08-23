import React from "react";
import { Modal, View, TouchableOpacity } from "react-native";

interface CustomModalProps {
  opened: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  maxWidth?: number;
}

const CustomModal: React.FC<CustomModalProps> = ({
  opened,
  onClose,
  children,
  maxWidth = 400,
}) => {
  return (
    <Modal
      visible={opened}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        className="flex-1 bg-black bg-opacity-50 justify-center items-center"
        onPress={onClose}
        activeOpacity={1}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View
            className="bg-white rounded-lg p-8 shadow-lg"
            style={{ maxWidth }}
          >
            {children}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default CustomModal;
