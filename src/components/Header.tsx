import React from "react";
import { Box, Center, HStack, Text, Image, Stack, useTheme } from "native-base";
import { MainLogo } from "../utils/Icons";
import { User } from "phosphor-react-native";
// import { useUser } from "../hooks/useUser";
interface HeaderProps {
  title: string;
  leftRad?: number;
  rightRad?: number;
}
export default function Header({ title, leftRad, rightRad }: HeaderProps) {
  // const { user } = useUser();
  const { colors } = useTheme();
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
      <HStack mt={4}>
        <MainLogo width={200} height={200} />
      </HStack>
      <HStack mt={4} justifyItems={"center"} alignItems={"center"}>
        <Text
          fontWeight={"semibold"}
          fontSize={"xs"}
          color={"primary.300"}
          px={1}
        >
          Lázaro
        </Text>

        <User size={20} color={colors.primary["300"]} weight="fill" />
      </HStack>
    </HStack>
  );
}
