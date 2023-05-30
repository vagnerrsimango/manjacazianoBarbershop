import React, { useState } from "react";
import { Box, Text, Flex, Button, HStack, VStack } from "native-base";
import MyButton from "../components/MyButton";
import CutSelection from "../components/CutSelection";
import Header from "../components/Header";
import { BeardLogo, HairLogo } from "../utils/Icons";
import CustomModal from "../components/CustomModal";
import Input from "../components/Input";
import CustomerDataForm from "../components/CustomerDataFrom";

export default function CheckoutScreen() {
  const [showModal, setShowModal] = useState(false);

  const showSucess = () => {
    setShowModal(true);
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
          <VStack>
            <Text
              fontSize="md"
              color="primary.300"
              fontWeight="600"
              marginTop={"10"}
              textTransform={"uppercase"}
            >
              Cabelo
            </Text>

            <Flex direction="row">
              <MyButton
                title="Cortar"
                bg="primary.300"
                mr={2}
                rounded={"4"}
                weight="900"
              />
              <MyButton
                title="Lavar"
                bg="primary.400"
                mr={2}
                rounded={"4"}
                weight="900"
              />
            </Flex>
          </VStack>
          <VStack>
            <Text
              fontSize="md"
              color="primary.300"
              fontWeight="600"
              marginTop={"10"}
              textTransform={"uppercase"}
            >
              BARBA
            </Text>

            <Flex direction="row">
              <MyButton
                title="Cortar"
                bg="primary.300"
                mr={2}
                rounded={"4"}
                weight="900"
              />
            </Flex>
          </VStack>
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
            placeholder="1,000.00"
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

        <Text
          textTransform={"uppercase"}
          color={"red.500"}
          fontWeight={"bold"}
          mb={2}
        >
          tem um valor remanescente de 100,00 mts
        </Text>

        <MyButton
          title="Finalizar"
          type="SECONDARY"
          rounded={4}
          onPress={showSucess}
        />
      </Box>

      <CustomModal opened={showModal} onClose={() => setShowModal(false)}>
        <Box>
          <Text
            textTransform={"uppercase"}
            size={"lg"}
            fontWeight={"bold"}
            color={"primary.400"}
          >
            Tens novo pin{" "}
          </Text>
        </Box>
      </CustomModal>
    </Box>
  );
}
