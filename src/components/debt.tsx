import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DebtProps {
  debt: {
    id: string;
    amount: number;
    dueDate: string;
    status: "pending" | "overdue" | "paid";
    customerName: string;
  };
  onPress: () => void;
}

const Debt: React.FC<DebtProps> = ({ debt, onPress }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200";
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "overdue":
        return "Vencido";
      case "paid":
        return "Pago";
      default:
        return "Desconhecido";
    }
  };

  return (
    <TouchableOpacity
      className="bg-white p-4 rounded-lg border border-gray-200 mb-3"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-900 mb-1">
            {debt.customerName}
          </Text>
          <Text className="text-sm text-gray-600 mb-2">
            Vencimento: {new Date(debt.dueDate).toLocaleDateString()}
          </Text>

          <View
            className={`inline-flex px-2 py-1 rounded-full border ${getStatusColor(
              debt.status
            )}`}
          >
            <Text
              className={`text-xs font-medium ${getStatusColor(debt.status)}`}
            >
              {getStatusText(debt.status)}
            </Text>
          </View>
        </View>

        <View className="items-end">
          <Text className="text-xl font-bold text-gray-900">
            ${debt.amount.toFixed(2)}
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Debt;
