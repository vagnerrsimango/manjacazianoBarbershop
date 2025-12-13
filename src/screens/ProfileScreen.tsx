import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import GlobalNavigation from "../components/GlobalNavigation";
import { userService } from "../utils/network/userService";
import useUser from "../utils/hooks/UserHook";

interface MySaleItem {
  id: number;
  finalized_at: string;
  paid: string;
  total_amount: string;
  clients: { name: string; phone: number };
}

export default function ProfileScreen() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bonus, setBonus] = useState<string>("0.00");
  const [sales, setSales] = useState<MySaleItem[]>([]);

  const fetchSalesData = useCallback(async (forceRefresh = false) => {
    try {
      if (!forceRefresh) setLoading(true);
      setError(null);
      
      const res = await userService.getMySales(forceRefresh);
      setBonus(res?.data?.bonus ?? "0.00");
      setSales(res?.data?.mysales ?? []);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar vendas");
      console.error("Error loading sales:", err);
    } finally {
      setLoading(false);
      if (forceRefresh) setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSalesData(true);
  }, [fetchSalesData]);

  useEffect(() => {
    fetchSalesData();
  }, [fetchSalesData]);

  // Auto-refresh when screen comes into focus (handles user switching)
  useFocusEffect(
    useCallback(() => {
      // Force refresh when screen gains focus to get latest bonus
      fetchSalesData(true);
      
      // Set up periodic refresh every 30 seconds for bonus updates
      const interval = setInterval(() => {
        fetchSalesData(true);
      }, 30000);

      return () => clearInterval(interval);
    }, [fetchSalesData])
  );

  return (
    <View className="flex-1 bg-gray-50">
      <GlobalNavigation title="Perfil" />
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-500 mt-4">Carregando vendas...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-red-500 text-center mb-4">{error}</Text>
          <Text 
            className="text-blue-500 font-semibold"
            onPress={() => fetchSalesData()}
          >
            Tentar novamente
          </Text>
        </View>
      ) : (
        <ScrollView 
          className="flex-1 p-6"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#3B82F6"]}
              tintColor="#3B82F6"
            />
          }
        >
          {/* Header */}
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <Text className="text-xl font-bold text-gray-800">
              {user?.name ?? "Usuário"}
            </Text>
            <Text className="text-gray-500 mt-1">Bónus do mês</Text>
            <Text className="text-3xl font-extrabold text-green-600 mt-1">
              {bonus} MT
            </Text>
          </View>

          {/* Sales List */}
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              Minhas Vendas de Hoje
            </Text>
            {sales.length === 0 ? (
              <Text className="text-gray-400">Sem vendas neste período.</Text>
            ) : (
              <View className="space-y-3">
                {sales.map((s) => (
                  <View
                    key={s.id}
                    className="p-4 border border-gray-100 rounded-xl"
                  >
                    <View className="flex-row justify-between">
                      <Text className="font-semibold text-gray-800">
                        #{s.id}
                      </Text>
                      <Text className="text-gray-500 text-xs">
                        {new Date(s.finalized_at).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </Text>
                    </View>
                    <View className="mt-2 flex-row justify-between">
                      <Text className="text-gray-700">Cliente</Text>
                      <Text className="text-gray-900 font-medium">
                        {s.clients?.name}
                      </Text>
                    </View>
                    <View className="mt-1 flex-row justify-between">
                      <Text className="text-gray-700">Pago</Text>
                      <Text className="text-gray-900 font-semibold">
                        {s.paid} MT
                      </Text>
                    </View>
                    <View className="mt-1 flex-row justify-between">
                      <Text className="text-gray-700">Total</Text>
                      <Text className="text-gray-900 font-semibold">
                        {s.total_amount} MT
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
