import React, { useEffect, useState } from "react";
import {
  Text,
  Box,
  VStack,
  FlatList,
  Modal,
  Button,
  Flex,
  Select,
} from "native-base";
import { TouchableOpacity } from "react-native";
import Header from "../components/Header";
import api from "../utils/network/api";
import ClientList from "../components/ClientList";
import Input from "../components/Input";
import MyButton from "../components/MyButton";
import CustomModal from "../components/CustomModal";
import { BubblesBG } from "../utils/Icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import Menu2 from "../components/Menu2";

export default function DebtScreen() {
  const [clients, setClients] = useState([]);
  const [valueToPay, setValueToPay] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState({});

  const navigation = useNavigation();

  const handlePaySuccess = async () => {
    const { data } = await api.put("/clients/put", {
      id: Number(selectedCustomer.id),
      balance: Number(valueToPay),
    });

    if (data.success == true) setShowModal2(true);

    setShowModal(false);
  };

  useEffect(() => {
    async function getClients() {
      const response = await api.get("/clients/debt");
      console.log(
        "🚀 ~ file: DebtScreen.tsx:32 ~ getClients ~ response:",
        response.data
      );
      setClients(response.data.clients);
    }

    getClients();
  }, []);

  return (
    <VStack bg="primary.100" flex={1}>
      <Header title="Debts" back />
      <VStack alignItems={"center"} mt={"10%"} justifyContent={"center"}>
        <Box
          bg={"red.500"}
          p={3}
          w={"50%"}
          alignItems={"center"}
          justifyContent={"center"}
          rounded={6}
        >
          <Text fontWeight={"bold"} fontSize={"20"}>
            Lista de Clientes com Divida
          </Text>
        </Box>
        {/* <Menu2 /> */}
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
                    showDate={false}
                    item={item.item}
                    callModal={() => {
                      setSelectedCustomer(item.item);
                      setShowModal(true);
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
                <TouchableOpacity
                  onPress={() => {
                    setShowModal(false);
                    navigation.navigate("ClientDebts", {
                      client: selectedCustomer,
                    });
                  }}
                >
                  <Ionicons name="md-eye" size={32} color="grey" />
                </TouchableOpacity>
                <Input
                  placeholder="Valor a pagar"
                  width={"xs"}
                  value={valueToPay}
                  onChangeText={setValueToPay}
                />
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
