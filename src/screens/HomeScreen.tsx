import React, { useEffect, useState } from "react";
import { Box, Text, Modal, Icon, Flex, Button, VStack } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MyButton from "../components/MyButton";
import CutSelection from "../components/CutSelection";
import Header from "../components/Header";
import { BeardLogo, HairLogo } from "../utils/Icons";
import Input from "../components/Input";
import { useNavigation } from "@react-navigation/native";
import { beardServices, hairServices } from "../utils/FakeData";
import { FlatList } from "react-native-gesture-handler";
import Tag from "../components/Tag";
import { useCart } from "../utils/LocalHooks";

export default function HomeScreen() {
  const natigation = useNavigation();
  const { services, setServices } = useCart();

  const [total, setTotal] = useState(0);

  useEffect(() => {
    let auxTotal = 0;

    if (services.length > 0) {
      auxTotal = services.reduce((prev, current) => {
        auxTotal += current.price;
        return auxTotal;
      }, 0);

      setTotal(auxTotal);
    }
    console.log(
      "🚀 ~ file: CheckoutScreen.tsx:29 ~ useEffect ~ auxTotal:",
      auxTotal
    );
  }, []);

  // useEffect(() => {
  //   setServices((prev) => [...prev, ...services]);
  // }, [services]);

  console.log(services);
  const data = hairServices;
  const data2 = beardServices;
  return (
    <Box bg="primary.100" flex={1}>
      <Header title="Main" />
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
        <Text fontSize="lg" color="primary.300" fontWeight="thin">
          POR FAVOR, SELECIONE O SERVIÇO DESEJADO
        </Text>
        <Flex direction="row">
          <CutSelection mr={10} my={1} data={data}>
            <Box backgroundColor={"gray.100"} p={"4"} rounded={"4"}>
              <BeardLogo />
            </Box>
          </CutSelection>
          <CutSelection my={1} data={data2}>
            <Box backgroundColor={"gray.100"} p={"4"} rounded={"4"}>
              <HairLogo />
            </Box>
          </CutSelection>
        </Flex>
        <Text
          fontSize="lg"
          color="primary.300"
          fontWeight="thin"
          marginTop={"10"}
        >
          Serviços Selecionados
        </Text>
        <FlatList
          horizontal
          data={services}
          renderItem={({ item }) => <Tag title={item.name} />}
        />

        <Flex
          direction="row"
          mt={1}
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
            placeholder="0,0"
            value={total.toString()}
            editable={false}
            letterSpacing={2}
            w={"90%"}
            rounded={0}
            InputRightElement={
              <Button rounded={4} h={"100%"} bg="gray.400">
                Mts
              </Button>
            }
          />
        </Flex>

        <MyButton
          title="Avançar"
          type="SECONDARY"
          rounded={2}
          onPress={() => natigation.navigate("Checkout")}
        />
      </Box>
    </Box>
  );
}
