import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Header from "../components/Header";
import NetworkTest from "../components/NetworkTest";

type RootStackParamList = {
  Clients: undefined;
  Users: undefined;
  Home: undefined;
  Checkout: undefined;
  Debts: undefined;
  ClientDebts: undefined;
  Search: undefined;
};

export default function HomeScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const menuItems = [
    {
      title: "Gestão de Clientes",
      description: "Gerenciar clientes e dívidas",
      icon: "people-outline",
      color: "bg-blue-500",
      route: "Clients" as keyof RootStackParamList,
    },
    {
      title: "Gestão de Usuários",
      description: "Gerenciar usuários do sistema",
      icon: "person-outline",
      color: "bg-green-500",
      route: "Users" as keyof RootStackParamList,
    },
    {
      title: "Checkout",
      description: "Processar pagamentos",
      icon: "card-outline",
      color: "bg-purple-500",
      route: "Checkout" as keyof RootStackParamList,
    },
    {
      title: "Pesquisar",
      description: "Buscar clientes e serviços",
      icon: "search-outline",
      color: "bg-orange-500",
      route: "Search" as keyof RootStackParamList,
    },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <Header title="Manja Caziano Barbershop" />

      <ScrollView className="flex-1 p-4">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo!
          </Text>
          <Text className="text-lg text-gray-600">
            Escolha uma opção para começar
          </Text>
        </View>

        <View className="space-y-4">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate(item.route)}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 active:bg-gray-50"
            >
              <View className="flex-row items-center space-x-4">
                <View className={`${item.color} p-3 rounded-lg`}>
                  <Ionicons name={item.icon as any} size={24} color="white" />
                </View>

                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900 mb-1">
                    {item.title}
                  </Text>
                  <Text className="text-gray-600">{item.description}</Text>
                </View>

                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mt-8 p-6 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl">
          <Text className="text-white text-lg font-semibold mb-2">
            Sistema de Gestão
          </Text>
          <Text className="text-primary-100">
            Gerencie seus clientes, usuários e transações de forma eficiente
          </Text>
        </View>

        {/* Network Test Component for Debugging */}
        <NetworkTest />
      </ScrollView>
    </View>
  );
}
