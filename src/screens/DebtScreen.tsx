import React, { useEffect, useState } from "react";
import {
  Text,
  Box,
  Button,
  VStack,
  FlatList,
  HStack,
  Icon,
  Avatar,
  Spacer,
} from "native-base";
import Header from "../components/Header";
import MyButton from "../components/MyButton";
import useUser from "../utils/hooks/UserHook";
import { FontAwesome } from "react-native-vector-icons";
import api from "../utils/network/api";
import ClientList from "../components/ClientList";
// import TextUpper from "../components/TextUpper";
export default function DebtScreen() {
  const tableData = [
    { id: 1, name: "John Doe", age: 25 },
    { id: 2, name: "Jane Smith", age: 30 },
    { id: 3, name: "Mike Johnson", age: 35 },
  ];

  const [clients, setClients] = useState([]);

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
            Lista de Dividas
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
            _dark={{
              borderColor: "muted.50",
            }}
            borderColor="muted.800"
            pl={["0", "4"]}
            pr={["0", "5"]}
            py="2"
          >
            {clients.length > 0 ? (
              <FlatList
                data={clients}
                renderItem={(item) => <ClientList item={item.item} />}
              />
            ) : null}
          </Box>
        </Box>
      </VStack>
    </VStack>
  );
}
