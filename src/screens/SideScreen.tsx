import React from "react";
import { Box, Text, FlatList, Button, ScrollView } from "native-base";
import Header from "../components/Header";
import Icon from "react-native-vector-icons/FontAwesome";
import BarberInfo from "../components/BarberInfo";
import MyButton from "../components/MyButton";
import useUser from "../utils/hooks/UserHook";

const SideScreen = () => {
  const { user } = useUser();
  console.log(user);
  const data = [
    {
      id: 1,
      name: "Ernesto",
      contact: "834445122",
      number: 1,
      value: 50,
      paid: "$30",
      balance: "$20",
    },
    {
      id: 2,
      name: "Edmilson",
      contact: "876651299",
      number: 2,
      value: 75,
      paid: "$50",
      balance: "$25",
    },
  ];

  const renderItem = ({ item }) => (
    <ScrollView horizontal>
      <Box width={150} alignItems="center">
        <Text color="primary.300">{item.number}</Text>
      </Box>
      <Box flexDirection="row" justifyContent="center" p={2}>
        <Box width={150} alignItems="center">
          <Text color="primary.300">{item.name}</Text>
        </Box>
        <Box width={150} alignItems="center">
          <Text color="primary.300">{item.contact}</Text>
        </Box>
        <Box width={150} alignItems="center">
          <Text color="primary.300">{item.value}</Text>
        </Box>
        <Box width={150} alignItems="center">
          <Text color="primary.300">{item.paid}</Text>
        </Box>
        <Box width={150} alignItems="center">
          <Text color="primary.800">{item.balance}</Text>
        </Box>
      </Box>
    </ScrollView>
  );

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

      <ScrollView horizontal>
        <Box bg="white" mt={2} borderRadius={8}>
          <Box flexDirection="row" justifyContent="center" p={2}>
            <Text
              fontWeight="bold"
              color="black"
              width={150}
              textAlign="center"
            >
              ID
            </Text>
            <Text
              fontWeight="bold"
              color="black"
              width={150}
              textAlign="center"
            >
              Nome
            </Text>
            <Text
              fontWeight="bold"
              color="black"
              width={150}
              textAlign="center"
            >
              Contacto
            </Text>
            <Text
              fontWeight="bold"
              color="black"
              width={150}
              textAlign="center"
            >
              Valor
            </Text>
            <Text
              fontWeight="bold"
              color="black"
              width={150}
              textAlign="center"
            >
              Pago
            </Text>
            <Text
              fontWeight="bold"
              color="black"
              width={150}
              textAlign="center"
            >
              Saldo
            </Text>
          </Box>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
          />
        </Box>
      </ScrollView>
    </Box>
  );
};

export default SideScreen;
