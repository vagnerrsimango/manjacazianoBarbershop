import React from "react";
import { Box, Center, HStack, Text, Image, Stack, useTheme } from "native-base";
import { MainLogo } from "../utils/Icons";
import { ArrowLeft, User } from "phosphor-react-native";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useUser from "../utils/hooks/UserHook";
import Menu from "./Menu";
// import { useUser } from "../hooks/useUser";
interface HeaderProps {
  title: string;
  leftRad?: number;
  rightRad?: number;
  back?: boolean;
}
export default function Header({
  title,
  leftRad,
  rightRad,
  back = false,
}: HeaderProps) {
  // const { user } = useUser();
  const { colors } = useTheme();

  const navigation = useNavigation();
  const { user } = useUser();

  return (
    <HStack
      bgColor={"primary.100"}
      h={"20"}
      px={"32"}
      justifyContent={"space-between"}
      alignItems={"center"}
      borderBottomLeftRadius={leftRad}
      borderBottomRightRadius={rightRad}
    >
      {back ? (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={40} color={colors.primary["300"]} weight="regular" />
        </TouchableOpacity>
      ) : null}

      <HStack mt={4}>
        <MainLogo width={200} height={200} />
      </HStack>
      <HStack mt={4} justifyItems={"center"} alignItems={"center"}>
        {/* <Text
          fontWeight={"semibold"}
          fontSize={"xs"}
          color={"primary.300"}
          px={1}
        >
          {user?.name}
        </Text> */}

        {/* <User size={20} color={colors.primary["300"]} weight="fill" /> */}

        <Menu />
      </HStack>
    </HStack>
  );
}
