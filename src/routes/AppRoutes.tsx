import { StatusBar } from "expo-status-bar";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";

export default function AppRoutes() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator initialRouteName="LoginProcess">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}
