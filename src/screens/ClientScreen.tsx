import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import ClientList from "../components/ClientList";
import Input from "../components/Input";
import { Button } from "../presentation/components/Button";

import CustomModal from "../components/CustomModal";
import { useCustomerService } from "../utils/hooks/useCustomerService";
import { Customer } from "../@types/api";

export default function ClientScreen() {
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [paymentAmount, setPaymentAmount] = useState("");

  const { customers, loading, error, getAllCustomers, payDebt, clearError } =
    useCustomerService();

  const handlePaySuccess = async () => {
    if (!selectedCustomer || !paymentAmount) return;

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) return;

    const success = await payDebt({
      clientId: selectedCustomer.id,
      amount,
      description: `Pagamento de dívida: ${paymentAmount}`,
      paymentMethodId: 1, // Default payment method
      userId: 1, // Current user ID
    });

    if (success) {
      setShowModal2(true);
      setShowModal(false);
      setPaymentAmount("");
      setSelectedCustomer(null);
    }
  };

  useEffect(() => {
    getAllCustomers();
  }, []);

  return (
    <View className="flex-1 bg-primary-100">
      <Header title="Dívidas" back />

      <View className="items-center mt-8 justify-center">
        <View className="bg-primary-300 p-3 w-[20%] items-center justify-center rounded-lg">
          <Text className="font-bold text-xl text-white">
            Lista de Clientes
          </Text>
        </View>

        <View className="w-[60%] mt-8 mb-8 justify-center items-center">
          <View className="border-b border-primary-300 px-4 py-2">
            {loading ? (
              <Text className="text-center text-gray-500">
                Carregando clientes...
              </Text>
            ) : error ? (
              <View className="items-center p-4">
                <Text className="text-red-500 text-center mb-2">{error}</Text>
                <Button
                  title="Tentar novamente"
                  onPress={getAllCustomers}
                  variant="primary"
                />
              </View>
            ) : customers.length > 0 ? (
              <FlatList
                data={customers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <ClientList
                    customer={item}
                    onPress={() => {
                      setSelectedCustomer(item);
                      setShowModal(true);
                    }}
                  />
                )}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View className="items-center p-8">
                <Ionicons name="people-outline" size={48} color="#9CA3AF" />
                <Text className="text-gray-500 mt-2 text-center">
                  Nenhum cliente encontrado
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
              <Text
                className={`font-bold ${
                  (selectedCustomer?.balance ?? 0) < 0
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {typeof selectedCustomer?.balance === "number"
                  ? selectedCustomer.balance.toFixed(2)
                  : "0.00"}{" "}
                MT
              </Text>
            </Text>

            <Input
              label="Valor do pagamento"
              placeholder="Digite o valor"
              value={paymentAmount}
              onChangeText={setPaymentAmount}
              keyboardType="numeric"
            />

            <View className="mt-6 space-y-3">
              <Button
                title="Processar Pagamento"
                onPress={handlePaySuccess}
                variant="success"
                disabled={!paymentAmount}
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
