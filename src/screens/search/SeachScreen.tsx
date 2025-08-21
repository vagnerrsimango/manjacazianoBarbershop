import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Input from "../../components/Input";

import ClientList from "../../components/ClientList";
import ClientSkeleton from "../../components/ClientSkeleton";
import api from "../../utils/network/api";
import { Button } from "../../presentation/components/Button";

export default function SearchScreen() {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>({});
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation();
  const [valueToPay, setValueToPay] = useState("");
  const [showModal2, setShowModal2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  const handlePaySuccess = async () => {
    if (!valueToPay || !selectedCustomer.id) {
      Alert.alert("Erro", "Por favor, preencha o valor a pagar");
      return;
    }

    setLoading(true);
    try {
      const response = await api.put("/clients/put", {
        id: Number(selectedCustomer.id),
        balance: Number(valueToPay),
      });

      if (response.data.success) {
        setShowModal2(true);
        setShowModal(false);
        setValueToPay("");
        setSelectedCustomer({});
      } else {
        Alert.alert("Erro", "Falha ao processar pagamento");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      Alert.alert("Erro", "Falha ao processar pagamento");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!input.trim()) {
      Alert.alert("Erro", "Por favor, digite algo para pesquisar");
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/client/search/${input}`);
      setClients(response.data.clients || []);
    } catch (error) {
      console.error("Error searching clients:", error);
      Alert.alert("Erro", "Falha ao pesquisar cliente");
    } finally {
      setLoading(false);
    }
  };

  const renderClientItem = ({ item }: { item: any }) => (
    <ClientList
      customer={item}
      showDate={false}
      onPress={() => {
        setSelectedCustomer(item);
        setShowModal(true);
      }}
    />
  );

  return (
    <View className="flex-1 bg-primary-100">
      {/* Header with Search */}
      <View className="bg-primary-100 p-6 w-full flex-row items-center justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={40} color="#4DA6FF" />
        </TouchableOpacity>

        <Input
          placeholder="Pesquisar cliente"
          value={input}
          onChangeText={setInput}
          style={{ width: "50%", textAlign: "center" }}
        />

        <Button
          title="Pesquisar"
          onPress={handleSearch}
          variant="primary"
          loading={loading}
          disabled={loading}
        />
      </View>

      {/* Search Results */}
      <View className="items-center mt-[10%] justify-center">
        <View className="w-[60%] mt-8 mb-8 justify-center items-center">
          {loading ? (
            <View className="items-center p-8">
              <ActivityIndicator size="large" color="#0052A3" />
              <Text className="text-gray-500 mt-2">Pesquisando...</Text>
            </View>
          ) : clients.length > 0 ? (
            <FlatList
              data={clients}
              renderItem={renderClientItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
            />
          ) : input ? (
            <View className="items-center p-8">
              <Ionicons name="search-outline" size={48} color="#9CA3AF" />
              <Text className="text-gray-500 mt-2 text-center">
                Nenhum cliente encontrado para "{input}"
              </Text>
            </View>
          ) : (
            <View className="items-center p-8">
              <Ionicons name="search-outline" size={48} color="#9CA3AF" />
              <Text className="text-gray-500 mt-2 text-center">
                Digite algo para pesquisar clientes
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Payment Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className="flex-1 bg-white">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-xl font-bold">Processar Pagamento</Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4">
            <Text className="text-gray-600 mb-4">
              Cliente:{" "}
              <Text className="font-bold">{selectedCustomer?.name}</Text>
            </Text>

            <Text className="text-gray-600 mb-4">
              Saldo atual:{" "}
              <Text className="font-bold text-red-500">
                {typeof selectedCustomer?.balance === "number"
                  ? selectedCustomer.balance.toFixed(2)
                  : "0.00"}{" "}
                MT
              </Text>
            </Text>

            <Input
              label="Valor a pagar"
              placeholder="Digite o valor"
              value={valueToPay}
              onChangeText={setValueToPay}
              keyboardType="numeric"
            />

            <View className="mt-6 space-y-3">
              <Button
                title={loading ? "Processando..." : "Processar Pagamento"}
                onPress={handlePaySuccess}
                variant="success"
                loading={loading}
                disabled={loading || !valueToPay}
              />

              <Button
                title="Cancelar"
                onPress={() => setShowModal(false)}
                variant="ghost"
              />
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showModal2}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className="flex-1 bg-white justify-center items-center p-6">
          <View className="bg-green-100 p-6 rounded-full mb-6">
            <Ionicons name="checkmark-circle" size={64} color="#16A34A" />
          </View>

          <Text className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Pagamento Processado!
          </Text>

          <Text className="text-gray-600 text-center mb-8">
            O pagamento foi processado com sucesso. O cliente foi notificado.
          </Text>

          <Button
            title="Fechar"
            onPress={() => setShowModal2(false)}
            variant="primary"
            size="lg"
          />
        </View>
      </Modal>
    </View>
  );
}
