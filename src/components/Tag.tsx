import React from "react";
import { View, Text } from "react-native";

interface TagProps {
  label: string;
  variant?: "primary" | "secondary" | "success" | "danger" | "warning";
  size?: "sm" | "md" | "lg";
}

const Tag: React.FC<TagProps> = ({
  label,
  variant = "primary",
  size = "md",
}) => {
  const variantClasses = {
    primary: "bg-primary-500 text-white",
    secondary: "bg-gray-500 text-white",
    success: "bg-green-500 text-white",
    danger: "bg-red-500 text-white",
    warning: "bg-yellow-500 text-white",
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <View
      className={`rounded-full ${variantClasses[variant]} ${sizeClasses[size]} items-center justify-center`}
    >
      <Text className={`font-medium ${variantClasses[variant]}`}>{label}</Text>
    </View>
  );
};

export default Tag;
