import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../utils/LocalHooks";
import GlobalNavigation from "../components/GlobalNavigation";
import api from "../utils/network/api";
import { Button } from "../presentation/components/Button";
import Input from "../components/Input";
import useUser from "../utils/hooks/UserHook";
import AutoCompleteInput from "../components/AutoCompletInput";

export default function CheckoutScreen() {
  const { services, setServices } = useCart();
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [footerHeight, setFooterHeight] = useState(0);

  const { setUser } = useUser();

  const inputsInitalState = {
    client_name: "",
    client_phone: "",
    isChecked: false,
    paid: "",
  };
  const [showModal, setShowModal] = useState(false);
  const [inputs, setInputs] = useState(inputsInitalState);
  const [input, setInput] = useState<string>();
  const hasSelectedCustomer = Boolean(inputs.client_name);
  const pendingAmount = Math.max(0, total - Number(inputs.paid || 0));

  useEffect(() => {
    let auxTotal = 0;
    if (services.length > 0) {
      auxTotal = services.reduce((sum, service) => {
        return sum + Number(service.price || 0);
      }, 0);
      setTotal(auxTotal);
      setInputs((prev) => ({ ...prev, paid: auxTotal.toString() }));
    } else {
      setTotal(0);
    }
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

  const handleSelectedAutoCustomer = (customer: any) => {
    if (!customer.name || customer.name === "") {
      setInput("");
      setInputs((prev) => ({
        ...prev,
        client_name: "",
        client_phone: "",
      }));
      return;
    }

    setInput(customer.name);
    setInputs((prev) => ({
      ...prev,
      client_name: customer.name,
      client_phone: customer.phone.toString(),
    }));
  };

  const showSucess = async () => {
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

    let postList: any = [];
    services.forEach((service) => {
      postList.push({
        product_id: Number(service.id),
        price: Number(service.price),
      });
    });

    const salePayload = {
      client_name: input,
      client_phone: inputs.client_phone,
      isChecked: inputs.isChecked,
      paid: inputs.paid,
      soldList: postList,
    };

    setLoading(true);
    try {
      const response = await api.post("/sale", salePayload);

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
      setLoading(false);
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
      <GlobalNavigation title="Checkout" showBack={true} />

      <ScrollView
        className="flex-1 p-4"
        contentContainerStyle={{ paddingBottom: footerHeight + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white p-4 rounded-2xl mb-4 shadow-sm border border-gray-100">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-lg font-bold text-gray-900">
                Resumo da Venda
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                Confirme os serviços e o pagamento antes de finalizar.
              </Text>
            </View>
            <View className="bg-yellow-50 border border-yellow-200 px-3 py-2 rounded-xl">
              <Text className="text-xs text-yellow-800 font-medium">Total</Text>
              <Text className="text-lg font-bold text-yellow-900">
                {total.toFixed(2)} MT
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-white p-4 rounded-2xl mb-4 shadow-sm border border-gray-100">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Seleção de Cliente (Opcional)
          </Text>
          <Text className="text-sm text-gray-500 mb-4">
            Associe esta venda a um cliente ou prossiga sem identificação.
          </Text>

          <AutoCompleteInput
            placeholder="Pesquisar cliente..."
            handleSelectedAutoCustomer={handleSelectedAutoCustomer}
            input={input}
            setInput={setInput}
          />

          {hasSelectedCustomer ? (
            <View className="mt-3 p-4 bg-green-50 rounded-xl border border-green-200">
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
                    setInputs((prev) => ({
                      ...prev,
                      client_name: "",
                      client_phone: "",
                    }));
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
          ) : null}
        </View>

        <View className="bg-white p-4 rounded-2xl mb-4 shadow-sm border border-gray-100">
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

        <View className="bg-white p-4 rounded-2xl mb-4 shadow-sm border border-gray-100">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Informações de Pagamento
          </Text>

          <View className="space-y-4">
            <View className="flex-row justify-between items-center p-4 bg-gray-50 rounded-xl">
              <Text className="text-base font-semibold text-gray-700">
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

            <TouchableOpacity
              onPress={() =>
                setInputs((prev) => ({ ...prev, paid: total.toFixed(2) }))
              }
              className="self-start bg-gray-100 px-4 py-2 rounded-full border border-gray-200"
            >
              <Text className="text-gray-700 text-sm font-medium">
                Preencher com total
              </Text>
            </TouchableOpacity>

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

            {pendingAmount > 0 && !inputs.isChecked && (
              <View className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="warning-outline" size={18} color="#92400E" />
                  <Text className="text-yellow-800 text-sm font-semibold ml-2">
                    Pagamento incompleto
                  </Text>
                </View>
                <Text className="text-yellow-900 text-base font-bold">
                  Faltam {pendingAmount.toFixed(2)} MT
                </Text>
                <Text className="text-yellow-800 text-sm mt-1">
                  Para continuar, pague o total ou marque a venda como dívida.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View
        onLayout={(event) => setFooterHeight(event.nativeEvent.layout.height)}
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 pt-3 pb-6 shadow-lg"
      >
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-sm text-gray-500">A pagar</Text>
            <Text className="text-2xl font-bold text-gray-900">
              {total.toFixed(2)} MT
            </Text>
          </View>
          {pendingAmount > 0 && !inputs.isChecked ? (
            <View className="bg-yellow-50 border border-yellow-200 px-3 py-2 rounded-xl">
              <Text className="text-xs text-yellow-800 font-medium">
                Pendente
              </Text>
              <Text className="text-sm font-bold text-yellow-900">
                {pendingAmount.toFixed(2)} MT
              </Text>
            </View>
          ) : (
            <View className="bg-green-50 border border-green-200 px-3 py-2 rounded-xl">
              <Text className="text-xs text-green-800 font-medium">
                Estado
              </Text>
              <Text className="text-sm font-bold text-green-900">
                {inputs.isChecked ? "Dívida" : "Pronto"}
              </Text>
            </View>
          )}
        </View>

        <Button
          title={loading ? "Processando..." : "Finalizar Venda"}
          onPress={showSucess}
          variant="primary"
          loading={loading}
          disabled={loading || services.length === 0}
          size="lg"
        />
      </View>

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
