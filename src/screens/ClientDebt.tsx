import React, { useEffect, useState } from "react";
import { Text, Box, VStack, FlatList, Modal, Button, Flex } from "native-base";
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

export default function ClientDebt() {
  const tableData = [
    { id: 1, name: "John Doe", age: 25 },
    { id: 2, name: "Jane Smith", age: 30 },
    { id: 3, name: "Mike Johnson", age: 35 },
  ];

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
            Lista de Cortes
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
                      setShowModal(true);
                    }}
                  />
                )}
              />
            ) : null}
          </Box>
        </Box>
      </VStack>
    </VStack>
  );
}