import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const AdminHome = () => {
  const navigation = useNavigation();

  const menuItems = [
    {
      title: "Gerenciar Clientes",
      icon: "people",
      route: "CustomerManagement",
      description: "Adicionar, editar e gerenciar clientes",
    },
    {
      title: "Gerenciar Usuários",
      icon: "person",
      route: "UserManagement",
      description: "Gerenciar usuários do sistema",
    },
    {
      title: "Relatórios",
      icon: "bar-chart",
      route: "Reports",
      description: "Visualizar relatórios de vendas",
    },
    {
      title: "Configurações",
      icon: "settings",
      route: "Settings",
      description: "Configurações do sistema",
    },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        <Text className="text-3xl font-bold text-gray-900 mb-8">
          Painel Administrativo
        </Text>

        <View className="space-y-4">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
              onPress={() => navigation.navigate(item.route as never)}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-primary-500 rounded-lg items-center justify-center mr-4">
                  <Ionicons name={item.icon as any} size={24} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900 mb-1">
                    {item.title}
                  </Text>
                  <Text className="text-gray-600">{item.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6B7280" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default AdminHome;
