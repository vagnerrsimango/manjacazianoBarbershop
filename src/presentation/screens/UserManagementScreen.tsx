import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../presentation/components/Button";

import { Input } from "../components/Input";
import { useUsers } from "../hooks/useUsers";
import { UserUseCases } from "../../core/useCases/UserUseCases";
import { UserRepository } from "../../core/repositories/UserRepository";
import {
  User,
  UserCreateRequest,
  UserUpdateRequest,
} from "../../core/entities/User";

// Mock repository implementation (replace with real API)
class MockUserRepository implements UserRepository {
  private users: User[] = [
    {
      id: 1,
      name: "Admin User",
      surname: "System",
      type: 20,
      email: "admin@example.com",
      balance: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  async getAllUsers(): Promise<User[]> {
    return Promise.resolve(this.users);
  }

  async getUserById(id: number): Promise<User> {
    const user = this.users.find((u) => u.id === id);
    if (!user) throw new Error("User not found");
    return Promise.resolve(user);
  }

  async createUser(data: UserCreateRequest): Promise<User> {
    const newUser: User = {
      id: this.users.length + 1,
      ...data,
      balance: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.users.push(newUser);
    return Promise.resolve(newUser);
  }

  async updateUser(data: UserUpdateRequest): Promise<User> {
    const index = this.users.findIndex((u) => u.id === data.id);
    if (index === -1) throw new Error("User not found");

    this.users[index] = {
      ...this.users[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return Promise.resolve(this.users[index]);
  }

  async deleteUser(id: number): Promise<string> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error("User not found");

    this.users.splice(index, 1);
    return Promise.resolve("User deleted successfully");
  }

  async changeUserPassword(data: {
    id: number;
    newPassword: string;
  }): Promise<string> {
    return Promise.resolve("Password changed successfully");
  }

  async searchUsers(query: string): Promise<User[]> {
    const results = this.users.filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        (user.surname &&
          user.surname.toLowerCase().includes(query.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(query.toLowerCase()))
    );
    return Promise.resolve(results);
  }
}

const userRepository = new MockUserRepository();
const userUseCases = new UserUseCases(userRepository);

export default function UserManagementScreen() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "admin" | "user">("all");

  const {
    useGetAllUsers,
    useCreateUser,
    useUpdateUser,
    useDeleteUser,
    useChangePassword,
    useSearchUsers,
  } = useUsers(userUseCases);

  const { data: users = [], isLoading, error } = useGetAllUsers();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const changePasswordMutation = useChangePassword();

  // Form states
  const [userForm, setUserForm] = useState<UserCreateRequest>({
    name: "",
    surname: "",
    type: 12,
    email: "",
    password: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // Filtered users
  const filteredUsers = useMemo(() => {
    let filtered = users;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          (user.surname && user.surname.toLowerCase().includes(query)) ||
          (user.email && user.email.toLowerCase().includes(query))
      );
    }

    if (filterType === "admin") {
      filtered = filtered.filter((user) => user.type === 20);
    } else if (filterType === "user") {
      filtered = filtered.filter((user) => user.type !== 20);
    }

    return filtered;
  }, [users, searchQuery, filterType]);

  const handleCreateUser = useCallback(async () => {
    if (!userForm.name || !userForm.type || !userForm.password) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      await createUserMutation.mutateAsync(userForm);
      setShowCreateModal(false);
      resetForms();
    } catch (error) {
      Alert.alert("Error", "Failed to create user");
    }
  }, [userForm, createUserMutation]);

  const handleUpdateUser = useCallback(async () => {
    if (!selectedUser || !userForm.name) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      const updateData: UserUpdateRequest = {
        id: selectedUser.id,
        ...userForm,
      };
      await updateUserMutation.mutateAsync(updateData);
      setShowEditModal(false);
      resetForms();
    } catch (error) {
      Alert.alert("Error", "Failed to update user");
    }
  }, [selectedUser, userForm, updateUserMutation]);

  const handleDeleteUser = useCallback(
    async (user: User) => {
      Alert.alert(
        "Confirm Delete",
        `Are you sure you want to delete ${user.name}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                await deleteUserMutation.mutateAsync(user.id);
              } catch (error) {
                Alert.alert("Error", "Failed to delete user");
              }
            },
          },
        ]
      );
    },
    [deleteUserMutation]
  );

  const handleChangePassword = useCallback(async () => {
    if (
      !selectedUser ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      Alert.alert("Error", "Please fill in all password fields");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        id: selectedUser.id,
        newPassword: passwordForm.newPassword,
      });
      setShowPasswordModal(false);
      resetForms();
      Alert.alert("Success", "Password changed successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to change password");
    }
  }, [selectedUser, passwordForm, changePasswordMutation]);

  const resetForms = useCallback(() => {
    setUserForm({ name: "", surname: "", type: 12, email: "", password: "" });
    setPasswordForm({ newPassword: "", confirmPassword: "" });
    setSelectedUser(null);
  }, []);

  const openEditModal = useCallback((user: User) => {
    setSelectedUser(user);
    setUserForm({
      name: user.name,
      surname: user.surname || "",
      type: user.type,
      email: user.email || "",
      password: "",
    });
    setShowEditModal(true);
  }, []);

  const openPasswordModal = useCallback((user: User) => {
    setSelectedUser(user);
    setShowPasswordModal(true);
  }, []);

  const getUserTypeLabel = useCallback((type: number) => {
    switch (type) {
      case 20:
        return { label: "Admin", color: "danger" as const };
      case 15:
        return { label: "Manager", color: "warning" as const };
      case 12:
        return { label: "User", color: "success" as const };
      default:
        return { label: `Type ${type}`, color: "primary" as const };
    }
  }, []);

  const renderUserItem = useCallback(
    ({ item }: { item: User }) => {
      const typeInfo = getUserTypeLabel(item.type);

      return (
        <View className="card mb-3">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <View className="flex-row items-center mb-2">
                <Text className="text-lg font-bold text-gray-900 mr-2">
                  {item.name} {item.surname}
                </Text>
                <View className={`badge badge-${typeInfo.color}`}>
                  <Text className="text-xs font-medium">{typeInfo.label}</Text>
                </View>
              </View>

              {item.email && (
                <Text className="text-gray-600 text-sm mb-1">{item.email}</Text>
              )}

              <Text className="text-gray-500 text-xs">
                ID: {item.id} • Type: {item.type}
              </Text>
            </View>

            <View className="flex-row space-x-2">
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
                onPress={() => handleDeleteUser(item)}
                className="p-2 bg-red-100 rounded-full"
              >
                <Ionicons name="trash-outline" size={20} color="#DC2626" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    },
    [getUserTypeLabel, openEditModal, openPasswordModal, handleDeleteUser]
  );

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#0052A3" />
        <Text className="text-gray-500 mt-2">Loading users...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-red-500 text-center">Error loading users</Text>
        <Button title="Retry" onPress={() => {}} variant="primary" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white p-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          User Management
        </Text>

        <View className="flex-row space-x-3 mb-4">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ flex: 1 }}
          />
          <Button
            title="New User"
            onPress={() => setShowCreateModal(true)}
            variant="primary"
            size="md"
          />
        </View>

        <View className="flex-row space-x-2">
          <TouchableOpacity
            onPress={() => setFilterType("all")}
            className={`px-3 py-2 rounded-full ${
              filterType === "all" ? "bg-primary-500" : "bg-gray-200"
            }`}
          >
            <Text
              className={filterType === "all" ? "text-white" : "text-gray-700"}
            >
              All ({users.length})
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
              Admins ({users.filter((u) => u.type === 20).length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilterType("user")}
            className={`px-3 py-2 rounded-full ${
              filterType === "user" ? "bg-green-500" : "bg-gray-200"
            }`}
          >
            <Text
              className={filterType === "user" ? "text-white" : "text-gray-700"}
            >
              Users ({users.filter((u) => u.type !== 20).length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id.toString()}
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <Ionicons name="people-outline" size={64} color="#9CA3AF" />
            <Text className="text-gray-500 text-center mt-4">
              {searchQuery || filterType !== "all"
                ? "No users found with the applied filters"
                : "No users found"}
            </Text>
          </View>
        }
      />

      {/* Create User Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className="flex-1 bg-white">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-xl font-bold">Create New User</Text>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4">
            <Input
              label="Name *"
              placeholder="Enter full name"
              value={userForm.name}
              onChangeText={(text) => setUserForm({ ...userForm, name: text })}
            />

            <Input
              label="Surname"
              placeholder="Enter surname"
              value={userForm.surname}
              onChangeText={(text) =>
                setUserForm({ ...userForm, surname: text })
              }
            />

            <Input
              label="Email"
              placeholder="Enter email address"
              value={userForm.email}
              onChangeText={(text) => setUserForm({ ...userForm, email: text })}
              keyboardType="email-address"
            />

            <Input
              label="Password *"
              placeholder="Enter password (min 6 chars)"
              value={userForm.password}
              onChangeText={(text) =>
                setUserForm({ ...userForm, password: text })
              }
              secureTextEntry
            />

            <View className="mt-6 space-y-3">
              <Button
                title="Create User"
                onPress={handleCreateUser}
                variant="primary"
                loading={createUserMutation.isPending}
                disabled={createUserMutation.isPending}
              />

              <Button
                title="Cancel"
                onPress={() => setShowCreateModal(false)}
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
            <Text className="text-xl font-bold">Edit User</Text>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4">
            <Input
              label="Name *"
              placeholder="Enter full name"
              value={userForm.name}
              onChangeText={(text) => setUserForm({ ...userForm, name: text })}
            />

            <Input
              label="Surname"
              placeholder="Enter surname"
              value={userForm.surname}
              onChangeText={(text) =>
                setUserForm({ ...userForm, surname: text })
              }
            />

            <Input
              label="Email"
              placeholder="Enter email address"
              value={userForm.email}
              onChangeText={(text) => setUserForm({ ...userForm, email: text })}
              keyboardType="email-address"
            />

            <View className="mt-6 space-y-3">
              <Button
                title="Update User"
                onPress={handleUpdateUser}
                variant="primary"
                loading={updateUserMutation.isPending}
                disabled={updateUserMutation.isPending}
              />

              <Button
                title="Cancel"
                onPress={() => setShowEditModal(false)}
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
            <Text className="text-xl font-bold">Change Password</Text>
            <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4">
            <Text className="text-gray-600 mb-4">
              User: <Text className="font-bold">{selectedUser?.name}</Text>
            </Text>

            <Input
              label="New Password *"
              placeholder="Enter new password"
              value={passwordForm.newPassword}
              onChangeText={(text) =>
                setPasswordForm({ ...passwordForm, newPassword: text })
              }
              secureTextEntry
            />

            <Input
              label="Confirm Password *"
              placeholder="Confirm new password"
              value={passwordForm.confirmPassword}
              onChangeText={(text) =>
                setPasswordForm({ ...passwordForm, confirmPassword: text })
              }
              secureTextEntry
            />

            <View className="mt-6 space-y-3">
              <Button
                title="Change Password"
                onPress={handleChangePassword}
                variant="warning"
                loading={changePasswordMutation.isPending}
                disabled={changePasswordMutation.isPending}
              />

              <Button
                title="Cancel"
                onPress={() => setShowPasswordModal(false)}
                variant="ghost"
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
