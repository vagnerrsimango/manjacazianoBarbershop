import React from "react";
import { NativeBaseProvider, Box, Text } from "native-base";
import { theme } from "./src/utils/theme";
import Input from "./src/components/Input";
import Button from "./src/components/Button";

export default function App() {
  return (
    <NativeBaseProvider theme={theme}>
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
        <Button title="Entrar" />
      </Box>
    </NativeBaseProvider>
  );
}
