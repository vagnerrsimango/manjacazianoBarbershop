import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Flex,
  HStack,
  Center,
  Checkbox,
  Stack,
  Icon,
  useToast,
  Select,
} from "native-base";
import MyButton from "../components/MyButton";
import Header from "../components/Header";
import { BubblesBG } from "../utils/Icons";
import CustomModal from "../components/CustomModal";
import Input from "../components/Input";
import { useCart } from "../utils/LocalHooks";
import { FlatList } from "react-native-gesture-handler";
import Tag from "../components/Tag";
import useUser from "../utils/hooks/UserHook";
import api from "../utils/network/api";
import { MaterialIcons } from "@expo/vector-icons";
import CustomInput from "../components/Input";
import CustomSelect from "../components/Select";
import AutoCompleteInput from "../components/AutoCompletInput";
import AutoCompleteInputComp from "../components/AutoCompletInput";

export default function CheckoutScreen() {
  const inputsInitalState = {
    client_name: "",
    client_phone: "",
    isChecked: false,
    paid: "",
  };
  const [showModal, setShowModal] = useState(false);
  const [loading, isLoading] = useState(false);
  const [inputs, setInputs] = useState(inputsInitalState);
  const { services } = useCart();
  const [total, setTotal] = useState(0);
  const { setUser } = useUser();
  const { setServices } = useCart();

  const Toast = useToast();

  useEffect(() => {
    let auxTotal = 0;
    if (services.length > 0) {
      auxTotal = services.reduce((prev, current) => {
        auxTotal += Number(current.price);
        return auxTotal;
      }, 0);
      setTotal(auxTotal);
      setInputs((prev) => ({ ...prev, paid: auxTotal.toString() }));
    }
    console.log(
      "🚀 ~ file: CheckoutScreen.tsx:29 ~ useEffect ~ auxTotal:",
      auxTotal
    );
  }, []);

  const handleInputChange = (value, input) => {
    switch (input) {
      case "paid":
        if (Number(value) > total) {
          return Toast.show({
            title: "Valor acima do preço do corte",
            placement: "bottom",
            backgroundColor: "red.500",
          });
        }
    }

    setInputs((prev) => ({ ...prev, [input]: value }));
  };

  const showSucess = async () => {
    if (
      Number(total) > Number(inputs.paid) &&
      !inputs.isChecked &&
      inputs.client_phone.length == 0 &&
      inputs.client_phone.length == 0
    ) {
      alert("Por favor preencha os campos");
      return;
    }
    isLoading(true);
    if (total == 0 || !inputs.paid) {
      return Toast.show({
        title: "Selecione os serviços e inclua o valor pago pelo cliente",
        backgroundColor: "red.500",
      });
    }
    let postList: any = [];

    services.forEach((service) => {
      postList.push({
        product_id: Number(service.id),
        price: Number(service.price),
      });
    });

    console.log("my array", postList);

    console.log("in", inputs);

    const response = await api.post("/sale", {
      client_name: inputs.client_name,
      client_phone: inputs.client_phone,
      isChecked: inputs.isChecked,
      paid: inputs.paid,
      soldList: postList,
    });

    // console.log(response.data.success);
    if (response.data.success == true) {
      setShowModal(true);
      setServices([]);
    } else {
      alert("Falha ao efectuar a venda!");
    }
    isLoading(false);
  };

  return (
    <Box bg="primary.100" flex={1}>
      <Header title="Main" back />
      <Flex
        direction="row"
        justifyContent="space-between"
        p={4}
        position="absolute"
        top={0}
        left={0}
        right={0}
      ></Flex>
      <Box flex={1} alignItems="center" justifyContent="center">
        <Text fontSize="lg" color="primary.300" fontWeight="bold">
          POR FAVOR, CONFIRME OS SERVIÇOS SELECIONADOS
        </Text>
        <HStack>
          <Center
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <FlatList
              data={services}
              horizontal
              renderItem={({ item }) => <Tag title={item.name} />}
            />

            <Box
              background={"red.500"}
              mt={2}
              w={"30%"}
              justifyContent={"center"}
              alignItems={"center"}
              rounded={2}
            >
              <Text
                fontSize="md"
                color="white"
                fontWeight="600"
                textTransform={"uppercase"}
                padding={1}
              >
                {total}
                Mts
              </Text>
            </Box>
          </Center>
        </HStack>

        <Stack space={1} w="100%" alignItems="center">
          <Text
            fontWeight={"normal"}
            fontSize={"md"}
            color={"primary.300"}
            p={2}
          >
            Dados do cliente
          </Text>
          <CustomInput
            onChangeText={(value) => handleInputChange(value, "client_name")}
            value={inputs.client_name}
            w={{
              base: "75%",
              md: "25%",
            }}
            fontWeight={"light"}
            InputLeftElement={
              <Icon
                as={<MaterialIcons name="person" />}
                size={5}
                ml="2"
                color="muted.400"
              />
            }
            placeholder="Nome"
          />
          <CustomInput
            onChangeText={(value) => handleInputChange(value, "client_phone")}
            value={inputs.client_phone}
            w={{
              base: "75%",
              md: "25%",
            }}
            fontWeight={"light"}
            InputLeftElement={
              <Icon
                as={<MaterialIcons name="phone" />}
                size={5}
                ml="2"
                color="muted.400"
              />
            }
            placeholder="Contacto"
          />

          <CustomSelect />
        </Stack>
        {/* <AutoCompleteInputComp /> */}
        <Flex
          direction="row"
          mt={4}
          p={"2"}
          w={"30%"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Input
            textAlign={"center"}
            fontSize={"xl"}
            bg="primary.300"
            alignItems="center"
            justifyContent="center"
            onChangeText={(value) => handleInputChange(value, "paid")}
            value={inputs.paid.toString()}
            color={"primary.400"}
            letterSpacing={2}
            w={"90%"}
            rounded={0}
            InputRightElement={
              <Checkbox
                shadow={2}
                value={inputs.isChecked ? "checked" : "unchecked"}
                height={"48"}
                size={"lg"}
                accessibilityLabel="This is a dummy checkbox"
                background={"primary.200"}
                padding={"2"}
                marginRight={"1"}
                onChange={(value) => handleInputChange(value, "isChecked")}
              />
            }
          />
        </Flex>

        {inputs.isChecked ? null : (
          <Text
            textTransform={"uppercase"}
            color={"red.500"}
            fontWeight={"bold"}
            mb={2}
          >
            tem um valor remanescente de {total - Number(inputs.paid)},00 mts
          </Text>
        )}

        <MyButton
          title="Finalizar"
          type="SECONDARY"
          rounded={4}
          isLoading={loading}
          onPress={showSucess}
        />
      </Box>

      <CustomModal
        opened={showModal}
        onClose={() => {
          setShowModal(false);
          setUser(null);
        }}
      >
        <Box textAlign="center">
          <BubblesBG />
          <Text
            textAlign={"center"}
            fontSize="xl"
            color="primary.400"
            fontWeight="bold"
          >
            Venda feita com sucesso
          </Text>
        </Box>
      </CustomModal>
    </Box>
  );
}
