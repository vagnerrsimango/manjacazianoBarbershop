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
  // Ensure all props have valid values with robust checking
  const safeTitle = typeof title === "string" ? title : "Button";
  const safeVariant =
    variant && typeof variant === "string" ? variant : "primary";
  const safeSize = size && typeof size === "string" ? size : "md";
  const safeDisabled = typeof disabled === "boolean" ? disabled : false;
  const safeLoading = typeof loading === "boolean" ? loading : false;
  const safeOnPress = typeof onPress === "function" ? onPress : () => {};

  // Log any unexpected values for debugging
  if (
    title !== safeTitle ||
    variant !== safeVariant ||
    size !== safeSize ||
    disabled !== safeDisabled ||
    loading !== safeLoading ||
    onPress !== safeOnPress
  ) {
    console.warn("Button received invalid props:", {
      title,
      variant,
      size,
      disabled,
      loading,
      onPress: typeof onPress,
      safeTitle,
      safeVariant,
      safeSize,
      safeDisabled,
      safeLoading,
      safeOnPress: typeof safeOnPress,
    });
  }

  const baseClasses = "rounded-lg flex-row items-center justify-center";

  const variantClasses = {
    primary: "bg-primary-500",
    secondary: "bg-gray-600",
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

  const disabledClasses = safeDisabled || safeLoading ? "opacity-50" : "";

  return (
    <TouchableOpacity
      className={`${baseClasses} ${variantClasses[safeVariant]} ${sizeClasses[safeSize]} ${disabledClasses}`}
      onPress={safeOnPress}
      disabled={safeDisabled || safeLoading}
      style={style}
      activeOpacity={0.7}
    >
      {safeLoading && (
        <ActivityIndicator
          size="small"
          color={safeVariant === "ghost" ? "#374151" : "#FFFFFF"}
          className="mr-2"
        />
      )}
      <Text
        className={`font-semibold ${textSizeClasses[safeSize]} ${textColorClasses[safeVariant]}`}
        style={textStyle}
      >
        {safeTitle}
      </Text>
    </TouchableOpacity>
  );
};
