import React from "react";
import { Box, Text, Modal, Icon, Flex, VStack, Button } from "native-base";
import MyButton from "../components/MyButton";
import Input from "../components/Input";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function AdminUsers() {
  return (
    <Box bg="primary.100" flex={1}>
      <Flex
        direction="row"
        position="absolute"
        top={0}
        left={0}
        bottom={0}
        bg="primary.200"
        p={4}
        width={200}
      >
        {/* Sidebar content goes here */}
        <VStack space={4} alignItems="flex-start">
          <MyButton
            title="Página Inicial"
            bg="primary.400"
            width={"180"}
          ></MyButton>

          <MyButton title="Serviços" bg="primary.400" width={"180"}></MyButton>

          <MyButton title="Usuários" bg="primary.400" width={"180"}></MyButton>

          <MyButton
            title="Agendamentos"
            bg="primary.400"
            width={"180"}
          ></MyButton>

          <MyButton
            title="Relatórios"
            bg="primary.400"
            width={"180"}
          ></MyButton>
        </VStack>
      </Flex>
    </Box>
  );
}
