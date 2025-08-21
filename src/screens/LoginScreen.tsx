import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Input from "../components/Input";
import { Button } from "../presentation/components/Button";
import useUser from "../utils/hooks/UserHook";
import api from "../utils/network/api";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { setUser } = useUser();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        const userData = response.data.data;
        setUser(userData);
        navigation.navigate("Home" as never);
      } else {
        Alert.alert("Erro", response.data.message || "Falha no login");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      Alert.alert(
        "Erro",
        error.response?.data?.message || "Erro ao fazer login"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gradient-to-br from-primary-500 to-primary-700 justify-center items-center p-6">
      <View className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
        {/* Logo/Header */}
        <View className="items-center mb-8">
          <View className="bg-primary-100 p-4 rounded-full mb-4">
            <Ionicons name="cut-outline" size={48} color="#0052A3" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Manja Caziano
          </Text>
          <Text className="text-gray-600 text-center">
            Faça login para acessar o sistema
          </Text>
        </View>

        {/* Login Form */}
        <View className="space-y-4">
          <Input
            label="Email"
            placeholder="Digite seu email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Input
            label="Senha"
            placeholder="Digite sua senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button
            title={loading ? "Entrando..." : "Entrar"}
            onPress={handleLogin}
            variant="primary"
            loading={loading}
            disabled={loading}
            style={{ marginTop: 16 }}
          />
        </View>

        {/* Footer */}
        <View className="mt-8 pt-6 border-t border-gray-200">
          <Text className="text-gray-500 text-center text-sm">
            Sistema de Gestão para Barbearias
          </Text>
        </View>
      </View>
    </View>
  );
}
