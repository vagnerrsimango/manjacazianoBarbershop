import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppRoutes from "./src/routes/AppRoutes";
import { NativeBaseProvider } from "native-base";
import { theme } from "./src/utils/theme";

export default function App() {
  return (
    <NavigationContainer>
      <NativeBaseProvider theme={theme}>
        <AppRoutes />
      </NativeBaseProvider>
    </NavigationContainer>
  );
}
