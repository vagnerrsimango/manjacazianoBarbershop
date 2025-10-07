import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import GlobalNavigation from "../components/GlobalNavigation";
import MyButton from "../components/MyButton";
import {
  productService,
  IProduct,
  IProductFormData,
  ICategory,
} from "../utils/network/productService";
import Select from "../components/Select";

type RootStackParamList = {
  Home: undefined;
  Checkout: undefined;
  Clients: undefined;
  Users: undefined;
  Products: undefined;
  ServiceSelection: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function ProductManagementScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [formData, setFormData] = useState<IProductFormData>({
    name: "",
    price: "0",
    description: "",
    categoryId: undefined,
    isActive: true,
  });
  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts();
      setProducts(response.data || []);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      Alert.alert("Erro", "Falha ao carregar produtos: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await productService.getAllCategories();
      setCategories(response.data || []);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        setLoading(true);
        const response = await productService.searchProducts(searchQuery);
        setProducts(response.data || []);
      } catch (error: any) {
        console.error("Error searching products:", error);
        Alert.alert("Erro", "Falha na busca: " + error.message);
      } finally {
        setLoading(false);
      }
    } else {
      fetchProducts();
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      price: "0",
      description: "",
      categoryId: undefined,
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEditProduct = (product: IProduct) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: String(product.price ?? "0"),
      description: product.description || "",
      categoryId: product.productCategoryId ?? undefined,
      isActive: product.isActive ?? true,
    });
    setShowModal(true);
  };

  const handleDeleteProduct = (product: IProduct) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir o produto "${product.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await productService.deleteProduct(product.id);
              Alert.alert("Sucesso", "Produto excluído com sucesso!");
              fetchProducts();
            } catch (error: any) {
              Alert.alert("Erro", "Falha ao excluir produto: " + error.message);
            }
          },
        },
      ]
    );
  };

  const handleSaveProduct = async () => {
    const priceNumber = Number(formData.price);
    if (!formData.name.trim() || isNaN(priceNumber) || priceNumber <= 0) {
      Alert.alert("Erro", "Nome e preço são obrigatórios");
      return;
    }
    if (!formData.categoryId) {
      Alert.alert("Erro", "Selecione uma categoria");
      return;
    }

    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, formData);
        Alert.alert("Sucesso", "Produto atualizado com sucesso!");
      } else {
        await productService.createProduct(formData);
        Alert.alert("Sucesso", "Produto criado com sucesso!");
      }
      setShowModal(false);
      fetchProducts();
    } catch (error: any) {
      Alert.alert("Erro", "Falha ao salvar produto: " + error.message);
    }
  };

  const renderProductItem = (product: IProduct) => (
    <View
      key={product.id}
      className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800">
            {product.name}
          </Text>
          <Text className="text-gray-500 text-sm mt-1">
            {product.price.toLocaleString()} MT
          </Text>
          {product.description && (
            <Text className="text-gray-400 text-xs mt-1" numberOfLines={2}>
              {product.description}
            </Text>
          )}
          {product.category && (
            <View className="mt-2">
              <Text className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full self-start">
                {product.category}
              </Text>
            </View>
          )}
        </View>

        <View className="flex-row items-center space-x-2">
          <TouchableOpacity
            onPress={() => handleEditProduct(product)}
            className="bg-blue-500 p-2 rounded-lg"
            activeOpacity={0.7}
          >
            <Ionicons name="pencil" size={16} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDeleteProduct(product)}
            className="bg-red-500 p-2 rounded-lg"
            activeOpacity={0.7}
          >
            <Ionicons name="trash" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderProductForm = () => (
    <Modal
      visible={showModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-gray-50">
        <View className="bg-white px-6 py-4 border-b border-gray-200">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold text-gray-800">
              {editingProduct ? "Editar Produto" : "Novo Produto"}
            </Text>
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              className="p-2"
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 p-6">
          <View className="space-y-4">
            {/* Product Name */}
            <View>
              <Text className="text-gray-700 font-medium mb-2">
                Nome do Produto *
              </Text>
              <TextInput
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
                placeholder="Digite o nome do produto"
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
              />
            </View>

            {/* Price */}
            <View>
              <Text className="text-gray-700 font-medium mb-2">
                Preço (MT) *
              </Text>
              <TextInput
                value={formData.price}
                onChangeText={(text) =>
                  setFormData({ ...formData, price: text })
                }
                placeholder="0.00"
                keyboardType="numeric"
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
              />
            </View>

            {/* Description */}
            <View>
              <Text className="text-gray-700 font-medium mb-2">Descrição</Text>
              <TextInput
                value={formData.description}
                onChangeText={(text) =>
                  setFormData({ ...formData, description: text })
                }
                placeholder="Descrição do produto (opcional)"
                multiline
                numberOfLines={3}
                className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
              />
            </View>

            {/* Category */}
            <View>
              <Text className="text-gray-700 font-medium mb-2">Categoria</Text>
              <Select
                selectedValue={
                  formData.categoryId ? String(formData.categoryId) : ""
                }
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    categoryId: value ? Number(value) : undefined,
                  })
                }
                placeholder="Selecione a categoria"
                items={categories.map((c) => ({
                  label: c.name,
                  value: String(c.id),
                }))}
              />
            </View>

            {/* Active Status */}
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() =>
                  setFormData({ ...formData, isActive: !formData.isActive })
                }
                className="flex-row items-center"
              >
                <View
                  className={`w-6 h-6 rounded border-2 mr-3 items-center justify-center ${
                    formData.isActive
                      ? "bg-green-500 border-green-500"
                      : "border-gray-300"
                  }`}
                >
                  {formData.isActive && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <Text className="text-gray-700">Produto ativo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Save Button */}
        <View className="bg-white p-6 border-t border-gray-200">
          <MyButton
            title={editingProduct ? "Atualizar Produto" : "Criar Produto"}
            onPress={handleSaveProduct}
            className="bg-blue-500"
          />
        </View>
      </View>
    </Modal>
  );

  if (loading && !refreshing) {
    return (
      <View className="flex-1 bg-gray-50">
        <GlobalNavigation title="Gestão de Produtos" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-500 mt-4">Carregando produtos...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Global Navigation Bar */}
      <GlobalNavigation title="Gestão de Produtos" />

      {/* Search Bar */}
      <View className="px-6 py-4 bg-white border-b border-gray-200">
        <View className="flex-row items-center space-x-3">
          <View className="flex-1 flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar produtos..."
              className="flex-1 ml-3 text-gray-800"
              onSubmitEditing={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery("");
                  fetchProducts();
                }}
              >
                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            onPress={handleSearch}
            className="bg-blue-500 p-3 rounded-lg"
          >
            <Ionicons name="search" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Add Product Button */}
      <View className="px-6 py-4">
        <TouchableOpacity
          onPress={handleAddProduct}
          className="bg-green-500 flex-row items-center justify-center py-4 rounded-xl"
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text className="text-white text-lg font-semibold ml-2">
            Adicionar Produto
          </Text>
        </TouchableOpacity>
      </View>

      {/* Products List */}
      <ScrollView className="flex-1 px-6">
        {products.length > 0 ? (
          <View>{products.map((product) => renderProductItem(product))}</View>
        ) : (
          <View className="items-center justify-center py-12">
            <Ionicons name="cube-outline" size={64} color="#9CA3AF" />
            <Text className="text-gray-400 text-center mt-4 text-lg">
              {searchQuery
                ? "Nenhum produto encontrado"
                : "Nenhum produto cadastrado"}
            </Text>
            <Text className="text-gray-300 text-center mt-2">
              {searchQuery
                ? "Tente uma busca diferente"
                : "Adicione seu primeiro produto"}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Product Form Modal */}
      {renderProductForm()}
    </View>
  );
}
