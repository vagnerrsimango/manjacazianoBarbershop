import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GlobalNavigation from "../components/GlobalNavigation";
import { Button } from "../presentation/components/Button";

import Input from "../components/Input";
import { useUserService } from "../utils/hooks/useUserService";
import { User, UserCreateRequest, UserUpdateRequest } from "../@types/api";

export default function UserManagementScreen() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterType, setFilterType] = useState<"all" | "admin" | "user">("all");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [userForm, setUserForm] = useState<UserCreateRequest>({
    name: "",
    surname: "",
    genre: "",
    phone: "",
    birthday: "",
    type: 12,
    email: "",
    password: "",
  });

  // Date inputs state
  const [dayInput, setDayInput] = useState("");
  const [monthInput, setMonthInput] = useState("");
  const [yearInput, setYearInput] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const {
    users,
    loading,
    error,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    changeUserPassword,
    searchUsers,
    clearError,
  } = useUserService();

  // Local error state for password validation
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await getAllUsers();
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  // Filtered and sorted users - Optimized for performance
  const filteredUsers = useMemo(() => {
    if (!users.length) return [];

    let filtered = [...users]; // Create a copy to avoid mutating original

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          (user.name && user.name.toLowerCase().includes(query)) ||
          (user.surname && user.surname.toLowerCase().includes(query)) ||
          (user.email && user.email.toLowerCase().includes(query)) ||
          (user.phone && user.phone.includes(query))
      );
    }

    // Apply type filter
    if (filterType === "admin") {
      filtered = filtered.filter((user) => user.type === 20);
    } else if (filterType === "user") {
      filtered = filtered.filter((user) => user.type === 12);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    return filtered;
  }, [users, searchQuery, filterType, sortOrder]);

  const handleCreateUser = async () => {
    if (!userForm.name) {
      Alert.alert("Erro", "Por favor, insira o nome do usuário");
      return;
    }

    // Concatenate date inputs if provided
    let userDataWithDate = { ...userForm };
    if (dayInput && monthInput && yearInput) {
      const formattedDate = `${yearInput}-${monthInput.padStart(2, "0")}-${dayInput.padStart(2, "0")}`;
      userDataWithDate.birthday = formattedDate;
    }

    // Create payload without email and password, add default password if required
    const userPayload = {
      ...userDataWithDate,
      password: "123456", // Default password
      email: `${userForm.name.toLowerCase().replace(/\s+/g, "")}@barbershop.com`, // Generate default email
    };

    setIsSubmitting(true);
    try {
      const success = await createUser(userPayload);
      if (success) {
        setShowCreateModal(false);
        setUserForm({
          name: "",
          surname: "",
          genre: "",
          phone: "",
          birthday: "",
          type: 12,
          email: "",
          password: "",
        });
        setDayInput("");
        setMonthInput("");
        setYearInput("");
        await loadData();
      }
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser || !userForm.name) {
      Alert.alert("Erro", "Por favor, insira o nome do usuário");
      return;
    }

    // Concatenate date inputs if provided
    let updateDataWithDate = { ...userForm };
    if (dayInput && monthInput && yearInput) {
      const formattedDate = `${yearInput}-${monthInput.padStart(2, "0")}-${dayInput.padStart(2, "0")}`;
      updateDataWithDate.birthday = formattedDate;
    }

    // Create update payload without email and password
    const updateData: UserUpdateRequest = {
      id: selectedUser.id,
      name: updateDataWithDate.name,
      surname: updateDataWithDate.surname,
      genre: updateDataWithDate.genre,
      phone: updateDataWithDate.phone,
      birthday: updateDataWithDate.birthday,
      type: updateDataWithDate.type,
    };

    setIsSubmitting(true);
    try {
      const success = await updateUser(updateData);
      if (success) {
        setShowEditModal(false);
        setSelectedUser(null);
        setUserForm({
          name: "",
          surname: "",
          genre: "",
          phone: "",
          birthday: "",
          type: 12,
          email: "",
          password: "",
        });
        setDayInput("");
        setMonthInput("");
        setYearInput("");
        await loadData();
      }
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setIsSubmitting(true);
    try {
      const success = await deleteUser(selectedUser.id);
      if (success) {
        setShowDeleteAlert(false);
        setSelectedUser(null);
        await loadData();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async () => {
    if (
      !selectedUser ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setPasswordError("Por favor, preencha todos os campos");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("As senhas não coincidem");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setPasswordError(null);
    setIsSubmitting(true);

    try {
      const success = await changeUserPassword({
        id: selectedUser.id,
        newPassword: passwordForm.newPassword,
      });

      if (success) {
        setShowPasswordModal(false);
        setPasswordForm({ newPassword: "", confirmPassword: "" });
        setSelectedUser(null);
        Alert.alert("Sucesso", "Senha alterada com sucesso!");
      }
    } catch (error) {
      console.error("Error changing password:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = useCallback(async () => {
    if (searchQuery.length >= 2) {
      try {
        await searchUsers({ query: searchQuery });
      } catch (error) {
        console.error("Search error:", error);
        await getAllUsers();
      }
    } else {
      await getAllUsers();
    }
  }, [searchQuery, searchUsers, getAllUsers]);

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setUserForm({
      name: user.name,
      surname: user.surname || "",
      genre: user.genre || "",
      phone: user.phone || "",
      birthday: user.birthday || "",
      type: user.type,
      email: user.email || "",
      password: "",
    });

    // Parse existing birthday into separate inputs
    if (user.birthday) {
      const date = new Date(user.birthday);
      setDayInput(date.getDate().toString());
      setMonthInput((date.getMonth() + 1).toString());
      setYearInput(date.getFullYear().toString());
    } else {
      setDayInput("");
      setMonthInput("");
      setYearInput("");
    }

    setShowEditModal(true);
  };

  const openPasswordModal = (user: User) => {
    setSelectedUser(user);
    setShowPasswordModal(true);
  };

  const openDeleteAlert = (user: User) => {
    setSelectedUser(user);
    setShowDeleteAlert(true);
  };

  const resetForms = () => {
    setUserForm({
      name: "",
      surname: "",
      genre: "",
      phone: "",
      birthday: "",
      type: 12,
      email: "",
      password: "",
    });
    setDayInput("");
    setMonthInput("");
    setYearInput("");
    setPasswordForm({ newPassword: "", confirmPassword: "" });
    setSelectedUser(null);
    setPasswordError(null);
  };

  const getUserTypeLabel = (type: number) => {
    switch (type) {
      case 20:
        return { label: "Administrador", color: "bg-red-500" };
      case 12:
        return { label: "Usuário", color: "bg-blue-500" };
      default:
        return { label: "Desconhecido", color: "bg-gray-500" };
    }
  };

  const renderUserItem = useCallback(
    ({ item }: { item: User }) => {
      const typeInfo = getUserTypeLabel(item.type);
      return (
        <View className="bg-white p-4 mb-3 rounded-lg shadow-sm border-l-4 border-l-blue-500">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <View className="flex-row items-center mb-2">
                <Text className="text-lg font-bold text-gray-900 mr-3">
                  {item.name} {item.surname}
                </Text>
                <View className={`${typeInfo.color} px-2 py-1 rounded-full`}>
                  <Text className="text-white text-xs font-medium">
                    {typeInfo.label}
                  </Text>
                </View>
              </View>

              <View className="space-y-1 mb-3">
                {item.email && (
                  <Text className="text-gray-600 text-sm">📧 {item.email}</Text>
                )}
                {item.phone && (
                  <Text className="text-gray-600 text-sm">📱 {item.phone}</Text>
                )}
                {item.birthday && (
                  <Text className="text-gray-600 text-sm">
                    🎂 {new Date(item.birthday).toLocaleDateString("pt-MZ")}
                  </Text>
                )}
                {item.genre && (
                  <Text className="text-gray-600 text-sm">👤 {item.genre}</Text>
                )}
              </View>

              <View className="flex-row space-x-2 flex-wrap">
                <Text className="text-xs text-gray-500">
                  Criado:{" "}
                  {new Date(item.created_at).toLocaleDateString("pt-MZ")}
                </Text>
              </View>
            </View>

            <View className="space-y-2">
              <TouchableOpacity
                onPress={() => openEditModal(item)}
                className="p-2 bg-blue-100 rounded-full"
              >
                <Ionicons name="create-outline" size={20} color="#2563EB" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => openPasswordModal(item)}
                className="p-2 bg-yellow-100 rounded-full"
              >
                <Ionicons name="key-outline" size={20} color="#CA8A04" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => openDeleteAlert(item)}
                className="p-2 bg-red-100 rounded-full"
              >
                <Ionicons name="trash-outline" size={20} color="#DC2626" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    },
    [openEditModal, openPasswordModal, openDeleteAlert, getUserTypeLabel]
  );

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#0052A3" />
        <Text className="text-gray-500 mt-4">Carregando usuários...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center p-6">
        <Ionicons name="alert-circle" size={48} color="#DC2626" />
        <Text className="text-red-600 text-lg font-semibold mt-4 mb-2">
          Erro ao carregar usuários
        </Text>
        <Text className="text-gray-600 text-center mb-4">{error}</Text>
        <Button title="Tentar novamente" onPress={loadData} variant="primary" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <GlobalNavigation title="Gestão de Usuários" />

      {/* Search and Actions */}
      <View className="bg-white p-4 border-b border-gray-200">
        <View className="space-y-4">
          <View className="flex-row space-x-3 items-center">
            <Input
              placeholder="Pesquisar usuários..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{ flex: 1 }}
            />
            <Button
              title="Novo Usuário"
              onPress={() => setShowCreateModal(true)}
              variant="primary"
              size="md"
            />
          </View>

          {/* Filters */}
          <View className="flex-row space-x-4 items-center flex-wrap">
            <TouchableOpacity
              onPress={() => setFilterType("all")}
              className={`px-3 py-2 rounded-full ${
                filterType === "all" ? "bg-primary-500" : "bg-gray-200"
              }`}
            >
              <Text
                className={
                  filterType === "all" ? "text-white" : "text-gray-700"
                }
              >
                Todos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setFilterType("admin")}
              className={`px-3 py-2 rounded-full ${
                filterType === "admin" ? "bg-red-500" : "bg-gray-200"
              }`}
            >
              <Text
                className={
                  filterType === "admin" ? "text-white" : "text-gray-700"
                }
              >
                Administradores
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setFilterType("user")}
              className={`px-3 py-2 rounded-full ${
                filterType === "user" ? "bg-blue-500" : "bg-gray-200"
              }`}
            >
              <Text
                className={
                  filterType === "user" ? "text-white" : "text-gray-700"
                }
              >
                Usuários
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row space-x-4 items-center flex-wrap">
            <Text className="text-sm text-gray-600">
              Total de Usuários: {users.length}
            </Text>
            <Text className="text-sm text-gray-600">
              Filtrados: {filteredUsers.length}
            </Text>
          </View>
        </View>
      </View>

      {/* Users List */}
      <View className="flex-1 px-4 pt-4">
        {filteredUsers.length > 0 ? (
          <FlatList
            data={filteredUsers}
            renderItem={renderUserItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View className="items-center p-8">
            <Ionicons name="people-outline" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 mt-2 text-center">
              {searchQuery || filterType !== "all"
                ? "Nenhum usuário encontrado com os filtros aplicados"
                : "Nenhum usuário encontrado"}
            </Text>
          </View>
        )}
      </View>

      {/* Create User Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className="flex-1 bg-white">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-xl font-bold">Criar Novo Usuário</Text>
            <TouchableOpacity
              onPress={() => {
                setShowCreateModal(false);
                setDayInput("");
                setMonthInput("");
                setYearInput("");
              }}
            >
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4">
            <View className="space-y-4">
              <Input
                label="Nome *"
                placeholder="Digite o nome"
                value={userForm.name}
                onChangeText={(text) =>
                  setUserForm({ ...userForm, name: text })
                }
              />

              <Input
                label="Sobrenome"
                placeholder="Digite o sobrenome"
                value={userForm.surname}
                onChangeText={(text) =>
                  setUserForm({ ...userForm, surname: text })
                }
              />

              <Input
                label="Telefone"
                placeholder="Digite o telefone"
                value={userForm.phone}
                onChangeText={(text) =>
                  setUserForm({ ...userForm, phone: text })
                }
                keyboardType="phone-pad"
              />

              {/* Birthday Date Inputs */}
              <View className="space-y-2">
                <Text className="text-sm font-medium text-gray-700">
                  Data de nascimento
                </Text>
                <View className="flex-row items-center justify-between p-3 border border-gray-300 rounded-lg bg-white">
                  <TextInput
                    placeholder="DD"
                    keyboardType="numeric"
                    value={dayInput}
                    onChangeText={setDayInput}
                    style={{ width: 50, textAlign: "center" }}
                  />
                  <Text className="mx-2 text-lg font-semibold text-gray-900">
                    /
                  </Text>
                  <TextInput
                    placeholder="MM"
                    keyboardType="numeric"
                    value={monthInput}
                    onChangeText={setMonthInput}
                    style={{ width: 50, textAlign: "center" }}
                  />
                  <Text className="mx-2 text-lg font-semibold text-gray-900">
                    /
                  </Text>
                  <TextInput
                    placeholder="AAAA"
                    keyboardType="numeric"
                    value={yearInput}
                    onChangeText={setYearInput}
                    style={{ width: 100, textAlign: "center" }}
                  />
                </View>
              </View>

              <Input
                label="Gênero"
                placeholder="Digite o gênero"
                value={userForm.genre}
                onChangeText={(text) =>
                  setUserForm({ ...userForm, genre: text })
                }
              />
            </View>

            <View className="mt-6 space-y-3">
              <Button
                title="Criar Usuário"
                onPress={handleCreateUser}
                variant="primary"
                loading={isSubmitting}
                disabled={isSubmitting}
              />

              <Button
                title="Cancelar"
                onPress={() => {
                  setShowCreateModal(false);
                  setDayInput("");
                  setMonthInput("");
                  setYearInput("");
                }}
                variant="ghost"
              />
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className="flex-1 bg-white">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-xl font-bold">Editar Usuário</Text>
            <TouchableOpacity
              onPress={() => {
                setShowEditModal(false);
                setDayInput("");
                setMonthInput("");
                setYearInput("");
              }}
            >
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4">
            <View className="space-y-4">
              <Input
                label="Nome *"
                placeholder="Digite o nome"
                value={userForm.name}
                onChangeText={(text) =>
                  setUserForm({ ...userForm, name: text })
                }
              />

              <Input
                label="Sobrenome"
                placeholder="Digite o sobrenome"
                value={userForm.surname}
                onChangeText={(text) =>
                  setUserForm({ ...userForm, surname: text })
                }
              />

              <Input
                label="Telefone"
                placeholder="Digite o telefone"
                value={userForm.phone}
                onChangeText={(text) =>
                  setUserForm({ ...userForm, phone: text })
                }
                keyboardType="phone-pad"
              />

              {/* Birthday Date Inputs */}
              <View className="space-y-2">
                <Text className="text-sm font-medium text-gray-700">
                  Data de nascimento
                </Text>
                <View className="flex-row items-center justify-between p-3 border border-gray-300 rounded-lg bg-white">
                  <TextInput
                    placeholder="DD"
                    keyboardType="numeric"
                    value={dayInput}
                    onChangeText={setDayInput}
                    style={{ width: 50, textAlign: "center" }}
                  />
                  <Text className="mx-2 text-lg font-semibold text-gray-900">
                    /
                  </Text>
                  <TextInput
                    placeholder="MM"
                    keyboardType="numeric"
                    value={monthInput}
                    onChangeText={setMonthInput}
                    style={{ width: 50, textAlign: "center" }}
                  />
                  <Text className="mx-2 text-lg font-semibold text-gray-900">
                    /
                  </Text>
                  <TextInput
                    placeholder="AAAA"
                    keyboardType="numeric"
                    value={yearInput}
                    onChangeText={setYearInput}
                    style={{ width: 100, textAlign: "center" }}
                  />
                </View>
              </View>

              <Input
                label="Gênero"
                placeholder="Digite o gênero"
                value={userForm.genre}
                onChangeText={(text) =>
                  setUserForm({ ...userForm, genre: text })
                }
              />
            </View>

            <View className="mt-6 space-y-3">
              <Button
                title="Atualizar Usuário"
                onPress={handleUpdateUser}
                variant="primary"
                loading={isSubmitting}
                disabled={isSubmitting}
              />

              <Button
                title="Cancelar"
                onPress={() => {
                  setShowEditModal(false);
                  setDayInput("");
                  setMonthInput("");
                  setYearInput("");
                }}
                variant="ghost"
              />
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        visible={showPasswordModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className="flex-1 bg-white">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-xl font-bold">Alterar Senha</Text>
            <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4">
            <Text className="text-gray-600 mb-4">
              Usuário: <Text className="font-bold">{selectedUser?.name}</Text>
            </Text>

            <View className="space-y-4">
              <Input
                label="Nova Senha *"
                placeholder="Digite a nova senha"
                value={passwordForm.newPassword}
                onChangeText={(text) =>
                  setPasswordForm({ ...passwordForm, newPassword: text })
                }
                secureTextEntry
              />

              <Input
                label="Confirmar Nova Senha *"
                placeholder="Confirme a nova senha"
                value={passwordForm.confirmPassword}
                onChangeText={(text) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: text })
                }
                secureTextEntry
              />
            </View>

            {passwordError && (
              <View className="bg-red-100 p-3 rounded-lg mt-4">
                <Text className="text-red-600 text-sm">{passwordError}</Text>
              </View>
            )}

            <View className="mt-6 space-y-3">
              <Button
                title="Alterar Senha"
                onPress={handleChangePassword}
                variant="primary"
                loading={isSubmitting}
                disabled={isSubmitting}
              />

              <Button
                title="Cancelar"
                onPress={() => setShowPasswordModal(false)}
                variant="ghost"
              />
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Delete Confirmation Alert */}
      {showDeleteAlert && (
        <View className="absolute inset-0 bg-black bg-opacity-50 justify-center items-center">
          <View className="bg-white p-6 rounded-lg mx-4 max-w-sm">
            <Text className="text-lg font-bold mb-4">Confirmar Exclusão</Text>
            <Text className="text-gray-600 mb-4">
              Tem certeza que deseja excluir o usuário{" "}
              <Text className="font-bold">{selectedUser?.name}</Text>?
            </Text>
            <Text className="text-red-500 mb-4 text-sm">
              ⚠️ Esta ação não pode ser desfeita!
            </Text>

            <View className="flex-row space-x-3">
              <Button
                title="Cancelar"
                onPress={() => setShowDeleteAlert(false)}
                variant="ghost"
                style={{ flex: 1 }}
              />
              <Button
                title="Excluir"
                onPress={handleDeleteUser}
                variant="danger"
                loading={isSubmitting}
                disabled={isSubmitting}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
