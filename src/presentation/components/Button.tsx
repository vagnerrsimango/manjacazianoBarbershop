import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "success";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const baseClasses = "rounded-lg flex-row items-center justify-center";

  const variantClasses = {
    primary: "bg-primary-500",
    secondary: "bg-secondary-500",
    danger: "bg-red-500",
    success: "bg-green-500",
    ghost: "bg-transparent border border-gray-300",
  };

  const sizeClasses = {
    sm: "px-3 py-2",
    md: "px-4 py-3",
    lg: "px-6 py-4",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const textColorClasses = {
    primary: "text-white",
    secondary: "text-white",
    danger: "text-white",
    success: "text-white",
    ghost: "text-gray-700",
  };

  const disabledClasses = disabled || loading ? "opacity-50" : "";

  return (
    <TouchableOpacity
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses}`}
      onPress={onPress}
      disabled={disabled || loading}
      style={style}
      activeOpacity={0.7}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === "ghost" ? "#374151" : "#ffffff"}
          className="mr-2"
        />
      )}
      <Text
        className={`font-semibold ${textSizeClasses[size]} ${textColorClasses[variant]}`}
        style={textStyle}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
