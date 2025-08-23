import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";

export default function AuthRoutes() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
