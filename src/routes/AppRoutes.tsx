import { StatusBar } from "expo-status-bar";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen2 from "../screens/LoginScreen2";
import AdminHome from "../screens/AdminHome";
import AdminServices from "../screens/AdminServices";
import AdminUsers from "../screens/AdminUsers";

export default function AppRoutes() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator initialRouteName="LoginProcess">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Login2" component={LoginScreen2} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Admin" component={AdminHome} />
      <Stack.Screen name="AdminS" component={AdminServices} />
      <Stack.Screen name="AdminU" component={AdminUsers} />
    </Stack.Navigator>
  );
}
