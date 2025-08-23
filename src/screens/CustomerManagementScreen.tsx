import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
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
import { Button } from "../presentation/components/Button";

import Input from "../components/Input";
import GlobalNavigation from "../components/GlobalNavigation";
import { useCustomerService } from "../utils/hooks/useCustomerService";
import { useAuth } from "../utils/hooks/useAuth";
import {
  Customer,
  CustomerCreateRequest,
  CustomerUpdateRequest,
} from "../@types/api";

type RootStackParamList = {
  Home: undefined;
  Checkout: undefined;
  Clients: undefined;
  Users: undefined;
  ServiceSelection: undefined;
  Debts: undefined;
  ClientDebts: undefined;
  Search: undefined;
};

export default function CustomerManagementScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDebtModal, setShowDebtModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterStatus, setFilterStatus] = useState<"all" | "debt" | "paid">(
    "all"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [customerForm, setCustomerForm] = useState<CustomerCreateRequest>({
    name: "",
    phone: "",
    birthday: "",
  });
  const [debtAmount, setDebtAmount] = useState("");
  const [debtDescription, setDebtDescription] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDescription, setPaymentDescription] = useState("");

  // Date inputs state
  const [dayInput, setDayInput] = useState("");
  const [monthInput, setMonthInput] = useState("");
  const [yearInput, setYearInput] = useState("");

  const { isAdmin } = useAuth();

  const {
    customers,
    debts,
    loading,
    error,
    getAllCustomers,
    getAllDebts,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    addDebt,
    payDebt,
    searchCustomers,
    clearError,
  } = useCustomerService();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([getAllCustomers(), getAllDebts()]);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "Selecionar data";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR");
    } catch {
      return "Data inválida";
    }
  };

  // Filtered and sorted customers - Optimized with useMemo and useCallback
  const filteredCustomers = useMemo(() => {
    if (!customers.length) return [];

    let filtered = [...customers]; // Create a copy to avoid mutating original

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (customer) =>
          (customer.name && customer.name.toLowerCase().includes(query)) ||
          (customer.phone && String(customer.phone).includes(query))
      );
    }

    // Apply status filter
    if (filterStatus === "debt") {
      filtered = filtered.filter((customer) => customer.balance < 0);
    } else if (filterStatus === "paid") {
      filtered = filtered.filter((customer) => customer.balance > 0);
    }

    // Apply sorting - only if needed
    if (sortOrder !== "desc") {
      filtered.sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
    }

    return filtered;
  }, [customers, searchQuery, filterStatus, sortOrder]);

  const handleCreateCustomer = async () => {
    // Check required fields and provide feedback
    if (!customerForm.name.trim()) {
      Alert.alert("Erro", "Por favor, insira o nome do cliente");
      return;
    }
    if (!customerForm.phone.trim()) {
      Alert.alert("Erro", "Por favor, insira o telefone do cliente");
      return;
    }
    if (!dayInput || !monthInput || !yearInput) {
      Alert.alert(
        "Erro",
        "Por favor, preencha todos os campos da data de nascimento"
      );
      return;
    }

    // Concatenate date inputs
    const formattedDate = `${yearInput}-${monthInput.padStart(2, "0")}-${dayInput.padStart(2, "0")}`;
    const customerDataWithDate = { ...customerForm, birthday: formattedDate };

    setIsSubmitting(true);
    try {
      const success = await createCustomer(customerDataWithDate);
      if (success) {
        Alert.alert("Sucesso", "Cliente criado com sucesso!");
        closeCreateModal();
        // Refresh data
        await loadData();
      } else {
        Alert.alert("Erro", "Falha ao criar cliente. Tente novamente.");
      }
    } catch (error) {
      console.error("Error creating customer:", error);
      Alert.alert(
        "Erro",
        "Ocorreu um erro ao criar o cliente. Tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCustomer = async () => {
    // Check required fields and provide feedback
    if (!selectedCustomer) {
      Alert.alert("Erro", "Cliente não selecionado");
      return;
    }
    if (!customerForm.name.trim()) {
      Alert.alert("Erro", "Por favor, insira o nome do cliente");
      return;
    }
    if (!customerForm.phone.trim()) {
      Alert.alert("Erro", "Por favor, insira o telefone do cliente");
      return;
    }
    if (!dayInput || !monthInput || !yearInput) {
      Alert.alert(
        "Erro",
        "Por favor, preencha todos os campos da data de nascimento"
      );
      return;
    }

    // Concatenate date inputs
    const formattedDate = `${yearInput}-${monthInput.padStart(2, "0")}-${dayInput.padStart(2, "0")}`;
    const updateData: CustomerUpdateRequest = {
      id: selectedCustomer.id,
      name: customerForm.name,
      phone: customerForm.phone,
      birthday: formattedDate,
    };

    setIsSubmitting(true);
    try {
      const success = await updateCustomer(updateData);
      if (success) {
        Alert.alert("Sucesso", "Cliente atualizado com sucesso!");
        closeEditModal();
        // Refresh data
        await loadData();
      } else {
        Alert.alert("Erro", "Falha ao atualizar cliente. Tente novamente.");
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      Alert.alert(
        "Erro",
        "Ocorreu um erro ao atualizar o cliente. Tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return;

    setIsSubmitting(true);
    try {
      const success = await deleteCustomer(selectedCustomer.id);
      if (success) {
        setShowDeleteAlert(false);
        setSelectedCustomer(null);
        // Refresh data
        await loadData();
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddDebt = async () => {
    if (!selectedCustomer || !debtAmount || !debtDescription) {
      return;
    }

    const amount = parseFloat(debtAmount);
    if (isNaN(amount) || amount <= 0) return;

    setIsSubmitting(true);
    try {
      const success = await addDebt({
        clientId: selectedCustomer.id,
        amount,
        description: debtDescription,
        paymentMethodId: 1,
        userId: 1,
      });

      if (success) {
        setShowDebtModal(false);
        setDebtAmount("");
        setDebtDescription("");
        setSelectedCustomer(null);
        // Refresh data
        await loadData();
      }
    } catch (error) {
      console.error("Error adding debt:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayDebt = async () => {
    if (!selectedCustomer || !paymentAmount || !paymentDescription) {
      return;
    }

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) return;

    setIsSubmitting(true);
    try {
      const success = await payDebt({
        clientId: selectedCustomer.id,
        amount,
        description: paymentDescription,
        paymentMethodId: 1,
        userId: 1,
      });

      if (success) {
        setShowPaymentModal(false);
        setPaymentAmount("");
        setPaymentDescription("");
        setSelectedCustomer(null);
        // Refresh data
        await loadData();
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Debounced search to improve performance
  const handleSearch = useCallback(async () => {
    if (searchQuery.length >= 2) {
      try {
        await searchCustomers({ query: searchQuery });
      } catch (error) {
        console.error("Search error:", error);
        // Fallback to local filtering
      }
    } else {
      await getAllCustomers();
    }
  }, [searchQuery, searchCustomers, getAllCustomers]);

  const openEditModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerForm({
      name: customer.name || "",
      phone: customer.phone || "",
      birthday: customer.birthday || "",
    });

    // Parse existing birthday into separate inputs
    if (customer.birthday) {
      const date = new Date(customer.birthday);
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

  const openCreateModal = () => {
    setCustomerForm({ name: "", phone: "", birthday: "" });
    setDayInput("");
    setMonthInput("");
    setYearInput("");
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setCustomerForm({ name: "", phone: "", birthday: "" });
    setDayInput("");
    setMonthInput("");
    setYearInput("");
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedCustomer(null);
    setCustomerForm({ name: "", phone: "", birthday: "" });
    setDayInput("");
    setMonthInput("");
    setYearInput("");
  };

  const openDebtModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDebtModal(true);
  };

  const openPaymentModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowPaymentModal(true);
  };

  const openDeleteAlert = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDeleteAlert(true);
  };

  const resetForms = () => {
    setCustomerForm({ name: "", phone: "", birthday: "" });
    setDebtAmount("");
    setDebtDescription("");
    setPaymentAmount("");
    setPaymentDescription("");
    setSelectedCustomer(null);
  };

  const renderCustomerItem = ({ item }: { item: Customer }) => (
    <View className="bg-white p-4 mb-2 rounded-lg shadow-sm border-l-4 border-l-red-500">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <Text className="text-lg font-bold text-primary-600 mr-2">
              {item.name}
            </Text>
            {item.balance < 0 && (
              <View className="bg-red-500 px-2 py-1 rounded-full">
                <Text className="text-white text-xs font-medium">Dívida</Text>
              </View>
            )}
            {item.balance === 0 && (
              <View className="bg-gray-500 px-2 py-1 rounded-full">
                <Text className="text-white text-xs font-medium">
                  Sem Dívida
                </Text>
              </View>
            )}
            {item.balance > 0 && (
              <View className="bg-green-500 px-2 py-1 rounded-full">
                <Text className="text-white text-xs font-medium">Crédito</Text>
              </View>
            )}
          </View>
          <Text className="text-gray-600 text-sm mb-1">{item.phone}</Text>
          <Text className="text-gray-500 text-xs mb-2">
            {new Date(item.birthday).toLocaleDateString("pt-MZ")}
          </Text>
          <View className="flex-row space-x-2 flex-wrap">
            <Text className="text-sm text-gray-500">
              Cortes: {item.total_purchases}
            </Text>
            <Text className="text-sm text-gray-500">
              Total Pago:{" "}
              {typeof item.total_paid === "number"
                ? item.total_paid.toFixed(2)
                : "0.00"}{" "}
              MT
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
            onPress={() => openDebtModal(item)}
            className="p-2 bg-red-100 rounded-full"
          >
            <Ionicons name="add-circle-outline" size={20} color="#DC2626" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => openPaymentModal(item)}
            className="p-2 bg-green-100 rounded-full"
          >
            <Ionicons name="card-outline" size={20} color="#16A34A" />
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

  const renderDebtItem = ({ item }: { item: any }) => (
    <View className="bg-white p-4 mb-2 rounded-lg shadow-sm border-l-4 border-l-red-500">
      <View className="space-y-2">
        <View className="flex-row justify-between items-center">
          <Text className="text-base font-bold text-primary-600 flex-1">
            {item.title}
          </Text>
          <View
            className={`px-2 py-1 rounded-full ${
              item.type === "DEBT" ? "bg-red-500" : "bg-green-500"
            }`}
          >
            <Text className="text-white text-xs font-medium">
              {item.type === "DEBT" ? "Dívida" : "Pagamento"}
            </Text>
          </View>
        </View>
        <Text className="text-gray-600 text-sm">
          Cliente: {item.clients?.name}
        </Text>
        <View className="flex-row justify-between items-center">
          <Text
            className={`text-lg font-bold ${
              item.type === "DEBT" ? "text-red-500" : "text-green-500"
            }`}
          >
            {item.type === "DEBT" ? "-" : "+"}
            {Math.abs(item.amount).toFixed(2)} MT
          </Text>
          <Text className="text-gray-500 text-xs">
            {new Date(item.created_at).toLocaleDateString("pt-MZ")}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Global Navigation Bar */}
      <GlobalNavigation title="Gestão de Clientes" />

      {/* Main Content */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Search and Actions Section */}
        <View className="bg-white border-b border-gray-200 p-4">
          <View className="space-y-4">
            {/* Search Bar and Buttons */}
            <View className="flex-row space-x-3 items-center">
              <Input
                placeholder="Pesquisar clientes..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{ flex: 1 }}
              />
              <Button
                title="Novo Cliente"
                onPress={openCreateModal}
                variant="primary"
                size="md"
              />
              {isAdmin && (
                <Button
                  title="Gestão de Usuários"
                  onPress={() => navigation.navigate("Users")}
                  variant="secondary"
                  size="md"
                />
              )}
            </View>

            {/* Filters */}
            <View className="flex-row space-x-3 items-center flex-wrap">
              <TouchableOpacity
                onPress={() => setFilterStatus("all")}
                className={`px-4 py-2 rounded-lg border ${
                  filterStatus === "all"
                    ? "bg-primary-500 border-primary-500"
                    : "bg-white border-gray-300"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    filterStatus === "all" ? "text-white" : "text-gray-700"
                  }`}
                >
                  Todos
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setFilterStatus("debt")}
                className={`px-4 py-2 rounded-lg border ${
                  filterStatus === "debt"
                    ? "bg-red-500 border-red-500"
                    : "bg-white border-gray-300"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    filterStatus === "debt" ? "text-white" : "text-gray-700"
                  }`}
                >
                  Com dívidas
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setFilterStatus("paid")}
                className={`px-4 py-2 rounded-lg border ${
                  filterStatus === "paid"
                    ? "bg-green-500 border-green-500"
                    : "bg-white border-gray-300"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    filterStatus === "paid" ? "text-white" : "text-gray-700"
                  }`}
                >
                  Sem dívidas
                </Text>
              </TouchableOpacity>
            </View>

            {/* Stats Cards */}
            <View className="grid grid-cols-2 gap-3">
              <View className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <Text className="text-xs text-gray-500 font-medium">
                  Total de Clientes
                </Text>
                <Text className="text-lg font-bold text-gray-900">
                  {customers.length}
                </Text>
              </View>
              <View className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <Text className="text-xs text-gray-500 font-medium">
                  Filtrados
                </Text>
                <Text className="text-lg font-bold text-gray-900">
                  {filteredCustomers.length}
                </Text>
              </View>
              <View className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <Text className="text-xs text-gray-500 font-medium">
                  Total de Dívidas
                </Text>
                <Text className="text-lg font-bold text-gray-900">
                  {debts?.total_debts || 0}
                </Text>
              </View>
              <View className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <Text className="text-xs text-gray-500 font-medium">
                  Valor Total
                </Text>
                <Text className="text-lg font-bold text-gray-900">
                  {debts?.total_amount?.toFixed(2) || "0.00"} MT
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Error Display */}
        {error && (
          <View className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <View className="flex-row space-x-2 items-center">
              <Ionicons name="alert-circle" size={20} color="#DC2626" />
              <Text className="text-red-700 flex-1 text-sm">{error}</Text>
              <TouchableOpacity onPress={clearError} className="p-1">
                <Ionicons name="close" size={16} color="#DC2626" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Content Sections */}
        <View className="p-4 space-y-4">
          {/* Customers List Section */}
          <View className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <View className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-3">
              <Text className="text-white font-semibold text-lg">
                Lista de Clientes ({filteredCustomers.length})
              </Text>
            </View>

            <View className="p-4">
              {loading ? (
                <View className="items-center py-8">
                  <ActivityIndicator size="large" color="#0052A3" />
                  <Text className="text-gray-500 mt-3 font-medium">
                    Carregando clientes...
                  </Text>
                </View>
              ) : filteredCustomers.length > 0 ? (
                <FlatList
                  data={filteredCustomers}
                  renderItem={renderCustomerItem}
                  keyExtractor={(item) => item.id.toString()}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={false}
                />
              ) : (
                <View className="items-center py-8">
                  <Ionicons name="people-outline" size={48} color="#9CA3AF" />
                  <Text className="text-gray-500 mt-3 text-center font-medium">
                    {searchQuery || filterStatus !== "all"
                      ? "Nenhum cliente encontrado com os filtros aplicados"
                      : "Nenhum cliente encontrado"}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Debts List Section */}
          <View className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <View className="bg-gradient-to-r from-red-500 to-red-600 px-4 py-3">
              <Text className="text-white font-semibold text-lg">
                Histórico de Dívidas
              </Text>
            </View>

            <View className="p-4">
              {debts?.debts && debts.debts.length > 0 ? (
                <FlatList
                  data={debts.debts}
                  renderItem={renderDebtItem}
                  keyExtractor={(item) => item.id.toString()}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={false}
                />
              ) : (
                <View className="items-center py-8">
                  <Ionicons name="receipt-outline" size={48} color="#9CA3AF" />
                  <Text className="text-gray-500 mt-3 font-medium">
                    Nenhuma dívida encontrada
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Create Customer Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className="flex-1 bg-white">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-xl font-bold">Criar Novo Cliente</Text>
            <TouchableOpacity onPress={closeCreateModal}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4">
            <Input
              label="Nome completo"
              placeholder="Digite o nome completo"
              value={customerForm.name}
              onChangeText={(text) =>
                setCustomerForm({ ...customerForm, name: text })
              }
            />
            <Input
              label="Telefone"
              placeholder="Digite o telefone"
              value={customerForm.phone}
              onChangeText={(text) =>
                setCustomerForm({ ...customerForm, phone: text })
              }
              keyboardType="phone-pad"
            />

            {/* Birthday Date Picker */}
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

            <View className="mt-6 space-y-3">
              <Button
                title="Criar Cliente"
                onPress={handleCreateCustomer}
                variant="primary"
                loading={isSubmitting}
                disabled={isSubmitting}
              />

              <Button
                title="Cancelar"
                onPress={closeCreateModal}
                variant="ghost"
              />
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Edit Customer Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className="flex-1 bg-white">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-xl font-bold">Editar Cliente</Text>
            <TouchableOpacity onPress={closeEditModal}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4">
            <Input
              label="Nome completo"
              placeholder="Digite o nome completo"
              value={customerForm.name}
              onChangeText={(text) =>
                setCustomerForm({ ...customerForm, name: text })
              }
            />
            <Input
              label="Telefone"
              placeholder="Digite o telefone"
              value={customerForm.phone}
              onChangeText={(text) =>
                setCustomerForm({ ...customerForm, phone: text })
              }
              keyboardType="phone-pad"
            />

            {/* Birthday Date Picker */}
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

            <View className="mt-6 space-y-3">
              <Button
                title="Atualizar Cliente"
                onPress={handleUpdateCustomer}
                variant="primary"
                loading={isSubmitting}
                disabled={isSubmitting}
              />

              <Button
                title="Cancelar"
                onPress={closeEditModal}
                variant="ghost"
              />
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Add Debt Modal */}
      <Modal
        visible={showDebtModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className="flex-1 bg-white">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-xl font-bold">Adicionar Dívida</Text>
            <TouchableOpacity onPress={() => setShowDebtModal(false)}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4">
            <Text className="text-gray-600 mb-4">
              Cliente:{" "}
              <Text className="font-bold">{selectedCustomer?.name}</Text>
            </Text>
            <Input
              label="Valor da dívida"
              placeholder="Digite o valor"
              value={debtAmount}
              onChangeText={setDebtAmount}
              keyboardType="numeric"
            />
            <Input
              label="Descrição da dívida"
              placeholder="Digite a descrição"
              value={debtDescription}
              onChangeText={setDebtDescription}
            />

            <View className="mt-6 space-y-3">
              <Button
                title="Adicionar Dívida"
                onPress={handleAddDebt}
                variant="danger"
                loading={isSubmitting}
                disabled={isSubmitting}
              />

              <Button
                title="Cancelar"
                onPress={() => setShowDebtModal(false)}
                variant="ghost"
              />
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className="flex-1 bg-white">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-xl font-bold">Processar Pagamento</Text>
            <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4">
            <Text className="text-gray-600 mb-2">
              Cliente:{" "}
              <Text className="font-bold">{selectedCustomer?.name}</Text>
            </Text>
            <Text className="text-gray-600 mb-4">
              Saldo atual:{" "}
              <Text
                className={`font-bold ${
                  (selectedCustomer?.balance ?? 0) < 0
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {typeof selectedCustomer?.balance === "number"
                  ? selectedCustomer.balance.toFixed(2)
                  : "0.00"}{" "}
                MT
              </Text>
            </Text>
            <Input
              label="Valor do pagamento"
              placeholder="Digite o valor"
              value={paymentAmount}
              onChangeText={setPaymentAmount}
              keyboardType="numeric"
            />
            <Input
              label="Descrição do pagamento"
              placeholder="Digite a descrição"
              value={paymentDescription}
              onChangeText={setPaymentDescription}
            />

            <View className="mt-6 space-y-3">
              <Button
                title="Processar Pagamento"
                onPress={handlePayDebt}
                variant="success"
                loading={isSubmitting}
                disabled={isSubmitting}
              />

              <Button
                title="Cancelar"
                onPress={() => setShowPaymentModal(false)}
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
              Tem certeza que deseja excluir o cliente{" "}
              <Text className="font-bold">{selectedCustomer?.name}</Text>?
            </Text>
            {(selectedCustomer?.balance ?? 0) < 0 && (
              <Text className="text-red-500 mb-4">
                ⚠️ Este cliente possui dívidas pendentes!
              </Text>
            )}

            <View className="flex-row space-x-3">
              <Button
                title="Cancelar"
                onPress={() => setShowDeleteAlert(false)}
                variant="ghost"
                style={{ flex: 1 }}
              />
              <Button
                title="Excluir"
                onPress={handleDeleteCustomer}
                variant="danger"
                loading={isSubmitting}
                disabled={isSubmitting}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      )}

      {/* Date Picker */}
      {/* This modal is no longer needed as date inputs are used directly */}
    </View>
  );
}
