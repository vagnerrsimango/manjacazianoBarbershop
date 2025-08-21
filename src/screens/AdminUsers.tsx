import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import MyButton from "../components/MyButton";
import Input from "../presentation/components/Input";
import CustomModal from "../components/CustomModal";

export default function AdminUsers() {
  const navigation = useNavigation();
  const [users, setUsers] = useState([
    {
      id: "1",
      name: "João Silva",
      email: "joao@email.com",
      type: 10,
      active: true,
    },
    {
      id: "2",
      name: "Maria Santos",
      email: "maria@email.com",
      type: 20,
      active: true,
    },
    {
      id: "3",
      name: "Pedro Costa",
      email: "pedro@email.com",
      type: 10,
      active: false,
    },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userType, setUserType] = useState("10");

  const handleAddUser = () => {
    if (userName && userEmail && userType) {
      const newUser = {
        id: Date.now().toString(),
        name: userName,
        email: userEmail,
        type: parseInt(userType),
        active: true,
      };
      setUsers([...users, newUser]);
      setUserName("");
      setUserEmail("");
      setUserType("10");
      setModalVisible(false);
      Alert.alert("Sucesso", "Usuário adicionado com sucesso!");
    } else {
      Alert.alert("Erro", "Preencha todos os campos");
    }
  };

  const handleToggleUserStatus = (id: string) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, active: !user.active } : user
      )
    );
  };

  const handleDeleteUser = (id: string) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este usuário?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => setUsers(users.filter((user) => user.id !== id)),
        },
      ]
    );
  };

  const getUserTypeText = (type: number) => {
    return type === 20 ? "Administrador" : "Usuário";
  };

  const getUserTypeBadgeColor = (type: number) => {
    return type === 20
      ? "bg-purple-100 text-purple-800"
      : "bg-blue-100 text-blue-800";
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-6">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-2xl font-bold text-gray-900">
            Gerenciar Usuários
          </Text>
          <TouchableOpacity
            className="bg-primary-500 px-4 py-2 rounded-lg flex-row items-center"
            onPress={() => setModalVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="person-add" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Adicionar</Text>
          </TouchableOpacity>
        </View>

        <View className="space-y-4">
          {users.map((user) => (
            <View
              key={user.id}
              className="bg-white p-4 rounded-lg border border-gray-200"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center mb-2">
                    <Text className="text-lg font-semibold text-gray-900 mr-3">
                      {user.name}
                    </Text>
                    <View
                      className={`px-2 py-1 rounded-full ${getUserTypeBadgeColor(
                        user.type
                      )}`}
                    >
                      <Text
                        className={`text-xs font-medium ${getUserTypeBadgeColor(
                          user.type
                        )}`}
                      >
                        {getUserTypeText(user.type)}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-sm text-gray-600 mb-2">
                    {user.email}
                  </Text>
                  <View
                    className={`inline-flex px-2 py-1 rounded-full ${
                      user.active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        user.active ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      {user.active ? "Ativo" : "Inativo"}
                    </Text>
                  </View>
                </View>

                <View className="flex-row space-x-2">
                  <TouchableOpacity
                    className={`p-2 rounded-lg ${
                      user.active ? "bg-yellow-500" : "bg-green-500"
                    }`}
                    onPress={() => handleToggleUserStatus(user.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={user.active ? "pause" : "play"}
                      size={16}
                      color="white"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-blue-500 p-2 rounded-lg"
                    activeOpacity={0.7}
                  >
                    <Ionicons name="pencil" size={16} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-red-500 p-2 rounded-lg"
                    onPress={() => handleDeleteUser(user.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <CustomModal opened={modalVisible} onClose={() => setModalVisible(false)}>
        <Text className="text-xl font-bold text-gray-900 mb-4">
          Adicionar Novo Usuário
        </Text>

        <Input
          label="Nome do Usuário"
          value={userName}
          onChangeText={setUserName}
          placeholder="Digite o nome completo"
        />

        <Input
          label="Email"
          value={userEmail}
          onChangeText={setUserEmail}
          placeholder="Digite o email"
          keyboardType="email-address"
        />

        <View className="mb-4">
          <Text className="text-gray-700 font-medium mb-2">
            Tipo de Usuário
          </Text>
          <View className="flex-row space-x-3">
            <TouchableOpacity
              className={`flex-1 p-3 rounded-lg border-2 ${
                userType === "10"
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200"
              }`}
              onPress={() => setUserType("10")}
              activeOpacity={0.7}
            >
              <Text
                className={`text-center font-medium ${
                  userType === "10" ? "text-primary-500" : "text-gray-700"
                }`}
              >
                Usuário
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 p-3 rounded-lg border-2 ${
                userType === "20"
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200"
              }`}
              onPress={() => setUserType("20")}
              activeOpacity={0.7}
            >
              <Text
                className={`text-center font-medium ${
                  userType === "20" ? "text-primary-500" : "text-gray-700"
                }`}
              >
                Administrador
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row space-x-3 mt-4">
          <TouchableOpacity
            className="flex-1 bg-gray-500 py-3 rounded-lg"
            onPress={() => setModalVisible(false)}
            activeOpacity={0.7}
          >
            <Text className="text-white font-semibold text-center">
              Cancelar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-primary-500 py-3 rounded-lg"
            onPress={handleAddUser}
            activeOpacity={0.7}
          >
            <Text className="text-white font-semibold text-center">
              Adicionar
            </Text>
          </TouchableOpacity>
        </View>
      </CustomModal>
    </View>
  );
}
