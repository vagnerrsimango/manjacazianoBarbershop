import React from "react";
import { Box, Divider, Menu, Pressable } from "native-base";
import { Hamburger, List } from "phosphor-react-native";
import { TouchableOpacity } from "react-native";
import useUser from "../utils/hooks/UserHook";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  Clients: undefined;
  Users: undefined;
  Home: undefined;
  Checkout: undefined;
  Debts: undefined;
  ClientDebts: undefined;
  Search: undefined;
};

export default function CustomMenu() {
  const { user, setUser } = useUser();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const logoutHandler = () => {
    setUser(null);
  };

  return (
    <Box w="90%" alignItems="flex-end">
      <Menu
        w="150"
        px={4}
        trigger={(triggerProps) => {
          return (
            <TouchableOpacity
              accessibilityLabel="More options menu"
              {...triggerProps}
            >
              <List size={60} />
            </TouchableOpacity>
          );
        }}
      >
        <Menu.OptionGroup
          defaultValue={user.name}
          title={user.name}
          type="radio"
        >
          <Menu.Item
            color={"amber.800"}
            onPress={() => navigation.navigate("Clients")}
          >
            Clientes
          </Menu.Item>
          <Menu.Item
            color={"primary.300"}
            onPress={() => navigation.navigate("Users")}
          >
            Colegas
          </Menu.Item>
          <Menu.Item color={"primary.300"} onPress={logoutHandler}>
            Sair
          </Menu.Item>
        </Menu.OptionGroup>
      </Menu>
    </Box>
  );
}
