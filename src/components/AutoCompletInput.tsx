import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../utils/network/api";

interface Customer {
  id: string;
  name: string;
  phone: string;
  balance?: number;
}

interface AutoCompleteInputProps {
  placeholder?: string;
  handleSelectedAutoCustomer?: (customer: Customer) => void;
  onSelect?: (customer: Customer) => void;
  input?: string;
  setInput?: (text: string) => void;
  value?: string;
  onChangeText?: (text: string) => void;
}

export default function AutoCompleteInput({
  placeholder = "Pesquisar cliente...",
  handleSelectedAutoCustomer,
  onSelect,
  input,
  setInput,
  value,
  onChangeText,
}: AutoCompleteInputProps) {
  const [data, setData] = useState<Customer[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  // Use the appropriate props based on what's provided
  const currentValue = input || value || "";
  const handleChangeText = setInput || onChangeText || (() => {});
  const handleCustomerSelect =
    handleSelectedAutoCustomer || onSelect || (() => {});

  const handleInputChange = async (text: string) => {
    console.log("=== API SEARCH DEBUG ===");
    console.log("Searching for:", text);

    handleChangeText(text);

    if (text.length < 2) {
      setData([]);
      return;
    }

    try {
      const response = await api.get(`/client/search/${text}`);
      console.log("Client search API response:", response.data);
      console.log("Response structure:", {
        hasData: !!response.data,
        hasClients: !!response.data.clients,
        clientsLength: response.data.clients?.length || 0,
        firstClient: response.data.clients?.[0],
      });

      const clients = response.data.clients || [];
      console.log("Processed clients array:", clients);

      setData(clients);
    } catch (error) {
      console.error("Error searching clients:", error);
      setData([]);
    }
  };

  const closeDropdown = () => {
    setData([]);
    setIsFocused(false);
  };

  const handleSelectCustomer = (customer: Customer) => {
    console.log("=== AutoCompleteInput DEBUG ===");
    console.log("AutoCompleteInput: Customer selected:", customer);
    console.log("Customer data:", {
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      balance: customer.balance,
    });
    console.log("handleCustomerSelect function:", handleCustomerSelect);

    // Call the customer selection handler FIRST
    handleCustomerSelect(customer);

    // Then close the dropdown
    closeDropdown();

    console.log("AutoCompleteInput: Customer selection completed");
  };

  const renderCustomerItem = ({ item }: { item: Customer }) => (
    <TouchableOpacity
      onPress={() => handleSelectCustomer(item)}
      className="border-b border-gray-100 p-4 w-full active:bg-gray-50"
      activeOpacity={0.7}
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
    <View className="w-full">
      <View className="relative">
        <TextInput
          placeholder={placeholder}
          value={currentValue}
          onChangeText={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            // Don't immediately hide on blur - let touch events complete first
            // setTimeout(() => setIsFocused(false), 200);
          }}
          className="w-full p-4 border border-gray-300 rounded-lg text-base bg-white"
          placeholderTextColor="#9CA3AF"
        />

        {currentValue.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              handleChangeText("");
              closeDropdown();
              // Clear customer data when input is cleared
              if (handleCustomerSelect) {
                // Call with empty customer to clear selection
                handleCustomerSelect({
                  id: "",
                  name: "",
                  phone: "",
                  balance: 0,
                });
              }
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 items-center justify-center"
          >
            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {data.length > 0 && (
        <View className="w-full bg-white rounded-lg shadow-lg border border-gray-200 mt-2 max-h-48 z-50">
          <FlatList
            data={data}
            renderItem={renderCustomerItem}
            keyExtractor={(item: Customer) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
    </View>
  );
}
