import React from "react";
import { Box, Divider, Menu, Pressable } from "native-base";
import { Hamburger, List } from "phosphor-react-native";
import { TouchableOpacity, BackHandler } from "react-native";
import useUser from "../utils/hooks/UserHook";
import { useNavigation } from "@react-navigation/native";

export default function CustomMenu() {
  const { user } = useUser();
  const navigation = useNavigation();

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
            onPress={() => navigation.navigate("Debts")}
          >
            Dividas
          </Menu.Item>
          <Menu.Item
            color={"primary.300"}
            onPress={() => navigation.navigate("Clients")}
          >
            Clientes
          </Menu.Item>
          <Menu.Item
            color={"primary.300"}
            onPress={() => BackHandler.exitApp()}
          >
            Sair
          </Menu.Item>
        </Menu.OptionGroup>
      </Menu>
    </Box>
  );
}
