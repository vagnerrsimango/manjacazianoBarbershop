import React from "react";
import {
  TextInput,
  Text,
  View,
  ViewStyle,
  TextStyle,
  DimensionValue,
} from "react-native";

interface InputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  width?: DimensionValue;
  height?: DimensionValue;
  fontSize?: number;
  rounded?: number;
  leftIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChangeText,
  label,
  error,
  secureTextEntry = false,
  keyboardType = "default",
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  width = "100%",
  height = 48,
  fontSize = 16,
  rounded = 4,
  leftIcon,
}) => {
  return (
    <View className="mb-4" style={style}>
      {label && (
        <Text className="text-gray-700 font-medium mb-2 text-sm">{label}</Text>
      )}
      <View className="relative">
        {leftIcon && (
          <View className="absolute left-4 top-0 bottom-0 justify-center z-10">
            {leftIcon}
          </View>
        )}
        <TextInput
          className={`bg-blue-50 border border-transparent rounded text-gray-900 px-4 ${
            leftIcon ? "pl-12" : "pl-4"
          }`}
          style={[
            {
              width,
              height,
              fontSize,
              minHeight: multiline ? 80 : undefined,
              borderColor: error ? "#EF4444" : "transparent",
            },
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor="#4DA6FF"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? "top" : "center"}
        />
      </View>
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
};

export default Input;
