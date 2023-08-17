import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import DebtScreen from "../screens/DebtScreen";
import ClientScreen from "../screens/ClientScreen";

export default function SaleRoutes() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="Debts" component={DebtScreen} />
      <Stack.Screen name="Clients" component={ClientScreen} />
      {/* <Stack.Screen name="Admin" component={AdminHome} />
      <Stack.Screen name="AdminS" component={AdminServices} />
      <Stack.Screen name="AdminU" component={AdminUsers} /> */}
    </Stack.Navigator>
  );
}
