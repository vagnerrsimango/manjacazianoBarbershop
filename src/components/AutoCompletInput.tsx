import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Input from "../presentation/components/Input";
import api from "../utils/network/api";

interface Customer {
  id: string;
  name: string;
  phone: string;
  balance?: number;
}

interface AutoCompleteInputProps {
  placeholder?: string;
  onSelect: (customer: Customer) => void;
  value: string;
  onChangeText: (text: string) => void;
}

export default function AutoCompleteInput({
  placeholder = "Pesquisar cliente...",
  onSelect,
  value,
  onChangeText,
}: AutoCompleteInputProps) {
  const [data, setData] = useState<Customer[]>([]);

  const handleInputChange = async (text: string) => {
    onChangeText(text);

    if (text.length < 2) {
      setData([]);
      return;
    }

    try {
      const response = await api.get(`/client/search/${text}`);
      setData(response.data.clients || []);
    } catch (error) {
      console.error("Error searching clients:", error);
      setData([]);
    }
  };

  const renderCustomerItem = ({ item }: { item: Customer }) => (
    <TouchableOpacity
      onPress={() => {
        onSelect(item);
        setData([]);
        onChangeText(item.name);
      }}
      className="border-b border-gray-100 p-3 w-full"
    >
      <View className="flex-row items-center space-x-3">
        <Ionicons name="person-circle" size={20} color="#6B7280" />
        <Text className="text-primary-600 text-base flex-1">
          {item.name} - {item.phone}
        </Text>
        <Text className="text-gray-600 text-sm">
          {typeof item.balance === "number" ? item.balance.toFixed(2) : "0.00"}{" "}
          MT
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="w-full max-h-[40%] justify-center items-center">
      <Input
        placeholder={placeholder}
        value={value}
        onChangeText={handleInputChange}
        style={{ width: "100%" }}
      />

      {data.length > 0 && (
        <View className="w-full bg-white rounded-lg shadow-lg border border-gray-200 mt-2 max-h-48">
          <FlatList
            data={data}
            renderItem={renderCustomerItem}
            keyExtractor={(item: Customer) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
          />
        </View>
      )}
    </View>
  );
}
