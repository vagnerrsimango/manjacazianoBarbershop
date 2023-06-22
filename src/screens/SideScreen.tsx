import React, { useEffect, useState } from "react";
import { Box, Text, FlatList, HStack, Icon } from "native-base";
import Header from "../components/Header";
import BarberInfo from "../components/BarberInfo";
import MyButton from "../components/MyButton";
import useUser from "../utils/hooks/UserHook";
import { FontAwesome } from "react-native-vector-icons";
import { Horse, Heart, Cube } from "@phosphor-icons/react";
import api from "../utils/network/api";

const SideScreen = () => {
  const { user } = useUser();

  const [sales, setSales] = useState();

  const [loading, isLoading] = useState(true);

  useEffect(() => {
    async function getAllSales() {
      const response = await api.get("/mysales");
      console.log(
        "🚀 ~ file: SideScreen.tsx:21 ~ getAllSales ~ response:",
        response.data
      );

      setSales(response.data.data);
      isLoading(false);
    }

    getAllSales();
  }, []);

  const data = [
    {
      id: 1,
      name: "Ernesto",
      contact: "834445122",
      value: 50,
      paid: "$30",
      balance: "$20",
      date: "25 de Maio",
    },
    {
      id: 2,
      name: "Edmilson",
      contact: "876651299",
      value: 75,
      paid: "$50",
      balance: "$25",
      date: "27 de Abril",
    },
  ];

  return (
    <Box bg="primary.100" flex={1}>
      <Header title="Collaborator" />
      <BarberInfo />

      <Box justifyContent="center" alignItems="center" p={2}>
        <MyButton
          title="Cortes Realizados"
          mt={"12"}
          mb={"8"}
          width={"xs"}
          bg="primary.300"
        />
      </Box>

      {!loading ? (
        <FlatList
          data={sales.mysales}
          renderItem={({ item }) => (
            <Box
              borderBottomWidth="1"
              _dark={{ borderColor: "muted.50" }}
              borderColor="muted.800"
              pl={["0", "4"]}
              pr={["0", "5"]}
              py="2"
            >
              <HStack justifyContent="space-between">
                <Box flex={1}>
                  <HStack alignItems="center" ml={10}>
                    <Icon
                      as={<FontAwesome name="user-circle" />}
                      size={6}
                      color="primary.300"
                      mr={2}
                    />
                    <Text color="primary.300" bold>
                      {item.clients.name}
                    </Text>
                  </HStack>
                  <HStack alignItems="center" ml={10}>
                    <Icon
                      as={<FontAwesome name="phone" />}
                      size={4}
                      color="primary.300"
                      mr={2}
                    />
                    <Text color="primary.300">{item.clients.phone}</Text>
                  </HStack>
                  <HStack alignItems="center" ml={10}>
                    <Icon
                      as={<FontAwesome name="calendar" />}
                      size={4}
                      color="primary.300"
                      mr={2}
                    />
                    <Text color="primary.300">
                      {new Date(item.finalized_at).toLocaleDateString()}
                    </Text>
                  </HStack>
                </Box>
                <Box flex={1}>
                  <Text color="primary.300" ml={10}>
                    Valor: {item.total_amount} MT
                  </Text>
                  <HStack alignItems="center" ml={10}>
                    <Icon
                      as={<FontAwesome name="money" />}
                      size={4}
                      color="primary.300"
                      mr={2}
                    />
                    <Text color="primary.300">
                      Pago: <Text color="primary.900">{item.paid} MT</Text>
                    </Text>
                  </HStack>
                  <HStack alignItems="center" ml={10}>
                    <Icon
                      as={<FontAwesome name="balance-scale" />}
                      size={4}
                      color="primary.300"
                      mr={2}
                    />
                    <Text color="primary.300">
                      Saldo:{" "}
                      <Text color="primary.800">
                        {Number(item.paid) - Number(item.total_amount)}
                      </Text>
                    </Text>
                  </HStack>
                </Box>
              </HStack>
            </Box>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : null}
    </Box>
  );
};

export default SideScreen;
