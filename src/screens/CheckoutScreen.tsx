import React, { useEffect, useState } from "react";
import { Box, Text, Flex, HStack, Center, Checkbox } from "native-base";
import MyButton from "../components/MyButton";
import Header from "../components/Header";
import { BubblesBG } from "../utils/Icons";
import CustomModal from "../components/CustomModal";
import Input from "../components/Input";
import CustomerDataForm from "../components/CustomerDataFrom";
import { useCart } from "../utils/LocalHooks";
import { FlatList } from "react-native-gesture-handler";
import Tag from "../components/Tag";
import useUser from "../utils/hooks/UserHook";
import api from "../utils/network/api";

export default function CheckoutScreen() {
  const [showModal, setShowModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { services } = useCart();
  const [total, setTotal] = useState(0);
  const [paid, setPaid] = useState(0);
  const { setUser } = useUser();
  const { setServices } = useCart();

  useEffect(() => {
    let auxTotal = 0;
    if (services.length > 0) {
      auxTotal = services.reduce((prev, current) => {
        auxTotal += Number(current.price);
        return auxTotal;
      }, 0);
      setTotal(auxTotal);
      setPaid(auxTotal);
    }
    console.log(
      "🚀 ~ file: CheckoutScreen.tsx:29 ~ useEffect ~ auxTotal:",
      auxTotal
    );
  }, []);
  const showSucess = async () => {
    console.log(services[0].price);

    let postList: any = [];

    services.forEach((service) => {
      postList.push({
        product_id: Number(service.id),
        price: Number(service.price),
      });
    });

    console.log("my array", postList);
    const response = await api.post("/sale", {
      client_id: 1,
      soldList: postList,
    });

    // console.log(response.data.success);
    if (response.data.success == true) {
      setShowModal(true);
      setServices([]);
    } else {
      alert("Falha ao efectuar a venda!");
    }
  };

  const setDebtState = (value) => {
    setIsChecked(value);
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

        <CustomerDataForm />

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
            onChangeText={(value) => setPaid(parseInt(value))}
            value={paid.toString()}
            color={"primary.400"}
            letterSpacing={2}
            w={"90%"}
            rounded={0}
            InputRightElement={
              <Checkbox
                shadow={2}
                value="test"
                height={"48"}
                size={"lg"}
                accessibilityLabel="This is a dummy checkbox"
                background={"primary.200"}
                padding={"2"}
                marginRight={"1"}
                onChange={(value) => setDebtState(value)}
              />
            }
          />
        </Flex>

        {isChecked ? null : (
          <Text
            textTransform={"uppercase"}
            color={"red.500"}
            fontWeight={"bold"}
            mb={2}
          >
            tem um valor remanescente de 100,00 mts
          </Text>
        )}

        <MyButton
          title="Finalizar"
          type="SECONDARY"
          rounded={4}
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
