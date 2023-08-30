import React from "react";
import { Box, Divider, Menu, Pressable } from "native-base";
import { Hamburger, List } from "phosphor-react-native";
import { TouchableOpacity } from "react-native";
import useUser from "../utils/hooks/UserHook";
import { useNavigation } from "@react-navigation/native";

export default function Menu2() {
  const { user, setUser } = useUser();
  const navigation = useNavigation();
  const logoutHandler = () => {
    setUser(null);
  };

  return (
    <Box w="45%" alignItems="flex-end">
      <Menu
        w="150"
        px={4}
        trigger={(triggerProps) => {
          return (
            <TouchableOpacity
              accessibilityLabel="More options menu"
              {...triggerProps}
            >
              <List size={30} />
            </TouchableOpacity>
          );
        }}
      >
        <Menu.OptionGroup
          defaultValue={"Dívidas"}
          title={"Dívidas"}
          type="radio"
        >
          <Menu.Item
            color={"amber.800"}
            onPress={() => navigation.navigate("Debts")}
          >
            A-Z
          </Menu.Item>
          <Menu.Item
            color={"primary.300"}
            onPress={() => navigation.navigate("Clients")}
          >
            Valor
          </Menu.Item>
          <Menu.Item color={"primary.300"} onPress={logoutHandler}>
            Data
          </Menu.Item>
        </Menu.OptionGroup>
      </Menu>
    </Box>
  );
}
