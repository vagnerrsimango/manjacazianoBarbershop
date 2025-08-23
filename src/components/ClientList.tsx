import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ClientListProps {
  customer: {
    name: string;
    phone: string;
    balance: number;
  };
  onPress: () => void;
  showDate?: boolean;
}

export default function ClientList({
  customer,
  onPress,
  showDate = true,
}: ClientListProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="border-b border-primary-300 rounded-lg p-3 mb-4">
        <View className="flex-row justify-between items-center w-[80%] mt-2">
          <Ionicons name="person-circle" size={48} color="#4DA6FF" />

          <View className="ml-10">
            <Text className="text-black font-bold text-base">
              {customer.name}
            </Text>
            <Text className="text-base text-primary-300 self-start">
              {customer.phone}
            </Text>
          </View>

          <View className="items-end">
            <Text
              className={`text-base font-bold ${
                customer.balance < 0 ? "text-red-500" : "text-green-500"
              }`}
            >
              {typeof customer.balance === "number"
                ? customer.balance.toFixed(2)
                : "0.00"}{" "}
              MT
            </Text>

            {showDate && (
              <Text className="text-base text-black self-start">25-06-23</Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
