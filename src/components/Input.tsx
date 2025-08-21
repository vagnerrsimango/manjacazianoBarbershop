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
}) => {
  return (
    <View style={[{ marginBottom: 16 }, style]}>
      {label && (
        <Text
          style={{
            color: "#374151",
            fontWeight: "500",
            marginBottom: 8,
            fontSize: 14,
          }}
        >
          {label}
        </Text>
      )}
      <TextInput
        style={[
          {
            backgroundColor: "#E6F3FF",
            borderWidth: 1,
            borderColor: error ? "#EF4444" : "transparent",
            borderRadius: rounded,
            paddingHorizontal: 16,
            color: "#111827",
            width,
            height,
            fontSize,
            minHeight: multiline ? 80 : undefined,
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
      {error && (
        <Text style={{ color: "#EF4444", fontSize: 14, marginTop: 4 }}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default Input;
