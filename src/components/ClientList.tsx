import React from "react";
import { Avatar, HStack, VStack, Text, Spacer } from "native-base";

export default function ClientList({ item }) {
  return (
    <>
      <HStack space={[2, 3]} justifyContent="space-between" w={"50%"} mt={2}>
        <Avatar
          size="48px"
          source={{
            uri: "",
          }}
        />
        <VStack>
          <Text color="black" bold>
            {item.name}
          </Text>
          <Text color={"red.500"}>{item.balance}</Text>
        </VStack>
        <Spacer />
        <Text fontSize="xs" color="coolGray.800" alignSelf="flex-start">
          {item.phone}
        </Text>
      </HStack>
    </>
  );
}
