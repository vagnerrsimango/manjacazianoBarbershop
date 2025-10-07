import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ServiceSelectionScreen from "../screens/ServiceSelectionScreen";
import HomeScreen from "../screens/HomeScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import DebtScreen from "../screens/DebtScreen";
import ClientDebt from "../screens/ClientDebt";
import SearchScreen from "../screens/search/SeachScreen";
import CustomerManagementScreen from "../screens/CustomerManagementScreen";
import UserManagementScreen from "../screens/UserManagementScreen";
import ProductManagementScreen from "../screens/ProductManagementScreen";

export default function SaleRoutes() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="ServiceSelection"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="ServiceSelection"
        component={ServiceSelectionScreen}
      />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="Debts" component={DebtScreen} />
      <Stack.Screen name="ClientDebts" component={ClientDebt} />
      <Stack.Screen name="Clients" component={CustomerManagementScreen} />
      <Stack.Screen name="Users" component={UserManagementScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Products" component={ProductManagementScreen} />
      {/* <Stack.Screen name="Admin" component={AdminHome} />
      <Stack.Screen name="AdminS" component={AdminServices} />
      <Stack.Screen name="AdminU" component={AdminUsers} /> */}
    </Stack.Navigator>
  );
}
