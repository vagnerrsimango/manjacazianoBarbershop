import React, { useEffect, useState } from "react";
import { Text, Box, VStack, FlatList, Modal, Button, Flex } from "native-base";
import { TouchableOpacity } from "react-native-gesture-handler";
import Header from "../components/Header";
import api from "../utils/network/api";
import ClientList from "../components/ClientList";
import Input from "../components/Input";
import MyButton from "../components/MyButton";
import CustomModal from "../components/CustomModal";
import { BubblesBG } from "../utils/Icons";

export default function ClientScreen() {
  const tableData = [
    { id: 1, name: "John Doe", age: 25 },
    { id: 2, name: "Jane Smith", age: 30 },
    { id: 3, name: "Mike Johnson", age: 35 },
  ];

  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState({});

  const handlePaySuccess = () => {
    setShowModal2(true);
  };

  useEffect(() => {
    async function getClients() {
      const response = await api.get("/clients/all");
      console.log(
        "🚀 ~ file: DebtScreen.tsx:32 ~ getClients ~ response:",
        response.data
      );

      setClients(response.data.clients);
    }

    getClients();
  }, [clients]);

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
            {clients.length > 0 ? (
              <FlatList
                data={clients}
                renderItem={(item) => (
                  <ClientList
                    item={item.item}
                    callModal={() => {
                      setSelectedCustomer(item.item);
                    }}
                  />
                )}
              />
            ) : null}
          </Box>

          <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <Modal.Content maxWidth="400px" bg={"white"}>
              <Flex direction="column" alignItems="center" mt={8}>
                <Text color={"primary.300"}>{selectedCustomer.name}</Text>

                <Input placeholder="Valor a pagar" width={"xs"} />
                <MyButton
                  title="Pagar"
                  mt={"4"}
                  bgColor={"primary.500"}
                  width={"xs"}
                  mb={"10"}
                  rounded={6}
                  onPress={handlePaySuccess}
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