import React, { useEffect, useState } from "react";
import { Text, Box, VStack, FlatList, Modal, Button, Flex } from "native-base";
import { TouchableOpacity } from "react-native";
import Header from "../components/Header";
import api from "../utils/network/api";
import ClientList from "../components/ClientList";
import SoldProduct from "../components/SoldProduct";
import {
  ISaleCustomerHistoryServiceResponse,
  ISaleCustomerHistory,
} from "../utils/Responses";

export default function ClientDebt({ route }) {
  const client = route.params.client;
  const [soldProducts, setSoldProducts] = useState<Array<ISaleCustomerHistory>>(
    []
  );

  useEffect(() => {
    async function getClients() {
      const { data } = await api.get(`/client/${client.id}`);

      const response: ISaleCustomerHistoryServiceResponse = data;
      setSoldProducts(response.data);
      console.log(
        "🚀 ~ file: ClientDebt.tsx:25 ~ getClients ~ response.data:",
        response.data
      );
    }

    getClients();
  }, []);

  return (
    <VStack bg="primary.100" flex={1}>
      <Header title="Debts" back />
      <VStack alignItems={"center"} mt={"10%"} justifyContent={"center"}>
        <Box
          bg={"primary.400"}
          p={3}
          w={"50%"}
          alignItems={"center"}
          justifyContent={"center"}
          rounded={6}
        >
          <Text fontWeight={"bold"} fontSize={"20"}>
            Histórico de cortes do {client.name}
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
            {soldProducts.length > 0 ? (
              <FlatList
                data={soldProducts}
                renderItem={(item) => (
                  <SoldProduct item={item.item} key={item.item.id} />
                )}
              />
            ) : null}
          </Box>
        </Box>
      </VStack>
    </VStack>
  );
}
