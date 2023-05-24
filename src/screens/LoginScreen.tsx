import React, { useState } from "react";
import { Box, Text, Modal, Icon } from "native-base";
import { theme } from "../utils/theme";
import Input from "../components/Input";
import MyButton from "../components/MyButton";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);

  const handleEnter = () => {
    navigation.navigate("Home");
  };
  return (
    <Box
      bg={"primary.100"}
      flex={1}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Text fontSize="xl" color="primary.300" fontWeight="bold">
        Iniciar sessão
      </Text>
      <Text fontSize="xs" color="primary.300" fontWeight={"thin"}>
        Por favor insira o seu PIN de 6 dígitos
      </Text>
      <Input placeholder="PIN" />
      <MyButton title="Entrar" onPress={handleEnter} />
    </Box>
  );
}
