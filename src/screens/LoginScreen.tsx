import React from "react";
import { NativeBaseProvider, Box, Text } from "native-base";
import { theme } from "../utils/theme";
import Input from "../components/Input";
import Button from "../components/Button";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const navigation = useNavigation();
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
      <Button title="Entrar" onPress={handleEnter} />
    </Box>
  );
}
