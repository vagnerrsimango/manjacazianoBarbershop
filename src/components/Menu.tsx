import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useUser from "../utils/hooks/UserHook";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Clients: undefined;
  Users: undefined;
  Home: undefined;
  Checkout: undefined;
  Debts: undefined;
  ClientDebts: undefined;
  Search: undefined;
};

export default function CustomMenu() {
  const { user, setUser } = useUser();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const logoutHandler = () => {
    setUser(null);
  };

  return (
    <View style={{ width: "90%", alignItems: "flex-end" }}>
      <View style={{ position: "relative" }}>
        <TouchableOpacity
          accessibilityLabel="More options menu"
          style={{ padding: 8 }}
        >
          <Ionicons name="list" size={24} color="#374151" />
        </TouchableOpacity>

        {/* Menu Options */}
        <View
          style={{
            position: "absolute",
            top: 48,
            right: 0,
            backgroundColor: "white",
            borderRadius: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
            borderWidth: 1,
            borderColor: "#E5E7EB",
            minWidth: 150,
            zIndex: 50,
          }}
        >
          <View style={{ padding: 16 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: "#111827",
                marginBottom: 12,
              }}
            >
              {user.name}
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("Clients")}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 6,
              }}
            >
              <Text style={{ color: "#92400E", fontWeight: "500" }}>
                Clientes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Users")}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 6,
              }}
            >
              <Text style={{ color: "#4DA6FF", fontWeight: "500" }}>
                Colegas
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={logoutHandler}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 6,
              }}
            >
              <Text style={{ color: "#4DA6FF", fontWeight: "500" }}>Sair</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
