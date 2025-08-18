import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Users: undefined;
  Clients: undefined;
  Home: undefined;
  Checkout: undefined;
  Debts: undefined;
  ClientDebts: undefined;
  Search: undefined;
};
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
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import MyButton from "../components/MyButton";
import { useCustomerService } from "../utils/hooks/useCustomerService";
import { useAuth } from "../utils/hooks/useAuth";
import {
  Customer,
  CustomerCreateRequest,
  CustomerUpdateRequest,
} from "../@types/api";

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

  // Filtered and sorted customers - Optimized with useMemo and useCallback
  const filteredCustomers = useMemo(() => {
    if (!customers.length) return [];

    let filtered = [...customers]; // Create a copy to avoid mutating original

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(query) ||
          customer.phone.includes(query)
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
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
    }

    return filtered;
  }, [customers, searchQuery, filterStatus, sortOrder]);

  const handleCreateCustomer = async () => {
    if (!customerForm.name || !customerForm.phone || !customerForm.birthday) {
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await createCustomer(customerForm);
      if (success) {
        setShowCreateModal(false);
        setCustomerForm({ name: "", phone: "", birthday: "" });
        // Refresh data
        await loadData();
      }
    } catch (error) {
      console.error("Error creating customer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCustomer = async () => {
    if (
      !selectedCustomer ||
      !customerForm.name ||
      !customerForm.phone ||
      !customerForm.birthday
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      const updateData: CustomerUpdateRequest = {
        id: selectedCustomer.id,
        ...customerForm,
      };

      const success = await updateCustomer(updateData);
      if (success) {
        setShowEditModal(false);
        setSelectedCustomer(null);
        setCustomerForm({ name: "", phone: "", birthday: "" });
        // Refresh data
        await loadData();
      }
    } catch (error) {
      console.error("Error updating customer:", error);
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
      name: customer.name,
      phone: customer.phone,
      birthday: customer.birthday,
    });
    setShowEditModal(true);
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
    <Box
      bg="white"
      p={4}
      mb={2}
      rounded="lg"
      shadow={2}
      borderLeftWidth={4}
      borderLeftColor={item.balance < 0 ? "red.500" : "green.500"}
    >
      <HStack justifyContent="space-between" alignItems="center">
        <VStack flex={1}>
          <HStack space={2} alignItems="center" mb={1}>
            <Text fontSize="lg" fontWeight="bold" color="primary.600">
              {item.name}
            </Text>
            {item.balance < 0 && (
              <Badge colorScheme="red" variant="solid" size="sm">
                Dívida
              </Badge>
            )}
            {item.balance === 0 && (
              <Badge colorScheme="gray" variant="solid" size="sm">
                Sem Dívida
              </Badge>
            )}
            {item.balance > 0 && (
              <Badge colorScheme="green" variant="solid" size="sm">
                Crédito
              </Badge>
            )}
          </HStack>
          <Text color="gray.600" fontSize="sm">
            {item.phone}
          </Text>
          <Text color="gray.500" fontSize="xs">
            {new Date(item.birthday).toLocaleDateString("pt-MZ")}
          </Text>
          <HStack space={2} mt={2} flexWrap="wrap">
            <Text fontSize="sm" color="gray.500">
              Cortes: {item.total_purchases}
            </Text>
            <Text fontSize="sm" color="gray.500">
              Total Pago:{" "}
              {typeof item.total_paid === "number"
                ? item.total_paid.toFixed(2)
                : "0.00"}{" "}
              MT
            </Text>
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
            icon={<Ionicons name="add-circle-outline" size={20} />}
            onPress={() => openDebtModal(item)}
            variant="ghost"
            colorScheme="red"
            size="sm"
          />
          <IconButton
            icon={<Ionicons name="card-outline" size={20} />}
            onPress={() => openPaymentModal(item)}
            variant="ghost"
            colorScheme="green"
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

  const renderDebtItem = ({ item }: { item: any }) => (
    <Box
      bg="white"
      p={4}
      mb={2}
      rounded="lg"
      shadow={1}
      borderLeftWidth={4}
      borderLeftColor={item.type === "DEBT" ? "red.500" : "green.500"}
    >
      <VStack space={2}>
        <HStack justifyContent="space-between" alignItems="center">
          <Text fontSize="md" fontWeight="bold" color="primary.600" flex={1}>
            {item.title}
          </Text>
          <Badge
            colorScheme={item.type === "DEBT" ? "red" : "green"}
            variant="solid"
            size="sm"
          >
            {item.type === "DEBT" ? "Dívida" : "Pagamento"}
          </Badge>
        </HStack>
        <Text color="gray.600" fontSize="sm">
          Cliente: {item.clients?.name}
        </Text>
        <HStack justifyContent="space-between" alignItems="center">
          <Text
            fontSize="lg"
            fontWeight="bold"
            color={item.type === "DEBT" ? "red.500" : "green.500"}
          >
            {item.type === "DEBT" ? "-" : "+"}
            {Math.abs(item.amount).toFixed(2)} MT
          </Text>
          <Text color="gray.500" fontSize="xs">
            {new Date(item.created_at).toLocaleDateString("pt-MZ")}
          </Text>
        </HStack>
      </VStack>
    </Box>
  );

  return (
    <VStack bg="primary.100" flex={1}>
      <Header title="Gestão de Clientes" back />

      <ScrollView flex={1} px={4}>
        {/* Search and Actions */}
        <Box bg="white" p={4} rounded="lg" mb={4} shadow={2}>
          <VStack space={4}>
            <HStack space={3} alignItems="center">
              <Input
                flex={1}
                placeholder="Pesquisar clientes..."
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
                title="Novo Cliente"
                onPress={() => setShowCreateModal(true)}
                bgColor="primary.500"
              />
              {isAdmin && (
                <MyButton
                  title="Gestão de Usuários"
                  onPress={() => navigation.navigate("Users")}
                  bgColor="secondary.500"
                />
              )}
            </HStack>

            {/* Filters */}
            <HStack space={4} alignItems="center" flexWrap="wrap">
              <Select
                selectedValue={filterStatus}
                onValueChange={(value) => setFilterStatus(value as any)}
                minWidth={120}
              >
                <Select.Item label="Todos os clientes" value="all" />
                <Select.Item label="Com dívidas" value="debt" />
                <Select.Item label="Sem dívidas" value="paid" />
              </Select>

              <Select
                selectedValue={sortOrder}
                onValueChange={(value) => setSortOrder(value as "asc" | "desc")}
                minWidth={120}
              >
                <Select.Item label="Mais recentes" value="desc" />
                <Select.Item label="Mais antigas" value="asc" />
              </Select>
            </HStack>

            <HStack space={4} alignItems="center" flexWrap="wrap">
              <Text fontSize="sm" color="gray.600">
                Total de Clientes: {customers.length}
              </Text>
              <Text fontSize="sm" color="gray.600">
                Filtrados: {filteredCustomers.length}
              </Text>
              <Text fontSize="sm" color="gray.600">
                Total de Dívidas: {debts?.total_debts || 0}
              </Text>
              <Text fontSize="sm" color="gray.600">
                Valor Total: {debts?.total_amount?.toFixed(2) || "0.00"} MT
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

        {/* Customers List */}
        <Box bg="white" p={4} rounded="lg" mb={4} shadow={2}>
          <Text fontSize="lg" fontWeight="bold" mb={4} color="primary.600">
            Lista de Clientes ({filteredCustomers.length})
          </Text>

          {loading ? (
            <Box alignItems="center" p={8}>
              <Spinner size="lg" color="primary.500" />
              <Text color="gray.500" mt={2}>
                Carregando clientes...
              </Text>
            </Box>
          ) : filteredCustomers.length > 0 ? (
            <FlatList
              data={filteredCustomers}
              renderItem={renderCustomerItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Box alignItems="center" p={8}>
              <Ionicons name="people-outline" size={48} color="#9ca3af" />
              <Text color="gray.500" mt={2} textAlign="center">
                {searchQuery || filterStatus !== "all"
                  ? "Nenhum cliente encontrado com os filtros aplicados"
                  : "Nenhum cliente encontrado"}
              </Text>
            </Box>
          )}
        </Box>

        {/* Debts List */}
        <Box bg="white" p={4} rounded="lg" mb={4} shadow={2}>
          <HStack justifyContent="space-between" alignItems="center" mb={4}>
            <Text fontSize="lg" fontWeight="bold" color="primary.600">
              Histórico de Dívidas
            </Text>
            <Select
              selectedValue={sortOrder}
              onValueChange={(value) => {
                setSortOrder(value as "asc" | "desc");
                getAllDebts({ sort: value as "asc" | "desc" });
              }}
              minWidth={120}
            >
              <Select.Item label="Mais recentes" value="desc" />
              <Select.Item label="Mais antigas" value="asc" />
            </Select>
          </HStack>

          {debts?.debts && debts.debts.length > 0 ? (
            <FlatList
              data={debts.debts}
              renderItem={renderDebtItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Box alignItems="center" p={8}>
              <Ionicons name="receipt-outline" size={48} color="#9ca3af" />
              <Text color="gray.500" mt={2}>
                Nenhuma dívida encontrada
              </Text>
            </Box>
          )}
        </Box>
      </ScrollView>

      {/* Create Customer Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.Header>Criar Novo Cliente</Modal.Header>
          <Modal.Body>
            <VStack space={4}>
              <Input
                placeholder="Nome completo"
                value={customerForm.name}
                onChangeText={(text) =>
                  setCustomerForm({ ...customerForm, name: text })
                }
              />
              <Input
                placeholder="Telefone"
                value={customerForm.phone}
                onChangeText={(text) =>
                  setCustomerForm({ ...customerForm, phone: text })
                }
                keyboardType="phone-pad"
              />
              <Input
                placeholder="Data de nascimento (YYYY-MM-DD)"
                value={customerForm.birthday}
                onChangeText={(text) =>
                  setCustomerForm({ ...customerForm, birthday: text })
                }
              />
            </VStack>
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
                onPress={handleCreateCustomer}
                disabled={isSubmitting}
                isLoading={isSubmitting}
              >
                {isSubmitting ? "Criando..." : "Criar"}
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {/* Edit Customer Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.Header>Editar Cliente</Modal.Header>
          <Modal.Body>
            <VStack space={4}>
              <Input
                placeholder="Nome completo"
                value={customerForm.name}
                onChangeText={(text) =>
                  setCustomerForm({ ...customerForm, name: text })
                }
              />
              <Input
                placeholder="Telefone"
                value={customerForm.phone}
                onChangeText={(text) =>
                  setCustomerForm({ ...customerForm, phone: text })
                }
                keyboardType="phone-pad"
              />
              <Input
                placeholder="Data de nascimento (YYYY-MM-DD)"
                value={customerForm.birthday}
                onChangeText={(text) =>
                  setCustomerForm({ ...customerForm, birthday: text })
                }
              />
            </VStack>
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
                onPress={handleUpdateCustomer}
                disabled={isSubmitting}
                isLoading={isSubmitting}
              >
                {isSubmitting ? "Atualizando..." : "Atualizar"}
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {/* Add Debt Modal */}
      <Modal isOpen={showDebtModal} onClose={() => setShowDebtModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.Header>Adicionar Dívida</Modal.Header>
          <Modal.Body>
            <VStack space={4}>
              <Text color="gray.600">
                Cliente: <Text fontWeight="bold">{selectedCustomer?.name}</Text>
              </Text>
              <Input
                placeholder="Valor da dívida"
                value={debtAmount}
                onChangeText={setDebtAmount}
                keyboardType="numeric"
              />
              <Input
                placeholder="Descrição da dívida"
                value={debtDescription}
                onChangeText={setDebtDescription}
              />
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                onPress={() => {
                  setShowDebtModal(false);
                  resetForms();
                }}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                onPress={handleAddDebt}
                colorScheme="red"
                disabled={isSubmitting}
                isLoading={isSubmitting}
              >
                {isSubmitting ? "Adicionando..." : "Adicionar Dívida"}
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
      >
        <Modal.Content maxWidth="400px">
          <Modal.Header>Processar Pagamento</Modal.Header>
          <Modal.Body>
            <VStack space={4}>
              <Text color="gray.600">
                Cliente: <Text fontWeight="bold">{selectedCustomer?.name}</Text>
              </Text>
              <Text color="gray.600">
                Saldo atual:{" "}
                <Text
                  fontWeight="bold"
                  color={
                    (selectedCustomer?.balance ?? 0) < 0
                      ? "red.500"
                      : "green.500"
                  }
                >
                  {typeof selectedCustomer?.balance === "number"
                    ? selectedCustomer.balance.toFixed(2)
                    : "0.00"}{" "}
                  MT
                </Text>
              </Text>
              <Input
                placeholder="Valor do pagamento"
                value={paymentAmount}
                onChangeText={setPaymentAmount}
                keyboardType="numeric"
              />
              <Input
                placeholder="Descrição do pagamento"
                value={paymentDescription}
                onChangeText={setPaymentDescription}
              />
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                onPress={() => {
                  setShowPaymentModal(false);
                  resetForms();
                }}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                onPress={handlePayDebt}
                colorScheme="green"
                disabled={isSubmitting}
                isLoading={isSubmitting}
              >
                {isSubmitting ? "Processando..." : "Processar Pagamento"}
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {/* Delete Confirmation Alert */}
      <AlertDialog
        isOpen={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
        leastDestructiveRef={React.useRef(null)}
      >
        <AlertDialog.Content>
          <AlertDialog.Header>Confirmar Exclusão</AlertDialog.Header>
          <AlertDialog.Body>
            Tem certeza que deseja excluir o cliente{" "}
            <Text fontWeight="bold">{selectedCustomer?.name}</Text>?
            {(selectedCustomer?.balance ?? 0) < 0 && (
              <Text color="red.500" mt={2}>
                ⚠️ Este cliente possui dívidas pendentes!
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
                onPress={handleDeleteCustomer}
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
