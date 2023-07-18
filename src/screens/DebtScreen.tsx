import React from "react";
import {
  Text,
  Box,
  Button,
  VStack,
  FlatList,
  HStack,
  Icon,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  Divider,
} from "native-base";
import Header from "../components/Header";
import MyButton from "../components/MyButton";
import useUser from "../utils/hooks/UserHook";
import { FontAwesome } from "react-native-vector-icons";
import api from "../utils/network/api";
// import TextUpper from "../components/TextUpper";
export default function DebtScreen() {
  const tableData = [
    { id: 1, name: "John Doe", age: 25 },
    { id: 2, name: "Jane Smith", age: 30 },
    { id: 3, name: "Mike Johnson", age: 35 },
  ];

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
        <Box w={"80%"} mt={8} mb={8}>
          <VStack space={3} divider={<Divider />} w="90%">
            <HStack justifyContent="space-between">
              <Text>Simon Mignolet</Text>
              <Icon name="arrow-forward" />
            </HStack>
            <HStack justifyContent="space-between">
              <Text>Nathaniel Clyne</Text>
              <Icon name="arrow-forward" />
            </HStack>
            <HStack justifyContent="space-between">
              <Text>Dejan Lovren</Text>
              <Icon name="arrow-forward" />
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </VStack>
  );
}
