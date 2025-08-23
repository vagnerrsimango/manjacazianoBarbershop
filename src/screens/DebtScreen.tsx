import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import api from "../utils/network/api";
import ClientList from "../components/ClientList";
import Input from "../components/Input";

import { useNavigation } from "@react-navigation/native";
import { Button } from "../presentation/components/Button";

export default function DebtScreen() {
  const [clients, setClients] = useState<any[]>([]);
  const [valueToPay, setValueToPay] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

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
        // Refresh the clients list
        getClients();
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

  const getClients = async () => {
    try {
      const response = await api.get("/clients/debt");
      console.log(
        "🚀 ~ file: DebtScreen.tsx:32 ~ getClients ~ response:",
        response.data
      );
      setClients(response.data.clients || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
      Alert.alert("Erro", "Falha ao carregar clientes");
    }
  };

  useEffect(() => {
    getClients();
  }, []);

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
      <Header title="Dívidas" back />

      <View className="items-center mt-[10%] justify-center">
        <View className="bg-red-500 p-3 w-[50%] items-center justify-center rounded-lg">
          <Text className="font-bold text-xl text-white">
            Lista de Clientes com Dívida
          </Text>
        </View>

        <View className="w-[60%] mt-8 mb-8 justify-center items-center">
          <TouchableOpacity
            className="self-end mr-[10%] mb-4"
            onPress={() => navigation.navigate("Search" as never)}
          >
            <Ionicons name="search" size={32} color="#374151" />
          </TouchableOpacity>

          <View className="border-b border-primary-300 px-4 py-2">
            {clients.length > 0 ? (
              <FlatList
                data={clients}
                renderItem={renderClientItem}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View className="items-center p-8">
                <Ionicons name="receipt-outline" size={48} color="#9CA3AF" />
                <Text className="text-gray-500 mt-2 text-center">
                  Nenhum cliente com dívida encontrado
                </Text>
              </View>
            )}
          </View>
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
