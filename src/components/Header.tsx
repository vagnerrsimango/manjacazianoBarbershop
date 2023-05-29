import React from "react";
import { Box, Center, HStack, Text, Image, Stack } from "native-base";
// import { useUser } from "../hooks/useUser";
interface HeaderProps {
  title: string;
  leftRad?: number;
  rightRad?: number;
}
export default function Header({ title, leftRad, rightRad }: HeaderProps) {
  // const { user } = useUser();
  return (
    <HStack
      bgColor={"gray.100"}
      h={"20"}
      px={"32"}
      justifyContent={"space-between"}
      alignItems={"center"}
      borderBottomLeftRadius={leftRad}
      borderBottomRightRadius={rightRad}
    >
      <HStack mt={4}>
        <Image source={require("../assets/logo.png")} alt="Manjacaziano" />
      </HStack>
      <HStack mt={4}>
        <Text
          fontWeight={"medium"}
          fontSize={"md"}
          textTransform={"uppercase"}
          color={"primary.300"}
        >
          {title}
        </Text>
        <Text
          ml={2}
          fontWeight={"medium"}
          fontSize={"md"}
          textTransform={"uppercase"}
          color={"primary.300"}
        >
          {title}
        </Text>
      </HStack>
    </HStack>
  );
}
