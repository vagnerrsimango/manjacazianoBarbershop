import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Input from "../presentation/components/Input";
import MyButton from "../components/MyButton";
import useUser from "../utils/hooks/UserHook";
import api from "../utils/network/api";

export default function SideScreen() {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginWithPin } = useUser();

  // Function to fetch categories
  useEffect(() => {
    async function getCategories() {
      try {
        const response = await api.get("/category");
        console.log(response.data);
        const dataList = response.data;
        setCategories(dataList.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        Alert.alert("Erro", "Falha ao carregar categorias");
      }
    }
    getCategories();
  }, []);

  const handleEnter = async () => {
    if (!input.trim()) {
      Alert.alert("Erro", "Digite um PIN válido");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/category", {
        name: input,
      });

      if (response.data.success) {
        Alert.alert("Sucesso", "Categoria adicionada com sucesso!");
        setInput("");
        // Refresh categories list
        const categoriesResponse = await api.get("/category");
        setCategories(categoriesResponse.data.data || []);
      } else {
        Alert.alert("Erro", "Falha ao adicionar categoria");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      Alert.alert("Erro", "Falha ao adicionar categoria");
    } finally {
      setLoading(false);
    }
  };

  const renderCategoryItem = ({ item }: { item: any }) => (
    <View className="bg-white p-4 rounded-lg border border-gray-200 mb-3">
      <View className="flex-row items-center">
        <Ionicons name="pricetag" size={20} color="#0052A3" />
        <Text className="text-lg font-semibold text-gray-900 ml-3">
          {item.name}
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="flex-1 p-6">
        <View className="items-center mb-8">
          <Text className="text-3xl font-bold text-primary-500 mb-8">
            Gerenciar Categorias
          </Text>

          <View className="w-full max-w-md">
            <Input
              placeholder="Nome da categoria"
              value={input}
              onChangeText={setInput}
              label="Nova Categoria"
            />

            <TouchableOpacity
              className={`bg-primary-500 py-3 px-6 rounded-lg mt-4 ${
                loading ? "opacity-50" : ""
              }`}
              onPress={handleEnter}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Text className="text-white font-semibold text-center">
                {loading ? "Adicionando..." : "Adicionar Categoria"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-900 mb-4">
            Categorias Existentes
          </Text>

          {categories.length > 0 ? (
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={(item, index) =>
                item.id?.toString() || index.toString()
              }
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View className="bg-white p-8 rounded-lg border border-gray-200 items-center">
              <Ionicons name="folder-open" size={48} color="#9CA3AF" />
              <Text className="text-gray-500 text-center mt-4">
                Nenhuma categoria encontrada
              </Text>
              <Text className="text-gray-400 text-center mt-2">
                Adicione uma categoria para começar
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
