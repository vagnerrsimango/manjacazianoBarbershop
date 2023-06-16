import { createStackNavigator } from "@react-navigation/stack";
import SideScreen from "../screens/SideScreen";

export default function SideRoutes() {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="SideProcess"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Sidescreen"
        component={SideScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
