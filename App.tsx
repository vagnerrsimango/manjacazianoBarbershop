import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppRoutes from "./src/routes/AppRoutes";
import { NativeBaseProvider } from "native-base";
import { theme } from "./src/utils/theme";
import CartContextProvider from "./src/utils/CartContexProvider";
import UserProvider from "./src/utils/UserProvider";

export default function App() {
  return (
    <UserProvider>
      <NativeBaseProvider theme={theme}>
        <CartContextProvider>
          <AppRoutes />
        </CartContextProvider>
      </NativeBaseProvider>
    </UserProvider>
  );
}
