import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SoldProductProps {
  product: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    date: string;
  };
  onPress?: () => void;
}

const SoldProduct: React.FC<SoldProductProps> = ({ product, onPress }) => {
  return (
    <TouchableOpacity
      className="bg-white p-4 rounded-lg border border-gray-200 mb-3"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-900 mb-1">
            {product.name}
          </Text>
          <View className="flex-row items-center space-x-4">
            <Text className="text-sm text-gray-600">
              Qtd: {product.quantity}
            </Text>
            <Text className="text-sm text-gray-600">
              {new Date(product.date).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View className="items-end">
          <Text className="text-lg font-bold text-primary-500">
            ${(product.price * product.quantity).toFixed(2)}
          </Text>
          <Text className="text-sm text-gray-500">
            ${product.price.toFixed(2)} cada
          </Text>
        </View>

        {onPress && (
          <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default SoldProduct;
