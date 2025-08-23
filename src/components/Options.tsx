import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface OptionsProps {
  options: {
    id: string;
    label: string;
    icon: string;
    onPress: () => void;
    disabled?: boolean;
  }[];
  columns?: number;
}

const Options: React.FC<OptionsProps> = ({ options, columns = 2 }) => {
  return (
    <View className="space-y-4">
      {chunk(options, columns).map((row, rowIndex) => (
        <View key={rowIndex} className="flex-row space-x-4">
          {row.map((option) => (
            <TouchableOpacity
              key={option.id}
              className={`flex-1 p-4 rounded-lg border-2 border-gray-200 bg-white items-center ${
                option.disabled ? "opacity-50" : ""
              }`}
              onPress={option.onPress}
              disabled={option.disabled}
              activeOpacity={0.7}
            >
              <Ionicons
                name={option.icon as any}
                size={32}
                color={option.disabled ? "#9CA3AF" : "#0052A3"}
                className="mb-2"
              />
              <Text
                className={`text-sm font-medium text-center ${
                  option.disabled ? "text-gray-400" : "text-gray-700"
                }`}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

// Helper function to chunk array into groups
const chunk = <T,>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export default Options;
