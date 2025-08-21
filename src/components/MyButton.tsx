import React from "react";
import { TouchableOpacity, Text, ViewStyle, TextStyle } from "react-native";

interface MyButtonProps {
  title: string;
  onPress: () => void;
  bg?: string;
  width?: number | string;
  height?: number;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const MyButton: React.FC<MyButtonProps> = ({
  title,
  onPress,
  bg = "#0052A3",
  width = "auto",
  height = 48,
  disabled = false,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: bg,
          width,
          height,
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text
        style={[
          {
            color: "#FFFFFF",
            fontSize: 16,
            fontWeight: "600",
          },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default MyButton;
