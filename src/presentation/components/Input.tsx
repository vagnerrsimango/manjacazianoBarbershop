import React from "react";
import { TextInput, Text, View, ViewStyle, TextStyle } from "react-native";

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
}) => {
  return (
    <View className="mb-4" style={style}>
      {label && (
        <Text className="text-gray-700 font-medium mb-2 text-sm">{label}</Text>
      )}
      <TextInput
        className={`bg-white border rounded-lg px-4 py-3 text-gray-900 ${
          error ? "border-red-500" : "border-gray-300"
        } ${multiline ? "min-h-[80px]" : ""}`}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        style={inputStyle}
        textAlignVertical={multiline ? "top" : "center"}
      />
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
};

export default Input;
