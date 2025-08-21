import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface FabProps {
  onPress: () => void;
  icon?: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
  style?: any;
}

const Fab: React.FC<FabProps> = ({
  onPress,
  icon = "add",
  size = 56,
  color = "#FFFFFF",
  backgroundColor = "#0052A3",
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.fab,
        {
          width: size,
          height: size,
          backgroundColor,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name={icon as any} size={size * 0.4} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
});

export default Fab;
