import React from "react";
import { Box, Center, HStack, Text, Image, Stack } from "native-base";
import { useUser } from "../hooks/useUser";
interface HeaderProps {
  title: string;
  leftRad?: number;
  rightRad?: number;
}
export default function Header({ title, leftRad, rightRad }: HeaderProps) {
  const { user } = useUser();
  return (
    <HStack
      bgColor={"primary.400"}
      h={"26"}
      justifyContent={"center"}
      alignItems={"center"}
      borderBottomLeftRadius={leftRad}
      borderBottomRightRadius={rightRad}
    >
      <Center mt={8}>
        <Text
          fontWeight={"medium"}
          fontSize={"md"}
          textTransform={"uppercase"}
          lineHeight={"2xl"}
        >
          {title}
        </Text>
      </Center>
      <Box
        position={"absolute"}
        right="5"
        bottom={4}
        borderColor={"gray.800"}
        borderWidth={2}
        borderRadius={24}
      >
        <Image
          size={6}
          borderRadius={20}
          source={{
            uri: `${user.photo}`,
          }}
          alt="Alternate Text"
        />
      </Box>
    </HStack>
  );
}
