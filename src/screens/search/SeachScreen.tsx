import React, { useState } from "react";
import {
  Text,
  Box,
  VStack,
  FlatList,
  Modal,
  Button,
  Flex,
  Select,
  HStack,
  useTheme,
} from "native-base";

import { TouchableOpacity } from "react-native";
import { ArrowLeft } from "phosphor-react-native";
import { useNavigation } from "@react-navigation/native";
import Input from "../../components/Input";
import MyButton from "../../components/MyButton";
import ClientList from "../../components/ClientList";
import ClientSkeleton from "../../components/ClientSkeleton";
import Ionicons from "@expo/vector-icons/Ionicons";
import api from "../../utils/network/api";
import CustomModal from "../../components/CustomModal";
import { BubblesBG } from "../../utils/Icons";

export default function SearchScreen() {
  const [clients, setClients] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation();
  const [valueToPay, setValueToPay] = useState("");
  const [showModal2, setShowModal2] = useState(false);
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState("");

  const handlePaySuccess = async () => {
    const { data } = await api.put("/clients/put", {
      id: Number(selectedCustomer.id),
      balance: Number(valueToPay),
    });

    if (data.success == true) setShowModal2(true);

    setShowModal(false);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/client/search/${input}`);

      setClients(data.clients);
    } catch (error) {
      alert("Falha ao pesquisar cliente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack bg="primary.100" flex={1}>
      <HStack
        bg={"primary.100"}
        p={6}
        w={"100%"}
        alignItems={"center"}
        justifyContent={"space-between"}
        rounded={6}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={40} color={colors.primary["300"]} weight="regular" />
        </TouchableOpacity>

        <Input
          placeholder="Pesquisar cliente"
          w={"1/2"}
          textAlign={"center"}
          value={input}
          onChangeText={setInput}
        />

        <MyButton
          title="Pesquisar"
          rounded={6}
          isLoading={loading}
          onPress={handleSearch}
        />
      </HStack>

      <VStack alignItems={"center"} mt={"10%"} justifyContent={"center"}>
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
            ) : (
              <ClientSkeleton />
            )}
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
