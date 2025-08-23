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
    console.log("=== CUSTOMER SELECTION DEBUG ===");
    console.log("Customer selected:", customer);
    console.log("Customer name:", customer.name);
    console.log("Customer phone:", customer.phone);

    // Check if this is an empty customer (clearing selection)
    if (!customer.name || customer.name === "") {
      console.log("Clearing customer selection");
      setInput("");
      setInputs((prev) => ({
        ...prev,
        client_name: "",
        client_phone: "",
      }));
      return;
    }

    // Update both input and inputs states
    setInput(customer.name);
    setInputs((prev) => ({
      ...prev,
      client_name: customer.name,
      client_phone: customer.phone.toString(),
    }));

    // Log the updated states to verify
    console.log("Updated input state:", customer.name);
    console.log("Updated inputs state:", {
      client_name: customer.name,
      client_phone: customer.phone.toString(),
    });
  };

  useEffect(() => {
    let auxTotal = 0;
    if (services.length > 0) {
      auxTotal = services.reduce((sum, service) => {
        return sum + Number(service.price || 0);
      }, 0);
      setTotal(auxTotal);
      setInputs((prev) => ({ ...prev, paid: auxTotal.toString() }));
    }
    console.log(
      "🚀 ~ file: CheckoutScreen.tsx:29 ~ useEffect ~ auxTotal:",
      auxTotal
    );
  }, [services]);

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
    console.log("=== SALE VALIDATION ===");
    console.log("input=>", input);
    console.log("inputs=>", inputs);
    console.log("total=>", total);
    console.log("services=>", services);

    // Check if amount paid is valid
    if (Number(inputs.paid) < Number(total) && !inputs.isChecked) {
      Alert.alert(
        "Erro",
        "Cliente deve pagar o valor total ou marcar como dívida"
      );
      return;
    }

    if (total == 0 || !inputs.paid) {
      Alert.alert(
        "Erro",
        "Selecione os serviços e inclua o valor pago pelo cliente"
      );
      return;
    }

    // Prepare soldList like the old implementation
    let postList: any = [];
    services.forEach((service) => {
      postList.push({
        product_id: Number(service.id),
        price: Number(service.price),
      });
    });

    // Prepare sale payload based on old working implementation
    const salePayload = {
      client_name: input, // Use input state like old implementation
      client_phone: inputs.client_phone,
      isChecked: inputs.isChecked,
      paid: inputs.paid,
      soldList: postList,
    };

    console.log("=== SALE PAYLOAD ===");
    console.log("salePayload=>", salePayload);

    isLoading(true);
    try {
      const response = await api.post("/sale", salePayload);

      console.log("=== API RESPONSE ===");
      console.log("response=>", response.data);

      if (response.data.success) {
        setShowModal(true);
        setServices([]);
        setInputs(inputsInitalState);
        setInput("");
      } else {
        Alert.alert("Erro", "Falha ao efectuar a venda!");
      }
    } catch (error) {
      console.error("Error creating sale:", error);
      Alert.alert("Erro", "Falha ao efectuar a venda!");
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
          <Text className="text-gray-600 text-sm">
            {item.description || "Serviço"}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-xl font-bold text-primary-600">
            {item.price ? Number(item.price).toFixed(2) : "0.00"} MT
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
            Seleção de Cliente (Opcional)
          </Text>

          {/* Debug Info */}
          <View className="mb-2 p-2 bg-yellow-50 rounded border border-yellow-200">
            <Text className="text-xs text-yellow-800">
              Debug - input: "{input}" | client_name: "{inputs.client_name}" |
              client_phone: "{inputs.client_phone}"
            </Text>
          </View>

          <AutoCompleteInput
            placeholder="Pesquisar cliente..."
            handleSelectedAutoCustomer={handleSelectedAutoCustomer}
            input={input}
            setInput={setInput}
          />

          {inputs.client_name ? (
            <View className="mt-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <View className="flex-row items-center mb-2">
                <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
                <Text className="text-green-800 font-semibold ml-2 text-base">
                  Cliente Selecionado
                </Text>
              </View>
              <Text className="text-green-800 font-medium text-lg">
                {inputs.client_name}
              </Text>
              <Text className="text-green-600 text-sm mt-1">
                📱 Telefone: {inputs.client_phone}
              </Text>

              {/* Customer Actions */}
              <View className="flex-row mt-3 space-x-2">
                <TouchableOpacity
                  onPress={() => {
                    setInputs(inputsInitalState);
                    setInput("");
                  }}
                  className="bg-red-100 px-3 py-2 rounded-lg border border-red-200"
                >
                  <Text className="text-red-700 text-sm font-medium">
                    Remover Cliente
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <View className="flex-row items-center mb-2">
                <Ionicons name="information-circle" size={20} color="#6B7280" />
                <Text className="text-gray-600 font-medium ml-2 text-base">
                  Venda sem Cliente
                </Text>
              </View>
              <Text className="text-gray-600 text-sm">
                Esta venda será processada sem associar a um cliente específico.
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
              keyExtractor={(item: any) =>
                item.id?.toString() || Math.random().toString()
              }
              scrollEnabled={false}
            />
          ) : (
            <Text className="text-gray-500 text-center py-4">
              Nenhum serviço selecionado
            </Text>
          )}
        </View>

        {/* Payment Information */}
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
            title={loading ? "Processando..." : "Finalizar Venda"}
            onPress={showSucess}
            variant="primary"
            loading={loading}
            disabled={loading || services.length === 0}
            size="lg"
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
            onPress={() => {
              setShowModal(false);
              // Logout user and return to login screen
              setUser(null);
            }}
            variant="primary"
            size="lg"
          />
        </View>
      </Modal>
    </View>
  );
}
