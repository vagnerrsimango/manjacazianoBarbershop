import React from "react";
import { Box, Text, Modal, Icon, Flex, VStack, Button } from "native-base";
import MyButton from "../components/MyButton";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function AdminScreen() {
  const navigation = useNavigation();
  const handlePress = () => {
    navigation.navigate(routeName);
  };
  return (
    <Box bg="primary.100" flex={1}>
      <Flex
        direction="row"
        position="absolute"
        top={0}
        left={0}
        bottom={0}
        bg="primary.100"
        p={4}
        width={200}
        ml={"16"}
        mt={"10"}
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
