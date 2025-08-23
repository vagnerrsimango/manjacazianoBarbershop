import React from "react";
import { View, Text, ScrollView } from "react-native";

const Content2 = () => {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        <Text className="text-2xl font-bold text-gray-900 mb-6">
          Serviços Disponíveis
        </Text>

        <View className="space-y-4">
          <View className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-primary-500">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              Corte de Cabelo
            </Text>
            <Text className="text-gray-600 mb-3">
              Corte profissional com acabamento perfeito.
            </Text>
            <Text className="text-primary-500 font-semibold">$25.00</Text>
          </View>

          <View className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              Barba
            </Text>
            <Text className="text-gray-600 mb-3">
              Modelagem e aparamento de barba.
            </Text>
            <Text className="text-green-500 font-semibold">$15.00</Text>
          </View>

          <View className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              Combo Cabelo + Barba
            </Text>
            <Text className="text-gray-600 mb-3">
              Pacote completo com desconto especial.
            </Text>
            <Text className="text-purple-500 font-semibold">$35.00</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Content2;
