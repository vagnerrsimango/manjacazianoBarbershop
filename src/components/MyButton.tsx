import React from "react";
import {
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from "react-native";

interface MyButtonProps {
  title: string;
  onPress: () => void;
  bg?: string;
  width?: number | string;
  height?: number;
  disabled?: boolean;
  loading?: boolean;
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
  loading = false,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      className="bg-blue-600 rounded-lg items-center justify-center active:opacity-70"
      style={[
        {
          width,
          height,
          opacity: disabled || loading ? 0.5 : 1,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <Text className="text-white text-base font-semibold" style={textStyle}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default MyButton;
