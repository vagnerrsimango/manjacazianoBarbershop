import React from "react";
import { Box, Text, Modal, Icon, Flex, Button, VStack } from "native-base";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MyButton from "../components/MyButton";
import CutSelection from "../components/CutSelection";
import Header from "../components/Header";
import { BeardLogo, HairLogo } from "../utils/Icons";

export default function HomeScreen() {
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
          <CutSelection mr={10} my={1}>
            <BeardLogo />
          </CutSelection>
          <CutSelection my={1}>
            <HairLogo />
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
        <Flex direction="row">
          <MyButton title="Cortar" bg="primary.400" mr={2} />
          <MyButton title="Lavar" bg="primary.400" mr={2} />
          <MyButton title="Alinhar" mr={2} />
        </Flex>
        <Flex direction="row" mt={4}>
          <Box bg="primary.200" w={200} h={12} borderRadius={4} pr={2}>
            <Text fontSize="sm" color="black" fontWeight="thin"></Text>
          </Box>
          <Box
            bg="primary.300"
            w={8}
            h={12}
            borderRadius={2}
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="sm" color="#fff" fontWeight="thin">
              MZN
            </Text>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
