import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import api from "../utils/network/api";
import ClientList from "../components/ClientList";
import SoldProduct from "../components/SoldProduct";
import {
  ISaleCustomerHistoryServiceResponse,
  ISaleCustomerHistory,
} from "../utils/Responses";

export default function ClientDebt({ route }: { route: any }) {
  const client = route.params.client;
  const [soldProducts, setSoldProducts] = useState<Array<ISaleCustomerHistory>>(
    []
  );

  useEffect(() => {
    async function getClients() {
      try {
        const { data } = await api.get(`/client/${client.id}`);
        const response: ISaleCustomerHistoryServiceResponse = data;
        setSoldProducts(response.data);
        console.log(
          "🚀 ~ file: ClientDebt.tsx:25 ~ getClients ~ response.data:",
          response.data
        );
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    }

    getClients();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#0052A3" }}>
      <Header title="Dívidas" back />

      <View
        style={{
          alignItems: "center",
          marginTop: "10%",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "#4DA6FF",
            padding: 12,
            width: "50%",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 20, color: "white" }}>
            Histórico de cortes do {client.name}
          </Text>
        </View>

        <View
          style={{
            width: "60%",
            marginTop: 32,
            marginBottom: 32,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "#4DA6FF",
              paddingLeft: 16,
              paddingRight: 20,
              paddingVertical: 8,
            }}
          >
            {soldProducts.length > 0 ? (
              <FlatList
                data={soldProducts}
                renderItem={({ item }) => (
                  <SoldProduct item={item} key={item.id} />
                )}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={{ alignItems: "center", padding: 32 }}>
                <Ionicons name="receipt-outline" size={48} color="#9CA3AF" />
                <Text
                  style={{
                    color: "#6B7280",
                    marginTop: 8,
                    textAlign: "center",
                  }}
                >
                  Nenhum produto vendido encontrado
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
