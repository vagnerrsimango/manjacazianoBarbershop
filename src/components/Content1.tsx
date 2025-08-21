import React from "react";
import { View, Text, ScrollView } from "react-native";

const Content1 = () => {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        <Text className="text-2xl font-bold text-gray-900 mb-6">
          Conteúdo Principal
        </Text>

        <View className="space-y-4">
          <View className="bg-white p-6 rounded-lg shadow-sm">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              Seção 1
            </Text>
            <Text className="text-gray-600">
              Este é o conteúdo da primeira seção com NativeWind styling.
            </Text>
          </View>

          <View className="bg-white p-6 rounded-lg shadow-sm">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              Seção 2
            </Text>
            <Text className="text-gray-600">
              Esta é a segunda seção demonstrando o layout responsivo.
            </Text>
          </View>

          <View className="bg-white p-6 rounded-lg shadow-sm">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              Seção 3
            </Text>
            <Text className="text-gray-600">
              Terceira seção com estilos consistentes usando Tailwind CSS.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Content1;
