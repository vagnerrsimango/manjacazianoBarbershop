import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
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
  const [bonus, setBonus] = useState<string>("0.00");
  const [sales, setSales] = useState<MySaleItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await userService.getMySales();
        setBonus(res?.data?.bonus ?? "0.00");
        setSales(res?.data?.mysales ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <View className="flex-1 bg-gray-50">
      <GlobalNavigation title="Perfil" />
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : (
        <ScrollView className="flex-1 p-6">
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
              Minhas Vendas
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
                      <Text className="text-gray-500">
                        {new Date(s.finalized_at).toLocaleString()}
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
