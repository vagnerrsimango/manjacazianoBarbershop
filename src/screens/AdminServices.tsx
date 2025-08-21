import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import MyButton from "../components/MyButton";
import Input from "../presentation/components/Input";
import CustomModal from "../components/CustomModal";

export default function AdminServices() {
  const navigation = useNavigation();
  const [services, setServices] = useState([
    { id: "1", name: "Corte de Cabelo", price: 25, category: "Cabelo" },
    { id: "2", name: "Barba", price: 15, category: "Barba" },
    { id: "3", name: "Combo Cabelo + Barba", price: 35, category: "Combo" },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");

  const handleAddService = () => {
    if (serviceName && servicePrice && serviceCategory) {
      const newService = {
        id: Date.now().toString(),
        name: serviceName,
        price: parseFloat(servicePrice),
        category: serviceCategory,
      };
      setServices([...services, newService]);
      setServiceName("");
      setServicePrice("");
      setServiceCategory("");
      setModalVisible(false);
      Alert.alert("Sucesso", "Serviço adicionado com sucesso!");
    } else {
      Alert.alert("Erro", "Preencha todos os campos");
    }
  };

  const handleDeleteService = (id: string) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este serviço?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () =>
            setServices(services.filter((service) => service.id !== id)),
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-6">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-2xl font-bold text-gray-900">
            Gerenciar Serviços
          </Text>
          <TouchableOpacity
            className="bg-primary-500 px-4 py-2 rounded-lg flex-row items-center"
            onPress={() => setModalVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Adicionar</Text>
          </TouchableOpacity>
        </View>

        <View className="space-y-4">
          {services.map((service) => (
            <View
              key={service.id}
              className="bg-white p-4 rounded-lg border border-gray-200"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900 mb-1">
                    {service.name}
                  </Text>
                  <Text className="text-sm text-gray-600 mb-2">
                    Categoria: {service.category}
                  </Text>
                  <Text className="text-xl font-bold text-primary-500">
                    ${service.price.toFixed(2)}
                  </Text>
                </View>

                <View className="flex-row space-x-2">
                  <TouchableOpacity
                    className="bg-blue-500 p-2 rounded-lg"
                    activeOpacity={0.7}
                  >
                    <Ionicons name="pencil" size={16} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-red-500 p-2 rounded-lg"
                    onPress={() => handleDeleteService(service.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <CustomModal opened={modalVisible} onClose={() => setModalVisible(false)}>
        <Text className="text-xl font-bold text-gray-900 mb-4">
          Adicionar Novo Serviço
        </Text>

        <Input
          label="Nome do Serviço"
          value={serviceName}
          onChangeText={setServiceName}
          placeholder="Digite o nome do serviço"
        />

        <Input
          label="Preço"
          value={servicePrice}
          onChangeText={setServicePrice}
          placeholder="Digite o preço"
          keyboardType="numeric"
        />

        <Input
          label="Categoria"
          value={serviceCategory}
          onChangeText={setServiceCategory}
          placeholder="Digite a categoria"
        />

        <View className="flex-row space-x-3 mt-4">
          <TouchableOpacity
            className="flex-1 bg-gray-500 py-3 rounded-lg"
            onPress={() => setModalVisible(false)}
            activeOpacity={0.7}
          >
            <Text className="text-white font-semibold text-center">
              Cancelar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-primary-500 py-3 rounded-lg"
            onPress={handleAddService}
            activeOpacity={0.7}
          >
            <Text className="text-white font-semibold text-center">
              Adicionar
            </Text>
          </TouchableOpacity>
        </View>
      </CustomModal>
    </View>
  );
}
