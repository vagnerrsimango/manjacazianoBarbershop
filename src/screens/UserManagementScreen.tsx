import React, { useState, useEffect, useMemo } from "react";
import {
  Text,
  Box,
  VStack,
  HStack,
  FlatList,
  Modal,
  Button,
  Flex,
  Input,
  Select,
  IconButton,
  AlertDialog,
  Divider,
  ScrollView,
  Pressable,
  Badge,
  Spinner,
  TextArea,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import MyButton from "../components/MyButton";
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
    licenseStart: "",
    licenseEnd: "",
  });
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

  // Filtered and sorted users
  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          (user.surname && user.surname.toLowerCase().includes(query)) ||
          (user.email && user.email.toLowerCase().includes(query)) ||
          (user.phone && user.phone.includes(query))
      );
    }

    // Apply type filter
    if (filterType === "admin") {
      filtered = filtered.filter((user) => user.type === 20);
    } else if (filterType === "user") {
      filtered = filtered.filter((user) => user.type !== 20);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortOrder === "asc") {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      } else {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
    });

    return filtered;
  }, [users, searchQuery, filterType, sortOrder]);

  const handleCreateUser = async () => {
    if (!userForm.name || !userForm.type || !userForm.password) {
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await createUser(userForm);
      if (success) {
        setShowCreateModal(false);
        resetForms();
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
      return;
    }

    setIsSubmitting(true);
    try {
      const updateData: UserUpdateRequest = {
        id: selectedUser.id,
        ...userForm,
      };

      const success = await updateUser(updateData);
      if (success) {
        setShowEditModal(false);
        setSelectedUser(null);
        resetForms();
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
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

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
      }
    } catch (error) {
      console.error("Error changing password:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.length >= 2) {
      try {
        await searchUsers({ query: searchQuery });
      } catch (error) {
        console.error("Search error:", error);
        // Fallback to local filtering
      }
    } else {
      await getAllUsers();
    }
  };

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
      licenseStart: user.licenseStart || "",
      licenseEnd: user.licenseEnd || "",
    });
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
      licenseStart: "",
      licenseEnd: "",
    });
    setPasswordForm({ newPassword: "", confirmPassword: "" });
    setSelectedUser(null);
  };

  const getUserTypeLabel = (type: number) => {
    switch (type) {
      case 20:
        return { label: "Admin", color: "red" as const };
      case 15:
        return { label: "Manager", color: "blue" as const };
      case 12:
        return { label: "User", color: "green" as const };
      default:
        return { label: `Type ${type}`, color: "gray" as const };
    }
  };

  const renderUserItem = ({ item }: { item: User }) => {
    const typeInfo = getUserTypeLabel(item.type);

    return (
      <Box
        bg="white"
        p={4}
        mb={2}
        rounded="lg"
        shadow={2}
        borderLeftWidth={4}
        borderLeftColor={typeInfo.color + ".500"}
      >
        <HStack justifyContent="space-between" alignItems="center">
          <VStack flex={1}>
            <HStack space={2} alignItems="center" mb={1}>
              <Text fontSize="lg" fontWeight="bold" color="primary.600">
                {item.name} {item.surname}
              </Text>
              <Badge colorScheme={typeInfo.color} variant="solid" size="sm">
                {typeInfo.label}
              </Badge>
            </HStack>

            {item.email && (
              <Text color="gray.600" fontSize="sm">
                {item.email}
              </Text>
            )}

            {item.phone && (
              <Text color="gray.600" fontSize="sm">
                {item.phone}
              </Text>
            )}

            {item.birthday && (
              <Text color="gray.500" fontSize="xs">
                {new Date(item.birthday).toLocaleDateString("pt-MZ")}
              </Text>
            )}

            <HStack space={2} mt={2} flexWrap="wrap">
              <Text fontSize="sm" color="gray.500">
                ID: {item.id}
              </Text>
              <Text fontSize="sm" color="gray.500">
                Tipo: {item.type}
              </Text>
              {item.licenseStart && (
                <Text fontSize="sm" color="gray.500">
                  Licença:{" "}
                  {new Date(item.licenseStart).toLocaleDateString("pt-MZ")}
                </Text>
              )}
            </HStack>
          </VStack>

          <VStack space={2}>
            <IconButton
              icon={<Ionicons name="create-outline" size={20} />}
              onPress={() => openEditModal(item)}
              variant="ghost"
              colorScheme="blue"
              size="sm"
            />
            <IconButton
              icon={<Ionicons name="key-outline" size={20} />}
              onPress={() => openPasswordModal(item)}
              variant="ghost"
              colorScheme="yellow"
              size="sm"
            />
            <IconButton
              icon={<Ionicons name="trash-outline" size={20} />}
              onPress={() => openDeleteAlert(item)}
              variant="ghost"
              colorScheme="red"
              size="sm"
            />
          </VStack>
        </HStack>
      </Box>
    );
  };

  return (
    <VStack bg="primary.100" flex={1}>
      <Header title="Gestão de Usuários" back />

      <ScrollView flex={1} px={4}>
        {/* Search and Actions */}
        <Box bg="white" p={4} rounded="lg" mb={4} shadow={2}>
          <VStack space={4}>
            <HStack space={3} alignItems="center">
              <Input
                flex={1}
                placeholder="Pesquisar usuários..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                InputRightElement={
                  <IconButton
                    icon={<Ionicons name="search" size={20} />}
                    onPress={handleSearch}
                    variant="ghost"
                  />
                }
              />
              <MyButton
                title="Novo Usuário"
                onPress={() => setShowCreateModal(true)}
                bgColor="primary.500"
              />
            </HStack>

            {/* Filters */}
            <HStack space={4} alignItems="center" flexWrap="wrap">
              <Select
                selectedValue={filterType}
                onValueChange={(value) => setFilterType(value as any)}
                minWidth={120}
              >
                <Select.Item label="Todos os usuários" value="all" />
                <Select.Item label="Administradores" value="admin" />
                <Select.Item label="Usuários" value="user" />
              </Select>

              <Select
                selectedValue={sortOrder}
                onValueChange={(value) => setSortOrder(value as "asc" | "desc")}
                minWidth={120}
              >
                <Select.Item label="Mais recentes" value="desc" />
                <Select.Item label="Mais antigos" value="asc" />
              </Select>
            </HStack>

            <HStack space={4} alignItems="center" flexWrap="wrap">
              <Text fontSize="sm" color="gray.600">
                Total de Usuários: {users.length}
              </Text>
              <Text fontSize="sm" color="gray.600">
                Filtrados: {filteredUsers.length}
              </Text>
              <Text fontSize="sm" color="gray.600">
                Administradores: {users.filter((u) => u.type === 20).length}
              </Text>
            </HStack>
          </VStack>
        </Box>

        {/* Error Display */}
        {error && (
          <Box bg="red.100" p={3} rounded="lg" mb={4}>
            <HStack space={2} alignItems="center">
              <Ionicons name="alert-circle" size={20} color="#dc2626" />
              <Text color="red.600" flex={1}>
                {error}
              </Text>
              <IconButton
                icon={<Ionicons name="close" size={20} />}
                onPress={clearError}
                variant="ghost"
                colorScheme="red"
                size="sm"
              />
            </HStack>
          </Box>
        )}

        {/* Users List */}
        <Box bg="white" p={4} rounded="lg" mb={4} shadow={2}>
          <Text fontSize="lg" fontWeight="bold" mb={4} color="primary.600">
            Lista de Usuários ({filteredUsers.length})
          </Text>

          {loading ? (
            <Box alignItems="center" p={8}>
              <Spinner size="lg" color="primary.500" />
              <Text color="gray.500" mt={2}>
                Carregando usuários...
              </Text>
            </Box>
          ) : filteredUsers.length > 0 ? (
            <FlatList
              data={filteredUsers}
              renderItem={renderUserItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Box alignItems="center" p={8}>
              <Ionicons name="people-outline" size={48} color="#9ca3af" />
              <Text color="gray.500" mt={2} textAlign="center">
                {searchQuery || filterType !== "all"
                  ? "Nenhum usuário encontrado com os filtros aplicados"
                  : "Nenhum usuário encontrado"}
              </Text>
            </Box>
          )}
        </Box>
      </ScrollView>

      {/* Create User Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <Modal.Content maxWidth="500px" maxHeight="90%">
          <Modal.Header>Criar Novo Usuário</Modal.Header>
          <Modal.Body>
            <ScrollView>
              <VStack space={4}>
                <HStack space={2}>
                  <Input
                    flex={1}
                    placeholder="Nome"
                    value={userForm.name}
                    onChangeText={(text) =>
                      setUserForm({ ...userForm, name: text })
                    }
                  />
                  <Input
                    flex={1}
                    placeholder="Sobrenome"
                    value={userForm.surname}
                    onChangeText={(text) =>
                      setUserForm({ ...userForm, surname: text })
                    }
                  />
                </HStack>

                <HStack space={2}>
                  <Select
                    selectedValue={userForm.genre}
                    onValueChange={(value) =>
                      setUserForm({ ...userForm, genre: value })
                    }
                    placeholder="Gênero"
                    flex={1}
                  >
                    <Select.Item label="Masculino" value="M" />
                    <Select.Item label="Feminino" value="F" />
                    <Select.Item label="Outro" value="O" />
                  </Select>

                  <Select
                    selectedValue={userForm.type.toString()}
                    onValueChange={(value) =>
                      setUserForm({ ...userForm, type: parseInt(value) })
                    }
                    placeholder="Tipo"
                    flex={1}
                  >
                    <Select.Item label="Usuário" value="12" />
                    <Select.Item label="Gerente" value="15" />
                    <Select.Item label="Administrador" value="20" />
                  </Select>
                </HStack>

                <HStack space={2}>
                  <Input
                    flex={1}
                    placeholder="Telefone"
                    value={userForm.phone}
                    onChangeText={(text) =>
                      setUserForm({ ...userForm, phone: text })
                    }
                    keyboardType="phone-pad"
                  />
                  <Input
                    flex={1}
                    placeholder="Data de nascimento (YYYY-MM-DD)"
                    value={userForm.birthday}
                    onChangeText={(text) =>
                      setUserForm({ ...userForm, birthday: text })
                    }
                  />
                </HStack>

                <Input
                  placeholder="Email"
                  value={userForm.email}
                  onChangeText={(text) =>
                    setUserForm({ ...userForm, email: text })
                  }
                  keyboardType="email-address"
                />

                <Input
                  placeholder="Senha (mín. 6 caracteres)"
                  value={userForm.password}
                  onChangeText={(text) =>
                    setUserForm({ ...userForm, password: text })
                  }
                  type="password"
                  secureTextEntry
                />

                <HStack space={2}>
                  <Input
                    flex={1}
                    placeholder="Início da licença (YYYY-MM-DD)"
                    value={userForm.licenseStart}
                    onChangeText={(text) =>
                      setUserForm({ ...userForm, licenseStart: text })
                    }
                  />
                  <Input
                    flex={1}
                    placeholder="Fim da licença (YYYY-MM-DD)"
                    value={userForm.licenseEnd}
                    onChangeText={(text) =>
                      setUserForm({ ...userForm, licenseEnd: text })
                    }
                  />
                </HStack>
              </VStack>
            </ScrollView>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                onPress={() => {
                  setShowCreateModal(false);
                  resetForms();
                }}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                onPress={handleCreateUser}
                disabled={isSubmitting}
                isLoading={isSubmitting}
              >
                {isSubmitting ? "Criando..." : "Criar"}
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {/* Edit User Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
        <Modal.Content maxWidth="500px" maxHeight="90%">
          <Modal.Header>Editar Usuário</Modal.Header>
          <Modal.Body>
            <ScrollView>
              <VStack space={4}>
                <HStack space={2}>
                  <Input
                    flex={1}
                    placeholder="Nome"
                    value={userForm.name}
                    onChangeText={(text) =>
                      setUserForm({ ...userForm, name: text })
                    }
                  />
                  <Input
                    flex={1}
                    placeholder="Sobrenome"
                    value={userForm.surname}
                    onChangeText={(text) =>
                      setUserForm({ ...userForm, surname: text })
                    }
                  />
                </HStack>

                <HStack space={2}>
                  <Select
                    selectedValue={userForm.genre}
                    onValueChange={(value) =>
                      setUserForm({ ...userForm, genre: value })
                    }
                    placeholder="Gênero"
                    flex={1}
                  >
                    <Select.Item label="Masculino" value="M" />
                    <Select.Item label="Feminino" value="F" />
                    <Select.Item label="Outro" value="O" />
                  </Select>

                  <Select
                    selectedValue={userForm.type.toString()}
                    onValueChange={(value) =>
                      setUserForm({ ...userForm, type: parseInt(value) })
                    }
                    placeholder="Tipo"
                    flex={1}
                  >
                    <Select.Item label="Usuário" value="12" />
                    <Select.Item label="Gerente" value="15" />
                    <Select.Item label="Administrador" value="20" />
                  </Select>
                </HStack>

                <HStack space={2}>
                  <Input
                    flex={1}
                    placeholder="Telefone"
                    value={userForm.phone}
                    onChangeText={(text) =>
                      setUserForm({ ...userForm, phone: text })
                    }
                    keyboardType="phone-pad"
                  />
                  <Input
                    flex={1}
                    placeholder="Data de nascimento (YYYY-MM-DD)"
                    value={userForm.birthday}
                    onChangeText={(text) =>
                      setUserForm({ ...userForm, birthday: text })
                    }
                  />
                </HStack>

                <Input
                  placeholder="Email"
                  value={userForm.email}
                  onChangeText={(text) =>
                    setUserForm({ ...userForm, email: text })
                  }
                  keyboardType="email-address"
                />

                <HStack space={2}>
                  <Input
                    flex={1}
                    placeholder="Início da licença (YYYY-MM-DD)"
                    value={userForm.licenseStart}
                    onChangeText={(text) =>
                      setUserForm({ ...userForm, licenseStart: text })
                    }
                  />
                  <Input
                    flex={1}
                    placeholder="Fim da licença (YYYY-MM-DD)"
                    value={userForm.licenseEnd}
                    onChangeText={(text) =>
                      setUserForm({ ...userForm, licenseEnd: text })
                    }
                  />
                </HStack>
              </VStack>
            </ScrollView>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                onPress={() => {
                  setShowEditModal(false);
                  resetForms();
                }}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                onPress={handleUpdateUser}
                disabled={isSubmitting}
                isLoading={isSubmitting}
              >
                {isSubmitting ? "Atualizando..." : "Atualizar"}
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      >
        <Modal.Content maxWidth="400px">
          <Modal.Header>Alterar Senha</Modal.Header>
          <Modal.Body>
            <VStack space={4}>
              <Text color="gray.600">
                Usuário: <Text fontWeight="bold">{selectedUser?.name}</Text>
              </Text>
              <Input
                placeholder="Nova senha"
                value={passwordForm.newPassword}
                onChangeText={(text) =>
                  setPasswordForm({ ...passwordForm, newPassword: text })
                }
                type="password"
                secureTextEntry
              />
              <Input
                placeholder="Confirmar nova senha"
                value={passwordForm.confirmPassword}
                onChangeText={(text) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: text })
                }
                type="password"
                secureTextEntry
              />
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                onPress={() => {
                  setShowPasswordModal(false);
                  setPasswordForm({ newPassword: "", confirmPassword: "" });
                }}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                onPress={handleChangePassword}
                colorScheme="yellow"
                disabled={isSubmitting}
                isLoading={isSubmitting}
              >
                {isSubmitting ? "Alterando..." : "Alterar Senha"}
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {/* Delete Confirmation Alert */}
      <AlertDialog
        isOpen={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
      >
        <AlertDialog.Content>
          <AlertDialog.Header>Confirmar Exclusão</AlertDialog.Header>
          <AlertDialog.Body>
            Tem certeza que deseja excluir o usuário{" "}
            <Text fontWeight="bold">{selectedUser?.name}</Text>?
            {selectedUser?.type === 20 && (
              <Text color="red.500" mt={2}>
                ⚠️ Este é um usuário administrador!
              </Text>
            )}
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                onPress={() => setShowDeleteAlert(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onPress={handleDeleteUser}
                disabled={isSubmitting}
                isLoading={isSubmitting}
              >
                {isSubmitting ? "Excluindo..." : "Excluir"}
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </VStack>
  );
}
