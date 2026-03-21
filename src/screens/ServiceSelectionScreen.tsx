import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useCart } from "../utils/LocalHooks";
import GlobalNavigation from "../components/GlobalNavigation";
import { BeardLogo, ComboLogo, ExtraLogo, HairLogo } from "../utils/Icons";
import api from "../utils/network/api";
import { IServiceResponse } from "../utils/Responses";
import ServiceSkeleton from "../components/ServiceSkeleton";

type RootStackParamList = {
  Home: undefined;
  Checkout: undefined;
  Clients: undefined;
  Users: undefined;
  Products: undefined;
  ServiceSelection: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface IService {
  id: number;
  name: string;
  price: number;
  product_categories: Array<{
    name: string;
  }>;
}

export default function ServiceSelectionScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { setServices } = useCart();
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dataService, setDataService] = useState<IServiceResponse>(
    {} as IServiceResponse
  );
  const [selectedServices, setSelectedServices] = useState<IService[]>([]);
  const [slideAnim] = useState(new Animated.Value(-100));
  const [summaryHeight, setSummaryHeight] = useState(0);

  useEffect(() => {
    async function getDataService() {
      try {
        const response = await api.get("/services");
        const data: IServiceResponse = response.data;
        setDataService(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching services:", error);
        setLoading(false);
      }
    }

    getDataService();
  }, []);

  useEffect(() => {
    if (selectedServices.length > 0) {
      const calculatedTotal = selectedServices.reduce((sum, service) => {
        return sum + Number(service.price || 0);
      }, 0);
      setTotal(calculatedTotal);
    } else {
      setTotal(0);
    }
  }, [selectedServices]);

  useEffect(() => {
    if (!selectedServices.length) {
      slideAnim.setValue(-100);
      return;
    }

    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, [selectedServices.length, slideAnim]);

  const toggleService = (service: IService) => {
    const isSelected = selectedServices.find((s) => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const isServiceSelected = (service: IService) => {
    return selectedServices.find((s) => s.id === service.id) !== undefined;
  };

  const goToCheckout = () => {
    if (selectedServices.length > 0) {
      setServices(selectedServices);
      navigation.navigate("Checkout");
    }
  };

  const renderServiceItem = (service: IService) => {
    const isSelected = isServiceSelected(service);
    return (
      <TouchableOpacity
        key={service.id}
        className={`flex-row items-center p-4 rounded-xl border-2 mb-3 shadow-sm ${
          isSelected
            ? "bg-yellow-50 border-yellow-300"
            : "bg-white border-gray-100"
        }`}
        onPress={() => toggleService(service)}
        activeOpacity={0.7}
      >
        <View className="flex-1">
          <Text
            className={`text-lg font-semibold ${
              isSelected ? "text-yellow-800" : "text-gray-800"
            }`}
          >
            {service.name}
          </Text>
          <View className="flex-row items-center mt-1">
            <Text
              className={`text-sm font-medium ${
                isSelected ? "text-yellow-700" : "text-gray-500"
              }`}
            >
              {service.price} MT
            </Text>
            {isSelected && (
              <View className="ml-2 bg-yellow-200 px-2 py-1 rounded-full">
                <Text className="text-yellow-900 text-xs font-semibold">
                  Selecionado
                </Text>
              </View>
            )}
          </View>
        </View>

        <View
          className={`w-10 h-10 rounded-full items-center justify-center ${
            isSelected ? "bg-yellow-500" : "bg-gray-200"
          }`}
        >
          {isSelected ? (
            <Ionicons name="checkmark" size={20} color="white" />
          ) : (
            <Ionicons name="add" size={20} color="#666" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderServiceCategory = (
    services: IService[] | undefined,
    icon: React.ReactNode,
    title: string,
    subtitle?: string
  ) => {
    if (loading) {
      return (
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <ServiceSkeleton />
        </View>
      );
    }

    return (
      <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
        {/* Category Header */}
        <View className="flex-row items-center mb-4">
          <View className="w-16 h-16 items-center justify-center bg-gray-50 rounded-xl mr-4">
            {icon}
          </View>
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-800">{title}</Text>
            {subtitle && (
              <Text className="text-gray-500 text-sm mt-1">{subtitle}</Text>
            )}
          </View>
          <View className="bg-gray-100 px-3 py-2 rounded-full">
            <Text className="text-gray-700 text-xs font-semibold">
              {services?.length ?? 0} opções
            </Text>
          </View>
        </View>

        {/* Services List */}
        <View className="space-y-2">
          {services && services.length > 0 ? (
            services.map((service) => renderServiceItem(service))
          ) : (
            <View className="p-6 items-center">
              <Ionicons name="alert-circle-outline" size={32} color="#9CA3AF" />
              <Text className="text-gray-400 text-center mt-2">
                Nenhum serviço disponível
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Global Navigation Bar */}
      <GlobalNavigation title="Seleção de Serviços" />

      <ScrollView
        className="flex-1 p-4"
        contentContainerStyle={{
          paddingBottom: selectedServices.length > 0 ? summaryHeight + 32 : 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Instruction */}
        <View className="px-6 py-4">
          <Text className="text-center text-2xl text-gray-800 font-bold mb-2">
            Escolha os serviços
          </Text>
          <Text className="text-center text-sm text-gray-500 px-4">
            Pode selecionar um ou mais serviços antes de seguir para o
            checkout.
          </Text>
          <View className="w-16 h-1 bg-yellow-500 mx-auto rounded-full"></View>
        </View>

        {selectedServices.length > 0 && (
          <View className="px-6 mb-4">
            <View className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-sm text-yellow-800 font-medium">
                    Selecionados
                  </Text>
                  <Text className="text-xl font-bold text-yellow-900">
                    {selectedServices.length} serviço
                    {selectedServices.length > 1 ? "s" : ""}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-sm text-yellow-800 font-medium">
                    Total parcial
                  </Text>
                  <Text className="text-xl font-bold text-yellow-900">
                    {total.toLocaleString()} MT
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Service Categories */}
        <View className="px-6">
          {/* Beard Services */}
          {renderServiceCategory(
            dataService.data?.beardService,
            <BeardLogo width={40} height={40} color="#1E1B16" />,
            "Serviços de Barba",
            "Cuidados especializados para sua barba"
          )}

          {/* Hair Services */}
          {renderServiceCategory(
            dataService.data?.hairService,
            <HairLogo width={40} height={40} color="#1E1B16" />,
            "Serviços de Cabelo",
            "Cortes e tratamentos capilares"
          )}

          {/* Extra Services */}
          {renderServiceCategory(
            dataService.data?.extraService,
            <ExtraLogo width={40} height={40} color="#1E1B16" />,
            "Serviços Extras",
            "Tratamentos e cuidados adicionais"
          )}

          {/* Combo Services */}
          {renderServiceCategory(
            dataService.data?.comboService,
            <ComboLogo width={40} height={40} color="#1E1B16" />,
            "Combos",
            "Pacotes especiais com desconto"
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      {selectedServices.length > 0 && (
        <Animated.View
          onLayout={(event) => setSummaryHeight(event.nativeEvent.layout.height)}
          style={{
            transform: [{ translateY: slideAnim }],
          }}
          className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6 shadow-lg"
        >
          {/* Selected Services Summary */}
          <View className="mb-4">
            <Text className="text-gray-600 font-medium mb-2 text-center">
              Serviços Selecionados ({selectedServices.length})
            </Text>

            {/* Service Tags */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-3"
            >
              <View className="flex-row space-x-2 px-1">
                {selectedServices.map((service) => (
                  <View
                    key={service.id}
                    className="bg-yellow-100 border border-yellow-300 px-3 py-2 rounded-full flex-row items-center"
                  >
                    <Text className="text-yellow-800 text-sm font-medium mr-2">
                      {service.name}
                    </Text>
                    <TouchableOpacity onPress={() => toggleService(service)}>
                      <Ionicons name="close-circle" size={16} color="#D97706" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </ScrollView>

            {/* Total and Checkout */}
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-gray-600 text-sm">Total a Pagar</Text>
                <Text className="text-2xl font-bold text-gray-800">
                  {total.toLocaleString()} MT
                </Text>
                <Text className="text-gray-500 text-xs mt-1">
                  {selectedServices.length} item
                  {selectedServices.length > 1 ? "s" : ""} selecionado
                  {selectedServices.length > 1 ? "s" : ""}
                </Text>
              </View>

              <TouchableOpacity
                onPress={goToCheckout}
                className="bg-yellow-500 px-8 py-4 rounded-xl flex-row items-center shadow-sm"
                activeOpacity={0.8}
              >
                <Text className="text-white text-lg font-semibold mr-2">
                  Concluir
                </Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
}
