import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CustomerDataFormProps {
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  onEdit: () => void;
}

const CustomerDataForm: React.FC<CustomerDataFormProps> = ({
  customer,
  onEdit,
}) => {
  return (
    <View className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-lg font-semibold text-gray-900">
          Dados do Cliente
        </Text>
        <TouchableOpacity onPress={onEdit} activeOpacity={0.7}>
          <Ionicons name="pencil" size={20} color="#0052A3" />
        </TouchableOpacity>
      </View>

      <View className="space-y-2">
        <View className="flex-row items-center">
          <Ionicons name="person" size={16} color="#6B7280" className="mr-2" />
          <Text className="text-gray-700 ml-2">{customer.name}</Text>
        </View>

        <View className="flex-row items-center">
          <Ionicons name="call" size={16} color="#6B7280" className="mr-2" />
          <Text className="text-gray-700 ml-2">{customer.phone}</Text>
        </View>

        {customer.email && (
          <View className="flex-row items-center">
            <Ionicons name="mail" size={16} color="#6B7280" className="mr-2" />
            <Text className="text-gray-700 ml-2">{customer.email}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default CustomerDataForm;
