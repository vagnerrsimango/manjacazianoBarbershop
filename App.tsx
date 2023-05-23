import React from "react";
import { NativeBaseProvider, Box } from "native-base";
import { theme } from "./src/utils/theme";
import Input from "./src/components/Input";

export default function App() {
  return (
    <NativeBaseProvider theme={theme}>
      <Box
        bg={"amber.500"}
        flex={1}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Input placeholder="PIN" />
      </Box>
    </NativeBaseProvider>
  );
}
