import React, { useEffect, useState } from "react";
import { Text, Box, VStack, FlatList, Modal, Button, Flex } from "native-base";
import { TouchableOpacity } from "react-native-gesture-handler";
import Header from "../components/Header";
import ClientList from "../components/ClientList";
import Input from "../components/Input";
import MyButton from "../components/MyButton";
import CustomModal from "../components/CustomModal";
import { BubblesBG } from "../utils/Icons";
import { useCustomerService } from "../utils/hooks/useCustomerService";
import { Customer } from "../@types/api";

export default function ClientScreen() {
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [paymentAmount, setPaymentAmount] = useState("");

  const { customers, loading, error, getAllCustomers, payDebt, clearError } =
    useCustomerService();

  const handlePaySuccess = async () => {
    if (!selectedCustomer || !paymentAmount) return;

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) return;

    const success = await payDebt({
      clientId: selectedCustomer.id,
      amount,
      description: `Pagamento de dívida: ${paymentAmount}`,
      paymentMethodId: 1, // Default payment method
      userId: 1, // Current user ID
    });

    if (success) {
      setShowModal2(true);
      setShowModal(false);
      setPaymentAmount("");
      setSelectedCustomer(null);
    }
  };

  useEffect(() => {
    getAllCustomers();
  }, []);

  return (
    <VStack bg="primary.100" flex={1}>
      <Header title="Debts" back />
      <VStack alignItems={"center"} mt={8} justifyContent={"center"}>
        <Box
          bg={"primary.300"}
          p={3}
          w={"20%"}
          alignItems={"center"}
          justifyContent={"center"}
          rounded={6}
        >
          <Text fontWeight={"bold"} fontSize={"20"}>
            Lista de Clientes
          </Text>
        </Box>
        <Box
          w={"60%"}
          mt={8}
          mb={8}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Box
            borderBottomWidth="1"
            borderColor="primary.300"
            pl={["0", "4"]}
            pr={["0", "5"]}
            py="2"
          >
            {loading ? (
              <Text textAlign="center" color="gray.500">
                Carregando clientes...
              </Text>
            ) : error ? (
              <Box alignItems="center" p={4}>
                <Text color="red.500" textAlign="center" mb={2}>
                  {error}
                </Text>
                <MyButton
                  title="Tentar novamente"
                  onPress={getAllCustomers}
                  bgColor="primary.500"
                />
              </Box>
            ) : customers.length > 0 ? (
              <FlatList
                data={customers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={(item) => (
                  <ClientList
                    item={item.item}
                    callModal={() => {
                      setSelectedCustomer(item.item);
                      setShowModal(true);
                    }}
                  />
                )}
              />
            ) : (
              <Text textAlign="center" color="gray.500" p={4}>
                Nenhum cliente encontrado
              </Text>
            )}
          </Box>

          <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <Modal.Content maxWidth="400px" bg={"white"}>
              <Flex direction="column" alignItems="center" mt={8}>
                <Text color={"primary.300"} mb={4}>
                  {selectedCustomer?.name}
                </Text>
                <Text color="gray.600" mb={2}>
                  Saldo atual:{" "}
                  {typeof selectedCustomer?.balance === "number"
                    ? selectedCustomer.balance.toFixed(2)
                    : "0.00"}{" "}
                  MT
                </Text>

                <Input
                  placeholder="Valor a pagar"
                  width={"xs"}
                  value={paymentAmount}
                  onChangeText={setPaymentAmount}
                  keyboardType="numeric"
                />
                <MyButton
                  title="Pagar"
                  mt={"4"}
                  bgColor={"primary.500"}
                  width={"xs"}
                  mb={"10"}
                  rounded={6}
                  onPress={handlePaySuccess}
                  disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
                />
              </Flex>
              <Modal.CloseButton />
              <Modal.Footer
                justifyContent="center"
                bg={"white"}
                alignItems="center"
              >
                <Button.Group space={2}>
                  <MyButton title="Ver cortes" width={"xs"} />
                </Button.Group>
              </Modal.Footer>
            </Modal.Content>
          </Modal>

          <CustomModal opened={showModal2} onClose={() => setShowModal2(false)}>
            <Box textAlign="center">
              <BubblesBG />
              <Text
                textAlign={"center"}
                fontSize="xl"
                color="primary.400"
                fontWeight="bold"
              >
                Pagamento efectuado com sucesso!
              </Text>
            </Box>
          </CustomModal>
        </Box>
      </VStack>
    </VStack>
  );
}
