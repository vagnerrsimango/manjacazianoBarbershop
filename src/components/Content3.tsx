import React from "react";
import { View, Text, ScrollView, Image } from "react-native";

const Content3 = () => {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        <Text className="text-2xl font-bold text-gray-900 mb-6">
          Galeria de Imagens
        </Text>

        <View className="space-y-6">
          <View className="bg-white p-6 rounded-lg shadow-sm">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Nossos Trabalhos
            </Text>
            <View className="flex-row space-x-3">
              <View className="w-24 h-24 bg-gray-200 rounded-lg items-center justify-center">
                <Text className="text-gray-500 text-xs">Imagem 1</Text>
              </View>
              <View className="w-24 h-24 bg-gray-200 rounded-lg items-center justify-center">
                <Text className="text-gray-500 text-xs">Imagem 2</Text>
              </View>
              <View className="w-24 h-24 bg-gray-200 rounded-lg items-center justify-center">
                <Text className="text-gray-500 text-xs">Imagem 3</Text>
              </View>
            </View>
          </View>

          <View className="bg-white p-6 rounded-lg shadow-sm">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Ambiente da Barbearia
            </Text>
            <View className="space-y-3">
              <View className="w-full h-32 bg-gray-200 rounded-lg items-center justify-center">
                <Text className="text-gray-500">Foto do Ambiente</Text>
              </View>
              <View className="w-full h-32 bg-gray-200 rounded-lg items-center justify-center">
                <Text className="text-gray-500">Foto das Cadeiras</Text>
              </View>
            </View>
          </View>

          <View className="bg-white p-6 rounded-lg shadow-sm">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Equipamentos
            </Text>
            <View className="flex-row space-x-3">
              <View className="w-20 h-20 bg-gray-200 rounded-lg items-center justify-center">
                <Text className="text-gray-500 text-xs">Tesoura</Text>
              </View>
              <View className="w-20 h-20 bg-gray-200 rounded-lg items-center justify-center">
                <Text className="text-gray-500 text-xs">Máquina</Text>
              </View>
              <View className="w-20 h-20 bg-gray-200 rounded-lg items-center justify-center">
                <Text className="text-gray-500 text-xs">Pente</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Content3;
