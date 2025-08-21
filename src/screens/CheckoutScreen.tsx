import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Header from "../components/Header";
import Input from "../components/Input";
import { useCart } from "../utils/LocalHooks";
import { FlatList } from "react-native";
import Tag from "../components/Tag";
import useUser from "../utils/hooks/UserHook";
import api from "../utils/network/api";
import AutoCompleteInput from "../components/AutoCompletInput";
import { Button } from "../presentation/components/Button";

export default function CheckoutScreen() {
  const inputsInitalState = {
    client_name: "",
    client_phone: "",
    isChecked: false,
    paid: "",
  };
  const [showModal, setShowModal] = useState(false);
  const [loading, isLoading] = useState(false);
  const [inputs, setInputs] = useState(inputsInitalState);
  const [input, setInput] = useState<string>();
  const { services } = useCart();
  const [total, setTotal] = useState(0);
  const { setUser } = useUser();
  const { setServices } = useCart();

  const handleSelectedAutoCustomer = (customer: any) => {
    setInputs((prev) => ({
      ...prev,
      client_name: customer.name,
      client_phone: customer.phone.toString(),
    }));

    setInput(customer.name);
  };

  useEffect(() => {
    let auxTotal = 0;
    if (services.length > 0) {
      auxTotal = services.reduce((prev, current) => {
        auxTotal += Number(current.price);
        return auxTotal;
      }, 0);
      setTotal(auxTotal);
      setInputs((prev) => ({ ...prev, paid: auxTotal.toString() }));
    }
    console.log(
      "🚀 ~ file: CheckoutScreen.tsx:29 ~ useEffect ~ auxTotal:",
      auxTotal
    );
  }, []);

  const handleInputChange = (value: string, input: string) => {
    switch (input) {
      case "paid":
        if (Number(value) > total) {
          Alert.alert("Erro", "Valor acima do preço do corte");
          return;
        }
    }

    setInputs((prev) => ({ ...prev, [input]: value }));
  };

  const showSucess = async () => {
    console.log("input=>", input);
    if (
      Number(total) > Number(inputs.paid) &&
      !inputs.isChecked &&
      inputs.client_phone.length == 0 &&
      inputs.client_phone.length == 0
    ) {
      Alert.alert("Erro", "Por favor preencha os campos");
      return;
    }

    if (Number(inputs.paid) < Number(total) && !inputs.isChecked) {
      Alert.alert(
        "Erro",
        "Cliente deve pagar o valor total ou marcar como dívida"
      );
      return;
    }

    isLoading(true);
    try {
      const response = await api.post("/sales", {
        client_name: inputs.client_name,
        client_phone: inputs.client_phone,
        total: total,
        paid: Number(inputs.paid),
        is_debt: inputs.isChecked,
        services: services.map((service) => service.id),
      });

      if (response.data.success) {
        setShowModal(true);
        setServices([]);
        setInputs(inputsInitalState);
        setInput("");
      }
    } catch (error) {
      console.error("Error creating sale:", error);
      Alert.alert("Erro", "Falha ao processar venda");
    } finally {
      isLoading(false);
    }
  };

  const renderServiceItem = ({ item }: { item: any }) => (
    <View className="bg-white p-4 mb-3 rounded-lg shadow-sm border border-gray-200">
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900 mb-1">
            {item.name}
          </Text>
          <Text className="text-gray-600 text-sm">{item.description}</Text>
        </View>
        <View className="items-end">
          <Text className="text-xl font-bold text-primary-600">
            {item.price.toFixed(2)} MT
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <Header title="Checkout" back />

      <ScrollView className="flex-1 p-4">
        {/* Customer Selection */}
        <View className="bg-white p-4 rounded-lg mb-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Seleção de Cliente
          </Text>

          <AutoCompleteInput
            placeholder="Pesquisar cliente..."
            onSelect={handleSelectedAutoCustomer}
            value={input}
            onChangeText={setInput}
          />

          {inputs.client_name && (
            <View className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Text className="text-blue-800 font-medium">
                Cliente selecionado: {inputs.client_name}
              </Text>
              <Text className="text-blue-600 text-sm">
                Telefone: {inputs.client_phone}
              </Text>
            </View>
          )}
        </View>

        {/* Services List */}
        <View className="bg-white p-4 rounded-lg mb-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Serviços Selecionados ({services.length})
          </Text>

          {services.length > 0 ? (
            <FlatList
              data={services}
              renderItem={renderServiceItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          ) : (
            <View className="items-center p-6">
              <Ionicons name="cut-outline" size={48} color="#9CA3AF" />
              <Text className="text-gray-500 mt-2 text-center">
                Nenhum serviço selecionado
              </Text>
            </View>
          )}
        </View>

        {/* Payment Section */}
        <View className="bg-white p-4 rounded-lg mb-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Informações de Pagamento
          </Text>

          <View className="space-y-4">
            <View className="flex-row justify-between items-center p-3 bg-gray-50 rounded-lg">
              <Text className="text-lg font-semibold text-gray-700">
                Total dos Serviços:
              </Text>
              <Text className="text-2xl font-bold text-primary-600">
                {total.toFixed(2)} MT
              </Text>
            </View>

            <Input
              label="Valor Pago"
              placeholder="Digite o valor pago"
              value={inputs.paid}
              onChangeText={(text) => handleInputChange(text, "paid")}
              keyboardType="numeric"
            />

            <View className="flex-row items-center space-x-3">
              <TouchableOpacity
                onPress={() =>
                  setInputs((prev) => ({ ...prev, isChecked: !prev.isChecked }))
                }
                className={`w-6 h-6 rounded border-2 items-center justify-center ${
                  inputs.isChecked
                    ? "bg-primary-500 border-primary-500"
                    : "border-gray-300"
                }`}
              >
                {inputs.isChecked && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </TouchableOpacity>
              <Text className="text-gray-700">
                Marcar como dívida (cliente pagará depois)
              </Text>
            </View>

            {Number(inputs.paid) < total && !inputs.isChecked && (
              <View className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <Text className="text-yellow-800 text-sm">
                  ⚠️ Valor pendente: {(total - Number(inputs.paid)).toFixed(2)}{" "}
                  MT
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View className="space-y-3 mb-6">
          <Button
            title={isLoading ? "Processando..." : "Finalizar Venda"}
            onPress={showSucess}
            variant="primary"
            loading={isLoading}
            disabled={isLoading || services.length === 0}
            size="lg"
          />

          <Button
            title="Limpar Carrinho"
            onPress={() => setServices([])}
            variant="ghost"
            disabled={services.length === 0}
          />
        </View>
      </ScrollView>

      {/* Success Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className="flex-1 bg-white justify-center items-center p-6">
          <View className="bg-green-100 p-6 rounded-full mb-6">
            <Ionicons name="checkmark-circle" size={64} color="#16A34A" />
          </View>

          <Text className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Venda Processada!
          </Text>

          <Text className="text-gray-600 text-center mb-8">
            A venda foi processada com sucesso. O cliente foi notificado.
          </Text>

          <Button
            title="Fechar"
            onPress={() => setShowModal(false)}
            variant="primary"
            size="lg"
          />
        </View>
      </Modal>
    </View>
  );
}
